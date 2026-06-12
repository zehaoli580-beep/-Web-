<template>
  <div class="book-detail-page">
    <!-- 导航栏 -->
    <header class="navbar">
      <div class="nav-inner">
        <div class="nav-left">
          <h1 class="logo" @click="$router.push('/')">📚 高校图书管理系统</h1>
        </div>
        <div class="nav-right">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/books" class="nav-link">图书检索</router-link>
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

    <div class="content-container" v-if="book">
      <el-button class="back-btn" text @click="$router.push('/books')">
        ← 返回检索
      </el-button>

      <div class="detail-main">
        <!-- 图书封面 -->
        <div class="detail-cover">
          <img :src="book.cover || DEFAULT_COVER" :alt="book.title" @error="onImgError">
        </div>

        <!-- 图书信息 -->
        <div class="detail-info">
          <h2 class="detail-title">{{ book.title }}</h2>
          <p class="detail-author">{{ book.author }} / {{ book.publisher }} / {{ book.year }}</p>

          <el-descriptions :column="1" border size="small" class="detail-descriptions">
            <el-descriptions-item label="ISBN">{{ book.isbn }}</el-descriptions-item>
            <el-descriptions-item label="分类">{{ book.category }}</el-descriptions-item>
            <el-descriptions-item label="馆藏位置">{{ book.location }}</el-descriptions-item>
            <el-descriptions-item label="馆藏数量">{{ book.total }} 本</el-descriptions-item>
            <el-descriptions-item label="可借数量">
              <span :class="book.available > 0 ? 'text-available' : 'text-borrowed'">
                {{ book.available }} 本
              </span>
            </el-descriptions-item>
            <el-descriptions-item label="借阅次数">{{ book.borrowTimes }} 次</el-descriptions-item>
            <el-descriptions-item label="图书状态">
              <el-tag v-if="book.status === 'removed'" type="danger">已下架</el-tag>
              <el-tag v-else-if="book.available > 0" type="success">在馆</el-tag>
              <el-tag v-else type="warning">已借出</el-tag>
            </el-descriptions-item>
          </el-descriptions>

          <!-- 简介 -->
          <div class="description-section" v-if="book.description">
            <h3 class="section-label">图书简介</h3>
            <p class="description-text">{{ book.description }}</p>
          </div>

          <!-- 操作按钮 -->
          <div class="action-buttons" v-if="userStore.isLoggedIn && book.status !== 'removed'">
            <el-button
              type="primary"
              size="large"
              :disabled="book.available <= 0"
              :loading="borrowLoading"
              @click="handleBorrow"
            >
              {{ book.available > 0 ? '立即借阅' : '暂无余量' }}
            </el-button>
            <el-button
              size="large"
              :disabled="book.available > 0"
              :loading="reserveLoading"
              @click="handleReserve"
            >
              预约
            </el-button>
          </div>
          <div class="login-tip" v-else-if="!userStore.isLoggedIn && book.status !== 'removed'">
            <el-button @click="$router.push('/login')">登录后可借阅或预约</el-button>
          </div>
        </div>
      </div>

      <!-- 相关推荐 -->
      <section class="related-section" v-if="related.length > 0">
        <h3 class="section-title">📖 相关推荐</h3>
        <el-row :gutter="20">
          <el-col :xs="12" :sm="8" :md="4" v-for="r in related" :key="r._id">
            <div class="related-card" @click="$router.push(`/books/${r._id}`)">
              <div class="related-cover">
                <img :src="r.cover || DEFAULT_COVER" :alt="r.title" @error="onImgError">
              </div>
              <p class="related-title" :title="r.title">{{ r.title }}</p>
              <p class="related-author">{{ r.author }}</p>
            </div>
          </el-col>
        </el-row>
      </section>
    </div>

    <!-- 加载中 -->
    <div v-else-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>

    <el-empty v-else description="图书不存在" />

    <footer class="footer">
      <p>© 2026 高校图书管理系统 · 课程设计项目</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/store/user';
import { getBookById } from '@/api/book';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const DEFAULT_COVER = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE4MCIgZmlsbD0iI2U4ZThlOCIvPjx0ZXh0IHg9IjYwIiB5PSI5MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7lm77niYflnLDlnYA8L3RleHQ+PC9zdmc+';

const book = ref(null);
const related = ref([]);
const loading = ref(true);
const borrowLoading = ref(false);
const reserveLoading = ref(false);

function onImgError(e) {
  e.target.src = DEFAULT_COVER;
}

function handleLogout() {
  userStore.logout();
  router.push('/login');
}

async function handleBorrow() {
  if (!userStore.isLoggedIn) {
    router.push('/login');
    return;
  }
  borrowLoading.value = true;
  // 调用组员C的借书接口
  try {
    const request = (await import('@/utils/request')).default;
    const res = await request.post('/records/borrow', { bookId: book.value._id });
    ElMessage.success('借阅申请已提交');
  } catch (err) {
    console.error('借阅失败:', err);
  } finally {
    borrowLoading.value = false;
  }
}

async function handleReserve() {
  if (!userStore.isLoggedIn) {
    router.push('/login');
    return;
  }
  reserveLoading.value = true;
  try {
    const request = (await import('@/utils/request')).default;
    const res = await request.post('/records/reserve', { bookId: book.value._id });
    ElMessage.success('预约成功');
  } catch (err) {
    console.error('预约失败:', err);
  } finally {
    reserveLoading.value = false;
  }
}

onMounted(async () => {
  try {
    const res = await getBookById(route.params.id);
    if (res.data) {
      book.value = res.data.book;
      related.value = res.data.related || [];
    }
  } catch (err) {
    console.error('加载图书详情失败:', err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.book-detail-page {
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

.content-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.back-btn {
  margin-bottom: 16px;
  font-size: 14px;
}

.detail-main {
  display: flex;
  gap: 30px;
  background: #fff;
  border-radius: 8px;
  padding: 30px;
  border: 1px solid #ebeef5;
}
.detail-cover {
  flex-shrink: 0;
  width: 220px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}
.detail-cover img {
  max-width: 100%;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}
.detail-info {
  flex: 1;
  min-width: 0;
}
.detail-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}
.detail-author {
  font-size: 14px;
  color: #909399;
  margin-bottom: 20px;
}
.detail-descriptions {
  margin-bottom: 20px;
}
.text-available { color: #67c23a; font-weight: 600; }
.text-borrowed { color: #f56c6c; font-weight: 600; }

.description-section {
  margin-bottom: 20px;
}
.section-label {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 8px;
}
.description-text {
  font-size: 14px;
  color: #606266;
  line-height: 1.8;
}

.action-buttons {
  display: flex;
  gap: 12px;
}
.login-tip {
  margin-top: 16px;
}

/* 相关推荐 */
.related-section {
  margin-top: 30px;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  border: 1px solid #ebeef5;
}
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 16px;
}
.related-card {
  cursor: pointer;
  text-align: center;
  padding: 10px;
  border-radius: 6px;
  transition: background 0.2s;
}
.related-card:hover {
  background: #f5f7fa;
}
.related-cover {
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border-radius: 4px;
  margin-bottom: 8px;
}
.related-cover img {
  max-width: 80%;
  max-height: 100%;
  object-fit: contain;
}
.related-title {
  font-size: 13px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.related-author {
  font-size: 12px;
  color: #909399;
}

.loading-container {
  max-width: 1000px;
  margin: 20px auto;
  padding: 40px;
}

.footer {
  text-align: center;
  padding: 24px;
  color: #909399;
  font-size: 13px;
  background: #fff;
  border-top: 1px solid #e4e7ed;
  margin-top: 30px;
}
</style>
