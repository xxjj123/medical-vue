// 导出该模块路由
export default [
    /* pacs-相关路由 -----start*/
    {
        title: 'DICOM源数据-管理页',
        name: 'manageDicom',
        path: 'manageDicom',
        component: () => import('./index.vue'),
        meta: {
            name: 'manageDicom',
            keepAlive: false
        }
    },



    /* pacs-相关路由 -----end*/
];