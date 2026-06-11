const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const statsController = require('../controllers/statsController');

// TODO: 由组员C实现以下接口（取消注释前需确保 controller 中已实现对应函数）
// router.get('/overview', auth, adminAuth, statsController.getOverview);
// router.get('/borrow-trend', auth, adminAuth, statsController.getBorrowTrend);
// router.get('/hot-books', auth, adminAuth, statsController.getHotBooks);
// router.get('/category-distribution', auth, adminAuth, statsController.getCategoryDistribution);

module.exports = router;
