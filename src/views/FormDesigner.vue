<!--
  Workflow Engine Vue
  Copyright (c) 2025 peterfei
  Email: peterfeispace@gmail.com
  GitHub: https://github.com/peterfei/workflow-engine-vue
-->

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面头部 -->
    <header class="page-header">
      <div class="flex items-center justify-between w-full">
        <div>
          <h1 class="page-title">{{ formId ? '编辑表单' : '创建表单' }}</h1>
          <p class="page-subtitle">{{ formId ? '修改现有表单' : '创建新的业务表单' }}</p>
        </div>
        <div class="flex items-center gap-3">
          <button class="btn btn-secondary" @click="loadTemplates">
            <i class="fas fa-folder-open mr-1"></i>
            加载模板
          </button>
          <button class="btn btn-primary" @click="saveForm">
            <i class="fas fa-save mr-1"></i>
            保存
          </button>
          <button class="btn btn-secondary" @click="exportForm">
            <i class="fas fa-download mr-1"></i>
            导出
          </button>
          <button class="btn btn-secondary" @click="importForm">
            <i class="fas fa-upload mr-1"></i>
            导入
          </button>
          <button class="btn btn-secondary" @click="previewForm">
            <i class="fas fa-eye mr-1"></i>
            预览
          </button>
          <button class="btn btn-secondary" @click="router.push('/forms')">
            <i class="fas fa-arrow-left mr-1"></i>
            返回列表
          </button>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 左侧工具栏 -->
        <div class="lg:col-span-1 space-y-4">
          <!-- 布局选择 -->
          <div class="card p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
              <i class="fas fa-th text-blue-500 mr-2"></i>
              布局模式
            </h3>
            <div class="grid grid-cols-2 gap-2">
              <button 
                v-for="layout in layoutModes" 
                :key="layout.value"
                @click="selectLayout(layout.value)"
                :class="[
                  'flex items-center justify-center gap-2 px-3 py-2 rounded-lg border-2 transition-all',
                  currentLayout === layout.value 
                    ? 'border-blue-500 bg-blue-50 text-blue-700' 
                    : 'border-gray-200 hover:border-blue-300'
                ]">
                <i :class="layout.icon"></i>
                <span class="text-sm">{{ layout.label }}</span>
              </button>
            </div>
          </div>

          <!-- 表单组件 -->
          <div class="card p-4">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
              <i class="fas fa-wpforms text-blue-500 mr-2"></i>
              表单组件
            </h3>
            <div class="space-y-2">
              <div 
                v-for="comp in components" 
                :key="comp.type"
                class="component-item"
                draggable="true"
                @dragstart="onDragStart($event, comp.type)">
                <i :class="comp.icon"></i>
                <span>{{ comp.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 中间表单画布 -->
        <div class="lg:col-span-2">
          <div class="card p-6">
            <div class="form-canvas" @drop="onDrop" @dragover.prevent>
              <!-- 表单头部 -->
              <div class="form-header mb-6">
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
                  rows="2"
                ></textarea>
              </div>

              <!-- 表单字段 -->
              <div class="form-fields" :class="layoutClass">
                <div 
                  v-for="(field, index) in formFields" 
                  :key="field.id"
                  class="form-field"
                  @click="selectField(field)"
                  :class="{ 'selected': selectedField?.id === field.id }">
                  <div class="field-header">
                    <label class="field-label">
                      {{ field.label }}
                      <span v-if="field.required" class="text-red-500 ml-1">*</span>
                    </label>
                    <div class="field-actions">
                      <button 
                        class="field-action-btn"
                        @click.stop="editField(field)">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        class="field-action-btn"
                        @click.stop="deleteField(field.id)">
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <div class="field-input">
                    <input 
                      v-if="field.type === 'text' || field.type === 'number'"
                      :type="field.type"
                      class="designer-input"
                      :placeholder="field.placeholder || `请输入${field.label}`"
                      readonly
                    />
                    <input 
                      v-else-if="field.type === 'date'"
                      type="date"
                      class="designer-input"
                      readonly
                    />
                    <textarea 
                      v-else-if="field.type === 'textarea'"
                      class="designer-input"
                      :placeholder="field.placeholder || `请输入${field.label}`"
                      rows="3"
                      readonly
                    ></textarea>
                    <select 
                      v-else-if="field.type === 'select'"
                      class="designer-input"
                      disabled
                    >
                      <option value="">{{ field.placeholder || '请选择' }}</option>
                      <option v-for="(option, idx) in field.options" :key="idx" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                    <input 
                      v-else
                      type="text"
                      class="designer-input"
                      :placeholder="field.placeholder || `请输入${field.label}`"
                      readonly
                    />
                  </div>
                </div>

                <!-- 添加字段按钮 -->
                <div class="add-field-btn" @click="showAddField = true">
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
            <h3 class="text-lg font-semibold text-gray-800 mb-3">
              <i class="fas fa-cog text-blue-500 mr-2"></i>
              字段属性
            </h3>
            <div v-if="selectedField" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">字段类型</label>
                <input 
                  type="text" 
                  class="form-input bg-gray-100"
                  :value="selectedField.type"
                  readonly>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">字段标签</label>
                <input 
                  type="text" 
                  class="form-input"
                  v-model="selectedField.label">
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">占位符</label>
                <input 
                  type="text" 
                  class="form-input"
                  v-model="selectedField.placeholder">
              </div>
              <div class="flex items-center">
                <input 
                  type="checkbox" 
                  class="form-checkbox mr-2"
                  v-model="selectedField.required">
                <label class="text-sm text-gray-700">必填字段</label>
              </div>

              <!-- 下拉选项配置（仅select类型显示） -->
              <div v-if="selectedField.type === 'select'" class="border-t pt-4">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  下拉选项
                  <span class="text-gray-500 text-xs ml-1">({{ (selectedField.options || []).length }}个)</span>
                </label>
                <div class="space-y-2 mb-3">
                  <div 
                    v-for="(option, index) in (selectedField.options || [])" 
                    :key="index"
                    class="flex gap-2 items-center">
                    <input 
                      type="text" 
                      class="form-input flex-1 text-sm"
                      v-model="option.label"
                      placeholder="选项标签">
                    <input 
                      type="text" 
                      class="form-input flex-1 text-sm"
                      v-model="option.value"
                      placeholder="选项值">
                    <button 
                      @click="removeOption(index)"
                      class="btn-icon btn-sm text-red-500 hover:bg-red-50">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
                <button 
                  @click="addOption"
                  class="btn-secondary btn-sm w-full">
                  <i class="fas fa-plus mr-1"></i>
                  添加选项
                </button>
              </div>
            </div>
            <div v-else class="text-center text-gray-500 py-8">
              <i class="fas fa-mouse-pointer text-4xl mb-2"></i>
              <p>请选择字段进行编辑</p>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 模板选择模态框 -->
    <Modal v-model="showTemplateModal">
      <template #title>选择表单模板</template>
      <template #content>
        <div class="space-y-4">
          <div v-for="category in categories" :key="category" class="border-b pb-4 last:border-0">
            <h4 class="font-semibold text-gray-800 mb-3">{{ category }}</h4>
            <div class="grid grid-cols-1 gap-2">
              <button
                v-for="form in getFormsByCategory(category)"
                :key="form.id"
                @click="loadTemplate(form)"
                class="text-left px-4 py-3 rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all">
                <div class="font-medium text-gray-900">{{ form.name }}</div>
                <div class="text-sm text-gray-500 mt-1">{{ form.description }}</div>
                <div class="text-xs text-gray-400 mt-1">{{ form.fields.length }} 个字段</div>
              </button>
            </div>
          </div>
        </div>
      </template>
    </Modal>

    <!-- 预览模态框 -->
    <Modal v-model="showPreviewModal" size="large">
      <template #title>表单预览</template>
      <template #content>
        <div class="form-preview">
          <h2 class="text-2xl font-bold mb-2">{{ formTitle || '表单标题' }}</h2>
          <p class="text-gray-600 mb-6">{{ formDescription || '表单描述' }}</p>
          <div :class="layoutClass">
            <div v-for="(field, index) in formFields" :key="index" class="form-group">
              <label class="block text-sm font-medium mb-2">
                {{ field.label }}
                <span v-if="field.required" class="text-red-500">*</span>
              </label>
              <!-- 文本输入框 -->
              <input 
                v-if="field.type === 'text'"
                type="text"
                :placeholder="field.placeholder || `请输入${field.label}`"
              />
              <!-- 数字输入框 -->
              <input 
                v-else-if="field.type === 'number'"
                type="number"
                :placeholder="field.placeholder || `请输入${field.label}`"
              />
              <!-- 日期选择器 -->
              <input 
                v-else-if="field.type === 'date'"
                type="date"
              />
              <!-- 多行文本 -->
              <textarea 
                v-else-if="field.type === 'textarea'"
                :placeholder="field.placeholder || `请输入${field.label}`"
                rows="3"
              ></textarea>
              <!-- 下拉选择 -->
              <select 
                v-else-if="field.type === 'select'">
                <option value="">{{ field.placeholder || '请选择' }}</option>
                <option v-for="(opt, idx) in field.options" :key="idx" :value="opt.value">
                  {{ opt.label }}
                </option>
              </select>
              <!-- 其他类型 -->
              <input 
                v-else
                type="text"
                :placeholder="field.placeholder || `请输入${field.label}`"
              />
            </div>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getAllForms, saveCustomForm, getAllFormsIncludingCustom, getFormByIdIncludingCustom } from '@/data/mockForms'
import Modal from '@/components/common/Modal.vue'

const route = useRoute()
const router = useRouter()

// 表单数据
const formId = ref(route.params.id || null)
const formTitle = ref('')
const formDescription = ref('')
const formFields = ref([])
const selectedField = ref(null)
const showTemplateModal = ref(false)
const showPreviewModal = ref(false)
let fieldIdCounter = 0

// 布局配置
const currentLayout = ref('single')
const layoutModes = [
  { value: 'single', label: '单列', icon: 'fas fa-align-left' },
  { value: 'double', label: '双列', icon: 'fas fa-columns' },
  { value: 'triple', label: '三列', icon: 'fas fa-th' },
  { value: 'mixed', label: '混合', icon: 'fas fa-th-large' }
]

const layoutClass = computed(() => {
  return {
    'single-column': currentLayout.value === 'single',
    'double-column': currentLayout.value === 'double',
    'triple-column': currentLayout.value === 'triple',
    'mixed-layout': currentLayout.value === 'mixed'
  }
})

// 组件列表
const components = [
  { type: 'text', label: '单行文本', icon: 'fas fa-font' },
  { type: 'textarea', label: '多行文本', icon: 'fas fa-align-left' },
  { type: 'number', label: '数字', icon: 'fas fa-hashtag' },
  { type: 'date', label: '日期', icon: 'fas fa-calendar' },
  { type: 'select', label: '下拉选择', icon: 'fas fa-list' },
  { type: 'radio', label: '单选框', icon: 'fas fa-dot-circle' },
  { type: 'checkbox', label: '复选框', icon: 'fas fa-check-square' }
]

// 表单分类
const allForms = ref([])
const categories = computed(() => {
  const cats = new Set(allForms.value.map(f => f.category))
  return Array.from(cats)
})

// 方法
const selectLayout = (layout) => {
  currentLayout.value = layout
}

const getFormsByCategory = (category) => {
  return allForms.value.filter(f => f.category === category)
}

const loadTemplates = () => {
  showTemplateModal.value = true
}

const loadTemplate = (form) => {
  formTitle.value = form.name
  formDescription.value = form.description
  
  // 将模板字段转换为表单字段，使用 field.name 作为 label
  formFields.value = form.fields.map(field => ({
    id: `field_${++fieldIdCounter}`,
    label: field.name, // 使用 name 作为标签
    type: field.type,
    required: field.required || false,
    placeholder: `请输入${field.name}`,
    options: field.options || [],
    validation: field.validation || {}
  }))
  
  showTemplateModal.value = false
  
  // 显示加载成功提示
  const message = document.createElement('div')
  message.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2'
  message.innerHTML = `<i class="fas fa-check-circle"></i> 已加载模板：${form.name}`
  document.body.appendChild(message)
  
  setTimeout(() => {
    message.style.opacity = '0'
    message.style.transition = 'opacity 0.3s'
    setTimeout(() => message.remove(), 300)
  }, 2000)
}

const selectField = (field) => {
  selectedField.value = field
}

const editField = (field) => {
  selectedField.value = field
}

const deleteField = (id) => {
  const index = formFields.value.findIndex(f => f.id === id)
  if (index > -1) {
    formFields.value.splice(index, 1)
  }
  if (selectedField.value?.id === id) {
    selectedField.value = null
  }
}

// 添加下拉选项
const addOption = () => {
  if (!selectedField.value) return
  if (!selectedField.value.options) {
    selectedField.value.options = []
  }
  selectedField.value.options.push({
    label: `选项${selectedField.value.options.length + 1}`,
    value: `option${selectedField.value.options.length + 1}`
  })
}

// 删除下拉选项
const removeOption = (index) => {
  if (!selectedField.value || !selectedField.value.options) return
  selectedField.value.options.splice(index, 1)
}

const getFieldComponent = (field) => {
  const componentMap = {
    text: 'input',
    textarea: 'textarea',
    number: 'input',
    date: 'input',
    datetime: 'input',
    select: 'select',
    radio: 'select',
    checkbox: 'checkbox',
    boolean: 'input'
  }
  return componentMap[field.type] || 'input'
}

const onDragStart = (event, type) => {
  event.dataTransfer.setData('fieldType', type)
}

const onDrop = (event) => {
  const fieldType = event.dataTransfer.getData('fieldType')
  if (fieldType) {
    const comp = components.find(c => c.type === fieldType)
    if (comp) {
      addField(comp)
    }
  }
}

const addField = (comp) => {
  const field = {
    id: `field_${++fieldIdCounter}`,
    label: comp.label,
    type: comp.type,
    required: false,
    placeholder: `请输入${comp.label}`,
    options: comp.type === 'select' ? [
      { label: '选项1', value: 'option1' },
      { label: '选项2', value: 'option2' },
      { label: '选项3', value: 'option3' }
    ] : []
  }
  formFields.value.push(field)
}

const previewForm = () => {
  showPreviewModal.value = true
}

const exportForm = () => {
  const data = {
    title: formTitle.value,
    description: formDescription.value,
    layout: currentLayout.value,
    fields: formFields.value
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${formTitle.value || 'form'}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const importForm = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json'
  input.onchange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result)
          formTitle.value = data.title
          formDescription.value = data.description
          currentLayout.value = data.layout
          formFields.value = data.fields
        } catch (error) {
          alert('文件格式错误')
        }
      }
      reader.readAsText(file)
    }
  }
  input.click()
}

