const Config = require('../models/Config');

// 4.5.1 获取所有系统参数（需管理员）
exports.getConfigs = async (req, res) => {
  try {
    const configs = await Config.find({}, { __v: 0 });
    
    const result = configs.map(config => ({
      key: config.key,
      value: config.value,
      description: config.description
    }));

    res.status(200).json({
      code: 200,
      message: 'success',
      data: {
        list: result
      }
    });
  } catch (err) {
    console.error('获取系统参数错误:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 4.5.2 更新系统参数（需管理员）
exports.updateConfig = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const config = await Config.findOne({ key });
    if (!config) {
      return res.status(404).json({ code: 404, message: '参数不存在', data: null });
    }

    config.value = value;
    await config.save();

    res.status(200).json({
      code: 200,
      message: '参数已更新',
      data: null
    });
  } catch (err) {
    console.error('更新系统参数错误:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};
