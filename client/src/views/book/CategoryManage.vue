<template>
  <div class="category-manage-page">
    <header class="page-header">
      <div class="header-inner">
        <h1>🏷️ 分类管理</h1>
        <div class="header-right">
          <el-button @click="$router.push('/app')">返回首页</el-button>
          <el-button type="primary" @click="openAddDialog">+ 新增分类</el-button>
        </div>
      </div>
    </header>

    <div class="page-content">
      <el-card shadow="never">
        <el-table :data="categories" v-loading="loading" stripe border style="width: 100%">
          <el-table-column type="index" label="#" width="60" align="center" />
          <el-table-column prop="name" label="分类名称" min-width="200" />
          <el-table-column prop="createdAt" label="创建时间" width="180">
            <template #default="{ row }">
              {{ formatDate(row.createdAt) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" align="center">
            <template #default="{ row }">
              <el-button size="small" type="primary" link @click="openEditDialog(row)">编辑</el-button>
              <el-button size="small" type="danger" link @click="handleDelete(row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-empty v-if="!loading && categories.length === 0" description="暂无分类" />
      </el-card>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑分类' : '新增分类'"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" maxlength="20" show-word-limit />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/category';

const categories = ref([]);
const loading = ref(false);
const submitLoading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref(null);
const form = ref({ name: '' });

const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' },
    { min: 1, max: 20, message: '分类名称不超过20个字符', trigger: 'blur' }
  ]
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

async function fetchCategories() {
  loading.value = true;
  try {
    const res = await getCategories();
    if (res.data) categories.value = res.data;
  } catch (err) {
    console.error('获取分类失败:', err);
  } finally {
    loading.value = false;
  }
}

function openAddDialog() {
  isEdit.value = false;
  form.value = { name: '' };
  dialogVisible.value = true;
}

function openEditDialog(row) {
  isEdit.value = true;
  form.value = { name: row.name, _id: row._id };
  dialogVisible.value = true;
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  submitLoading.value = true;
  try {
    if (isEdit.value) {
      await updateCategory(form.value._id, { name: form.value.name });
      ElMessage.success('分类更新成功');
    } else {
      await createCategory({ name: form.value.name });
      ElMessage.success('分类创建成功');
    }
    dialogVisible.value = false;
    fetchCategories();
  } catch (err) {
    console.error('提交失败:', err);
  } finally {
    submitLoading.value = false;
  }
}

async function handleDelete(row) {
  try {
    await ElMessageBox.confirm(
      `确定要删除分类「${row.name}」吗？`,
      '确认删除',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    );
    await deleteCategory(row._id);
    ElMessage.success('分类已删除');
    fetchCategories();
  } catch (err) {
    if (err !== 'cancel') console.error('删除失败:', err);
  }
}

onMounted(() => {
  fetchCategories();
});
</script>

<style scoped>
.category-manage-page {
  min-height: 100vh;
  background: #f5f7fa;
}
.page-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.header-inner {
  max-width: 800px;
  margin: 0 auto;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header-inner h1 {
  font-size: 20px;
  color: #303133;
}
.header-right {
  display: flex;
  gap: 10px;
}
.page-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
</style>
