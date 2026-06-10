const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

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
