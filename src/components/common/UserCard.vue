<!--
  Workflow Engine Vue
  Copyright (c) 2025 peterfei
  Email: peterfeispace@gmail.com
  GitHub: https://github.com/peterfei/workflow-engine-vue
-->

<template>
  <div class="user-card">
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="user-avatar" :style="{ background: avatarBg }">
          {{ initial }}
        </div>
        <div class="flex-1">
          <h4 class="font-semibold text-gray-900">{{ name }}</h4>
          <p class="text-sm text-gray-600">{{ email }}</p>
        </div>
      </div>
      <div class="user-actions">
        <button class="action-btn" @click="$emit('edit', user)">
          <i class="fas fa-edit"></i>
        </button>
        <button class="action-btn" @click="$emit('delete', user)">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <div class="user-info">
      <div class="info-row">
        <span class="info-label">角色</span>
        <span class="role-badge" :class="getRoleClass(role)">
          {{ getRoleText(role) }}
        </span>
      </div>
      <div class="info-row">
        <span class="info-label">状态</span>
        <span class="status-badge" :class="status">
          {{ getStatusText(status) }}
        </span>
      </div>
      <div class="info-row">
        <span class="info-label">最后登录</span>
        <span class="info-value">{{ lastLogin }}</span>
      </div>
      <div class="info-row">
        <span class="info-label">创建时间</span>
        <span class="info-value">{{ createdAt }}</span>
      </div>
    </div>

    <div class="user-stats">
      <div class="stat-item">
        <div class="stat-number">{{ stats.processCount }}</div>
        <div class="stat-label">创建流程</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ stats.instanceCount }}</div>
        <div class="stat-label">启动实例</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ stats.taskCount }}</div>
        <div class="stat-label">完成任务</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserCard',
  props: {
    user: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.name && value.email && value.role && value.status
      }
    }
  },
  computed: {
    name() {
      return this.user.name
    },
    email() {
      return this.user.email
    },
    initial() {
      return this.user.name ? this.user.name.charAt(0) : '?'
    },
    avatarBg() {
      return this.user.avatarBg || 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },
    role() {
      return this.user.role
    },
    status() {
      return this.user.status
    },
    lastLogin() {
      return this.user.lastLogin || '未知'
    },
    createdAt() {
      return this.user.createdAt || '未知'
    },
    stats() {
      return {
        processCount: this.user.processCount || 0,
        instanceCount: this.user.instanceCount || 0,
        taskCount: this.user.taskCount || 0
      }
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
    }
  },
  emits: ['edit', 'delete']
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
</style>
