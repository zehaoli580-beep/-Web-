# 🚀 项目协作开发指南

> 本指南面向所有项目协作者，教你如何从 GitHub 拉取项目到本地，以及如何独立开发自己的模块而不干扰他人。

---

## 📦 一、从 GitHub 克隆项目到本地

### 1. 准备工作

确保你的电脑已安装以下工具：

| 工具 | 用途 | 下载地址 |
|------|------|----------|
| **Git** | 版本控制 | https://git-scm.com/downloads |
| **Node.js** | 运行前后端项目 | https://nodejs.org/ (推荐 LTS 版) |
| **VS Code** | 代码编辑器 | https://code.visualstudio.com/ |

安装完成后，打开终端（CMD / PowerShell / Git Bash），先设置你的 Git 身份信息（只需第一次）：

```bash
git config --global user.name "你的名字"
git config --global user.email "你绑定了 GitHub 的邮箱"
```

> 如果之前设过，可以跳过这一步。

### 2. 克隆仓库

打开终端，进入你想存放项目的文件夹（比如 `D:/projects/`），然后执行：

```bash
git clone https://github.com/zehaoli580-beep/-Web-.git library-management-system
```

> 最后的 `library-management-system` 是本地文件夹名称，你可以改成自己喜欢的名字。

等待下载完成后，进入项目目录：

```bash
cd library-management-system
```

### 3. 安装依赖

该项目分为 `client`（前端）和 `server`（后端）两部分，需要分别安装依赖。

**安装后端依赖：**

```bash
cd server
npm install
cd ..
```

**安装前端依赖：**

```bash
cd client
npm install
cd ..
```

### 4. 启动项目（验证环境）

**启动后端（终端 1）：**

```bash
cd server
npm start
```

后端默认运行在 `http://localhost:3000`。

**启动前端（终端 2）：**

```bash
cd client
npm run dev
```

前端默认运行在 `http://localhost:5173`。

> 两个终端都要开着，前端依赖后端 API。

---

## 🌿 二、分支开发 —— 互不干扰的核心

多人协作的最大忌讳是 **直接在 main 分支上开发**。我们使用 Git Flow 的思路，每个人在自己的分支上工作。

### 1. 分支命名规则

为你的模块创建一个独立分支，命名规则：

```
模块名-你的名字
```

例如：

| 你负责的模块 | 分支名示例 |
|-------------|-----------|
| 图书管理 | `book-张三` |
| 用户管理 | `user-李四` |
| 分类管理 | `category-王五` |
| 借阅记录 | `record-赵六` |
| 系统配置 | `config-孙七` |

### 2. 创建并切换到你的分支

```bash
# 创建新分支（基于最新的 main）
git checkout -b 你的分支名

# 例如：创建图书管理模块的分支
git checkout -b book-张三
```

> 这条命令会基于当前所在的分支（main）创建一个新分支，并切换过去。

### 3. 查看你在哪个分支

```bash
git branch
```

带 `*` 号的就是当前所在分支。

---

## 💻 三、日常开发流程

### 1. 开始编码之前，先拉取最新的 main

即使你在自己的分支上，也要确保你的代码基于最新的 main，避免未来合并冲突：

```bash
# 先切回 main，拉取最新
git checkout main
git pull origin main

# 再切回你的分支，把最新的 main 合并进来
git checkout 你的分支名
git merge main
```

> **养成习惯：** 每天开始写代码前，先执行这一步。

### 2. 在分支上开发

现在可以放心地修改代码了。所有改动都在你的分支上，不影响 main 分支，不影响其他人。

```bash
# 查看你改了哪些文件
git status

# 查看具体改了什么内容
git diff
```

### 3. 提交你的代码（频繁提交，不要攒一波大的）

```bash
# 添加你要提交的文件（可以用 . 添加所有改动）
git add 文件名1 文件名2

# 或者添加所有改动
git add .

# 提交到本地仓库
git commit -m "简短清晰地描述你做了什么"
```

**提交信息规范：**

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加图书搜索功能` |
| `fix` | 修复 bug | `fix: 修复分类列表分页错误` |
| `refactor` | 重构 | `refactor: 优化图书查询逻辑` |
| `style` | 样式调整 | `style: 调整导航栏布局` |
| `docs` | 文档 | `docs: 更新 API 文档` |

### 4. 推送你的分支到 GitHub

```bash
# 第一次推送（需要关联远程分支）
git push -u origin 你的分支名

