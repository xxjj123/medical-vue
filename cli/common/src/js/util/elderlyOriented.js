// 适老化配置
import Vue from 'vue';

window.window_ElderlyOriented = (flag) => {
  console.log(flag);
  if (flag) {
    Vue.prototype.$ELEMENT = {
      size: 'large',
    };
  } else {
    Vue.prototype.$ELEMENT = {};
  }
};
