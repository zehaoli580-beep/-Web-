<template>
  <div class="page-container">
    <h2>借阅管理</h2>
    
    <!-- 标签页切换 -->
    <div class="tabs">
      <button 
        v-for="tab in tabs" 
        :key="tab.key"
        @click="activeTab = tab.key"
        :class="{ active: activeTab === tab.key }"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 所有借阅记录 -->
    <div v-show="activeTab === 'all'" class="tab-content">
      <h3>所有借阅记录</h3>
      <div class="filter-bar">
        <select v-model="allFilter.status">
          <option value="">全部状态</option>
          <option value="borrowed">借阅中</option>
          <option value="returned">已归还</option>
          <option value="overdue">已逾期</option>
          <option value="pending">待确认</option>
          <option value="reserved">预约中</option>
        </select>
        <button @click="loadAllRecords" class="btn-primary">查询</button>
      </div>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>用户姓名</th>
            <th>书名</th>
            <th>借阅日期</th>
            <th>应还日期</th>
            <th>归还日期</th>
            <th>状态</th>
            <th>罚款</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in allRecords" :key="record._id">
            <td>{{ record.userId?.name || '未知' }}</td>
            <td>{{ record.bookId?.title || '未知' }}</td>
            <td>{{ formatDate(record.borrowDate) }}</td>
            <td>{{ formatDate(record.dueDate) }}</td>
            <td>{{ formatDate(record.returnDate) || '-' }}</td>
            <td :class="getStatusClass(record.status)">{{ getStatusText(record.status) }}</td>
            <td>{{ record.fine || 0 }}元</td>
            <td>
              <button v-if="record.status === 'borrowed' || record.status === 'overdue'" @click="handleReturn(record._id)" class="btn-success">确认归还</button>
              <button v-if="record.status === 'pending'" @click="handleConfirmBorrow(record._id)" class="btn-primary">确认借书</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 待确认借书列表 -->
    <div v-show="activeTab === 'pendingBorrows'" class="tab-content">
      <h3>待确认借书列表</h3>
      <button @click="loadPendingBorrows" class="btn-primary">刷新</button>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>用户姓名</th>
            <th>书名</th>
            <th>申请日期</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in pendingBorrows" :key="record._id">
            <td>{{ record.userId?.name || '未知' }}</td>
            <td>{{ record.bookId?.title || '未知' }}</td>
            <td>{{ formatDate(record.borrowDate) }}</td>
            <td>
              <button @click="handleConfirmBorrow(record._id)" class="btn-primary">确认借书</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 待确认还书列表 -->
    <div v-show="activeTab === 'pendingReturns'" class="tab-content">
      <h3>待确认还书列表</h3>
      <button @click="loadPendingReturns" class="btn-primary">刷新</button>
      
      <table class="data-table">
        <thead>
          <tr>
            <th>用户姓名</th>
            <th>书名</th>
            <th>借阅日期</th>
            <th>应还日期</th>
            <th>逾期天数</th>
            <th>预计罚款</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in pendingReturns" :key="record._id">
            <td>{{ record.userId?.name || '未知' }}</td>
            <td>{{ record.bookId?.title || '未知' }}</td>
            <td>{{ formatDate(record.borrowDate) }}</td>
            <td>{{ formatDate(record.dueDate) }}</td>
            <td :class="{ 'text-red': getOverdueDays(record.dueDate) > 0 }">{{ getOverdueDays(record.dueDate) }}</td>
            <td>{{ calculateFine(record.dueDate) }}元</td>
            <td>
              <button @click="handleReturn(record._id)" class="btn-success">确认归还</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 消息提示 -->
    <div v-if="message" :class="['message-box', messageType]">{{ message }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getRecords, getPendingBorrows, getPendingReturns, returnBook, confirmBorrow } from '../../api/record';

