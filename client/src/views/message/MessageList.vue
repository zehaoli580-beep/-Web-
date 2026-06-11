<template>
  <div class="message-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>消息中心</span>
          <el-button size="small" @click="handleReadAll">全部标记已读</el-button>
        </div>
      </template>

      <el-table :data="messages" v-loading="loading" stripe empty-text="暂无消息">
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
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getMessages, readMessage, readAll } from '@/api/message';

const messages = ref([]);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);

const typeMap = { reserve_notify: '预约通知', overdue_remind: '逾期提醒', due_remind: '到期提醒' };
const typeTag = { reserve_notify: 'success', overdue_remind: 'danger', due_remind: 'warning' };

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
});
</script>

<style scoped>
.message-page {
  max-width: 1000px;
  margin: 20px auto;
  padding: 0 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  font-weight: bold;
}
.unread-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dcdfe6;
  margin: 0 auto;
}
.unread-dot.active {
  background: #409eff;
}
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
