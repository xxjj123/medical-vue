import {EventBus} from "./event-bus";
import {
  Vue,
  store,
  taMixins,
  checkLogin,
} from "@common/js/public-ant-modules"; // 引入公共文件
import router from "./router/index"; // 引入 改模块的路由模块
// 自己引入各种插件


import viewInitStore from './store/viewInit';
store.registerModule("viewInitStore", viewInitStore);


import toolBarStore from "./store/toolBar";
import view3DStore from "./store/view3D";
import viewReportsStore from './store/reports';




store.registerModule("toolBarStore", toolBarStore);

store.registerModule("view3DStore", view3DStore);
store.registerModule("viewReportsStore", viewReportsStore);


import mprViewStore from "./store/mprView"
import mprToolsStore from "./store/mprTools"
import noduleInfoStore from "./store/noduleInfo"
import pneumoniaInfoStore from "./store/pneumoniaInfo"
import fracInfoStore from "./store/fracInfo"

import spineViewStore from "./store/spineView"
import spineToolsStore from "./store/spineTools"

import lungViewStore from "./store/lungView"
import lungToolsStore from "./store/lungTools"


store.registerModule("mprViewStore", mprViewStore);
store.registerModule("mprToolsStore", mprToolsStore);
store.registerModule("noduleInfoStore", noduleInfoStore);
store.registerModule("pneumoniaInfoStore", pneumoniaInfoStore);
store.registerModule("fracInfoStore", fracInfoStore);
store.registerModule("spineViewStore", spineViewStore);
store.registerModule("spineToolsStore", spineToolsStore);

store.registerModule("lungViewStore", lungViewStore);
store.registerModule("lungToolsStore", lungToolsStore);





import "vue-bus";

import * as api from "@/api/center-ut";

import sUtil from "@/assets/js/utils";


import VueClipboard from 'vue-clipboard2';

Vue.use(VueClipboard);

import Print from 'vue-print-nb'
// Global instruction
Vue.use(Print);

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
      Vue.prototype.$print = Print;
    },
    // render: h => h(app),
  }).$mount("#app");
});
