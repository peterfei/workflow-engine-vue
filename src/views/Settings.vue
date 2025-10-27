<template>
  <div>
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="flex items-center justify-between w-full">
        <div>
          <h1 class="page-title">系统设置</h1>
          <p class="page-subtitle">管理系统配置和参数</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn btn-secondary">
            <i class="fas fa-undo"></i>
            重置
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-save"></i>
            保存设置
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- 左侧导航 -->
        <div class="lg:col-span-1">
          <div class="card p-4">
            <nav class="settings-nav">
              <button
                v-for="section in sections"
                :key="section.id"
                class="nav-item"
                :class="{ active: activeSection === section.id }"
                @click="activeSection = section.id"
              >
                <i :class="section.icon"></i>
                {{ section.name }}
              </button>
            </nav>
          </div>
        </div>

        <!-- 右侧内容 -->
        <div class="lg:col-span-2">
          <!-- 通用设置 -->
          <div v-if="activeSection === 'general'" class="card p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">
              <i class="fas fa-cog text-blue-500 mr-2"></i>
              通用设置
            </h3>
            <div class="space-y-6">
              <div class="setting-group">
                <label class="setting-label">系统名称</label>
                <input type="text" class="form-input" value="流程引擎平台">
              </div>
              <div class="setting-group">
                <label class="setting-label">系统描述</label>
                <textarea class="form-textarea" rows="3">基于BPMN 2.0的流程引擎管理系统</textarea>
              </div>
              <div class="setting-group">
                <label class="setting-label">默认语言</label>
                <select class="form-select">
                  <option value="zh-CN" selected>中文(简体)</option>
                  <option value="zh-TW">中文(繁体)</option>
                  <option value="en-US">English</option>
                </select>
              </div>
              <div class="setting-group">
                <label class="setting-label">时区</label>
                <select class="form-select">
                  <option value="Asia/Shanghai" selected>Asia/Shanghai (UTC+8)</option>
                  <option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option>
                  <option value="America/New_York">America/New_York (UTC-5)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 流程设置 -->
          <div v-if="activeSection === 'process'" class="card p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">
              <i class="fas fa-sitemap text-blue-500 mr-2"></i>
              流程设置
            </h3>
            <div class="space-y-6">
              <div class="setting-group">
                <label class="setting-label">默认流程超时时间</label>
                <div class="flex gap-2">
                  <input type="number" class="form-input flex-1" value="24">
                  <select class="form-select">
                    <option value="hours" selected>小时</option>
                    <option value="days">天</option>
                    <option value="weeks">周</option>
                  </select>
                </div>
              </div>
              <div class="setting-group">
                <label class="setting-label">自动清理历史数据</label>
                <div class="flex items-center gap-4">
                  <label class="flex items-center gap-2">
                    <input type="radio" name="cleanup" value="never" checked>
                    <span>从不清理</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="radio" name="cleanup" value="1year">
                    <span>1年后清理</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="radio" name="cleanup" value="6months">
                    <span>6个月后清理</span>
                  </label>
                </div>
              </div>
              <div class="setting-group">
                <label class="setting-label">流程版本控制</label>
                <div class="flex items-center gap-4">
                  <label class="flex items-center gap-2">
                    <input type="checkbox" checked>
                    <span>启用版本控制</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" checked>
                    <span>自动备份</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          <!-- 安全设置 -->
          <div v-if="activeSection === 'security'" class="card p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">
              <i class="fas fa-shield-alt text-blue-500 mr-2"></i>
              安全设置
            </h3>
            <div class="space-y-6">
              <div class="setting-group">
                <label class="setting-label">密码策略</label>
                <div class="space-y-2">
                  <label class="flex items-center gap-2">
                    <input type="checkbox" checked>
                    <span>至少8个字符</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" checked>
                    <span>包含大写字母</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" checked>
                    <span>包含数字</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="checkbox">
                    <span>包含特殊字符</span>
                  </label>
                </div>
              </div>
              <div class="setting-group">
                <label class="setting-label">登录失败锁定</label>
                <div class="flex gap-2 items-center">
                  <input type="number" class="form-input w-20" value="5">
                  <span>次失败后锁定</span>
                  <input type="number" class="form-input w-20" value="30">
                  <span>分钟</span>
                </div>
              </div>
              <div class="setting-group">
                <label class="setting-label">会话超时</label>
                <div class="flex gap-2 items-center">
                  <input type="number" class="form-input w-20" value="60">
                  <span>分钟无操作自动登出</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 通知设置 -->
          <div v-if="activeSection === 'notification'" class="card p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">
              <i class="fas fa-bell text-blue-500 mr-2"></i>
              通知设置
            </h3>
            <div class="space-y-6">
              <div class="setting-group">
                <label class="setting-label">邮件通知</label>
                <div class="space-y-2">
                  <label class="flex items-center gap-2">
                    <input type="checkbox" checked>
                    <span>流程启动通知</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" checked>
                    <span>任务分配通知</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="checkbox">
                    <span>流程完成通知</span>
                  </label>
                  <label class="flex items-center gap-2">
                    <input type="checkbox" checked>
                    <span>异常告警通知</span>
                  </label>
                </div>
              </div>
              <div class="setting-group">
                <label class="setting-label">SMTP 配置</label>
                <div class="grid grid-cols-2 gap-4">
                  <input type="text" class="form-input" placeholder="SMTP服务器" value="smtp.example.com">
                  <input type="number" class="form-input" placeholder="端口" value="587">
                  <input type="email" class="form-input" placeholder="发件人邮箱" value="noreply@example.com">
                  <input type="password" class="form-input" placeholder="密码">
                </div>
              </div>
            </div>
          </div>

          <!-- 系统信息 -->
          <div v-if="activeSection === 'system'" class="card p-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-6">
              <i class="fas fa-info-circle text-blue-500 mr-2"></i>
              系统信息
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="info-card">
                <div class="info-title">版本信息</div>
                <div class="info-content">
                  <div class="info-item">
                    <span class="info-label">当前版本</span>
                    <span class="info-value">v2.3.1</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">发布日期</span>
                    <span class="info-value">2024-01-15</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">许可证</span>
                    <span class="info-value">企业版</span>
                  </div>
                </div>
              </div>

              <div class="info-card">
                <div class="info-title">系统状态</div>
                <div class="info-content">
                  <div class="info-item">
                    <span class="info-label">运行状态</span>
                    <span class="status-indicator online">正常运行</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">启动时间</span>
                    <span class="info-value">2024-01-01 08:00:00</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">数据库</span>
                    <span class="status-indicator online">连接正常</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'Settings',
  data() {
    return {
      activeSection: 'general',
      sections: [
        { id: 'general', name: '通用设置', icon: 'fas fa-cog' },
        { id: 'process', name: '流程设置', icon: 'fas fa-sitemap' },
        { id: 'security', name: '安全设置', icon: 'fas fa-shield-alt' },
        { id: 'notification', name: '通知设置', icon: 'fas fa-bell' },
        { id: 'system', name: '系统信息', icon: 'fas fa-info-circle' }
      ]
    }
  }
}
</script>

<style scoped>
.settings-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: #6b7280;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-item:hover {
  background: #f3f4f6;
  color: #374151;
}

.nav-item.active {
  background: #eff6ff;
  color: #3b82f6;
  border-right: 3px solid #3b82f6;
}

.nav-item i {
  width: 16px;
  text-align: center;
}

.setting-group {
  padding-bottom: 16px;
  border-bottom: 1px solid #f3f4f6;
}

.setting-group:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.setting-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.info-card {
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.info-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.info-content {
  space-y: 12px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.info-item:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #6b7280;
}

.info-value {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.status-indicator {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-indicator.online {
  background: #dcfce7;
  color: #166534;
}
</style>
