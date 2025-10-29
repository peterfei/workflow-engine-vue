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
          <h1 class="page-title">{{ processName }}</h1>
          <p class="page-subtitle">{{ processDescription }}</p>
        </div>

        <!-- 右侧：操作按钮 -->
        <div class="flex items-center gap-3">
          <button class="btn btn-secondary" @click="$router.go(-1)">
            <i class="fas fa-arrow-left"></i>
            返回
          </button>
          <button class="btn btn-secondary" @click="$router.push('/designer')">
            <i class="fas fa-edit"></i>
            编辑流程
          </button>
          <button class="btn btn-primary" @click="startNewInstance">
            <i class="fas fa-play"></i>
            启动实例
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="p-6">
      <!-- Statistics Overview -->
      <div class="stats-overview">
        <!-- 实例状态 -->
        <div class="stat-mini-card">
          <div class="icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%);">
            <i class="fas fa-check-circle text-white"></i>
          </div>
          <div class="label">实例状态</div>
          <div class="value">已完成</div>
        </div>

        <!-- 启动时间 -->
        <div class="stat-mini-card">
          <div class="icon" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
            <i class="fas fa-clock text-white"></i>
          </div>
          <div class="label">启动时间</div>
          <div class="value">2小时前</div>
        </div>

        <!-- 执行用时 -->
        <div class="stat-mini-card">
          <div class="icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);">
            <i class="fas fa-hourglass-half text-white"></i>
          </div>
          <div class="label">执行用时</div>
          <div class="value">1.2h</div>
        </div>

        <!-- 启动者 -->
        <div class="stat-mini-card">
          <div class="icon" style="background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);">
            <i class="fas fa-user text-white"></i>
          </div>
          <div class="label">启动者</div>
          <div class="value">李四</div>
        </div>
      </div>

      <!-- 标签页导航 -->
      <div class="card p-6">
        <TabNav
          :tabs="[
            { key: 'overview', label: '概览', icon: 'fas fa-chart-pie' },
            { key: 'diagram', label: '流程图', icon: 'fas fa-project-diagram' },
            { key: 'instances', label: '实例列表', icon: 'fas fa-tasks' },
            { key: 'history', label: '历史记录', icon: 'fas fa-history' },
            { key: 'settings', label: '配置', icon: 'fas fa-cog' }
          ]"
          :active-tab="activeTab"
          @tab-change="switchTab"
        />

        <!-- 概览标签页 -->
        <div v-if="activeTab === 'overview'">
          <!-- 基本信息卡片 -->
          <div class="card p-6 mb-6" style="background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-800">
                <i class="fas fa-info-circle text-blue-500 mr-2"></i>
                基本信息
              </h3>
              <button class="btn btn-sm btn-secondary" @click="copyProcessId">
                <i class="fas fa-copy mr-1"></i>
                复制流程ID
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- 流程ID -->
              <div class="info-card">
                <div class="flex items-center gap-4 mb-2">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <i class="fas fa-fingerprint text-white"></i>
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-blue-600 font-medium mb-1">流程ID</div>
                    <div class="text-sm font-bold text-gray-900">PROC-2024-001</div>
                  </div>
                </div>
              </div>

              <!-- 创建者 -->
              <div class="info-card">
                <div class="flex items-center gap-4 mb-2">
                  <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    张
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-purple-600 font-medium mb-1">创建者</div>
                    <div class="text-sm font-bold text-gray-900">张三</div>
                  </div>
                </div>
              </div>

              <!-- 状态 -->
              <div class="info-card">
                <div class="flex items-center gap-4 mb-2">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
                    <i class="fas fa-check-circle text-white"></i>
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-green-600 font-medium mb-1">状态</div>
                    <span class="badge badge-success">活跃</span>
                  </div>
                </div>
              </div>

              <!-- 创建时间 -->
              <div class="info-card">
                <div class="flex items-center gap-4 mb-2">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                    <i class="fas fa-calendar-plus text-white"></i>
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-orange-600 font-medium mb-1">创建时间</div>
                    <div class="text-sm font-bold text-gray-900">2024-01-15</div>
                  </div>
                </div>
              </div>

              <!-- 最后修改 -->
              <div class="info-card">
                <div class="flex items-center gap-4 mb-2">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
                    <i class="fas fa-clock text-white"></i>
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-red-600 font-medium mb-1">最后修改</div>
                    <div class="text-sm font-bold text-gray-900">2小时前</div>
                  </div>
                </div>
              </div>

              <!-- 版本 -->
              <div class="info-card">
                <div class="flex items-center gap-4 mb-2">
                  <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <i class="fas fa-code-branch text-white"></i>
                  </div>
                  <div class="flex-1">
                    <div class="text-xs text-indigo-600 font-medium mb-1">版本</div>
                    <div class="text-sm font-bold text-gray-900">v2.3.1</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 性能指标卡片 -->
          <div class="card p-6">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-800">
                <i class="fas fa-chart-line text-blue-500 mr-2"></i>
                性能指标
              </h3>
              <div class="flex gap-2">
                <button class="btn btn-sm btn-secondary" @click="exportReport">
                  <i class="fas fa-download mr-1"></i>
                  导出报告
                </button>
                <button class="btn btn-sm btn-secondary" @click="refreshMetrics">
                  <i class="fas fa-sync-alt mr-1"></i>
                  刷新
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <MetricProgress
                icon="fas fa-check-double"
                icon-bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
                label="完成率"
                value="96%"
                value-color="#10b981"
                :percentage="96"
                gradient-bg="linear-gradient(90deg, #10b981, #059669)"
                change="较上周提升 4%"
                change-color="#10b981"
                change-icon="fas fa-arrow-up"
              />

              <MetricProgress
                icon="fas fa-star"
                icon-bg="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                label="成功率"
                value="88%"
                value-color="#3b82f6"
                :percentage="88"
                gradient-bg="linear-gradient(90deg, #3b82f6, #2563eb)"
                change="与上周持平"
                change-color="#6b7280"
                change-icon="fas fa-minus"
              />

              <MetricProgress
                icon="fas fa-bolt"
                icon-bg="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
                label="效率得分"
                value="92%"
                value-color="#8b5cf6"
                :percentage="92"
                gradient-bg="linear-gradient(90deg, #8b5cf6, #7c3aed)"
                change="较上周提升 2%"
                change-color="#10b981"
                change-icon="fas fa-arrow-up"
              />
            </div>

            <!-- 优化建议 -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div class="suggestion-card border-l-4 border-blue-500">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-lightbulb text-blue-600"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-semibold text-blue-900 mb-1">优化建议</h4>
                    <p class="text-sm text-blue-700">该流程运行稳定，建议增加并行处理节点以提升效率。</p>
                  </div>
                </div>
              </div>

              <div class="suggestion-card border-l-4 border-green-500">
                <div class="flex items-start gap-3">
                  <div class="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                    <i class="fas fa-check-circle text-green-600"></i>
                  </div>
                  <div class="flex-1">
                    <h4 class="text-sm font-semibold text-green-900 mb-1">运行状态</h4>
                    <p class="text-sm text-green-700">流程运行平稳，无异常报错，性能指标良好。</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 流程图标签页 -->
        <div v-if="activeTab === 'diagram'">
          <div class="process-diagram">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-semibold text-gray-800">
                <i class="fas fa-sitemap mr-2"></i>
                BPMN 流程图
              </h3>
              <div class="flex gap-2">
                <button class="btn btn-sm btn-secondary">
                  <i class="fas fa-search-plus"></i>
                </button>
                <button class="btn btn-sm btn-secondary">
                  <i class="fas fa-search-minus"></i>
                </button>
                <button class="btn btn-sm btn-secondary">
                  <i class="fas fa-expand"></i>
                </button>
              </div>
            </div>

            <div class="flex items-center justify-center gap-8">
              <!-- 开始节点 -->
              <div class="process-node">
                <div class="node-icon" style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); border-radius: 50%;">
                  <i class="fas fa-play"></i>
                </div>
                <div class="node-label">开始</div>
              </div>

              <div class="connection-line"></div>

              <!-- 任务节点 -->
              <div class="process-node">
                <div class="node-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
                  <i class="fas fa-tasks"></i>
                </div>
                <div class="node-label">审核订单</div>
              </div>

              <div class="connection-line"></div>

              <!-- 决策节点 -->
              <div class="process-node">
                <div class="node-icon" style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); transform: rotate(45deg);">
                  <i class="fas fa-question" style="transform: rotate(-45deg);"></i>
                </div>
                <div class="node-label">审批决策</div>
              </div>

              <div class="connection-line"></div>

              <!-- 结束节点 -->
              <div class="process-node">
                <div class="node-icon" style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); border-radius: 50%;">
                  <i class="fas fa-stop"></i>
                </div>
                <div class="node-label">结束</div>
              </div>
            </div>
          </div>

          <div class="mt-4 text-sm text-gray-600 text-center">
            <i class="fas fa-info-circle mr-1"></i>
            点击节点可查看详细配置，拖拽可调整位置
          </div>
        </div>

        <!-- 实例列表标签页 -->
        <div v-if="activeTab === 'instances'">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-semibold text-gray-800">
              <i class="fas fa-list mr-2"></i>
              流程实例
            </h3>
            <button class="btn btn-sm btn-primary" @click="startNewInstance">
              <i class="fas fa-plus mr-1"></i>
              新建实例
            </button>
          </div>

          <div class="grid grid-cols-1 gap-4">
            <!-- 实例卡片 -->
            <div
              v-for="instance in instances"
              :key="instance.id"
              class="instance-card"
              @click="$router.push(`/process-instance-detail/${instance.id}`)"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white">
                    <i class="fas fa-check"></i>
                  </div>
                  <div>
                    <h4 class="font-semibold text-gray-900">{{ instance.title }}</h4>
                    <p class="text-sm text-gray-600">{{ instance.starter }} | {{ instance.time }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-3">
                  <span class="badge" :class="getInstanceStatusBadge(instance.status)">
                    {{ getInstanceStatusText(instance.status) }}
                  </span>
                  <button class="btn btn-sm btn-secondary" @click.stop="$router.push(`/process-instance-detail/${instance.id}`)">
                    <i class="fas fa-eye"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 历史记录标签页 -->
        <div v-if="activeTab === 'history'">
          <h3 class="text-lg font-semibold text-gray-800 mb-6">
            <i class="fas fa-history mr-2"></i>
            变更历史
          </h3>

          <Timeline :items="historyItems" />
        </div>

        <!-- 配置标签页 -->
        <div v-if="activeTab === 'settings'">
          <h3 class="text-lg font-semibold text-gray-800 mb-6">
            <i class="fas fa-cog mr-2"></i>
            流程配置
          </h3>

          <div class="space-y-6">
            <div class="card p-4">
              <h4 class="font-semibold text-gray-900 mb-4">基本设置</h4>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">流程名称</label>
                  <input type="text" class="form-input w-full" :value="processName">
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">流程描述</label>
                  <textarea class="form-textarea w-full" rows="3" :value="processDescription"></textarea>
                </div>
                <div class="flex items-center gap-4">
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" class="form-checkbox" checked>
                    <span class="text-sm text-gray-700">启用自动审批</span>
                  </label>
                  <label class="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" class="form-checkbox">
                    <span class="text-sm text-gray-700">允许并行执行</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="flex gap-3">
              <button class="btn btn-primary">
                <i class="fas fa-save mr-2"></i>
                保存配置
              </button>
              <button class="btn btn-secondary">
                <i class="fas fa-undo mr-2"></i>
                重置
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { InfoCard, TabNav, Timeline, MetricProgress, InstanceStatusCard } from '@/components/common'

export default {
  name: 'ProcessDetail',
  components: {
    InfoCard,
    TabNav,
    Timeline,
    MetricProgress,
    InstanceStatusCard
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activeTab: 'overview',
      processName: '订单处理流程',
      processDescription: '自动化订单从创建到完成的全流程处理',
      instances: [
        {
          id: '10245',
          title: '订单 #10245',
          starter: '李四',
          time: '2小时前',
          status: 'completed'
        },
        {
          id: '10246',
          title: '订单 #10246',
          starter: '王五',
          time: '30分钟前',
          status: 'running'
        }
      ],
      historyItems: [
        {
          id: 1,
          title: '流程已发布',
          description: '张三 发布了流程版本 v2.3.1',
          time: '2小时前',
          type: 'success'
        },
        {
          id: 2,
          title: '配置更新',
          description: '李四 修改了审批节点的超时设置',
          time: '1天前',
          type: ''
        },
        {
          id: 3,
          title: '流程创建',
          description: '张三 创建了订单处理流程',
          time: '7天前',
          type: ''
        }
      ]
    }
  },
  methods: {
    switchTab(tab) {
      this.activeTab = tab
    },
    copyProcessId() {
      navigator.clipboard.writeText('PROC-2024-001').then(() => {
        alert('流程ID已复制到剪贴板')
      })
    },
    exportReport() {
      alert('正在生成报告...')
    },
    refreshMetrics() {
      alert('正在刷新性能指标...')
    },
    startNewInstance() {
      alert('启动新实例功能')
    },
    getInstanceStatusBadge(status) {
      switch (status) {
        case 'completed':
          return 'badge-success'
        case 'running':
          return 'badge-warning'
        default:
          return 'badge-secondary'
      }
    },
    getInstanceStatusText(status) {
      switch (status) {
        case 'completed':
          return '已完成'
        case 'running':
          return '审批中'
        default:
          return '未知'
      }
    },
    getHistoryTimeColor(type) {
      switch (type) {
        case 'success':
          return 'text-green-600'
        default:
          return 'text-gray-500'
      }
    }
  }
}
</script>

<style scoped>
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-mini-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.stat-mini-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.stat-mini-card .icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  margin-bottom: 12px;
}

.stat-mini-card .label {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
}

.stat-mini-card .value {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
}

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

.metric-item {
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.suggestion-card {
  padding: 16px;
  background: linear-gradient(90deg, #f8fafc 0%, #ffffff 100%);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.suggestion-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.process-diagram {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 20px;
  padding: 48px;
  min-height: 350px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.process-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.node-icon {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 28px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.node-icon:hover {
  transform: translateY(-6px) scale(1.05);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
}

.node-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  text-align: center;
}

.connection-line {
  flex: 1;
  height: 3px;
  background: linear-gradient(90deg, #cbd5e1 0%, #94a3b8 100%);
  position: relative;
  min-width: 60px;
}

.connection-line::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-left: 8px solid #94a3b8;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

.instance-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.instance-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
  border-color: #3b82f6;
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

.timeline-dot.success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.timeline-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

@media (max-width: 768px) {
  .stats-overview {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .tab-nav {
    flex-direction: column;
  }

  .tab-button {
    padding: 12px 20px;
  }
}
</style>
