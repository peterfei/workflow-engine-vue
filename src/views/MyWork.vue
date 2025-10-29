<template>
  <div class="p-6">
    <!-- 演示实例快捷入口 -->
    <div class="mb-4 p-4 rounded-lg border border-amber-200 bg-amber-50 flex items-center justify-between">
      <div class="text-sm text-amber-700">
        快速体验演示审批流（我的审核 → 总经理审核 → 结束）
      </div>
      <button class="btn btn-sm btn-secondary" @click="openDemoInstance">
        <i class="fas fa-play mr-1"></i>
        打开演示实例
      </button>
    </div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">我的待办与流程</h1>
        <p class="text-gray-500 text-sm">查看我待处理、我发起、以及我已处理的流程与任务</p>
      </div>
    </div>

    <div class="mb-4 border-b border-gray-200">
      <nav class="-mb-px flex gap-6" aria-label="Tabs">
        <button
          :class="['pb-2 border-b-2', activeTab==='pending' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
          @click="activeTab='pending'">
          待处理 <span class="ml-1 text-xs text-gray-400">{{ pendingList.length }}</span>
        </button>
        <button
          :class="['pb-2 border-b-2', activeTab==='initiated' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
          @click="activeTab='initiated'">
          我发起 <span class="ml-1 text-xs text-gray-400">{{ initiatedList.length }}</span>
        </button>
        <button
          :class="['pb-2 border-b-2', activeTab==='processed' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700']"
          @click="activeTab='processed'">
          我已处理 <span class="ml-1 text-xs text-gray-400">{{ processedList.length }}</span>
        </button>
      </nav>
    </div>

    <!-- 待处理任务列表 -->
    <div v-if="activeTab==='pending'" class="space-y-3">
      <div
        v-for="t in pendingList"
        :key="t.id"
        class="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-gray-300"
        @click="goInstance(t.processId)">
        <div>
          <div class="font-medium">{{ t.title }}</div>
          <div class="text-xs text-gray-500">流程: {{ t.processId }} · 节点: {{ t.nodeName }} · 指派: {{ t.assigneeName }}</div>
        </div>
        <div class="text-xs text-gray-400">开始于 {{ formatDate(t.startedAt) }}</div>
      </div>
    </div>

    <!-- 我发起的流程 -->
    <div v-else-if="activeTab==='initiated'" class="space-y-3">
      <div
        v-for="p in initiatedList"
        :key="p.id"
        class="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-gray-300"
        @click="goInstance(p.id)">
        <div>
          <div class="font-medium">{{ p.title }}</div>
          <div class="text-xs text-gray-500">发起人: {{ p.starterName }} · 状态: {{ p.status }}</div>
        </div>
        <div class="text-xs text-gray-400">发起于 {{ formatDate(p.startedAt) }}</div>
      </div>
    </div>

    <!-- 我已处理的任务 -->
    <div v-else class="space-y-3">
      <div
        v-for="t in processedList"
        :key="t.id"
        class="p-4 bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer hover:border-gray-300"
        @click="goInstance(t.processId)">
        <div>
          <div class="font-medium">{{ t.title }}</div>
          <div class="text-xs text-gray-500">流程: {{ t.processId }} · 节点: {{ t.nodeName }}</div>
        </div>
        <div class="text-xs text-gray-400">完成于 {{ formatDate(t.completedAt) }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getMyPendingTasks, getMyInitiatedProcesses, getMyProcessedTasks } from '@/data/mockUserProcesses'

const activeTab = ref('pending')

const pendingList = computed(() => getMyPendingTasks())
const initiatedList = computed(() => getMyInitiatedProcesses())
const processedList = computed(() => getMyProcessedTasks())

function formatDate(iso) {
  if (!iso) return '-'
  const d = new Date(iso)
  const y = d.getFullYear()
  const m = `${d.getMonth()+1}`.padStart(2, '0')
  const day = `${d.getDate()}`.padStart(2, '0')
  const hh = `${d.getHours()}`.padStart(2, '0')
  const mm = `${d.getMinutes()}`.padStart(2, '0')
  return `${y}-${m}-${day} ${hh}:${mm}`
}

const router = useRouter()
function goInstance(instanceId) {
  if (!instanceId) return
  router.push(`/process-instance-detail/${instanceId}`)
}

function openDemoInstance() {
  router.push('/process-instance-detail/demo_p_9001')
}
</script>
