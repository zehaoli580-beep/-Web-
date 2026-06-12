<template>
  <div class="landing-page">
    <!-- ===== Hero 全屏背景区 ===== -->
    <section class="hero-section" id="home">
      <header
        class="navbar"
        :class="{ 'scrolled': scrolled, 'navbar-hover': navbarHover }"
        @mouseenter="navbarHover = true"
        @mouseleave="navbarHover = false"
      >
        <div class="nav-inner">
          <div class="nav-logo">📚 高校图书管理系统</div>
          <nav class="nav-links">
            <a href="#home" class="nav-link" @click.prevent="scrollTo('#home')">首页</a>
            <a href="#team" class="nav-link" @click.prevent="scrollTo('#team')">团队分工</a>
            <a href="#tech" class="nav-link" @click.prevent="scrollTo('#tech')">技术介绍</a>
            <a href="/books" class="nav-link nav-enter">进入系统</a>
          </nav>
          <div class="nav-right">
            <a href="/login" class="nav-link login-link">登录</a>
          </div>
        </div>
      </header>

      <div class="hero-overlay"></div>

      <div class="hero-content">
        <h1 class="hero-title">高校图书管理系统</h1>
        <p class="hero-subtitle">便捷的图书检索 · 高效的借阅管理 · 智能的数据统计</p>
        <div class="hero-buttons">
          <a href="/books" class="btn btn-primary">进入系统</a>
          <a href="#team" class="btn btn-outline" @click.prevent="scrollTo('#team')">了解更多 ↓</a>
        </div>
      </div>

      <!-- 底部滚动提示 -->
      <div class="scroll-hint" @click="scrollTo('#team')">
        <span>SCROLL</span>
        <div class="scroll-arrow">↓</div>
      </div>
    </section>

    <!-- ===== 团队分工 ===== -->
    <section class="section section-team" id="team">
      <!-- 装饰圆 -->
      <div class="deco-circle deco-circle-1"></div>
      <div class="deco-circle deco-circle-2"></div>
      <div class="deco-circle deco-circle-3"></div>

      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">TEAM</span>
          <h2 class="section-title">👥 团队分工</h2>
          <div class="title-line"></div>
          <p class="section-desc">三人小组 · 七天开发周期 · 各司其职</p>
        </div>

        <div class="team-grid">
          <div
            class="flip-card"
            v-for="(member, idx) in teamMembers"
            :key="member.name"
            :style="{ animationDelay: idx * 0.15 + 's' }"
          >
            <div class="flip-card-inner">
              <!-- 正面 -->
              <div class="flip-card-front">
                <div class="card-glow"></div>
                <div class="member-avatar" :class="'avatar-' + (idx + 1)">
                  {{ member.name.charAt(0) }}
                </div>
                <h3 class="member-name">{{ member.name }}</h3>
                <p class="member-role">{{ member.role }}</p>
                <div class="front-dots">
                  <span></span><span></span><span></span>
                </div>
                <p class="hover-tip">🔄 悬停查看详情</p>
              </div>
              <!-- 背面 -->
              <div class="flip-card-back">
                <div class="back-shine"></div>
                <h4>{{ member.name }} · 负责模块</h4>
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

    <!-- ===== 技术介绍 ===== -->
    <section class="section section-tech" id="tech">
      <!-- 网格装饰 -->
      <div class="grid-bg"></div>

      <div class="section-container">
        <div class="section-header">
          <span class="section-tag">TECH STACK</span>
          <h2 class="section-title">💻 技术介绍</h2>
          <div class="title-line"></div>
          <p class="section-desc">现代化 Web 技术栈 · 全栈 JavaScript 开发</p>
        </div>

        <div class="tech-grid">
          <div
            class="tech-card"
            v-for="(tech, idx) in techStack"
            :key="tech.name"
            :style="{ animationDelay: idx * 0.12 + 's' }"
          >
            <div class="tech-icon-wrap">
              <span class="tech-icon">{{ tech.icon }}</span>
            </div>
            <div class="tech-glow"></div>
            <h3 class="tech-name">{{ tech.name }}</h3>
            <p class="tech-desc">{{ tech.description }}</p>
            <div class="tech-tags">
              <span class="tag" v-for="tag in tech.tags" :key="tag">{{ tag }}</span>
            </div>
            <div class="tech-bottom-bar"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- ===== 页脚 ===== -->
    <footer class="footer">
      <div class="footer-waves">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0,30 C360,60 720,0 1440,30 L1440,60 L0,60 Z" fill="rgba(255,255,255,0.03)"/>
        </svg>
      </div>
      <div class="footer-inner">
        <div class="footer-content">
          <div class="footer-brand">
            <span class="footer-logo">📚</span>
            <span>高校图书管理系统</span>
          </div>
          <p class="footer-copy">© 2026 课程设计项目 · 三人小组共同开发</p>
          <div class="footer-tech-stack">
            <span>Vue 3</span><span>·</span><span>Express</span><span>·</span><span>MongoDB</span><span>·</span><span>Element Plus</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const scrolled = ref(false);
