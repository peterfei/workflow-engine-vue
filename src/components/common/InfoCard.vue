<!--
  Workflow Engine Vue
  Copyright (c) 2025 peterfei
  Email: peterfeispace@gmail.com
  GitHub: https://github.com/peterfei/workflow-engine-vue
-->

<template>
  <div class="info-card">
    <div class="flex items-center gap-4 mb-3">
      <div class="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg" :style="{ background: iconBg }">
        <i :class="icon" class="text-white"></i>
      </div>
      <div class="flex-1">
        <div class="text-xs font-medium mb-1" :style="{ color: labelColor }">
          {{ label }}
        </div>
        <div class="text-sm font-bold text-gray-900">
          {{ value }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InfoCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    iconBg: {
      type: String,
      default: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
    },
    label: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number],
      required: true
    },
    labelColor: {
      type: String,
      default: '#3b82f6'
    }
  }
}
</script>

<style scoped>
.info-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.info-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border-color: #3b82f6;
}
</style>
