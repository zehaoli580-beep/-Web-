<template>
  <div class="book-manage-page">
    <header class="page-header">
      <div class="header-inner">
        <h1>📚 图书管理</h1>
        <div class="header-right">
          <el-button @click="$router.push('/')">返回首页</el-button>
          <el-button type="primary" @click="openAddDialog">+ 新增图书</el-button>
        </div>
      </div>
    </header>

    <div class="page-content">
      <!-- 搜索筛选 -->
      <div class="search-bar">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索书名/作者/出版社/ISBN"
          style="width: 320px"
          clearable
          @keyup.enter="handleSearch"
        />
        <el-select v-model="searchForm.category" placeholder="全部分类" clearable style="width: 160px">
          <el-option v-for="cat in categories" :key="cat._id" :label="cat.name" :value="cat.name" />
        </el-select>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>

      <!-- 图书表格 -->
      <el-table :data="books" v-loading="loading" stripe border style="width: 100%">
        <el-table-column prop="isbn" label="ISBN" width="140" />
        <el-table-column prop="title" label="书名" min-width="180" show-overflow-tooltip />
        <el-table-column prop="author" label="作者" width="140" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column label="馆藏" width="100" align="center">
          <template #default="{ row }">
            <span :class="row.available > 0 ? 'text-available' : 'text-borrowed'">
              {{ row.available }}/{{ row.total }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="borrowTimes" label="借阅次数" width="90" align="center" />
        <el-table-column label="状态" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row.status === 'removed'" type="danger" size="small">已下架</el-tag>
            <el-tag v-else-if="row.available > 0" type="success" size="small">在馆</el-tag>
            <el-tag v-else type="warning" size="small">借出</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="openEditDialog(row)">编辑</el-button>
            <el-button
              size="small"
              :type="row.status === 'removed' ? 'success' : 'danger'"
              :disabled="row.status === 'removed'"
              link
              @click="handleRemove(row)"
            >
              {{ row.status === 'removed' ? '已下架' : '下架' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination-wrap">
        <el-pagination
          v-model:current-page="pagination.page"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          layout="prev, pager, next, total, jumper"
          @current-change="fetchBooks"
        />
      </div>
    </div>

    <!-- 新增/编辑弹窗 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑图书' : '新增图书'"
      width="650px"
      :close-on-click-modal="false"
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="ISBN" prop="isbn">
              <el-input v-model="form.isbn" :disabled="isEdit" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="书名" prop="title">
              <el-input v-model="form.title" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="作者" prop="author">
              <el-input v-model="form.author" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出版社" prop="publisher">
              <el-input v-model="form.publisher" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="出版年份" prop="year">
              <el-input-number v-model="form.year" :min="1900" :max="new Date().getFullYear()" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="分类" prop="category">
              <el-select v-model="form.category" placeholder="请选择分类" style="width: 100%">
                <el-option v-for="cat in categories" :key="cat._id" :label="cat.name" :value="cat.name" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="馆藏数量" prop="total">
              <el-input-number v-model="form.total" :min="1" :max="999" style="width: 100%" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="馆藏位置" prop="location">
              <el-input v-model="form.location" placeholder="例：A区3楼5号架" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="封面URL">
          <el-input v-model="form.cover" placeholder="可选" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="form.description" type="textarea" :rows="3" placeholder="可选" />
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
import { useRouter } from 'vue-router';
import { ElMessage, ElMessageBox } from 'element-plus';
import { getBooks, createBook, updateBook, removeBook } from '@/api/book';
import { getCategories } from '@/api/category';

const router = useRouter();

const books = ref([]);
const categories = ref([]);
const loading = ref(false);
const submitLoading = ref(false);
const dialogVisible = ref(false);
const isEdit = ref(false);
const formRef = ref(null);

const pagination = ref({
  page: 1,
  pageSize: 10,
  total: 0,
  totalPages: 0
});

const searchForm = ref({
  keyword: '',
  category: ''
});

const defaultForm = {
  isbn: '',
  title: '',
  author: '',
  publisher: '',
  year: new Date().getFullYear(),
  category: '',
  total: 1,
  location: '',
  cover: '',
  description: ''
};

const form = ref({ ...defaultForm });

const rules = {
  isbn: [{ required: true, message: '请输入ISBN', trigger: 'blur' }],
  title: [{ required: true, message: '请输入书名', trigger: 'blur' }],
  author: [{ required: true, message: '请输入作者', trigger: 'blur' }],
  publisher: [{ required: true, message: '请输入出版社', trigger: 'blur' }],
  year: [{ required: true, message: '请输入出版年份', trigger: 'blur' }],
  category: [{ required: true, message: '请选择分类', trigger: 'change' }],
  total: [{ required: true, message: '请输入馆藏数量', trigger: 'blur' }],
  location: [{ required: true, message: '请输入馆藏位置', trigger: 'blur' }]
};

function handleSearch() {
  pagination.value.page = 1;
  fetchBooks();
}

function resetSearch() {
  searchForm.value = { keyword: '', category: '' };
  pagination.value.page = 1;
  fetchBooks();
}

async function fetchBooks() {
  loading.value = true;
  try {
    const params = {
      page: pagination.value.page,
      pageSize: pagination.value.pageSize
    };
    if (searchForm.value.keyword) params.keyword = searchForm.value.keyword;
    if (searchForm.value.category) params.category = searchForm.value.category;

    const res = await getBooks(params);
    if (res.data) {
      books.value = res.data.books;
      pagination.value = res.data.pagination;
    }
  } catch (err) {
    console.error('获取图书列表失败:', err);
  } finally {
    loading.value = false;
  }
}

function openAddDialog() {
  isEdit.value = false;
  form.value = { ...defaultForm, year: new Date().getFullYear() };
  dialogVisible.value = true;
}

function openEditDialog(row) {
  isEdit.value = true;
  form.value = {
    isbn: row.isbn,
    title: row.title,
    author: row.author,
    publisher: row.publisher,
    year: row.year,
    category: row.category,
    total: row.total,
    location: row.location,
    cover: row.cover || '',
    description: row.description || ''
  };
  form.value._id = row._id;
  dialogVisible.value = true;
}

async function handleSubmit() {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  submitLoading.value = true;
  try {
    if (isEdit.value) {
      await updateBook(form.value._id, form.value);
      ElMessage.success('图书更新成功');
    } else {
      await createBook(form.value);
      ElMessage.success('图书添加成功');
    }
    dialogVisible.value = false;
    fetchBooks();
  } catch (err) {
    console.error('提交失败:', err);
  } finally {
    submitLoading.value = false;
  }
}

async function handleRemove(row) {
  try {
    await ElMessageBox.confirm(
      `确定要下架《${row.title}》吗？下架后不可恢复。`,
      '确认下架',
      { confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning' }
    );
    await removeBook(row._id);
    ElMessage.success('图书已下架');
    fetchBooks();
  } catch (err) {
    if (err !== 'cancel') console.error('下架失败:', err);
  }
}

onMounted(async () => {
  try {
    const catRes = await getCategories();
    if (catRes.data) categories.value = catRes.data;
  } catch (err) {
    console.error('加载分类失败:', err);
  }
  fetchBooks();
});
</script>

<style scoped>
.book-manage-page {
  min-height: 100vh;
  background: #f5f7fa;
}
.page-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}
.header-inner {
  max-width: 1200px;
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
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}
.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
.text-available { color: #67c23a; font-weight: 600; }
.text-borrowed { color: #f56c6c; font-weight: 600; }
</style>
