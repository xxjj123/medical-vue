<template>
  <div id="adminPageRoot" class="adminPage_rContainer">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script lang='javascript'>
export default {
  name: "adminPage-layout",
  data() {
    return {};
  },
};
</script>
<style lang='less' scoped>
</style>