const navbarHover = ref(false);

function scrollTo(selector) {
  const el = document.querySelector(selector);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

onMounted(() => {
  // 监听滚动判断导航栏样式
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.target.id === 'team') {
          scrolled.value = entry.isIntersecting;
        }
      }
    },
    { threshold: 0 }
  );
  const teamEl = document.getElementById('team');
  if (teamEl) observer.observe(teamEl);
});

const teamMembers = [
  {
    name: '组员A',
    role: '组长 / 全栈开发',
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
    role: '全栈开发',
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
    role: '全栈开发',
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
    name: 'Node.js',
    description: '高性能后端运行时，搭配 Express 框架提供 RESTful API 服务。',
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

/* ===== 平滑滚动 ===== */
html {
  scroll-behavior: smooth;
}
.landing-page :deep() {
  scroll-behavior: smooth;
}

/* ===== Hero 区（100vh 全屏） ===== */
.hero-section {
  position: relative;
  width: 100%;
  height: 100vh;
  min-height: 600px;
  background: url('/hero-bg.jpg') center center / cover no-repeat;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 渐变遮罩 */
.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.3) 40%,
    rgba(0, 0, 0, 0.55) 100%
  );
  z-index: 1;
}

/* ===== 导航栏（高级毛玻璃效果） ===== */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 0 40px;
  height: 68px;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

/* 鼠标悬浮导航栏 → 更透亮 */
.navbar-hover {
  background: rgba(255, 255, 255, 0.15) !important;
  backdrop-filter: blur(18px) !important;
  -webkit-backdrop-filter: blur(18px) !important;
  border-bottom-color: rgba(255,255,255,0.12) !important;
}
.navbar-hover .nav-logo {
  text-shadow: 0 2px 12px rgba(0,0,0,0.3);
}

/* 滚动到内容区 */
.navbar.scrolled {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(14px);
  box-shadow: 0 2px 24px rgba(0,0,0,0.06);
  border-bottom-color: rgba(0,0,0,0.04);
}
.navbar.scrolled.navbar-hover {
  background: rgba(255, 255, 255, 0.96) !important;
  backdrop-filter: blur(20px) !important;
  box-shadow: 0 4px 32px rgba(0,0,0,0.1) !important;
}

.navbar.scrolled .nav-logo {
  color: #303133;
  text-shadow: none;
}
.navbar.scrolled .nav-link:not(.nav-enter):not(.login-link) {
  color: #606266;
}
.navbar.scrolled .nav-link:not(.nav-enter):not(.login-link):hover {
  color: #409eff;
}
.navbar.scrolled .login-link {
  border-color: #dcdfe6;
  color: #606266;
}
.navbar.scrolled .login-link:hover {
  border-color: #409eff;
  color: #409eff;
}

