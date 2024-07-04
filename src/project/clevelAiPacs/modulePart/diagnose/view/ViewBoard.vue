<template>
  <div class="ViewBoard_panel">
    <div class="pic_views pic_layout">
      <div class="side viewbox view-3d">
        <div
          class="view-item bg-slate-300 border-r-0.2 border-b-0.2 border-titleblue"
          ref="View3DRef"
        ></div>
      </div>
      <div class="side viewbox view-axial bg-slate-500">
        <div class="relative view-item bg-slate-500" ref="ViewAxialRef">
          <subScript v-show="showsub" v-model="Axial" />
        </div>
      </div>
      <div class="side viewbox view-coronal bg-slate-400">
        <div class="relative view-item bg-slate-400" ref="ViewCoronalRef">
          <subScript v-show="showsub" v-model="Coronal" />
        </div>
      </div>
      <div class="side viewbox view-sagittal bg-slate-600">
        <div
          class="relative view-item bg-slate-600 border-t-0.2 border-l-0.2 border-titleblue"
          ref="ViewSagittalRef"
        >
          <subScript v-show="showsub" v-model="Sagittal" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='javascript'>
import subScript from "@/picComps/home/subScript/subScript.vue";

import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
  createNamespacedHelpers,
} from "vuex";

export default {
  name: "ViewBoard",
  props: {
    theme: {
      type: String,
      default: "",
    },
    showsub: {
      type: Boolean,
      default: true,
    },
  },
  components: {
    subScript,
  },
  data() {
    return {};
  },
  methods: {
    // ...mapMutations("viewsStore", ["SET_HELLOVIEWS"]),
    ...mapActions("viewsStore", [
      "init3DView",
      "initCoronalView",
      "initAxialView",
      "initSagittalView",
    ]),

    handleResize() {},
  },
  mounted() {
    this.$nextTick(() => {
      console.log("this.$refs.View3DRef=", this.$refs.View3DRef);
      // this.init3DView(this.$refs.View3DRef);
      this.initCoronalView(this.$refs.ViewCoronalRef);
      this.initAxialView(this.$refs.ViewAxialRef);
      this.initSagittalView(this.$refs.ViewSagittalRef);
      window.addEventListener("resize", this.handleResize);
    });
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>
<style lang='less' scoped>
.ViewBoard_panel {
  width: 100%;
  height: 100%;
}
.pic_views {
  @media screen and (orientation: landscape) {
    grid-template-columns: 66.66% 33.34%;
  }
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  position: relative;
  user-select: none;
  background-color: rgba(161, 148, 148, 0.192);
}

.pic_layout {
  & > div {
    &:nth-child(1) {
      grid-area: ~"1/1/2/2";
      visibility: hidden;
    }

    @media screen and (orientation: landscape) {
      &:nth-child(2) {
        grid-area: ~"1/1/3/2";
      }

      &:nth-child(3) {
        grid-area: ~"1/2/2/3";
      }
    }
  }
  .side {
    background: rgb(0, 0, 0);
    height: 100%;
    border: 1px solid rgb(14, 17, 23);
  }
}
</style>
