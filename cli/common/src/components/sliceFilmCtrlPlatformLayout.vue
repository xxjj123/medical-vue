<template>
  <div id="sliceFilmCtrlPlatformRoot" class="sliceFilmCtrlPlatform_rContainer">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script lang='javascript'>
export default {
  name: "sliceFilmCtrlPlatform-layout",
  data() {
    return {};
  },
};
</script>
<style lang='less' scoped>
</style>