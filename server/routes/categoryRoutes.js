const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const categoryController = require('../controllers/categoryController');

// TODO: 由组员B实现以下接口（取消注释前需确保 controller 中已实现对应函数）
// router.get('/', auth, adminAuth, categoryController.getCategories);
// router.post('/', auth, adminAuth, categoryController.createCategory);
// router.put('/:id', auth, adminAuth, categoryController.updateCategory);
// router.delete('/:id', auth, adminAuth, categoryController.deleteCategory);

module.exports = router;
