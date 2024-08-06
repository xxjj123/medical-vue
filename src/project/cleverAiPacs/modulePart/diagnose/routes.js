// 导出该模块路由
export default [
  /* pacs-相关路由 -----start*/
  {
    title: '诊断分析-控制台',
    name: 'diagnose',
    path: 'diagnose',
    component: () => import('./index.vue'),
    meta: {
      name: '病变分析',
      keepAlive: false
    }
  },



  /* pacs-相关路由 -----end*/
];
