<template>
  <div class="message-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>消息中心</span>
          <el-button size="small" @click="handleReadAll">全部标记已读</el-button>
        </div>
      </template>

      <div class="message-table-wrapper">
        <el-table :data="messages" v-loading="loading" stripe empty-text="暂无消息" :height="tableHeight">
          <el-table-column label="状态" width="60">
            <template #default="{ row }">
              <div :class="['unread-dot', { active: !row.isRead }]"></div>
            </template>
          </el-table-column>
          <el-table-column label="类型" width="110">
            <template #default="{ row }">
              <el-tag :type="typeTag[row.type]" size="small">{{ typeMap[row.type] }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="标题" prop="title" min-width="160" />
          <el-table-column label="内容" prop="content" min-width="260" show-overflow-tooltip />
          <el-table-column label="时间" width="110">
            <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
          </el-table-column>
          <el-table-column label="操作" width="90" fixed="right">
            <template #default="{ row }">
              <el-button v-if="!row.isRead" size="small" @click="handleRead(row)">标记已读</el-button>
              <span v-else style="color:#909399;font-size:13px">已读</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="fetchMessages"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getMessages, readMessage, readAll } from '@/api/message';

const messages = ref([]);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);
const tableHeight = ref(400);

const typeMap = { reserve_notify: '预约通知', overdue_remind: '逾期提醒', due_remind: '到期提醒' };
const typeTag = { reserve_notify: 'success', overdue_remind: 'danger', due_remind: 'warning' };

const updateTableHeight = () => {
  const headerHeight = 60;
  const paginationHeight = 60;
  const padding = 80;
  tableHeight.value = window.innerHeight - headerHeight - paginationHeight - padding;
};

const fetchMessages = async () => {
  loading.value = true;
  try {
    const res = await getMessages({ page: page.value, pageSize: pageSize.value });
    messages.value = res.data.list;
    total.value = res.data.total;
  } catch (err) {
    console.error('获取消息失败', err);
  } finally {
    loading.value = false;
  }
};

const handleRead = async (row) => {
  try {
    await readMessage(row.id);
    row.isRead = true;
  } catch (err) {
    // 错误已由拦截器处理
  }
};

const handleReadAll = async () => {
  try {
    await readAll();
    ElMessage.success('全部标记为已读');
    fetchMessages();
  } catch (err) {
    // 错误已由拦截器处理
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('zh-CN');
};

onMounted(() => {
  fetchMessages();
  updateTableHeight();
  window.addEventListener('resize', updateTableHeight);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateTableHeight);
});
</script>

<style scoped>
.message-page {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  padding: 30px 20px;
  background-color: var(--bg-primary);
  box-sizing: border-box;
}

.message-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
}

:deep(.el-card__header) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-light);
  padding: 16px 20px;
  flex-shrink: 0;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

:deep(.el-card__body) {
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.message-table-wrapper {
  flex: 1;
  overflow-y: auto;
}

.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border-color);
  margin: 0 auto;
  transition: all var(--transition-fast);
}

.unread-dot.active {
  background: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 111, 165, 0.2);
}

:deep(.el-table) {
  font-size: 13px;
  border-radius: var(--radius-md);
  overflow: hidden;
}

:deep(.el-table thead tr) {
  background: var(--border-light);
}

:deep(.el-table th) {
  color: var(--text-secondary);
  font-weight: 500;
  padding: 12px 16px;
}

:deep(.el-table td) {
  padding: 12px 16px;
}

:deep(.el-table tr:hover > td) {
  background: rgba(74, 111, 165, 0.05) !important;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped) {
  background: rgba(74, 111, 165, 0.03);
}

:deep(.el-button--primary) {
  border-radius: var(--radius-md);
  background: var(--primary-gradient);
  border: none;
}

:deep(.el-button--primary:hover) {
  box-shadow: 0 4px 12px rgba(74, 111, 165, 0.3);
}

:deep(.el-button) {
  border-radius: var(--radius-md);
}

.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

:deep(.el-pagination) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.el-pagination button) {
  border-radius: var(--radius-sm);
}

:deep(.el-pagination .el-pager li) {
  border-radius: var(--radius-sm);
}

:deep(.el-pagination .el-pager li.is-active) {
  background: var(--primary-color);
}
</style>
