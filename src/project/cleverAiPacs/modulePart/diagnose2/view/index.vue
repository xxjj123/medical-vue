<template>
  <div class="viewboard" :class="theme">
    <div class="view-3d">
      <div
        class="view-item bg-slate-300 border-r-0.2 border-b-0.2 border-titleblue"
        ref="View3DRef"
      ></div>
    </div>

    <div class="view-axial bg-slate-500">
      <div class="relative view-item bg-slate-500" ref="ViewAxialRef">
        <subScript v-show="showsub" v-model="Axial" />
      </div>
    </div>
    <div class="view-coronal bg-slate-400">
      <div class="relative view-item bg-slate-400" ref="ViewCoronalRef">
        <subScript v-show="showsub" v-model="Coronal" />
      </div>
    </div>
    <div class="view-sagittal bg-slate-600">
      <div
        class="relative view-item bg-slate-600 border-t-0.2 border-l-0.2 border-titleblue"
        ref="ViewSagittalRef"
      >
        <subScript v-show="showsub" v-model="Sagittal" />
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
      this.init3DView(this.refs.View3DRef);
      this.initCoronalView(this.refs.ViewCoronalRef);
      this.initAxialView(this.refs.ViewAxialRef);
      this.initSagittalView(this.refs.ViewSagittalRef);
      window.addEventListener("resize", this.handleResize);
    });
  },
  unmounted() {
    window.removeEventListener("resize", this.handleResize);
  },
};
</script>
<style lang='less' scoped>
.advanced-view {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  .view-3d,
  .view-coronal,
  .view-sagittal,
  .view-axial {
    .view-item {
      width: 610px;
      height: 440px;
    }
  }
}

.mpr-view {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr;
  .view-3d {
    display: none;
  }
  .view-axial {
    grid-row: 1/3;
    grid-column: 1/3;
    .view-item {
      height: 100%;
      width: 100%;
    }
  }
}
.original-view {
  .view-3d,
  .view-coronal,
  .view-sagittal {
    display: none;
  }
}
</style>
