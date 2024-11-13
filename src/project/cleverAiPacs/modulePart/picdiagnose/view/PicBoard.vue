<template>
  <div class=" ViewBoard_panel h-full w-full">
    <div ref="ViewRef" class="relative">
      <subScript class="absolute top-0 h-full w-full left-0 z-99 select-none pointer-events-none" :data="InitInfo"
        :allViewData="allViewData" />
    </div>
  </div>
</template>

<script lang="javascript">

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

import subScript from "@/picComps/picDiagnose/subScript/index.vue";
import { xhr_getSingleImageInfo } from "@/api"

export default {
  name: "ViewBoard",
  data() {
    return {
      InitInfo: {}
    };
  },
  methods: {
    ...mapActions("spineViewStore", [
      "InitView",
      "InitViewData",
    ]),
  },
  computed: {
    ...mapState("spineViewStore", ["allViewData"])
  },
  components: {
    subScript
  },
  async created() {


    const result = await xhr_getSingleImageInfo({ studyid: "1838512078533521409" });
    this.InitInfo = result.data.resultData
    console.log(result.data)

  },
  mounted() {
    this.$nextTick(async () => {
      // this.Init3DView(this.$refs.View3DRef);
      await this.InitView(this.$refs.ViewRef);
      this.InitViewData()

      // window.addEventListener("resize", this.resizeSliceViews);
    });
  },
};
</script>
<style lang="less" scoped>
.ViewBoard_panel {
  // border: 1px solid red;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  position: relative;
  user-select: none;
}
</style>
