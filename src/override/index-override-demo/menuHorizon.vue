<template>
  <ta-menu
    ref="menuHorizon"
    mode="horizontal"
    :theme="theme"
    :data="menuList"
    :props="props"
    :selected-keys="selectedKey"
    class="index-top-menu"
    :style="menuHeight"
    @click="clickMenu"
  />
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      props: {
        key: 'id',
        title: 'name',
      },
    };
  },
  computed: {
    ...mapGetters({
      state: 'getStateValue',
      menuLeft: 'getMenuListLeft',
      getHeaderHeight: 'getHeaderHeight',
    }),
    theme() {
      if (this.state.headerTheme === 'base') {
        return 'base';
      } else {
        return this.state.menuType === 'top' ? 'base' : 'light';
      }
    },
    selectedKey() {
      let result = '';
      const { activeMenuOne, activeMenuTwo, menuType } = this.state;
      result = menuType === 'top' ? activeMenuTwo : activeMenuOne;
      return [result || ''];
    },
    menuList() {
      let result = [];
      const { menuList, menuType } = this.state;
      if (menuType === 'top') {
        result = menuList;
      } else if (menuType === 'leftTop' || menuType === 'simple' || menuType === 'workTable') {
        const temp = JSON.parse(JSON.stringify(menuList));
        temp.forEach((item) => {
          // eslint-disable-next-line no-param-reassign
          delete item.children;
          result.push(item);
        });
      }
      return result;
    },
    menuHeight() {
      const height = parseInt(this.getHeaderHeight, 10);
      return {
        height: `${height}px`,
        lineHeight: `${height}px`,
      };
    },
  },
  methods: {
    clickMenu({ key, keyPath }) {
      const { menuType } = this.state;
      if (menuType === 'top') {
        this.$store.dispatch('setActiveMenu', {
          level: 'one',
          menuId: keyPath[keyPath.length - 1],
        });
        this.$store.dispatch('setActiveMenu', { level: 'two', menuId: key });
        this.setTabMenu(keyPath);
      } else if (menuType === 'leftTop' || menuType === 'simple' || menuType === 'workTable') {
        this.$store.dispatch('setActiveMenu', { level: 'one', menuId: key });
        /* 顶部菜单只有一级时 */
        if (this.menuLeft.length === 0) {
          this.$store.dispatch('setActiveMenu', { level: 'two', menuId: key });
          this.setTabMenu(keyPath);
        }
      }
    },
    /* 添加tab 菜单 */
    setTabMenu(keyPath) {
      const { menuList, barType } = this.state;
      const breadcrumb = [];
      let tabMenu = menuList;
      for (let i = keyPath.length - 1; i > -1; i--) {
        if (keyPath[i].indexOf('overflowed-indicator') === -1) {
          tabMenu = tabMenu.filter((item) => item.id === keyPath[i])[0];
          if (barType === 'breadcrumb') {
            breadcrumb.push(tabMenu.name);
          }
          tabMenu = i ? tabMenu.children : tabMenu;
        }
      }
      /* 面包屑列表 */
      if (breadcrumb.length) {
        this.$store.dispatch('setStateValue', { breadcrumb });
      }
      this.$store.dispatch('addTabMenuList', { value: tabMenu });
    },
  },
};
</script>
<style lang="less">
.index-top-menu {
  width: 100%;

  &.ant-menu-horizontal {
    border-bottom: none;
  }
}
</style>