// 保存和加载功能
const saveForm = () => {
  // 验证表单
  if (!formTitle.value) {
    alert('请输入表单标题')
    return
  }
  
  if (formFields.value.length === 0) {
    alert('请至少添加一个字段')
    return
  }
  
  const data = {
    title: formTitle.value,
    description: formDescription.value,
    layout: currentLayout.value,
    fields: formFields.value,
    savedAt: new Date().toISOString()
  }
  
  try {
    localStorage.setItem('formDesigner_currentForm', JSON.stringify(data))
    
    // 也保存为自定义表单（供流程设计器使用）
    if (formTitle.value && formFields.value.length > 0) {
      // 如果是编辑模式，使用现有 ID；否则生成新 ID
      const saveFormId = formId.value || `custom-${Date.now()}`
      
      const customForm = {
        id: saveFormId,
        name: formTitle.value,
        description: formDescription.value,
        category: '自定义表单',
        fields: formFields.value.map(f => ({
          name: f.label,
          type: f.type,
          required: f.required || false,
          options: f.options || [],
          validation: f.validation || {}
        }))
      }
      saveCustomForm(customForm)
      
      // 如果是新建模式，更新 formId
      if (!formId.value) {
        formId.value = saveFormId
      }
    }
    
    // 显示保存成功提示
    const message = document.createElement('div')
    message.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2'
    message.innerHTML = '<i class="fas fa-check-circle"></i> 表单已保存'
    document.body.appendChild(message)
    
    setTimeout(() => {
      message.style.opacity = '0'
      message.style.transition = 'opacity 0.3s'
      setTimeout(() => message.remove(), 300)
    }, 2000)
  } catch (error) {
    alert('保存失败，请检查浏览器设置')
  }
}

