<template>
  <div class="profile-page">
    <div class="profile-layout">
      <aside class="profile-sidebar">
        <div class="sidebar-header">
          <div class="avatar-wrapper">
            <div class="avatar">
              <span>{{ userInfo.name?.charAt(0) || '?' }}</span>
            </div>
            <div class="user-name">{{ userInfo.name }}</div>
            <el-tag :type="userInfo.role === 'admin' ? 'danger' : 'primary'" size="small" class="role-tag">
              {{ roleMap[userInfo.role] || userInfo.role }}
            </el-tag>
          </div>
        </div>
        
        <div class="sidebar-stats">
          <div class="stat-item">
            <div class="stat-value">{{ userInfo.borrowCount }}</div>
            <div class="stat-label">当前借阅</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ userInfo.status === 'active' ? '正常' : '禁用' }}</div>
            <div class="stat-label">账号状态</div>
          </div>
        </div>

        <div class="sidebar-actions">
          <el-button type="primary" size="small" block @click="openEditDialog">修改信息</el-button>
          <el-button size="small" block @click="openPasswordDialog">修改密码</el-button>
        </div>
      </aside>

      <main class="profile-content">
        <el-card class="info-card">
          <template #header>
            <span class="card-title">基本信息</span>
          </template>

          <el-descriptions :column="2" border size="small">
            <el-descriptions-item label="学号">{{ userInfo.username }}</el-descriptions-item>
            <el-descriptions-item label="姓名">{{ userInfo.name }}</el-descriptions-item>
            <el-descriptions-item label="身份">
              <el-tag :type="userInfo.role === 'admin' ? 'danger' : 'primary'" size="small">
                {{ roleMap[userInfo.role] || userInfo.role }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="学院">{{ userInfo.college }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ userInfo.phone || '未填写' }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userInfo.email || '未填写' }}</el-descriptions-item>
            <el-descriptions-item label="注册时间" :span="2">{{ formatDate(userInfo.createdAt) }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card class="records-card">
          <template #header>
            <span class="card-title">我的借阅记录</span>
          </template>

          <el-tabs v-model="activeTab" @tab-change="fetchRecords" class="records-tabs">
            <el-tab-pane label="借阅中" name="borrowed"></el-tab-pane>
            <el-tab-pane label="已归还" name="returned"></el-tab-pane>
            <el-tab-pane label="全部" name=""></el-tab-pane>
          </el-tabs>

          <el-table :data="records" v-loading="recordsLoading" stripe empty-text="暂无借阅记录" class="records-table">
            <el-table-column label="书名" prop="bookTitle" min-width="180" />
            <el-table-column label="借书日期" width="110">
              <template #default="{ row }">{{ formatDate(row.borrowDate) }}</template>
            </el-table-column>
            <el-table-column label="应还日期" width="110">
              <template #default="{ row }">{{ formatDate(row.dueDate) }}</template>
            </el-table-column>
            <el-table-column label="状态" width="90">
              <template #default="{ row }">
                <el-tag :type="statusType[row.status]" size="small">{{ statusMap[row.status] }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="罚款" width="70">
              <template #default="{ row }">{{ row.fine ? '¥' + row.fine : '-' }}</template>
            </el-table-column>
          </el-table>
        </el-card>
      </main>
    </div>

    <!-- 修改信息弹窗 -->
    <el-dialog v-model="editDialogVisible" title="修改个人信息" width="420px">
      <el-form :model="editForm" label-width="80px">
        <el-form-item label="手机号">
          <el-input v-model="editForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editForm.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="editDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleUpdateInfo" :loading="editLoading">保存</el-button>
      </template>
    </el-dialog>

    <!-- 修改密码弹窗 -->
    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="420px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="80px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password placeholder="请输入旧密码" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password placeholder="请再次输入新密码" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleChangePassword" :loading="passwordLoading">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getMe, updateMe, changePassword, getMyRecords } from '@/api/user';

const userInfo = ref({});
const roleMap = { student: '学生', teacher: '教师', admin: '管理员' };

// 借阅记录
const activeTab = ref('borrowed');
const records = ref([]);
const recordsLoading = ref(false);
const statusMap = { borrowed: '借阅中', returned: '已归还', overdue: '已逾期', reserved: '预约中' };
const statusType = { borrowed: 'warning', returned: 'success', overdue: 'danger', reserved: 'info' };

const fetchRecords = async () => {
  recordsLoading.value = true;
  try {
    const params = { page: 1, pageSize: 20 };
    if (activeTab.value) params.status = activeTab.value;
    const res = await getMyRecords(params);
    records.value = res.data.list;
  } catch (err) {
    console.error('获取借阅记录失败', err);
  } finally {
    recordsLoading.value = false;
  }
};

// 修改信息
const editDialogVisible = ref(false);
const editLoading = ref(false);
const editForm = reactive({ phone: '', email: '' });

// 修改密码
const passwordDialogVisible = ref(false);
const passwordLoading = ref(false);
const passwordFormRef = ref(null);
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});
const passwordRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    { validator: (rule, value, callback) => {
      if (value !== passwordForm.newPassword) callback(new Error('两次输入的密码不一致'));
      else callback();
    }, trigger: 'blur' }
  ]
};

