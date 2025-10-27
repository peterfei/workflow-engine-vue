<template>
  <div>
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="flex items-center justify-between w-full">
        <div>
          <h1 class="page-title">表单设计器</h1>
          <p class="page-subtitle">创建和编辑业务表单</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn btn-secondary" @click="$router.go(-1)">
            <i class="fas fa-arrow-left"></i>
            返回
          </button>
          <button class="btn btn-secondary">
            <i class="fas fa-save"></i>
            保存
          </button>
          <button class="btn btn-primary">
            <i class="fas fa-eye"></i>
            预览
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 左侧工具栏 -->
        <div class="lg:col-span-1">
          <div class="card p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">
              <i class="fas fa-wpforms text-blue-500 mr-2"></i>
              表单组件
            </h3>
            <div class="space-y-2">
              <div class="component-item" draggable="true">
                <i class="fas fa-font"></i>
                <span>单行文本</span>
              </div>
              <div class="component-item" draggable="true">
                <i class="fas fa-align-left"></i>
                <span>多行文本</span>
              </div>
              <div class="component-item" draggable="true">
                <i class="fas fa-list"></i>
                <span>下拉选择</span>
              </div>
              <div class="component-item" draggable="true">
                <i class="fas fa-dot-circle"></i>
                <span>单选框</span>
              </div>
              <div class="component-item" draggable="true">
                <i class="fas fa-check-square"></i>
                <span>复选框</span>
              </div>
              <div class="component-item" draggable="true">
                <i class="fas fa-calendar"></i>
                <span>日期选择</span>
              </div>
              <div class="component-item" draggable="true">
                <i class="fas fa-upload"></i>
                <span>文件上传</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 中间表单画布 -->
        <div class="lg:col-span-2">
          <div class="card p-6">
            <div class="form-canvas">
              <div class="form-header">
                <input
                  type="text"
                  class="form-title-input"
                  placeholder="表单标题"
                  v-model="formTitle"
                >
                <textarea
                  class="form-description-input"
                  placeholder="表单描述"
                  v-model="formDescription"
                ></textarea>
              </div>

              <div class="form-fields">
                <div class="form-field" v-for="(field, index) in formFields" :key="index">
                  <div class="field-header">
                    <span class="field-label">{{ field.label }}</span>
                    <div class="field-actions">
                      <button class="field-action-btn">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="field-action-btn">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div class="field-input">
                    <component :is="getFieldComponent(field.type)" :field="field" />
                  </div>
                  <div class="field-settings">
                    <span class="setting-item">必填</span>
                    <span class="setting-item">验证</span>
                  </div>
                </div>

                <div class="add-field-btn">
                  <i class="fas fa-plus"></i>
                  添加字段
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧属性面板 -->
        <div class="lg:col-span-1">
          <div class="card p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-4">
              <i class="fas fa-cog text-blue-500 mr-2"></i>
              字段属性
            </h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">字段标签</label>
                <input type="text" class="form-input" value="订单金额">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">字段类型</label>
                <select class="form-select">
                  <option>单行文本</option>
                  <option>多行文本</option>
                  <option>数字</option>
                  <option>日期</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">占位符</label>
                <input type="text" class="form-input" value="请输入订单金额">
              </div>
              <div class="flex items-center">
                <input type="checkbox" class="form-checkbox mr-2" checked>
                <label class="text-sm text-gray-700">必填字段</label>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">验证规则</label>
                <select class="form-select">
                  <option>无</option>
                  <option>邮箱格式</option>
                  <option>手机号格式</option>
                  <option>数字范围</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'FormDesigner',
  data() {
    return {
      formTitle: '订单申请表单',
      formDescription: '请填写订单相关信息',
      formFields: [
        {
          label: '订单名称',
          type: 'text',
          required: true,
          placeholder: '请输入订单名称'
        },
        {
          label: '订单金额',
          type: 'number',
          required: true,
          placeholder: '请输入订单金额'
        },
        {
          label: '订单类型',
          type: 'select',
          required: true,
          options: ['普通订单', '紧急订单', 'VIP订单']
        },
        {
          label: '备注信息',
          type: 'textarea',
          required: false,
          placeholder: '请输入备注信息'
        }
      ]
    }
  },
  methods: {
    getFieldComponent(type) {
      const components = {
        text: 'FormText',
        number: 'FormNumber',
        select: 'FormSelect',
        textarea: 'FormTextarea'
      }
      return components[type] || 'FormText'
    }
  },
  components: {
    FormText: {
      template: '<input type="text" :placeholder="field.placeholder" class="form-input">',
      props: ['field']
    },
    FormNumber: {
      template: '<input type="number" :placeholder="field.placeholder" class="form-input">',
      props: ['field']
    },
    FormSelect: {
      template: `
        <select class="form-select">
          <option v-for="option in field.options" :key="option" :value="option">{{ option }}</option>
        </select>
      `,
      props: ['field']
    },
    FormTextarea: {
      template: '<textarea :placeholder="field.placeholder" class="form-textarea" rows="3"></textarea>',
      props: ['field']
    }
  }
}
</script>

<style scoped>
.component-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: grab;
  transition: all 0.2s;
  border: 1px solid #e5e7eb;
}

.component-item:hover {
  background: #f3f4f6;
  border-color: #3b82f6;
}

.component-item i {
  color: #6b7280;
  width: 16px;
}

.form-canvas {
  min-height: 600px;
  background: #fafbfc;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  padding: 24px;
}

.form-title-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  outline: none;
}

.form-title-input::placeholder {
  color: #9ca3af;
}

.form-description-input {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #6b7280;
  outline: none;
  resize: none;
}

.form-description-input::placeholder {
  color: #9ca3af;
}

.form-fields {
  margin-top: 24px;
}

.form-field {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.2s;
}

.form-field:hover {
  border-color: #3b82f6;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.field-label {
  font-weight: 600;
  color: #374151;
}

.field-actions {
  display: flex;
  gap: 4px;
}

.field-action-btn {
  padding: 4px 8px;
  border: none;
  background: transparent;
  color: #9ca3af;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s;
}

.field-action-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.field-input {
  margin-bottom: 8px;
}

.field-settings {
  display: flex;
  gap: 8px;
}

.setting-item {
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 2px 6px;
  border-radius: 4px;
}

.add-field-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 16px;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  color: #9ca3af;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 16px;
}

.add-field-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}
</style>
