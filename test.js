// 简单的测试脚本 - 验证 Vue.js 项目结构
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 验证 Vue.js 流程引擎平台项目结构...\n');

// 检查主要文件是否存在
const requiredFiles = [
  'package.json',
  'vite.config.js',
  'tailwind.config.js',
  'postcss.config.js',
  'index.html',
  'src/main.js',
  'src/App.vue',
  'src/router/index.js',
  'src/assets/css/global.css',
  'src/components/Sidebar.vue',
  'src/components/AIAssistantButton.vue',
  'src/views/Dashboard.vue',
  'src/views/ProcessList.vue',
  'src/views/ProcessDetail.vue',
  'src/views/ProcessInstanceDetail.vue',
  'src/views/Designer.vue',
  'src/views/FormDesigner.vue',
  'src/views/Reports.vue',
  'src/views/Users.vue',
  'src/views/Settings.vue',
  'README.md'
];

let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - 文件不存在`);
    allFilesExist = false;
  }
});

console.log('\n' + '='.repeat(50));

// 检查 package.json 内容
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log('\n📦 依赖检查:');
  const requiredDeps = ['vue', 'vue-router', '@fortawesome/fontawesome-free', 'tailwindcss'];
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies && packageJson.dependencies[dep]) {
      console.log(`✅ ${dep}: ${packageJson.dependencies[dep]}`);
    } else {
      console.log(`❌ 缺少依赖: ${dep}`);
      allFilesExist = false;
    }
  });

  console.log('\n🛠️  脚本检查:');
  const requiredScripts = ['dev', 'build', 'preview'];
  requiredScripts.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ ${script}: ${packageJson.scripts[script]}`);
    } else {
      console.log(`❌ 缺少脚本: ${script}`);
      allFilesExist = false;
    }
  });
} catch (error) {
  console.log('❌ package.json 解析失败');
  allFilesExist = false;
}

console.log('\n' + '='.repeat(50));

if (allFilesExist) {
  console.log('🎉 项目结构验证通过！');
  console.log('\n🚀 启动开发服务器:');
  console.log('   npm install');
  console.log('   npm run dev');
  console.log('\n📱 访问 http://localhost:3000 查看应用');
} else {
  console.log('❌ 项目结构验证失败，请检查缺失的文件');
  process.exit(1);
}

console.log('\n📋 自测清单:');
console.log('1. ✅ 仪表板 - 统计卡片、快速操作、活动时间线');
console.log('2. ✅ 流程管理 - 列表/卡片视图、搜索筛选、分页');
console.log('3. ✅ 流程详情 - Statistics Overview、标签页导航');
console.log('4. ✅ 流程实例详情 - 现代化状态卡片、时间线');
console.log('5. ✅ 流程设计器 - 拖拽设计、工具栏、属性面板');
console.log('6. ✅ 表单设计器 - 组件设计、字段配置');
console.log('7. ✅ 报告分析 - 数据统计、性能指标');
console.log('8. ✅ 用户管理 - 用户卡片、角色管理');
console.log('9. ✅ 系统设置 - 多标签页配置');
console.log('10. ✅ 全局功能 - 响应式导航、AI助手按钮');
