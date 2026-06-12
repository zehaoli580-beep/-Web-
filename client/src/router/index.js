import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // ===== 官网首页（Landing Page） =====
  { path: '/', name: 'Landing', component: () => import('@/views/LandingPage.vue') },

  // ===== 系统（带侧边栏布局） =====
  {
    path: '/app',
    component: () => import('@/layout/AdminLayout.vue'),
    redirect: '/app/home',
    children: [
      // 系统首页（需登录）
      { path: 'home', name: 'Home', component: () => import('@/views/book/HomePage.vue'), meta: { requiresAuth: true } },

      // 图书浏览
      { path: 'books', name: 'BookSearch', component: () => import('@/views/book/BookSearch.vue') },
      { path: 'books/:id', name: 'BookDetail', component: () => import('@/views/book/BookDetail.vue') },

      // 用户模块
      { path: 'profile', name: 'Profile', component: () => import('@/views/user/ProfilePage.vue'), meta: { requiresAuth: true } },
      { path: 'messages', name: 'Messages', component: () => import('@/views/message/MessageList.vue'), meta: { requiresAuth: true } },

      // 管理员
      { path: 'admin/books', name: 'AdminBooks', component: () => import('@/views/book/BookManage.vue'), meta: { requiresAdmin: true } },
      { path: 'admin/categories', name: 'AdminCategories', component: () => import('@/views/book/CategoryManage.vue'), meta: { requiresAdmin: true } },
      { path: 'admin/users', name: 'AdminUsers', component: () => import('@/views/user/UserManage.vue'), meta: { requiresAdmin: true } },
      { path: 'admin/configs', name: 'AdminConfigs', component: () => import('@/views/user/ConfigPage.vue'), meta: { requiresAdmin: true } },
      { path: 'admin/records', name: 'AdminRecords', component: () => import('@/views/record/RecordManage.vue'), meta: { requiresAdmin: true } },
      { path: 'admin/stats', name: 'AdminStats', component: () => import('@/views/stats/StatsOverview.vue'), meta: { requiresAdmin: true } },
    ]
  },

  // ===== 认证页面（无侧边栏） =====
  { path: '/login', name: 'Login', component: () => import('@/views/user/LoginPage.vue') },
  { path: '/register', name: 'Register', component: () => import('@/views/user/RegisterPage.vue') },

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

  // 公开页面直接放行
  if (to.path === '/' || to.path === '/login' || to.path === '/register') {
    return next();
  }

  // 需要登录的页面
  if (to.meta.requiresAuth && !token) {
    return next('/login');
  }

  // 需要管理员权限的页面
  if (to.meta.requiresAdmin) {
    if (!token) return next('/login');
    if (!user || user.role !== 'admin') return next('/app/home');
    return next();
  }

  next();
});

export default router;
