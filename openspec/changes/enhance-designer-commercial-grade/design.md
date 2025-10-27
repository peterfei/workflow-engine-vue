# 技术设计：商用级流程设计器

## Context

流程设计器是工作流引擎平台的核心功能模块，需要提供专业、流畅、可靠的流程建模体验。当前实现为单文件组件，所有逻辑集中在 Designer.vue 中，代码超过 700 行，维护困难。商用级设计器需要：

- 支持复杂的用户交互（拖拽、连接、编辑）
- 保证良好的性能（支持 100+ 节点）
- 提供完善的数据管理和持久化
- 具备可扩展的架构设计

## Goals / Non-Goals

### Goals
1. 提供商用级的用户体验（流畅、直观、专业）
2. 实现完整的编辑功能（撤销/重做、多选、复制粘贴）
3. 优化性能，支持大型流程图（100+ 节点）
4. 建立可扩展的架构，便于后续功能扩展
5. 提供完善的数据持久化和导入导出
6. 实现流程验证和错误检测

### Non-Goals
1. 不实现实时协作编辑（多人同时编辑）
2. 不集成版本控制系统
3. 不实现流程模板市场
4. 不在此阶段支持自定义节点渲染器
5. 不实现流程执行引擎（仅设计器）

## Decisions

### 1. 架构重构：组件化拆分

**决策**：将 Designer.vue 拆分为多个专注的子组件

**理由**：
- 单文件组件已达 700+ 行，维护困难
- 不同功能区域（工具箱、画布、属性面板）职责清晰
- 便于单独测试和优化
- 提高代码可读性和可维护性

**组件结构**：
```
src/components/designer/
├── DesignerCanvas.vue        # 主画布容器
├── Toolbox.vue               # 节点工具箱
├── CanvasNode.vue            # 单个流程节点
├── ConnectionLine.vue        # 连接线
├── PropertiesPanel.vue       # 属性编辑面板
├── ProcessConfigPanel.vue    # 流程全局配置
├── MiniMap.vue               # 小地图导航
├── ContextMenu.vue           # 右键菜单
└── ShortcutHelp.vue          # 快捷键帮助
```

**备选方案**：
- 保持单文件组件 - 被拒绝：代码过于臃肿，难以维护
- 使用 Web Components - 被拒绝：与 Vue 生态系统集成不够紧密

### 2. 状态管理：引入 Pinia

**决策**：使用 Pinia 管理设计器状态

**理由**：
- 设计器状态复杂（节点、连接、选择、历史记录）
- 多个组件需要共享状态
- Pinia 是 Vue 3 官方推荐的状态管理方案
- 支持 TypeScript，便于后续迁移
- DevTools 支持，便于调试

**状态结构**：
```javascript
// stores/designer.js
export const useDesignerStore = defineStore('designer', {
  state: () => ({
    // 流程元数据
    processName: '新流程',
    processDescription: '',
    boundFormId: null,
    
    // 画布元素
    nodes: [],
    connections: [],
    
    // 选择状态
    selectedNodeIds: [],
    selectedConnectionId: null,
    
    // 历史记录
    history: [],
    historyIndex: -1,
    
    // 视图状态
    scale: 1,
    panX: 0,
    panY: 0,
    
    // UI 状态
    connectionMode: false,
    connectingFrom: null,
    showMiniMap: true
  }),
  
  actions: {
    // 节点操作
    addNode(node) { },
    updateNode(id, updates) { },
    deleteNode(id) { },
    moveNodes(ids, deltaX, deltaY) { },
    
    // 连接操作
    addConnection(from, to) { },
    updateConnection(id, updates) { },
    deleteConnection(id) { },
    
    // 选择操作
    selectNode(id, multi = false) { },
    selectConnection(id) { },
    clearSelection() { },
    
    // 历史操作
    pushHistory(action) { },
    undo() { },
    redo() { },
    
    // 数据操作
    loadProcess(data) { },
    exportProcess() { },
    validateProcess() { }
  }
})
```