const loadSavedForm = () => {
  try {
    const saved = localStorage.getItem('formDesigner_currentForm')
    if (saved) {
      const data = JSON.parse(saved)
      formTitle.value = data.title || ''
      formDescription.value = data.description || ''
      currentLayout.value = data.layout || 'single'
      formFields.value = data.fields || []
      
      // 恢复 fieldIdCounter
      if (formFields.value.length > 0) {
        const maxId = Math.max(...formFields.value.map(f => {
          const match = f.id?.match(/_(\d+)$/)
          return match ? parseInt(match[1]) : 0
        }))
        fieldIdCounter = maxId
      }
      
      // 显示加载提示
      const message = document.createElement('div')
      message.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2'
      message.innerHTML = '<i class="fas fa-check-circle"></i> 已加载保存的表单'
      document.body.appendChild(message)
      
      setTimeout(() => {
        message.style.opacity = '0'
        message.style.transition = 'opacity 0.3s'
        setTimeout(() => message.remove(), 300)
      }, 2000)
    }
  } catch (error) {
    console.error('加载失败:', error)
  }
}

// 自动保存（每30秒）
let autoSaveTimer = null
const startAutoSave = () => {
  if (autoSaveTimer) clearInterval(autoSaveTimer)
  autoSaveTimer = setInterval(() => {
    if (formFields.value.length > 0 || formTitle.value) {
      saveForm()
    }
  }, 30000) // 30秒自动保存
}

