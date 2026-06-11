const mongoose = require('mongoose');

// 图书模型 - 存储图书基础信息
const bookSchema = new mongoose.Schema({
  // ISBN编号（唯一）
  isbn: { type: String, required: true, unique: true },
  // 书名
  title: { type: String, required: true },
  // 作者
  author: { type: String, required: true },
  // 出版社
  publisher: { type: String, required: true },
  // 出版年份
  year: { type: Number, required: true },
  // 图书分类
  category: { type: String, required: true },
  // 总库存
  total: { type: Number, required: true },
  // 可借数量
  available: { type: Number, required: true },
  // 馆藏位置
  location: { type: String, required: true },
  // 封面图片URL
  cover: { type: String, default: '' },
  // 图书描述
  description: { type: String, default: '' },
  // 图书状态：可借/已借/移除
  status: { type: String, enum: ['available', 'borrowed', 'removed'], default: 'available' },
  // 借阅次数统计
  borrowTimes: { type: Number, default: 0 }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Book', bookSchema);