**备选方案**：
- 使用 provide/inject - 被拒绝：不适合复杂状态管理
- 使用 Vuex - 被拒绝：Pinia 是更现代的方案

### 3. 撤销/重做：命令模式

**决策**：实现命令模式的撤销/重做系统

**理由**：
- 命令模式是撤销/重做的经典实现
- 每个操作封装为命令对象，包含 execute 和 undo 方法
- 易于扩展新的可撤销操作
- 支持操作合并（如连续移动）

**实现示例**：
```javascript
// composables/useHistory.js
class Command {
  execute() { throw new Error('Must implement execute') }
  undo() { throw new Error('Must implement undo') }
  redo() { this.execute() }
}

class AddNodeCommand extends Command {
  constructor(store, node) {
    super()
    this.store = store
    this.node = node
  }
  
  execute() {
    this.store.nodes.push(this.node)
  }
  
  undo() {
    const index = this.store.nodes.findIndex(n => n.id === this.node.id)
    if (index > -1) this.store.nodes.splice(index, 1)
  }
}

// 使用
export function useHistory() {
  const history = ref([])
  const currentIndex = ref(-1)
  
  const execute = (command) => {
    command.execute()
    history.value = history.value.slice(0, currentIndex.value + 1)
    history.value.push(command)
    currentIndex.value++
  }
  
  const undo = () => {
    if (currentIndex.value >= 0) {
      history.value[currentIndex.value].undo()
      currentIndex.value--
    }
  }
  
  const redo = () => {
    if (currentIndex.value < history.value.length - 1) {
      currentIndex.value++
      history.value[currentIndex.value].redo()
    }
  }
  
  return { execute, undo, redo }
}
```

**备选方案**：
- 快照模式（整个状态快照）- 被拒绝：内存占用大，性能差
- 事件溯源 - 被拒绝：过于复杂，适合大型系统

### 4. 连接线渲染：SVG 路径优化

**决策**：使用贝塞尔曲线绘制连接线，修复鼠标事件拦截问题

**理由**：
- 贝塞尔曲线提供更美观的连接效果
- 通过调整 SVG 层级和 `pointer-events` 修复事件拦截
- 支持连接线中间点编辑

**实现方案**：
```vue
<!-- ConnectionLine.vue -->
<template>
  <g class="connection-line" @click="handleClick">
    <!-- 透明的宽路径用于捕获点击 -->
    <path
      :d="path"
      :stroke="transparent"
      stroke-width="20"
      fill="none"
      style="cursor: pointer;"
    />
    <!-- 实际显示的路径 -->
    <path
      :d="path"
      :stroke="isSelected ? '#ef4444' : '#94a3b8'"
      :stroke-width="isSelected ? 3 : 2"
      fill="none"
      marker-end="url(#arrowhead)"
      style="pointer-events: none;"
    />
    <!-- 中间控制点（编辑模式） -->
    <circle
      v-if="isEditing"
      :cx="controlPoint.x"
      :cy="controlPoint.y"
      r="6"
      fill="#3b82f6"
      style="cursor: move;"
      @mousedown="startDragControlPoint"
    />
  </g>
</template>

<script>
export default {
  computed: {
    path() {
      const { x1, y1, x2, y2 } = this.getNodePositions()
      const cp = this.controlPoint || this.calculateControlPoint(x1, y1, x2, y2)
      // 使用二次贝塞尔曲线
      return `M ${x1} ${y1} Q ${cp.x} ${cp.y} ${x2} ${y2}`
    }
  },
  methods: {
    calculateControlPoint(x1, y1, x2, y2) {
      // 自动计算控制点，创建自然曲线
      const dx = x2 - x1
      const dy = y2 - y1
      return {
        x: x1 + dx / 2,
        y: y1 + dy / 2 - Math.abs(dx) * 0.2
      }
    }
  }
}
</script>
```