.nav-inner {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.nav-logo {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  transition: color 0.3s, text-shadow 0.3s;
  white-space: nowrap;
  flex-shrink: 0;
  text-shadow: 0 1px 8px rgba(0,0,0,0.15);
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 6px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* ===== 导航选项（毛玻璃+光晕） ===== */
.nav-link {
  color: rgba(255,255,255,0.85);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  padding: 8px 20px;
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  letter-spacing: 0.5px;
  background: transparent;
  border: 1px solid transparent;
}

/* 悬浮 → 毛玻璃底座 + 边框 + 光晕 */
.nav-link:hover {
  color: #fff;
  background: rgba(255,255,255,0.12);
  border-color: rgba(255,255,255,0.25);
  box-shadow:
    0 0 24px rgba(255,255,255,0.06),
    inset 0 1px 0 rgba(255,255,255,0.1);
  transform: translateY(-1px);
}
/* 右上角光斑装饰 */
.nav-link:hover::before {
  content: '';
  position: absolute;
  top: -1px;
  right: -1px;
  width: 44px;
  height: 44px;
  background: radial-gradient(circle at top right, rgba(255,255,255,0.18), transparent 70%);
  border-radius: 0 10px 0 0;
  pointer-events: none;
}

/* 白底滚动后的悬浮 */
.navbar.scrolled .nav-link:hover {
  color: #409eff;
  background: rgba(64,158,255,0.08);
  border-color: rgba(64,158,255,0.2);
  box-shadow: 0 0 24px rgba(64,158,255,0.06);
}
.navbar.scrolled .nav-link:hover::before {
  background: radial-gradient(circle at top right, rgba(64,158,255,0.1), transparent 70%);
}

/* 进入系统按钮 */
.nav-enter {
  background: linear-gradient(135deg, rgba(64,158,255,0.2), rgba(51,126,204,0.2));
  border-color: rgba(64,158,255,0.3);
  color: #fff !important;
  font-weight: 600;
  margin-left: 12px;
  backdrop-filter: blur(4px);
}
.nav-enter:hover {
  background: linear-gradient(135deg, #409eff, #337ecc) !important;
  border-color: #409eff !important;
  box-shadow:
    0 4px 28px rgba(64,158,255,0.35),
    inset 0 1px 0 rgba(255,255,255,0.15) !important;
  transform: translateY(-2px) !important;
}
.nav-enter:hover::before { display: none !important; }

.navbar.scrolled .nav-enter {
  background: linear-gradient(135deg, #409eff, #337ecc);
  border-color: transparent;
  box-shadow: 0 2px 12px rgba(64,158,255,0.25);
}
.navbar.scrolled .nav-enter:hover {
  box-shadow: 0 6px 28px rgba(64,158,255,0.4) !important;
  transform: translateY(-2px) !important;
}

.nav-right {
  flex-shrink: 0;
}

/* 登录按钮 — 圆环 */
.login-link {
  border: 1.5px solid rgba(255,255,255,0.35);
  padding: 6px 22px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.35s;
  letter-spacing: 0.5px;
  color: rgba(255,255,255,0.85);
}
.login-link:hover {
  border-color: #fff;
  background: rgba(255,255,255,0.1);
  color: #fff !important;
  box-shadow: 0 0 20px rgba(255,255,255,0.05);
  transform: translateY(-1px);
}
.login-link:hover::before { display: none !important; }
.navbar.scrolled .login-link:hover {
  border-color: #409eff;
  background: rgba(64,158,255,0.06);
  color: #409eff !important;
  box-shadow: 0 0 20px rgba(64,158,255,0.08);
}

/* ===== Hero 内容 ===== */
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
  margin-top: -40px;
}
.hero-badge {
  display: inline-block;
  padding: 6px 20px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 20px;
  color: rgba(255,255,255,0.9);
  font-size: 13px;
  letter-spacing: 2px;
  margin-bottom: 24px;
}
.hero-title {
  font-size: 52px;
  font-weight: 800;
  color: #fff;
  margin-bottom: 16px;
  text-shadow: 0 2px 30px rgba(0,0,0,0.5);
  letter-spacing: 2px;
}
.hero-subtitle {
  font-size: 20px;
  color: rgba(255,255,255,0.8);
  margin-bottom: 36px;
  text-shadow: 0 1px 10px rgba(0,0,0,0.3);
  letter-spacing: 4px;
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
  transition: all 0.3s;
  cursor: pointer;
}
.btn-primary {
  background: #409eff;
  color: #fff;
  box-shadow: 0 4px 20px rgba(64,158,255,0.4);
}
.btn-primary:hover {
  background: #66b1ff;
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(64,158,255,0.5);
}
.btn-outline {
  background: transparent;
  color: #fff;
  border: 2px solid rgba(255,255,255,0.6);
}
.btn-outline:hover {
  background: rgba(255,255,255,0.1);
  border-color: #fff;
  transform: translateY(-3px);
}

/* 滚动提示 */
.scroll-hint {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: rgba(255,255,255,0.6);
  font-size: 12px;
  cursor: pointer;
  animation: floatDown 2s ease-in-out infinite;
}
.scroll-arrow {
  font-size: 20px;
  animation: bounceArrow 1.5s ease-in-out infinite;
}

@keyframes floatDown {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(6px); }
}
@keyframes bounceArrow {
  0%, 100% { opacity: 1; transform: translateY(0); }
  50% { opacity: 0.5; transform: translateY(6px); }
}

/* ===== 通用 Section（100vh 全屏） ===== */
.section {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 80px 20px;
  overflow: hidden;
}
.section-container {
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}
.section-header {
  text-align: center;
  margin-bottom: 48px;
}
.section-tag {
  display: inline-block;
  padding: 4px 16px;
  background: rgba(64,158,255,0.1);
  color: #409eff;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 2px;
  margin-bottom: 12px;
}
.section-title {
  font-size: 36px;
  font-weight: 800;
  color: #303133;
  margin-bottom: 8px;
}
.title-line {
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #409eff, #66b1ff);
  border-radius: 2px;
  margin: 12px auto;
}
.section-desc {
  font-size: 16px;
  color: #909399;
}

/* ===== 团队分工（高性能渐变背景） ===== */
.section-team {
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  color: #fff;
}
.section-team .section-tag {
  background: rgba(255,255,255,0.1);
  color: rgba(255,255,255,0.7);
}
.section-team .section-title {
  color: #fff;
}
.section-team .title-line {
  background: linear-gradient(90deg, #667eea, #764ba2);
}
.section-team .section-desc {
  color: rgba(255,255,255,0.55);
}

/* 装饰圆 */
.deco-circle {
  position: absolute;
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;
}
.deco-circle-1 {
  width: 400px; height: 400px;
  background: radial-gradient(circle, rgba(102,126,234,0.15) 0%, transparent 70%);
  top: -100px; right: -100px;
}
.deco-circle-2 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(118,75,162,0.12) 0%, transparent 70%);
  bottom: -50px; left: -80px;
}
.deco-circle-3 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(64,158,255,0.08) 0%, transparent 70%);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

