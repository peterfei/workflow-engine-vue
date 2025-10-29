<!--
  Workflow Engine Vue
  Copyright (c) 2025 peterfei
  Email: peterfeispace@gmail.com
  GitHub: https://github.com/peterfei/workflow-engine-vue
-->

<template>
  <div id="app">
    <Sidebar />
    <div class="main-content">
      <router-view />
    </div>
    <AIAssistantButton />
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'
import AIAssistantButton from '@/components/AIAssistantButton.vue'

export default {
  name: 'App',
  components: {
    Sidebar,
    AIAssistantButton
  }
}
</script>

<style scoped>
#app {
  min-height: 100vh;
}
</style>
