const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const userController = require('../controllers/userController');

// TODO: 由组员A实现以下接口（取消注释前需确保 controller 中已实现对应函数）
// router.post('/register', userController.register);
// router.post('/login', userController.login);
// router.get('/me', auth, userController.getMe);
// router.put('/me', auth, userController.updateMe);
// router.put('/me/password', auth, userController.changePassword);
// router.get('/me/records', auth, userController.getMyRecords);
// router.get('/', auth, adminAuth, userController.getUsers);
// router.put('/:id/status', auth, adminAuth, userController.updateUserStatus);
// router.put('/:id/reset-password', auth, adminAuth, userController.resetPassword);

module.exports = router;
