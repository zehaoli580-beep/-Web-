const router = require('express').Router();
const auth = require('../middleware/auth');
const messageController = require('../controllers/messageController');

// TODO: 由组员A实现以下接口（取消注释前需确保 controller 中已实现对应函数）
// router.get('/', auth, messageController.getMessages);
// router.put('/read-all', auth, messageController.readAll);
// router.get('/unread-count', auth, messageController.getUnreadCount);
// router.put('/:id/read', auth, messageController.readMessage);

module.exports = router;
