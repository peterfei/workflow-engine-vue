/**
 * 流程验证工具
 * 检测流程设计中的错误和问题
 */

/**
 * 验证流程
 * @param {Array} nodes - 节点数组
 * @param {Array} connections - 连接数组
 * @returns {Object} 验证结果 { valid, errors, warnings }
 */
export function validateFlow(nodes, connections) {
  const errors = []
  const warnings = []
  
  // 1. 检查是否有开始节点
  const startNodes = nodes.filter(n => n.type === 'start')
  if (startNodes.length === 0) {
    errors.push({
      type: 'NO_START_NODE',
      message: '流程缺少开始节点',
      severity: 'error'
    })
  } else if (startNodes.length > 1) {
    warnings.push({
      type: 'MULTIPLE_START_NODES',
      message: `流程有${startNodes.length}个开始节点，建议只保留一个`,
      nodes: startNodes.map(n => n.id),
      severity: 'warning'
    })
  }
  
  // 2. 检查是否有结束节点
  const endNodes = nodes.filter(n => n.type === 'end')
  if (endNodes.length === 0) {
    warnings.push({
      type: 'NO_END_NODE',
      message: '流程缺少结束节点',
      severity: 'warning'
    })
  }
  
  // 3. 检查悬空节点（没有任何连接的节点，除了开始和结束）
  const danglingNodes = []
  nodes.forEach(node => {
    const hasIncoming = connections.some(c => c.to === node.id)
    const hasOutgoing = connections.some(c => c.from === node.id)
    
    if (!hasIncoming && !hasOutgoing) {
      if (node.type !== 'start' && node.type !== 'end') {
        danglingNodes.push(node)
      }
    }
  })
  
  if (danglingNodes.length > 0) {
    warnings.push({
      type: 'DANGLING_NODES',
      message: `发现${danglingNodes.length}个悬空节点（没有连接）`,
      nodes: danglingNodes.map(n => n.id),
      severity: 'warning'
    })
  }
  
  // 4. 检查孤立节点（没有输入的任务节点）
  const orphanNodes = []
  nodes.forEach(node => {
    if (node.type === 'task' || node.type === 'gateway' || node.type === 'subprocess') {
      const hasIncoming = connections.some(c => c.to === node.id)
      if (!hasIncoming) {
        orphanNodes.push(node)
      }
    }
  })
  
  if (orphanNodes.length > 0) {
    errors.push({
      type: 'ORPHAN_NODES',
      message: `发现${orphanNodes.length}个孤立节点（没有输入连接）`,
      nodes: orphanNodes.map(n => n.id),
      severity: 'error'
    })
  }
  
  // 5. 检查死路节点（没有输出的任务节点）
  const deadEndNodes = []
  nodes.forEach(node => {
    if (node.type === 'task' || node.type === 'gateway' || node.type === 'subprocess') {
      const hasOutgoing = connections.some(c => c.from === node.id)
      if (!hasOutgoing) {
        deadEndNodes.push(node)
      }
    }
  })
  
  if (deadEndNodes.length > 0) {
    warnings.push({
      type: 'DEAD_END_NODES',
      message: `发现${deadEndNodes.length}个死路节点（没有输出连接）`,
      nodes: deadEndNodes.map(n => n.id),
      severity: 'warning'
    })
  }
  
  // 6. 检测循环（使用DFS）
  const cycles = detectCycles(nodes, connections)
  if (cycles.length > 0) {
    warnings.push({
      type: 'CYCLES_DETECTED',
      message: `检测到${cycles.length}个循环路径`,
      cycles: cycles,
      severity: 'warning'
    })
  }
  
  // 7. 检查决策节点的输出
  nodes.forEach(node => {
    if (node.type === 'gateway') {
      const outgoing = connections.filter(c => c.from === node.id)
      if (outgoing.length < 2) {
        warnings.push({
          type: 'GATEWAY_INSUFFICIENT_OUTPUTS',
          message: `决策节点"${node.label}"应该有至少2个输出分支`,
          nodes: [node.id],
          severity: 'warning'
        })
      }
    }
  })
  
  // 8. 检查重复连接
  const connectionMap = new Map()
  connections.forEach(conn => {
    const key = `${conn.from}-${conn.to}`
    if (connectionMap.has(key)) {
      errors.push({
        type: 'DUPLICATE_CONNECTION',
        message: `检测到重复连接`,
        connection: conn,
        severity: 'error'
      })
    }
    connectionMap.set(key, conn)
  })
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
    summary: {
      totalNodes: nodes.length,
      totalConnections: connections.length,
      errorCount: errors.length,
      warningCount: warnings.length
    }
  }
}

/**
 * 检测循环
 * @param {Array} nodes - 节点数组
 * @param {Array} connections - 连接数组
 * @returns {Array} 循环路径数组
 */
function detectCycles(nodes, connections) {
  const cycles = []
  const visited = new Set()
  const recStack = new Set()
  const path = []
  
  // 构建邻接表
  const graph = new Map()
  nodes.forEach(node => {
    graph.set(node.id, [])
  })
  connections.forEach(conn => {
    if (graph.has(conn.from)) {
      graph.get(conn.from).push(conn.to)
    }
  })
  
  // DFS检测循环
  function dfs(nodeId) {
    visited.add(nodeId)
    recStack.add(nodeId)
    path.push(nodeId)
    
    const neighbors = graph.get(nodeId) || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (dfs(neighbor)) {
          return true
        }
      } else if (recStack.has(neighbor)) {
        // 找到循环
        const cycleStart = path.indexOf(neighbor)
        const cycle = path.slice(cycleStart)
        cycles.push([...cycle, neighbor])
        return true
      }
    }
    
    recStack.delete(nodeId)
    path.pop()
    return false
  }
  
  // 对每个未访问的节点执行DFS
  nodes.forEach(node => {
    if (!visited.has(node.id)) {
      dfs(node.id)
    }
  })
  
  return cycles
}

/**
 * 获取验证问题的详细信息
 * @param {Object} issue - 问题对象
 * @param {Array} nodes - 节点数组
 * @returns {Object} 详细信息
 */
export function getIssueDetails(issue, nodes) {
  const details = {
    type: issue.type,
    message: issue.message,
    severity: issue.severity,
    affectedNodes: []
  }
  
  if (issue.nodes) {
    details.affectedNodes = issue.nodes.map(nodeId => {
      const node = nodes.find(n => n.id === nodeId)
      return {
        id: nodeId,
        label: node?.label || '未知节点',
        type: node?.type || 'unknown'
      }
    })
  }
  
  if (issue.cycles) {
    details.cycles = issue.cycles.map(cycle => {
      return cycle.map(nodeId => {
        const node = nodes.find(n => n.id === nodeId)
        return node?.label || nodeId
      }).join(' → ')
    })
  }
  
  return details
}


