<template>
  <div class="config-container">
    <div class="page-header">
      <h2>系统参数管理</h2>
      <p>管理图书馆系统的各项配置参数</p>
    </div>

    <div class="message" :class="messageType" v-if="message">
      {{ message }}
    </div>

    <div class="config-list">
      <div class="config-card" v-for="config in configs" :key="config.key">
        <div class="config-info">
          <h3>{{ config.key }}</h3>
          <p>{{ config.description }}</p>
        </div>
        <div class="config-value">
          <input 
            type="text" 
            v-model="editingConfig[config.key]"
            class="value-input"
          />
        </div>
        <div class="config-actions">
          <button class="btn btn-primary" @click="saveConfig(config.key)">
            保存
          </button>
          <button class="btn btn-secondary" @click="cancelEdit(config.key)">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { getConfigs, updateConfig } from '../../api/config';

const configs = ref([]);
const editingConfig = reactive({});
const message = ref('');
const messageType = ref('success');

const showMessage = (msg, type = 'success') => {
  message.value = msg;
  messageType.value = type;
  setTimeout(() => {
    message.value = '';
  }, 3000);
};

const loadConfigs = async () => {
  try {
    const res = await getConfigs();
    if (res.code === 200) {
      configs.value = res.data.list;
      // 初始化编辑状态
      configs.value.forEach(config => {
        editingConfig[config.key] = config.value;
      });
    }
  } catch (err) {
    console.error('加载系统参数失败:', err);
    showMessage('加载失败', 'error');
  }
};

const saveConfig = async (key) => {
  try {
    const value = editingConfig[key];
    const res = await updateConfig(key, { value });
    if (res.code === 200) {
      showMessage('参数更新成功');
      loadConfigs();
    }
  } catch (err) {
    console.error('更新参数失败:', err);
    showMessage('更新失败', 'error');
  }
};

const cancelEdit = (key) => {
  const config = configs.value.find(c => c.key === key);
  if (config) {
    editingConfig[key] = config.value;
  }
};

onMounted(() => {
  loadConfigs();
});
</script>

<style scoped>
.config-container {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 5px;
}

.page-header p {
  color: #666;
}

.message {
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

.message.success {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.message.error {
  background-color: #ffebee;
  color: #c62828;
}

.config-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.config-card {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 20px;
}

.config-info {
  flex: 1;
}

.config-info h3 {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
}

.config-info p {
  font-size: 14px;
  color: #666;
}

.config-value {
  flex: 1;
}

.value-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.value-input:focus {
  outline: none;
  border-color: #409EFF;
}

.config-actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #409EFF;
  color: #fff;
}

.btn-primary:hover {
  background-color: #67b8ff;
}

.btn-secondary {
  background-color: #f5f5f5;
  color: #666;
}

.btn-secondary:hover {
  background-color: #e8e8e8;
}
</style>
