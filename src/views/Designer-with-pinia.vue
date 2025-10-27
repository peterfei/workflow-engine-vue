<template>
  <div>
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="flex items-center justify-between w-full">
        <div>
          <h1 class="page-title">流程设计器</h1>
          <p class="page-subtitle">创建和编辑业务流程图</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn btn-secondary" @click="$router.go(-1)">
            <i class="fas fa-arrow-left"></i>
            返回
          </button>
          <button class="btn btn-secondary" @click="toggleConnectionMode">
            <i class="fas fa-link"></i>
            {{ store.isConnecting ? '退出连接模式' : '连接模式' }}
          </button>
          <button class="btn btn-secondary" @click="toggleSnapToGrid">
            <i class="fas" :class="store.snapToGrid ? 'fa-magnet' : 'fa-border-none'"></i>
            {{ store.snapToGrid ? '网格吸附：开' : '网格吸附：关' }}
          </button>
          <button class="btn btn-secondary" @click="toggleShowGrid">
            <i class="fas" :class="store.showGrid ? 'fa-th' : 'fa-th-large'"></i>
            {{ store.showGrid ? '显示网格' : '隐藏网格' }}
          </button>
          <button class="btn btn-secondary">
            <i class="fas fa-save"></i>
            保存草稿
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-play"></i>
            发布流程
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="p-6">
      <div class="card p-6">
        <!-- 右键菜单 -->
        <div v-if="contextMenu.visible" 
             class="context-menu" 
             :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
             @click.stop>
          <!-- 节点右键菜单 -->
          <template v-if="contextMenu.type === 'node'">
            <div class="context-menu-item" @click="copySelectedNodes">
              <i class="fas fa-copy mr-2"></i>
              复制节点
            </div>
            <div class="context-menu-item" @click="editNodeProperties">
              <i class="fas fa-edit mr-2"></i>
              编辑属性
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item danger" @click="confirmDeleteNode">
              <i class="fas fa-trash mr-2"></i>
              删除节点
            </div>
          </template>
          <!-- 连接线右键菜单 -->
          <template v-else-if="contextMenu.type === 'connection'">
            <div class="context-menu-item" @click="editConnectionLabel">
              <i class="fas fa-tag mr-2"></i>
              编辑标签
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item danger" @click="confirmDeleteConnection">
              <i class="fas fa-trash mr-2"></i>
              删除连接
            </div>
          </template>
          <!-- 画布右键菜单 -->
          <template v-else-if="contextMenu.type === 'canvas'">
            <div class="context-menu-item" @click="pasteNodes" :class="{ disabled: !store.clipboard }">
              <i class="fas fa-paste mr-2"></i>
              粘贴
            </div>
            <div class="context-menu-item" @click="selectAllNodes">
              <i class="fas fa-object-group mr-2"></i>
              全选
            </div>
            <div class="context-menu-divider"></div>
            <div class="context-menu-item" @click="resetView">
              <i class="fas fa-expand mr-2"></i>
              重置视图
            </div>
          </template>
        </div>

        <!-- 删除确认对话框 -->
        <div v-if="deleteConfirm.visible" class="modal-overlay" @click="cancelDelete">
          <div class="modal-dialog" @click.stop>
            <div class="modal-header">
              <i class="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
              确认删除
            </div>
            <div class="modal-body">
              <p>{{ deleteConfirm.message }}</p>
              <p class="text-sm text-gray-500 mt-2">此操作可通过撤销恢复</p>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" @click="cancelDelete">取消</button>
              <button class="btn btn-danger" @click="executeDelete">
                <i class="fas fa-trash mr-2"></i>
                确认删除
              </button>
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between mb-6">
          <h3 class="text-lg font-semibold text-gray-800">
            <i class="fas fa-project-diagram text-blue-500 mr-2"></i>
            流程画布
          </h3>
          <div class="flex gap-2">
            <button class="btn btn-sm btn-secondary" @click="undo" :disabled="!store.canUndo">
              <i class="fas fa-undo"></i>
            </button>
            <button class="btn btn-sm btn-secondary" @click="redo" :disabled="!store.canRedo">
              <i class="fas fa-redo"></i>
            </button>
            <button class="btn btn-sm btn-secondary" @click="zoomIn">
              <i class="fas fa-search-plus"></i>
            </button>
            <button class="btn btn-sm btn-secondary" @click="zoomOut">
              <i class="fas fa-search-minus"></i>
            </button>
            <button class="btn btn-sm btn-secondary" @click="resetView">
              <i class="fas fa-expand"></i>
            </button>
          </div>
        </div>

        <!-- 设计器画布 -->
        <div class="designer-canvas">
          <div class="canvas-header">
            <div class="flex items-center gap-4">
              <span class="text-sm text-gray-600">流程名称：</span>
              <input
                type="text"
                class="form-input"
                placeholder="输入流程名称"
                v-model="store.processConfig.name"
              >
            </div>
          </div>

          <div class="canvas-content">
            <!-- 工具栏 -->
            <div class="toolbox">
              <div class="toolbox-section">
                <h4 class="toolbox-title">基本节点</h4>
                <div class="toolbox-items">
                  <div class="toolbox-item" draggable="true" @dragstart="onDragStart('start')">
                    <div class="node-icon start">
                      <i class="fas fa-play"></i>
                    </div>
                    <span class="node-label">开始</span>
                  </div>
                  <div class="toolbox-item" draggable="true" @dragstart="onDragStart('task')">
                    <div class="node-icon task">
                      <i class="fas fa-tasks"></i>
                    </div>
                    <span class="node-label">任务</span>
                  </div>
                  <div class="toolbox-item" draggable="true" @dragstart="onDragStart('gateway')">
                    <div class="node-icon gateway">
                      <i class="fas fa-question"></i>
                    </div>
                    <span class="node-label">决策</span>
                  </div>
                  <div class="toolbox-item" draggable="true" @dragstart="onDragStart('end')">
                    <div class="node-icon end">
                      <i class="fas fa-stop"></i>
                    </div>
                    <span class="node-label">结束</span>
                  </div>
                </div>
              </div>

              <div class="toolbox-section">
                <h4 class="toolbox-title">高级节点</h4>
                <div class="toolbox-items">
                  <div class="toolbox-item" draggable="true" @dragstart="onDragStart('subprocess')">
                    <div class="node-icon subprocess">
                      <i class="fas fa-sitemap"></i>
                    </div>
                    <span class="node-label">子流程</span>
                  </div>
                  <div class="toolbox-item" draggable="true" @dragstart="onDragStart('timer')">
                    <div class="node-icon timer">
                      <i class="fas fa-clock"></i>
                    </div>
                    <span class="node-label">定时器</span>
                  </div>
                  <div class="toolbox-item" draggable="true" @dragstart="onDragStart('message')">
                    <div class="node-icon message">
                      <i class="fas fa-envelope"></i>
                    </div>
                    <span class="node-label">消息</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 画布区域 -->
            <div class="canvas-area" 
                 @drop="onDrop" 
                 @dragover.prevent 
                 @click="onCanvasClick" 
                 @mousedown="onCanvasMouseDown" 
                 @wheel="onWheel" 
                 @contextmenu.prevent="onCanvasContextMenu">
              <div class="canvas-paper" 
                   :class="{ 'show-grid': store.showGrid }"
                   :style="`transform: translate(${store.panX}px, ${store.panY}px) scale(${store.zoom})`">
                
                <!-- 对齐辅助线 -->
                <svg v-if="alignmentGuides.length > 0" class="alignment-guides" width="100%" height="100%">
                  <line 
                    v-for="(guide, idx) in alignmentGuides" 
                    :key="idx"
                    :x1="guide.x1" 
                    :y1="guide.y1" 
                    :x2="guide.x2" 
                    :y2="guide.y2"
                    stroke="#3b82f6" 
                    stroke-width="1" 
                    stroke-dasharray="4,4"
                    style="pointer-events: none;" />
                </svg>
                
                <!-- 动态流程节点 -->
                <div 
                  v-for="node in store.nodes" 
                  :key="node.id" 
                  class="canvas-node" 
                  :class="[
                    `${node.type}-node`, 
                    { 'node-selected': store.selectedNodes.includes(node.id) }
                  ]" 
                  :style="{ left: node.x + 'px', top: node.y + 'px' }" 
                  @mousedown="onNodeMouseDown($event, node)" 
                  @contextmenu.prevent.stop="onNodeContextMenu($event, node)">
                  <div class="node-content">
                    <div class="node-icon">
                      <i :class="getNodeIcon(node.type)"></i>
                    </div>
                    <div class="node-label">{{ node.label }}</div>
                  </div>
                </div>

                <!-- 动态连接线 -->
                <svg class="connections" width="100%" height="100%" style="pointer-events: none; position: absolute; top: 0; left: 0;">
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7"
                            refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
                    </marker>
                    <marker id="arrowhead-selected" markerWidth="10" markerHeight="7"
                            refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
                    </marker>
                  </defs>
                  <g>
                    <!-- 透明的宽路径用于捕获点击和悬停 -->
                    <path 
                      v-for="conn in store.connections" 
                      :key="`${conn.id}-hitbox`" 
                      :d="getConnectionPath(conn)" 
                      stroke="transparent" 
                      stroke-width="20" 
                      fill="none" 
                      @click.stop="selectConnection(conn)" 
                      @contextmenu.prevent.stop="onConnectionContextMenu($event, conn)" 
                      @mouseenter="hoverConnection = conn" 
                      @mouseleave="hoverConnection = null" 
                      style="cursor: pointer; pointer-events: auto;" />
                    <!-- 实际显示的路径 -->
                    <path 
                      v-for="conn in store.connections" 
                      :key="conn.id" 
                      :d="getConnectionPath(conn)" 
                      :stroke="getConnectionColor(conn)" 
                      :stroke-width="getConnectionWidth(conn)" 
                      fill="none" 
                      :marker-end="getConnectionMarker(conn)" 
                      style="pointer-events: none;" 
                      :class="{ 'connection-hover': hoverConnection === conn }" />
                  </g>
                </svg>
              </div>
            </div>

            <!-- 属性面板 -->
            <div class="properties-panel">
              <h4 class="panel-title">属性</h4>
              <!-- 节点属性 -->
              <div class="properties-content" v-if="selectedNode">
                <div class="property-group">
                  <label class="property-label">节点名称</label>
                  <input type="text" class="form-input" v-model="selectedNode.label">
                </div>
                <div class="property-group">
                  <label class="property-label">类型</label>
                  <input type="text" class="form-input" :value="selectedNode.type" readonly>
                </div>
                <div class="property-group">
                  <label class="property-label">位置 (X, Y)</label>
                  <div class="flex gap-2">
                    <input type="number" class="form-input" v-model.number="selectedNode.x" readonly>
                    <input type="number" class="form-input" v-model.number="selectedNode.y" readonly>
                  </div>
                </div>
                <div class="property-group" v-if="selectedNode.type === 'task'">
                  <label class="property-label">执行者</label>
                  <select class="form-select" v-model="selectedNode.assignee">
                    <option value="">选择执行者</option>
                    <option>销售经理</option>
                    <option>财务总监</option>
                    <option>系统自动</option>
                  </select>
                </div>
                <div class="property-group" v-if="selectedNode.type === 'task'">
                  <label class="property-label">超时设置</label>
                  <input type="text" class="form-input" v-model="selectedNode.timeout" placeholder="24小时">
                </div>
                <div class="property-group">
                  <label class="property-label">描述</label>
                  <textarea class="form-textarea" rows="3" v-model="selectedNode.description" placeholder="节点描述..."></textarea>
                </div>
                <div class="property-group">
                  <button class="btn btn-danger w-full" @click="confirmDeleteNode">
                    <i class="fas fa-trash mr-2"></i>删除节点
                  </button>
                </div>
              </div>
              <!-- 连接线属性 -->
              <div class="properties-content" v-else-if="selectedConnection">
                <div class="property-group">
                  <label class="property-label">连接类型</label>
                  <input type="text" class="form-input" value="顺序流" readonly>
                </div>
                <div class="property-group">
                  <button class="btn btn-danger w-full" @click="confirmDeleteConnection">
                    <i class="fas fa-trash mr-2"></i>删除连接
                  </button>
                </div>
              </div>
              <!-- 流程配置面板 -->
              <div v-else class="properties-content">
                <div class="property-group">
                  <label class="property-label">
                    <i class="fas fa-info-circle text-blue-500 mr-1"></i>
                    流程配置
                  </label>
                  <p class="text-xs text-gray-500 mb-3">点击画布空白区域显示流程全局配置</p>
                </div>
                <div class="property-group">
                  <label class="property-label">流程名称</label>
                  <input type="text" class="form-input" v-model="store.processConfig.name">
                </div>
                <div class="property-group">
                  <label class="property-label">流程描述</label>
                  <textarea class="form-textarea" rows="3" v-model="store.processConfig.description" placeholder="描述此流程的用途和功能..."></textarea>
                </div>
                <div class="property-group">
                  <label class="property-label">绑定表单</label>
                  <select class="form-select" v-model="store.processConfig.boundFormId">
                    <option value="">选择业务表单</option>
                    <option value="form-001">订单申请表</option>
                    <option value="form-002">请假申请表</option>
                    <option value="form-003">采购申请表</option>
                    <option value="form-004">报销申请表</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1" v-if="store.processConfig.boundFormId">
                    已绑定表单
                  </p>
                </div>
                <div class="property-group">
                  <label class="property-label">流程分类</label>
                  <select class="form-select" v-model="store.processConfig.category">
                    <option value="">选择分类</option>
                    <option value="approval">审批流程</option>
                    <option value="business">业务流程</option>
                    <option value="hr">人力资源</option>
                    <option value="finance">财务管理</option>
                  </select>
                </div>
                <div class="property-group">
                  <label class="property-label">网格设置</label>
                  <div class="flex items-center gap-2">
                    <span class="text-xs text-gray-600">网格大小:</span>
                    <input 
                      type="number" 
                      class="form-input text-xs" 
                      v-model.number="store.gridSize" 
                      min="10" 
                      max="50" 
                      step="5">
                    <span class="text-xs text-gray-600">px</span>
                  </div>
                </div>
                <div class="property-group">
                  <p class="text-xs text-gray-500 italic">
                    <i class="fas fa-lightbulb text-yellow-500 mr-1"></i>
                    提示：选择节点或连接线可编辑其属性
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 text-sm text-gray-600 text-center">
          <i class="fas fa-info-circle mr-1"></i>
          拖拽左侧工具栏中的节点到画布中，拖拽画布中的节点移动位置，点击连接模式连接节点，选择节点或连接线编辑属性
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { useDesignerStore } from '@/stores/designer'
import { computed, ref, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'Designer',
  setup() {
    const store = useDesignerStore()
    
    // 本地UI状态
    const draggedNodeType = ref(null)
    const draggingNode = ref(null)
    const isDragging = ref(false)
    const dragOffset = ref({ x: 0, y: 0 })
    const dragStartX = ref(0)
    const dragStartY = ref(0)
    const dragThreshold = 5
    
    const isPanning = ref(false)
    const panStartX = ref(0)
    const panStartY = ref(0)
    
    const hoverConnection = ref(null)
    
    const contextMenu = ref({
      visible: false,
      x: 0,
      y: 0,
      type: null,
      target: null
    })
    
    const deleteConfirm = ref({
      visible: false,
      message: '',
      callback: null
    })
    
    // 对齐辅助线
    const alignmentGuides = ref([])
    const alignmentThreshold = 5
    
    // 计算属性
    const selectedNode = computed(() => {
      if (store.selectedNodes.length === 1) {
        return store.getNodeById(store.selectedNodes[0])
      }
      return null
    })
    
    const selectedConnection = computed(() => {
      if (store.selectedConnection) {
        return store.getConnectionById(store.selectedConnection)
      }
      return null
    })
    
    // 方法
    const onDragStart = (nodeType) => {
      draggedNodeType.value = nodeType
    }
    
    const onDrop = (event) => {
      if (draggedNodeType.value) {
        const canvasRect = event.currentTarget.querySelector('.canvas-paper').getBoundingClientRect()
        let x = (event.clientX - canvasRect.left) / store.zoom
        let y = (event.clientY - canvasRect.top) / store.zoom
        
        // 应用网格吸附
        x = store.snapToGridValue(x)
        y = store.snapToGridValue(y)
        
        const newNode = {
          id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: draggedNodeType.value,
          label: getDefaultLabel(draggedNodeType.value),
          x,
          y
        }
        
        store.addNode(newNode)
        draggedNodeType.value = null
      }
    }
    
    const getDefaultLabel = (type) => {
      const labels = {
        start: '开始',
        task: '任务',
        gateway: '决策',
        end: '结束',
        subprocess: '子流程',
        timer: '定时器',
        message: '消息'
      }
      return labels[type] || '节点'
    }
    
    const getNodeIcon = (type) => {
      const icons = {
        start: 'fas fa-play',
        task: 'fas fa-tasks',
        gateway: 'fas fa-question',
        end: 'fas fa-stop',
        subprocess: 'fas fa-sitemap',
        timer: 'fas fa-clock',
        message: 'fas fa-envelope'
      }
      return icons[type] || 'fas fa-circle'
    }
    
    const onNodeMouseDown = (event, node) => {
      draggingNode.value = node
      isDragging.value = false
      const canvasRect = event.currentTarget.closest('.canvas-area').querySelector('.canvas-paper').getBoundingClientRect()
      dragOffset.value.x = (event.clientX - canvasRect.left) / store.zoom - node.x
      dragOffset.value.y = (event.clientY - canvasRect.top) / store.zoom - node.y
      dragStartX.value = event.clientX
      dragStartY.value = event.clientY
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
      event.preventDefault()
    }
    
    const onMouseMove = (event) => {
      if (draggingNode.value) {
        const deltaX = Math.abs(event.clientX - dragStartX.value)
        const deltaY = Math.abs(event.clientY - dragStartY.value)
        
        if (deltaX > dragThreshold || deltaY > dragThreshold) {
          isDragging.value = true
        }
        
        if (isDragging.value) {
          const canvasArea = document.querySelector('.canvas-area')
          const canvasRect = canvasArea.querySelector('.canvas-paper').getBoundingClientRect()
          let newX = (event.clientX - canvasRect.left) / store.zoom - dragOffset.value.x
          let newY = (event.clientY - canvasRect.top) / store.zoom - dragOffset.value.y
          
          // 应用网格吸附
          if (store.snapToGrid) {
            newX = store.snapToGridValue(newX)
            newY = store.snapToGridValue(newY)
          }
          
          // 检测对齐
          alignmentGuides.value = []
          if (store.snapToGrid) {
            const guides = detectAlignment(draggingNode.value, newX, newY)
            if (guides.length > 0) {
              alignmentGuides.value = guides
              // 应用对齐
              if (guides[0].axis === 'x') {
                newX = guides[0].value
              } else {
                newY = guides[0].value
              }
            }
          }
          
          draggingNode.value.x = newX
          draggingNode.value.y = newY
        }
      }
    }
    
    const onMouseUp = (event) => {
      if (draggingNode.value) {
        if (!isDragging.value) {
          // 点击选择节点
          store.selectNode(draggingNode.value.id, event.ctrlKey || event.metaKey)
          
          // 如果在连接模式下
          if (store.isConnecting) {
            if (store.connectingFrom && store.connectingFrom !== draggingNode.value.id) {
              const newConnection = {
                id: `conn_${Date.now()}`,
                from: store.connectingFrom,
                to: draggingNode.value.id
              }
              store.addConnection(newConnection)
              store.isConnecting = false
              store.connectingFrom = null
            } else {
              store.connectingFrom = draggingNode.value.id
            }
          }
        } else {
          // 拖拽完成，记录历史
          // Store已经在内部处理了历史记录
        }
        
        alignmentGuides.value = []
        draggingNode.value = null
        isDragging.value = false
      }
      
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
    
    // 检测对齐
    const detectAlignment = (currentNode, newX, newY) => {
      const guides = []
      const nodeWidth = 48
      const nodeHeight = 48
      
      for (const node of store.nodes) {
        if (node.id === currentNode.id) continue
        
        // X轴对齐（左边、中心、右边）
        const alignLeft = Math.abs(newX - node.x)
        const alignCenterX = Math.abs((newX + nodeWidth/2) - (node.x + nodeWidth/2))
        const alignRight = Math.abs((newX + nodeWidth) - (node.x + nodeWidth))
        
        if (alignLeft < alignmentThreshold) {
          guides.push({
            axis: 'x',
            value: node.x,
            x1: node.x + nodeWidth/2,
            y1: Math.min(newY, node.y) - 100,
            x2: node.x + nodeWidth/2,
            y2: Math.max(newY + nodeHeight, node.y + nodeHeight) + 100
          })
        } else if (alignCenterX < alignmentThreshold) {
          guides.push({
            axis: 'x',
            value: node.x,
            x1: node.x + nodeWidth/2,
            y1: Math.min(newY, node.y) - 100,
            x2: node.x + nodeWidth/2,
            y2: Math.max(newY + nodeHeight, node.y + nodeHeight) + 100
          })
        } else if (alignRight < alignmentThreshold) {
          guides.push({
            axis: 'x',
            value: node.x,
            x1: node.x + nodeWidth/2,
            y1: Math.min(newY, node.y) - 100,
            x2: node.x + nodeWidth/2,
            y2: Math.max(newY + nodeHeight, node.y + nodeHeight) + 100
          })
        }
        
        // Y轴对齐（上边、中心、下边）
        const alignTop = Math.abs(newY - node.y)
        const alignCenterY = Math.abs((newY + nodeHeight/2) - (node.y + nodeHeight/2))
        const alignBottom = Math.abs((newY + nodeHeight) - (node.y + nodeHeight))
        
        if (alignTop < alignmentThreshold) {
          guides.push({
            axis: 'y',
            value: node.y,
            x1: Math.min(newX, node.x) - 100,
            y1: node.y + nodeHeight/2,
            x2: Math.max(newX + nodeWidth, node.x + nodeWidth) + 100,
            y2: node.y + nodeHeight/2
          })
        } else if (alignCenterY < alignmentThreshold) {
          guides.push({
            axis: 'y',
            value: node.y,
            x1: Math.min(newX, node.x) - 100,
            y1: node.y + nodeHeight/2,
            x2: Math.max(newX + nodeWidth, node.x + nodeWidth) + 100,
            y2: node.y + nodeHeight/2
          })
        } else if (alignBottom < alignmentThreshold) {
          guides.push({
            axis: 'y',
            value: node.y,
            x1: Math.min(newX, node.x) - 100,
            y1: node.y + nodeHeight/2,
            x2: Math.max(newX + nodeWidth, node.x + nodeWidth) + 100,
            y2: node.y + nodeHeight/2
          })
        }
      }
      
      return guides
    }
    
    const getConnectionPath = (conn) => {
      const fromNode = store.getNodeById(conn.from)
      const toNode = store.getNodeById(conn.to)
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
    
    const selectConnection = (conn) => {
      store.selectConnection(conn.id)
    }
    
    const getConnectionColor = (conn) => {
      if (conn.id === store.selectedConnection) return '#ef4444'
      if (conn === hoverConnection.value) return '#60a5fa'
      return '#94a3b8'
    }
    
    const getConnectionWidth = (conn) => {
      if (conn.id === store.selectedConnection) return '3'
      if (conn === hoverConnection.value) return '2.5'
      return '2'
    }
    
    const getConnectionMarker = (conn) => {
      return conn.id === store.selectedConnection ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'
    }
    
    // 画布操作
    const onCanvasClick = (event) => {
      if (event.target.classList.contains('canvas-area') || event.target.classList.contains('canvas-paper')) {
        store.clearSelection()
      }
    }
    
    const onCanvasMouseDown = (event) => {
      if (event.target === event.currentTarget || event.target.classList.contains('canvas-paper')) {
        isPanning.value = false
        panStartX.value = event.clientX - store.panX
        panStartY.value = event.clientY - store.panY
        document.addEventListener('mousemove', onCanvasMouseMove)
        document.addEventListener('mouseup', onCanvasMouseUp)
        event.preventDefault()
      }
    }
    
    const onCanvasMouseMove = (event) => {
      if (panStartX.value !== undefined) {
        const deltaX = event.clientX - panStartX.value
        const deltaY = event.clientY - panStartY.value
        if (Math.abs(deltaX - store.panX) > dragThreshold || Math.abs(deltaY - store.panY) > dragThreshold) {
          isPanning.value = true
        }
        if (isPanning.value) {
          store.setPan(deltaX, deltaY)
        }
      }
    }
    
    const onCanvasMouseUp = () => {
      isPanning.value = false
      panStartX.value = undefined
      panStartY.value = undefined
      document.removeEventListener('mousemove', onCanvasMouseMove)
      document.removeEventListener('mouseup', onCanvasMouseUp)
    }
    
    const onWheel = (event) => {
      event.preventDefault()
      const delta = event.deltaY > 0 ? 0.9 : 1.1
      const newZoom = Math.max(0.1, Math.min(3, store.zoom * delta))
      if (newZoom !== store.zoom) {
        const rect = event.currentTarget.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top
        const scaleChange = newZoom / store.zoom
        const newPanX = mouseX - (mouseX - store.panX) * scaleChange
        const newPanY = mouseY - (mouseY - store.panY) * scaleChange
        store.setZoom(newZoom)
        store.setPan(newPanX, newPanY)
      }
    }
    
    const zoomIn = () => {
      store.setZoom(store.zoom * 1.2)
    }
    
    const zoomOut = () => {
      store.setZoom(store.zoom / 1.2)
    }
    
    const resetView = () => {
      store.setPan(0, 0)
      store.setZoom(1)
      closeContextMenu()
    }
    
    // 右键菜单
    const onNodeContextMenu = (event, node) => {
      if (!store.selectedNodes.includes(node.id)) {
        store.selectNode(node.id)
      }
      showContextMenu(event, 'node', node)
    }
    
    const onConnectionContextMenu = (event, conn) => {
      store.selectConnection(conn.id)
      showContextMenu(event, 'connection', conn)
    }
    
    const onCanvasContextMenu = (event) => {
      if (event.target.classList.contains('canvas-area') || event.target.classList.contains('canvas-paper')) {
        store.clearSelection()
        showContextMenu(event, 'canvas', null)
      }
    }
    
    const showContextMenu = (event, type, target) => {
      contextMenu.value = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        type,
        target
      }
    }
    
    const closeContextMenu = () => {
      contextMenu.value.visible = false
    }
    
    const copySelectedNodes = () => {
      store.copySelectedNodes()
      closeContextMenu()
    }
    
    const pasteNodes = () => {
      store.pasteNodes()
      closeContextMenu()
    }
    
    const editNodeProperties = () => {
      closeContextMenu()
    }
    
    const selectAllNodes = () => {
      store.nodes.forEach(node => {
        if (!store.selectedNodes.includes(node.id)) {
          store.selectNode(node.id, true)
        }
      })
      closeContextMenu()
    }
    
    const editConnectionLabel = () => {
      closeContextMenu()
      console.log('编辑连接线标签功能待实现')
    }
    
    // 删除确认
    const confirmDeleteNode = () => {
      closeContextMenu()
      const nodeName = selectedNode.value ? selectedNode.value.label : '选中的节点'
      deleteConfirm.value = {
        visible: true,
        message: `确定要删除节点"${nodeName}"吗？`,
        callback: () => {
          if (selectedNode.value) {
            store.deleteNode(selectedNode.value.id)
          }
        }
      }
    }
    
    const confirmDeleteConnection = () => {
      closeContextMenu()
      deleteConfirm.value = {
        visible: true,
        message: '确定要删除此连接吗？',
        callback: () => {
          if (store.selectedConnection) {
            store.deleteConnection(store.selectedConnection)
          }
        }
      }
    }
    
    const executeDelete = () => {
      if (deleteConfirm.value.callback) {
        deleteConfirm.value.callback()
      }
      cancelDelete()
    }
    
    const cancelDelete = () => {
      deleteConfirm.value = {
        visible: false,
        message: '',
        callback: null
      }
    }
    
    // 撤销/重做
    const undo = () => {
      store.undo()
    }
    
    const redo = () => {
      store.redo()
    }
    
    // 连接模式
    const toggleConnectionMode = () => {
      store.isConnecting = !store.isConnecting
      if (!store.isConnecting) {
        store.connectingFrom = null
      }
    }
    
    // 网格设置
    const toggleSnapToGrid = () => {
      store.toggleSnapToGrid()
    }
    
    const toggleShowGrid = () => {
      store.toggleShowGrid()
    }
    
    // 键盘事件
    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault()
            undo()
            break
          case 'y':
            event.preventDefault()
            redo()
            break
          case 'c':
            event.preventDefault()
            if (store.selectedNodes.length > 0) {
              copySelectedNodes()
            }
            break
          case 'v':
            event.preventDefault()
            pasteNodes()
            break
          case 'a':
            event.preventDefault()
            selectAllNodes()
            break
        }
      } else {
        switch (event.key) {
          case 'Delete':
          case 'Backspace':
            if (selectedNode.value) {
              confirmDeleteNode()
            } else if (selectedConnection.value) {
              confirmDeleteConnection()
            }
            break
        }
      }
    }
    
    // 生命周期
    onMounted(() => {
      document.addEventListener('keydown', onKeyDown)
      document.addEventListener('click', closeContextMenu)
      
      // 初始化一些示例节点
      if (store.nodes.length === 0) {
        store.nodes.push(
          { id: 'node_1', type: 'start', label: '开始', x: 100, y: 100 },
          { id: 'node_2', type: 'task', label: '审核订单', x: 300, y: 100 },
          { id: 'node_3', type: 'gateway', label: '审批决策', x: 500, y: 100 },
          { id: 'node_4', type: 'end', label: '结束', x: 700, y: 100 }
        )
        store.connections.push(
          { id: 'conn_1', from: 'node_1', to: 'node_2' },
          { id: 'conn_2', from: 'node_2', to: 'node_3' },
          { id: 'conn_3', from: 'node_3', to: 'node_4' }
        )
      }
    })
    
    onBeforeUnmount(() => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('click', closeContextMenu)
    })
    
    return {
      store,
      draggedNodeType,
      contextMenu,
      deleteConfirm,
      hoverConnection,
      alignmentGuides,
      selectedNode,
      selectedConnection,
      onDragStart,
      onDrop,
      getNodeIcon,
      onNodeMouseDown,
      getConnectionPath,
      selectConnection,
      getConnectionColor,
      getConnectionWidth,
      getConnectionMarker,
      onCanvasClick,
      onCanvasMouseDown,
      onWheel,
      zoomIn,
      zoomOut,
      resetView,
      onNodeContextMenu,
      onConnectionContextMenu,
      onCanvasContextMenu,
      closeContextMenu,
      copySelectedNodes,
      pasteNodes,
      editNodeProperties,
      selectAllNodes,
      editConnectionLabel,
      confirmDeleteNode,
      confirmDeleteConnection,
      executeDelete,
      cancelDelete,
      undo,
      redo,
      toggleConnectionMode,
      toggleSnapToGrid,
      toggleShowGrid
    }
  }
}
</script>

