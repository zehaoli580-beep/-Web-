<template>
  <div class="home-page">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="nav-inner">
        <div class="nav-left">
          <h1 class="logo" @click="$router.push('/app')">📚 高校图书管理系统</h1>
        </div>
        <div class="nav-right">
          <router-link to="/books" class="nav-link">图书检索</router-link>
          <router-link v-if="userStore.isAdmin" to="/admin/books" class="nav-link">图书管理</router-link>
          <router-link v-if="userStore.isAdmin" to="/admin/categories" class="nav-link">分类管理</router-link>
          <template v-if="userStore.isLoggedIn">
            <span class="user-info">{{ userStore.userInfo?.name || userStore.userInfo?.username }}</span>
            <el-button size="small" type="danger" plain @click="handleLogout">退出</el-button>
          </template>
          <template v-else>
            <el-button size="small" @click="$router.push('/login')">登录</el-button>
            <el-button size="small" type="primary" @click="$router.push('/register')">注册</el-button>
          </template>
        </div>
      </div>
    </header>

    <!-- 主内容 -->
    <main class="main-content">
      <!-- Hero 搜索区 -->
      <section class="hero-section">
        <div class="hero-inner">
          <h2 class="hero-title">欢迎来到高校图书管理系统</h2>
          <p class="hero-subtitle">海量图书资源，便捷借阅服务</p>
          <div class="search-box">
            <el-input
              v-model="searchKeyword"
              placeholder="搜索图书（书名、作者、出版社、ISBN）"
              size="large"
              clearable
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button @click="handleSearch" type="primary">
                  <el-icon><Search /></el-icon> 搜索
                </el-button>
              </template>
            </el-input>
          </div>
        </div>
      </section>

      <div class="content-container">
        <!-- 热门图书排行榜 -->
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">🔥 热门图书排行榜</h2>
            <router-link to="/books?sort=hot" class="more-link">查看更多 →</router-link>
          </div>
          <el-row :gutter="20" v-if="hotBooks.length > 0">
            <el-col :xs="12" :sm="8" :md="6" :lg="4.8" v-for="(book, index) in hotBooks" :key="book._id">
              <div class="book-card" @click="$router.push(`/books/${book._id}`)">
                <div class="rank-badge" :class="'rank-' + (index + 1)">{{ index + 1 }}</div>
                <div class="book-cover">
                  <img :src="book.cover || DEFAULT_COVER" :alt="book.title" @error="onImgError">
                </div>
                <div class="book-info">
                  <h4 class="book-title" :title="book.title">{{ book.title }}</h4>
                  <p class="book-author">{{ book.author }}</p>
                  <p class="book-meta">
                    <span>借阅 {{ book.borrowTimes }} 次</span>
                    <span :class="book.available > 0 ? 'status-available' : 'status-borrowed'">
                      {{ book.available > 0 ? '在馆' : '已借出' }}
                    </span>
                  </p>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-empty v-else description="暂无热门图书" />
        </section>

        <!-- 新书上架 -->
        <section class="section">
          <div class="section-header">
            <h2 class="section-title">🆕 新书上架</h2>
            <router-link to="/books?sort=new" class="more-link">查看更多 →</router-link>
          </div>
          <el-row :gutter="20" v-if="newBooks.length > 0">
            <el-col :xs="12" :sm="8" :md="6" :lg="4.8" v-for="book in newBooks" :key="book._id">
              <div class="book-card" @click="$router.push(`/books/${book._id}`)">
                <div class="book-cover">
                  <img :src="book.cover || DEFAULT_COVER" :alt="book.title" @error="onImgError">
                </div>
                <div class="book-info">
                  <h4 class="book-title" :title="book.title">{{ book.title }}</h4>
                  <p class="book-author">{{ book.author }}</p>
                  <p class="book-meta">
                    <span>{{ book.publisher }}</span>
                    <span :class="book.available > 0 ? 'status-available' : 'status-borrowed'">
                      {{ book.available > 0 ? '在馆' : '已借出' }}
                    </span>
                  </p>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-empty v-else description="暂无新书上架" />
        </section>
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="footer">
      <p>© 2026 高校图书管理系统 · 课程设计项目</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { getHotBooks, getNewBooks } from '@/api/book';
import { Search } from '@element-plus/icons-vue';

const router = useRouter();
const userStore = useUserStore();

const DEFAULT_COVER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2U4ZThlOCIvPjx0ZXh0IHg9IjYwIiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lm77niYflnLDlnYA8L3RleHQ+PC9zdmc+';

const searchKeyword = ref('');
const hotBooks = ref([]);
const newBooks = ref([]);

function onImgError(e) {
  e.target.src = DEFAULT_COVER;
}

function handleSearch() {
  if (searchKeyword.value.trim()) {
    router.push(`/books?keyword=${encodeURIComponent(searchKeyword.value.trim())}`);
  }
}

function handleLogout() {
  userStore.logout();
  router.push('/');
}

onMounted(async () => {
  try {
    const [hotRes, newRes] = await Promise.all([
      getHotBooks({ limit: 10 }),
      getNewBooks({ limit: 10 })
    ]);
    if (hotRes.data) hotBooks.value = hotRes.data;
    if (newRes.data) newBooks.value = newRes.data;
  } catch (err) {
    console.error('加载首页数据失败:', err);
  }
});
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 导航栏 */
.navbar {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-size: 18px;
  cursor: pointer;
  color: #409eff;
  white-space: nowrap;
}
.nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.nav-link {
  color: #333;
  text-decoration: none;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background 0.2s;
}
.nav-link:hover {
  background: #ecf5ff;
  color: #409eff;
}
.user-info {
  font-size: 14px;
  color: #606266;
  margin-right: 4px;
}

/* Hero 区 */
.hero-section {
  background: linear-gradient(135deg, #409eff 0%, #337ecc 100%);
  padding: 60px 20px;
  text-align: center;
}
.hero-inner {
  max-width: 700px;
  margin: 0 auto;
}
.hero-title {
  font-size: 32px;
  color: #fff;
  margin-bottom: 12px;
}
.hero-subtitle {
  font-size: 16px;
  color: rgba(255,255,255,0.85);
  margin-bottom: 30px;
}
.search-box {
  max-width: 560px;
  margin: 0 auto;
}

/* 内容容器 */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 30px 20px;
}
.section {
  margin-bottom: 40px;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.section-title {
  font-size: 22px;
  font-weight: 600;
  color: #303133;
}
.more-link {
  color: #409eff;
  text-decoration: none;
  font-size: 14px;
}
.more-link:hover {
  text-decoration: underline;
}

/* 图书卡片 */
.book-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 20px;
  position: relative;
  border: 1px solid #ebeef5;
}
.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
.rank-badge {
  position: absolute;
  top: 0;
  left: 0;
  width: 28px;
  height: 28px;
  background: #909399;
  color: #fff;
  font-size: 13px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0 0 8px 0;
  z-index: 2;
}
.rank-badge.rank-1 { background: #f56c6c; }
.rank-badge.rank-2 { background: #e6a23c; }
.rank-badge.rank-3 { background: #409eff; }
.book-cover {
  height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  padding: 10px;
}
.book-cover img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}
.book-info {
  padding: 10px 12px;
}
.book-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-bottom: 4px;
}
.book-author {
  font-size: 12px;
  color: #909399;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.book-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
}
.status-available { color: #67c23a; }
.status-borrowed { color: #f56c6c; }

/* 页脚 */
.footer {
  text-align: center;
  padding: 24px;
  color: #909399;
  font-size: 13px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
}
</style>