const tabs = [
  { key: 'all', label: '所有借阅记录' },
  { key: 'pendingBorrows', label: '待确认借书' },
  { key: 'pendingReturns', label: '待确认还书' }
];

const activeTab = ref('all');
const message = ref('');
const messageType = ref('success');

const allFilter = ref({ status: '' });
const allRecords = ref([]);
const pendingBorrows = ref([]);
const pendingReturns = ref([]);

const showMessage = (msg, type = 'success') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => { message.value = ''; }, 3000);
};

const loadAllRecords = async () => {
  try {
    const params = { page: 1, pageSize: 100 };
    if (allFilter.value.status) {
      params.status = allFilter.value.status;
    }
    const res = await getRecords(params);
    if (res.code === 200) {
      allRecords.value = res.data.list;
    }
  } catch (err) {
    showMessage('加载失败', 'error');
  }
};

const loadPendingBorrows = async () => {
  try {
    const res = await getPendingBorrows({ page: 1, pageSize: 100 });
    if (res.code === 200) {
      pendingBorrows.value = res.data.list;
    }
  } catch (err) {
    showMessage('加载失败', 'error');
  }
};

const loadPendingReturns = async () => {
  try {
    const res = await getPendingReturns({ page: 1, pageSize: 100 });
    if (res.code === 200) {
      pendingReturns.value = res.data.list;
    }
  } catch (err) {
    showMessage('加载失败', 'error');
  }
};

const handleConfirmBorrow = async (recordId) => {
  if (!confirm('确认借书？')) return;
  try {
    const res = await confirmBorrow(recordId);
    if (res.code === 200) {
      showMessage(res.message);
      loadAllRecords();
      loadPendingBorrows();
    } else {
      showMessage(res.message, 'error');
    }
  } catch (err) {
    showMessage('操作失败', 'error');
  }
};

const handleReturn = async (recordId) => {
  if (!confirm('确认归还？')) return;
  try {
    const res = await returnBook(recordId);
    if (res.code === 200) {
      showMessage(res.message);
      loadAllRecords();
      loadPendingReturns();
    } else {
      showMessage(res.message, 'error');
    }
  } catch (err) {
    showMessage('操作失败', 'error');
  }
};

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('zh-CN');
};

const getStatusText = (status) => {
  const map = {
    'borrowed': '借阅中',
    'returned': '已归还',
    'overdue': '已逾期',
    'reserved': '预约中',
    'pending': '待确认'
  };
  return map[status] || status;
};

const getStatusClass = (status) => {
  const map = {
    'borrowed': 'status-borrowed',
    'returned': 'status-returned',
    'overdue': 'status-overdue',
    'reserved': 'status-reserved',
    'pending': 'status-pending'
  };
  return map[status] || '';
};

const getOverdueDays = (dueDate) => {
  if (!dueDate) return 0;
  const now = new Date();
  const due = new Date(dueDate);
  const diff = Math.floor((now - due) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
};

const calculateFine = (dueDate) => {
  const days = getOverdueDays(dueDate);
  return days * 0.5;
};

onMounted(() => {
  loadAllRecords();
});
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.tabs button {
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tabs button.active {
  color: #409eff;
  border-bottom-color: #409eff;
}

.tab-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.tab-content h3 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #333;
}

.filter-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.filter-bar select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-primary {
  padding: 8px 20px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #66b1ff;
}

.btn-success {
  padding: 6px 12px;
  background: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

.btn-success:hover {
  background: #85ce61;
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

.status-borrowed { color: #e6a23c; }
.status-returned { color: #67c23a; }
.status-overdue { color: #f56c6c; }
.status-reserved { color: #909399; }
.status-pending { color: #409eff; }

.text-red { color: #f56c6c; }

.message-box {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  border-radius: 6px;
  z-index: 1000;
}

.message-box.success {
  background: #f0f9eb;
  color: #67c23a;
}

.message-box.error {
  background: #fef0f0;
  color: #f56c6c;
}
</style>
