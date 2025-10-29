// Demo approval instance: 我的审核 -> 总经理审核 -> 结束

const STORAGE_KEY = 'demo_p_9001_state'
const currentUserId = 'u_1001' // 张三
const gmUserId = 'u_1999' // 总经理（mock）

function initialState() {
  return {
    id: 'demo_p_9001',
    title: '演示审批流程',
    status: 'running', // running | completed | terminated
    activeNode: '我的审核',
    assigneeId: currentUserId,
    history: []
  }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : initialState()
  } catch (e) {
    return initialState()
  }
}

function save(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function getDemoState() {
  return load()
}

export function resetDemoState() {
  const s = initialState()
  save(s)
  return s
}

export function approve(asUserId = currentUserId, comment = '') {
  const s = load()
  if (s.status !== 'running') return s
  const now = new Date().toISOString()

  if (s.activeNode === '我的审核' && asUserId === currentUserId) {
    s.history.push({ node: '我的审核', action: 'approve', userId: asUserId, at: now, comment })
    s.activeNode = '总经理审核'
    s.assigneeId = gmUserId
    save(s)
    return s
  }
  if (s.activeNode === '总经理审核' && asUserId === gmUserId) {
    s.history.push({ node: '总经理审核', action: 'approve', userId: asUserId, at: now, comment })
    s.status = 'completed'
    s.assigneeId = null
    s.activeNode = '结束'
    save(s)
    return s
  }
  return s
}

export function reject(asUserId = currentUserId, reason = '') {
  const s = load()
  if (s.status !== 'running') return s
  const now = new Date().toISOString()
  s.history.push({ node: s.activeNode, action: 'reject', userId: asUserId, at: now, reason })
  s.status = 'terminated'
  s.assigneeId = null
  save(s)
  return s
}

export const demoActors = {
  currentUserId,
  gmUserId
}
