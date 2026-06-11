<template>
  <div class="page-container">
    <h2>统计概览</h2>
    
    <!-- 统计卡片 -->
    <div class="stats-cards">
      <div class="card">
        <div class="card-icon">📚</div>
        <div class="card-content">
          <div class="card-value">{{ overview.totalBooks }}</div>
          <div class="card-label">图书总数</div>
        </div>
      </div>
      <div class="card">
        <div class="card-icon">✅</div>
        <div class="card-content">
          <div class="card-value">{{ overview.totalAvailable }}</div>
          <div class="card-label">可借阅</div>
        </div>
      </div>
      <div class="card">
        <div class="card-icon">📖</div>
        <div class="card-content">
          <div class="card-value">{{ overview.totalBorrowed }}</div>
          <div class="card-label">已借出</div>
        </div>
      </div>
      <div class="card">
        <div class="card-icon">👥</div>
        <div class="card-content">
          <div class="card-value">{{ overview.totalUsers }}</div>
          <div class="card-label">用户总数</div>
        </div>
      </div>
      <div class="card">
        <div class="card-icon">🔥</div>
        <div class="card-content">
          <div class="card-value">{{ overview.activeBorrowers }}</div>
          <div class="card-label">活跃借阅者</div>
        </div>
      </div>
      <div class="card">
        <div class="card-icon">⚠️</div>
        <div class="card-content">
          <div class="card-value">{{ overview.overdueCount }}</div>
          <div class="card-label">逾期数量</div>
        </div>
      </div>
      <div class="card">
        <div class="card-icon">💰</div>
        <div class="card-content">
          <div class="card-value">{{ overview.totalFine }}元</div>
          <div class="card-label">总罚款</div>
        </div>
      </div>
    </div>

    <!-- 借阅趋势 -->
    <div class="section">
      <h3>借阅趋势（近30天）</h3>
      <div class="chart-container">
        <div class="chart-bar-container">
          <div 
            v-for="item in borrowTrend" 
            :key="item.date" 
            class="chart-bar-item"
          >
            <div 
              class="chart-bar" 
              :style="{ height: getBarHeight(item.count) + '%' }"
            ></div>
            <div class="chart-label">{{ formatDate(item.date) }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 热门图书排行榜 -->
    <div class="section">
      <h3>热门图书排行榜</h3>
      <table class="data-table">
        <thead>
          <tr>
            <th>排名</th>
            <th>书名</th>
            <th>作者</th>
            <th>借阅次数</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in hotBooks" :key="item.rank">
            <td>
              <span :class="['rank-badge', getRankClass(item.rank)]">
                {{ item.rank }}
              </span>
            </td>
            <td>{{ item.title }}</td>
            <td>{{ item.author }}</td>
            <td>{{ item.borrowTimes }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 分类分布 -->
    <div class="section">
      <h3>图书分类分布</h3>
      <div class="category-pie">
        <div 
          v-for="item in categoryDistribution" 
          :key="item.category"
          class="category-item"
        >
          <div 
            class="category-bar" 
            :style="{ width: getCategoryWidth(item.count) + '%', background: getCategoryColor(item.category) }"
          ></div>
          <div class="category-info">
            <span class="category-name">{{ item.category }}</span>
            <span class="category-count">{{ item.count }}本</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 消息提示 -->
    <div v-if="message" :class="['message-box', messageType]">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getOverview, getBorrowTrend, getHotBooks, getCategoryDistribution } from '../../api/stats';

const overview = reactive({
  totalBooks: 0,
  totalAvailable: 0,
  totalBorrowed: 0,
  totalUsers: 0,
  activeBorrowers: 0,
  overdueCount: 0,
  totalFine: 0
});

const borrowTrend = ref([]);
const hotBooks = ref([]);
const categoryDistribution = ref([]);
const message = ref('');
const messageType = ref('success');

const categoryColors = {
  '计算机': '#409EFF',
  '文学': '#67C23A',
  '科幻': '#E6A23C',
  '数学': '#F56C6C',
  '物理': '#909399',
  '化学': '#B37FEB'
};

const getCategoryColor = (category) => {
  return categoryColors[category] || '#409EFF';
};

const getBarHeight = (count) => {
  const max = Math.max(...borrowTrend.value.map(item => item.count), 1);
  return (count / max) * 100;
};

const getCategoryWidth = (count) => {
  const total = categoryDistribution.value.reduce((sum, item) => sum + item.count, 0);
  return total > 0 ? (count / total) * 100 : 0;
};

const getRankClass = (rank) => {
  if (rank === 1) return 'rank-gold';
  if (rank === 2) return 'rank-silver';
  if (rank === 3) return 'rank-bronze';
  return '';
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

const loadOverview = async () => {
  try {
    const res = await getOverview();
    if (res.code === 200) {
      Object.assign(overview, res.data);
    }
  } catch (err) {
    console.error('加载统计概览失败:', err);
    showMessage('加载失败', 'error');
  }
};

const loadBorrowTrend = async () => {
  try {
    const res = await getBorrowTrend({ days: 30 });
    if (res.code === 200) {
      borrowTrend.value = res.data.list;
    }
  } catch (err) {
    console.error('加载借阅趋势失败:', err);
  }
};

const loadHotBooks = async () => {
  try {
    const res = await getHotBooks({ limit: 10 });
    if (res.code === 200) {
      hotBooks.value = res.data.list;
    }
  } catch (err) {
    console.error('加载热门图书失败:', err);
  }
};

const loadCategoryDistribution = async () => {
  try {
    const res = await getCategoryDistribution();
    if (res.code === 200) {
      categoryDistribution.value = res.data.list;
    }
  } catch (err) {
    console.error('加载分类分布失败:', err);
  }
};

const showMessage = (msg, type = 'success') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};

onMounted(() => {
  loadOverview();
  loadBorrowTrend();
  loadHotBooks();
  loadCategoryDistribution();
});
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.card-icon {
  font-size: 36px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 8px;
}

.card-content {
  flex: 1;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.card-label {
  font-size: 14px;
  color: #666;
  margin-top: 4px;
}

.section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.section h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.chart-container {
  height: 200px;
}

.chart-bar-container {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: 100%;
  padding-bottom: 30px;
}

.chart-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  margin: 0 5px;
}

.chart-bar {
  width: 30px;
  background: linear-gradient(180deg, #409EFF 0%, #67C23A 100%);
  border-radius: 4px 4px 0 0;
  min-height: 5px;
  transition: height 0.3s;
}

.chart-label {
  font-size: 12px;
  color: #666;
  margin-top: 8px;
  position: absolute;
  bottom: 0;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background: #f5f7fa;
  font-weight: 600;
}

.rank-badge {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #e8e8e8;
  text-align: center;
  line-height: 24px;
  font-size: 12px;
  font-weight: bold;
  color: #666;
}

.rank-gold {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: #fff;
}

.rank-silver {
  background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
  color: #fff;
}

.rank-bronze {
  background: linear-gradient(135deg, #CD7F32, #B87333);
  color: #fff;
}

.category-pie {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.category-bar {
  height: 24px;
  border-radius: 4px;
  min-width: 20px;
  transition: width 0.3s;
}

.category-info {
  display: flex;
  justify-content: space-between;
  min-width: 150px;
}

.category-name {
  font-size: 14px;
  color: #333;
}

.category-count {
  font-size: 14px;
  color: #666;
}

.message-box {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 20px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  z-index: 9999;
}

.message-box.success {
  background: #67C23A;
}

.message-box.error {
  background: #F56C6C;
}
</style>