<style scoped>
/* ... 所有原有样式 ... */
.designer-canvas {
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background: #fafbfc;
  min-height: 600px;
}

.canvas-header {
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  border-radius: 10px 10px 0 0;
}

.canvas-content {
  display: flex;
  height: 500px;
}

.toolbox {
  width: 200px;
  background: white;
  border-right: 1px solid #e5e7eb;
  padding: 16px;
  overflow-y: auto;
}

.toolbox-section {
  margin-bottom: 24px;
}

.toolbox-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
}

.toolbox-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toolbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s;
}

.toolbox-item:hover {
  background: #f3f4f6;
}

.toolbox-item .node-icon {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: white;
}

.toolbox-item .node-label {
  font-size: 12px;
  color: #6b7280;
}

.node-icon.start {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.node-icon.task {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.node-icon.gateway {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  transform: rotate(45deg);
}

.node-icon.end {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.node-icon.subprocess {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.node-icon.timer {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
}

.node-icon.message {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

.canvas-area {
  flex: 1;
  position: relative;
  background: #f8fafc;
}

.canvas-paper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transform-origin: top left;
}

.canvas-paper.show-grid {
  background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
  background-size: 20px 20px;
}

.canvas-node {
  position: absolute;
  cursor: move;
}

.canvas-node .node-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.canvas-node .node-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s;
}

.canvas-node:hover .node-icon {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.canvas-node .node-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  text-align: center;
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.start-node .node-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
}

.task-node .node-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.gateway-node .node-icon {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  transform: rotate(45deg);
}

.end-node .node-icon {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
}

.connections {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
}

.properties-panel {
  width: 250px;
  background: white;
  border-left: 1px solid #e5e7eb;
  padding: 16px;
  overflow-y: auto;
}

.panel-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.property-group {
  margin-bottom: 16px;
}

.property-label {
  display: block;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 4px;
}

.properties-content .form-input,
.properties-content .form-textarea,
.properties-content .form-select {
  font-size: 13px;
  padding: 8px;
}

/* 右键菜单样式 */
.context-menu {
  position: fixed;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.1);
  padding: 4px 0;
  min-width: 160px;
  z-index: 1000;
  animation: menuFadeIn 0.15s ease-out;
}

@keyframes menuFadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.context-menu-item {
  padding: 8px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #374151;
  transition: background-color 0.15s;
}

.context-menu-item:hover {
  background-color: #f3f4f6;
}

.context-menu-item.danger {
  color: #ef4444;
}

.context-menu-item.danger:hover {
  background-color: #fef2f2;
}

.context-menu-item.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.context-menu-item.disabled:hover {
  background-color: transparent;
}

.context-menu-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 4px 0;
}

/* 模态对话框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  animation: overlayFadeIn 0.2s ease-out;
}

@keyframes overlayFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.modal-dialog {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  min-width: 400px;
  max-width: 500px;
  animation: dialogSlideIn 0.2s ease-out;
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  padding: 20px 24px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  display: flex;
  align-items: center;
}

.modal-body {
  padding: 20px 24px;
}

.modal-body p {
  margin: 0;
  font-size: 15px;
  color: #374151;
  line-height: 1.5;
}

.modal-footer {
  padding: 16px 24px 20px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 节点选中状态 */
.canvas-node.node-selected .node-icon {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
  transform: translateY(-2px);
}

/* 连接线悬停动画 */
.connection-hover {
  transition: all 0.2s ease;
}

/* 对齐辅助线 */
.alignment-guides {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 100;
}

/* 按钮禁用状态 */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>

