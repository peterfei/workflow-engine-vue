<template>
  <div>
    <!-- 页面头部 -->
    <header class="page-header">
      <div>
        <div class="breadcrumb">
          <div class="breadcrumb-item">
            <i class="fas fa-clipboard-list"></i>
            <router-link to="/forms">表单管理</router-link>
          </div>
          <span class="breadcrumb-separator"><i class="fas fa-chevron-right"></i></span>
          <div class="breadcrumb-item">
            <span class="breadcrumb-current">{{ currentFilterName }}</span>
          </div>
        </div>
        <h1 class="page-title">{{ currentFilterName }}</h1>
        <p class="page-subtitle">共 {{ totalCount }} 个表单</p>
      </div>
      <div class="flex items-center gap-3">
        <button class="btn btn-secondary" @click="$router.go(-1)">
          <i class="fas fa-arrow-left"></i>
          返回
        </button>
        <button class="btn btn-secondary">
          <i class="fas fa-file-export"></i>
          导出
        </button>
        <button class="btn btn-primary" @click="$router.push('/forms/new')">
          <i class="fas fa-plus"></i>
          创建表单
        </button>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="p-6">
      <!-- 搜索和筛选栏 -->
      <div class="card mb-6" style="padding: 20px;">
        <div class="search-filter-row" style="padding: 0;">
          <!-- 搜索框 -->
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input
              type="text"
              placeholder="搜索表单名称、描述..."
              v-model="searchQuery"
              @input="handleSearch"
            >
          </div>

          <!-- 右侧操作 -->
          <div class="filter-actions">
            <!-- 视图切换 -->
            <div class="view-toggle">
              <button
                class="view-toggle-btn"
                :class="{ active: viewMode === 'card' }"
                @click="switchView('card')"
              >
                <i class="fas fa-th-large"></i>
              </button>
              <button
                class="view-toggle-btn"
                :class="{ active: viewMode === 'list' }"
                @click="switchView('list')"
              >
                <i class="fas fa-list"></i>
              </button>
            </div>

            <!-- 排序 -->
            <select class="form-select sort-select" v-model="sortBy" @change="handleSort">
              <option value="name-asc">名称 A-Z</option>
              <option value="name-desc">名称 Z-A</option>
              <option value="category">按分类</option>
              <option value="fields">字段数量</option>
            </select>

            <!-- 高级筛选按钮 -->
            <button class="btn btn-secondary" @click="showAdvancedFilters = !showAdvancedFilters">
              <i class="fas fa-filter"></i>
              筛选
            </button>
          </div>
        </div>

        <!-- 快速筛选标签 -->
        <div class="flex items-center gap-2 mt-4 flex-wrap">
          <span class="text-sm text-gray-600">快速筛选：</span>
          <button
            v-for="category in categories"
            :key="category"
            @click="filterByCategory(category)"
            :class="[
              'filter-tab',
              { 'active': currentFilter === category }
            ]"
          >
            {{ category }}
          </button>
          <button
            @click="filterByCategory('全部')"
            :class="[
              'filter-tab',
              { 'active': currentFilter === '全部' }
            ]"
          >
            全部
          </button>
        </div>

        <!-- 高级筛选面板 -->
        <div v-if="showAdvancedFilters" class="advanced-filters mt-4 pt-4 border-t">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">分类</label>
              <select class="form-select" v-model="advancedFilters.category">
                <option value="">全部分类</option>
                <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">字段数量</label>
              <select class="form-select" v-model="advancedFilters.fieldCount">
                <option value="">不限</option>
                <option value="1-5">1-5个字段</option>
                <option value="6-10">6-10个字段</option>
                <option value="10+">10个以上字段</option>
              </select>
            </div>
            <div class="flex items-end">
              <button class="btn btn-secondary w-full" @click="applyAdvancedFilters">
                <i class="fas fa-check"></i>
                应用筛选
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 表单列表 - 卡片视图 -->
      <div v-if="viewMode === 'card'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="form in filteredForms"
          :key="form.id"
          class="card hover:shadow-xl transition-all duration-300 cursor-pointer"
          @click="viewForm(form)"
        >
          <div class="p-6">
            <!-- 表单头部 -->
            <div class="flex items-start justify-between mb-4">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                    {{ form.category }}
                  </span>
                  <span v-if="form.id.startsWith('custom')" class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                    自定义
                  </span>
                </div>
                <h3 class="text-lg font-semibold text-gray-900 mb-2">
                  {{ form.name }}
                </h3>
                <p class="text-sm text-gray-600 line-clamp-2">
                  {{ form.description }}
                </p>
              </div>
            </div>

            <!-- 表单信息 -->
            <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
              <div class="flex items-center gap-4">
                <span>
                  <i class="fas fa-list mr-1"></i>
                  {{ form.fields.length }} 个字段
                </span>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center gap-2 pt-4 border-t">
              <button
                @click.stop="editForm(form)"
                class="flex-1 btn btn-sm btn-secondary"
              >
                <i class="fas fa-edit mr-1"></i>
                编辑
              </button>
              <button
                @click.stop="copyForm(form)"
                class="flex-1 btn btn-sm btn-secondary"
              >
                <i class="fas fa-copy mr-1"></i>
                复制
              </button>
              <button
                v-if="form.id.startsWith('custom')"
                @click.stop="deleteForm(form)"
                class="btn btn-sm btn-secondary text-red-600 hover:bg-red-50"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="filteredForms.length === 0" class="col-span-full">
          <div class="text-center py-12">
            <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
            <h3 class="text-lg font-semibold text-gray-900 mb-2">暂无表单</h3>
            <p class="text-gray-600 mb-6">开始创建您的第一个表单吧</p>
            <button class="btn btn-primary" @click="$router.push('/forms/new')">
              <i class="fas fa-plus mr-2"></i>
              创建表单
            </button>
          </div>
        </div>
      </div>

      <!-- 表单列表 - 列表视图 -->
      <div v-if="viewMode === 'list'" class="card">
        <table class="data-table">
          <thead>
            <tr>
              <th>表单名称</th>
              <th>分类</th>
              <th>描述</th>
              <th>字段数量</th>
              <th>类型</th>
              <th class="text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="form in filteredForms" :key="form.id" @click="viewForm(form)" class="cursor-pointer hover:bg-gray-50">
              <td>
                <div class="font-medium text-gray-900">{{ form.name }}</div>
              </td>
              <td>
                <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  {{ form.category }}
                </span>
              </td>
              <td>
                <div class="text-sm text-gray-600 max-w-md truncate">
                  {{ form.description }}
                </div>
              </td>
              <td>
                <span class="text-gray-900">{{ form.fields.length }} 个</span>
              </td>
              <td>
                <span v-if="form.id.startsWith('custom')" class="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                  自定义
                </span>
                <span v-else class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                  系统
                </span>
              </td>
              <td>
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click.stop="editForm(form)"
                    class="btn btn-sm btn-secondary"
                    title="编辑"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button
                    @click.stop="copyForm(form)"
                    class="btn btn-sm btn-secondary"
                    title="复制"
                  >
                    <i class="fas fa-copy"></i>
                  </button>
                  <button
                    v-if="form.id.startsWith('custom')"
                    @click.stop="deleteForm(form)"
                    class="btn btn-sm btn-secondary text-red-600 hover:bg-red-50"
                    title="删除"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 空状态 -->
        <div v-if="filteredForms.length === 0" class="text-center py-12">
          <i class="fas fa-inbox text-6xl text-gray-300 mb-4"></i>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">暂无表单</h3>
          <p class="text-gray-600 mb-6">开始创建您的第一个表单吧</p>
          <button class="btn btn-primary" @click="$router.push('/forms/new')">
            <i class="fas fa-plus mr-2"></i>
            创建表单
          </button>
        </div>
      </div>
    </main>

    <!-- 查看表单详情模态框 -->
    <Modal v-model="showFormDetailModal" size="large">
      <template #title>表单详情 - {{ selectedForm?.name }}</template>
      <template #content>
        <div v-if="selectedForm" class="space-y-4">
          <div>
            <h4 class="font-semibold text-gray-900 mb-2">基本信息</h4>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <span class="text-sm text-gray-600">表单名称：</span>
                <span class="text-sm font-medium">{{ selectedForm.name }}</span>
              </div>
              <div>
                <span class="text-sm text-gray-600">分类：</span>
                <span class="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
                  {{ selectedForm.category }}
                </span>
              </div>
              <div class="col-span-2">
                <span class="text-sm text-gray-600">描述：</span>
                <span class="text-sm">{{ selectedForm.description }}</span>
              </div>
            </div>
          </div>
          
          <div class="border-t pt-4">
            <h4 class="font-semibold text-gray-900 mb-3">表单字段（{{ selectedForm.fields.length }}）</h4>
            <div class="space-y-2">
              <div
                v-for="(field, index) in selectedForm.fields"
                :key="index"
                class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div class="flex items-center gap-3">
                  <span class="text-gray-900 font-medium">{{ index + 1 }}.</span>
                  <div>
                    <div class="text-sm font-medium text-gray-900">
                      {{ field.name }}
                      <span v-if="field.required" class="text-red-500 ml-1">*</span>
                    </div>
                    <div class="text-xs text-gray-500">{{ getFieldTypeLabel(field.type) }}</div>
                  </div>
                </div>
                <div class="text-xs text-gray-500">
                  <span v-if="field.options && field.options.length > 0">
                    {{ field.options.length }} 个选项
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4 border-t">
            <button class="btn btn-primary flex-1" @click="editForm(selectedForm)">
              <i class="fas fa-edit mr-2"></i>
              编辑表单
            </button>
            <button class="btn btn-secondary" @click="showFormDetailModal = false">
              关闭
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getAllFormsIncludingCustom, getCategories, getCustomForms } from '@/data/mockForms'
import Modal from '@/components/common/Modal.vue'

