<template>
  <div class="nodule-result_panel">
    <checkToolBar></checkToolBar>
    <LesionList v-model="menuResult"></LesionList>
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
  props: {
    value: Object,
  },
  computed: {
    menuResult: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
        return val;
      },
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang='less' scoped>
</style>
