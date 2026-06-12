const Record = require('../models/Record');
const Book = require('../models/Book');
const User = require('../models/User');
const Config = require('../models/Config');
const Message = require('../models/Message');

// 4.3.1 借书申请
exports.borrowBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    // 1. 检查最大可借数量
    const config = await Config.findOne();
    const maxBorrow = config?.maxBorrow || 5;
    const user = await User.findById(userId);
    if (user.borrowCount >= maxBorrow) {
      return res.status(400).json({ code: 400, message: '已达到最大借阅数量', data: null });
    }

    // 2. 检查图书是否可借
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ code: 404, message: '图书不存在', data: null });
    if (book.available <= 0 || book.status !== 'available') {
      return res.status(409).json({ code: 409, message: '该图书已全部借出', data: null });
    }

    // 3. 创建借阅记录（pending状态，等待管理员确认）
    const record = await Record.create({
      userId,
      bookId,
      status: 'pending'
    });

    res.status(201).json({
      code: 201,
      message: '借书申请已提交，等待管理员确认',
      data: {
        id: record._id,
        bookTitle: book.title,
        status: 'pending'
      }
    });

  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误', error: err.message });
  }
};

// 管理员确认借书
exports.confirmBorrow = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Record.findById(id);
    if (!record) return res.status(404).json({ code: 404, message: '记录不存在', data: null });
    if (record.status !== 'pending') return res.status(400).json({ code: 400, message: '该记录不是待确认状态', data: null });

    // 检查图书和用户
    const book = await Book.findById(record.bookId);
    const user = await User.findById(record.userId);
    
    if (book.available <= 0 || book.status !== 'available') {
      return res.status(409).json({ code: 409, message: '该图书已全部借出', data: null });
    }

    // 更新图书与用户
    book.available -= 1;
    await book.save();

    user.borrowCount += 1;
    await user.save();

    // 更新记录状态
    const borrowDate = new Date();
    const dueDate = new Date(borrowDate.getTime() + 30 * 24 * 60 * 60 * 1000);
    
    record.status = 'borrowed';
    record.borrowDate = borrowDate;
    record.dueDate = dueDate;
    await record.save();

    res.status(200).json({
      code: 200,
      message: '借书确认成功',
      data: {
        id: record._id,
        bookTitle: book.title,
        borrowDate: borrowDate.toISOString(),
        dueDate: dueDate.toISOString()
      }
    });

  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误', error: err.message });
  }
};

// 4.3.2 确认归还
exports.returnBook = async (req, res) => {
  try {
    const { id } = req.params;
    const record = await Record.findById(id);
    if (!record) return res.status(404).json({ code: 404, message: '记录不存在', data: null });
    if (record.returnDate) return res.status(400).json({ code: 400, message: '已归还', data: null });

    const returnDate = new Date();
    let status = 'returned';
    let fine = 0;

    // 计算逾期
    if (returnDate > record.dueDate) {
      const days = Math.ceil((returnDate - record.dueDate) / (1000 * 60 * 60 * 24));
      const config = await Config.findOne();
      const finePerDay = config?.finePerDay || 0.1;
      fine = days * finePerDay;
    }

    // 更新记录
    record.returnDate = returnDate;
    record.status = 'returned';
    record.fine = fine;
    await record.save();

    // 恢复图书库存
    const book = await Book.findById(record.bookId);
    book.available += 1;
    await book.save();

    // 恢复用户借阅数
    const user = await User.findById(record.userId);
    if (user.borrowCount > 0) {
      user.borrowCount -= 1;
    }
    await user.save();

    // 预约通知
    const nextReserve = await Record.findOne({
      bookId: book._id,
      status: 'reserved'
    }).sort({ reserveOrder: 1 });

    if (nextReserve) {
      await Message.create({
        userId: nextReserve.userId,
        type: 'reserve_notify',
        title: '图书已可借',
        content: `您预约的《${book.title}》已归还，请尽快借阅`,
        relatedBookId: book._id,
        relatedRecordId: nextReserve._id
      });
    }

    let msg = '归还成功';
    if (fine > 0) msg = `归还成功，已逾期${Math.ceil((returnDate - record.dueDate) / (1000 * 60 * 60 * 24))}天，罚款${fine.toFixed(2)}元`;

    res.status(200).json({
      code: 200,
      message: msg,
      data: { fine, status }
    });

  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误', error: err.message });
  }
};