const router = useRouter()

// 数据
const allForms = ref([])
const categories = ref([])
const searchQuery = ref('')
const currentFilter = ref('全部')
const viewMode = ref('card')
const sortBy = ref('name-asc')
const showAdvancedFilters = ref(false)
const advancedFilters = ref({
  category: '',
  fieldCount: ''
})
const showFormDetailModal = ref(false)
const selectedForm = ref(null)

// 计算属性
const currentFilterName = computed(() => {
  return currentFilter.value
})

const filteredForms = computed(() => {
  let forms = [...allForms.value]

  // 应用搜索
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    forms = forms.filter(form =>
      form.name.toLowerCase().includes(query) ||
      form.description.toLowerCase().includes(query)
    )
  }

  // 应用分类筛选
  if (currentFilter.value !== '全部') {
    forms = forms.filter(form => form.category === currentFilter.value)
  }

  // 应用高级筛选
  if (advancedFilters.value.category) {
    forms = forms.filter(form => form.category === advancedFilters.value.category)
  }

  if (advancedFilters.value.fieldCount) {
    forms = forms.filter(form => {
      const count = form.fields.length
      switch (advancedFilters.value.fieldCount) {
        case '1-5': return count >= 1 && count <= 5
        case '6-10': return count >= 6 && count <= 10
        case '10+': return count > 10
        default: return true
      }
    })
  }

  // 应用排序
  switch (sortBy.value) {
    case 'name-asc':
      forms.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'))
      break
    case 'name-desc':
      forms.sort((a, b) => b.name.localeCompare(a.name, 'zh-CN'))
      break
    case 'category':
      forms.sort((a, b) => a.category.localeCompare(b.category, 'zh-CN'))
      break
    case 'fields':
      forms.sort((a, b) => b.fields.length - a.fields.length)
      break
  }

  return forms
})

