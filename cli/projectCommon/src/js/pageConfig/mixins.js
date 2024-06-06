import { getStorage } from '@yh/ta-utils';
import faceConfig from 'faceConfig';

// 因为妹子偷懒，不得不自己写计算属性和函数
// 该mixins提供组织管理页面统一配置相关的参数
// 其实最好是统一获取一个projectConfig对象的，但现有的store存储结构不太合适，后续有其他属性再同理添加了
export default {
  computed: {
    // 包含子组织模式配置
    isQueryChildOrgData() {
      return this.getProjectConfig('isQueryChildOrgData');
    },
  },
  methods: {
    isQueryChildOrgDataFn() {
      return this.getProjectConfig('isQueryChildOrgData');
    },
    getProjectConfig(name) {
      const value = getStorage(import.meta.env.VITE_PROJECT_STORAGE_KEY, name, true);
      if (typeof value == 'undefined') {
        return faceConfig.projectConfig[name];
      }
      return value;
    },
  },
};
