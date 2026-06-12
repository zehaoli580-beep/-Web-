const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const categoryController = require('../controllers/categoryController');

router.get('/', categoryController.getCategories);
router.post('/', auth, adminAuth, categoryController.createCategory);
router.put('/:id', auth, adminAuth, categoryController.updateCategory);
router.delete('/:id', auth, adminAuth, categoryController.deleteCategory);

module.exports = router;
