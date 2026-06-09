const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['reserve_notify', 'overdue_remind', 'due_remind'], required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  relatedBookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
  relatedRecordId: { type: mongoose.Schema.Types.ObjectId, ref: 'Record' }
}, { timestamps: true });

messageSchema.index({ userId: 1, isRead: 1 });

module.exports = mongoose.model('Message', messageSchema);
