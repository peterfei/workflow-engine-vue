<template>
  <div class="minimap-container" :class="{ 'minimized': isMinimized }">
    <div class="minimap-header">
      <span class="minimap-title">
        <i class="fas fa-map"></i>
        小地图
      </span>
      <div class="minimap-controls">
        <button class="minimap-btn" @click="isMinimized = !isMinimized" :title="isMinimized ? '展开' : '收起'">
          <i class="fas" :class="isMinimized ? 'fa-chevron-up' : 'fa-chevron-down'"></i>
        </button>
      </div>
    </div>
    <div v-if="!isMinimized" class="minimap-content">
      <svg 
        :viewBox="`${bounds.minX} ${bounds.minY} ${bounds.width} ${bounds.height}`"
        class="minimap-svg"
        @click="onMinimapClick"
        @mousedown="onViewportDragStart"
      >
        <!-- 背景 -->
        <rect 
          :x="bounds.minX" 
          :y="bounds.minY" 
          :width="bounds.width" 
          :height="bounds.height" 
          fill="#f8fafc" 
        />
        
        <!-- 连接线 -->
        <g class="minimap-connections">
          <path 
            v-for="conn in connections" 
            :key="conn.id"
            :d="getConnectionPath(conn)"
            stroke="#94a3b8"
            stroke-width="2"
            fill="none"
          />
        </g>
        
        <!-- 节点 -->
        <g class="minimap-nodes">
          <g v-for="node in nodes" :key="node.id">
            <circle
              v-if="node.type === 'start' || node.type === 'end'"
              :cx="node.x + 24"
              :cy="node.y + 24"
              r="24"
              :fill="getNodeColor(node.type)"
              :class="{ 'selected': selectedNodes.includes(node.id) }"
            />
            <rect
              v-else
              :x="node.x"
              :y="node.y"
              width="48"
              height="48"
              rx="8"
              :fill="getNodeColor(node.type)"
              :class="{ 'selected': selectedNodes.includes(node.id) }"
            />
          </g>
        </g>
        
        <!-- 当前视口 -->
        <rect
          :x="viewport.x"
          :y="viewport.y"
          :width="viewport.width"
          :height="viewport.height"
          fill="rgba(59, 130, 246, 0.1)"
          stroke="#3b82f6"
          stroke-width="3"
          class="minimap-viewport"
          @mousedown.stop="onViewportDragStart"
        />
      </svg>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'

