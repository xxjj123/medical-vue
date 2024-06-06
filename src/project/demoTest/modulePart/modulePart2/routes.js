// 导出该模块路由
export default [
  {
    title: '项目模块实例part 2',
    name: 'modulePart2',
    path: 'modulePart2',
    component: () => import('./demoTestModulePart2.vue'),
  },
];
