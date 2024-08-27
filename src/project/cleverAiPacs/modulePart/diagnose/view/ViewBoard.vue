<template>
  <div class="ViewBoard_panel">
    <div :class="[
      'pic_views',
      { pic_layout_3d: layout === '1' },
      { pic_layout: layout === '2' },
      { pic_layout_original: layout === '3' },
    ]">
      <div class="side viewbox view-3d">
        <div class="view-item bg-slate-300 border-r-0.2 border-b-0.2 border-titleblue" ref="View3DRef"></div>
      </div>
      <div :class="[
        'side viewbox view-axial bg-slate-500',
        {
          viewOriginal: layout === '3',
        },
      ]">
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
        <div class="relative view-item bg-slate-600 border-t-0.2 border-l-0.2 border-titleblue" ref="ViewSagittalRef">
          <subScript v-show="showsub" v-model="Sagittal" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="javascript">
import subScript from "@/picComps/home/subScript/subScript.vue";

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

import { LayoutIcons } from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";

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
  computed: {
    ...mapState("viewsStore", ["viewMprViews"]),
    ...mapState("toolBarStore", ["slice_CT_pic_layout"]),
    localSlice_CT_pic_layout: {
      get() {
        return this.slice_CT_pic_layout; // 从 Vuex 状态获取值
      },
      set(value) {
        this.setSlice_CT_pic_layout(value); // 调用 mutation 更新 Vuex 状态
      },
    },
  },
  watch: {
    localSlice_CT_pic_layout: {
      handler(nVal, oVal) {
        // console.log("watch___localSlice_CT_pic_layout:", nVal, oVal);
        const that = this;
        switch (nVal) {
          case LayoutIcons.LGGJST:
            this.layout = "1";
            // console.log("切换了");

            break;
          case LayoutIcons.MPR:
            this.layout = "2";
            break;
          case LayoutIcons.YS:
            this.layout = "3";
            break;
          default:
            return void 0;
        }
        // 设置一个延时为1000毫秒（1秒）的定时器
        requestAnimationFrame(function () {
          that.resizeViews();
        });
      },
      immediate: true,
    },
  },
  data() {
    return {
      Axial: null, //轴切的 （原图）
      Coronal: null, //冠状的
      Sagittal: null, //矢状的

      layout: "1", //1:肋骨高级图布局（pic_layout_3d） 2:mpr布局（pic_layout）3:原图（pic_layout_original）
    };
  },
  methods: {
    ...mapActions("viewsStore", [
      "init3DView",
      "initCoronalView",
      "initAxialView",
      "initSagittalView",
    ]),

    resizeViews() {
      // const view3d = this.$refs.View3DRef;
      // const container = view3d.grw.getContainer();
      // const { width, height } = container.getBoundingClientRect();
      // view3d.grw.resize(width, height);
      // view3d.renderWindow.render();
      // 3d也要resizeView一下

      this.viewMprViews.forEach((view) => {
        const container = view.grw.getContainer();
        const { width, height } = container.getBoundingClientRect();
        view.grw.resize(width, height);
        view.renderWindow.render();
      });
    },
  },
  // created() {
  //   console.log("this.$bus", this.$bus);
  //   this.$bus.off("ebs_init_resizeView");
  //   this.$bus.on("ebs_init_resizeView", () => {
  //     console.log("触发ebs_init_resizeView");
  //     this.resizeViews();
  //   });
  // },

  mounted() {
    this.$nextTick(() => {
      // console.log("this.$refs.View3DRef=", this.$refs.View3DRef);
      // this.init3DView(this.$refs.View3DRef);
      this.initCoronalView(this.$refs.ViewCoronalRef);
      this.initAxialView(this.$refs.ViewAxialRef);
      this.initSagittalView(this.$refs.ViewSagittalRef);
      window.addEventListener("resize", this.resizeViews);
    });
  },
  unmounted() {
    window.removeEventListener("resize", this.resizeViews);
  },
};
</script>
<style lang="less" scoped>
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

.viewbox {
  background-color: rgba(255, 255, 255, 0.242);
}

.view-item {
  // height: 320px;
  display: flex;
  width: 100%;
  height: 100%;
}

.pic_layout_3d {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  position: relative;
  user-select: none;
}

.pic_layout_original {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 50% 50%;
  position: relative;
  user-select: none;
}

.viewOriginal {
  background: rgb(0, 0, 0);
  border: 1px solid rgb(14, 17, 23);
  top: 0px;
  left: 0px;
  z-index: 3;
  width: 100% !important;
  height: 100% !important;
  position: absolute !important;
}

.pic_layout {
  &>div {
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
