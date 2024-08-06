// 导出该模块路由
export default [{
  title: '项目模块实例 hellotest1',
  name: 'hellotest1',
  path: 'hellotest1',
  component: () => import('./demoTestModulePart2.vue'),
  meta: {
    name: 'hellotest',
    keepAlive: false
  }
}, ];