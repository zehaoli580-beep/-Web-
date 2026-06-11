const Message = require('../models/Message');
const Book = require('../models/Book');

// 获取我的消息列表
exports.getMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const filter = { userId: req.user._id };
    const total = await Message.countDocuments(filter);
    const list = await Message.find(filter)
      .populate('relatedBookId', 'title cover')
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.json({
      code: 200,
      message: 'success',
      data: {
        list: list.map(m => ({
          id: m._id,
          type: m.type,
          title: m.title,
          content: m.content,
          isRead: m.isRead,
          relatedBookId: m.relatedBookId?._id,
          relatedBookTitle: m.relatedBookId?.title,
          createdAt: m.createdAt
        })),
        total,
        page,
        pageSize
      }
    });
  } catch (err) {
    console.error('获取消息列表失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

// 标记单条消息已读
exports.readMessage = async (req, res) => {
  try {
    const msg = await Message.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true }
    );
    if (!msg) {
      return res.status(404).json({ code: 404, message: '消息不存在', data: null });
    }
    res.json({ code: 200, message: '已标记为已读', data: null });
  } catch (err) {
    console.error('标记已读失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

// 标记全部已读
exports.readAll = async (req, res) => {
  try {
    await Message.updateMany(
      { userId: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ code: 200, message: '全部已标记为已读', data: null });
  } catch (err) {
    console.error('标记全部已读失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};

// 获取未读消息数量
exports.getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await Message.countDocuments({
      userId: req.user._id,
      isRead: false
    });
    res.json({
      code: 200,
      message: 'success',
      data: { unreadCount }
    });
  } catch (err) {
    console.error('获取未读数失败:', err);
    res.status(500).json({ code: 500, message: '服务器内部错误', data: null });
  }
};
