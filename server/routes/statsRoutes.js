const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const statsController = require('../controllers/statsController');

// 4.4.1 统计概览（需管理员）
router.get('/overview', auth, adminAuth, statsController.getOverview);

// 4.4.2 借阅趋势（需管理员）
router.get('/borrow-trend', auth, adminAuth, statsController.getBorrowTrend);

// 4.4.3 热门图书排行榜（需管理员）
router.get('/hot-books', auth, adminAuth, statsController.getHotBooks);

// 4.4.4 分类分布（需管理员）
router.get('/category-distribution', auth, adminAuth, statsController.getCategoryDistribution);

module.exports = router;
