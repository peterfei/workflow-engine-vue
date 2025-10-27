<template>
  <button
    class="ai-assistant-btn"
    @click="toggleAIAssistant"
    title="AI 助手 (Ctrl+K)"
  >
    <i class="fas fa-robot"></i>
  </button>
</template>

<script>
export default {
  name: 'AIAssistantButton',
  methods: {
    toggleAIAssistant() {
      // TODO: 实现 AI 助手弹窗
      alert('AI 助手功能即将推出')
    }
  }
}
</script>

<style scoped>
/* AI 助手按钮样式已在全局 CSS 中定义 */
</style>
