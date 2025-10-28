<template>
  <div>
    <!-- 页面头部 -->
    <header class="page-header">
      <div>
        <!-- 面包屑导航 -->
        <div class="breadcrumb">
          <div class="breadcrumb-item">
            <i class="fas fa-sitemap"></i>
            <router-link to="/process-list">流程管理</router-link>
          </div>
          <span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>
          <div class="breadcrumb-item">
            <span class="breadcrumb-current" id="currentFilterName">{{ currentFilterName }}</span>
          </div>
        </div>
        <h1 class="page-title" id="pageTitle">{{ currentFilterName }}</h1>
        <p class="page-subtitle">共 {{ totalCount }} 个流程</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn btn-secondary" @click="$router.go(-1)">
          <i class="fas fa-arrow-left"></i>
          返回
        </button>
        <button class="btn btn-secondary">
          <i class="fas fa-file-export"></i>
          导出
        </button>
        <button class="btn btn-primary" @click="$router.push('/designer')">
          <i class="fas fa-plus"></i>
          创建流程
        </button>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="p-6 relative">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-overlay">
        <div class="loading-spinner"></div>
      </div>

      <!-- 搜索和筛选栏 -->
      <div class="card mb-6" style="padding: 20px;">
        <div class="search-filter-row" style="padding: 0;">
          <!-- 搜索框 -->
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input
              type="text"
              placeholder="搜索流程名称、描述、创建者..."
              v-model="searchQuery"
              @input="handleSearch"
            >
          </div>

          <!-- 右侧操作 -->
          <div class="filter-actions">
            <!-- 视图切换 -->
            <div class="view-toggle">
              <button
                class="view-toggle-btn"
                :class="{ active: viewMode === 'card' }"
                @click="switchView('card')"
              >
                <i class="fas fa-th-large"></i>
              </button>
              <button
                class="view-toggle-btn active"
                :class="{ active: viewMode === 'list' }"
                @click="switchView('list')"
              >
                <i class="fas fa-list"></i>
              </button>
            </div>

            <!-- 排序 -->
            <select class="form-select sort-select" v-model="sortBy" @change="handleSort">
              <option value="updated">最近更新</option>
              <option value="created">创建时间</option>
              <option value="name-asc">名称 A-Z</option>
              <option value="name-desc">名称 Z-A</option>
              <option value="instances">实例数量</option>
            </select>

            <!-- 高级筛选按钮 -->
            <button class="btn btn-secondary" @click="toggleAdvancedFilters()">
              <i class="fas fa-filter"></i>
              筛选
            </button>
          </div>
        </div>

        <!-- 快速筛选标签 -->
        <div class="flex items-center gap-2 mt-4 flex-wrap">
          <span class="text-sm text-gray-600">快速筛选：</span>
          <button
            v-for="filter in quickFilters"
            :key="filter.key"
            class="filter-tab"
            :class="{ active: activeFilter === filter.key }"
            @click="quickFilter(filter.key)"
          >
            <i v-if="filter.icon" :class="filter.icon" class="mr-1"></i>
            {{ filter.label }} ({{ filter.count }})
          </button>
        </div>
      </div>

      <!-- 批量操作栏 -->
      <div v-if="selectedProcesses.length > 0" class="bulk-actions">
        <div class="bulk-actions-left">
          <i class="fas fa-check-circle"></i>
          <span>已选择 <strong>{{ selectedProcesses.length }}</strong> 个流程</span>
        </div>
        <div class="bulk-actions-right">
          <button class="bulk-btn" @click="bulkAction('enable')">
            <i class="fas fa-check"></i>
            启用
          </button>
          <button class="bulk-btn" @click="bulkAction('disable')">
            <i class="fas fa-ban"></i>
            停用
          </button>
          <button class="bulk-btn" @click="bulkAction('export')">
            <i class="fas fa-download"></i>
            导出
          </button>
          <button class="bulk-btn" @click="bulkAction('delete')">
            <i class="fas fa-trash"></i>
            删除
          </button>
          <button class="bulk-btn" @click="clearSelection()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- 流程列表（表格视图） -->
      <div v-if="viewMode === 'list'" class="process-table">
        <table class="table">
          <thead>
            <tr>
              <th class="checkbox-cell">
                <input type="checkbox" class="form-checkbox" v-model="selectAll" @change="toggleSelectAll">
              </th>
              <th class="sortable" @click="sortByField('name')">
                流程名称
                <i class="fas fa-sort sort-icon"></i>
              </th>
              <th>状态</th>
              <th class="sortable" @click="sortByField('creator')">
                创建者
                <i class="fas fa-sort sort-icon"></i>
              </th>
              <th class="sortable" @click="sortByField('instances')">
                实例数
                <i class="fas fa-sort sort-icon"></i>
              </th>
              <th>统计信息</th>
              <th class="sortable" @click="sortByField('updated')">
                最后更新
                <i class="fas fa-sort sort-icon"></i>
              </th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="process in filteredProcesses" :key="process.id">
              <td class="checkbox-cell">
                <input type="checkbox" class="form-checkbox" v-model="selectedProcesses" :value="process.id">
              </td>
              <td>
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm">
                    <i :class="process.icon"></i>
                  </div>
                  <div>
                    <div class="font-medium text-gray-900">{{ process.name }}</div>
                    <div class="text-sm text-gray-500">{{ process.description }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="badge" :class="getStatusBadgeClass(process.status)">
                  {{ getStatusText(process.status) }}
                </span>
              </td>
              <td>{{ process.creator }}</td>
              <td>{{ process.instanceCount }}</td>
              <td>
                <div class="text-sm">
                  <div>完成: {{ process.completedCount }}</div>
                  <div>运行中: {{ process.runningCount }}</div>
                </div>
              </td>
              <td>{{ process.updatedAt }}</td>
              <td>
                <div class="flex gap-2">
                  <button class="btn btn-sm btn-secondary" @click="$router.push(`/process-detail/${process.id}`)">
                    <i class="fas fa-eye"></i>
                  </button>
                  <button class="btn btn-sm btn-secondary" @click="$router.push(`/designer/${process.id}`)">
                    <i class="fas fa-edit"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 卡片视图 -->
      <div v-if="viewMode === 'card'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="process in filteredProcesses" :key="process.id" class="process-card card p-6">
          <div class="flex items-start justify-between mb-4">
            <div class="process-icon" :style="{ background: process.iconBg }">
              <i :class="process.icon"></i>
            </div>
            <input type="checkbox" class="form-checkbox" v-model="selectedProcesses" :value="process.id">
          </div>

          <h3 class="text-lg font-semibold text-gray-800 mb-2">{{ process.name }}</h3>
          <p class="text-sm text-gray-500 mb-4">{{ process.description }}</p>

          <div class="flex items-center justify-between mb-4">
            <span class="badge" :class="getStatusBadgeClass(process.status)">
              {{ getStatusText(process.status) }}
            </span>
            <span class="text-xs text-gray-500">
              <i class="fas fa-clock mr-1"></i>
              {{ process.updatedAt }}
            </span>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-gray-100">
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                {{ process.creatorInitial }}
              </div>
              <div>
                <div class="text-sm font-medium text-gray-700">{{ process.creator }}</div>
                <div class="text-xs text-gray-500">创建者</div>
              </div>
            </div>
            <button class="btn btn-primary btn-sm" @click="$router.push(`/process-detail/${process.id}`)">
              <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredProcesses.length === 0" class="empty-state">
        <div class="empty-state-icon">
          <i class="fas fa-inbox"></i>
        </div>
        <h3>暂无流程</h3>
        <p>没有找到符合条件的流程，试试调整筛选条件</p>
        <button class="btn btn-primary" @click="resetFilters()">
          <i class="fas fa-redo-alt"></i>
          重置筛选
        </button>
      </div>

      <!-- 分页 -->
      <div v-if="filteredProcesses.length > 0" class="pagination">
        <div class="pagination-info">
          显示 <strong>{{ (currentPage - 1) * pageSize + 1 }}-{{ Math.min(currentPage * pageSize, totalCount) }}</strong> 条，共 <strong>{{ totalCount }}</strong> 条
        </div>
        <div class="pagination-controls">
          <button class="page-btn" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            class="page-btn"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { getAllProcesses } from '@/utils/processStorage'

export default {
  name: 'ProcessList',
  data() {
    return {
      loading: false,
      viewMode: 'list',
      searchQuery: '',
      sortBy: 'updated',
      activeFilter: 'all',
      selectAll: false,
      selectedProcesses: [],
      currentPage: 1,
      pageSize: 20,
      processes: []
    }
  },
  mounted() {
    this.loadProcesses()
  },
  methods: {
    switchView(mode) {
      this.viewMode = mode
    },
    handleSearch() {
      this.currentPage = 1
    },
    handleSort() {
      this.currentPage = 1
    },
    loadProcesses() {
      this.loading = true
      try {
        const loadedProcesses = getAllProcesses()

        // 如果没有流程，使用默认示例
        if (loadedProcesses.length === 0) {
          this.processes = this.getDefaultProcesses()
        } else {
          this.processes = loadedProcesses.map(p => ({
            ...p,
            creatorInitial: p.creator ? p.creator.charAt(0) : '未'
          }))
        }
      } catch (error) {
        console.error('加载流程列表失败:', error)
        this.processes = this.getDefaultProcesses()
      } finally {
        this.loading = false
      }
    },
    getDefaultProcesses() {
      return [
        {
          id: 1,
          name: '订单处理流程',
          description: '自动化订单从创建到完成的全流程处理',
          status: 'active',
          creator: '张三',
          creatorInitial: '张',
          instanceCount: 145,
          completedCount: 128,
          runningCount: 15,
          updatedAt: '2小时前',
          icon: 'fas fa-shopping-cart',
          iconBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        },
        {
          id: 2,
          name: '审批流程',
          description: '多级审批流程模板，支持并行和串行审批',
          status: 'draft',
          creator: '李四',
          creatorInitial: '李',
          instanceCount: 23,
          completedCount: 18,
          runningCount: 3,
          updatedAt: '1天前',
          icon: 'fas fa-file-signature',
          iconBg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
        },
        {
          id: 3,
          name: '通知流程',
          description: '系统消息和邮件通知的自动化处理流程',
          status: 'disabled',
          creator: '王五',
          creatorInitial: '王',
          instanceCount: 67,
          completedCount: 62,
          runningCount: 0,
          updatedAt: '2天前',
          icon: 'fas fa-bell',
          iconBg: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
        }
      ]
    },
    quickFilter(filterKey) {
      this.activeFilter = filterKey
      this.currentPage = 1
    },
    toggleAdvancedFilters() {
      // TODO: 实现高级筛选
      alert('高级筛选功能即将推出')
    },
    toggleSelectAll() {
      if (this.selectAll) {
        this.selectedProcesses = this.filteredProcesses.map(p => p.id)
      } else {
        this.selectedProcesses = []
      }
    },
    bulkAction(action) {
      alert(`批量操作: ${action} - 选择了 ${this.selectedProcesses.length} 个流程`)
    },
    clearSelection() {
      this.selectedProcesses = []
      this.selectAll = false
    },
    resetFilters() {
      this.searchQuery = ''
      this.activeFilter = 'all'
      this.sortBy = 'updated'
      this.currentPage = 1
    },
    sortByField(field) {
      // 简单的排序切换逻辑
      if (this.sortBy === field + '-asc') {
        this.sortBy = field + '-desc'
      } else {
        this.sortBy = field + '-asc'
      }
    },
    getStatusBadgeClass(status) {
      switch (status) {
        case 'active':
          return 'badge-success'
        case 'published':
          return 'badge-info'
        case 'draft':
          return 'badge-warning'
        case 'disabled':
          return 'badge-danger'
        default:
          return 'badge-secondary'
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'active':
          return '活跃'
        case 'published':
          return '已发布'
        case 'draft':
          return '草稿'
        case 'disabled':
          return '停用'
        default:
          return '未知'
      }
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page
      }
    }
  },
  computed: {
    quickFilters() {
      return [
        { key: 'all', label: '全部', count: this.processes.length, icon: '' },
        { key: 'active', label: '活跃', count: this.processes.filter(p => p.status === 'active').length, icon: 'fas fa-check-circle text-green-500' },
        { key: 'published', label: '已发布', count: this.processes.filter(p => p.status === 'published').length, icon: 'fas fa-rocket text-blue-500' },
        { key: 'draft', label: '草稿', count: this.processes.filter(p => p.status === 'draft').length, icon: 'fas fa-edit text-yellow-500' },
        { key: 'disabled', label: '停用', count: this.processes.filter(p => p.status === 'disabled').length, icon: 'fas fa-ban text-gray-500' }
      ]
    },
    filteredProcesses() {
      let filtered = this.processes

      // 应用搜索过滤
      if (this.searchQuery) {
        filtered = filtered.filter(process =>
          process.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          process.description.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          process.creator.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
      }

      // 应用状态过滤
      if (this.activeFilter !== 'all') {
        filtered = filtered.filter(process => process.status === this.activeFilter)
      }

      // 应用排序
      filtered.sort((a, b) => {
        switch (this.sortBy) {
          case 'name-asc':
            return a.name.localeCompare(b.name)
          case 'name-desc':
            return b.name.localeCompare(a.name)
          case 'created':
            return new Date(b.createdAt) - new Date(a.createdAt)
          case 'instances':
            return b.instanceCount - a.instanceCount
          case 'updated':
          default:
            return new Date(b.updatedAt) - new Date(a.updatedAt)
        }
      })

      return filtered
    },
    totalCount() {
      return this.filteredProcesses.length
    },
    currentFilterName() {
      const filter = this.quickFilters.find(f => f.key === this.activeFilter)
      return filter ? filter.label + '流程' : '全部流程'
    },
    totalPages() {
      return Math.ceil(this.totalCount / this.pageSize)
    },
    visiblePages() {
      const pages = []
      const start = Math.max(1, this.currentPage - 2)
      const end = Math.min(this.totalPages, this.currentPage + 2)

      for (let i = start; i <= end; i++) {
        pages.push(i)
      }

      return pages
    }
  },
  watch: {
    selectedProcesses() {
      this.selectAll = this.selectedProcesses.length === this.filteredProcesses.length && this.filteredProcesses.length > 0
    }
  }
}
</script>

<style scoped>
/* 面包屑导航样式 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--gray-600);
}

.breadcrumb-item a {
  color: var(--primary-600);
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: var(--primary-700);
}

.breadcrumb-separator {
  color: var(--gray-400);
  font-size: 12px;
}

.breadcrumb-current {
  color: var(--gray-900);
  font-weight: 500;
}

.search-filter-row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

/* 搜索框样式 */
.search-box {
  position: relative;
  display: flex;
  align-items: center;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 16px;
  transition: all 0.2s;
  max-width: 400px;
  min-width: 250px;
  flex: 1;
}

.search-box:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.search-box i {
  color: #6b7280;
  margin-right: 8px;
  font-size: 14px;
}

.search-box input {
  border: none;
  outline: none;
  flex: 1;
  font-size: 14px;
  color: #374151;
  background: transparent;
}

.search-box input::placeholder {
  color: #9ca3af;
}

/* 视图切换 */
.view-toggle {
  display: flex;
  gap: 8px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 8px;
}

.view-toggle-btn {
  padding: 6px 12px;
  border: none;
  background: transparent;
  color: #6b7280;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.view-toggle-btn:hover {
  color: #111827;
}

.view-toggle-btn.active {
  background: white;
  color: #3b82f6;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 表单选择框样式 */
.form-select {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
}

.form-select:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

.form-select:hover {
  border-color: #d1d5db;
}

.sort-select {
  width: 180px;
}

.filter-tab {
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid var(--gray-300);
  background: white;
  color: var(--gray-600);
  display: flex;
  align-items: center;
  gap: 6px;
}

.filter-tab:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}

.filter-tab.active {
  background: var(--primary-600);
  color: white;
  border-color: var(--primary-600);
}

.bulk-actions {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bulk-actions-left {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--gray-700);
}

.bulk-actions-right {
  display: flex;
  gap: 8px;
}

.bulk-btn {
  padding: 8px 16px;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  background: white;
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.bulk-btn:hover {
  background: var(--gray-50);
  border-color: var(--gray-400);
}

.process-table {
  background: white;
  border-radius: 8px;
  border: 1px solid var(--gray-200);
  overflow: hidden;
}

.checkbox-cell {
  width: 40px;
  text-align: center;
}

.sortable {
  cursor: pointer;
  user-select: none;
  position: relative;
}

.sortable:hover {
  background: var(--gray-50);
}

.sort-icon {
  margin-left: 6px;
  color: var(--gray-400);
}

.process-card {
  transition: all 0.3s ease;
}

.process-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.process-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.process-card:hover .process-icon {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: var(--gray-500);
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 16px;
  opacity: 0.3;
}

.empty-state h3 {
  font-size: 18px;
  color: var(--gray-700);
  margin-bottom: 8px;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding: 16px 0;
}

.pagination-info {
  font-size: 14px;
  color: var(--gray-600);
}

.pagination-controls {
  display: flex;
  gap: 4px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid var(--gray-300);
  border-radius: 6px;
  background: white;
  color: var(--gray-700);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 40px;
  text-align: center;
}

.page-btn:hover:not(:disabled) {
  background: var(--gray-50);
  border-color: var(--gray-400);
}

.page-btn.active {
  background: var(--primary-600);
  color: white;
  border-color: var(--primary-600);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--gray-200);
  border-top: 4px solid var(--primary-600);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-filter-row {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .search-box {
    min-width: unset;
    max-width: unset;
  }

  .filter-actions {
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
  }

  .filter-row {
    grid-template-columns: 1fr;
  }

  .process-table {
    overflow-x: auto;
  }

  .process-table table {
    min-width: 800px;
  }

  .pagination {
    flex-direction: column;
    gap: 16px;
  }

  .bulk-actions {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .bulk-actions-left,
  .bulk-actions-right {
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .filter-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  .view-toggle,
  .sort-select {
    width: 100%;
  }
}
</style>
