# 《基于Web的高校图书管理网站》—— 项目骨架使用说明书

> 本文档面向三位组员，说明项目骨架的结构、启动方式和开发规范。
> 技术栈：Vue 3 + Node.js (Express) + MongoDB


## 一、这个骨架是什么

这是一个**已经搭好的项目框架**，包含：

- **完整目录结构** —— 前端（client/）和后端（server/）都分好了
- **公共代码** —— JWT 鉴权中间件、axios 封装、Pinia 状态管理、Vite 代理配置等已完成
- **数据库模型** —— 6 个 Mongoose 模型已写好，直接使用
- **空文件占位** —— 路由（routes/）和控制器（controllers/）以及前端 API 文件都已创建，内含 TODO 注释，组员只需按注释实现对应函数


## 二、环境准备

### 2.1 必须安装的软件

| 软件 | 版本要求 | 验证命令 |
|:----|:--------:|:---------|
| **Node.js** | **v24.15.0** | `node -v` |
| **npm** | **11.12.1** | `npm -v` |
| **MongoDB** | **8.3.2** | `mongod --version` |
| **Git** | 最新版 | `git --version` |
| **VS Code** | 最新版 | — |

> ⚠️ Node.js 和 MongoDB 版本统一，不然可能出现兼容问题。

### 2.2 VS Code 推荐插件

| 插件名 | 用途 |
|:------|:------|
| **Vue - Official** | Vue 3 语法提示 |
| **ESLint** | 代码检查 |
| **Prettier** | 代码格式化 |


## 三、克隆与启动

### 3.1 第一次拉取项目

```bash
git clone https://github.com/你的用户名/library-management-system.git
cd library-management-system
```

### 3.2 安装依赖

```bash
# 安装后端依赖
cd server
npm install

# 安装前端依赖
cd ../client
npm install
```

### 3.3 启动项目（需要开三个终端窗口）

**终端 1 —— 启动 MongoDB**（只需确保在运行，不一定要在终端里）

如果 MongoDB 已注册为 Windows 服务：
```bash
net start MongoDB
```

或者直接在 Windows 服务管理器（services.msc）中手动启动 MongoDB 服务。

**终端 2 —— 启动后端**

```bash
cd server
npm run dev
```

看到 `服务器已启动: http://localhost:3000` 即成功。

**终端 3 —— 启动前端**

```bash
cd client
npm run dev
```

看到 `http://localhost:5173` 即成功。

打开浏览器访问 `http://localhost:5173/`，会看到一个浅灰色背景的空白页面，说明项目已跑通。

> 🔑 **管理员账号**：`admin / admin123`（跑 `npm run seed` 初始化后可用）
> 注意：这个 seed 数据组长已经在初始化时跑过了，clone 后不需要再跑。


## 四、项目目录结构详解

```
library-management-system/
│
├── .gitignore                # Git 忽略规则（已配置好）
├── README.md                 # 本说明书
│
├── server/                   # 🔵 后端
│   ├── app.js                # Express 入口，已配置好所有路由挂载
│   ├── .env                  # 环境变量（MongoDB连接、JWT密钥）
│   ├── package.json          # 后端依赖清单
│   │
│   ├── models/               # 📌 数据模型（已写好，直接使用）
│   │   ├── User.js           #   用户模型
│   │   ├── Book.js           #   图书模型
│   │   ├── Record.js         #   借阅记录模型
│   │   ├── Message.js        #   消息模型
│   │   ├── Category.js       #   分类模型
│   │   └── Config.js         #   系统参数模型
│   │
│   ├── middleware/            # 📌 中间件（已写好，直接使用）
│   │   ├── auth.js           #   JWT 登录鉴权
│   │   └── adminAuth.js      #   管理员权限校验
│   │
│   ├── routes/               # 🟢 路由文件（有TODO注释，组员填入）
│   │   ├── userRoutes.js     #   组员A：用户模块接口路由
│   │   ├── bookRoutes.js     #   组员B：图书模块接口路由
│   │   ├── recordRoutes.js   #   组员C：借阅模块接口路由
│   │   ├── categoryRoutes.js #   组员B：分类接口路由
│   │   ├── messageRoutes.js  #   组员A：消息接口路由
│   │   ├── statsRoutes.js    #   组员C：统计接口路由
│   │   └── configRoutes.js   #   组员A：系统参数接口路由
│   │
│   ├── controllers/          # 🟢 控制器（有TODO注释，组员填入）
│   │   ├── userController.js      # 组员A
│   │   ├── bookController.js      # 组员B
│   │   ├── recordController.js    # 组员C
│   │   ├── categoryController.js  # 组员B
│   │   ├── messageController.js   # 组员A
│   │   ├── statsController.js     # 组员C
│   │   └── configController.js    # 组员A
│   │
│   └── scripts/
│       └── seed.js           # 管理员 + 系统参数初始化脚本
│
├── client/                   # 🔵 前端
│   ├── index.html            # 入口 HTML
│   ├── vite.config.js        # Vite 配置（已配好 API 代理）
│   ├── package.json          # 前端依赖清单
│   │
│   └── src/
│       ├── main.js           # Vue 入口（已引入 Element Plus）
│       ├── App.vue           # 根组件
│       ├── style.css         # 全局样式
│       │
│       ├── utils/
│       │   └── request.js    # 📌 axios 封装（已配好 Token 拦截器）
│       │
│       ├── store/
│       │   └── user.js       # 📌 Pinia 用户状态管理（已写好）
│       │
│       ├── router/
│       │   └── index.js      # 🟢 路由配置（有TODO注释，三人加自己的页面路由）
│       │
│       ├── api/              # 🟢 API 请求函数（有TODO注释，组员填入）
│       │   ├── user.js       #   组员A
│       │   ├── book.js       #   组员B
│       │   ├── record.js     #   组员C
│       │   ├── category.js   #   组员A
│       │   ├── message.js    #   组员A
│       │   ├── stats.js      #   组员C
│       │   └── config.js     #   组员A
│       │
│       └── views/            # 🟢 页面组件（空文件夹，组员自己创建页面）
│           ├── user/         #   组员A
│           ├── book/         #   组员B
│           ├── record/       #   组员C
│           └── message/      #   组员A
│
└── 项目需求分析文件夹/         # 文档（不在代码仓库内，单独存在桌面）
```


