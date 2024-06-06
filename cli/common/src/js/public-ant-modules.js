import faceConfig from 'faceConfig';
import Vue from 'vue';
import Router from 'vue-router';
// 引入按需加载的基础组件
import './modules/baseModule';
// 如果要引入旧版本的所有utils(包括TaUtils和Base),则需要引入下面的polyfill
// import('./baseModule.polyfill.js')
// 引入动态locale
import {
  makeI18n
} from '@yh/cli-internal-precompiled-locales';

import store from '../store';
import taMixins from './mixins/mixins.js';
import './util/authority';
import '../less/reset.less';
// 添加框架组件样式覆盖样式文件
import '@projectCommon/styleCover/styleCover.less';


// ---通用样式-包含字体风格
import '@/assets/less/style.less';


// ----
import 'virtual:dynamicTheme';
import 'virtual:elderly';
import {
  checkLogin
} from '@common/js/crypto/crypto';
// 数据字典初始化
import dict from '@yh/ta404-ui/es/_dict';
// 适老化
import './util/elderlyOriented';
import '@common/js/directive/index'
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
export {
  Vue,
  store,
  taMixins,
  checkLogin,
  makeI18n
};