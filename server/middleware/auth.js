const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ code: 401, message: '未登录或Token不存在', data: null });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户不存在', data: null });
    }
    if (user.status === 'disabled') {
      return res.status(403).json({ code: 403, message: '账号已被禁用', data: null });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ code: 401, message: 'Token无效或已过期', data: null });
  }
};

module.exports = auth;
