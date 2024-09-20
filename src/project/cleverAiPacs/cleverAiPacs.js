import { EventBus } from "./event-bus";
import {
  Vue,
  store,
  taMixins,
  checkLogin,
} from "@common/js/public-ant-modules"; // 引入公共文件
import router from "./router/index"; // 引入 改模块的路由模块
// 自己引入各种插件

import viewsStore from "./store/views";
import toolsStore from "./store/tools";
import toolBarStore from "./store/toolBar";
import viewInitStore from "./store/viewInit";
import picViewStore from "./store/picView"
import view3DStore from "./store/view3D";

store.registerModule("viewsStore", viewsStore);
store.registerModule("toolsStore", toolsStore);
store.registerModule("toolBarStore", toolBarStore);
store.registerModule("viewInitStore", viewInitStore);
store.registerModule("picViewStore", picViewStore);

store.registerModule("view3DStore", view3DStore);
import "vue-bus";

import * as api from "@/api/center-ut";

import sUtil from "@/assets/js/utils";

// 判断登录状态然后确认是否渲染页面
checkLogin(() => {
  new Vue({
    mixins: [taMixins],
    router,
    store,
    beforeCreate() {
      Vue.prototype.$api = api;
      window.sUtil = sUtil;
      Vue.prototype.$ut = sUtil;
      Vue.prototype.$bus = EventBus;
    },
    // render: h => h(app),
  }).$mount("#app");
});
