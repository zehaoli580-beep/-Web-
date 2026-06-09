# 《基于Web的高校图书管理网站》

三人小组课程设计项目。
技术栈：Vue 3 + Node.js (Express) + MongoDB

## 快速启动

```bash
# 安装后端依赖
cd server && npm install

# 安装前端依赖
cd ../client && npm install

# 启动 MongoDB（需先安装）
net start MongoDB

# 启动后端（server目录）
npm run dev

# 启动前端（client目录）
npm run dev
```

## 目录结构

```
library-system/
├── client/          # Vue 3 前端
├── server/          # Express 后端
└── README.md
```

## 分工

- 组员A：用户模块 + 系统管理 + 消息中心
- 组员B：图书模块 + 分类管理 + 首页
- 组员C：借阅模块 + 统计看板

详细分工见 `任务分工` 文档。
