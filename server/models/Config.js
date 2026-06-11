const mongoose = require('mongoose');

// 系统配置模型 - 存储全局配置项
const configSchema = new mongoose.Schema({
  // 配置键（唯一）
  key: { type: String, required: true, unique: true },
  // 配置值（任意类型）
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  // 配置描述
  description: { type: String, default: '' }
}, { 
  // 自动添加创建/更新时间戳
  timestamps: true 
});

module.exports = mongoose.model('Config', configSchema);