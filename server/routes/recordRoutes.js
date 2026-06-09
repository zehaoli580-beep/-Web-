const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const recordController = require('../controllers/recordController');

// TODO: 由组员C实现以下接口（取消注释前需确保 controller 中已实现对应函数）
// router.post('/borrow', auth, recordController.borrowBook);
// router.put('/:id/return', auth, adminAuth, recordController.returnBook);
// router.put('/:id/renew', auth, recordController.renewBook);
// router.post('/reserve', auth, recordController.reserveBook);
// router.get('/', auth, adminAuth, recordController.getRecords);
// router.get('/pending-borrows', auth, adminAuth, recordController.getPendingBorrows);
// router.get('/pending-returns', auth, adminAuth, recordController.getPendingReturns);

module.exports = router;
