const mongoose = require('mongoose');

// 用户模型 - 存储用户基础信息
const userSchema = new mongoose.Schema({
  // 用户名（唯一）
  username: { type: String, required: true, unique: true },
  // 密码
  password: { type: String, required: true },
  // 真实姓名
  name: { type: String, required: true },
  // 角色：学生/教师/管理员
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  // 所属学院
  college: { type: String, required: true },
  // 手机号
  phone: { type: String, default: '' },
  // 邮箱
  email: { type: String, default: '' },
  // 账号状态：启用/禁用
  status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  // 借书次数统计
  borrowCount: { type: Number, default: 0 }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('User', userSchema);