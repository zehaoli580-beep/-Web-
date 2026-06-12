<template>
  <nav class="sidebar">
    <div class="logo">
      <h2>图书管理系统</h2>
    </div>
    
    <ul class="menu">
      <!-- 用户管理 -->
      <li>
        <a href="#/users" class="nav-link" :class="{ active: currentPath.includes('/users') }">
          <span class="icon">👤</span>
          <span>用户管理</span>
        </a>
      </li>
      
      <!-- 图书管理 -->
      <li>
        <a href="#/books" class="nav-link" :class="{ active: currentPath.includes('/books') }">
          <span class="icon">📚</span>
          <span>图书管理</span>
        </a>
      </li>
      
      <!-- 借阅图书（用户功能） -->
      <li>
        <a href="#/borrow" class="nav-link" :class="{ active: currentPath.includes('/borrow') }">
          <span class="icon">📖</span>
          <span>借阅图书</span>
        </a>
      </li>
      
      <!-- 借阅管理（管理员功能） -->
      <li>
        <a href="#/records" class="nav-link" :class="{ active: currentPath.includes('/records') }">
          <span class="icon">📋</span>
          <span>借阅管理</span>
        </a>
      </li>
      
      <!-- 消息通知 -->
      <li>
        <a href="#/messages" class="nav-link" :class="{ active: currentPath.includes('/messages') }">
          <span class="icon">🔔</span>
          <span>消息通知</span>
        </a>
      </li>
      
      <!-- 系统设置 -->
      <li>
        <a href="#/config" class="nav-link" :class="{ active: currentPath.includes('/config') }">
          <span class="icon">⚙️</span>
          <span>系统设置</span>
        </a>
      </li>
    </ul>
    
    <div class="logout">
      <button @click="handleLogout" class="logout-btn">
        <span class="icon">🚪</span>
        <span>退出登录</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const currentPath = ref(window.location.hash);

const handleHashChange = () => {
  currentPath.value = window.location.hash;
};

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/#/login';
};

onMounted(() => {
  window.addEventListener('hashchange', handleHashChange);
});

onUnmounted(() => {
  window.removeEventListener('hashchange', handleHashChange);
});
</script>

<style scoped>
.sidebar {
  width: 200px;
  min-height: 100vh;
  background: linear-gradient(180deg, #2c3e50 0%, #34495e 100%);
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo h2 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.nav-link.active {
  background: rgba(64, 158, 255, 0.3);
  color: white;
  border-left: 3px solid #409eff;
}

.icon {
  margin-right: 10px;
  font-size: 16px;
}

.logout {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  background: rgba(238, 77, 77, 0.2);
  border: none;
  border-radius: 6px;
  color: #ee4d4d;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background: rgba(238, 77, 77, 0.3);
}
</style>
