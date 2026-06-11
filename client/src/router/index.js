import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  // 根路径重定向到首页（组员B实现首页后取消注释）
  { path: '/', redirect: '/books' },

  // TODO: 组员B - 首页
  // { path: '/', name: 'Home', component: () => import('@/views/book/HomePage.vue') },

  // 登录/注册
  { path: '/login', name: 'Login', component: () => import('@/views/user/LoginPage.vue') },
  { path: '/register', name: 'Register', component: () => import('@/views/user/RegisterPage.vue') },
  { path: '/profile', name: 'Profile', component: () => import('@/views/user/ProfilePage.vue') },
  // { path: '/messages', name: 'Messages', component: () => import('@/views/message/MessageList.vue') },

  // TODO: 组员B - 图书
  // { path: '/books', name: 'BookSearch', component: () => import('@/views/book/BookSearch.vue') },
  // { path: '/books/:id', name: 'BookDetail', component: () => import('@/views/book/BookDetail.vue') },

  // TODO: 组员C - 借阅
  // { path: '/admin/records', name: 'AdminRecords', component: () => import('@/views/record/RecordManage.vue') },
  // { path: '/admin/stats', name: 'AdminStats', component: () => import('@/views/record/StatsDashboard.vue') },

  // 管理后台
  { path: '/admin/users', name: 'AdminUsers', component: () => import('@/views/user/UserManage.vue') },
  // { path: '/admin/configs', name: 'AdminConfigs', component: () => import('@/views/user/ConfigPage.vue') },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// 路由守卫：需要登录才能访问的页面
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const publicPages = ['/login', '/register'];
  if (!token && !publicPages.includes(to.path)) {
    return next('/login');
  }
  next();
});

export default router;
