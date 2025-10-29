<!--
  Workflow Engine Vue
  Copyright (c) 2025 peterfei
  Email: peterfeispace@gmail.com
  GitHub: https://github.com/peterfei/workflow-engine-vue
-->

<template>
  <div>
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="flex items-center justify-between w-full">
        <!-- 左侧：标题和描述 -->
        <div>
          <h1 class="page-title">{{ instanceTitle }}</h1>
          <p class="page-subtitle">{{ instanceSubtitle }}</p>
        </div>

        <!-- 右侧：操作按钮 -->
        <div class="flex items-center gap-3">
          <button class="btn btn-secondary" @click="$router.go(-1)">
            <i class="fas fa-arrow-left"></i>
            返回
          </button>
          <button class="btn btn-secondary" @click="exportInstanceData">
            <i class="fas fa-download"></i>
            导出数据
          </button>
          <button class="btn btn-danger" @click="cancelInstance">
            <i class="fas fa-times"></i>
            取消实例
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="p-6">
      <!-- Demo 审批流（我的审核 -> 总经理审核 -> 结束） -->
      <div v-if="isDemo" class="card p-4 mb-6 border border-blue-100 bg-blue-50/40">
        <div class="flex items-center justify-between mb-3">
          <div>
            <div class="text-sm text-gray-500">演示实例</div>
            <div class="text-lg font-semibold">{{ demoState.title }} · 当前节点：<span class="text-blue-600">{{ demoState.activeNode }}</span></div>
            <div class="text-xs text-gray-500">状态：{{ demoState.status }}</div>
          </div>
          <div class="flex gap-2">
            <button class="btn btn-secondary btn-sm" @click="onResetDemo">重置演示</button>
          </div>
        </div>
        <div class="flex flex-wrap gap-2">
          <button v-if="canApproveAsCurrent" class="btn btn-primary" @click="onApproveCurrent">
            <i class="fas fa-check mr-1"></i> 我同意
          </button>
          <button v-if="canApproveAsGM" class="btn btn-primary" @click="onApproveGM">
            <i class="fas fa-check mr-1"></i> 总经理同意
          </button>
          <button v-if="demoState.status==='running'" class="btn btn-danger" @click="onRejectCurrent">
            <i class="fas fa-times mr-1"></i> 拒绝（当前节点）
          </button>
        </div>
        <div class="mt-3 text-xs text-gray-500">
          历史：
          <span v-if="demoState.history.length===0">暂无</span>
          <ul v-else class="list-disc pl-5 space-y-1">
            <li v-for="(h,idx) in demoState.history" :key="idx">{{ h.at?.slice(0,16).replace('T',' ') }} · {{ h.node }} · {{ h.action }} · {{ h.userId }}</li>
          </ul>
        </div>
      </div>
      <!-- 实例状态卡片 -->
      <div class="instance-status-grid">
      <InstanceStatusCard
        icon="fas fa-check-circle"
      value="已完成"
      label="实例状态"
      status="completed"
      :meta="[{ icon: 'fas fa-check-double', text: '所有任务已完成' }]"
      />

      <InstanceStatusCard
      icon="fas fa-clock"
      value="2小时前"
      label="启动时间"
      status="running"
      :meta="[{ icon: 'fas fa-calendar-alt', text: '2024-01-20 14:30' }]"
      />

      <InstanceStatusCard
        icon="fas fa-hourglass-half"
          value="1.2h"
        label="执行用时"
        status="pending"
      :meta="[{ icon: 'fas fa-stopwatch', text: '平均响应时间: 15min' }]"
      />

      <InstanceStatusCard
      icon="fas fa-user"
      value="李四"
      label="启动者"
      status="user"
      :meta="[
        { icon: 'fas fa-envelope', text: 'ls@example.com' },
      { icon: 'fas fa-id-badge', text: '销售经理' }
      ]"
      />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧：任务进度 -->
        <div class="lg:col-span-2">
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">
              <i class="fas fa-tasks text-blue-500 mr-2"></i>
              任务进度
            </h3>

            <Timeline :items="timelineTasks" />
          </div>
        </div>

        <!-- 右侧：实例信息和变量 -->
        <div class="lg:col-span-1">
          <!-- 基本信息 -->
          <div class="card p-6 mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">
              <i class="fas fa-info-circle text-blue-500 mr-2"></i>
              基本信息
            </h3>
            <div class="space-y-3">
              <div v-for="info in basicInfo" :key="info.label" class="info-row">
                <span class="text-sm text-gray-600">{{ info.label }}</span>
                <span class="text-sm font-medium text-gray-900">{{ info.value }}</span>
              </div>
            </div>
          </div>

          <!-- 流程变量 -->
          <div class="card p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">
              <i class="fas fa-database text-blue-500 mr-2"></i>
              流程变量
            </h3>
            <div class="space-y-3">
              <div v-for="variable in variables" :key="variable.key" class="info-row">
                <span class="text-sm text-gray-600">{{ variable.key }}</span>
                <span class="text-sm font-medium text-gray-900">{{ variable.value }}</span>
              </div>
            </div>
            <button class="btn btn-sm btn-secondary w-full mt-4">
              <i class="fas fa-eye mr-2"></i>
              查看全部变量
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { InstanceStatusCard, Timeline } from '@/components/common'
import { getDemoState, resetDemoState, approve as demoApprove, reject as demoReject } from '@/data/mockDemoInstance'

