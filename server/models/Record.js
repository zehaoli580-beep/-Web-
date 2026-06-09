const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  borrowDate: { type: Date },
  dueDate: { type: Date },
  returnDate: { type: Date },
  status: { type: String, enum: ['borrowed', 'returned', 'overdue', 'reserved'], default: 'reserved' },
  renewed: { type: Boolean, default: false },
  fine: { type: Number, default: 0 },
  reserveOrder: { type: Number },
  notifiedAt: { type: Date }
}, { timestamps: true });

recordSchema.index({ userId: 1, status: 1 });
recordSchema.index({ bookId: 1, status: 1 });

module.exports = mongoose.model('Record', recordSchema);
