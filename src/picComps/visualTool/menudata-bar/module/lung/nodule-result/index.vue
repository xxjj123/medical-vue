<template>
  <div class="nodule-result_panel">
    <checkToolBar></checkToolBar>
    <LesionList></LesionList>
  </div>
</template>
<script lang='javascript'>
import checkToolBar from "./module/check-tool-bar.vue";
import LesionList from "./module/lesion-list.vue";
// 肺部- 结节
export default {
  name: "nodule-result",
  components: {
    checkToolBar,
    LesionList,
  },
  data() {
    return {};
  },
};
</script>
<style lang='less' scoped>
</style>
