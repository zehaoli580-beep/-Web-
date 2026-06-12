<template>
  <div class="page-container">
    <h2>借阅图书</h2>
    
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

    <!-- 借书申请 -->
    <div v-show="activeTab === 'borrow'" class="tab-content">
      <h3>借书申请</h3>
      <div class="form-container">
        <div class="form-item">
          <label>图书ID</label>
          <input type="text" v-model="borrowForm.bookId" placeholder="请输入图书ID" />
        </div>
        <button @click="handleBorrow" class="btn-primary">提交申请</button>
      </div>
    </div>

    <!-- 续借 -->
    <div v-show="activeTab === 'renew'" class="tab-content">
      <h3>续借图书</h3>
      <div class="form-container">
        <div class="form-item">
          <label>借阅记录ID</label>
          <input type="text" v-model="renewForm.recordId" placeholder="请输入借阅记录ID" />
        </div>
        <button @click="handleRenew" class="btn-primary">续借</button>
      </div>
    </div>

    <!-- 预约图书 -->
    <div v-show="activeTab === 'reserve'" class="tab-content">
      <h3>预约图书</h3>
      <div class="form-container">
        <div class="form-item">
          <label>图书ID</label>
          <input type="text" v-model="reserveForm.bookId" placeholder="请输入图书ID" />
        </div>
        <button @click="handleReserve" class="btn-primary">预约</button>
      </div>
    </div>

    <!-- 我的借阅记录 -->
    <div v-show="activeTab === 'myRecords'" class="tab-content">
      <h3>我的借阅记录</h3>
      <table class="data-table">
        <thead>
          <tr>
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
          <tr v-for="record in myRecords" :key="record._id">
            <td>{{ record.bookId?.title || '未知' }}</td>
            <td>{{ formatDate(record.borrowDate) }}</td>
            <td>{{ formatDate(record.dueDate) }}</td>
            <td>{{ formatDate(record.returnDate) || '-' }}</td>
            <td :class="getStatusClass(record.status)">{{ getStatusText(record.status) }}</td>
            <td>{{ record.fine || 0 }}元</td>
            <td>
              <button v-if="record.status === 'borrowed' && !record.renewed" @click="handleRenewById(record._id)" class="btn-small">续借</button>
              <span v-else-if="record.renewed" class="text-disabled">已续借</span>
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
import { borrowBook, renewBook, reserveBook, getMyRecords } from '../../api/record';

const tabs = [
  { key: 'borrow', label: '借书申请' },
  { key: 'renew', label: '续借' },
  { key: 'reserve', label: '预约图书' },
  { key: 'myRecords', label: '我的借阅' }
];

const activeTab = ref('borrow');
const message = ref('');
const messageType = ref('success');

const borrowForm = ref({ bookId: '' });
const renewForm = ref({ recordId: '' });
const reserveForm = ref({ bookId: '' });
const myRecords = ref([]);

const showMessage = (msg, type = 'success') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => { message.value = ''; }, 3000);
};

const handleBorrow = async () => {
  if (!borrowForm.value.bookId) {
    showMessage('请输入图书ID', 'error');
    return;
  }
  try {
    const res = await borrowBook({ bookId: borrowForm.value.bookId });
    if (res.code === 201) {
      showMessage(res.message);
      borrowForm.value.bookId = '';
    } else {
      showMessage(res.message, 'error');
    }
  } catch (err) {
    showMessage('借书失败，请检查网络连接', 'error');
  }
};

const handleRenew = async () => {
  if (!renewForm.value.recordId) {
    showMessage('请输入借阅记录ID', 'error');
    return;
  }
  await doRenew(renewForm.value.recordId);
};

const handleRenewById = async (recordId) => {
  await doRenew(recordId);
};

const doRenew = async (recordId) => {
  try {
    const res = await renewBook(recordId);
    if (res.code === 200) {
      showMessage(res.message);
      renewForm.value.recordId = '';
      loadMyRecords();
    } else {
      showMessage(res.message, 'error');
    }
  } catch (err) {
    showMessage('续借失败', 'error');
  }
};

const handleReserve = async () => {
  if (!reserveForm.value.bookId) {
    showMessage('请输入图书ID', 'error');
    return;
  }
  try {
    const res = await reserveBook({ bookId: reserveForm.value.bookId });
    if (res.code === 201) {
      showMessage(res.message);
      reserveForm.value.bookId = '';
    } else {
      showMessage(res.message, 'error');
    }
  } catch (err) {
    showMessage('预约失败', 'error');
  }
};

const loadMyRecords = async () => {
  try {
    const res = await getMyRecords();
    if (res.code === 200) {
      myRecords.value = res.data.list;
    }
  } catch (err) {
    console.error('加载借阅记录失败');
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

onMounted(() => {
  loadMyRecords();
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

.form-container {
  max-width: 400px;
}

.form-item {
  margin-bottom: 16px;
}

.form-item label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-item input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.btn-primary {
  padding: 10px 24px;
  background: #409eff;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-primary:hover {
  background: #66b1ff;
}

.btn-small {
  padding: 6px 12px;
  background: #67c23a;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
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

.text-disabled {
  color: #ccc;
  font-size: 12px;
}

.message-box {
  margin-top: 16px;
  padding: 12px;
  border-radius: 6px;
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
