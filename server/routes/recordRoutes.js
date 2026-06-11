const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

// 4.3.1 借书申请（需登录）
router.post('/borrow', auth, recordController.borrowBook);

// 管理员确认借书
router.put('/:id/confirm-borrow', auth, adminAuth, recordController.confirmBorrow);

// 4.3.2 确认归还（需管理员）
router.put('/:id/return', auth, adminAuth, recordController.returnBook);

// 4.3.3 续借（需登录）
router.put('/:id/renew', auth, recordController.renewBook);

// 4.3.4 预约图书（需登录）
router.post('/reserve', auth, recordController.reserveBook);

// 4.3.5 管理员：获取所有借阅记录
router.get('/', auth, adminAuth, recordController.getRecords);

// 4.3.6 管理员：获取待确认借书列表
router.get('/pending-borrows', auth, adminAuth, recordController.getPendingBorrows);

// 4.3.7 管理员：获取待确认还书列表
router.get('/pending-returns', auth, adminAuth, recordController.getPendingReturns);

// 获取当前用户的借阅记录
router.get('/my', auth, recordController.getMyRecords);

// 获取当前用户的预约记录
router.get('/my/reservations', auth, recordController.getMyReservations);

module.exports = router;