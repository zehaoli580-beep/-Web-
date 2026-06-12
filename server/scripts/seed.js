const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Config = require('../models/Config');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('MongoDB 已连接，开始初始化数据...');

    // 创建预设管理员
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('123456', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        name: '系统管理员',
        role: 'admin',
        college: '图书馆',
        status: 'active'
      });
      console.log('✅ 预设管理员已创建 (admin / 123456)');
    } else {
      // 如果管理员已存在，更新密码为 123456
      const hashedPassword = await bcrypt.hash('123456', 10);
      await User.updateOne({ username: 'admin' }, { password: hashedPassword });
      console.log('✅ 管理员密码已更新为 123456');
    }

    // 创建预设系统参数
    const defaultConfigs = [
      { key: 'maxBorrow', value: 5, description: '最大借阅数量' },
      { key: 'borrowDays', value: 30, description: '借阅天数' },
      { key: 'renewDays', value: 15, description: '续借天数' },
      { key: 'finePerDay', value: 0.1, description: '逾期每天罚款（元）' },
      { key: 'reserveExpireHours', value: 24, description: '预约到书后保留时间（小时）' }
    ];
    for (const cfg of defaultConfigs) {
      const exists = await Config.findOne({ key: cfg.key });
      if (!exists) {
        await Config.create(cfg);
        console.log(`✅ 配置参数已创建: ${cfg.key} = ${cfg.value}`);
      }
    }

    console.log('🎉 初始化完成！');
    process.exit(0);
  })
  .catch(err => {
    console.error('初始化失败:', err);
    process.exit(1);
  });
