const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  isbn: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  author: { type: String, required: true },
  publisher: { type: String, required: true },
  year: { type: Number, required: true },
  category: { type: String, required: true },
  total: { type: Number, required: true },
  available: { type: Number, required: true },
  location: { type: String, required: true },
  cover: { type: String, default: '' },
  description: { type: String, default: '' },
  status: { type: String, enum: ['available', 'borrowed', 'removed'], default: 'available' },
  borrowTimes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