const fetchUserInfo = async () => {
  try {
    const res = await getMe();
    userInfo.value = res.data;
  } catch (err) {
    console.error('获取用户信息失败', err);
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('zh-CN');
};

const openEditDialog = () => {
  editForm.phone = userInfo.value.phone || '';
  editForm.email = userInfo.value.email || '';
  editDialogVisible.value = true;
};

const handleUpdateInfo = async () => {
  editLoading.value = true;
  try {
    await updateMe({ phone: editForm.phone, email: editForm.email });
    ElMessage.success('修改成功');
    editDialogVisible.value = false;
    fetchUserInfo();
  } catch (err) {
    // 错误已在响应拦截器中处理
  } finally {
    editLoading.value = false;
  }
};

const openPasswordDialog = () => {
  passwordForm.oldPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  passwordDialogVisible.value = true;
};

const handleChangePassword = async () => {
  const valid = await passwordFormRef.value.validate().catch(() => false);
  if (!valid) return;

  passwordLoading.value = true;
  try {
    await changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword
    });
    ElMessage.success('密码修改成功');
    passwordDialogVisible.value = false;
  } catch (err) {
    // 错误已在响应拦截器中处理
  } finally {
    passwordLoading.value = false;
  }
};

onMounted(() => {
  fetchUserInfo();
  fetchRecords();
});
</script>

<style scoped>
.profile-page {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  padding: 30px 20px;
  background-color: var(--bg-primary);
  box-sizing: border-box;
}

.profile-layout {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  gap: 24px;
  height: calc(100vh - 60px);
}

.profile-sidebar {
  width: 280px;
  flex-shrink: 0;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sidebar-header {
  padding: 24px;
  background: linear-gradient(135deg, #5c7a99 0%, #7a94b3 50%, #8a9eb8 100%);
  text-align: center;
}

.avatar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  font-size: 32px;
  color: #fff;
  font-weight: 600;
}

.user-name {
  font-size: 20px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.role-tag {
  background: rgba(255, 255, 255, 0.25) !important;
  border: none !important;
  color: #fff !important;
}

.sidebar-stats {
  display: flex;
  padding: 20px;
  gap: 16px;
  border-bottom: 1px solid var(--border-light);
}

.stat-item {
  flex: 1;
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  color: var(--text-secondary);
}

.sidebar-actions {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.profile-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow-y: auto;
}

.info-card,
.records-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--border-light);
  padding: 16px 20px;
}

:deep(.el-card__body) {
  padding: 20px;
}

.records-tabs {
  margin-bottom: 16px;
}

:deep(.el-tabs__header) {
  margin-bottom: 0;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border-light);
}

:deep(.el-tabs__item) {
  font-size: 14px;
  color: var(--text-secondary);
}

:deep(.el-tabs__item.is-active) {
  color: var(--primary-color);
}

:deep(.el-table) {
  font-size: 13px;
}

:deep(.el-table thead tr) {
  background: var(--border-light);
}

:deep(.el-table th) {
  color: var(--text-secondary);
  font-weight: 500;
}

:deep(.el-table tr:hover > td) {
  background: rgba(74, 111, 165, 0.05) !important;
}

:deep(.el-button--primary) {
  border-radius: var(--radius-md);
}

:deep(.el-button) {
  border-radius: var(--radius-md);
}

@media (max-width: 768px) {
  .profile-layout {
    flex-direction: column;
  }
  
  .profile-sidebar {
    width: 100%;
  }
}
</style>
