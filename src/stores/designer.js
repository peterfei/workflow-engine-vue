import { defineStore } from 'pinia'

export const useDesignerStore = defineStore('designer', {
  state: () => ({
    // 画布状态
    nodes: [],
    connections: [],
    
    // 选择状态
    selectedNodes: [],
    selectedConnection: null,
    
    // 编辑状态
    isConnecting: false,
    connectingFrom: null,
    
    // 历史记录（撤销/重做）
    history: [],
    historyIndex: -1,
    maxHistorySize: 50,
    
    // 剪贴板
    clipboard: null,
    
    // 流程配置
    processConfig: {
      name: '未命名流程',
      description: '',
      boundFormId: null,
      category: '默认分类'
    },
    
    // 网格和对齐
    gridSize: 20,
    snapToGrid: true,
    showGrid: true,
    
    // 视图状态
    zoom: 1,
    panX: 0,
    panY: 0
  }),
  
  getters: {
    // 获取所有选中的项
    hasSelection: (state) => state.selectedNodes.length > 0 || state.selectedConnection !== null,
    
    // 是否可以撤销/重做
    canUndo: (state) => state.historyIndex >= 0,
    canRedo: (state) => state.historyIndex < state.history.length - 1,
    
    // 获取节点通过ID
    getNodeById: (state) => (id) => state.nodes.find(n => n.id === id),
    
    // 获取连接通过ID
    getConnectionById: (state) => (id) => state.connections.find(c => c.id === id),
    
    // 获取节点的所有连接
    getNodeConnections: (state) => (nodeId) => {
      return state.connections.filter(c => c.from === nodeId || c.to === nodeId)
    }
  },
  
  actions: {
    // 添加节点
    addNode(node) {
      this.nodes.push(node)
      this.pushHistory({
        type: 'ADD_NODE',
        node: { ...node }
      })
    },
    
    // 删除节点
    deleteNode(nodeId) {
      const nodeIndex = this.nodes.findIndex(n => n.id === nodeId)
      if (nodeIndex === -1) return
      
      const node = this.nodes[nodeIndex]
      const relatedConnections = this.getNodeConnections(nodeId)
      
      this.nodes.splice(nodeIndex, 1)
      relatedConnections.forEach(conn => {
        const connIndex = this.connections.findIndex(c => c.id === conn.id)
        if (connIndex !== -1) {
          this.connections.splice(connIndex, 1)
        }
      })
      
      this.selectedNodes = this.selectedNodes.filter(id => id !== nodeId)
      
      this.pushHistory({
        type: 'DELETE_NODE',
        node: { ...node },
        connections: relatedConnections.map(c => ({ ...c }))
      })
    },
    
    // 移动节点
    moveNode(nodeId, newX, newY, oldX, oldY) {
      const node = this.getNodeById(nodeId)
      if (!node) return
      
      node.x = newX
      node.y = newY
      
      this.pushHistory({
        type: 'MOVE_NODE',
        nodeId,
        oldX,
        oldY,
        newX,
        newY
      })
    },
    
    // 添加连接
    addConnection(connection) {
      this.connections.push(connection)
      this.pushHistory({
        type: 'ADD_CONNECTION',
        connection: { ...connection }
      })
    },
    
    // 删除连接
    deleteConnection(connectionId) {
      const connIndex = this.connections.findIndex(c => c.id === connectionId)
      if (connIndex === -1) return
      
      const connection = this.connections[connIndex]
      this.connections.splice(connIndex, 1)
      
      if (this.selectedConnection === connectionId) {
        this.selectedConnection = null
      }
      
      this.pushHistory({
        type: 'DELETE_CONNECTION',
        connection: { ...connection }
      })
    },
    
    // 更新连接属性
    updateConnection(connectionId, updates) {
      const connection = this.getConnectionById(connectionId)
      if (!connection) return
      
      const oldData = { ...connection }
      Object.assign(connection, updates)
      
      this.pushHistory({
        type: 'UPDATE_CONNECTION',
        connectionId,
        oldData,
        newData: { ...updates }
      })
    },
    
    // 选择节点
    selectNode(nodeId, multi = false) {
      if (multi) {
        const index = this.selectedNodes.indexOf(nodeId)
        if (index === -1) {
          this.selectedNodes.push(nodeId)
        } else {
          this.selectedNodes.splice(index, 1)
        }
      } else {
        this.selectedNodes = [nodeId]
      }
      this.selectedConnection = null
    },
    
    // 选择连接
    selectConnection(connectionId) {
      this.selectedConnection = connectionId
      this.selectedNodes = []
    },
    
    // 清除选择
    clearSelection() {
      this.selectedNodes = []
      this.selectedConnection = null
    },
    
    // 复制节点
    copySelectedNodes() {
      if (this.selectedNodes.length === 0) return
      
      const nodesToCopy = this.selectedNodes.map(id => this.getNodeById(id)).filter(Boolean)
      this.clipboard = {
        type: 'nodes',
        data: nodesToCopy.map(n => ({ ...n }))
      }
    },
    
    // 粘贴节点
    pasteNodes() {
      if (!this.clipboard || this.clipboard.type !== 'nodes') return
      
      const pastedNodes = []
      this.clipboard.data.forEach(node => {
        const newNode = {
          ...node,
          id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          x: node.x + 50,
          y: node.y + 50
        }
        this.nodes.push(newNode)
        pastedNodes.push(newNode.id)
      })
      
      // 更新剪贴板位置以便连续粘贴
      this.clipboard.data = this.clipboard.data.map(n => ({
        ...n,
        x: n.x + 50,
        y: n.y + 50
      }))
      
      // 选中粘贴的节点
      this.selectedNodes = pastedNodes
      
      // 记录历史
      this.pushHistory({
        type: 'ADD_NODES',
        nodes: pastedNodes.map(id => ({ ...this.getNodeById(id) }))
      })
    },
    
    // 历史记录管理
    pushHistory(action) {
      // 清除当前位置之后的历史
      this.history = this.history.slice(0, this.historyIndex + 1)
      
      // 添加新动作
      this.history.push(action)
      
      // 限制历史记录大小
      if (this.history.length > this.maxHistorySize) {
        this.history.shift()
      } else {
        this.historyIndex++
      }
    },
    
    // 撤销
    undo() {
      if (!this.canUndo) return
      
      const action = this.history[this.historyIndex]
      this.executeUndo(action)
      this.historyIndex--
    },
    
    // 重做
    redo() {
      if (!this.canRedo) return
      
      this.historyIndex++
      const action = this.history[this.historyIndex]
      this.executeRedo(action)
    },
    
    // 执行撤销
    executeUndo(action) {
      switch (action.type) {
        case 'ADD_NODE':
          this.nodes = this.nodes.filter(n => n.id !== action.node.id)
          break
          
        case 'DELETE_NODE':
          this.nodes.push({ ...action.node })
          action.connections.forEach(conn => {
            this.connections.push({ ...conn })
          })
          break
          
        case 'MOVE_NODE': {
          const node = this.getNodeById(action.nodeId)
          if (node) {
            node.x = action.oldX
            node.y = action.oldY
          }
          break
        }
          
        case 'ADD_CONNECTION':
          this.connections = this.connections.filter(c => c.id !== action.connection.id)
          break
          
        case 'DELETE_CONNECTION':
          this.connections.push({ ...action.connection })
          break
          
        case 'UPDATE_CONNECTION': {
          const connection = this.getConnectionById(action.connectionId)
          if (connection) {
            Object.assign(connection, action.oldData)
          }
          break
        }
          
        case 'ADD_NODES':
          action.nodes.forEach(node => {
            this.nodes = this.nodes.filter(n => n.id !== node.id)
          })
          break
      }
    },
    
    // 执行重做
    executeRedo(action) {
      switch (action.type) {
        case 'ADD_NODE':
          this.nodes.push({ ...action.node })
          break
          
        case 'DELETE_NODE':
          this.nodes = this.nodes.filter(n => n.id !== action.node.id)
          action.connections.forEach(conn => {
            this.connections = this.connections.filter(c => c.id !== conn.id)
          })
          break
          
        case 'MOVE_NODE': {
          const node = this.getNodeById(action.nodeId)
          if (node) {
            node.x = action.newX
            node.y = action.newY
          }
          break
        }
          
        case 'ADD_CONNECTION':
          this.connections.push({ ...action.connection })
          break
          
        case 'DELETE_CONNECTION':
          this.connections = this.connections.filter(c => c.id !== action.connection.id)
          break
          
        case 'UPDATE_CONNECTION': {
          const connection = this.getConnectionById(action.connectionId)
          if (connection) {
            Object.assign(connection, action.newData)
          }
          break
        }
          
        case 'ADD_NODES':
          action.nodes.forEach(node => {
            this.nodes.push({ ...node })
          })
          break
      }
    },
    
    // 更新流程配置
    updateProcessConfig(config) {
      this.processConfig = { ...this.processConfig, ...config }
    },
    
    // 网格吸附
    snapToGridValue(value) {
      if (!this.snapToGrid) return value
      return Math.round(value / this.gridSize) * this.gridSize
    },
    
    // 切换网格吸附
    toggleSnapToGrid() {
      this.snapToGrid = !this.snapToGrid
    },
    
    // 切换网格显示
    toggleShowGrid() {
      this.showGrid = !this.showGrid
    },
    
    // 设置缩放
    setZoom(zoom) {
      this.zoom = Math.max(0.1, Math.min(3, zoom))
    },
    
    // 设置平移
    setPan(x, y) {
      this.panX = x
      this.panY = y
    }
  }
})

