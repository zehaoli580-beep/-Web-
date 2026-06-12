<template>
  <div class="register-container">
    <el-card class="register-card">
      <h2 class="title">图书管理系统 - 注册</h2>
      <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" size="large">
        <el-form-item label="学号" prop="username">
          <el-input v-model="form.username" placeholder="请输入学号/工号" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" type="password" show-password placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="form.confirmPassword" type="password" show-password placeholder="请再次输入密码" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="form.role" placeholder="请选择身份" style="width: 100%">
            <el-option label="学生" value="student" />
            <el-option label="教师" value="teacher" />
          </el-select>
        </el-form-item>
        <el-form-item label="学院" prop="college">
          <el-input v-model="form.college" placeholder="请输入所属学院" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号（选填）" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱（选填）" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister" :loading="loading" style="width: 100%">
            注册
          </el-button>
        </el-form-item>
      </el-form>
      <div class="footer">
        已有账号？<router-link to="/login">去登录</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { register } from '@/api/user';

const router = useRouter();
const formRef = ref(null);
const loading = ref(false);

const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  name: '',
  role: 'student',
  college: '',
  phone: '',
  email: ''
});

const validateConfirmPassword = (rule, value, callback) => {
  if (value !== form.password) {
    callback(new Error('两次输入的密码不一致'));
  } else {
    callback();
  }
};

const rules = {
  username: [{ required: true, message: '请输入学号/工号', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
  ],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  role: [{ required: true, message: '请选择身份', trigger: 'change' }],
  college: [{ required: true, message: '请输入学院', trigger: 'blur' }]
};

const handleRegister = async () => {
  const valid = await formRef.value.validate().catch(() => false);
  if (!valid) return;

  loading.value = true;
  try {
    const res = await register({
      username: form.username,
      password: form.password,
      name: form.name,
      role: form.role,
      college: form.college,
      phone: form.phone,
      email: form.email
    });
    ElMessage.success('注册成功，请登录');
    router.push('/login');
  } catch (err) {
    const msg = err.response?.data?.message || '注册失败，请稍后重试';
    ElMessage.error(msg);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
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

.register-card {
  width: 460px;
  max-height: 90vh;
  overflow-y: auto;
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

:deep(.el-select .el-input__wrapper) {
  border-radius: var(--radius-md);
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
  margin-bottom: 16px;
}
</style>
