# 流程设计器规格增量

## ADDED Requirements

### Requirement: Connection Line Advanced Editing
系统 SHALL 支持连接线的高级编辑功能，包括选择、删除、重绘和路径调整。

#### Scenario: 点击选择连接线
- **WHEN** 用户点击画布上的连接线
- **THEN** 连接线被选中并高亮显示（颜色变为红色，线宽增加）
- **AND** 属性面板显示连接线的属性和删除按钮

#### Scenario: 删除连接线通过属性面板
- **WHEN** 用户选中连接线后点击属性面板中的"删除连接"按钮
- **THEN** 连接线被删除
- **AND** 属性面板恢复为默认状态

#### Scenario: 删除连接线通过键盘
- **WHEN** 用户选中连接线后按 Delete 或 Backspace 键
- **THEN** 连接线被删除
- **AND** 属性面板恢复为默认状态

#### Scenario: 删除连接线通过右键菜单
- **WHEN** 用户右键点击连接线
- **THEN** 显示包含"删除"选项的右键菜单
- **WHEN** 用户点击"删除"选项
- **THEN** 连接线被删除

#### Scenario: 重绘连接线起点
- **WHEN** 用户在编辑模式下拖拽连接线的起点
- **THEN** 起点可以移动到其他节点
- **AND** 连接线的起始节点更新为新节点

#### Scenario: 重绘连接线终点
- **WHEN** 用户在编辑模式下拖拽连接线的终点
- **THEN** 终点可以移动到其他节点
- **AND** 连接线的目标节点更新为新节点

#### Scenario: 调整连接线曲线形状
- **WHEN** 用户拖拽连接线上的控制点
- **THEN** 连接线的曲线形状根据控制点位置调整
- **AND** 调整后的路径被保存

#### Scenario: 连接线悬停高亮
- **WHEN** 用户鼠标悬停在连接线上
- **THEN** 连接线显示高亮效果
- **AND** 鼠标指针变为可点击状态

### Requirement: Bezier Curve Connections
系统 SHALL 使用贝塞尔曲线绘制节点之间的连接线，提供美观的视觉效果。

#### Scenario: 创建贝塞尔曲线连接
- **WHEN** 用户在连接模式下连接两个节点
- **THEN** 系统使用二次贝塞尔曲线绘制连接线
- **AND** 自动计算控制点位置使曲线自然流畅

#### Scenario: 显示连接线箭头
- **WHEN** 连接线被绘制
- **THEN** 连接线终点显示方向箭头
- **AND** 箭头颜色与连接线颜色一致

#### Scenario: 支持多种连接线类型
- **WHEN** 用户在属性面板中选择连接线类型
- **THEN** 连接线可以切换为直线、折线或曲线
- **AND** 连接线外观根据类型更新

### Requirement: Process Global Configuration
系统 SHALL 支持点击画布空白区域配置流程全局属性，包括绑定业务表单。

#### Scenario: 点击画布显示流程配置
- **WHEN** 用户点击画布空白区域（非节点非连接线）
- **THEN** 属性面板切换为流程配置面板
- **AND** 显示流程名称、描述、分类等基本信息

#### Scenario: 绑定业务表单
- **WHEN** 用户在流程配置面板中点击"绑定表单"选项
- **THEN** 显示可用业务表单列表
- **WHEN** 用户选择一个表单
- **THEN** 流程绑定该表单
- **AND** 配置面板显示已绑定的表单名称

#### Scenario: 编辑流程名称
- **WHEN** 用户在流程配置面板中修改流程名称
- **THEN** 流程名称实时更新
- **AND** 页面头部的流程名称同步更新

#### Scenario: 编辑流程描述
- **WHEN** 用户在流程配置面板中输入或修改流程描述
- **THEN** 流程描述被保存到流程定义中

#### Scenario: 设置流程分类
- **WHEN** 用户在流程配置面板中选择流程分类
- **THEN** 流程分类被保存
- **AND** 可用于流程列表的筛选和分组

#### Scenario: 配置流程启动条件
- **WHEN** 用户在流程配置面板中设置启动条件
- **THEN** 启动条件被保存到流程定义中
- **AND** 可用于控制流程的启动权限

### Requirement: Undo Redo System
系统 SHALL 提供完整的撤销/重做功能，支持所有编辑操作。

#### Scenario: 撤销添加节点
- **WHEN** 用户添加节点后按 Ctrl+Z（或点击撤销按钮）
- **THEN** 最近添加的节点被删除
- **AND** 画布恢复到添加前的状态

