<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="title">图书管理系统 - 登录</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" size="large">
        <el-form-item label="学号" prop="username">
          <el-input v-model="form.username" placeholder="请输入学号/工号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" @keyup.enter="handleLogin" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" :loading="loading" style="width: 100%">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      <div class="footer">
        还没有账号？<router-link to="/register">去注册</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login } from '@/api/user';
import { useUserStore } from '@/store/user';

const router = useRouter();
const userStore = useUserStore();
const formRef = ref(null);
const loading = ref(false);

const form = reactive({
  username: '',
  password: ''
});

const rules = {
  username: [{ required: true, message: '请输入学号/工号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};

const handleLogin = async () => {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  loading.value = true;
  try {
    const res = await login({
      username: form.username,
      password: form.password
    });
    // 保存 Token 和用户信息
    userStore.setToken(res.data.token);
    userStore.setUserInfo(res.data.user);
    ElMessage.success('登录成功');
    router.push('/profile');
  } catch (err) {
    const msg = err.response?.data?.message || '登录失败，请稍后重试';
    ElMessage.error(msg);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  min-height: 100vh;
  background: 
    radial-gradient(ellipse at 20% 20%, rgba(92, 122, 153, 0.08) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(122, 148, 179, 0.06) 0%, transparent 50%),
    linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
  padding: 20px;
  box-sizing: border-box;
}

@keyframes bgMove {
  0% { background-position: 0 0; }
  100% { background-position: 60px 60px; }
}

.login-card {
  width: 420px;
  padding: 32px;
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-light);
  animation: cardFadeIn 0.5s ease;
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.title {
  text-align: center;
  margin-bottom: 28px;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 2px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.footer {
  text-align: center;
  color: var(--text-secondary);
  font-size: 14px;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border-light);
}

.footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: color var(--transition-fast);
}

.footer a:hover {
  color: var(--primary-dark);
}

:deep(.el-input__wrapper) {
  border-radius: var(--radius-md);
  border-color: var(--border-color);
  transition: all var(--transition-fast);
}

:deep(.el-input__wrapper:hover) {
  border-color: var(--primary-light);
}

:deep(.el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 3px rgba(74, 111, 165, 0.1);
  border-color: var(--primary-color);
}

:deep(.el-button--primary) {
  border-radius: var(--radius-md);
  background: var(--primary-gradient);
  border: none;
  height: 44px;
  font-weight: 500;
  transition: all var(--transition-fast);
}

:deep(.el-button--primary:hover) {
  box-shadow: 0 4px 12px rgba(74, 111, 165, 0.3);
  transform: translateY(-1px);
}

:deep(.el-button--primary:active) {
  transform: translateY(0);
}

:deep(.el-form-item) {
  margin-bottom: 0;
}
</style>
