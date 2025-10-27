<template>
  <div class="tab-nav">
    <button
      v-for="tab in tabs"
      :key="tab.key"
      class="tab-button"
      :class="{ active: activeTab === tab.key }"
      @click="$emit('tab-change', tab.key)"
    >
      <i :class="tab.icon" class="mr-2"></i>
      {{ tab.label }}
    </button>
  </div>
</template>

<script>
export default {
  name: 'TabNav',
  props: {
    tabs: {
      type: Array,
      required: true,
      validator: (value) => {
        return value.every(tab =>
          tab.key && tab.label && typeof tab.key === 'string' && typeof tab.label === 'string'
        )
      }
    },
    activeTab: {
      type: String,
      required: true
    }
  },
  emits: ['tab-change']
}
</script>

<style scoped>
.tab-nav {
  display: flex;
  gap: 4px;
  border-bottom: 2px solid #e5e7eb;
  margin-bottom: 32px;
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
  padding: 8px;
  border-radius: 12px 12px 0 0;
}

.tab-button {
  padding: 14px 28px;
  background: transparent;
  border: none;
  color: #6b7280;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  border-radius: 8px;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}

.tab-button:hover {
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
  transform: translateY(-1px);
}

.tab-button.active {
  color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  border-bottom-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}
</style>