#### Scenario: 重做添加节点
- **WHEN** 用户撤销添加节点后按 Ctrl+Y（或点击重做按钮）
- **THEN** 节点重新出现在画布上
- **AND** 节点位置和属性与撤销前一致

#### Scenario: 撤销删除节点
- **WHEN** 用户删除节点后按 Ctrl+Z
- **THEN** 节点恢复到画布上
- **AND** 与该节点相关的连接线也恢复

#### Scenario: 撤销移动节点
- **WHEN** 用户移动节点后按 Ctrl+Z
- **THEN** 节点位置恢复到移动前的位置

#### Scenario: 撤销属性修改
- **WHEN** 用户修改节点属性后按 Ctrl+Z
- **THEN** 节点属性恢复到修改前的值

#### Scenario: 多步撤销
- **WHEN** 用户连续按多次 Ctrl+Z
- **THEN** 按时间倒序撤销多个操作
- **AND** 画布状态逐步恢复

#### Scenario: 撤销按钮状态
- **WHEN** 没有可撤销的操作时
- **THEN** 撤销按钮显示为禁用状态

#### Scenario: 重做按钮状态
- **WHEN** 没有可重做的操作时
- **THEN** 重做按钮显示为禁用状态

### Requirement: Node Multi Selection
系统 SHALL 支持多选节点，并支持对多个节点的批量操作。

#### Scenario: Ctrl+点击多选节点
- **WHEN** 用户按住 Ctrl 键点击多个节点
- **THEN** 所有点击的节点被选中
- **AND** 选中的节点显示选中状态（高亮边框）

#### Scenario: 框选节点
- **WHEN** 用户在画布空白区域按住鼠标左键拖拽
- **THEN** 显示虚线选择框
- **WHEN** 用户释放鼠标
- **THEN** 选择框范围内的所有节点被选中

#### Scenario: 批量移动节点
- **WHEN** 用户拖拽多选的节点之一
- **THEN** 所有选中的节点同步移动
- **AND** 节点之间的相对位置保持不变

#### Scenario: 批量删除节点
- **WHEN** 用户选中多个节点后按 Delete 键
- **THEN** 所有选中的节点被删除
- **AND** 与这些节点相关的连接线也被删除

#### Scenario: 全选节点
- **WHEN** 用户按 Ctrl+A
- **THEN** 画布上的所有节点被选中

### Requirement: Copy Paste Functionality
系统 SHALL 支持节点的复制和粘贴功能。

#### Scenario: 复制单个节点
- **WHEN** 用户选中一个节点并按 Ctrl+C
- **THEN** 节点被复制到剪贴板
- **WHEN** 用户按 Ctrl+V
- **THEN** 在原节点附近创建一个副本
- **AND** 副本的属性与原节点相同

#### Scenario: 复制多个节点
- **WHEN** 用户选中多个节点并按 Ctrl+C
- **THEN** 所有选中的节点被复制
- **WHEN** 用户按 Ctrl+V
- **THEN** 创建所有节点的副本
- **AND** 节点之间的相对位置保持不变
- **AND** 节点之间的连接线也被复制

#### Scenario: 连续粘贴
- **WHEN** 用户复制节点后多次按 Ctrl+V
- **THEN** 每次创建新的副本
- **AND** 副本位置略有偏移避免重叠

### Requirement: Context Menu
系统 SHALL 提供右键菜单，支持快速访问常用操作。

#### Scenario: 节点右键菜单
- **WHEN** 用户右键点击节点
- **THEN** 显示节点右键菜单
- **AND** 菜单包含：删除、复制、编辑属性、查看详情等选项

#### Scenario: 连接线右键菜单
- **WHEN** 用户右键点击连接线
- **THEN** 显示连接线右键菜单
- **AND** 菜单包含：删除、编辑标签、切换类型等选项

#### Scenario: 画布右键菜单
- **WHEN** 用户右键点击画布空白区域
- **THEN** 显示画布右键菜单
- **AND** 菜单包含：粘贴、全选、对齐网格、查看流程配置等选项

#### Scenario: 右键菜单操作
- **WHEN** 用户点击右键菜单中的某个选项
- **THEN** 执行对应的操作
- **AND** 菜单自动关闭

### Requirement: Grid Snapping
系统 SHALL 支持网格吸附功能，帮助用户对齐节点。

#### Scenario: 启用网格吸附
- **WHEN** 用户在设置中启用网格吸附
- **THEN** 拖拽节点时自动吸附到最近的网格点

