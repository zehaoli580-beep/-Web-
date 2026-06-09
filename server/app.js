const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());

// 数据库连接
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB 连接成功'))
  .catch(err => console.error('MongoDB 连接失败:', err));

// 路由
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const recordRoutes = require('./routes/recordRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const messageRoutes = require('./routes/messageRoutes');
const statsRoutes = require('./routes/statsRoutes');
const configRoutes = require('./routes/configRoutes');

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/records', recordRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/messages', messageRoutes);
app.use('/api/v1/stats', statsRoutes);
app.use('/api/v1/configs', configRoutes);

// 健康检查
app.get('/api/v1/health', (req, res) => {
  res.json({ code: 200, message: 'success', data: { status: 'running' } });
});

// 404 处理
app.use((req, res) => {
  res.status(404).json({ code: 404, message: '接口不存在', data: null });
});

// 全局错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
});

app.listen(PORT, () => {
  console.log(`服务器已启动: http://localhost:${PORT}`);
});
