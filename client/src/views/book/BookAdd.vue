<template>
  <div class="page-container">
    <h2>{{ isEdit ? '编辑图书' : '添加图书' }}</h2>
    <p>图书表单页面 - 功能开发中...</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const isEdit = ref(false);
</script>

<style scoped>
.page-container {
  padding: 20px;
}
</style>