#### Scenario: 网格大小配置
- **WHEN** 用户在设置中修改网格大小
- **THEN** 网格间距更新
- **AND** 吸附行为根据新的网格大小调整

#### Scenario: 显示对齐辅助线
- **WHEN** 用户拖拽节点时
- **AND** 节点与其他节点对齐（左对齐、右对齐、上对齐、下对齐、中心对齐）
- **THEN** 显示虚线对齐辅助线
- **AND** 节点吸附到对齐位置

### Requirement: Data Persistence
系统 SHALL 支持流程定义的保存和加载，实现数据持久化。

#### Scenario: 自动保存草稿
- **WHEN** 用户编辑流程
- **THEN** 系统每 30 秒自动保存草稿到 LocalStorage
- **AND** 显示"已保存"状态提示

#### Scenario: 手动保存流程
- **WHEN** 用户点击"保存草稿"按钮
- **THEN** 流程定义立即保存到 LocalStorage
- **AND** 显示"保存成功"提示

#### Scenario: 加载已保存的流程
- **WHEN** 用户从流程列表选择一个已保存的流程
- **THEN** 系统从 LocalStorage 加载流程定义
- **AND** 画布显示流程的所有节点、连接和配置
- **AND** 视图状态（缩放、平移）恢复到保存时的状态

#### Scenario: 导出流程到文件
- **WHEN** 用户点击"导出"按钮
- **THEN** 系统生成流程定义的 JSON 文件
- **AND** 触发浏览器下载该文件

#### Scenario: 从文件导入流程
- **WHEN** 用户点击"导入"按钮并选择 JSON 文件
- **THEN** 系统读取文件内容
- **AND** 解析并加载流程定义到画布
- **AND** 显示"导入成功"提示

#### Scenario: 保存状态指示
- **WHEN** 用户修改流程但未保存
- **THEN** 显示"未保存"状态指示
- **WHEN** 用户保存流程
- **THEN** 状态指示变为"已保存"

### Requirement: Process Validation
系统 SHALL 提供流程验证功能，检测流程设计中的错误和问题。

#### Scenario: 检测孤立节点
- **WHEN** 用户创建了没有任何连接的节点
- **THEN** 该节点被标记为孤立节点
- **AND** 显示警告提示

#### Scenario: 检测缺少开始节点
- **WHEN** 流程中没有开始节点
- **THEN** 显示错误提示"流程必须包含至少一个开始节点"

#### Scenario: 检测缺少结束节点
- **WHEN** 流程中没有结束节点
- **THEN** 显示警告提示"建议添加至少一个结束节点"

#### Scenario: 检测死循环
- **WHEN** 流程中存在循环依赖且没有退出条件
- **THEN** 显示警告提示"检测到可能的死循环"
- **AND** 高亮显示形成循环的连接线

#### Scenario: 检测必填属性
- **WHEN** 任务节点缺少必填的执行者属性
- **THEN** 该节点显示错误标记
- **AND** 属性面板显示缺少的属性

#### Scenario: 验证结果展示
- **WHEN** 用户点击"验证流程"按钮
- **THEN** 系统执行所有验证规则
- **AND** 在验证面板中显示所有错误和警告
- **AND** 每个问题包含描述和修复建议

#### Scenario: 实时验证
- **WHEN** 用户编辑流程时
- **THEN** 系统实时执行验证
- **AND** 在节点或连接线上显示错误/警告标记

### Requirement: Mini Map Navigation
系统 SHALL 提供小地图导航功能，帮助用户在大型流程图中导航。

#### Scenario: 显示小地图
- **WHEN** 用户启用小地图功能
- **THEN** 在画布右下角显示小地图面板
- **AND** 小地图显示整个流程的缩略图

#### Scenario: 小地图视口指示
- **WHEN** 用户平移或缩放主画布
- **THEN** 小地图中的视口矩形更新位置和大小
- **AND** 视口矩形显示当前可见的画布区域

#### Scenario: 通过小地图导航
- **WHEN** 用户在小地图中点击或拖拽视口矩形
- **THEN** 主画布平移到对应的位置

#### Scenario: 小地图缩放
- **WHEN** 流程节点数量较多时
- **THEN** 小地图自动调整缩放比例以显示所有节点

### Requirement: Keyboard Shortcuts
系统 SHALL 提供完整的键盘快捷键支持，提高操作效率。

#### Scenario: 快捷键帮助面板
- **WHEN** 用户按 ? 或 F1 键
- **THEN** 显示快捷键帮助面板
- **AND** 面板列出所有可用的快捷键及其功能

