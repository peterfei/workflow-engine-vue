/*
  Workflow Engine Vue
  Copyright (c) 2025 peterfei
  Email: peterfeispace@gmail.com
  GitHub: https://github.com/peterfei/workflow-engine-vue
*/

/**
 * 导出工具函数
 * 支持导出为 PNG、SVG 和 JSON 格式
 */

/**
 * 导出为PNG图片
 * @param {HTMLElement} canvasElement - 画布元素
 * @param {string} filename - 文件名
 */
export async function exportToPNG(canvasElement, filename = '流程图.png') {
  try {
    // 使用 html2canvas 库
    const html2canvas = (await import('html2canvas')).default
    
    const canvas = await html2canvas(canvasElement, {
      backgroundColor: '#ffffff',
      scale: 2, // 提高分辨率
      logging: false,
      useCORS: true
    })
    
    // 创建下载链接
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL('image/png')
    link.click()
    
    return true
  } catch (error) {
    console.error('导出PNG失败:', error)
    throw new Error('导出PNG失败')
  }
}

/**
 * 导出为SVG
 * @param {Object} flowData - 流程数据 { nodes, connections, processConfig }
 * @param {string} filename - 文件名
 */
export function exportToSVG(flowData, filename = '流程图.svg') {
  try {
    const { nodes, connections, processConfig } = flowData
    
    // 计算画布大小
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    nodes.forEach(node => {
      minX = Math.min(minX, node.x)
      minY = Math.min(minY, node.y)
      maxX = Math.max(maxX, node.x + 100) // 节点宽度约100
      maxY = Math.max(maxY, node.y + 100) // 节点高度约100
    })
    
    const width = maxX - minX + 100
    const height = maxY - minY + 100
    const offsetX = -minX + 50
    const offsetY = -minY + 50
    
    // 创建SVG内容
    let svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <title>${processConfig.name || '流程图'}</title>
  <defs>
    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
    </marker>
  </defs>
  
  <!-- 背景 -->
  <rect width="${width}" height="${height}" fill="#ffffff"/>
  
  <!-- 连接线 -->
  <g id="connections">
`
    
    // 绘制连接线
    connections.forEach(conn => {
      const fromNode = nodes.find(n => n.id === conn.from)
      const toNode = nodes.find(n => n.id === conn.to)
      if (!fromNode || !toNode) return
      
      const x1 = fromNode.x + offsetX + 24
      const y1 = fromNode.y + offsetY + 24
      const x2 = toNode.x + offsetX + 24
      const y2 = toNode.y + offsetY + 24
      
      const dx = x2 - x1
      const dy = y2 - y1
      const cpX = x1 + dx / 2
      const cpY = y1 + dy / 2 - Math.abs(dx) * 0.15
      
      svgContent += `    <path d="M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}" 
        stroke="#94a3b8" stroke-width="2" fill="none" marker-end="url(#arrowhead)"/>\n`
    })
    
    svgContent += `  </g>
  
  <!-- 节点 -->
  <g id="nodes">
`
    
    // 绘制节点
    nodes.forEach(node => {
      const x = node.x + offsetX
      const y = node.y + offsetY
      const colors = {
        start: '#10b981',
        task: '#3b82f6',
        gateway: '#f59e0b',
        end: '#ef4444',
        subprocess: '#8b5cf6',
        timer: '#06b6d4',
        message: '#ec4899'
      }
      const color = colors[node.type] || '#6b7280'
      const isCircle = node.type === 'start' || node.type === 'end'
      
      svgContent += `    <g transform="translate(${x}, ${y})">
      ${isCircle ? 
        `<circle cx="24" cy="24" r="24" fill="${color}"/>` :
        `<rect x="0" y="0" width="48" height="48" rx="8" fill="${color}"/>`
      }
      <text x="24" y="70" text-anchor="middle" font-family="Arial" font-size="12" font-weight="600" fill="#374151">${node.label}</text>
    </g>
`
    })
    
    svgContent += `  </g>
</svg>`
    
    // 创建下载链接
    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const link = document.createElement('a')
    link.download = filename
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
    
    return true
  } catch (error) {
    console.error('导出SVG失败:', error)
    throw new Error('导出SVG失败')
  }
}

/**
 * 导出为JSON
 * @param {Object} flowData - 流程数据
 * @param {string} filename - 文件名
 */
export function exportToJSON(flowData, filename = '流程图.json') {
  try {
    const json = JSON.stringify(flowData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const link = document.createElement('a')
    link.download = filename
    link.href = URL.createObjectURL(blob)
    link.click()
    URL.revokeObjectURL(link.href)
    
    return true
  } catch (error) {
    console.error('导出JSON失败:', error)
    throw new Error('导出JSON失败')
  }
}

/**
 * 从JSON文件导入
 * @param {File} file - JSON文件
 * @returns {Promise<Object>} 流程数据
 */
export function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        // 验证数据格式
        if (!data.nodes || !Array.isArray(data.nodes)) {
          throw new Error('无效的流程数据格式')
        }
        resolve(data)
      } catch (error) {
        reject(new Error('解析JSON文件失败: ' + error.message))
      }
    }
    
    reader.onerror = () => {
      reject(new Error('读取文件失败'))
    }
    
    reader.readAsText(file)
  })
}


