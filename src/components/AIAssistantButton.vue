<!--
  Workflow Engine Vue
  Copyright (c) 2025 peterfei
  Email: peterfeispace@gmail.com
  GitHub: https://github.com/peterfei/workflow-engine-vue
-->

<template>
  <button
    class="ai-assistant-btn"
    @click="toggleAIAssistant"
    title="AI 助手 (Ctrl+K)"
  >
    <span class="ai-text">AI</span>
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
.ai-text {
  font-size: 18px;
  font-weight: 700;
  letter-spacing: 0.5px;
}
</style>