## 五、颜色标记说明

| 颜色 | 含义 | 说明 |
|:----|:-----|:------|
| 🔵 **蓝色** | **已写好，直接使用** | 组长已配置完，不要修改 |
| 📌 **标记** | **已写好，可调用** | 其他组员可以直接 require/import 使用 |
| 🟢 **绿色** | **需要组员填写** | 空文件，按 TODO 注释实现业务逻辑 |


## 六、各组员开发指南

### 6.1 组员A —— 用户模块 + 系统管理 + 消息中心

| 需要填写的文件 | 说明 |
|:--------------|:------|
| `server/controllers/userController.js` | 实现注册、登录、个人信息、用户管理等接口逻辑 |
| `server/routes/userRoutes.js` | 去掉 TODO 注释，引入 controller 并绑定路由 |
| `server/controllers/messageController.js` | 实现消息列表、标记已读、未读数等接口逻辑 |
| `server/routes/messageRoutes.js` | 去掉 TODO 注释，引入 controller 并绑定路由 |
| `server/controllers/configController.js` | 实现系统参数查询和更新接口逻辑 |
| `server/routes/configRoutes.js` | 去掉 TODO 注释，引入 controller 并绑定路由 |
| `client/src/api/user.js` | 写前端调后端接口的请求函数 |
| `client/src/api/message.js` | 写消息相关请求函数 |
| `client/src/api/category.js` | 写分类相关请求函数 |
| `client/src/api/config.js` | 写系统参数请求函数 |
| `client/src/views/user/` | 创建登录页、注册页、个人中心、用户管理页 |
| `client/src/views/message/` | 创建消息列表页 |

写后端接口前的准备：

```javascript
// 在 controller 中引入模型和中间件
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
```

写前端页面前请先阅读接口文档中 4.1、4.5、4.6、4.7 节的 API 说明和字段定义。

---

### 6.2 组员B —— 图书模块 + 分类管理 + 首页

| 需要填写的文件 | 说明 |
|:--------------|:------|
| `server/controllers/bookController.js` | 实现图书 CRUD、检索、详情、排行榜等接口逻辑 |
| `server/routes/bookRoutes.js` | 去掉 TODO 注释，引入 controller 并绑定路由 |
| `server/controllers/categoryController.js` | 实现分类 CRUD 接口逻辑 |
| `server/routes/categoryRoutes.js` | 去掉 TODO 注释，引入 controller 并绑定路由 |
| `client/src/api/book.js` | 写图书相关请求函数 |
| `client/src/views/book/` | 创建首页、搜索结果页、图书详情页、图书管理页 |
| `client/src/router/index.js` | 添加首页、图书相关页面的路由配置 |

写后端接口前的准备：

```javascript
// 在 controller 中引入模型
const Book = require('../models/Book');
const Category = require('../models/Category');
```

写前端页面前请先阅读接口文档中 4.2 节的 API 说明和字段定义。

---

