const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const userController = require('../controllers/userController');

// 用户注册
router.post('/register', userController.register);

// 用户登录
router.post('/login', userController.login);

// 获取当前用户信息
router.get('/me', auth, userController.getMe);

// 更新用户信息
router.put('/me', auth, userController.updateMe);

// 修改密码
router.put('/me/password', auth, userController.changePassword);

// 获取我的借阅记录
router.get('/me/records', auth, userController.getMyRecords);

// 获取用户列表（管理员）
router.get('/', auth, adminAuth, userController.getUsers);

// 更新用户状态（管理员）
router.put('/:id/status', auth, adminAuth, userController.updateUserStatus);

// 重置密码（管理员）
router.put('/:id/reset-password', auth, adminAuth, userController.resetPassword);

module.exports = router;