# 之后推送只需要
git push
```

> 推送到 GitHub 后，其他人可以看到你的分支，但无法修改它，互不干扰。

---

## 🔀 四、当你完成一个模块功能后 —— 发起 Pull Request

你的模块开发完成后，不要直接往 main 合并，而是通过 **Pull Request (PR)** 请求合并。

### 在 GitHub 上操作：

1. 打开仓库页面：https://github.com/zehaoli580-beep/-Web-
2. 点击顶部导航的 **Pull Requests** → 绿色按钮 **New Pull Request**
3. **base:** 选择 `main`，**compare:** 选择你的分支（如 `book-张三`）
4. 填写标题和描述，说明你做了什么
5. 点击 **Create Pull Request**

### PR 描述模板：

```markdown
## 变更内容
- 实现了图书列表的分页展示
- 添加了图书搜索功能
- 修复了分类筛选的一个 bug

## 测试说明
- 启动前后端后，访问图书管理页面
- 输入关键词搜索，观察结果是否正确
- 切换页码，确认分页正常

## 相关模块
- client/src/api/book.js
- server/controllers/bookController.js
```

### 等待审核：

- 项目负责人或其他协作者会 review 你的代码
- 如果有问题，会在 PR 中留言
- 你可以在本地修改后再次推送，PR 会自动更新
- 通过后，由负责人在 GitHub 上点击 **Merge Pull Request**，代码就合并到 main 了

---

## 🚨 五、常见问题及解决办法

### ❌ 问题 1：推送到 GitHub 时提示认证失败

**原因：** GitHub 不再支持用密码认证。

**解决办法：** 使用 Personal Access Token（个人访问令牌）

1. 登录 GitHub，点击右上角头像 → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)**
2. 点击 **Generate new token (classic)**
3. 勾选 `repo` 权限，生成 token
4. 复制 token，推送时密码输入这个 token 即可

> 或者配置 SSH 密钥（推荐，一劳永逸），但步骤稍多，需要的话找项目负责人帮忙。

### ❌ 问题 2：合并冲突（Merge Conflict）

**什么时候会出现：** 你和别人改了同一个文件的同一块代码。

**解决方法：**

```bash
# 切到 main 拉取最新
git checkout main
git pull origin main

# 切回分支，合并 main
git checkout 你的分支名
git merge main
```

如果出现冲突，Git 会提示哪些文件冲突。打开这些文件，你会看到：

```
<<<<<<< HEAD
你的代码
=======
别人的代码
>>>>>>> main
```

**手动解决：** 和对方商量保留哪段，或者两段都保留。删掉 `<<<<<<<`、`=======`、`>>>>>>>` 标记。

解决后：

```bash
git add 解决完的文件名
git commit -m "解决与 main 的合并冲突"
```

### ❌ 问题 3：不小心在 main 上改了代码

```bash
# 先把改动暂存起来
git stash

# 切到你的分支
git checkout 你的分支名

# 恢复改动
git stash pop
```

### ❌ 问题 4：想放弃今天的全部改动

```bash
# 放弃未提交的改动（谨慎！不可恢复）
git checkout -- .
```

---

## 📋 六、最佳实践备忘录

| 序号 | 建议 |
|:---:|------|
| 1️⃣ | **每天开始工作前** `git checkout main && git pull && git checkout 你的分支 && git merge main` |
| 2️⃣ | **小步提交**，每个提交只做一件事，描述清晰 |
| 3️⃣ | **不要提交无关文件**（如 `node_modules/`、`.env` 等，已在 `.gitignore` 中忽略） |
| 4️⃣ | **推送前先拉取合并**，减少冲突 |
| 5️⃣ | **完成一个功能就提 PR**，不要攒了一堆功能再一次性合并 |
| 6️⃣ | PR 的 **代码量不宜太大**，200 行左右最合适，便于 review |
| 7️⃣ | **遇到问题及时沟通**，在群里问一声，可能别人也遇到了 |

---

## 🎯 总结：一张图记住流程

```
克隆项目 → 创建自己分支 → 每天拉取最新 main → 在分支上开发
    ↓                                            ↓
   git clone                              git add + git commit
    ↓                                            ↓
   npm install                            git push（推送到 GitHub）
    ↓                                            ↓
   git checkout -b 分支名                   发起 Pull Request → 合并到 main
```

**核心思想：** 你的分支是你的私人工作区，随便改；main 是公共的，必须通过 PR 合并。各改各的，互不干扰。

---

> 如果有任何问题，随时在群里问，或在 GitHub 仓库的 Issues 中提出！
