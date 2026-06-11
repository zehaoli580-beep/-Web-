const User = require('../models/User');
const Record = require('../models/Record');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 用户登录
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '请输入用户名和密码', data: null });
    }
    
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误', data: null });
    }
    
    if (user.status !== 'active') {
      return res.status(403).json({ code: 403, message: '账号已被禁用', data: null });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误', data: null });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    res.status(200).json({
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
    res.status(500).json({ code: 500, message: '服务器错误', error: err.message });
  }
};

// 获取当前用户信息
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({
      code: 200,
      message: 'success',
      data: user
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 用户注册
exports.register = async (req, res) => {
  try {
    const { username, password, name, college, phone, email } = req.body;
    
    const existing = await User.findOne({ username });
    if (existing) {
      return res.status(409).json({ code: 409, message: '用户名已存在', data: null });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      name,
      college,
      phone: phone || '',
      email: email || ''
    });
    
    res.status(201).json({
      code: 201,
      message: '注册成功',
      data: { id: user._id, username: user.username, name: user.name }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 更新用户信息
exports.updateMe = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, email },
      { new: true }
    ).select('-password');
    
    res.status(200).json({
      code: 200,
      message: '更新成功',
      data: user
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 修改密码
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ code: 400, message: '原密码错误', data: null });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.status(200).json({ code: 200, message: '密码修改成功', data: null });
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 获取我的借阅记录
exports.getMyRecords = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, status } = req.query;
    const query = { userId: req.user._id };
    if (status) query.status = status;
    
    const records = await Record.find(query)
      .populate('bookId', 'title author')
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

// 获取用户列表（管理员）
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, pageSize = 20, role, status } = req.query;
    const query = {};
    if (role) query.role = role;
    if (status) query.status = status;
    
    const users = await User.find(query)
      .select('-password')
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));
    
    const total = await User.countDocuments(query);
    
    res.status(200).json({
      code: 200,
      data: { list: users, total, page: Number(page), pageSize: Number(pageSize) }
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 更新用户状态
exports.updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const user = await User.findByIdAndUpdate(id, { status }, { new: true }).select('-password');
    
    res.status(200).json({
      code: 200,
      message: '状态更新成功',
      data: user
    });
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 重置密码
exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;
    
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(id, { password: hashedPassword });
    
    res.status(200).json({ code: 200, message: '密码重置成功', data: null });
  } catch (err) {
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};
