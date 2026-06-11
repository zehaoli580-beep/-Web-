const mongoose = require('mongoose');

// 消息模型 - 存储用户通知（预约提醒/逾期提醒/到期提醒）
const messageSchema = new mongoose.Schema({
  // 关联用户ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // 消息类型：预约通知/逾期提醒/到期提醒
  type: { type: String, enum: ['reserve_notify', 'overdue_remind', 'due_remind'], required: true },
  // 消息标题
  title: { type: String, required: true },
  // 消息内容
  content: { type: String, required: true },
  // 是否已读
  isRead: { type: Boolean, default: false },
  // 关联图书ID
  relatedBookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  // 关联借阅记录ID
  relatedRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Record' }
}, { 
  timestamps: true 
});

// 索引：优化按用户+未读状态的查询效率
messageSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Message', messageSchema);