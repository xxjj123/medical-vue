import faceConfig from "faceConfig";
import Vue from "vue";
import Router from "vue-router";

/* // import TaUtils from '@yh/ta-utils' //新方式建议异步导入页面使用
// import rrr from 'utils.esm.ts'
// Vue.prototype.TaUtils = {
//   ...TaUtils,
// }
// 挂载到window上
// window.TaUtils = Vue.prototype.TaUtils */

// 引入按需加载的基础组件
import "./modules/baseModule";
// 如果要引入旧版本的所有utils(包括TaUtils和Base),则需要引入下面的polyfill
// import('./baseModule.polyfill.js')
// 引入动态locale
import {makeI18n} from "@yh/cli-internal-precompiled-locales";

import PopoverEx from "@yh/ta404-ui/es/popover-ex";
import "@yh/ta404-ui/es/popover-ex/style";
Vue.use(PopoverEx);

import FormModel from "@yh/ta404-ui/es/form-model";
import "@yh/ta404-ui/es/form-model/style";
Vue.use(FormModel);

import Select from "@yh/ta404-ui/es/select";
import "@yh/ta404-ui/es/select/style";
Vue.use(Select);

import DatePicker from "@yh/ta404-ui/es/date-picker";
import "@yh/ta404-ui/es/date-picker/style";
Vue.use(DatePicker);

import BigTable from "@yh/ta404-ui/es/big-table";
import "@yh/ta404-ui/es/big-table/style";
Vue.use(BigTable);

import Divider from "@yh/ta404-ui/es/divider";
import "@yh/ta404-ui/es/divider/style";
Vue.use(Divider);

import Pagination from "@yh/ta404-ui/es/pagination";
import "@yh/ta404-ui/es/pagination/style";
Vue.use(Pagination);

import Drawer from "@yh/ta404-ui/es/drawer";
import "@yh/ta404-ui/es/drawer/style";
Vue.use(Drawer);

import Slider from "@yh/ta404-ui/es/slider";
import "@yh/ta404-ui/es/slider/style";
Vue.use(Slider);

// 自定义组件

import taAll from "@yh/ta-utils";
// console.log("taAll==", taAll)

import store from "../store";
import taMixins from "./mixins/mixins.js";
import "./util/authority";
import "../less/reset.less";
// 添加框架组件样式覆盖样式文件
import "@projectCommon/styleCover/styleCover.less";

// ---通用样式-包含字体风格
import "@/assets/less/style.less";

// ----
import "virtual:dynamicTheme";
import "virtual:elderly";
import {checkLogin} from "@common/js/crypto/crypto";
// 数据字典初始化
import dict from "@yh/ta404-ui/es/_dict";
// 适老化
import "./util/elderlyOriented";
import "@common/js/directive/index";
window.faceConfig = {
  // 仅用于支持pdf-viewer,这个值不要做任何修改
  context: import.meta.env.VITE_PUBLIC_PATH,
  ...faceConfig,
};
// window.routeLoading = routeLoading
// 解决路由promise报错问题
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) {
    return originalPush.call(this, location, onResolve, onReject);
  }
  return originalPush.call(this, location).catch((err) => err);
};

dict.init(Vue, store);
export {Vue, store, taMixins, checkLogin, makeI18n};
