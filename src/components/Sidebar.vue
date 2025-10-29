<template>
  <div class="sidebar" :class="{ open: isMobileMenuOpen }">
    <div class="sidebar-header">
      <div class="flex items-center">
        <div class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-3">
          <i class="fas fa-project-diagram text-white text-sm"></i>
        </div>
        <div>
          <h1 class="text-lg font-bold text-gray-800">流程引擎</h1>
          <p class="text-xs text-gray-500">Workflow Engine</p>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link to="/dashboard" class="sidebar-nav-item" active-class="active">
        <i class="fas fa-tachometer-alt"></i>
        仪表板
      </router-link>
      <router-link to="/process-list" class="sidebar-nav-item" active-class="active">
        <i class="fas fa-sitemap"></i>
        流程管理
      </router-link>
      <router-link to="/designer" class="sidebar-nav-item" active-class="active">
        <i class="fas fa-drafting-compass"></i>
        流程设计器
      </router-link>
      <router-link to="/forms" class="sidebar-nav-item" active-class="active">
        <i class="fas fa-clipboard-list"></i>
        表单管理
      </router-link>
      <router-link to="/my-work" class="sidebar-nav-item" active-class="active">
        <i class="fas fa-inbox"></i>
        我的待办
      </router-link>
      <router-link to="/reports" class="sidebar-nav-item" active-class="active">
        <i class="fas fa-chart-bar"></i>
        报告分析
      </router-link>
      <router-link to="/users" class="sidebar-nav-item" active-class="active">
        <i class="fas fa-users"></i>
        用户管理
      </router-link>
      <router-link to="/settings" class="sidebar-nav-item" active-class="active">
        <i class="fas fa-cog"></i>
        系统设置
      </router-link>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'Sidebar',
  data() {
    return {
      isMobileMenuOpen: false
    }
  }
}
</script>

<style scoped>
.sidebar-nav-item.active {
  background-color: var(--primary-50);
  color: var(--primary-700);
  border-right: 3px solid var(--primary-600);
}
</style>
