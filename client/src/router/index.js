import { createRouter, createWebHashHistory } from 'vue-router'

// 引入页面组件
import Layout from '../layout/Layout.vue'
import Login from '../views/Login.vue'

// 用户管理
import UserList from '../views/user/UserList.vue'
import UserAdd from '../views/user/UserAdd.vue'

// 图书管理
import BookList from '../views/book/BookList.vue'
import BookAdd from '../views/book/BookAdd.vue'

// 借阅图书（用户功能）- 4.3.1~4.3.4
import BorrowBook from '../views/record/BorrowBook.vue'

// 借阅管理（管理员功能）- 4.3.5~4.3.7
import RecordManage from '../views/record/RecordManage.vue'

// 消息通知
import MessageList from '../views/message/MessageList.vue'

// 系统设置
import ConfigManage from '../views/config/ConfigManage.vue'

// 统计模块（管理员功能）- 4.4.1~4.4.4
import StatsOverview from '../views/stats/StatsOverview.vue'

const routes = [
  // 登录页面
  {
    path: '/login',
    name: 'Login',
    component: Login
  },

  // 首页 - 借阅管理
  {
    path: '/',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'Home',
        component: RecordManage
      }
    ]
  },

  // 用户管理
  {
    path: '/users',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'UserList',
        component: UserList
      },
      {
        path: 'add',
        name: 'UserAdd',
        component: UserAdd
      },
      {
        path: 'edit/:id',
        name: 'UserEdit',
        component: UserAdd
      }
    ]
  },

  // 图书管理
  {
    path: '/books',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'BookList',
        component: BookList
      },
      {
        path: 'add',
        name: 'BookAdd',
        component: BookAdd
      },
      {
        path: 'edit/:id',
        name: 'BookEdit',
        component: BookAdd
      }
    ]
  },

  // 借阅图书（用户功能）- 4.3.1~4.3.4
  {
    path: '/borrow',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'BorrowBook',
        component: BorrowBook
      }
    ]
  },

  // 借阅图书（用户功能）- 4.3.1~4.3.4
  {
    path: '/admin/borrow',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminBorrow',
        component: BorrowBook
      }
    ]
  },

  // 借阅管理（管理员功能）- 4.3.5~4.3.7
  {
    path: '/records',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'RecordManage',
        component: RecordManage
      }
    ]
  },

  // 借阅管理（管理员功能）- 兼容/admin/records路径
  {
    path: '/admin/records',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AdminRecords',
        component: RecordManage
      }
    ]
  },

  // 消息通知
  {
    path: '/messages',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'MessageList',
        component: MessageList
      }
    ]
  },

  // 系统设置
  {
    path: '/config',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'ConfigManage',
        component: ConfigManage
      }
    ]
  },

  // 统计模块（管理员功能）- 4.4.1~4.4.4
  {
    path: '/stats',
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'StatsOverview',
        component: StatsOverview
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 登录拦截
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // 需要登录的页面
  if (to.meta.requiresAuth) {
    if (token) {
      next()
    } else {
      next('/login')
    }
  } else {
    // 登录页面，如果已登录则跳转到首页
    if (to.path === '/login' && token) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
