<template>
  <div class="nodule-result_panel">

    <LesionList :menuResult="menuResult" :cKey="cKey"></LesionList>
  </div>
</template>
<script lang="javascript">
import LesionList from "./module/lesion-list.vue";
import { mapState, mapActions } from "vuex";


// 肺部- 结节
export default {
  name: "frac-result",
  components: {
    LesionList,
  },
  props: {
    // LESION_PART_SITE 标志
    cKey: {
      type: String,
    },
  },
  computed: {
    ...mapState("fracInfoStore", ["fracInfo"]),

    menuResult: {
      get() {
        if (this.fracInfo) {
          return this.fracInfo;

        } else {
          return []
        }
      },
    },

    lesionPartSite: {
      get() { },
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
