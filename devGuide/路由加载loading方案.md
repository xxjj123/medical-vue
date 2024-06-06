# 路由异步加载添加loading方案

## 步骤

1. 添加资源
项目中添加`routeLoading.js`到`src/common/js/util`文件夹下
2. 引用资源
在`public-ant.js`以及`public-ant-modules`中引入资源

```js
// 引入路由蒙层
import('./util/routeLoading').then(({routeLoading}) => {
  window.routeLoading = routeLoading
})
```

3 . 在异步路由中配置


```js
// 没有配置路由loading
export default [
  {
    title: '组织机构管理',
    name: 'orgManagement',
    path: 'orgManagement',
    component: ()=>() => import( './orgManagement.vue'),
  
]
```
修改为
```js
// 配置路由loading
export default [
  {
    title: '组织机构管理',
    name: 'orgManagement',
    path: 'orgManagement',
    component: resolve => {
      routeLoading.show()// 加载时开启loading
      require(['./orgManagement.vue'], routeLoading.resolve(resolve))// 路由懒加载
    },
  }
]
```