### 6.3 组员C —— 借阅模块 + 统计看板

| 需要填写的文件 | 说明 |
|:--------------|:------|
| `server/controllers/recordController.js` | 实现借书、还书、续借、预约、查询等接口逻辑 |
| `server/routes/recordRoutes.js` | 去掉 TODO 注释，引入 controller 并绑定路由 |
| `server/controllers/statsController.js` | 实现统计概览、借阅趋势、排行榜等接口逻辑 |
| `server/routes/statsRoutes.js` | 去掉 TODO 注释，引入 controller 并绑定路由 |
| `client/src/api/record.js` | 写借阅相关请求函数 |
| `client/src/api/stats.js` | 写统计相关请求函数 |
| `client/src/views/record/` | 创建借阅管理后台、统计看板页 |

写后端接口前的准备：

```javascript
// 在 controller 中引入模型
const Record = require('../models/Record');
const Book = require('../models/Book');
const User = require('../models/User');
const Message = require('../models/Message');
```

写前端页面前请先阅读接口文档中 4.3、4.4 节的 API 说明和字段定义。


## 七、开发流程规范

### 7.1 每日操作流程

```bash
# 每天开始：拉取最新代码
git checkout dev
git pull origin dev

# 切换到自己的功能分支
git checkout feature/xxx-功能名

# 将 dev 的最新代码合并到自己分支
git merge dev

# 写代码... 每完成一个功能点就 commit 一次
git add .
git commit -m "feat: 完成了XX功能"

# 每天结束：推送到远程
git push origin feature/xxx-功能名
```

### 7.2 合并到 dev 分支

当一个功能完成并通过自测后：

1. 打开 GitHub → 切换到自己的分支
2. 点 **Pull Request** → 目标分支选 `dev`
3. 组长审核后合并

### 7.3 命名规范

| 项目 | 规范 | 示例 |
|:----|:-----|:------|
| 数据库字段 | camelCase | `userId`, `createdAt` |
| API 路径 | 小写+连字符 | `/api/v1/borrow-records` |
| Vue 组件 | PascalCase | `BookCard.vue` |
| JS 函数/变量 | camelCase | `getBookList()` |
| Commit 信息 | 类型: 描述 | `feat: 完成用户注册` |

### 7.4 接口调用方式

前端调后端接口时，已经配置好了代理和 Token 拦截器，所以只需：

```javascript
// 以用户登录为例
import request from '@/utils/request';
const res = await request.post('/users/login', { username, password });
// res.data 就是后端返回的数据
```

不需要手动加 `http://localhost:3000`，不需要手动带 Token，这些 `request.js` 已经处理好了。


## 八、常见问题

### 8.1 npm install 报错

- 检查 Node.js 版本：`node -v`（应是 v24.15.0）
- 删除 `node_modules` 文件夹和 `package-lock.json`，重新 `npm install`

### 8.2 后端启动报错

- 检查 MongoDB 是否在运行：打开命令行输入 `mongosh`，能连上就说明没问题
- 检查 `.env` 文件是否存在，内容是否正确
- 检查端口 3000 是否被占用

### 8.3 前端启动报错

- 检查是否在 `client/` 目录下运行的 `npm run dev`
- 检查 `node_modules` 是否已安装

### 8.4 前端调后端接口报 404

- 检查后端的路由文件是否正确引入了 controller
- 检查后端的 `app.js` 中是否挂载了该路由
- 检查前端的 API 路径是否与后端一致（不需要加 `/api/v1`，`request.js` 已配好 baseURL）

### 8.5 MongoDB 连不上

- 运行 `mongosh` 测试连接
- 如果 MongoDB 没有启动：`net start MongoDB`（管理员权限）
- 或者直接在服务管理器（services.msc）中启动 MongoDB 服务

### 8.6 代码合并冲突

- 不要慌，冲突只发生在多人修改了同一个文件的时候
- 本项目的设计已经最大程度避免了冲突（每人写自己的文件）
- 如果出现冲突，在 VS Code 中打开冲突文件，选择"保留双方更改"或手动合并
- 合并后运行测试确保功能正常


## 九、相关文档

| 文档 | 位置 | 说明 |
|:----|:-----|:------|
| 功能列表 | 项目需求分析文件夹 | 所有功能点清单 |
| 接口文档暨开发规范 | 项目需求分析文件夹 | 字段定义、API 完整说明、响应格式 |
| 任务分工 | 项目需求分析文件夹 | 每人负责的模块和时间安排 |
| 开发环境任务书 | 项目需求分析文件夹 | 软件安装指南 |
| 需求分析报告 | 项目需求分析文件夹 | 课程设计报告用 |
