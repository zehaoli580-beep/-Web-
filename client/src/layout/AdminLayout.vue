<template>
  <el-container class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapsed ? '64px' : '220px'" class="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">
          <span class="logo-icon">📚</span>
          <span class="logo-text" v-show="!isCollapsed">图书管理系统</span>
        </div>
      </div>

      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        router
        class="sidebar-menu"
        background-color="#1d1e26"
        text-color="rgba(255,255,255,0.65)"
        active-text-color="#409eff"
      >
        <!-- 公共菜单 -->
        <div class="menu-group-title" v-show="!isCollapsed">导航</div>
        <el-menu-item index="/app/home">
          <el-icon><HomeFilled /></el-icon>
          <span>系统首页</span>
        </el-menu-item>
        <el-menu-item index="/app/books">
          <el-icon><Search /></el-icon>
          <span>图书检索</span>
        </el-menu-item>
        <el-menu-item index="/app/profile">
          <el-icon><UserFilled /></el-icon>
          <span>个人中心</span>
        </el-menu-item>
        <el-menu-item index="/app/messages">
          <el-icon><Message /></el-icon>
          <span>消息中心</span>
          <el-badge :value="unreadCount" :hidden="unreadCount <= 0" slot="title" class="msg-badge" />
        </el-menu-item>

        <!-- 管理员菜单 -->
        <template v-if="userStore.isAdmin">
          <div class="menu-group-title" v-show="!isCollapsed">管理</div>
          <el-menu-item index="/app/admin/books">
            <el-icon><Reading /></el-icon>
            <span>图书管理</span>
          </el-menu-item>
          <el-menu-item index="/app/admin/categories">
            <el-icon><CollectionTag /></el-icon>
            <span>分类管理</span>
          </el-menu-item>
          <el-menu-item index="/app/admin/users">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="/app/admin/records">
            <el-icon><List /></el-icon>
            <span>借阅管理</span>
          </el-menu-item>
          <el-menu-item index="/app/admin/stats">
            <el-icon><DataAnalysis /></el-icon>
            <span>统计看板</span>
          </el-menu-item>
          <el-menu-item index="/app/admin/configs">
            <el-icon><Setting /></el-icon>
            <span>系统配置</span>
          </el-menu-item>
        </template>
      </el-menu>

      <!-- 侧边栏底部收缩按钮 -->
      <div class="sidebar-collapse" @click="isCollapsed = !isCollapsed">
        <el-icon :class="{ rotated: isCollapsed }"><DArrowLeft /></el-icon>
        <span v-show="!isCollapsed">收起侧栏</span>
      </div>
    </el-aside>

    <!-- 右侧主区域 -->
    <el-container class="main-area">
      <!-- 顶部栏 -->
      <el-header class="topbar" :class="{ collapsed: isCollapsed }">
        <div class="topbar-left">
          <el-breadcrumb>
            <el-breadcrumb-item :to="{ path: '/app/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentPageTitle">{{ currentPageTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="topbar-right">
          <!-- 官网入口 -->
          <el-tooltip content="返回官网首页" placement="bottom">
            <el-button text circle @click="$router.push('/')">
              <el-icon><HomeFilled /></el-icon>
            </el-button>
          </el-tooltip>

          <!-- 消息 -->
          <el-tooltip content="消息中心" placement="bottom">
            <el-button text circle @click="$router.push('/app/messages')" class="msg-btn">
              <el-badge :value="unreadCount" :hidden="unreadCount <= 0" :max="99">
                <el-icon><Bell /></el-icon>
              </el-badge>
            </el-button>
          </el-tooltip>

          <!-- 用户信息 -->
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-dropdown">
              <el-avatar :size="32" class="user-avatar">
                {{ userStore.userInfo?.name?.charAt(0) || '?' }}
              </el-avatar>
              <span class="user-name">{{ userStore.userInfo?.name || '用户' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">
                  <el-icon><UserFilled /></el-icon> 个人中心
                </el-dropdown-item>
                <el-dropdown-item command="logout" divided>
                  <el-icon><SwitchButton /></el-icon> 退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="content-area">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/store/user';
import { ElMessageBox } from 'element-plus';
import {
  HomeFilled, Search, UserFilled, Message, Reading,
  CollectionTag, User, List, DataAnalysis, Setting,
  Bell, ArrowDown, SwitchButton, DArrowLeft
} from '@element-plus/icons-vue';
import { getUnreadCount } from '@/api/message';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const isCollapsed = ref(false);
const unreadCount = ref(0);

const pageTitles = {
  '/app/home': '系统首页',
  '/app/books': '图书检索',
  '/app/books/:id': '图书详情',
  '/app/profile': '个人中心',
  '/app/messages': '消息中心',
  '/app/admin/books': '图书管理',
  '/app/admin/categories': '分类管理',
  '/app/admin/users': '用户管理',
  '/app/admin/records': '借阅管理',
  '/app/admin/stats': '统计看板',
  '/app/admin/configs': '系统配置'
};

const activeMenu = computed(() => {
  const path = route.path;
  // 匹配精确路由，处理 /books/:id 等动态路由
  if (path.startsWith('/app/books/') && path !== '/app/books') {
    return '/app/books';
  }
  return path;
});

const currentPageTitle = computed(() => {
  return pageTitles[activeMenu.value] || '';
});

async function fetchUnreadCount() {
  try {
    if (userStore.isLoggedIn) {
      const res = await getUnreadCount();
      if (res.code === 200) unreadCount.value = res.data?.count || 0;
    }
  } catch (err) {
    // 忽略错误
  }
}

function handleCommand(command) {
  if (command === 'profile') {
    router.push('/app/profile');
  } else if (command === 'logout') {
    ElMessageBox.confirm('确定要退出登录吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      userStore.logout();
      router.push('/login');
    }).catch(() => {});
  }
}

onMounted(() => {
  fetchUnreadCount();
  // 每60秒刷新未读数
  setInterval(fetchUnreadCount, 60000);
});
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

/* ===== 侧边栏 ===== */
.sidebar {
  background: #1d1e26;
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  overflow: hidden;
  border-right: 1px solid rgba(255,255,255,0.05);
}

.sidebar-header {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  flex-shrink: 0;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}
.logo-icon {
  font-size: 24px;
}
.logo-text {
  font-size: 16px;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
}

.sidebar-menu {
  flex: 1;
  overflow-y: auto;
  border-right: none;
  padding: 8px 0;
}

.menu-group-title {
  padding: 16px 20px 6px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.25);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.sidebar-menu .el-menu-item {
  margin: 2px 8px;
  border-radius: 8px;
  height: 42px;
  line-height: 42px;
  transition: all 0.2s;
}

.sidebar-menu .el-menu-item:hover {
  background: rgba(255,255,255,0.06) !important;
  color: rgba(255,255,255,0.9) !important;
}

.sidebar-menu .el-menu-item.is-active {
  background: rgba(64,158,255,0.12) !important;
  color: #409eff !important;
}

.msg-badge {
  margin-left: auto;
}

/* 收缩按钮 */
.sidebar-collapse {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-top: 1px solid rgba(255,255,255,0.06);
  cursor: pointer;
  color: rgba(255,255,255,0.35);
  font-size: 13px;
  transition: color 0.2s;
  flex-shrink: 0;
}
.sidebar-collapse:hover {
  color: rgba(255,255,255,0.7);
}
.sidebar-collapse .el-icon {
  transition: transform 0.3s;
}
.sidebar-collapse .rotated {
  transform: rotate(180deg);
}

/* ===== 主区域 ===== */
.main-area {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 顶部栏 */
.topbar {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  flex-shrink: 0;
}

.topbar-left {
  display: flex;
  align-items: center;
}

.topbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
  transition: background 0.2s;
}
.user-dropdown:hover {
  background: #f5f7fa;
}

.user-avatar {
  background: linear-gradient(135deg, #409eff, #337ecc);
  font-size: 14px;
}

.user-name {
  font-size: 14px;
  color: #303133;
  font-weight: 500;
}

/* 内容区 */
.content-area {
  background: #f5f7fa;
  overflow-y: auto;
  padding: 0;
}

/* 消息按钮 */
.msg-btn .el-badge {
  line-height: 1;
}

/* 修改 Element Plus 默认样式 */
:deep(.el-menu) {
  border-right: none;
}
:deep(.el-breadcrumb) {
  font-size: 14px;
}
</style>
