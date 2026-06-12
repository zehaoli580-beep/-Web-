<template>
  <div class="landing-page">
    <!-- Hero 全屏背景区 -->
    <section class="hero-section" id="home">
      <header class="navbar">
        <div class="nav-inner">
          <div class="nav-logo">📚 高校图书管理系统</div>
          <nav class="nav-links">
            <a href="/books" class="nav-link nav-enter">🏠 进入系统</a>
            <a href="#team" class="nav-link">👥 团队分工</a>
            <a href="#tech" class="nav-link">💻 技术介绍</a>
            <a href="/login" class="nav-link login-link">登录</a>
          </nav>
        </div>
      </header>

      <div class="hero-overlay"></div>

      <div class="hero-content">
        <h1 class="hero-title">高校图书管理系统</h1>
        <p class="hero-subtitle">便捷的图书检索 · 高效的借阅管理 · 智能的数据统计</p>
        <div class="hero-buttons">
          <a href="/books" class="btn btn-primary">🏠 进入系统</a>
          <a href="#team" class="btn btn-outline">了解更多 ↓</a>
        </div>
      </div>
    </section>

    <!-- 团队分工 -->
    <section class="section section-team" id="team">
      <div class="section-container">
        <h2 class="section-title">👥 团队分工</h2>
        <p class="section-desc">三人小组 · 七天开发周期 · 各司其职</p>

        <div class="team-grid">
          <div class="flip-card" v-for="member in teamMembers" :key="member.name">
            <div class="flip-card-inner">
              <!-- 正面 -->
              <div class="flip-card-front">
                <div class="member-avatar">{{ member.name.charAt(0) }}</div>
                <h3 class="member-name">{{ member.name }}</h3>
                <p class="member-role">{{ member.role }}</p>
              </div>
              <!-- 背面 -->
              <div class="flip-card-back">
                <h4>{{ member.name }} 负责模块</h4>
                <ul>
                  <li v-for="task in member.tasks" :key="task">{{ task }}</li>
                </ul>
                <p class="member-badge">{{ member.modules }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 技术介绍 -->
    <section class="section section-tech" id="tech">
      <div class="section-container">
        <h2 class="section-title">💻 技术介绍</h2>
        <p class="section-desc">现代化 Web 技术栈 · 全栈 JavaScript 开发</p>

        <div class="tech-grid">
          <div class="tech-card" v-for="tech in techStack" :key="tech.name">
            <div class="tech-icon">{{ tech.icon }}</div>
            <h3 class="tech-name">{{ tech.name }}</h3>
            <p class="tech-desc">{{ tech.description }}</p>
            <div class="tech-tags">
              <span class="tag" v-for="tag in tech.tags" :key="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="footer">
      <div class="footer-inner">
        <p>© 2026 高校图书管理系统 · 课程设计项目 · 三人小组共同开发</p>
        <p class="footer-tech">Vue 3 + Node.js (Express) + MongoDB · Element Plus</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
const teamMembers = [
  {
    name: '组员A',
    role: '组长 / 前端后端',
    modules: '用户模块 · 系统管理 · 消息中心',
    tasks: [
      '用户注册/登录（JWT 鉴权）',
      '个人信息管理 & 修改密码',
      '用户管理后台（禁用/重置）',
      '消息中心（已读/未读/小红点）',
      '系统参数配置管理'
    ]
  },
  {
    name: '组员B',
    role: '前端后端',
    modules: '图书模块 · 分类管理 · 首页',
    tasks: [
      '图书 CRUD & 检索（模糊+分页）',
      '图书详情 & 相关推荐',
      '热门排行榜 & 新书上架',
      '分类管理（增删改）',
      '首页 & 导航栏布局'
    ]
  },
  {
    name: '组员C',
    role: '前端后端',
    modules: '借阅模块 · 统计看板',
    tasks: [
      '借书申请 & 管理员确认',
      '确认归还 & 逾期罚款计算',
      '续借 & 预约排队',
      '还书时自动触发预约通知',
      '统计看板（ECharts 图表）'
    ]
  }
];

const techStack = [
  {
    icon: '⚡',
    name: 'Vue 3',
    description: '渐进式前端框架，使用 Composition API + Vite 构建轻量级 SPA。',
    tags: ['Composition API', 'Vite', 'Vue Router', 'Pinia']
  },
  {
    icon: '🟢',
    name: 'Node.js (Express)',
    description: '高性能后端框架，提供 RESTful API，统一 JSON 响应格式。',
    tags: ['Express', 'RESTful API', 'JWT', '中间件']
  },
  {
    icon: '🗄️',
    name: 'MongoDB',
    description: 'NoSQL 文档数据库，Mongoose ODM 驱动，快速灵活的数据持久化。',
    tags: ['Mongoose', '聚合管道', '全文索引', '关联查询']
  },
  {
    icon: '🎨',
    name: 'Element Plus',
    description: '基于 Vue 3 的企业级 UI 组件库，开箱即用的界面方案。',
    tags: ['表单', '表格', '弹窗', '响应式布局']
  }
];
</script>

<style scoped>
/* ===== 全局 ===== */
.landing-page {
  color: #333;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

/* ===== Hero 区（全屏背景） ===== */
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  background: url('/hero-bg.jpg') center center / cover no-repeat;
  display: flex;
  flex-direction: column;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.65) 0%,
    rgba(0, 0, 0, 0.35) 50%,
    rgba(0, 0, 0, 0.5) 100%
  );
  z-index: 1;
}

