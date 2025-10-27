/**
 * 企业级表单模拟数据
 * 包含20个预定义的业务流程表单
 */

// 字段类型定义
export const FieldType = {
  TEXT: 'text',           // 单行文本
  NUMBER: 'number',       // 数字
  DATE: 'date',           // 日期
  DATETIME: 'datetime',   // 日期时间
  SELECT: 'select',       // 下拉选择
  RADIO: 'radio',         // 单选
  CHECKBOX: 'checkbox',   // 多选
  TEXTAREA: 'textarea',   // 多行文本
  BOOLEAN: 'boolean'      // 布尔值
}

// 表单定义
export const mockForms = [
  // ========== 人事类 ==========
  {
    id: 'form-hr-001',
    name: '员工入职申请表',
    description: '新员工入职时填写的完整信息表',
    category: '人事',
    fields: [
      { name: '姓名', type: FieldType.TEXT, required: true, description: '员工姓名' },
      { name: '性别', type: FieldType.RADIO, required: true, options: ['男', '女'] },
      { name: '出生日期', type: FieldType.DATE, required: true },
      { name: '身份证号', type: FieldType.TEXT, required: true, validation: { pattern: '^[0-9Xx]{18}$' } },
      { name: '联系方式', type: FieldType.TEXT, required: true },
      { name: '邮箱', type: FieldType.TEXT, required: true, validation: { pattern: 'email' } },
      { name: '学历', type: FieldType.SELECT, required: true, options: ['高中', '大专', '本科', '硕士', '博士'] },
      { name: '毕业院校', type: FieldType.TEXT, required: false },
      { name: '专业', type: FieldType.TEXT, required: false },
      { name: '工作经历', type: FieldType.TEXTAREA, required: false, description: '详细描述工作经历' }
    ]
  },
  {
    id: 'form-hr-002',
    name: '请假申请表',
    description: '员工请假申请',
    category: '人事',
    fields: [
      { name: '请假类型', type: FieldType.SELECT, required: true, options: ['年假', '病假', '事假', '婚假', '产假', '其他'] },
      { name: '开始日期', type: FieldType.DATE, required: true },
      { name: '结束日期', type: FieldType.DATE, required: true },
      { name: '请假天数', type: FieldType.NUMBER, required: true },
      { name: '请假事由', type: FieldType.TEXTAREA, required: true },
      { name: '紧急联系方式', type: FieldType.TEXT, required: false }
    ]
  },
  {
    id: 'form-hr-003',
    name: '离职申请表',
    description: '员工离职申请',
    category: '人事',
    fields: [
      { name: '离职原因', type: FieldType.SELECT, required: true, options: ['个人原因', '薪资原因', '发展空间', '工作环境', '其他'] },
      { name: '离职日期', type: FieldType.DATE, required: true },
      { name: '详细说明', type: FieldType.TEXTAREA, required: true },
      { name: '工作交接人', type: FieldType.TEXT, required: true }
    ]
  },
  {
    id: 'form-hr-004',
    name: '加班申请表',
    description: '员工加班申请',
    category: '人事',
    fields: [
      { name: '加班日期', type: FieldType.DATE, required: true },
      { name: '开始时间', type: FieldType.DATETIME, required: true },
      { name: '结束时间', type: FieldType.DATETIME, required: true },
      { name: '加班时长', type: FieldType.NUMBER, required: true, description: '小时' },
      { name: '加班事由', type: FieldType.TEXTAREA, required: true }
    ]
  },

  // ========== 财务类 ==========
  {
    id: 'form-finance-001',
    name: '报销申请表',
    description: '费用报销申请',
    category: '财务',
    fields: [
      { name: '报销类型', type: FieldType.SELECT, required: true, options: ['差旅费', '办公用品', '餐费', '交通费', '其他'] },
      { name: '报销金额', type: FieldType.NUMBER, required: true, description: '元' },
      { name: '发票张数', type: FieldType.NUMBER, required: true },
      { name: '报销事由', type: FieldType.TEXTAREA, required: true },
      { name: '附件说明', type: FieldType.TEXTAREA, required: false }
    ]
  },
  {
    id: 'form-finance-002',
    name: '差旅费报销单',
    description: '出差费用报销',
    category: '财务',
    fields: [
      { name: '出差地点', type: FieldType.TEXT, required: true },
      { name: '出差日期', type: FieldType.DATE, required: true },
      { name: '出差天数', type: FieldType.NUMBER, required: true },
      { name: '交通费', type: FieldType.NUMBER, required: true },
      { name: '住宿费', type: FieldType.NUMBER, required: true },
      { name: '餐费补贴', type: FieldType.NUMBER, required: true },
      { name: '其他费用', type: FieldType.NUMBER, required: false },
      { name: '合计金额', type: FieldType.NUMBER, required: true }
    ]
  },
  {
    id: 'form-finance-003',
    name: '付款申请单',
    description: '对外付款申请',
    category: '财务',
    fields: [
      { name: '收款单位', type: FieldType.TEXT, required: true },
      { name: '付款金额', type: FieldType.NUMBER, required: true, description: '元' },
      { name: '付款方式', type: FieldType.SELECT, required: true, options: ['银行转账', '支票', '现金', '汇票'] },
      { name: '付款事由', type: FieldType.TEXTAREA, required: true },
      { name: '合同编号', type: FieldType.TEXT, required: false },
      { name: '发票号码', type: FieldType.TEXT, required: false }
    ]
  },
  {
    id: 'form-finance-004',
    name: '借款申请表',
    description: '员工借款申请',
    category: '财务',
    fields: [
      { name: '借款金额', type: FieldType.NUMBER, required: true, description: '元' },
      { name: '借款用途', type: FieldType.TEXTAREA, required: true },
      { name: '预计还款日期', type: FieldType.DATE, required: true },
      { name: '还款方式', type: FieldType.SELECT, required: true, options: ['一次性还款', '分期还款'] }
    ]
  },

  // ========== 采购类 ==========
  {
    id: 'form-procurement-001',
    name: '采购申请表',
    description: '物品采购申请',
    category: '采购',
    fields: [
      { name: '物品名称', type: FieldType.TEXT, required: true },
      { name: '规格型号', type: FieldType.TEXT, required: false },
      { name: '数量', type: FieldType.NUMBER, required: true },
      { name: '单价', type: FieldType.NUMBER, required: true, description: '元' },
      { name: '总价', type: FieldType.NUMBER, required: true, description: '元' },
      { name: '采购用途', type: FieldType.TEXTAREA, required: true },
      { name: '预计使用日期', type: FieldType.DATE, required: true }
    ]
  },
  {
    id: 'form-procurement-002',
    name: '供应商评估表',
    description: '供应商资质评估',
    category: '采购',
    fields: [
      { name: '供应商名称', type: FieldType.TEXT, required: true },
      { name: '联系人', type: FieldType.TEXT, required: true },
      { name: '联系方式', type: FieldType.TEXT, required: true },
      { name: '主营产品', type: FieldType.TEXTAREA, required: true },
      { name: '资质认证', type: FieldType.CHECKBOX, required: false, options: ['ISO9001', 'ISO14001', 'ISO18001', '其他'] },
      { name: '评估结果', type: FieldType.SELECT, required: true, options: ['合格', '不合格', '待评估'] }
    ]
  },
  {
    id: 'form-procurement-003',
    name: '采购合同审批表',
    description: '采购合同审批',
    category: '采购',
    fields: [
      { name: '合同名称', type: FieldType.TEXT, required: true },
      { name: '合同编号', type: FieldType.TEXT, required: true },
      { name: '供应商', type: FieldType.TEXT, required: true },
      { name: '合同金额', type: FieldType.NUMBER, required: true, description: '元' },
      { name: '合同期限', type: FieldType.DATE, required: true },
      { name: '付款方式', type: FieldType.TEXT, required: true },
      { name: '合同条款', type: FieldType.TEXTAREA, required: true }
    ]
  },

  // ========== 审批类 ==========
  {
    id: 'form-approval-001',
    name: '印章使用申请表',
    description: '公司印章使用申请',
    category: '审批',
    fields: [
      { name: '用印类型', type: FieldType.SELECT, required: true, options: ['公章', '合同章', '财务章', '法人章'] },
      { name: '用印文件', type: FieldType.TEXT, required: true },
      { name: '用印事由', type: FieldType.TEXTAREA, required: true },
      { name: '文件份数', type: FieldType.NUMBER, required: true },
      { name: '紧急程度', type: FieldType.SELECT, required: true, options: ['一般', '紧急', '特急'] }
    ]
  },
  {
    id: 'form-approval-002',
    name: '用印申请表',
    description: '印章使用申请',
    category: '审批',
    fields: [
      { name: '申请部门', type: FieldType.TEXT, required: true },
      { name: '申请事项', type: FieldType.TEXT, required: true },
      { name: '用印文件名称', type: FieldType.TEXTAREA, required: true },
      { name: '文件份数', type: FieldType.NUMBER, required: true },
      { name: '紧急程度', type: FieldType.SELECT, required: true, options: ['一般', '紧急'] }
    ]
  },
  {
    id: 'form-approval-003',
    name: '合同审批表',
    description: '合同审批流程',
    category: '审批',
    fields: [
      { name: '合同名称', type: FieldType.TEXT, required: true },
      { name: '合同类型', type: FieldType.SELECT, required: true, options: ['采购合同', '销售合同', '服务合同', '租赁合同', '其他'] },
      { name: '合同金额', type: FieldType.NUMBER, required: true, description: '元' },
      { name: '对方单位', type: FieldType.TEXT, required: true },
      { name: '合同摘要', type: FieldType.TEXTAREA, required: true }
    ]
  },

  // ========== 销售类 ==========
  {
    id: 'form-sales-001',
    name: '订单申请表',
    description: '客户订单申请',
    category: '销售',
    fields: [
      { name: '客户名称', type: FieldType.TEXT, required: true },
      { name: '订单编号', type: FieldType.TEXT, required: true },
      { name: '产品名称', type: FieldType.TEXT, required: true },
      { name: '数量', type: FieldType.NUMBER, required: true },
      { name: '单价', type: FieldType.NUMBER, required: true, description: '元' },
      { name: '订单金额', type: FieldType.NUMBER, required: true, description: '元' },
      { name: '交货日期', type: FieldType.DATE, required: true },
      { name: '备注', type: FieldType.TEXTAREA, required: false }
    ]
  },
  {
    id: 'form-sales-002',
    name: '销售合同审批表',
    description: '销售合同审批',
    category: '销售',
    fields: [
      { name: '客户名称', type: FieldType.TEXT, required: true },
      { name: '合同编号', type: FieldType.TEXT, required: true },
      { name: '合同金额', type: FieldType.NUMBER, required: true, description: '元' },
      { name: '付款方式', type: FieldType.SELECT, required: true, options: ['现金', '转账', '承兑', '其他'] },
      { name: '交货地点', type: FieldType.TEXT, required: true },
      { name: '合同条款', type: FieldType.TEXTAREA, required: true }
    ]
  },

  // ========== 通用类 ==========
  {
    id: 'form-common-001',
    name: '物品借用申请表',
    description: '公司物品借用申请',
    category: '通用',
    fields: [
      { name: '物品名称', type: FieldType.TEXT, required: true },
      { name: '物品编号', type: FieldType.TEXT, required: false },
      { name: '借用数量', type: FieldType.NUMBER, required: true },
      { name: '借用日期', type: FieldType.DATE, required: true },
      { name: '预计归还日期', type: FieldType.DATE, required: true },
      { name: '借用用途', type: FieldType.TEXTAREA, required: true }
    ]
  },
  {
    id: 'form-common-002',
    name: '会议室预订申请表',
    description: '会议室预订',
    category: '通用',
    fields: [
      { name: '会议室名称', type: FieldType.TEXT, required: true },
      { name: '预订日期', type: FieldType.DATE, required: true },
      { name: '开始时间', type: FieldType.DATETIME, required: true },
      { name: '结束时间', type: FieldType.DATETIME, required: true },
      { name: '参会人数', type: FieldType.NUMBER, required: true },
      { name: '会议主题', type: FieldType.TEXT, required: true },
      { name: '需要设备', type: FieldType.CHECKBOX, required: false, options: ['投影仪', '音响', '白板', '其他'] }
    ]
  },
  {
    id: 'form-common-003',
    name: '用车申请表',
    description: '公司车辆使用申请',
    category: '通用',
    fields: [
      { name: '用车类型', type: FieldType.SELECT, required: true, options: ['公务用车', '接送客户', '其他'] },
      { name: '用车日期', type: FieldType.DATE, required: true },
      { name: '出发时间', type: FieldType.DATETIME, required: true },
      { name: '出发地点', type: FieldType.TEXT, required: true },
      { name: '目的地', type: FieldType.TEXT, required: true },
      { name: '用车事由', type: FieldType.TEXTAREA, required: true },
      { name: '用车人数', type: FieldType.NUMBER, required: true }
    ]
  },
  {
    id: 'form-common-004',
    name: '固定资产申请表',
    description: '固定资产采购申请',
    category: '通用',
    fields: [
      { name: '资产名称', type: FieldType.TEXT, required: true },
      { name: '资产类别', type: FieldType.SELECT, required: true, options: ['办公设备', '电脑设备', '家具', '其他'] },
      { name: '规格型号', type: FieldType.TEXT, required: false },
      { name: '数量', type: FieldType.NUMBER, required: true },
      { name: '单价', type: FieldType.NUMBER, required: true, description: '元' },
      { name: '总价', type: FieldType.NUMBER, required: true, description: '元' },
      { name: '使用部门', type: FieldType.TEXT, required: true },
      { name: '申请理由', type: FieldType.TEXTAREA, required: true }
    ]
  }
]

// 获取所有表单
export const getAllForms = () => mockForms

// 根据ID获取表单
export const getFormById = (id) => mockForms.find(form => form.id === id)

// 根据分类获取表单
export const getFormsByCategory = (category) => mockForms.filter(form => form.category === category)

// 获取所有分类
export const getCategories = () => {
  const categories = [...new Set(mockForms.map(form => form.category))]
  return categories
}

// 搜索表单
export const searchForms = (keyword) => {
  const lowerKeyword = keyword.toLowerCase()
  return mockForms.filter(form => 
    form.name.toLowerCase().includes(lowerKeyword) ||
    form.description.toLowerCase().includes(lowerKeyword)
  )
}

export default mockForms
