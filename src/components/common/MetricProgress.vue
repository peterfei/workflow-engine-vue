<template>
  <div class="metric-item">
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center" :style="{ background: iconBg }">
          <i :class="icon" class="text-white text-sm"></i>
        </div>
        <span class="text-sm font-medium text-gray-700">{{ label }}</span>
      </div>
      <span class="text-2xl font-bold" :style="{ color: valueColor }">{{ value }}</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
      <div
        class="h-3 rounded-full transition-all duration-1000"
        :style="{
          width: percentage + '%',
          background: gradientBg
        }"
      ></div>
    </div>
    <div v-if="change" class="mt-2 text-xs" :style="{ color: changeColor }">
      <i :class="changeIcon"></i>
      <span>{{ change }}</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MetricProgress',
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
    valueColor: {
      type: String,
      default: '#3b82f6'
    },
    percentage: {
      type: Number,
      required: true,
      validator: (value) => value >= 0 && value <= 100
    },
    gradientBg: {
      type: String,
      default: 'linear-gradient(90deg, #3b82f6, #2563eb)'
    },
    change: {
      type: String,
      default: null
    },
    changeColor: {
      type: String,
      default: '#10b981'
    },
    changeIcon: {
      type: String,
      default: 'fas fa-arrow-up'
    }
  }
}
</script>

<style scoped>
.metric-item {
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}
</style>
