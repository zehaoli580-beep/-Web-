<template>
  <div class="user-manage-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户管理</span>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" class="search-form">
        <el-form-item>
          <el-input v-model="keyword" placeholder="搜索学号或姓名" clearable @clear="search" @keyup.enter="search" />
        </el-form-item>
        <el-form-item>
          <el-select v-model="statusFilter" placeholder="全部状态" clearable @change="search" style="width:140px">
            <el-option label="正常" value="active" />
            <el-option label="已禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search">搜索</el-button>
        </el-form-item>
      </el-form>

      <!-- 用户表格 -->
      <el-table :data="users" v-loading="loading" stripe empty-text="暂无用户">
        <el-table-column label="学号" prop="username" width="120" />
        <el-table-column label="姓名" prop="name" width="120" />
        <el-table-column label="身份" width="80">
          <template #default="{ row }">
            <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'" size="small">
              {{ row.role === 'admin' ? '管理员' : row.role === 'teacher' ? '教师' : '学生' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="学院" prop="college" min-width="150" />
        <el-table-column label="手机号" prop="phone" width="130" />
        <el-table-column label="当前借阅" prop="borrowCount" width="90" />
        <el-table-column label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'" size="small">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="110">
          <template #default="{ row }">{{ formatDate(row.createdAt) }}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button
              :type="row.status === 'active' ? 'warning' : 'success'"
              size="small"
              @click="toggleStatus(row)"
            >
              {{ row.status === 'active' ? '禁用' : '激活' }}
            </el-button>
            <el-button size="small" @click="openResetDialog(row)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrapper">
        <el-pagination
          v-model:current-page="page"
          v-model:page-size="pageSize"
          :total="total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @size-change="fetchUsers"
          @current-change="fetchUsers"
        />
      </div>
    </el-card>

    <!-- 重置密码弹窗 -->
    <el-dialog v-model="resetDialogVisible" title="重置密码" width="400px">
      <el-form :model="resetForm" :rules="resetRules" ref="resetFormRef">
        <el-form-item label="用户名" label-width="80px">
          <el-input :model-value="resetUser?.name" disabled />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword" label-width="80px">
          <el-input v-model="resetForm.newPassword" type="password" show-password placeholder="请输入新密码（至少6位）" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="resetDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleResetPassword" :loading="resetLoading">确认重置</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getUsers, updateUserStatus, resetPassword } from '@/api/user';

const users = ref([]);
const loading = ref(false);
const page = ref(1);
const pageSize = ref(20);
const total = ref(0);
const keyword = ref('');
const statusFilter = ref('');

// 重置密码
const resetDialogVisible = ref(false);
const resetLoading = ref(false);
const resetUser = ref(null);
const resetFormRef = ref(null);
const resetForm = ref({ newPassword: '' });
const resetRules = {
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
};

const fetchUsers = async () => {
  loading.value = true;
  try {
    const params = { page: page.value, pageSize: pageSize.value };
    if (keyword.value) params.keyword = keyword.value;
    if (statusFilter.value) params.status = statusFilter.value;
    const res = await getUsers(params);
    users.value = res.data.list;
    total.value = res.data.total;
  } catch (err) {
    console.error('获取用户列表失败', err);
  } finally {
    loading.value = false;
  }
};

const search = () => {
  page.value = 1;
  fetchUsers();
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('zh-CN');
};

const toggleStatus = async (row) => {
  const action = row.status === 'active' ? '禁用' : '激活';
  try {
    await ElMessageBox.confirm(`确定要${action}用户"${row.name}"吗？`, '提示');
    await updateUserStatus(row._id, {
      status: row.status === 'active' ? 'disabled' : 'active'
    });
    ElMessage.success(`${action}成功`);
    fetchUsers();
  } catch (err) {
    if (err !== 'cancel') console.error(err);
  }
};

const openResetDialog = (row) => {
  resetUser.value = row;
  resetForm.value = { newPassword: '' };
  resetDialogVisible.value = true;
};

const handleResetPassword = async () => {
  const valid = await resetFormRef.value.validate().catch(() => false);
  if (!valid) return;

  resetLoading.value = true;
  try {
    await resetPassword(resetUser.value._id, { newPassword: resetForm.value.newPassword });
    ElMessage.success(`用户"${resetUser.value.name}"的密码已重置`);
    resetDialogVisible.value = false;
  } catch (err) {
    // 错误已在响应拦截器中处理
  } finally {
    resetLoading.value = false;
  }
};

onMounted(() => {
  fetchUsers();
});
</script>

<style scoped>
.user-manage-page {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}
.card-header {
  font-size: 18px;
  font-weight: bold;
}
.search-form {
  margin-bottom: 10px;
}
.pagination-wrapper {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
