/**
 * 流程存储工具 - LocalStorage 管理
 * 用于保存和加载已发布的流程
 */

const STORAGE_KEY = 'workflow_processes'

/**
 * 生成唯一的流程 ID
 * @returns {string} 格式：process_<timestamp>
 */
export function generateProcessId() {
  return `process_${Date.now()}`
}

/**
 * 生成图标渐变背景
 * @param {string} category 流程分类
 * @returns {string} CSS 渐变字符串
 */
function getIconGradient(category) {
  const gradients = {
    'approval': 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    'business': 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
    'hr': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    'finance': 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    'default': 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)'
  }
  return gradients[category] || gradients.default
}

/**
 * 获取分类对应的图标
 * @param {string} category 流程分类
 * @returns {string} Font Awesome 图标类名
 */
function getCategoryIcon(category) {
  const icons = {
    'approval': 'fas fa-file-signature',
    'business': 'fas fa-briefcase',
    'hr': 'fas fa-users',
    'finance': 'fas fa-dollar-sign',
    'default': 'fas fa-sitemap'
  }
  return icons[category] || icons.default
}

/**
 * 保存流程到 LocalStorage
 * @param {Object} processData 流程数据
 * @returns {Object} 保存的完整流程对象
 */
export function saveProcess(processData) {
  try {
    const processes = getAllProcesses()
    
    // 检查是否是更新现有流程
    const existingIndex = processes.findIndex(p => p.id === processData.id)
    
    const now = new Date().toISOString()
    let savedProcess

    if (existingIndex >= 0) {
      // 更新现有流程：保留 createdAt，正确递增版本号，保证分类与图标一致
      const existing = processes[existingIndex]
      const previousVersion = existing.version || 'v1.0'
      const versionNum = parseFloat(String(previousVersion).replace('v', '')) || 1.0
      const nextVersion = `v${(versionNum + 0.1).toFixed(1)}`

      const category = (processData.category != null ? processData.category : existing.category) || 'default'
      const icon = processData.icon || existing.icon || getCategoryIcon(category)
      const iconBg = processData.iconBg || existing.iconBg || getIconGradient(category)

      const updated = {
        ...existing,
        ...processData,
        id: existing.id,
        createdAt: existing.createdAt,
        updatedAt: now,
        version: nextVersion,
        category,
        icon,
        iconBg
      }

      processes[existingIndex] = updated
      savedProcess = updated
    } else {
      // 新增流程：初始化默认值，生成ID与版本
      const category = processData.category || 'default'
      const created = {
        id: processData.id || generateProcessId(),
        name: processData.name || '未命名流程',
        description: processData.description || '',
        status: processData.status || 'published',
        category,
        boundFormId: processData.boundFormId || null,
        fieldMapping: processData.fieldMapping || {},
        nodes: processData.nodes || [],
        connections: processData.connections || [],
        creator: processData.creator || '当前用户',
        createdAt: now,
        updatedAt: now,
        version: 'v1.0',
        icon: processData.icon || getCategoryIcon(category),
        iconBg: processData.iconBg || getIconGradient(category),
        instanceCount: processData.instanceCount || 0,
        completedCount: processData.completedCount || 0,
        runningCount: processData.runningCount || 0
      }
      processes.push(created)
      savedProcess = created
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(processes))
    return savedProcess
  } catch (error) {
    console.error('保存流程失败:', error)
    throw new Error('保存流程失败，请检查浏览器存储设置')
  }
}

/**
 * 获取所有流程
 * @returns {Array} 流程列表
 */
export function getAllProcesses() {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('加载流程列表失败:', error)
    return []
  }
}

/**
 * 根据 ID 获取流程
 * @param {string} id 流程 ID
 * @returns {Object|null} 流程对象或 null
 */
export function getProcessById(id) {
  const processes = getAllProcesses()
  return processes.find(p => p.id === id) || null
}

/**
 * 更新流程
 * @param {string} id 流程 ID
 * @param {Object} updates 要更新的字段
 * @returns {Object|null} 更新后的流程对象
 */
export function updateProcess(id, updates) {
  try {
    const processes = getAllProcesses()
    const index = processes.findIndex(p => p.id === id)
    
    if (index === -1) {
      throw new Error('流程不存在')
    }
    
    processes[index] = {
      ...processes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(processes))
    return processes[index]
  } catch (error) {
    console.error('更新流程失败:', error)
    return null
  }
}

/**
 * 删除流程
 * @param {string} id 流程 ID
 * @returns {boolean} 是否删除成功
 */
export function deleteProcess(id) {
  try {
    const processes = getAllProcesses()
    const filtered = processes.filter(p => p.id !== id)
    
    if (filtered.length === processes.length) {
      return false // 未找到要删除的流程
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('删除流程失败:', error)
    return false
  }
}

/**
 * 更新流程状态
 * @param {string} id 流程 ID
 * @param {string} status 新状态 (draft|published|active|disabled)
 * @returns {Object|null} 更新后的流程对象
 */
export function updateProcessStatus(id, status) {
  return updateProcess(id, { status })
}

/**
 * 获取流程统计信息
 * @returns {Object} 统计数据
 */
export function getProcessStats() {
  const processes = getAllProcesses()
  return {
    total: processes.length,
    active: processes.filter(p => p.status === 'active').length,
    draft: processes.filter(p => p.status === 'draft').length,
    published: processes.filter(p => p.status === 'published').length,
    disabled: processes.filter(p => p.status === 'disabled').length
  }
}

/**
 * 清空所有流程（谨慎使用）
 * @returns {boolean} 是否清空成功
 */
export function clearAllProcesses() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('清空流程失败:', error)
    return false
  }
}



