## ADDED Requirements

### Requirement: Enterprise Form Data
系统 SHALL 提供企业级表单数据管理，包括20个预定义表单和完整的字段定义。

#### Scenario: 加载可用表单列表
- **WHEN** 用户打开流程设计器
- **THEN** 系统加载所有可用的预定义表单
- **AND** 表单列表包括20个不同类型的业务表单
- **AND** 每个表单包含ID、名称、描述、分类和字段定义

#### Scenario: 表单分类和筛选
- **WHEN** 用户在绑定表单时
- **THEN** 表单按分类显示（人事、财务、采购、销售、审批等）
- **AND** 用户可以按分类筛选表单
- **AND** 用户可以搜索表单名称

### Requirement: Form Field Types
系统 SHALL 支持多种表单字段类型，包括文本、数字、日期、选择、多选、布尔等。

#### Scenario: 显示字段类型
- **WHEN** 用户预览表单或配置字段映射
- **THEN** 每个字段显示其类型
- **AND** 支持的类型包括：文本(text)、数字(number)、日期(date)、日期时间(datetime)、单选框(radio)、多选框(checkbox)、下拉选择(select)、文本域(textarea)、布尔(boolean)

#### Scenario: 字段验证规则
- **WHEN** 表单包含字段验证规则
- **THEN** 系统显示验证规则（必填、最小长度、最大长度、正则表达式等）
- **AND** 必填字段特别标记

### Requirement: Form Preview
系统 SHALL 提供表单预览功能，允许用户在绑定前查看表单结构和字段详情。

#### Scenario: 打开表单预览
- **WHEN** 用户在表单选择器中点击"预览"按钮
- **THEN** 打开表单预览模态框
- **AND** 显示表单的完整结构
- **AND** 显示表单名称、描述和所有字段

#### Scenario: 预览表单字段
- **WHEN** 用户在表单预览中查看字段列表
- **THEN** 每个字段显示名称、类型、是否必填和描述
- **AND** 必填字段用红色星号标记
- **AND** 支持滚动查看长表单

### Requirement: Field Mapping Configuration
系统 SHALL 支持配置表单字段与流程变量的映射关系。

#### Scenario: 显示字段映射列表
- **WHEN** 流程已绑定表单
- **AND** 用户在流程配置面板中查看字段映射
- **THEN** 显示表单字段列表
- **AND** 显示每个字段对应的流程变量（如果有）
- **AND** 未映射的字段显示为空

#### Scenario: 手动配置映射
- **WHEN** 用户在字段映射列表中点击某个字段
- **THEN** 显示可用的流程变量列表
- **WHEN** 用户选择一个变量
- **THEN** 该字段映射到选中的变量
- **AND** 映射关系保存到流程配置中

#### Scenario: 自动映射
- **WHEN** 用户选择自动映射模式
- **THEN** 系统自动匹配同名的表单字段和流程变量
- **AND** 自动映射结果可手动调整
