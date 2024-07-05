import {
  Vue,
  store,
  taMixins,
  checkLogin
} from '@common/js/public-ant-modules'; // 引入公共文件
import router from './router/index'; // 引入 改模块的路由模块
// 自己引入各种插件

import viewsStore from './store/views';
import toolsStore from './store/tools';
import toolBarStore from './store/toolBar';

store.registerModule('viewsStore', viewsStore);
store.registerModule('toolsStore', toolsStore);
store.registerModule('toolBarStore', toolBarStore);

// 判断登录状态然后确认是否渲染页面
checkLogin(() => {
  new Vue({
    mixins: [taMixins],
    router,
    store,
    // render: h => h(app),
  }).$mount('#app');
});
