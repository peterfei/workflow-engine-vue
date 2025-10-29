<!--
  Workflow Engine Vue
  Copyright (c) 2025 peterfei
  Email: peterfeispace@gmail.com
  GitHub: https://github.com/peterfei/workflow-engine-vue
-->

<template>
  <div class="timeline">
    <div v-for="item in items" :key="item.id" class="timeline-item">
      <div class="timeline-dot" :class="item.status"></div>
      <div class="timeline-card">
        <slot name="item" :item="item">
          <!-- 默认内容 -->
          <div class="flex items-center justify-between mb-2">
            <h4 class="font-bold text-gray-900">{{ item.title }}</h4>
            <span class="text-sm font-medium" :class="getTimeColor(item.status)">
              {{ item.time }}
            </span>
          </div>
          <p class="text-sm text-gray-700">{{ item.description }}</p>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Timeline',
  props: {
    items: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(item =>
          item.id && item.title && item.time &&
          typeof item.id === 'string' &&
          typeof item.title === 'string' &&
          typeof item.time === 'string'
        )
      }
    }
  },
  methods: {
    getTimeColor(status) {
      switch (status) {
        case 'success':
        case 'completed':
          return 'text-green-600'
        case 'warning':
        case 'current':
          return 'text-yellow-600'
        case 'error':
          return 'text-red-600'
        default:
          return 'text-gray-500'
      }
    }
  }
}
</script>

<style scoped>
.timeline {
  position: relative;
  padding-left: 40px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 16px;
  bottom: 16px;
  width: 3px;
  background: linear-gradient(180deg, #3b82f6 0%, #e5e7eb 50%, #3b82f6 100%);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 32px;
}

.timeline-dot {
  position: absolute;
  left: -32px;
  top: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.timeline-dot.success,
.timeline-dot.completed {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.timeline-dot.warning,
.timeline-dot.current {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

.timeline-dot.error {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.timeline-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}
</style>
