<template>
  <div class="nodule-result_panel">
    <checkToolBar></checkToolBar>
    <LesionList v-model="menuResult" :cKey="cKey"></LesionList>
  </div>
</template>
<script lang="javascript">
import checkToolBar from "./module/check-tool-bar.vue";
import LesionList from "./module/lesion-list.vue";
/**
 * const LESION_PART_SITE = {
  CALCIUM: "calcium", //钙化
  FRAC: "frac", //骨折
  NODULE: "nodule", //结节
  PNEUMONIA: "pneumonia", //肺炎
};

 */
// 肺部- 结节
export default {
  name: "nodule-result",
  components: {
    checkToolBar,
    LesionList,
  },
  props: {
    value: Object,
    // LESION_PART_SITE 标志
    cKey: {
      type: String,
    },
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

    lesionPartSite: {
      get() {},
      set(val) {
        return val;
      },
    },
  },
  data() {
    return {};
  },
  created() {
    console.log(this.value);
    // console.log("menuResult--", this.menuResult);
  },
};
</script>
<style lang="less" scoped></style>
