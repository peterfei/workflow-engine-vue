# Spec Delta: Process Designer - 流程名称输入布局优化

## MODIFIED Requirements

### Requirement: Process Name Input Layout

The process name input area in the canvas header SHALL have a fixed label width of 80px and a maximum input width of 400px to ensure visual alignment and proper layout.

**Priority**: P1  
**Category**: UI/UX  
**Component**: Designer Canvas Header

**具体要求**：

1. **标签宽度**：
   - "流程名称：" 标签 SHALL 具有固定宽度 80px
   - 标签文字 SHALL 右对齐，确保冒号垂直对齐
   - 标签 SHALL 使用 `text-sm` 和 `text-gray-600` 样式保持一致性

2. **输入框宽度**：
   - 输入框 SHALL 限制最大宽度不超过 400px
   - 输入框 SHALL 保持现有的表单样式类 `form-input`
   - 输入框 SHALL 在标签右侧显示，保持 16px (gap-4) 间距

3. **响应式行为**：
   - 在小屏幕上 SHALL 保持可读性
   - 输入框 SHALL 不会溢出容器边界

#### Scenario: 用户查看流程设计器画布

**Given** 用户打开流程设计器页面  
**When** 画布加载完成  
**Then** 流程名称标签宽度应为 80px  
**And** 标签文字右对齐，冒号对齐  
**And** 输入框宽度不超过 400px  
**And** 整体布局美观协调

#### Scenario: 用户输入长流程名称

**Given** 用户在流程名称输入框中输入文本  
**When** 输入的文本长度超过输入框可视宽度  
**Then** 输入框应支持横向滚动  
**And** 输入框宽度保持固定  
**And** 不影响其他界面元素

#### Scenario: 标签和输入框对齐

**Given** 流程设计器已加载  
**When** 用户查看流程名称输入区域  
**Then** 标签和输入框应水平对齐  
**And** 标签冒号应在统一位置  
**And** 视觉层次清晰

