<!--
  Workflow Engine Vue
  Copyright (c) 2025 peterfei
  Email: peterfeispace@gmail.com
  GitHub: https://github.com/peterfei/workflow-engine-vue
-->

<template>
  <div class="process-card card p-6" :class="{ selected: isSelected }" @click="$emit('click', process)">
    <div class="flex items-start justify-between mb-4">
      <div class="process-icon" :style="{ background: iconBg }">
        <i :class="icon"></i>
      </div>
      <input
        v-if="showCheckbox"
        type="checkbox"
        class="form-checkbox"
        :checked="isSelected"
        @change="$emit('select', process)"
        @click.stop
      >
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
      <button class="btn btn-primary btn-sm" @click.stop="$emit('detail', process)">
        <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProcessCard',
  props: {
    process: {
      type: Object,
      required: true,
      validator: (value) => {
        return value.name && value.description && value.status
      }
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    icon() {
      return this.process.icon || 'fas fa-cogs'
    },
    iconBg() {
      return this.process.iconBg || 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    }
  },
  methods: {
    getStatusBadgeClass(status) {
      switch (status) {
        case 'active':
          return 'badge-success'
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
        case 'draft':
          return '草稿'
        case 'disabled':
          return '停用'
        default:
          return '未知'
      }
    }
  },
  emits: ['click', 'select', 'detail']
}
</script>

<style scoped>
.process-card {
  transition: all 0.3s ease;
}

.process-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.process-card.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
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
</style>
