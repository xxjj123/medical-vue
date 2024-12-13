<template>
  <div class="nodule-result_panel">

    <LesionList :menuResult="menuResult" :operateResult="operateResult"></LesionList>
  </div>
</template>
<script lang="javascript">
import LesionList from "./module/lesion-list.vue";
import { mapState, mapActions } from "vuex";


// 肺部- 结节
export default {
  name: "nodule-result",
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
    // ...mapState("noduleInfoStore", ["noduleInfo", "operateInfo"]),
    ...mapState("noduleStore", ["noduleInfo", "operateInfo"]),


    menuResult: {
      get() {
        if (this.noduleInfo) {
          return this.noduleInfo;

        } else {
          return []
        }
      },
    },
    operateResult: {
      get() {
        if (this.operateInfo) {
          return this.operateInfo;

        } else {
          return {}
        }
      },
    },

  },
  data() {
    return {};
  },
  created() {
    // console.log(this.value);
    // console.log("menuResult--", this.menuResult);
  },
};
</script>
<style lang="less" scoped></style>
