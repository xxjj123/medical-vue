import { findTree, getNowPageParam } from '@yh/ta-utils';
// 所有页面需要执行的mixins
const taMixins = {
  created() {
    // 调整到当前页面路由keep-alive缓存的状态
    window.goToCurrentRouter = () => {
      const key = getNowPageParam()._modulePartId_;
      // 切换html的时候 路由状态保存
      if (window?.cacheRoute?.has(key)) {
        this.$router.push({ ...window.cacheRoute.get(key) });
      }
    };
    window.loadCachedRouter = () => {
      goToCurrentRouter();
      // 切换html的时候 触发bigtable重绘
      document.querySelectorAll('.vxe-table').forEach((vt) => {
        if (vt.trigger) {
          vt.trigger();
        }
      });
    };
    window.deleteCachedRouter = (key) => window?.cacheRoute?.delete(key);
  },
  mounted() {
    // 兼容ie路由跳转
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      window.addEventListener(
        'hashchange',
        () => {
          const currentPath = window.location.hash.slice(1);
          if (this.$route.path !== currentPath) {
            this.$router.push(currentPath);
          }
        },
        false,
      );
    }
    document.body.addEventListener('mousedown', () => {
      window.sendMessage(window.top, 'indexTool.closeIndexPops');
    });
    window.pageVmObj = {
      $t: this.$t,
      _i18n: this._i18n,
      _route: this._route,
    };
    // 添加路由钩子函数 携带 _modulePartId_
    // 登录才需要模块id
    if (this.$router) {
      this.$router.beforeEach((to, from, next) => {
        if (to.query._NOAUTHURL_ === true || to.params._NOAUTHURL_ === true) {
          next();
          return;
        }
        if (!to.query._modulePartId_) {
          const toQuery = JSON.parse(JSON.stringify(to.query));
          toQuery._modulePartId_ =
            to.params._modulePartId_ ||
            getNowPageParam()._modulePartId_ ||
            getNowPageParam().___businessId;
          next({
            name: to.name,
            path: to.path,
            query: toQuery,
            params: to.params,
          });
        } else {
          next();
        }
      });
    }
  },
  watch: {
    $route: {
      handler(val, _oldVal) {
        if (!this.$router) {
          return;
        }
        const routes = this.$router.options.routes[0].children;
        const res = findTree(routes, (item) => item.name === val.name);
        if (!res) return;
        const { item } = res;
        if (!item?.children?.length) {
          if (!window.cacheRoute) {
            window.cacheRoute = new Map();
          }
          window.cacheRoute.set(getNowPageParam()._modulePartId_, val);
        }
      },
      immediate: true,
      deep: true,
    },
  },
  beforeDestroy() {
    console.log('des');
  },
};

export default taMixins;
