const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ code: 403, message: '无权限，仅管理员可操作', data: null });
};

module.exports = adminAuth;
