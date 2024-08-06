// 异步获取权限数据
import { getNowPageParam } from '@yh/ta-utils';
import Vue from 'vue';
// 权限验证
Vue.prototype.checkRole = (_vm) => {
  try {
    if (!_vm.$attrs.id) {
      return;
    }
    const moduleId = getNowPageParam()._modulePartId_;
    if (!moduleId) {
      return;
    }
    const auth = top.indexTool.getMenuAuthority(moduleId);
    // 如果没有权限验证要求直接返回
    if (auth === undefined) {
      return;
    }
    const { defaultAuth } = auth;
    const { list } = auth;
    let authFlag = defaultAuth;
    // 如果有id并且在权限list中找到对应的控制那么走权限控制auth否则走defaultAuth
    const { id } = _vm.$attrs;
    for (let i = 0; i < list.length; i++) {
      if (list[i].id === id) {
        authFlag = list[i].authority || defaultAuth;
        break;
      }
    }
    if (authFlag == 0) {
      _vm.$el.parentNode.removeChild(_vm.$el);
    } else if (authFlag == 1) {
      _vm.disabled = true;
    }
  } catch (e) {
    //
  }
};

Vue.mixin({
  mounted() {
    if (this.checkRole) {
      this.checkRole(this);
    }
  },
});
