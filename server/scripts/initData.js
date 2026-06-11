const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Book = require('../models/Book');
const Record = require('../models/Record');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('MongoDB 连接成功');
  initData();
})
.catch(err => {
  console.error('MongoDB 连接失败:', err);
  process.exit(1);
});

async function initData() {
  try {
    const hashedPassword = await bcrypt.hash('123456', 10);

    await User.deleteMany({});
    await Book.deleteMany({});
    await Record.deleteMany({});
    console.log('已清空现有数据');

    const users = await User.create([
      {
        name: '管理员',
        username: 'admin',
        password: hashedPassword,
        email: 'admin@example.com',
        role: 'admin',
        college: '图书馆',
        phone: '13800138000'
      },
      {
        name: '张三',
        username: 'zhangsan',
        password: hashedPassword,
        email: 'zhangsan@example.com',
        role: 'student',
        college: '计算机学院',
        phone: '13800138001'
      },
      {
        name: '李四',
        username: 'lisi',
        password: hashedPassword,
        email: 'lisi@example.com',
        role: 'teacher',
        college: '数学学院',
        phone: '13800138002'
      },
      {
        name: '王五',
        username: 'wangwu',
        password: hashedPassword,
        email: 'wangwu@example.com',
        role: 'student',
        college: '物理学院',
        phone: '13800138003'
      },
      {
        name: '赵六',
        username: 'zhaoliu',
        password: hashedPassword,
        email: 'zhaoliu@example.com',
        role: 'student',
        college: '化学学院',
        phone: '13800138004'
      }
    ]);
    console.log('已创建用户数据:', users.length);

    const books = await Book.create([
      {
        isbn: '978-7-111-53517-9',
        title: 'JavaScript高级程序设计',
        author: 'Nicholas C. Zakas',
        publisher: '人民邮电出版社',
        year: 2020,
        category: '计算机',
        location: 'A区-1排-001',
        total: 5,
        available: 3
      },
      {
        isbn: '978-7-5192-7544-2',
        title: 'Vue.js设计与实现',
        author: '霍春阳',
        publisher: '人民邮电出版社',
        year: 2022,
        category: '计算机',
        location: 'A区-1排-002',
        total: 5,
        available: 2
      },
      {
        isbn: '978-7-115-42857-7',
        title: 'Python编程：从入门到实践',
        author: 'Eric Matthes',
        publisher: '人民邮电出版社',
        year: 2020,
        category: '计算机',
        location: 'A区-2排-001',
        total: 4,
        available: 3
      },
      {
        isbn: '978-7-111-40701-0',
        title: '深入理解计算机系统',
        author: 'Randal E. Bryant',
        publisher: '机械工业出版社',
        year: 2016,
        category: '计算机',
        location: 'A区-2排-002',
        total: 3,
        available: 1
      },
      {
        isbn: '978-7-5086-9776-8',
        title: '活着',
        author: '余华',
        publisher: '作家出版社',
        year: 2012,
        category: '文学',
        location: 'B区-1排-001',
        total: 10,
        available: 8
      },
      {
        isbn: '978-7-02-014174-7',
        title: '三体',
        author: '刘慈欣',
        publisher: '人民文学出版社',
        year: 2008,
        category: '科幻',
        location: 'B区-2排-001',
        total: 5,
        available: 0
      },
      {
        isbn: '978-7-5327-8224-9',
        title: '百年孤独',
        author: '加西亚·马尔克斯',
        publisher: '上海文艺出版社',
        year: 2011,
        category: '文学',
        location: 'B区-1排-002',
        total: 8,
        available: 6
      },
      {
        isbn: '978-7-5442-9783-5',
        title: '白夜行',
        author: '东野圭吾',
        publisher: '南海出版公司',
        year: 2017,
        category: '文学',
        location: 'B区-3排-001',
        total: 7,
        available: 6
      }
    ]);
    console.log('已创建图书数据:', books.length);

    const now = new Date();
    const fifteenDaysAgo = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    const records = await Record.create([
      {
        userId: users[1]._id,
        bookId: books[0]._id,
        borrowDate: fifteenDaysAgo,
        dueDate: sevenDaysLater,
        status: 'borrowed',
        renewed: false
      },
      {
        userId: users[1]._id,
        bookId: books[2]._id,
        borrowDate: thirtyDaysAgo,
        dueDate: fifteenDaysAgo,
        status: 'overdue',
        renewed: true,
        fine: 7.5
      },
      {
        userId: users[2]._id,
        bookId: books[1]._id,
        borrowDate: fifteenDaysAgo,
        dueDate: sevenDaysLater,
        status: 'borrowed',
        renewed: false
      },
      {
        userId: users[2]._id,
        bookId: books[4]._id,
        borrowDate: threeDaysAgo,
        dueDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
        status: 'borrowed',
        renewed: false
      },
      {
        userId: users[3]._id,
        bookId: books[3]._id,
        borrowDate: thirtyDaysAgo,
        dueDate: fifteenDaysAgo,
        status: 'overdue',
        renewed: false,
        fine: 15
      },
      {
        userId: users[1]._id,
        bookId: books[4]._id,
        borrowDate: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),
        returnDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        status: 'returned',
        renewed: false
      },
      {
        userId: users[2]._id,
        bookId: books[6]._id,
        borrowDate: new Date(now.getTime() - 40 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000),
        returnDate: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        status: 'returned',
        renewed: false,
        fine: 2.5
      },
      {
        userId: users[4]._id,
        bookId: books[0]._id,
        borrowDate: now,
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending',
        renewed: false
      },
      {
        userId: users[4]._id,
        bookId: books[7]._id,
        borrowDate: now,
        dueDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending',
        renewed: false
      },
      {
        userId: users[1]._id,
        bookId: books[5]._id,
        borrowDate: now,
        dueDate: null,
        status: 'reserved',
        reserveOrder: 1,
        renewed: false
      },
      {
        userId: users[3]._id,
        bookId: books[5]._id,
        borrowDate: now,
        dueDate: null,
        status: 'reserved',
        reserveOrder: 2,
        renewed: false
      }
    ]);
    console.log('已创建借阅记录数据:', records.length);

    console.log('初始化数据完成！');
    console.log('');
    console.log('可用账户:');
    console.log('用户名: admin, 密码: 123456 (管理员)');
    console.log('用户名: zhangsan, 密码: 123456 (学生)');
    console.log('用户名: lisi, 密码: 123456 (教师)');
    console.log('用户名: wangwu, 密码: 123456 (学生)');
    console.log('用户名: zhaoliu, 密码: 123456 (学生)');
    process.exit(0);

  } catch (err) {
    console.error('初始化数据失败:', err);
    process.exit(1);
  }
}
