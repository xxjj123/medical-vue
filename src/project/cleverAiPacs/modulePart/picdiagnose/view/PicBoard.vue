<template>
  <div class=" ViewBoard_panel h-full w-full">
    <div ref="ViewRef" class="relative">
      <subScript class="absolute top-0 h-full w-full left-0 z-99 select-none pointer-events-none" />
    </div>
  </div>
</template>

<script lang="javascript">

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

import subScript from "@/picComps/picDiagnose/subScript/index.vue";


export default {
  name: "ViewBoard",
  data() {
    return {

    };
  },
  props: {

  },
  components: {
    subScript
  },
  computed: {

  },
  watch: {

  },

  methods: {
    ...mapActions("picViewStore", [
      "InitView",
      "resizeSliceViews"
    ]),
  },
  created() {



  },
  mounted() {
    this.$nextTick(() => {
      // this.Init3DView(this.$refs.View3DRef);
      this.InitView(this.$refs.ViewRef);

      window.addEventListener("resize", this.resizeSliceViews);
    });
  },
};
</script>
<style lang="less" scoped>
.ViewBoard_panel {
  border: 1px solid red;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 100%;
  position: relative;
  user-select: none;
}
</style>
