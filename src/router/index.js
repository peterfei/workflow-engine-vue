import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '@/views/Dashboard.vue'
import ProcessList from '@/views/ProcessList.vue'
import ProcessDetail from '@/views/ProcessDetail.vue'
import ProcessInstanceDetail from '@/views/ProcessInstanceDetail.vue'
import Designer from '@/views/Designer.vue'
import FormDesigner from '@/views/FormDesigner.vue'
import Reports from '@/views/Reports.vue'
import Users from '@/views/Users.vue'
import Settings from '@/views/Settings.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: '仪表板 - 流程引擎平台' }
  },
  {
    path: '/process-list',
    name: 'ProcessList',
    component: ProcessList,
    meta: { title: '流程管理 - 流程引擎平台' }
  },
  {
    path: '/process-detail/:id',
    name: 'ProcessDetail',
    component: ProcessDetail,
    meta: { title: '流程详情 - 流程引擎平台' }
  },
  {
    path: '/process-instance-detail/:id',
    name: 'ProcessInstanceDetail',
    component: ProcessInstanceDetail,
    meta: { title: '流程实例详情 - 流程引擎平台' }
  },
  {
    path: '/designer',
    name: 'Designer',
    component: Designer,
    meta: { title: '流程设计器 - 流程引擎平台' }
  },
  {
    path: '/form-designer',
    name: 'FormDesigner',
    component: FormDesigner,
    meta: { title: '表单设计器 - 流程引擎平台' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { title: '报告分析 - 流程引擎平台' }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { title: '用户管理 - 流程引擎平台' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { title: '系统设置 - 流程引擎平台' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 设置页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router