export default {
  name: 'ProcessInstanceDetail',
  components: {
    InstanceStatusCard,
    Timeline
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      instanceTitle: '订单 #10245',
      instanceSubtitle: '订单处理流程 · 实例详情',
      isDemo: false,
      demoState: { title: '', status: '', activeNode: '', history: [], assigneeId: null },
      tasks: [
        {
          id: 1,
          title: '创建订单',
          description: '系统自动创建订单记录',
          status: 'completed',
          assignee: '李四',
          assigneeType: 'user',
          time: '2小时前',
          duration: '5分钟'
        },
        {
          id: 2,
          title: '订单审核',
          description: '检查订单信息完整性和合规性',
          status: 'completed',
          assignee: '王五',
          assigneeType: 'user',
          time: '1.5小时前',
          duration: '30分钟'
        },
        {
          id: 3,
          title: '订单处理',
          description: '处理订单并安排发货',
          status: 'completed',
          assignee: '赵六',
          assigneeType: 'user',
          time: '1小时前',
          duration: '45分钟'
        },
        {
          id: 4,
          title: '完成确认',
          description: '确认订单已完成并归档',
          status: 'completed',
          assignee: '系统自动',
          assigneeType: 'system',
          time: '30分钟前',
          duration: '2分钟'
        }
      ],
      basicInfo: [
        { label: '实例ID', value: '10245' },
        { label: '流程定义', value: '订单处理' },
        { label: '流程版本', value: 'v2.3.1' },
        { label: '启动时间', value: '2024-01-20 14:30' },
        { label: '完成时间', value: '2024-01-20 15:42' },
        { label: '业务键', value: 'ORDER-10245' }
      ],
      variables: [
        { key: '订单金额', value: '¥1,299.00' },
        { key: '客户姓名', value: '张三' },
        { key: '客户电话', value: '138****5678' },
        { key: '配送地址', value: '北京市朝阳区...' },
        { key: '支付方式', value: '微信支付' }
      ]
    }
  },
  computed: {
    demoTimeline() {
      if (!this.isDemo) return []
      const steps = [
        { key: 'start', title: '发起', desc: '流程发起', who: '系统', done: true, time: '' },
        { key: 'my', title: '我的审核', desc: '当前用户审核', who: '张三', done: false, time: '' },
        { key: 'gm', title: '总经理审核', desc: '总经理最终审核', who: '总经理', done: false, time: '' },
        { key: 'end', title: '结束', desc: '流程结束', who: '系统', done: false, time: '' }
      ]
      // mark from history (robust to malformed storage)
      const hist = Array.isArray(this.demoState.history) ? this.demoState.history : []
      for (const h of hist) {
        if (h.node === '我的审核' && h.action === 'approve') steps[1].done = true
        if (h.node === '总经理审核' && h.action === 'approve') steps[2].done = true
        if (h.action === 'reject') {
          steps[3].title = '已终止'
          steps[3].desc = '被拒绝，流程终止'
          steps[3].done = true
        }
      }
      if (this.demoState.status === 'completed') steps[3].done = true
      // current pointer
      const currentKey = this.demoState.activeNode === '我的审核' ? 1 : this.demoState.activeNode === '总经理审核' ? 2 : 3
      return steps.map((s, idx) => ({
        id: String(idx + 1),
        title: s.title,
        description: `${s.desc}\n\n执行者: ${s.who}${this.getStepNoteSuffix(s.title)}`,
        time: this.describeStepTime(s.title, idx === currentKey) || '—',
        status: s.done ? 'completed' : (idx === currentKey ? 'current' : 'pending')
      }))
    },
    canApproveAsCurrent() {
      return this.isDemo && this.demoState.status === 'running' && this.demoState.activeNode === '我的审核'
    },
    canApproveAsGM() {
      return this.isDemo && this.demoState.status === 'running' && this.demoState.activeNode === '总经理审核'
    },
    timelineTasks() {
      if (this.isDemo) {
        return this.demoTimeline
      }
      return this.tasks.map(task => ({
        id: String(task.id),
        title: task.title,
        description: `${task.description}\n\n执行者: ${task.assignee} | ${task.time}${task.duration ? ` | 用时: ${task.duration}` : ''}`,
        time: task.time || '—',
        status: task.status
      }))
    }
  },
  methods: {
    setupDemoByRoute() {
      const rid = (this.id || (this.$route && this.$route.params && this.$route.params.id)) || ''
      if (rid === 'demo_p_9001') {
        this.isDemo = true
        this.demoState = getDemoState()
        this.instanceTitle = '演示审批流程'
        this.instanceSubtitle = '我的审核 → 总经理审核 → 结束'
      }
    },
    describeStepTime(title, isCurrent) {
      const h = (this.demoState.history || [])
        .filter(x => (title.includes('我的审核') && x.node === '我的审核') || (title.includes('总经理') && x.node === '总经理审核'))
        .slice(-1)[0]
      if (h && h.at) return h.at.slice(0, 16).replace('T',' ')
      if (this.isDemo && title === '结束' && this.demoState.status === 'completed') {
        const last = (this.demoState.history || []).slice(-1)[0]
        return last && last.at ? last.at.slice(0,16).replace('T',' ') : ''
      }
      return isCurrent ? '进行中' : ''
    },
    getStepNoteSuffix(title) {
      const hist = Array.isArray(this.demoState.history) ? this.demoState.history : []
      const h = hist
        .filter(x => (title.includes('我的审核') && x.node === '我的审核') || (title.includes('总经理') && x.node === '总经理审核'))
        .slice(-1)[0]
      if (!h) return ''
      if (h.action === 'approve' && h.comment) return `\n意见: ${h.comment}`
      if (h.action === 'reject' && h.reason) return `\n拒绝原因: ${h.reason}`
      return ''
    },
    exportInstanceData() {
      alert('正在导出实例数据...')
    },
    cancelInstance() {
      if (confirm('确定要取消该流程实例吗？')) {
        alert('流程实例已取消')
      }
    },
    getTaskBorderColor(status) {
      switch (status) {
        case 'completed':
          return '#10b981'
        case 'current':
          return '#3b82f6'
        case 'pending':
          return '#f59e0b'
        default:
          return '#e5e7eb'
      }
    },
    getTaskStatusBadge(status) {
      switch (status) {
        case 'completed':
          return 'badge-success'
        case 'current':
          return 'badge-warning'
        case 'pending':
          return 'badge-secondary'
        default:
          return 'badge-secondary'
      }
    },
    getTaskStatusText(status) {
      switch (status) {
        case 'completed':
          return '已完成'
        case 'current':
          return '进行中'
        case 'pending':
          return '待处理'
        default:
          return '未知'
      }
    },
    getAssigneeIcon(type) {
      return type === 'system' ? 'fas fa-robot' : 'fas fa-user'
    },
    // Demo handlers
    onApproveCurrent() {
      const c = prompt('请输入审批意见（可选）', '同意') || ''
      this.demoState = demoApprove('u_1001', c)
    },
    onApproveGM() {
      const c = prompt('请输入总经理审批意见（可选）', '同意') || ''
      this.demoState = demoApprove('u_1999', c)
    },
    onRejectCurrent() {
      const reason = prompt('请输入拒绝原因', '演示拒绝') || '演示拒绝'
      this.demoState = demoReject(this.demoState.assigneeId || 'u_1001', reason)
    },
    onResetDemo() {
      this.demoState = resetDemoState()
    }
  },
  mounted() {
    this.setupDemoByRoute()
  }
}
</script>

<style scoped>
.instance-status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

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

.timeline-dot.completed {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.timeline-dot.current {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  animation: pulse 2s infinite;
}

.timeline-dot.pending {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  box-shadow: 0 2px 8px rgba(245, 158, 11, 0.3);
}

@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  50% { box-shadow: 0 0 0 6px rgba(59, 130, 246, 0); }
}

.task-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.task-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-1px);
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-row:last-child {
  border-bottom: none;
}

@media (max-width: 768px) {
  .instance-status-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

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