// 加载表单（用于编辑模式）
const loadFormById = () => {
  if (formId.value) {
    const form = getFormByIdIncludingCustom(formId.value)
    if (form) {
      formTitle.value = form.name
      formDescription.value = form.description
      
      // 将表单字段转换为设计器字段
      formFields.value = form.fields.map(field => ({
        id: `field_${++fieldIdCounter}`,
        label: field.name,
        type: field.type,
        required: field.required || false,
        placeholder: `请输入${field.name}`,
        options: field.options || [],
        validation: field.validation || {}
      }))
      
      return true
    }
  }
  return false
}

// 生命周期
onMounted(() => {
  allForms.value = getAllForms()
  
  // 如果是编辑模式，加载指定表单
  if (formId.value) {
    loadFormById()
  } else {
    // 如果是新建模式，尝试加载上次未保存的表单
    loadSavedForm()
  }
  
  startAutoSave()
})
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
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  transition: all 0.2s;
  cursor: pointer;
}

.form-field:hover {
  border-color: #93c5fd;
}

.form-field.selected {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 布局样式 */
.single-column .form-field {
  width: 100%;
}

.double-column {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.triple-column {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.mixed-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
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
  font-size: 14px;
  display: block;
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

/* 设计器输入框样式 */
.designer-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #6b7280;
  background-color: #f9fafb;
  transition: all 0.2s ease;
  cursor: not-allowed;
}

.designer-input:focus {
  outline: none;
  border-color: #9ca3af;
}

.designer-input::placeholder {
  color: #9ca3af;
}

textarea.designer-input {
  resize: vertical;
  min-height: 80px;
}

select.designer-input {
  cursor: not-allowed;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 20px;
  padding-right: 36px;
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
}

.add-field-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

/* 表单预览容器样式 */
.form-preview {
  background: #f9fafb;
  padding: 32px;
  border-radius: 8px;
  min-height: 400px;
}

.form-preview h2 {
  color: #1f2937;
  font-weight: 700;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 12px;
  margin-bottom: 8px;
}

.form-preview > p {
  color: #6b7280;
  margin-bottom: 32px;
}

/* 表单字段卡片样式 */
.form-group {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  height: auto;
}

.double-column .form-group,
.triple-column .form-group {
  min-height: 106px;
}

.form-group:hover {
  border-color: #d1d5db;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
}

/* 字段标签样式 */
.form-group label {
  color: #374151;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  flex-shrink: 0;
}

.form-group label .text-red-500 {
  margin-left: 4px;
  font-size: 16px;
}

/* 字段输入区域 */
.form-group > *:not(label) {
  flex: 1;
}

/* 预览表单输入框样式 */
.form-preview input,
.form-preview textarea,
.form-preview select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #1f2937;
  background-color: #ffffff;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-preview input:not([type="checkbox"]):not([type="radio"]),
.form-preview select {
  height: 42px;
}

/* 确保所有输入框宽度一致 */
.form-preview input[type="date"],
.form-preview input[type="text"],
.form-preview input[type="number"],
.form-preview textarea,
.form-preview select {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
}

/* 确保form-group内部元素宽度一致 */
.form-group input,
.form-group textarea,
.form-group select {
  width: 100% !important;
  box-sizing: border-box !important;
}

.form-preview input:hover,
.form-preview textarea:hover,
.form-preview select:hover {
  border-color: #9ca3af;
}

.form-preview input:focus,
.form-preview textarea:focus,
.form-preview select:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-preview textarea {
  min-height: 80px;
  resize: vertical;
}

.form-preview select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 8px center;
  background-repeat: no-repeat;
  background-size: 20px;
  padding-right: 36px;
}

/* 必填字段左侧边框标识 */
.form-group:has(label .text-red-500) {
  border-left: 3px solid #ef4444;
}

/* 单列布局 */
.single-column {
  display: block;
}

.single-column .form-group {
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 16px;
}

.single-column .form-group:last-child {
  margin-bottom: 0;
}

/* 双列布局 - 网格效果 */
.double-column {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  position: relative;
  align-items: start;
}

.double-column .form-group {
  margin-bottom: 0;
}

.double-column::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent, #d1d5db 10%, #d1d5db 90%, transparent);
  pointer-events: none;
}

