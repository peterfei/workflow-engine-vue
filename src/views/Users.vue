<template>
  <div>
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="flex items-center justify-between w-full">
        <div>
          <h1 class="page-title">用户管理</h1>
          <p class="page-subtitle">管理系统用户和权限</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn btn-secondary">
            <i class="fas fa-search"></i>
            搜索用户
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-plus"></i>
            添加用户
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="p-6">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div class="stat-card">
          <div class="stat-label">总用户数</div>
          <div class="stat-value">156</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            <span>+12% 较上月</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">活跃用户</div>
          <div class="stat-value">89</div>
          <div class="stat-change positive">
            <i class="fas fa-arrow-up"></i>
            <span>+8% 较上周</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-label">管理员</div>
          <div class="stat-value">5</div>
          <div class="stat-change neutral">
            <i class="fas fa-minus"></i>
            <span>无变化</span>
          </div>
        </div>
      </div>

      <!-- 用户列表 -->
      <div class="card p-6">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">
            <i class="fas fa-users text-blue-500 mr-2"></i>
            用户列表
          </h3>
          <div class="flex gap-2">
            <button class="btn btn-sm btn-secondary">
              <i class="fas fa-filter"></i>
              筛选
            </button>
            <button class="btn btn-sm btn-secondary">
              <i class="fas fa-download"></i>
              导出
            </button>
          </div>
        </div>

        <!-- 用户卡片网格 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UserCard
        v-for="user in users"
        :key="user.id"
        :user="user"
        @edit="editUser"
        @delete="deleteUser"
        />
        </div>

        <!-- 分页 -->
        <div class="pagination">
          <div class="pagination-info">
            显示 1-9 条，共 {{ users.length }} 条
          </div>
          <div class="pagination-controls">
            <button class="page-btn" disabled>
              <i class="fas fa-chevron-left"></i>
            </button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { UserCard } from '@/components/common'

export default {
  name: 'Users',
  components: {
    UserCard
  },
  data() {
    return {
      users: [
        {
          id: 1,
          name: '张三',
          email: 'zhangsan@example.com',
          initial: '张',
          avatarBg: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          role: 'admin',
          status: 'active',
          lastLogin: '2小时前',
          createdAt: '2024-01-15',
          processCount: 12,
          instanceCount: 245,
          taskCount: 189
        },
        {
          id: 2,
          name: '李四',
          email: 'lisi@example.com',
          initial: '李',
          avatarBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          role: 'manager',
          status: 'active',
          lastLogin: '1天前',
          createdAt: '2024-01-20',
          processCount: 8,
          instanceCount: 156,
          taskCount: 134
        },
        {
          id: 3,
          name: '王五',
          email: 'wangwu@example.com',
          initial: '王',
          avatarBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          role: 'user',
          status: 'active',
          lastLogin: '3天前',
          createdAt: '2024-02-01',
          processCount: 3,
          instanceCount: 67,
          taskCount: 89
        },
        {
          id: 4,
          name: '赵六',
          email: 'zhaoliu@example.com',
          initial: '赵',
          avatarBg: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          role: 'user',
          status: 'inactive',
          lastLogin: '1周前',
          createdAt: '2024-02-10',
          processCount: 1,
          instanceCount: 23,
          taskCount: 45
        }
      ]
    }
  },
  methods: {
    getRoleClass(role) {
      switch (role) {
        case 'admin':
          return 'admin'
        case 'manager':
          return 'manager'
        default:
          return 'user'
      }
    },
    getRoleText(role) {
      switch (role) {
        case 'admin':
          return '管理员'
        case 'manager':
          return '经理'
        default:
          return '普通用户'
      }
    },
    getStatusText(status) {
      return status === 'active' ? '活跃' : '停用'
    },
    editUser(user) {
      alert(`编辑用户: ${user.name}`)
    },
    deleteUser(user) {
      if (confirm(`确定要删除用户 ${user.name} 吗？`)) {
        alert(`删除用户: ${user.name}`)
      }
    }
  }
}
</script>

<style scoped>
.user-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s ease;
}

.user-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #3b82f6;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  font-weight: 700;
  flex-shrink: 0;
}

.user-actions {
  display: flex;
  gap: 4px;
}

.action-btn {
  padding: 6px 8px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.user-info {
  margin-bottom: 16px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #6b7280;
}

.info-value {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.role-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.role-badge.admin {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.role-badge.manager {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.role-badge.user {
  background: #eff6ff;
  color: #2563eb;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #dcfce7;
  color: #166534;
}

.status-badge.inactive {
  background: #fef2f2;
  color: #dc2626;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.stat-item {
  text-align: center;
}

.stat-number {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.stat-item .stat-label {
  font-size: 12px;
  color: #6b7280;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.pagination-info {
  font-size: 14px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  gap: 4px;
}

.page-btn {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 40px;
  text-align: center;
}

.page-btn:hover:not(:disabled) {
  background: #f9fafb;
  border-color: #d1d5db;
}

.page-btn.active {
  background: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
