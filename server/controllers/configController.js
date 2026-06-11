const Config = require('../models/Config');

// 获取所有系统参数
exports.getConfigs = async (req, res) => {
  try {
    const list = await Config.find().sort({ key: 1 });
    res.json({
      code: 200,
      message: 'success',
      data: { list: list.map(c => ({ key: c.key, value: c.value, description: c.description })) }
    });
  } catch (err) {
    console.error('获取系统参数失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

// 更新系统参数
exports.updateConfig = async (req, res) => {
  try {
    const { value } = req.body;
    const config = await Config.findOneAndUpdate(
      { key: req.params.key },
      { value },
      { new: true }
    );
    if (!config) {
      return res.status(404).json({ code: 404, message: '参数不存在', data: null });
    }
    res.json({ code: 200, message: '参数已更新', data: null });
  } catch (err) {
    console.error('更新系统参数失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};