// 4.3.5 所有借阅记录（管理员）
exports.getRecords = async (req, res) => {
  try {
    const { status, page = 1, pageSize = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const records = await Record.find(query)
      .populate('userId', 'name')
      .populate('bookId', 'title')
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize))
      .sort({ borrowDate: -1 });

    const total = await Record.countDocuments(query);

    res.status(200).json({
      code: 200,
      data: { list: records, total, page: Number(page), pageSize: Number(pageSize) }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 4.3.6 待确认借书列表（管理员）
exports.getPendingBorrows = async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const records = await Record.find({ status: 'pending' })
      .populate('userId', 'name')
      .populate('bookId', 'title')
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize))
      .sort({ createdAt: 1 });

    const total = await Record.countDocuments({ status: 'pending' });

    res.status(200).json({
      code: 200,
      data: { list: records, total, page: Number(page), pageSize: Number(pageSize) }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 4.3.3 续借
exports.renewBook = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const record = await Record.findById(id);
    if (!record) return res.status(404).json({ code: 404, message: '记录不存在', data: null });

    // 1. 检查记录属于当前用户
    if (record.userId.toString() !== userId.toString()) {
      return res.status(403).json({ code: 403, message: '无权操作此记录', data: null });
    }

    // 2. 检查 status === "borrowed"
    if (record.status !== 'borrowed') {
      return res.status(400).json({ code: 400, message: '只有借阅中的图书可以续借', data: null });
    }

    // 3. 检查 renewed === false
    if (record.renewed) {
      return res.status(400).json({ code: 400, message: '该图书已续借过，不能再次续借', data: null });
    }

    // 4. 检查当前日期是否在 dueDate 之前（逾期不可续借）
    const now = new Date();
    if (now > record.dueDate) {
      return res.status(400).json({ code: 400, message: '图书已逾期，不可续借', data: null });
    }

    // 5. 检查该图书是否被其他人预约
    const hasReservation = await Record.findOne({
      bookId: record.bookId,
      status: 'reserved',
      userId: { $ne: userId }
    });
    if (hasReservation) {
      return res.status(409).json({ code: 409, message: '该图书已被其他人预约，不可续借', data: null });
    }

    // 6. 续借：dueDate + 15天，renewed = true
    const newDueDate = new Date(record.dueDate.getTime() + 15 * 24 * 60 * 60 * 1000);
    record.dueDate = newDueDate;
    record.renewed = true;
    await record.save();

    res.status(200).json({
      code: 200,
      message: '续借成功',
      data: {
        newDueDate: newDueDate.toISOString()
      }
    });

  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误', error: err.message });
  }
};

// 4.3.4 预约图书
exports.reserveBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    const userId = req.user._id;

    // 1. 检查该书 available === 0
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ code: 404, message: '图书不存在', data: null });
    if (book.available > 0) {
      return res.status(400).json({ code: 400, message: '该图书有可借数量，请直接借阅', data: null });
    }

    // 2. 检查该用户是否已预约过该书
    const existingReserve = await Record.findOne({
      userId,
      bookId,
      status: 'reserved'
    });
    if (existingReserve) {
      return res.status(409).json({ code: 409, message: '您已预约过该图书', data: null });
    }

    // 3. 获取当前最大 reserveOrder
    const maxReserve = await Record.findOne({ bookId, status: 'reserved' }).sort({ reserveOrder: -1 });
    const newOrder = maxReserve ? maxReserve.reserveOrder + 1 : 1;

    // 4. 创建预约记录
    const record = await Record.create({
      userId,
      bookId,
      status: 'reserved',
      reserveOrder: newOrder
    });

    res.status(201).json({
      code: 201,
      message: `预约成功，当前排队第 ${newOrder} 位`,
      data: {
        reserveOrder: newOrder
      }
    });

  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误', error: err.message });
  }
};

// 4.3.7 待确认还书列表（管理员）
exports.getPendingReturns = async (req, res) => {
  try {
    const { page = 1, pageSize = 20 } = req.query;
    const records = await Record.find({ status: { $in: ['borrowed', 'overdue'] } })
      .populate('userId', 'name')
      .populate('bookId', 'title')
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize))
      .sort({ borrowDate: 1 });

    const total = await Record.countDocuments({ status: { $in: ['borrowed', 'overdue'] } });

    res.status(200).json({
      code: 200,
      data: { list: records, total, page: Number(page), pageSize: Number(pageSize) }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 获取当前用户的借阅记录
exports.getMyRecords = async (req, res) => {
  try {
    const userId = req.user._id;
    const records = await Record.find({ userId })
      .populate('bookId', 'title')
      .sort({ borrowDate: -1 });

    res.status(200).json({
      code: 200,
      data: { list: records, total: records.length }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 获取当前用户的预约记录
exports.getMyReservations = async (req, res) => {
  try {
    const userId = req.user._id;
    const records = await Record.find({ userId, status: 'reserved' })
      .populate('bookId', 'title')
      .sort({ reserveOrder: 1 });

    res.status(200).json({
      code: 200,
      data: { list: records, total: records.length }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};