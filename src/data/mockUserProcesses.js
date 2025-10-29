/*
  Workflow Engine Vue
  Copyright (c) 2025 peterfei
  Email: peterfeispace@gmail.com
  GitHub: https://github.com/peterfei/workflow-engine-vue
*/

// Mock data for current-user process views

const now = Date.now();
const day = 24 * 60 * 60 * 1000;
const currentUserId = 'u_1001';

const users = [
  { id: 'u_1001', name: '张三' },
  { id: 'u_1002', name: '李四' },
  { id: 'u_1003', name: '王五' },
];

const instances = [
  { id: 'p_2001', title: '请假流程-王五', starterId: 'u_1003', starterName: '王五', startedAt: new Date(now - 7 * day).toISOString(), status: 'running' },
  { id: 'p_2002', title: '报销流程-张三', starterId: 'u_1001', starterName: '张三', startedAt: new Date(now - 3 * day).toISOString(), status: 'completed' },
  { id: 'p_2003', title: '采购流程-李四', starterId: 'u_1002', starterName: '李四', startedAt: new Date(now - 1 * day).toISOString(), status: 'running' },
];

const tasks = [
  // pending for current user
  { id: 't_3001', processId: 'p_2001', title: '部门经理审批', nodeName: '部门经理', assigneeId: currentUserId, assigneeName: '张三', startedAt: new Date(now - 2 * day).toISOString(), status: 'pending' },
  { id: 't_3002', processId: 'p_2003', title: '财务复核', nodeName: '财务', assigneeId: currentUserId, assigneeName: '张三', startedAt: new Date(now - 1 * day).toISOString(), status: 'pending' },
  // completed by current user
  { id: 't_3003', processId: 'p_2002', title: '出纳付款', nodeName: '出纳', assigneeId: currentUserId, assigneeName: '张三', startedAt: new Date(now - 2 * day).toISOString(), completedAt: new Date(now - 1 * day).toISOString(), status: 'completed' },
  // others' tasks
  { id: 't_3004', processId: 'p_2001', title: '人事登记', nodeName: '人事', assigneeId: 'u_1002', assigneeName: '李四', startedAt: new Date(now - 1 * day).toISOString(), status: 'pending' },
];

export function getMyPendingTasks(userId = currentUserId) {
  return tasks.filter(t => t.assigneeId === userId && t.status === 'pending');
}

export function getMyProcessedTasks(userId = currentUserId) {
  return tasks.filter(t => t.assigneeId === userId && t.status === 'completed');
}

export function getMyInitiatedProcesses(userId = currentUserId) {
  return instances.filter(p => p.starterId === userId);
}

export function getAllMockUsers() {
  return users.slice();
}

export function getAllMockInstances() {
  return instances.slice();
}

export function getAllMockTasks() {
  return tasks.slice();
}
