<!--
  Workflow Engine Vue
  Copyright (c) 2025 peterfei
  Email: peterfeispace@gmail.com
  GitHub: https://github.com/peterfei/workflow-engine-vue
-->

<template>
  <div class="instance-status-card" :class="statusClass">
    <div class="status-main">
      <div class="status-icon">
        <i :class="icon"></i>
      </div>
      <div class="status-content">
        <div class="status-value">{{ value }}</div>
        <div class="status-label">{{ label }}</div>
      </div>
    </div>
    <div v-if="meta && meta.length > 0" class="status-meta">
      <div v-for="item in meta" :key="item.key" class="status-meta-item">
        <i :class="item.icon"></i>
        <span>{{ item.text }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstanceStatusCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    status: {
      type: String,
      default: 'default',
      validator: (value) => ['completed', 'running', 'pending', 'user', 'default'].includes(value)
    },
    meta: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    statusClass() {
      return `status-${this.status}`
    }
  }
}
</script>

<style scoped>
.instance-status-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.instance-status-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--card-accent), var(--card-accent-dark));
}

.instance-status-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: var(--card-accent);
}

.status-main {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.status-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.status-content {
  flex: 1;
}

.status-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.status-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.status-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
}

.status-meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-meta-item i {
  width: 14px;
  text-align: center;
}

/* 状态特定的颜色变量 */
.instance-status-card.status-completed {
  --card-accent: #10b981;
  --card-accent-dark: #059669;
}

.instance-status-card.status-completed .status-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.instance-status-card.status-running {
  --card-accent: #3b82f6;
  --card-accent-dark: #2563eb;
}

.instance-status-card.status-running .status-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.instance-status-card.status-pending {
  --card-accent: #f59e0b;
  --card-accent-dark: #d97706;
}

.instance-status-card.status-pending .status-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.instance-status-card.status-user {
  --card-accent: #8b5cf6;
  --card-accent-dark: #7c3aed;
}

.instance-status-card.status-user .status-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
  color: white;
}

.instance-status-card.status-default {
  --card-accent: #6b7280;
  --card-accent-dark: #4b5563;
}

.instance-status-card.status-default .status-icon {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white;
}

@media (max-width: 768px) {
  .instance-status-card {
    padding: 20px;
  }

  .status-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .status-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
