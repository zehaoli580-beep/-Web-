const Book = require('../models/Book');
const Record = require('../models/Record');
const User = require('../models/User');
const Category = require('../models/Category');

// 4.4.1 统计概览（需管理员）
exports.getOverview = async (req, res) => {
  try {
    // 图书总数
    const totalBooks = await Book.countDocuments();
    
    // 可借阅图书数
    const totalAvailable = await Book.aggregate([
      { $group: { _id: null, total: { $sum: '$available' } } }
    ]);
    
    // 已借出图书数
    const totalBorrowed = await Book.aggregate([
      { $group: { _id: null, total: { $sum: { $subtract: ['$total', '$available'] } } } }
    ]);
    
    // 用户总数
    const totalUsers = await User.countDocuments();
    
    // 活跃借阅者数（最近30天有借阅记录的用户）
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const activeBorrowers = await Record.distinct('userId', { 
      borrowDate: { $gte: thirtyDaysAgo } 
    }).then(arr => arr.length);
    
    // 逾期数量
    const overdueCount = await Record.countDocuments({ status: 'overdue' });
    
    // 总罚款金额
    const totalFineResult = await Record.aggregate([
      { $group: { _id: null, total: { $sum: { $ifNull: ['$fine', 0] } } } }
    ]);
    const totalFine = totalFineResult.length > 0 ? totalFineResult[0].total : 0;

    res.status(200).json({
      code: 200,
      message: 'success',
      data: {
        totalBooks: totalBooks || 0,
        totalAvailable: totalAvailable.length > 0 ? totalAvailable[0].total : 0,
        totalBorrowed: totalBorrowed.length > 0 ? totalBorrowed[0].total : 0,
        totalUsers: totalUsers || 0,
        activeBorrowers: activeBorrowers || 0,
        overdueCount: overdueCount || 0,
        totalFine: parseFloat(totalFine.toFixed(2))
      }
    });
  } catch (err) {
    console.error('统计概览错误:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 4.4.2 借阅趋势（需管理员）
exports.getBorrowTrend = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const daysNum = parseInt(days);
    
    const result = await Record.aggregate([
      {
        $match: {
          status: { $in: ['borrowed', 'returned', 'overdue'] },
          borrowDate: { $gte: new Date(Date.now() - daysNum * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$borrowDate' },
            month: { $month: '$borrowDate' },
            day: { $dayOfMonth: '$borrowDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      },
      {
        $project: {
          _id: 0,
          date: {
            $dateToString: { format: '%Y-%m-%d', date: {
              $dateFromParts: {
                year: '$_id.year',
                month: '$_id.month',
                day: '$_id.day'
              }
            }}
          },
          count: 1
        }
      }
    ]);

    res.status(200).json({
      code: 200,
      message: 'success',
      data: {
        list: result
      }
    });
  } catch (err) {
    console.error('借阅趋势错误:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 4.4.3 热门图书排行榜（需管理员）
exports.getHotBooks = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const limitNum = parseInt(limit);

    const result = await Record.aggregate([
      {
        $match: {
          status: { $in: ['borrowed', 'returned', 'overdue'] }
        }
      },
      {
        $group: {
          _id: '$bookId',
          borrowTimes: { $sum: 1 }
        }
      },
      {
        $sort: { borrowTimes: -1 }
      },
      {
        $limit: limitNum
      },
      {
        $lookup: {
          from: 'books',
          localField: '_id',
          foreignField: '_id',
          as: 'book'
        }
      },
      {
        $unwind: '$book'
      },
      {
        $project: {
          _id: 0,
          bookId: '$_id',
          title: '$book.title',
          author: '$book.author',
          borrowTimes: 1
        }
      }
    ]);

    // 添加排名
    const rankedResult = result.map((item, index) => ({
      rank: index + 1,
      ...item
    }));

    res.status(200).json({
      code: 200,
      message: 'success',
      data: {
        list: rankedResult
      }
    });
  } catch (err) {
    console.error('热门图书排行榜错误:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 4.4.4 分类分布（需管理员）
exports.getCategoryDistribution = async (req, res) => {
  try {
    const result = await Book.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $project: {
          _id: 0,
          category: '$_id',
          count: 1
        }
      }
    ]);

    res.status(200).json({
      code: 200,
      message: 'success',
      data: {
        list: result
      }
    });
  } catch (err) {
    console.error('分类分布错误:', err);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};
