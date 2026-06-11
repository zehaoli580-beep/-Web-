const mongoose = require('mongoose');

// 分类模型 - 存储图书分类（独立的分类表）
const categorySchema = new mongoose.Schema({
  // 分类名称（唯一）
  name: { type: String, required: true, unique: true }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Category', categorySchema);