**节点层级修复**：
```vue
<!-- DesignerCanvas.vue -->
<template>
  <div class="canvas-paper">
    <!-- 1. 连接线层（最底层） -->
    <svg class="connections-layer">
      <ConnectionLine
        v-for="conn in connections"
        :key="conn.id"
        :connection="conn"
      />
    </svg>
    
    <!-- 2. 节点层（中层） -->
    <CanvasNode
      v-for="node in nodes"
      :key="node.id"
      :node="node"
      style="position: absolute; z-index: 10;"
    />
    
    <!-- 3. 选择框层（最上层） -->
    <div v-if="isBoxSelecting" class="selection-box" />
  </div>
</template>
```

**备选方案**：
- 使用 Canvas 渲染 - 被拒绝：失去 DOM 操作灵活性
- 使用第三方图形库（如 Konva）- 被拒绝：增加依赖，学习成本高

### 5. 性能优化：虚拟化渲染

**决策**：节点数量超过 100 时启用虚拟化渲染

**理由**：
- 大型流程图可能包含数百个节点
- 渲染所有节点会导致性能问题
- 只渲染视口内的节点可大幅提升性能

**实现方案**：
```javascript
// composables/useVirtualCanvas.js
export function useVirtualCanvas(nodes, scale, panX, panY) {
  const canvasRect = ref({ x: 0, y: 0, width: 0, height: 0 })
  
  const visibleNodes = computed(() => {
    if (nodes.value.length < 100) {
      // 少量节点，全部渲染
      return nodes.value
    }
    
    // 计算视口范围
    const viewportX = -panX.value / scale.value
    const viewportY = -panY.value / scale.value
    const viewportWidth = canvasRect.value.width / scale.value
    const viewportHeight = canvasRect.value.height / scale.value
    
    // 过滤视口内的节点（带边距）
    const padding = 200
    return nodes.value.filter(node => {
      return node.x + 48 >= viewportX - padding &&
             node.x <= viewportX + viewportWidth + padding &&
             node.y + 48 >= viewportY - padding &&
             node.y <= viewportY + viewportHeight + padding
    })
  })
  
  return { visibleNodes, canvasRect }
}
```

**备选方案**：
- Web Worker 渲染 - 被拒绝：复杂度高，收益有限
- Canvas 渲染 - 被拒绝：失去 Vue 响应式优势

### 6. 数据持久化：JSON 序列化 + LocalStorage

**决策**：使用 JSON 格式存储流程定义，支持 LocalStorage 和文件导入导出

**数据格式**：
```json
{
  "version": "1.0",
  "metadata": {
    "id": "process-001",
    "name": "订单审批流程",
    "description": "处理订单审批的标准流程",
    "boundFormId": "form-001",
    "createdAt": "2025-10-27T12:00:00Z",
    "updatedAt": "2025-10-27T12:30:00Z"
  },
  "canvas": {
    "scale": 1,
    "panX": 0,
    "panY": 0
  },
  "nodes": [
    {
      "id": "node-1",
      "type": "start",
      "label": "开始",
      "x": 100,
      "y": 100,
      "properties": {}
    },
    {
      "id": "node-2",
      "type": "task",
      "label": "审核订单",
      "x": 300,
      "y": 100,
      "properties": {
        "assignee": "sales-manager",
        "timeout": "24h",
        "description": "审核订单金额和客户信息"
      }
    }
  ],
  "connections": [
    {
      "id": "conn-1",
      "from": "node-1",
      "to": "node-2",
      "type": "sequence",
      "label": "",
      "controlPoints": [
        { "x": 200, "y": 80 }
      ]
    }
  ]
}
```