/* 导航栏 */
.navbar {
  position: relative;
  z-index: 10;
  padding: 16px 40px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-logo {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 8px;
}
.nav-link {
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.25s;
}
.nav-link:hover {
  background: rgba(255,255,255,0.15);
  color: #fff;
}
.nav-enter {
  background: rgba(64,158,255,0.3);
  color: #fff;
  font-weight: 600;
}
.nav-enter:hover {
  background: #409eff;
}
.login-link {
  border: 1px solid rgba(255,255,255,0.4);
  margin-left: 4px;
}
.login-link:hover {
  border-color: #fff;
  background: rgba(255,255,255,0.12);
}

/* Hero 内容 */
.hero-content {
  position: relative;
  z-index: 5;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 0 20px;
}
.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
  text-shadow: 0 2px 20px rgba(0,0,0,0.4);
}
.hero-subtitle {
  font-size: 20px;
  color: rgba(255,255,255,0.85);
  margin-bottom: 36px;
  text-shadow: 0 1px 10px rgba(0,0,0,0.3);
}
.hero-buttons {
  display: flex;
  gap: 16px;
}
.btn {
  display: inline-block;
  padding: 14px 36px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.25s;
}
.btn-primary {
  background: #409eff;
  color: #fff;
  box-shadow: 0 4px 16px rgba(64,158,255,0.4);
}
.btn-primary:hover {
  background: #66b1ff;
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(64,158,255,0.5);
}
.btn-outline {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255,255,255,0.7);
}
.btn-outline:hover {
  background: rgba(255,255,255,0.15);
  border-color: #fff;
}

/* ===== 通用 Section ===== */
.section {
  padding: 80px 20px;
}
.section-container {
  max-width: 1100px;
  margin: 0 auto;
}
.section-title {
  font-size: 32px;
  font-weight: 700;
  text-align: center;
  color: #303133;
  margin-bottom: 12px;
}
.section-desc {
  text-align: center;
  font-size: 16px;
  color: #909399;
  margin-bottom: 48px;
}

/* ===== 团队分工（翻转卡片） ===== */
.section-team {
  background: #f5f7fa;
}
.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

/* 翻转卡片容器 */
.flip-card {
  perspective: 1000px;
  height: 340px;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* 正反面统一样式 */
.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  padding: 32px 24px;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

/* 正面 */
.flip-card-front {
  background: #fff;
}
.member-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, #409eff, #337ecc);
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}
.member-name {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 6px;
}
.member-role {
  font-size: 14px;
  color: #909399;
}

/* 背面 */
.flip-card-back {
  background: linear-gradient(135deg, #409eff, #337ecc);
  color: #fff;
  transform: rotateY(180deg);
  text-align: left;
}
.flip-card-back h4 {
  font-size: 16px;
  margin-bottom: 12px;
  text-align: center;
}
.flip-card-back ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
  line-height: 2;
}
.flip-card-back li::before {
  content: '✓ ';
  opacity: 0.8;
}
.member-badge {
  margin-top: 12px;
  padding: 4px 14px;
  background: rgba(255,255,255,0.2);
  border-radius: 12px;
  font-size: 12px;
  text-align: center;
}

/* ===== 技术介绍 ===== */
.section-tech {
  background: #fff;
}
.tech-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.tech-card {
  background: #f5f7fa;
  border-radius: 12px;
  padding: 28px 20px;
  text-align: center;
  transition: transform 0.3s, box-shadow 0.3s;
  border: 1px solid #ebeef5;
}
.tech-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0,0,0,0.1);
}
.tech-icon {
  font-size: 40px;
  margin-bottom: 12px;
}
.tech-name {
  font-size: 18px;
  font-weight: 700;
  color: #303133;
  margin-bottom: 8px;
}
.tech-desc {
  font-size: 13px;
  color: #606266;
  line-height: 1.6;
  margin-bottom: 16px;
}
.tech-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
}
.tag {
  padding: 3px 10px;
  background: #ecf5ff;
  color: #409eff;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 500;
}

/* ===== 页脚 ===== */
.footer {
  background: #2c3e50;
  color: rgba(255,255,255,0.7);
  text-align: center;
  padding: 32px 20px;
  font-size: 13px;
}
.footer-inner {
  max-width: 1100px;
  margin: 0 auto;
}
.footer-tech {
  margin-top: 6px;
  font-size: 12px;
  color: rgba(255,255,255,0.45);
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .hero-title { font-size: 32px; }
  .hero-subtitle { font-size: 16px; }
  .team-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: 1fr 1fr; }
  .nav-inner { flex-direction: column; gap: 12px; }
  .nav-links { flex-wrap: wrap; justify-content: center; }
}
</style>
