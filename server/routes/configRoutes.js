const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const configController = require('../controllers/configController');

// TODO: 由组员A实现以下接口（取消注释前需确保 controller 中已实现对应函数）
// router.get('/', auth, adminAuth, configController.getConfigs);
// router.put('/:key', auth, adminAuth, configController.updateConfig);

module.exports = router;