/* 三列布局 - 网格效果 */
.triple-column {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  position: relative;
  align-items: start;
}

.triple-column .form-group {
  margin-bottom: 0;
}

.triple-column::before,
.triple-column::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: linear-gradient(to bottom, transparent, #d1d5db 10%, #d1d5db 90%, transparent);
  pointer-events: none;
}

.triple-column::before {
  left: 33.333%;
}

.triple-column::after {
  left: 66.666%;
}

/* 混合布局 - 视觉分组 */
.mixed-layout {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  align-items: start;
}

.mixed-layout .form-group {
  margin-bottom: 0;
}

.mixed-layout .form-group:nth-child(3n+1) {
  grid-column: 1 / -1;
  background: linear-gradient(to right, #f9fafb 0%, white 10%);
}

/* 响应式布局 */
@media (max-width: 768px) {
  .double-column,
  .triple-column,
  .mixed-layout {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .double-column::before,
  .triple-column::before,
  .triple-column::after {
    display: none;
  }

  .form-group {
    max-width: 100%;
    margin-bottom: 0;
  }
}

/* 按钮样式 */
.btn-icon {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
  cursor: pointer;
}

.btn-icon:hover {
  background: #f3f4f6;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 13px;
  border-radius: 6px;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
  cursor: pointer;
  font-weight: 500;
}

.btn-secondary:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
}
</style>
