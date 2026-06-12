const Category = require('../models/Category');
const Book = require('../models/Book');

/**
 * 获取分类列表
 * GET /api/v1/categories
 */
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json({ code: 200, message: 'success', data: categories });
  } catch (err) {
    console.error('获取分类列表失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

/**
 * 新增分类（管理员）
 * POST /api/v1/categories
 */
exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ code: 400, message: '分类名称不能为空', data: null });
    }

    // 检查是否已存在
    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ code: 400, message: '该分类已存在', data: null });
    }

    const category = await Category.create({ name: name.trim() });
    res.status(201).json({ code: 200, message: '分类创建成功', data: category });
  } catch (err) {
    console.error('新增分类失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

/**
 * 编辑分类（管理员）
 * PUT /api/v1/categories/:id
 */
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ code: 400, message: '分类名称不能为空', data: null });
    }

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ code: 404, message: '分类不存在', data: null });
    }

    // 检查新名称是否与其他分类冲突
    const duplicate = await Category.findOne({ name: name.trim(), _id: { $ne: req.params.id } });
    if (duplicate) {
      return res.status(400).json({ code: 400, message: '该分类名称已存在', data: null });
    }

    category.name = name.trim();
    await category.save();

    res.json({ code: 200, message: '分类更新成功', data: category });
  } catch (err) {
    console.error('编辑分类失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

/**
 * 删除分类（管理员）
 * DELETE /api/v1/categories/:id
 */
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ code: 404, message: '分类不存在', data: null });
    }

    // 检查是否有图书使用该分类
    const bookCount = await Book.countDocuments({ category: category.name });
    if (bookCount > 0) {
      return res.status(400).json({
        code: 400,
        message: `该分类下有 ${bookCount} 本图书，请先移除或更改这些图书的分类后再删除`,
        data: null
      });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ code: 200, message: '分类删除成功', data: null });
  } catch (err) {
    console.error('删除分类失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};
