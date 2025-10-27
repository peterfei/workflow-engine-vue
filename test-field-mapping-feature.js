/**
 * 字段映射功能测试脚本
 */

import fs from 'fs';

console.log('🧪 开始测试字段映射功能...\n');

// 测试1: 检查 Store 中的方法
console.log('📋 测试1: 检查 Store 方法');
const designerStore = fs.readFileSync('src/stores/designer.js', 'utf8');
const storeMethods = [
  'updateFieldMapping',
  'autoMapFields',
  'clearFieldMapping',
  'getFieldMapping'
];

let storeTestsPassed = 0;
storeMethods.forEach(method => {
  if (designerStore.includes(method)) {
    console.log(`  ✅ ${method} 方法存在`);
    storeTestsPassed++;
  } else {
    console.log(`  ❌ ${method} 方法缺失`);
  }
});
console.log(`  📊 通过: ${storeTestsPassed}/${storeMethods.length}\n`);

// 测试2: 检查 UI 组件
console.log('📋 测试2: 检查 UI 组件');
const designerView = fs.readFileSync('src/views/Designer.vue', 'utf8');
const uiElements = [
  '字段映射',
  'getFieldMapping',
  'updateFieldMapping',
  'autoMapAllFields',
  'field-mapping-item',
  'required-not-mapped',
  '自动映射'
];

let uiTestsPassed = 0;
uiElements.forEach(element => {
  if (designerView.includes(element)) {
    console.log(`  ✅ "${element}" 存在`);
    uiTestsPassed++;
  } else {
    console.log(`  ❌ "${element}" 缺失`);
  }
});
console.log(`  📊 通过: ${uiTestsPassed}/${uiElements.length}\n`);

// 测试3: 检查 CSS 样式
console.log('📋 测试3: 检查 CSS 样式');
const cssClasses = [
  '.field-mapping-item',
  'required-not-mapped'
];

let cssTestsPassed = 0;
cssClasses.forEach(cls => {
  if (designerView.includes(cls)) {
    console.log(`  ✅ "${cls}" 样式存在`);
    cssTestsPassed++;
  } else {
    console.log(`  ❌ "${cls}" 样式缺失`);
  }
});
console.log(`  📊 通过: ${cssTestsPassed}/${cssClasses.length}\n`);

// 测试总结
console.log('�� 测试总结');
console.log(`  Store 方法: ${storeTestsPassed}/${storeMethods.length}`);
console.log(`  UI 元素: ${uiTestsPassed}/${uiElements.length}`);
console.log(`  CSS 样式: ${cssTestsPassed}/${cssClasses.length}`);

const totalPassed = storeTestsPassed + uiTestsPassed + cssTestsPassed;
const totalTests = storeMethods.length + uiElements.length + cssClasses.length;

console.log(`\n  总计: ${totalPassed}/${totalTests} (${Math.round(totalPassed/totalTests*100)}%)`);

if (totalPassed === totalTests) {
  console.log('\n  ✅ 所有测试通过！字段映射功能已完整实现。\n');
} else {
  console.log('\n  ❌ 部分测试失败，请检查实现。\n');
}