/* 翻转卡片 */
.flip-card {
  perspective: 1200px;
  height: 360px;
  animation: fadeUp 0.6s ease-out both;
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.7s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}
.flip-card:hover .flip-card-inner {
  transform: rotateY(180deg);
}

/* 正面 */
.flip-card-front {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  padding: 36px 24px;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,255,255,0.1);
  overflow: hidden;
}
.card-glow {
  position: absolute;
  width: 120%;
  height: 50px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent);
  top: -20px;
  transform: rotate(-10deg);
  pointer-events: none;
}

.member-avatar {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  position: relative;
}
.avatar-1 { background: linear-gradient(135deg, #667eea, #764ba2); }
.avatar-2 { background: linear-gradient(135deg, #f093fb, #f5576c); }
.avatar-3 { background: linear-gradient(135deg, #4facfe, #00f2fe); }

.member-name {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 4px;
}
.member-role {
  font-size: 14px;
  color: rgba(255,255,255,0.55);
}
.front-dots {
  display: flex;
  gap: 6px;
  margin-top: 16px;
}
.front-dots span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255,255,255,0.25);
}
.front-dots span:nth-child(2) {
  background: rgba(255,255,255,0.45);
}
.hover-tip {
  position: absolute;
  bottom: 16px;
  font-size: 11px;
  color: rgba(255,255,255,0.3);
  letter-spacing: 1px;
}

/* 背面 */
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  padding: 32px 24px;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  transform: rotateY(180deg);
  overflow: hidden;
}
.back-shine {
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
  pointer-events: none;
}
.flip-card-back h4 {
  font-size: 16px;
  margin-bottom: 14px;
  text-align: center;
  color: rgba(255,255,255,0.9);
}
.flip-card-back ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 13px;
  line-height: 2.2;
  color: rgba(255,255,255,0.85);
}
.flip-card-back li {
  padding-left: 20px;
  position: relative;
}
.flip-card-back li::before {
  content: '✦';
  position: absolute;
  left: 0;
  font-size: 10px;
  opacity: 0.7;
}
.member-badge {
  margin-top: 14px;
  padding: 5px 16px;
  background: rgba(255,255,255,0.15);
  border-radius: 12px;
  font-size: 12px;
  text-align: center;
  color: rgba(255,255,255,0.8);
}

/* ===== 技术介绍（深色科技感） ===== */
.section-tech {
  background: linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 100%);
  color: #fff;
}

/* 网格装饰 */
.grid-bg {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: 0;
  pointer-events: none;
}

.section-tech .section-tag {
  background: rgba(64,158,255,0.15);
  color: #409eff;
}
.section-tech .section-title {
  color: #fff;
}
.section-tech .title-line {
  background: linear-gradient(90deg, #409eff, #00d2ff);
}
.section-tech .section-desc {
  color: rgba(255,255,255,0.45);
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.tech-card {
  position: relative;
  background: rgba(255,255,255,0.04);
  border-radius: 16px;
  padding: 32px 20px 24px;
  text-align: center;
  border: 1px solid rgba(255,255,255,0.06);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  animation: fadeUp 0.6s ease-out both;
}
.tech-card:hover {
  transform: translateY(-8px);
  border-color: rgba(64,158,255,0.3);
  background: rgba(255,255,255,0.07);
  box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 40px rgba(64,158,255,0.05);
}

/* 光标跟随光晕 */
.tech-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at 50% 0%, rgba(64,158,255,0.06) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 0.4s;
  pointer-events: none;
}
.tech-card:hover .tech-glow {
  opacity: 1;
}

.tech-icon-wrap {
  width: 64px;
  height: 64px;
  margin: 0 auto 16px;
  border-radius: 16px;
  background: rgba(64,158,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s, background 0.3s;
}
.tech-card:hover .tech-icon-wrap {
  transform: scale(1.1) rotate(-5deg);
  background: rgba(64,158,255,0.2);
}
.tech-icon {
  font-size: 32px;
}

.tech-name {
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  margin-bottom: 8px;
}
.tech-desc {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
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
  background: rgba(64,158,255,0.12);
  color: rgba(64,158,255,0.8);
  border-radius: 8px;
  font-size: 11px;
  font-weight: 500;
  transition: all 0.25s;
}
.tech-card:hover .tag {
  background: rgba(64,158,255,0.2);
  color: #409eff;
}

/* 卡片底部装饰条 */
.tech-bottom-bar {
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #409eff, #00d2ff);
  border-radius: 1px;
  margin: 14px auto 0;
  transition: width 0.4s ease;
}
.tech-card:hover .tech-bottom-bar {
  width: 40px;
}

/* ===== 页脚 ===== */
.footer {
  background: #08081a;
  color: rgba(255,255,255,0.5);
  text-align: center;
  position: relative;
  overflow: hidden;
}
.footer-waves {
  height: 60px;
  overflow: hidden;
}
.footer-waves svg {
  width: 100%;
  height: 100%;
}
.footer-inner {
  padding: 40px 20px 48px;
}
.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.footer-brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: rgba(255,255,255,0.7);
}
.footer-logo {
  font-size: 22px;
}
.footer-copy {
  font-size: 13px;
}
.footer-tech-stack {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: rgba(255,255,255,0.3);
}

/* ===== 响应式 ===== */
@media (max-width: 768px) {
  .hero-title { font-size: 32px; }
  .hero-subtitle { font-size: 15px; letter-spacing: 2px; }
  .section { min-height: auto; padding: 60px 16px; }
  .section-title { font-size: 28px; }
  .team-grid { grid-template-columns: 1fr; }
  .tech-grid { grid-template-columns: 1fr 1fr; }
  .flip-card { height: 320px; }
  .navbar { padding: 0 16px; }
  .nav-inner { flex-wrap: wrap; gap: 8px; }
  .nav-links { position: static; transform: none; gap: 0; }
  .nav-link { font-size: 13px; padding: 6px 10px; }
  .hero-buttons { flex-direction: column; align-items: center; }
  .nav-enter { margin-left: 4px; }
}

@media (max-width: 480px) {
  .tech-grid { grid-template-columns: 1fr; }
}
</style>
