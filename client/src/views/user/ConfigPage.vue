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
  max-width: 800px;
  margin: 20px auto;
  padding: 0 20px;
}
.card-header {
  font-size: 18px;
  font-weight: bold;
}
</style>
