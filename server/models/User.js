const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  college: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  status: { type: String, enum: ['active', 'disabled'], default: 'active' },
  borrowCount: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
