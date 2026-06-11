<template>
  <div class="config-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>系统参数配置</span>
        </div>
      </template>

      <el-table :data="configs" v-loading="loading" stripe empty-text="暂无参数">
        <el-table-column label="参数名称" prop="key" width="180" />
        <el-table-column label="说明" prop="description" min-width="200" />
        <el-table-column label="当前值" width="180">
          <template #default="{ row }">
            <el-input-number
              v-if="typeof row.value === 'number'"
              v-model="row.value"
              :min="0"
              :max="999"
              size="small"
            />
            <el-input v-else v-model="row.value" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleUpdate(row)">保存</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { getConfigs, updateConfig } from '@/api/config';

const configs = ref([]);
const loading = ref(false);

const fetchConfigs = async () => {
  loading.value = true;
  try {
    const res = await getConfigs();
    configs.value = res.data.list;
  } catch (err) {
    console.error('获取参数失败', err);
  } finally {
    loading.value = false;
  }
};

const handleUpdate = async (row) => {
  try {
    await updateConfig(row.key, { value: row.value });
    ElMessage.success(`参数"${row.key}"已更新`);
  } catch (err) {
    // 错误已由拦截器处理
  }
};

onMounted(() => {
  fetchConfigs();
});
</script>

<style scoped>
.config-page {
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  padding: 30px 20px;
  background-color: var(--bg-primary);
  box-sizing: border-box;
}

.config-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
}

:deep(.el-card__header) {
  border-bottom: 1px solid var(--border-light);
  padding: 16px 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

:deep(.el-card__body) {
  padding: 20px;
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

:deep(.el-input-number) {
  border-radius: var(--radius-md);
}

:deep(.el-input-number .el-input__wrapper) {
  border-radius: var(--radius-md);
}

:deep(.el-input__wrapper) {
  border-radius: var(--radius-md);
}
</style>
