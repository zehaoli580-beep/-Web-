const router = require('express').Router();
const auth = require('../middleware/auth');
const messageController = require('../controllers/messageController');

router.get('/', auth, messageController.getMessages);
router.put('/read-all', auth, messageController.readAll);
router.get('/unread-count', auth, messageController.getUnreadCount);
router.put('/:id/read', auth, messageController.readMessage);

module.exports = router;