const totalCount = computed(() => filteredForms.value.length)

// 方法
const loadForms = () => {
  allForms.value = getAllFormsIncludingCustom()
  categories.value = getCategories()
}

const handleSearch = () => {
  // 搜索逻辑已在 computed 中处理
}

const handleSort = () => {
  // 排序逻辑已在 computed 中处理
}

const switchView = (mode) => {
  viewMode.value = mode
}

const filterByCategory = (category) => {
  currentFilter.value = category
}

const applyAdvancedFilters = () => {
  // 筛选逻辑已在 computed 中处理
  showAdvancedFilters.value = false
}

const viewForm = (form) => {
  selectedForm.value = form
  showFormDetailModal.value = true
}

const editForm = (form) => {
  // 跳转到编辑页面
  router.push(`/forms/edit/${form.id}`)
}

const copyForm = (form) => {
  // 复制表单并跳转到编辑页面
  const newForm = {
    ...form,
    id: `custom-${Date.now()}`,
    name: `${form.name} (副本)`,
    category: '自定义表单'
  }
  
  // 保存到 localStorage
  const customForms = getCustomForms()
  customForms.push(newForm)
  localStorage.setItem('formDesigner_customForms', JSON.stringify(customForms))
  
  // 刷新列表
  loadForms()
  
  // 跳转到编辑页面
  router.push(`/forms/edit/${newForm.id}`)
}

const deleteForm = (form) => {
  if (confirm(`确定要删除表单"${form.name}"吗？`)) {
    const customForms = getCustomForms()
    const index = customForms.findIndex(f => f.id === form.id)
    if (index > -1) {
      customForms.splice(index, 1)
      localStorage.setItem('formDesigner_customForms', JSON.stringify(customForms))
      loadForms()
    }
  }
}

const getFieldTypeLabel = (type) => {
  const typeMap = {
    text: '单行文本',
    textarea: '多行文本',
    number: '数字',
    date: '日期',
    datetime: '日期时间',
    select: '下拉选择',
    radio: '单选',
    checkbox: '多选',
    boolean: '布尔值'
  }
  return typeMap[type] || type
}

// 生命周期
onMounted(() => {
  loadForms()
})
</script>

<style scoped>
/* 面包屑导航样式 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
}

.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--gray-600);
}

.breadcrumb-item a {
  color: var(--primary-600);
  text-decoration: none;
}

.breadcrumb-item a:hover {
  color: var(--primary-700);
}

.breadcrumb-separator {
  color: var(--gray-400);
  font-size: 12px;
}

.breadcrumb-current {
  color: var(--gray-900);
  font-weight: 500;
}

.search-filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 300px;
}

.search-box i {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
}

.search-box input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-toggle {
  display: flex;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.view-toggle-btn {
  padding: 8px 12px;
  border: none;
  background: white;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.view-toggle-btn:hover {
  background: #f3f4f6;
}

.view-toggle-btn.active {
  background: #3b82f6;
  color: white;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
}

.filter-tab {
  padding: 6px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: white;
  color: #6b7280;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.filter-tab.active {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th {
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: #6b7280;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.data-table td {
  padding: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.data-table tbody tr:hover {
  background: #f9fafb;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

