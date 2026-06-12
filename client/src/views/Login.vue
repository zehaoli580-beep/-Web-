<template>
  <div class="login-container">
    <div class="login-box">
      <h2>图书管理系统</h2>
      <h3>{{ isLoginMode ? '管理员登录' : '用户注册' }}</h3>
      
      <div class="login-form">
        <div class="form-item">
          <label>用户名</label>
          <input 
            type="text" 
            v-model="username" 
            placeholder="请输入用户名"
            class="form-input"
          />
        </div>
        
        <div class="form-item" v-if="!isLoginMode">
          <label>真实姓名</label>
          <input 
            type="text" 
            v-model="name" 
            placeholder="请输入真实姓名"
            class="form-input"
          />
        </div>
        
        <div class="form-item" v-if="!isLoginMode">
          <label>所属学院</label>
          <input 
            type="text" 
            v-model="college" 
            placeholder="请输入学院名称"
            class="form-input"
          />
        </div>
        
        <div class="form-item">
          <label>密码</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="请输入密码"
            class="form-input"
          />
        </div>
        
        <div class="form-item" v-if="!isLoginMode">
          <label>确认密码</label>
          <input 
            type="password" 
            v-model="confirmPassword" 
            placeholder="请再次输入密码"
            class="form-input"
          />
        </div>
        
        <button type="button" @click="handleSubmit" class="login-btn">
          {{ isLoginMode ? '登录' : '注册' }}
        </button>
      </div>
      
      <div class="mode-switch">
        <span>{{ isLoginMode ? '还没有账号？' : '已有账号？' }}</span>
        <button type="button" @click="toggleMode" class="switch-btn">
          {{ isLoginMode ? '立即注册' : '立即登录' }}
        </button>
      </div>
      
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const isLoginMode = ref(true);
const username = ref('');
const password = ref('');
const name = ref('');
const college = ref('');
const confirmPassword = ref('');
const errorMessage = ref('');
const successMessage = ref('');

const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  errorMessage.value = '';
  successMessage.value = '';
};

const handleSubmit = async () => {
  errorMessage.value = '';
  successMessage.value = '';
  
  console.log('按钮已点击，模式:', isLoginMode.value);
  console.log('用户名:', username.value);
  console.log('密码:', password.value);
  
  if (isLoginMode.value) {
    await handleLogin();
  } else {
    await handleRegister();
  }
};

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMessage.value = '请输入用户名和密码';
    return;
  }
  
  try {
    console.log('开始登录请求...');
    const res = await axios.post('/api/v1/users/login', { 
      username: username.value, 
      password: password.value 
    });
    console.log('登录响应:', res.data);
    
    if (res.data.code === 200) {
      localStorage.setItem('token', res.data.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.data.user));
      successMessage.value = '登录成功，正在跳转...';
      setTimeout(() => {
        window.location.href = '/';
      }, 1000);
    } else {
      errorMessage.value = res.data.message || '登录失败';
    }
  } catch (err) {
    console.error('登录错误:', err);
    errorMessage.value = '登录失败，请检查网络连接或确认账号密码正确';
  }
};

const handleRegister = async () => {
  if (!username.value || !password.value || !name.value || !college.value) {
    errorMessage.value = '请填写所有必填项';
    return;
  }
  
  if (password.value !== confirmPassword.value) {
    errorMessage.value = '两次输入的密码不一致';
    return;
  }
  
  try {
    const res = await axios.post('/api/v1/users/register', { 
      username: username.value, 
      password: password.value,
      name: name.value,
      college: college.value
    });
    
    if (res.data.code === 201) {
      successMessage.value = '注册成功，请登录';
      isLoginMode.value = true;
      username.value = '';
      password.value = '';
      name.value = '';
      college.value = '';
      confirmPassword.value = '';
    } else {
      errorMessage.value = res.data.message || '注册失败';
    }
  } catch (err) {
    console.error('注册错误:', err);
    errorMessage.value = '注册失败，请检查网络连接';
  }
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  width: 400px;
}

.login-box h2 {
  text-align: center;
  color: #333;
  margin-bottom: 8px;
}

.login-box h3 {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
  font-weight: normal;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #409eff;
}

.login-btn {
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: opacity 0.2s;
}

.login-btn:hover {
  opacity: 0.9;
}

.mode-switch {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  font-size: 14px;
  color: #666;
}

.switch-btn {
  background: none;
  border: none;
  color: #409eff;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background: #fef0f0;
  color: #f56c6c;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
}

.success-message {
  margin-top: 16px;
  padding: 12px;
  background: #f0f9eb;
  color: #67c23a;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
}
</style>
