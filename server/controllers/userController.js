const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Record = require('../models/Record');

// 注册
exports.register = async (req, res) => {
  try {
    const { username, password, name, role, college, phone, email } = req.body;

    // 检查必填字段
    if (!username || !password || !name || !college) {
      return res.status(400).json({ code: 400, message: '请填写必填字段（学号、密码、姓名、学院）', data: null });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ code: 409, message: '该学号/工号已注册', data: null });
    }

    // 加密密码
    const hashedPassword = bcrypt.hashSync(password, 10);

    // 创建用户
    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      role: role || 'student',
      college,
      phone: phone || '',
      email: email || ''
    });

    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    console.error('注册失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

// 登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // 检查必填字段
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '请输入学号和密码', data: null });
    }

    // 查找用户
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ code: 401, message: '账号或密码错误', data: null });
    }

    // 检查账号是否被禁用
    if (user.status === 'disabled') {
      return res.status(403).json({ code: 403, message: '该账号已被禁用，请联系管理员', data: null });
    }

    // 比对密码
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: '账号或密码错误', data: null });
    }

    // 签发 Token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.json({
      code: 200,
      message: '登录成功',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          name: user.name,
          role: user.role,
          college: user.college
        }
      }
    });
  } catch (err) {
    console.error('登录失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

// 获取当前用户信息
exports.getMe = async (req, res) => {
  try {
    const user = req.user;
    res.json({
      code: 200,
      message: 'success',
      data: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        college: user.college,
        phone: user.phone,
        email: user.email,
        status: user.status,
        borrowCount: user.borrowCount,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    console.error('获取用户信息失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

// 修改个人信息
exports.updateMe = async (req, res) => {
  try {
    const { phone, email } = req.body;
    const updateData = {};
    if (phone !== undefined) updateData.phone = phone;
    if (email !== undefined) updateData.email = email;

    await User.findByIdAndUpdate(req.user._id, updateData);
    res.json({ code: 200, message: '修改成功', data: null });
  } catch (err) {
    console.error('修改个人信息失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

// 修改密码
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res.status(400).json({ code: 400, message: '请填写旧密码和新密码', data: null });
    }

    const user = await User.findById(req.user._id);
    const isMatch = bcrypt.compareSync(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ code: 400, message: '旧密码错误', data: null });
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
    res.json({ code: 200, message: '密码修改成功', data: null });
  } catch (err) {
    console.error('修改密码失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

// 获取我的借阅记录
exports.getMyRecords = async (req, res) => {
  try {
    const { status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    const total = await Record.countDocuments(filter);
    const records = await Record.find(filter)
      .populate('bookId', 'title cover')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    const list = records.map(r => ({
      id: r._id,
      bookId: r.bookId?._id,
      bookTitle: r.bookId?.title || '未知图书',
      bookCover: r.bookId?.cover || '',
      borrowDate: r.borrowDate,
      dueDate: r.dueDate,
      returnDate: r.returnDate,
      status: r.status,
      renewed: r.renewed,
      fine: r.fine
    }));

    res.json({
      code: 200,
      message: 'success',
      data: { list, total, page, pageSize }
    });
  } catch (err) {
    console.error('获取借阅记录失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

// 管理员：获取用户列表
exports.getUsers = async (req, res) => {
  try {
    const { keyword, status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const filter = {};
    if (status) filter.status = status;
    if (keyword) {
      filter.$or = [
        { username: { $regex: keyword, $options: 'i' } },
        { name: { $regex: keyword, $options: 'i' } }
      ];
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      code: 200,
      message: 'success',
      data: { list: users, total, page, pageSize }
    });
  } catch (err) {
    console.error('获取用户列表失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

// 管理员：修改用户状态
exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['active', 'disabled'].includes(status)) {
      return res.status(400).json({ code: 400, message: '状态值无效', data: null });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { status });
    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在', data: null });
    }
    res.json({ code: 200, message: '用户状态已更新', data: null });
  } catch (err) {
    console.error('更新用户状态失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

// 管理员：重置用户密码
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ code: 400, message: '密码长度不能少于6位', data: null });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ code: 404, message: '用户不存在', data: null });
    }

    user.password = bcrypt.hashSync(newPassword, 10);
    await user.save();
    res.json({ code: 200, message: '密码已重置', data: null });
  } catch (err) {
    console.error('重置密码失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};
