<template>
  <div id="page-wrapper" class="page-wrapper">
    <ta-config-provider :get-popup-container="popupContainer" :locale="uiLocale">
      <keep-alive :include="tabList" :exclude="exList">
        <router-view v-if="refreshing" />
      </keep-alive>
    </ta-config-provider>
  </div>
</template>
<script>
import { i18nMixins } from '@yh/cli-internal-precompiled-locales/mixins';
import { createWebStorage } from '@yh/ta-utils';
import Closest from 'dom-closest';
import bigTableMixin from '@common/js/mixins/bigTableMixin'
/* 在开发模式下如果出现热更新页面不见的情况可取消注释
import Vue from 'vue'
import VueKeepAliveDev from './KeepAlive'
if (process.env.NODE_ENV === 'development') {
  Vue.use(VueKeepAliveDev, {
    environment: process.env.NODE_ENV,
  })
} */
export default {
  name: 'routesContainer',
  mixins: [i18nMixins(),bigTableMixin],
  props: {
    routesList: Array,
  },
  data() {
    return {
      tabList: [],
      exList: [],
      refreshing: true,
    };
  },
  created() {
    window.setIncludeTabList = () => {
      this.setTabList();
    };
    window.window_refresh = ({ pageId, pagePart }) => {
      this.reload(pageId, pagePart);
    };
  },
  beforeDestroy() {
    window.setIncludeTabList = null;
    window.window_refresh = null;
  },
  mounted() {
    // 设置message的容器为每个路由页面,解决同一路由下面报错切换页面后报错不隐藏
    // message.config({
    // getContainer:()=>{ return document.getElementById("page-wrapper").firstElementChild}
    // });
    // 更新tablist
    this.setTabList();
  },
  methods: {
    reload(menuId, menuPart) {
      if (menuPart) {
        this.exList.push(menuPart);
      }
      this.refreshing = false;
      setTimeout(() => {
        this.refreshing = true;
        this.$nextTick(() => {
          this.$set(this, 'exList', []);
        });
      }, 200);
    },
    setTabList() {
      const cacheTabListStorage = createWebStorage('Ta$cacheTabListStorage');
      const listModule = cacheTabListStorage.get('Ta$cacheTabListStorage');
      this.$set(this, 'tabList', listModule);
    },
    popupContainer(trigger) {
      // 如果ta-e-tree在一个modal中,且这个modal下边包含一个名为tree-box的节点
      // 那么此时可以认为使用了ta-user-input/ta-user-select组件
      // 那么就不应该返回其父节点
      const isTreeBox = !!Closest(trigger, '.tree-box');
      const isInModal = !!Closest(trigger, '.ant-modal-content');
      // 单独处理el-tree的弹出父容器
      if (trigger?.classList?.contains('el-tree-node__label') && !(isInModal && isTreeBox)) {
        return trigger?.parentNode;
      }
      if (isInModal && isTreeBox) {
        return Closest(trigger, '.ant-modal');
      }
      // 此处将page-wrapper的第一个子元素作为所有弹出框/窗口的容器
      return this.$el.childNodes[0];
    },
  },
};
</script>
<style scoped type="text/less">
.page-wrapper {
  height: 100%;
}
</style>
