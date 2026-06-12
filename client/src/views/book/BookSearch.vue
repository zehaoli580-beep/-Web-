<template>
  <div class="book-search-page">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="nav-inner">
        <div class="nav-left">
          <h1 class="logo" @click="$router.push('/app')">📚 高校图书管理系统</h1>
        </div>
        <div class="nav-right">
          <router-link to="/" class="nav-link">官网首页</router-link>
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

    <!-- 搜索区 -->
    <div class="search-bar">
      <div class="search-inner">
        <el-input
          v-model="keyword"
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

    <div class="content-container">
      <!-- 筛选区 -->
      <div class="filter-bar" v-if="categories.length > 0">
        <span class="filter-label">分类筛选：</span>
        <el-radio-group v-model="selectedCategory" @change="handleCategoryChange">
          <el-radio-button value="">全部分类</el-radio-button>
          <el-radio-button v-for="cat in categories" :key="cat._id" :value="cat.name">
            {{ cat.name }}
          </el-radio-button>
        </el-radio-group>
      </div>

      <!-- 结果统计 -->
      <div class="result-stats">
        <span>共找到 <strong>{{ pagination.total }}</strong> 本图书</span>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="loading-container">
        <el-skeleton :rows="3" animated />
      </div>

      <!-- 图书列表 -->
      <el-row :gutter="20" v-else-if="books.length > 0">
        <el-col :xs="12" :sm="8" :md="6" :lg="6" v-for="book in books" :key="book._id">
          <div class="book-card" @click="$router.push(`/books/${book._id}`)">
            <div class="book-cover">
              <img :src="book.cover || DEFAULT_COVER" :alt="book.title" @error="onImgError">
            </div>
            <div class="book-info">
              <h4 class="book-title" :title="book.title">{{ book.title }}</h4>
              <p class="book-author" :title="book.author">{{ book.author }}</p>
              <p class="book-publisher">{{ book.publisher }}</p>
              <p class="book-meta">
                <span :class="book.available > 0 ? 'status-available' : 'status-borrowed'">
                  {{ book.available > 0 ? '在馆' : '已借出' }}
                </span>
                <span>剩余 {{ book.available }}/{{ book.total }} 本</span>
              </p>
            </div>
          </div>
        </el-col>
      </el-row>
      <el-empty v-else description="没有找到相关图书" />

      <!-- 分页 -->
      <div class="pagination-wrap" v-if="pagination.totalPages > 1">
        <el-pagination
          v-model:current-page="pagination.page"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>
    </div>

    <footer class="footer">
      <p>© 2026 高校图书管理系统 · 课程设计项目</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { getBooks } from '@/api/book';
import { getCategories } from '@/api/category';
import { Search } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const DEFAULT_COVER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2U4ZThlOCIvPjx0ZXh0IHg9IjYwIiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lm77niYflnLDlnYA8L3RleHQ+PC9zdmc+';

const keyword = ref(route.query.keyword || '');
const selectedCategory = ref(route.query.category || '');
const categories = ref([]);
const books = ref([]);
const loading = ref(false);
const pagination = ref({
  page: 1,
  pageSize: 12,
  total: 0,
  totalPages: 0
});

function onImgError(e) {
  e.target.src = DEFAULT_COVER;
}

function handleSearch() {
  pagination.value.page = 1;
  fetchBooks();
}

function handleCategoryChange() {
  pagination.value.page = 1;
  fetchBooks();
}

function handlePageChange(page) {
  pagination.value.page = page;
  fetchBooks();
}

function handleLogout() {
  userStore.logout();
  router.push('/login');
}

async function fetchBooks() {
  loading.value = true;
  try {
    const params = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    };
    if (keyword.value.trim()) params.keyword = keyword.value.trim();
    if (selectedCategory.value) params.category = selectedCategory.value;

    const res = await getBooks(params);
    if (res.data) {
      books.value = res.data.books;
      pagination.value = res.data.pagination;
    }
  } catch (err) {
    console.error('搜索图书失败:', err);
    books.value = [];
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  // 加载分类
  try {
    const res = await getCategories();
    if (res.data) categories.value = res.data;
  } catch (err) {
    console.error('加载分类失败:', err);
  }

  // 加载图书
  if (keyword.value.trim()) {
    fetchBooks();
  } else {
    fetchBooks();
  }
});
</script>

<style scoped>
.book-search-page {
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
}

.search-bar {
  background: #fff;
  padding: 20px 0;
  border-bottom: 1px solid #e4e7ed;
}
.search-inner {
  max-width: 700px;
  margin: 0 auto;
  padding: 0 20px;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.filter-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.filter-label {
  font-size: 14px;
  color: #606266;
  white-space: nowrap;
}

.result-stats {
  font-size: 14px;
  color: #909399;
  margin-bottom: 20px;
}

.loading-container {
  padding: 40px;
}

/* 图书卡片 */
.book-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  margin-bottom: 20px;
  border: 1px solid #ebeef5;
}
.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
}
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
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.book-publisher {
  font-size: 12px;
  color: #c0c4cc;
  margin-bottom: 6px;
}
.book-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}
.status-available { color: #67c23a; }
.status-borrowed { color: #f56c6c; }

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding-bottom: 30px;
}

.footer {
  text-align: center;
  padding: 24px;
  color: #909399;
  font-size: 13px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
}
</style>
