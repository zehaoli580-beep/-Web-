const Book = require('../models/Book');
const Record = require('../models/Record');

/**
 * 获取图书列表（支持关键词检索、分类筛选、分页）
 * GET /api/v1/books
 */
exports.getBooks = async (req, res) => {
  try {
    const { keyword, category, page = 1, pageSize = 12 } = req.query;
    const query = { status: { $ne: 'removed' } };

    // 关键词模糊匹配：书名、作者、出版社、ISBN
    if (keyword) {
      const regex = new RegExp(keyword, 'i');
      query.$or = [
        { title: regex },
        { author: regex },
        { publisher: regex },
        { isbn: regex }
      ];
    }

    // 分类筛选
    if (category) {
      query.category = category;
    }

    const skip = (parseInt(page) - 1) * parseInt(pageSize);
    const limit = parseInt(pageSize);

    const [books, total] = await Promise.all([
      Book.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Book.countDocuments(query)
    ]);

    res.json({
      code: 200,
      message: 'success',
      data: {
        books,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          totalPages: Math.ceil(total / parseInt(pageSize))
        }
      }
    });
  } catch (err) {
    console.error('获取图书列表失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

/**
 * 获取热门图书排行榜
 * GET /api/v1/books/hot
 */
exports.getHotBooks = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const books = await Book.find({ status: { $ne: 'removed' } })
      .sort({ borrowTimes: -1 })
      .limit(parseInt(limit));

    res.json({ code: 200, message: 'success', data: books });
  } catch (err) {
    console.error('获取热门图书失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

/**
 * 获取新书上架
 * GET /api/v1/books/new
 */
exports.getNewBooks = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const books = await Book.find({ status: { $ne: 'removed' } })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({ code: 200, message: 'success', data: books });
  } catch (err) {
    console.error('获取新书上架失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

/**
 * 获取图书详情
 * GET /api/v1/books/:id
 */
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ code: 404, message: '图书不存在', data: null });
    }

    // 查询同分类或同作者的相关图书推荐（排除自身）
    const related = await Book.find({
      _id: { $ne: book._id },
      status: { $ne: 'removed' },
      $or: [
        { category: book.category },
        { author: book.author }
      ]
    }).limit(6);

    res.json({
      code: 200,
      message: 'success',
      data: { book, related }
    });
  } catch (err) {
    console.error('获取图书详情失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

/**
 * 新增图书（管理员）
 * POST /api/v1/books
 */
exports.createBook = async (req, res) => {
  try {
    const { isbn, title, author, publisher, year, category, total, location, cover, description } = req.body;

    // 检查必填字段
    if (!isbn || !title || !author || !publisher || !year || !category || !total || !location) {
      return res.status(400).json({ code: 400, message: '请填写所有必填字段', data: null });
    }

    // 检查 ISBN 是否已存在
    const existing = await Book.findOne({ isbn });
    if (existing) {
      return res.status(400).json({ code: 400, message: '该 ISBN 已存在', data: null });
    }

    const book = await Book.create({
      isbn,
      title,
      author,
      publisher,
      year: parseInt(year),
      category,
      total: parseInt(total),
      available: parseInt(total),
      location,
      cover: cover || '',
      description: description || ''
    });

    res.status(201).json({ code: 200, message: '图书添加成功', data: book });
  } catch (err) {
    console.error('新增图书失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

/**
 * 编辑图书（管理员）
 * PUT /api/v1/books/:id
 */
exports.updateBook = async (req, res) => {
  try {
    const { title, author, publisher, year, category, total, location, cover, description } = req.body;

    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ code: 404, message: '图书不存在', data: null });
    }

    if (book.status === 'removed') {
      return res.status(400).json({ code: 400, message: '已下架的图书不可编辑', data: null });
    }

    // 构建更新字段
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (publisher !== undefined) updateData.publisher = publisher;
    if (year !== undefined) updateData.year = parseInt(year);
    if (category !== undefined) updateData.category = category;
    if (location !== undefined) updateData.location = location;
    if (cover !== undefined) updateData.cover = cover;
    if (description !== undefined) updateData.description = description;

    // 馆藏数量变更时同步更新可借数量
    if (total !== undefined) {
      const diff = parseInt(total) - book.total;
      updateData.total = parseInt(total);
      updateData.available = book.available + diff;
      if (updateData.available < 0) {
        return res.status(400).json({ code: 400, message: '馆藏数量不能低于已借出数量', data: null });
      }
    }

    const updated = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });

    res.json({ code: 200, message: '图书更新成功', data: updated });
  } catch (err) {
    console.error('编辑图书失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

/**
 * 下架图书（管理员）
 * PUT /api/v1/books/:id/remove
 */
exports.removeBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ code: 404, message: '图书不存在', data: null });
    }

    if (book.status === 'removed') {
      return res.status(400).json({ code: 400, message: '该图书已下架', data: null });
    }

    // 检查是否有正在借出的记录（未还书）
    const activeRecords = await Record.countDocuments({
      bookId: book._id,
      status: { $in: ['borrowed', 'overdue'] }
    });

    if (activeRecords > 0) {
      return res.status(400).json({
        code: 400,
        message: `该图书尚有 ${activeRecords} 条未归还的借阅记录，无法下架`,
        data: null
      });
    }

    book.status = 'removed';
    book.available = 0;
    await book.save();

    res.json({ code: 200, message: '图书已下架', data: book });
  } catch (err) {
    console.error('下架图书失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};