#### Scenario: 常用快捷键
- **WHEN** 用户按快捷键
- **THEN** 执行对应的操作
- **AND** 支持的快捷键包括：
  - Ctrl+Z: 撤销
  - Ctrl+Y: 重做
  - Ctrl+C: 复制
  - Ctrl+V: 粘贴
  - Ctrl+A: 全选
  - Delete/Backspace: 删除
  - Ctrl+S: 保存
  - Ctrl+Plus: 放大
  - Ctrl+Minus: 缩小
  - Ctrl+0: 重置视图

### Requirement: Performance Optimization
系统 SHALL 在大型流程图（100+ 节点）下保持良好的性能。

#### Scenario: 虚拟化渲染
- **WHEN** 流程节点数量超过 100 个
- **THEN** 系统启用虚拟化渲染
- **AND** 仅渲染视口内及附近的节点
- **AND** 视口外的节点不渲染但保留占位

#### Scenario: 连接线路径缓存
- **WHEN** 连接线路径计算完成
- **THEN** 路径结果被缓存
- **AND** 仅在节点位置改变时重新计算

#### Scenario: 拖拽性能优化
- **WHEN** 用户拖拽节点时
- **THEN** 使用 CSS transform 代替 position 更新
- **AND** 使用 requestAnimationFrame 优化动画
- **AND** 拖拽时暂停非必要的验证和计算

#### Scenario: 渲染节流
- **WHEN** 用户快速执行多个操作
- **THEN** 系统节流渲染频率
- **AND** 保证 UI 响应不低于 30 FPS

## MODIFIED Requirements

### Requirement: Node Dragging
系统 SHALL 允许用户拖拽流程节点，并支持多选拖拽和性能优化。

#### Scenario: 拖拽单个节点
- **WHEN** 用户点击并拖拽一个节点
- **THEN** 节点跟随鼠标移动
- **AND** 节点位置实时更新

#### Scenario: 拖拽多个节点
- **WHEN** 用户选中多个节点后拖拽其中一个
- **THEN** 所有选中的节点同步移动
- **AND** 节点之间的相对位置保持不变

#### Scenario: 拖拽时显示对齐辅助线
- **WHEN** 用户拖拽节点
- **AND** 节点与其他节点对齐
- **THEN** 显示虚线对齐辅助线

#### Scenario: 拖拽时网格吸附
- **WHEN** 网格吸附功能启用且用户拖拽节点
- **THEN** 节点自动吸附到最近的网格点

#### Scenario: 优化拖拽性能
- **WHEN** 用户拖拽节点时
- **THEN** 使用 CSS transform 更新位置
- **AND** 使用 requestAnimationFrame 优化动画

### Requirement: Connection Creation
系统 SHALL 支持在节点之间创建连接线，并提供改进的交互体验。

#### Scenario: 连接模式创建连接
- **WHEN** 用户点击"连接模式"按钮
- **THEN** 进入连接模式
- **WHEN** 用户依次点击两个节点
- **THEN** 在两个节点之间创建贝塞尔曲线连接
- **AND** 自动退出连接模式

#### Scenario: 拖拽创建连接
- **WHEN** 用户从节点的连接点拖拽鼠标
- **THEN** 显示临时连接线跟随鼠标
- **WHEN** 用户释放鼠标到另一个节点上
- **THEN** 创建连接线
- **WHEN** 用户释放鼠标到空白区域
- **THEN** 取消连接创建

#### Scenario: 高亮可连接节点
- **WHEN** 用户在连接模式下选择了起始节点
- **THEN** 可以作为目标节点的节点显示高亮提示

#### Scenario: 防止重复连接
- **WHEN** 两个节点之间已存在连接
- **AND** 用户尝试创建相同方向的连接
- **THEN** 显示提示"节点之间已存在连接"
- **AND** 不创建重复连接

### Requirement: Form Binding Area
系统 SHALL 提供流程全局配置面板，支持表单绑定和其他流程属性配置。

#### Scenario: 显示流程配置面板
- **WHEN** 用户点击画布空白区域
- **THEN** 属性面板切换为流程配置面板
- **AND** 显示流程名称、描述、分类、绑定表单等配置项

#### Scenario: 绑定业务表单
- **WHEN** 用户在流程配置面板中选择业务表单
- **THEN** 流程绑定该表单
- **AND** 流程启动时将使用该表单收集数据

#### Scenario: 配置流程元数据
- **WHEN** 用户在流程配置面板中编辑流程属性
- **THEN** 所有修改实时保存到流程定义中

## REMOVED Requirements

无移除的需求。

