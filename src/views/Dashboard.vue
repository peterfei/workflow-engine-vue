<template>
  <div>
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="page-title">仪表板概览</h1>
          <p class="page-subtitle">欢迎回来，这里是您的流程引擎平台总览</p>
        </div>
        <div class="flex items-center space-x-4">
          <button class="btn btn-primary" @click="$router.push('/designer')">
            <i class="fas fa-plus mr-2"></i>
            创建流程
          </button>
          <div class="relative">
            <button class="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                管
              </div>
              <span class="text-sm font-medium">管理员</span>
              <i class="fas fa-chevron-down text-xs"></i>
            </button>
          </div>
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
          :value="24"
          label="总流程数"
          :change="{ type: 'positive', icon: 'fas fa-arrow-up', text: '+12% 较上月' }"
        />

        <StatCard
          icon="fas fa-check-circle"
          icon-bg="linear-gradient(135deg, #10b981 0%, #059669 100%)"
          :value="156"
          label="运行中实例"
          :change="{ type: 'positive', icon: 'fas fa-arrow-up', text: '+8% 较昨日' }"
        />

        <StatCard
          icon="fas fa-spinner"
          icon-bg="linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"
          :value="'1,234'"
          label="已完成任务"
          :change="{ type: 'positive', icon: 'fas fa-arrow-up', text: '+15% 较昨日' }"
        />

        <StatCard
          icon="fas fa-clock"
          icon-bg="linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)"
          :value="'2.4h'"
          label="平均处理时间"
          :change="{ type: 'negative', icon: 'fas fa-arrow-down', text: '-5% 较昨日' }"
        />
      </div>

      <!-- 快速操作 -->
      <div class="card p-6 mb-8">
        <h2 class="text-xl font-semibold text-gray-800 mb-6">快速操作</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button class="btn btn-primary flex items-center justify-center p-4 h-20" @click="$router.push('/designer')">
            <div class="text-center">
              <i class="fas fa-plus-circle text-2xl mb-2"></i>
              <div class="text-sm font-medium">创建新流程</div>
            </div>
          </button>
          <button class="btn btn-secondary flex items-center justify-center p-4 h-20" @click="$router.push('/process-list')">
            <div class="text-center">
              <i class="fas fa-sitemap text-2xl mb-2"></i>
              <div class="text-sm font-medium">流程管理</div>
            </div>
          </button>
          <button class="btn btn-secondary flex items-center justify-center p-4 h-20" @click="$router.push('/reports')">
            <div class="text-center">
              <i class="fas fa-chart-line text-2xl mb-2"></i>
              <div class="text-sm font-medium">查看报告</div>
            </div>
          </button>
        </div>
      </div>

      <!-- 最近活动 -->
      <div class="card p-6 mb-8">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-xl font-semibold text-gray-800">最近活动</h2>
          <a href="#" class="text-blue-600 hover:text-blue-700 text-sm font-medium">查看全部</a>
        </div>
        <div class="space-y-4">
          <div class="flex items-center p-4 bg-gray-50 rounded-lg">
            <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <i class="fas fa-play text-blue-600"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800">启动了"员工入职流程"</p>
              <p class="text-xs text-gray-500">2分钟前</p>
            </div>
          </div>
          <div class="flex items-center p-4 bg-gray-50 rounded-lg">
            <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-4">
              <i class="fas fa-check text-green-600"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800">完成了"采购审批流程"</p>
              <p class="text-xs text-gray-500">15分钟前</p>
            </div>
          </div>
          <div class="flex items-center p-4 bg-gray-50 rounded-lg">
            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
              <i class="fas fa-edit text-yellow-600"></i>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-800">修改了"请假申请流程"</p>
              <p class="text-xs text-gray-500">1小时前</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 流程状态分布 -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">流程状态分布</h3>
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span class="text-sm text-gray-600">运行中</span>
              </div>
              <span class="text-sm font-medium text-gray-800">45%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span class="text-sm text-gray-600">已完成</span>
              </div>
              <span class="text-sm font-medium text-gray-800">35%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                <span class="text-sm text-gray-600">待处理</span>
              </div>
              <span class="text-sm font-medium text-gray-800">15%</span>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span class="text-sm text-gray-600">已暂停</span>
              </div>
              <span class="text-sm font-medium text-gray-800">5%</span>
            </div>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">性能指标</h3>
          <div class="space-y-4">
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">系统可用性</span>
                <span class="text-sm font-medium text-gray-800">99.9%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-green-500 h-2 rounded-full" style="width: 99.9%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">响应时间</span>
                <span class="text-sm font-medium text-gray-800">120ms</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-blue-500 h-2 rounded-full" style="width: 85%"></div>
              </div>
            </div>
            <div>
              <div class="flex justify-between items-center mb-2">
                <span class="text-sm text-gray-600">并发处理</span>
                <span class="text-sm font-medium text-gray-800">1,200</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div class="bg-purple-500 h-2 rounded-full" style="width: 75%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { StatCard } from '@/components/common'

export default {
  name: 'Dashboard',
  components: {
    StatCard
  }
}
</script>

<style scoped>
.stat-change {
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.stat-change.positive {
  color: var(--success-600);
}

.stat-change.negative {
  color: var(--error-600);
}
</style>
