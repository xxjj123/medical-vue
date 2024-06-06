// 1.2-1.5.1版本升级使用
import Vue from 'vue';
import downloadFile from '@yh/ta404-ui/es/utils/js/downloadFile';
import { baseUtil } from '../polyfill/base.util.polyfill';
import { Modal } from '@yh/ta404-ui';
window.TaUtils = {
  ...baseUtil,
};

// 注册工具到Base上
window.Base = {
  ...window.Base,
  downloadFile,
};

Vue.prototype.Base = {
  ...window.Base,
};

Vue.prototype.$info = Modal.info;
Vue.prototype.$error = Modal.error;
Vue.prototype.$warning = Modal.warning;