export default {
  name: 'MiniMap',
  props: {
    nodes: {
      type: Array,
      required: true
    },
    connections: {
      type: Array,
      required: true
    },
    selectedNodes: {
      type: Array,
      default: () => []
    },
    canvasWidth: {
      type: Number,
      default: 1000
    },
    canvasHeight: {
      type: Number,
      default: 500
    },
    zoom: {
      type: Number,
      default: 1
    },
    panX: {
      type: Number,
      default: 0
    },
    panY: {
      type: Number,
      default: 0
    }
  },
  emits: ['navigate'],
  setup(props, { emit }) {
    const isMinimized = ref(false)
    const isDraggingViewport = ref(false)
    
    // 计算画布边界
    const bounds = computed(() => {
      if (props.nodes.length === 0) {
        return {
          minX: 0,
          minY: 0,
          width: 1000,
          height: 500,
          maxX: 1000,
          maxY: 500
        }
      }
      
      const padding = 100
      let minX = Infinity
      let minY = Infinity
      let maxX = -Infinity
      let maxY = -Infinity
      
      props.nodes.forEach(node => {
        minX = Math.min(minX, node.x)
        minY = Math.min(minY, node.y)
        maxX = Math.max(maxX, node.x + 48)
        maxY = Math.max(maxY, node.y + 48)
      })
      
      minX -= padding
      minY -= padding
      maxX += padding
      maxY += padding
      
      return {
        minX,
        minY,
        width: maxX - minX,
        height: maxY - minY,
        maxX,
        maxY
      }
    })
    
    // 当前视口
    const viewport = computed(() => {
      const viewportWidth = props.canvasWidth / props.zoom
      const viewportHeight = props.canvasHeight / props.zoom
      const viewportX = -props.panX / props.zoom
      const viewportY = -props.panY / props.zoom
      
      return {
        x: viewportX,
        y: viewportY,
        width: viewportWidth,
        height: viewportHeight
      }
    })
    
    // 获取节点颜色
    const getNodeColor = (type) => {
      const colors = {
        start: '#10b981',
        task: '#3b82f6',
        gateway: '#f59e0b',
        end: '#ef4444',
        subprocess: '#8b5cf6',
        timer: '#06b6d4',
        message: '#ec4899',
        parallel: '#14b8a6',
        exclusive: '#f97316',
        event: '#84cc16'
      }
      return colors[type] || '#6b7280'
    }
    
    // 获取连接路径
    const getConnectionPath = (conn) => {
      const fromNode = props.nodes.find(n => n.id === conn.from)
      const toNode = props.nodes.find(n => n.id === conn.to)
      if (!fromNode || !toNode) return ''
      
      const x1 = fromNode.x + 24
      const y1 = fromNode.y + 24
      const x2 = toNode.x + 24
      const y2 = toNode.y + 24
      
      const dx = x2 - x1
      const dy = y2 - y1
      const cpX = x1 + dx / 2
      const cpY = y1 + dy / 2 - Math.abs(dx) * 0.15
      
      return `M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`
    }
    
    // 点击小地图导航
    const onMinimapClick = (event) => {
      if (isDraggingViewport.value) return
      
      const svg = event.currentTarget
      const rect = svg.getBoundingClientRect()
      const svgX = ((event.clientX - rect.left) / rect.width) * bounds.value.width + bounds.value.minX
      const svgY = ((event.clientY - rect.top) / rect.height) * bounds.value.height + bounds.value.minY
      
      // 计算新的平移值，使点击位置居中
      const newPanX = -(svgX - props.canvasWidth / props.zoom / 2) * props.zoom
      const newPanY = -(svgY - props.canvasHeight / props.zoom / 2) * props.zoom
      
      emit('navigate', { panX: newPanX, panY: newPanY })
    }
    
    // 拖拽视口
    const onViewportDragStart = (event) => {
      isDraggingViewport.value = true
      event.preventDefault()
      
      const svg = event.currentTarget.closest('svg')
      const rect = svg.getBoundingClientRect()
      
      const onMouseMove = (e) => {
        const svgX = ((e.clientX - rect.left) / rect.width) * bounds.value.width + bounds.value.minX
        const svgY = ((e.clientY - rect.top) / rect.height) * bounds.value.height + bounds.value.minY
        
        const newPanX = -(svgX - props.canvasWidth / props.zoom / 2) * props.zoom
        const newPanY = -(svgY - props.canvasHeight / props.zoom / 2) * props.zoom
        
        emit('navigate', { panX: newPanX, panY: newPanY })
      }
      
      const onMouseUp = () => {
        isDraggingViewport.value = false
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }
      
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
    
    return {
      isMinimized,
      bounds,
      viewport,
      getNodeColor,
      getConnectionPath,
      onMinimapClick,
      onViewportDragStart
    }
  }
}
</script>

<style scoped>
.minimap-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 220px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  z-index: 1000;
  transition: all 0.3s ease;
}

.minimap-container.minimized {
  width: 150px;
}

.minimap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
  border-radius: 8px 8px 0 0;
}

.minimap-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  gap: 8px;
}

.minimap-controls {
  display: flex;
  gap: 4px;
}

.minimap-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: #6b7280;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  font-size: 12px;
}

.minimap-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.minimap-content {
  padding: 12px;
}

.minimap-svg {
  width: 100%;
  height: 140px;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
  cursor: crosshair;
  background: #f8fafc;
}

.minimap-viewport {
  cursor: move;
  pointer-events: all;
}

.minimap-viewport:hover {
  fill: rgba(59, 130, 246, 0.15);
}

.minimap-nodes rect.selected,
.minimap-nodes circle.selected {
  stroke: #ef4444;
  stroke-width: 3;
}
</style>