**实现**：
```javascript
// stores/designer.js
actions: {
  async saveProcess() {
    const data = this.exportProcess()
    
    // 保存到 LocalStorage
    localStorage.setItem(`process-${data.metadata.id}`, JSON.stringify(data))
    
    // 自动保存列表
    const savedProcesses = JSON.parse(localStorage.getItem('saved-processes') || '[]')
    if (!savedProcesses.includes(data.metadata.id)) {
      savedProcesses.push(data.metadata.id)
      localStorage.setItem('saved-processes', JSON.stringify(savedProcesses))
    }
    
    return data
  },
  
  async loadProcess(id) {
    const data = localStorage.getItem(`process-${id}`)
    if (!data) throw new Error('Process not found')
    
    const process = JSON.parse(data)
    this.processName = process.metadata.name
    this.processDescription = process.metadata.description
    this.boundFormId = process.metadata.boundFormId
    this.nodes = process.nodes
    this.connections = process.connections
    this.scale = process.canvas.scale
    this.panX = process.canvas.panX
    this.panY = process.canvas.panY
  },
  
  exportToFile() {
    const data = this.exportProcess()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.metadata.name}.json`
    a.click()
    URL.revokeObjectURL(url)
  },
  
  async importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          this.loadProcess(data.metadata.id)
          resolve(data)
        } catch (error) {
          reject(error)
        }
      }
      reader.readAsText(file)
    })
  }
}
```

## Risks / Trade-offs

### 风险1：重构引入 Bug
**缓解措施**：
- 逐步重构，每个组件独立测试
- 保留原始实现作为备份
- 充分的手动和自动化测试

### 风险2：性能优化效果不达预期
**缓解措施**：
- 使用 Chrome DevTools Performance 分析
- 建立性能基准测试
- 分阶段优化，验证效果

### 风险3：用户学习成本
**缓解措施**：
- 提供快捷键帮助面板
- 添加操作提示和工具提示
- 保持与常见设计工具的操作习惯一致

### 权衡：复杂度 vs 功能完整性
- 增加了代码复杂度，但提供了商用级功能
- 引入 Pinia 增加了依赖，但简化了状态管理
- 组件拆分增加了文件数量，但提高了可维护性

## Migration Plan

### 阶段1：基础重构（2天）
1. 安装依赖（Pinia, @vueuse/core）
2. 创建 Pinia store
3. 拆分子组件（保持功能不变）
4. 迁移现有功能到新架构
5. 测试基本功能

### 阶段2：连接线增强（1天）
1. 修复 SVG 事件拦截问题
2. 实现贝塞尔曲线渲染
3. 实现连接线选择和删除
4. 添加连接线编辑功能

### 阶段3：撤销/重做（1天）
1. 实现命令模式基础架构
2. 为所有操作添加命令封装
3. 实现历史记录管理
4. 添加快捷键支持

### 阶段4：高级交互（2天）
1. 实现多选功能
2. 实现复制粘贴
3. 添加右键菜单
4. 实现网格吸附和对齐辅助线

### 阶段5：流程配置和验证（1天）
1. 实现流程全局配置面板
2. 添加表单绑定功能
3. 实现流程验证逻辑
4. 添加错误提示

### 阶段6：数据管理和优化（1天）
1. 实现数据持久化
2. 添加导入导出功能
3. 实现虚拟化渲染
4. 性能优化和测试

### 阶段7：用户体验优化（1天）
1. 添加小地图
2. 添加快捷键帮助
3. 优化操作反馈
4. 最终测试和调优

### 回滚计划
- 保留原始 Designer.vue 作为 Designer.vue.backup
- 如果出现严重问题，可快速回滚
- 使用 Git 分支隔离开发

## Open Questions

1. **表单列表数据源**：流程绑定的表单列表从哪里获取？
   - 建议：先使用模拟数据，后续集成 API

2. **流程验证规则**：需要哪些具体的验证规则？
   - 建议：先实现基础验证（孤立节点、缺少开始/结束），后续扩展

3. **协作编辑**：是否需要冲突检测？
   - 建议：当前版本不支持，未来可考虑

4. **移动端适配**：是否需要支持平板/手机？
   - 建议：当前优先桌面端，移动端仅支持查看

5. **国际化**：是否需要多语言支持？
   - 建议：当前使用中文，预留国际化接口

