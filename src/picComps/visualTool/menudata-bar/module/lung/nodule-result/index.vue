<template>
  <div class="nodule-result_panel">
    <checkToolBar></checkToolBar>
  </div>
</template>
<script lang='javascript'>
import checkToolBar from "./module/check-tool-bar.vue";
// 肺部- 结节
export default {
  name: "nodule-result",
  components: {
    checkToolBar,
  },
  data() {
    return {};
  },
};
</script>
<style lang='less' scoped>
</style>
