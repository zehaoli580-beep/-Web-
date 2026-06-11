const mongoose = require('mongoose');

// 借阅记录模型 - 存储图书借阅/归还/预约等记录
const recordSchema = new mongoose.Schema({
  // 关联用户ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // 关联图书ID
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  // 借阅日期（默认当前时间）
  borrowDate: { type: Date, default: Date.now },
  // 应归还日期
  dueDate: Date,
  // 实际归还日期
  returnDate: Date,
  // 记录状态：已借/已还/逾期/预约中/待处理
  status: { type: String, enum: ['borrowed', 'returned', 'overdue', 'reserved', 'pending'], default: 'pending' },
  // 滞纳金/罚款金额
  fine: { type: Number, default: 0 },
  // 预约序号（用于预约排队）
  reserveOrder: Number,
  // 是否已续借
  renewed: { type: Boolean, default: false }
});

module.exports = mongoose.model('Record', recordSchema);