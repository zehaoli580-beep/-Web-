const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const bookController = require('../controllers/bookController');

router.get('/', bookController.getBooks);
router.get('/hot', bookController.getHotBooks);
router.get('/new', bookController.getNewBooks);
router.get('/:id', bookController.getBookById);
router.post('/', auth, adminAuth, bookController.createBook);
router.put('/:id', auth, adminAuth, bookController.updateBook);
router.put('/:id/remove', auth, adminAuth, bookController.removeBook);

module.exports = router;
