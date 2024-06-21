import Vue from 'vue'; // 引入vue
import VueRouter from 'vue-router'; // 引入vue路由支持
import routes from './routes'; // 引入路由列表配置

// 使用注册使用路由
Vue.use(VueRouter);
// 定义该模块的路由
const router = new VueRouter({
  routes,
});


// 在路由跳转时存储路由信息
router.beforeEach((to, from, next) => {
  console.log("from===", from, "to", to);
  const previousRouteString = localStorage.getItem('previousRoute')
  if (!previousRouteString) {
    const CurRoute = {
      path: to.path,
      query: to.query,
      meta: to.meta,
    }
    localStorage.setItem('previousRoute', JSON.stringify(CurRoute))
  }
  console.log('上一个路由信息:', Object.keys(from.meta).length)
  if (Object.keys(from.meta).length === 0) {
    next();
  } else {
    const serializableRoute = {
      path: from.path,
      query: from.query,
      meta: from.meta,
    }
    localStorage.setItem('previousRoute', JSON.stringify(serializableRoute))
  }
  next();
})


router.afterEach((to, from, next) => {

})
// 导出该模块路由
export default router;
