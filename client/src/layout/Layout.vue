<template>
  <el-container style="height: 100vh;">
    <!-- 左侧边栏 -->
    <el-aside width="200px" style="background-color: #304156;">
      <el-menu
        mode="vertical"
        :default-active="$route.path"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <el-menu-item index="/admin/borrow">
          <span class="icon">📖</span>
          <span>借阅图书</span>
        </el-menu-item>

        <el-menu-item index="/admin/records">
          <span class="icon">📋</span>
          <span>借阅管理</span>
        </el-menu-item>

        <!-- 用户管理 -->
        <el-menu-item index="/users">
          <span class="icon">👤</span>
          <span>用户管理</span>
        </el-menu-item>

        <!-- 图书管理 -->
        <el-menu-item index="/books">
          <span class="icon">📚</span>
          <span>图书管理</span>
        </el-menu-item>

        <!-- 统计模块 -->
        <el-menu-item index="/stats">
          <span class="icon">📊</span>
          <span>统计模块</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 右侧主区域 -->
    <el-container>
      <el-header style="height: 50px; line-height: 50px; border-bottom: 1px solid #eee;">
        图书管理系统 - 后台管理
      </el-header>
      <el-main>
        <!-- 子页面在这里显示 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.icon {
  font-size: 18px;
  margin-right: 8px;
}
</style>