const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const configController = require('../controllers/configController');

// 4.5.1 获取所有系统参数（需管理员）
router.get('/', auth, adminAuth, configController.getConfigs);

// 4.5.2 更新系统参数（需管理员）
router.put('/:key', auth, adminAuth, configController.updateConfig);

module.exports = router;
