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
        {{ connectionMode ? '退出连接模式' : '连接模式' }}
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
            <div class="context-menu-item" @click="copyNode">
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
            <div class="context-menu-item" @click="pasteNode" :class="{ disabled: !clipboardNode }">
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
              <p class="text-sm text-gray-500 mt-2">此操作不可撤销</p>
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
          <button class="btn btn-sm btn-secondary" @click="undo">
          <i class="fas fa-undo"></i>
          </button>
          <button class="btn btn-sm btn-secondary" @click="redo">
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
                v-model="processName"
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
            <div class="canvas-area" @drop="onDrop" @dragover.prevent @click="onCanvasClick" @mousedown="onCanvasMouseDown" @wheel="onWheel" @contextmenu.prevent="onCanvasContextMenu">
            <div class="canvas-paper" :style="`transform: translate(\${panX}px, \${panY}px) scale(\${scale})`">
            <!-- 动态流程节点 -->
            <div v-for="node in nodes" :key="node.id" class="canvas-node" :class="[`${node.type}-node`, { 'node-selected': selectedNode === node }]" :style="{ left: node.x + 'px', top: node.y + 'px' }" @mousedown="onNodeMouseDown($event, node)" @contextmenu.prevent.stop="onNodeContextMenu($event, node)">
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
                  <path v-for="conn in connections" :key="`${conn.from}-${conn.to}-hitbox`" :d="getConnectionPath(conn)" stroke="transparent" stroke-width="20" fill="none" @click.stop="selectConnection(conn)" @contextmenu.prevent.stop="onConnectionContextMenu($event, conn)" @mouseenter="hoverConnection = conn" @mouseleave="hoverConnection = null" style="cursor: pointer; pointer-events: auto;" />
                  <!-- 实际显示的路径 -->
                  <path v-for="conn in connections" :key="`${conn.from}-${conn.to}`" :d="getConnectionPath(conn)" :stroke="getConnectionColor(conn)" :stroke-width="getConnectionWidth(conn)" fill="none" :marker-end="getConnectionMarker(conn)" style="pointer-events: none;" :class="{ 'connection-hover': hoverConnection === conn }" />
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
              <button class="btn btn-danger w-full" @click="deleteNode">
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
                   <button class="btn btn-danger w-full" @click="deleteConnection">
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
                  <input type="text" class="form-input" v-model="processName">
                </div>
                <div class="property-group">
                  <label class="property-label">流程描述</label>
                  <textarea class="form-textarea" rows="3" v-model="processDescription" placeholder="描述此流程的用途和功能..."></textarea>
                </div>
                <div class="property-group">
                  <label class="property-label">绑定表单</label>
                  <select class="form-select" v-model="boundFormId">
                    <option value="">选择业务表单</option>
                    <option value="form-001">订单申请表</option>
                    <option value="form-002">请假申请表</option>
                    <option value="form-003">采购申请表</option>
                    <option value="form-004">报销申请表</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1" v-if="boundFormId">
                    已绑定表单
                  </p>
                </div>
                <div class="property-group">
                  <label class="property-label">流程分类</label>
                  <select class="form-select" v-model="processCategory">
                    <option value="">选择分类</option>
                    <option value="approval">审批流程</option>
                    <option value="business">业务流程</option>
                    <option value="hr">人力资源</option>
                    <option value="finance">财务管理</option>
                  </select>
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
export default {
  name: 'Designer',
  data() {
    return {
      processName: '新流程',
      processDescription: '',
      boundFormId: '',
      processCategory: '',
      draggedNodeType: null,
      nodes: [
        { id: 1, type: 'start', label: '开始', x: 100, y: 100 },
        { id: 2, type: 'task', label: '审核订单', x: 300, y: 100 },
        { id: 3, type: 'gateway', label: '审批决策', x: 500, y: 100 },
        { id: 4, type: 'end', label: '结束', x: 700, y: 100 }
      ],
      connections: [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 }
      ],
      selectedNode: null,
      connectionMode: false,
      connectingFrom: null,
      draggingNode: null,
      dragOffset: { x: 0, y: 0 },
      selectedConnection: null,
      isDragging: false,
      dragThreshold: 5,
      panX: 0,
      panY: 0,
      scale: 1,
      isPanning: false,
      panStartX: 0,
      panStartY: 0,
      contextMenu: {
        visible: false,
        x: 0,
        y: 0,
        type: null,
        target: null
      },
      deleteConfirm: {
        visible: false,
        message: '',
        callback: null
      },
      clipboardNode: null,
      hoverConnection: null,
      history: [],
      historyIndex: -1,
      currentAction: null
    }
  },
  mounted() {
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('click', this.closeContextMenu)
  },
  beforeUnmount() {
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('click', this.closeContextMenu)
  },
  methods: {
    onDragStart(nodeType) {
      this.draggedNodeType = nodeType
    },
    onDrop(event) {
      if (this.draggedNodeType) {
        const canvasRect = this.$el.querySelector('.canvas-paper').getBoundingClientRect()
        const x = (event.clientX - canvasRect.left) / this.scale
        const y = (event.clientY - canvasRect.top) / this.scale

        const newNode = {
          id: Date.now(),
          type: this.draggedNodeType,
          label: this.getDefaultLabel(this.draggedNodeType),
          x,
          y
        }
        this.nodes.push(newNode)
        
        // 记录历史
        this.pushHistory({
          type: 'ADD_NODE',
          data: { node: { ...newNode } }
        })

        this.draggedNodeType = null
      }
    },
    getDefaultLabel(type) {
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
    },
    getNodeIcon(type) {
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
    },

    selectNode(node) {
      if (this.connectionMode) {
        if (this.connectingFrom) {
          const newConnection = { from: this.connectingFrom, to: node.id }
          this.connections.push(newConnection)
          
          // 记录历史
          this.pushHistory({
            type: 'ADD_CONNECTION',
            data: { connection: { ...newConnection } }
          })
          
          this.connectingFrom = null
          this.connectionMode = false
        } else {
          this.connectingFrom = node.id
        }
      } else {
        this.selectedNode = node
      }
    },
    getConnectionPath(conn) {
      const fromNode = this.nodes.find(n => n.id === conn.from)
      const toNode = this.nodes.find(n => n.id === conn.to)
      if (!fromNode || !toNode) return ''
      const x1 = fromNode.x + 24
      const y1 = fromNode.y + 24
      const x2 = toNode.x + 24
      const y2 = toNode.y + 24
      
      // 使用二次贝塞尔曲线创建更美观的连接线
      const dx = x2 - x1
      const dy = y2 - y1
      const cpX = x1 + dx / 2
      const cpY = y1 + dy / 2 - Math.abs(dx) * 0.15
      
      return `M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`
    },
    toggleConnectionMode() {
      this.connectionMode = !this.connectionMode
      this.connectingFrom = null
    },
    onNodeMouseDown(event, node) {
      this.draggingNode = node
      this.isDragging = false
      const canvasRect = this.$el.querySelector('.canvas-paper').getBoundingClientRect()
      this.dragOffset.x = (event.clientX - canvasRect.left) / this.scale
      this.dragOffset.y = (event.clientY - canvasRect.top) / this.scale
      this.dragStartX = event.clientX
      this.dragStartY = event.clientY
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
      event.preventDefault()
    },
    onMouseMove(event) {
      if (this.draggingNode) {
        const deltaX = Math.abs(event.clientX - this.dragStartX)
        const deltaY = Math.abs(event.clientY - this.dragStartY)
        if (deltaX > this.dragThreshold || deltaY > this.dragThreshold) {
          this.isDragging = true
          // 记录拖拽开始时的位置
          if (!this.currentAction) {
            this.currentAction = {
              type: 'MOVE_NODE',
              data: {
                nodeId: this.draggingNode.id,
                oldX: this.draggingNode.x,
                oldY: this.draggingNode.y
              }
            }
          }
        }
        if (this.isDragging) {
          const canvasRect = this.$el.querySelector('.canvas-paper').getBoundingClientRect()
          this.draggingNode.x = (event.clientX - canvasRect.left) / this.scale - this.dragOffset.x
          this.draggingNode.y = (event.clientY - canvasRect.top) / this.scale - this.dragOffset.y
        }
      }
    },
    onMouseUp(event) {
      if (this.draggingNode && !this.isDragging) {
        this.selectNode(this.draggingNode)
      }
      
      // 如果发生了拖拽，记录历史
      if (this.isDragging && this.currentAction) {
        this.currentAction.data.newX = this.draggingNode.x
        this.currentAction.data.newY = this.draggingNode.y
        this.pushHistory(this.currentAction)
        this.currentAction = null
      }
      
      this.draggingNode = null
      this.isDragging = false
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
    },
    selectConnection(conn) {
      this.selectedConnection = conn
      this.selectedNode = null
    },
    deleteConnection() {
      if (!this.selectedConnection) return
      const index = this.connections.findIndex(c => c.from === this.selectedConnection.from && c.to === this.selectedConnection.to)
      if (index > -1) {
        // 记录历史
        this.pushHistory({
          type: 'DELETE_CONNECTION',
          data: { connection: { ...this.selectedConnection } }
        })
        
        this.connections.splice(index, 1)
      }
      this.selectedConnection = null
    },
    onCanvasMouseDown(event) {
      // Only pan if clicking on canvas background, not on nodes
      if (event.target === event.currentTarget || event.target.classList.contains('canvas-paper')) {
        this.isPanning = false
        this.panStartX = event.clientX - this.panX
        this.panStartY = event.clientY - this.panY
        document.addEventListener('mousemove', this.onCanvasMouseMove)
        document.addEventListener('mouseup', this.onCanvasMouseUp)
        event.preventDefault()
      }
    },
    onCanvasMouseMove(event) {
      if (this.panStartX !== undefined) {
        const deltaX = event.clientX - this.panStartX
        const deltaY = event.clientY - this.panStartY
        if (Math.abs(deltaX - this.panX) > this.dragThreshold || Math.abs(deltaY - this.panY) > this.dragThreshold) {
          this.isPanning = true
        }
        if (this.isPanning) {
          this.panX = deltaX
          this.panY = deltaY
        }
      }
    },
    onCanvasMouseUp() {
      this.isPanning = false
      this.panStartX = undefined
      this.panStartY = undefined
      document.removeEventListener('mousemove', this.onCanvasMouseMove)
      document.removeEventListener('mouseup', this.onCanvasMouseUp)
    },
    zoomIn() {
      this.scale = Math.min(this.scale * 1.2, 3)
    },
    zoomOut() {
      this.scale = Math.max(this.scale / 1.2, 0.1)
    },
    resetView() {
      this.panX = 0
      this.panY = 0
      this.scale = 1
    },
    // 撤销/重做系统
    pushHistory(action) {
      // 移除当前索引之后的历史记录
      this.history = this.history.slice(0, this.historyIndex + 1)
      // 添加新动作
      this.history.push(action)
      this.historyIndex++
      // 限制历史记录数量（最多50条）
      if (this.history.length > 50) {
        this.history.shift()
        this.historyIndex--
      }
    },
    undo() {
      if (this.historyIndex >= 0) {
        const action = this.history[this.historyIndex]
        this.executeUndo(action)
        this.historyIndex--
      }
    },
    redo() {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++
        const action = this.history[this.historyIndex]
        this.executeRedo(action)
      }
    },
    executeUndo(action) {
      switch (action.type) {
        case 'ADD_NODE':
          this.nodes = this.nodes.filter(n => n.id !== action.data.node.id)
          break
        case 'DELETE_NODE':
          this.nodes.push(action.data.node)
          // 恢复相关连接
          if (action.data.connections) {
            this.connections.push(...action.data.connections)
          }
          break
        case 'MOVE_NODE':
          const node = this.nodes.find(n => n.id === action.data.nodeId)
          if (node) {
            node.x = action.data.oldX
            node.y = action.data.oldY
          }
          break
        case 'UPDATE_NODE':
          const updateNode = this.nodes.find(n => n.id === action.data.nodeId)
          if (updateNode) {
            Object.assign(updateNode, action.data.oldData)
          }
          break
        case 'ADD_CONNECTION':
          this.connections = this.connections.filter(c => 
            !(c.from === action.data.connection.from && c.to === action.data.connection.to)
          )
          break
        case 'DELETE_CONNECTION':
          this.connections.push(action.data.connection)
          break
      }
    },
    executeRedo(action) {
      switch (action.type) {
        case 'ADD_NODE':
          this.nodes.push(action.data.node)
          break
        case 'DELETE_NODE':
          this.nodes = this.nodes.filter(n => n.id !== action.data.node.id)
          if (action.data.connections) {
            this.connections = this.connections.filter(c => 
              !action.data.connections.some(ac => ac.from === c.from && ac.to === c.to)
            )
          }
          break
        case 'MOVE_NODE':
          const node = this.nodes.find(n => n.id === action.data.nodeId)
          if (node) {
            node.x = action.data.newX
            node.y = action.data.newY
          }
          break
        case 'UPDATE_NODE':
          const updateNode = this.nodes.find(n => n.id === action.data.nodeId)
          if (updateNode) {
            Object.assign(updateNode, action.data.newData)
          }
          break
        case 'ADD_CONNECTION':
          this.connections.push(action.data.connection)
          break
        case 'DELETE_CONNECTION':
          this.connections = this.connections.filter(c => 
            !(c.from === action.data.connection.from && c.to === action.data.connection.to)
          )
          break
      }
    },
    onKeyDown(event) {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
          case 'z':
            event.preventDefault()
            this.undo()
            break
          case 'y':
            event.preventDefault()
            this.redo()
            break
          case 'c':
            event.preventDefault()
            if (this.selectedNode) {
              this.copyNode()
            }
            break
          case 'v':
            event.preventDefault()
            this.pasteNode()
            break
          case 'a':
            event.preventDefault()
            this.selectAllNodes()
            break
        }
      } else {
        switch (event.key) {
          case 'Delete':
          case 'Backspace':
            if (this.selectedNode) {
              this.confirmDeleteNode()
            } else if (this.selectedConnection) {
              this.confirmDeleteConnection()
            }
            break
        }
      }
    },
    deleteNode() {
      const index = this.nodes.findIndex(n => n.id === this.selectedNode.id)
      if (index > -1) {
        // 保存节点和相关连接以便撤销
        const deletedNode = { ...this.selectedNode }
        const relatedConnections = this.connections.filter(
          c => c.from === this.selectedNode.id || c.to === this.selectedNode.id
        )
        
        // 记录历史
        this.pushHistory({
          type: 'DELETE_NODE',
          data: {
            node: deletedNode,
            connections: relatedConnections.map(c => ({ ...c }))
          }
        })
        
        // Remove connections to this node
        this.connections = this.connections.filter(c => c.from !== this.selectedNode.id && c.to !== this.selectedNode.id)
        this.nodes.splice(index, 1)
        this.selectedNode = null
      }
    },
    onWheel(event) {
      event.preventDefault()
      const delta = event.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.max(0.1, Math.min(3, this.scale * delta))
      if (newScale !== this.scale) {
        // Zoom towards mouse position
        const rect = event.currentTarget.getBoundingClientRect()
        const mouseX = event.clientX - rect.left
        const mouseY = event.clientY - rect.top
        const scaleChange = newScale / this.scale
        this.panX = mouseX - (mouseX - this.panX) * scaleChange
        this.panY = mouseY - (mouseY - this.panY) * scaleChange
        this.scale = newScale
      }
    },

    // 右键菜单相关方法
    onNodeContextMenu(event, node) {
      this.selectedNode = node
      this.selectedConnection = null
      this.showContextMenu(event, 'node', node)
    },
    onConnectionContextMenu(event, conn) {
      this.selectedConnection = conn
      this.selectedNode = null
      this.showContextMenu(event, 'connection', conn)
    },
    onCanvasContextMenu(event) {
      if (event.target.classList.contains('canvas-area') || event.target.classList.contains('canvas-paper')) {
        this.selectedNode = null
        this.selectedConnection = null
        this.showContextMenu(event, 'canvas', null)
      }
    },
    showContextMenu(event, type, target) {
      this.contextMenu = {
        visible: true,
        x: event.clientX,
        y: event.clientY,
        type,
        target
      }
    },
    closeContextMenu() {
      this.contextMenu.visible = false
    },

    // 节点右键菜单操作
    copyNode() {
      if (this.selectedNode) {
        this.clipboardNode = { ...this.selectedNode }
        this.closeContextMenu()
        console.log('节点已复制到剪贴板')
      }
    },
    pasteNode() {
      if (this.clipboardNode) {
        const newNode = {
          ...this.clipboardNode,
          id: Date.now(),
          x: this.clipboardNode.x + 50,
          y: this.clipboardNode.y + 50
        }
        this.nodes.push(newNode)
        
        // 记录历史
        this.pushHistory({
          type: 'ADD_NODE',
          data: { node: { ...newNode } }
        })
        
        this.selectedNode = newNode
        this.closeContextMenu()
        
        // 更新剪贴板位置，以便连续粘贴时有偏移
        this.clipboardNode.x = newNode.x
        this.clipboardNode.y = newNode.y
      }
    },
    editNodeProperties() {
      // 节点已选中，属性面板会自动显示
      this.closeContextMenu()
    },
    selectAllNodes() {
      // 简化版：选中第一个节点
      if (this.nodes.length > 0) {
        this.selectedNode = this.nodes[0]
      }
      this.closeContextMenu()
    },

    // 删除确认对话框
    confirmDeleteNode() {
      this.closeContextMenu()
      this.deleteConfirm = {
        visible: true,
        message: `确定要删除节点"${this.selectedNode.label}"吗？`,
        callback: () => {
          this.deleteNode()
        }
      }
    },
    confirmDeleteConnection() {
      this.closeContextMenu()
      this.deleteConfirm = {
        visible: true,
        message: '确定要删除此连接吗？',
        callback: () => {
          this.deleteConnection()
        }
      }
    },
    executeDelete() {
      if (this.deleteConfirm.callback) {
        this.deleteConfirm.callback()
      }
      this.cancelDelete()
    },
    cancelDelete() {
      this.deleteConfirm = {
        visible: false,
        message: '',
        callback: null
      }
    },

    // 连接线右键菜单操作
    editConnectionLabel() {
      this.closeContextMenu()
      // TODO: 实现连接线标签编辑
      console.log('编辑连接线标签功能待实现')
    },

    // 画布点击事件
    onCanvasClick(event) {
      if (event.target.classList.contains('canvas-area') || event.target.classList.contains('canvas-paper')) {
        this.selectedNode = null
        this.selectedConnection = null
      }
    },

    // 连接线样式方法
    getConnectionColor(conn) {
      if (conn === this.selectedConnection) return '#ef4444'
      if (conn === this.hoverConnection) return '#60a5fa'
      return '#94a3b8'
    },
    getConnectionWidth(conn) {
      if (conn === this.selectedConnection) return '3'
      if (conn === this.hoverConnection) return '2.5'
      return '2'
    },
    getConnectionMarker(conn) {
      return conn === this.selectedConnection ? 'url(#arrowhead-selected)' : 'url(#arrowhead)'
    }
  }
}
</script>

<style scoped>
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
  background-image:
    radial-gradient(circle, #e5e7eb 1px, transparent 1px);
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
</style>
