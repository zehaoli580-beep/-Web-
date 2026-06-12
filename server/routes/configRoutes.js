const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const configController = require('../controllers/configController');

router.get('/', auth, adminAuth, configController.getConfigs);
router.put('/:key', auth, adminAuth, configController.updateConfig);

module.exports = router;
