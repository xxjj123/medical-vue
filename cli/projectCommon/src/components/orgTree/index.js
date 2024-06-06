/**
 * 组织树组件
 * add by xiepan
 */
import orgTree from './src/orgTree.vue';

orgTree.install = (Vue) => {
  Vue.component(orgTree.name, orgTree);
};

export default orgTree;
