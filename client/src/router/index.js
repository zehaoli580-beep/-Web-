import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // ===== 首页（组员B） =====
  { path: '/', name: 'Home', component: () => import('@/views/book/HomePage.vue') },

  // ===== 图书浏览（组员B，公开） =====
  { path: '/books', name: 'BookSearch', component: () => import('@/views/book/BookSearch.vue') },
  { path: '/books/:id', name: 'BookDetail', component: () => import('@/views/book/BookDetail.vue') },

  // ===== 图书管理（组员B，管理员） =====
  { path: '/admin/books', name: 'AdminBooks', component: () => import('@/views/book/BookManage.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/categories', name: 'AdminCategories', component: () => import('@/views/book/CategoryManage.vue'), meta: { requiresAdmin: true } },

  // ===== 用户模块（组员A） =====
  { path: '/login', name: 'Login', component: () => import('@/views/user/LoginPage.vue') },
  { path: '/register', name: 'Register', component: () => import('@/views/user/RegisterPage.vue') },
  { path: '/profile', name: 'Profile', component: () => import('@/views/user/ProfilePage.vue') },
  { path: '/messages', name: 'Messages', component: () => import('@/views/message/MessageList.vue') },

  // ===== 用户管理后台（组员A，管理员） =====
  { path: '/admin/users', name: 'AdminUsers', component: () => import('@/views/user/UserManage.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/configs', name: 'AdminConfigs', component: () => import('@/views/user/ConfigPage.vue'), meta: { requiresAdmin: true } },

  // ===== 借阅模块（组员C） =====
  { path: '/admin/records', name: 'AdminRecords', component: () => import('@/views/record/RecordManage.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/stats', name: 'AdminStats', component: () => import('@/views/record/StatsDashboard.vue'), meta: { requiresAdmin: true } },

  // ===== 404 =====
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // 公开页面，直接放行
  if (!to.meta.requiresAdmin) {
    return next();
  }

  // 需要管理员权限的页面
  if (!token) {
    return next('/login');
  }
  if (!user || user.role !== 'admin') {
    return next('/');
  }

  next();
});

export default router;
