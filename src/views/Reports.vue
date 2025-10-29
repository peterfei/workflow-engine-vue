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
        <div>
          <h1 class="page-title">报告分析</h1>
          <p class="page-subtitle">流程执行统计和分析报告</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn btn-secondary">
            <i class="fas fa-calendar"></i>
            日期筛选
          </button>
          <button class="btn btn-secondary">
            <i class="fas fa-download"></i>
            导出报告
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="p-6">
      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon="fas fa-play-circle"
          icon-bg="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
          :value="'1,245'"
          label="总实例数"
          :change="{ type: 'positive', icon: 'fas fa-arrow-up', text: '+15% 较上月' }"
        />

        <StatCard
          icon="fas fa-clock"
          icon-bg="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          :value="'2.4h'"
          label="平均完成时间"
          :change="{ type: 'negative', icon: 'fas fa-arrow-down', text: '-8% 较上月' }"
        />

        <StatCard
          icon="fas fa-check-circle"
          icon-bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          :value="'94.2%'"
          label="成功率"
          :change="{ type: 'positive', icon: 'fas fa-arrow-up', text: '+2% 较上月' }"
        />

        <StatCard
          icon="fas fa-sitemap"
          icon-bg="linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)"
          :value="18"
          label="活跃流程"
          :change="{ type: 'neutral', icon: 'fas fa-minus', text: '与上月持平' }"
        />
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- 流程执行趋势 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            <i class="fas fa-chart-line text-blue-500 mr-2"></i>
            流程执行趋势
          </h3>
          <div class="chart-placeholder">
            <div class="chart-icon">
              <i class="fas fa-chart-line"></i>
            </div>
            <p class="chart-text">趋势图表</p>
            <p class="chart-desc">展示最近30天的流程执行趋势</p>
          </div>
        </div>

        <!-- 流程状态分布 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            <i class="fas fa-chart-pie text-blue-500 mr-2"></i>
            流程状态分布
          </h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-green-500 rounded"></div>
                <span class="text-sm text-gray-600">已完成</span>
              </div>
              <span class="text-sm font-medium text-gray-800">68%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-blue-500 rounded"></div>
                <span class="text-sm text-gray-600">进行中</span>
              </div>
              <span class="text-sm font-medium text-gray-800">24%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-yellow-500 rounded"></div>
                <span class="text-sm text-gray-600">待处理</span>
              </div>
              <span class="text-sm font-medium text-gray-800">6%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-4 h-4 bg-red-500 rounded"></div>
                <span class="text-sm text-gray-600">异常</span>
              </div>
              <span class="text-sm font-medium text-gray-800">2%</span>
            </div>
          </div>
        </div>

        <!-- 热门流程 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            <i class="fas fa-fire text-blue-500 mr-2"></i>
            热门流程
          </h3>
          <div class="space-y-3">
            <div v-for="process in popularProcesses" :key="process.id" class="popular-process">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <div class="process-rank">{{ process.rank }}</div>
                  <div>
                    <div class="font-medium text-gray-900">{{ process.name }}</div>
                    <div class="text-sm text-gray-500">{{ process.instances }} 个实例</div>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-sm font-medium text-gray-900">{{ process.successRate }}%</div>
                  <div class="text-xs text-gray-500">成功率</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 性能指标 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            <i class="fas fa-tachometer-alt text-blue-500 mr-2"></i>
            性能指标
          </h3>
          <div class="space-y-4">
            <MetricProgress
              icon="fas fa-bolt"
              icon-bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
              label="系统响应时间"
              value="120ms"
              value-color="#10b981"
              :percentage="85"
              gradient-bg="linear-gradient(90deg, #10b981, #059669)"
            />

            <MetricProgress
              icon="fas fa-microchip"
              icon-bg="linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
              label="CPU 使用率"
              value="45%"
              value-color="#3b82f6"
              :percentage="45"
              gradient-bg="linear-gradient(90deg, #3b82f6, #2563eb)"
            />

            <MetricProgress
              icon="fas fa-memory"
              icon-bg="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
              label="内存使用率"
              value="67%"
              value-color="#f59e0b"
              :percentage="67"
              gradient-bg="linear-gradient(90deg, #f59e0b, #d97706)"
            />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { StatCard, MetricProgress } from '@/components/common'

export default {
  name: 'Reports',
  components: {
    StatCard,
    MetricProgress
  },
  data() {
    return {
      popularProcesses: [
        { id: 1, rank: 1, name: '订单处理流程', instances: 245, successRate: 96 },
        { id: 2, rank: 2, name: '审批流程', instances: 189, successRate: 92 },
        { id: 3, rank: 3, name: '请假申请流程', instances: 156, successRate: 98 },
        { id: 4, rank: 4, name: '报销流程', instances: 134, successRate: 89 },
        { id: 5, rank: 5, name: '入职流程', instances: 98, successRate: 95 }
      ]
    }
  }
}
</script>

<style scoped>
.stat-change.neutral {
  color: #6b7280;
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 8px;
  border: 2px dashed #e2e8f0;
}

.chart-icon {
  font-size: 48px;
  color: #cbd5e1;
  margin-bottom: 16px;
}

.chart-text {
  font-size: 18px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 8px;
}

.chart-desc {
  font-size: 14px;
  color: #94a3b8;
  text-align: center;
}

.popular-process {
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.popular-process:hover {
  background: #f8fafc;
}

.process-rank {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
}
</style>
