<template>
  <!-- {{ seriesInfo }} -->
  <div class="ViewBoard_panel">
    <div
      :class="[
        'pic_views',
        { pic_layout_3d: layout === '1' },
        { pic_layout: layout === '2' },
        { pic_layout_original: layout === '3' },
      ]"
    >
      <!-- {{ szckx_on }} -->

      <div class="side viewbox view-3d">
        <div
          class="view-item bg-slate-300 border-r-0.2 border-b-0.2 border-titleblue"
          ref="View3DRef"
        ></div>
      </div>
      <div
        :class="[
          'side viewbox view-axial bg-slate-500',
          {
            viewOriginal: layout === '3',
          },
        ]"
      >
        <div class="relative view-item bg-slate-500" ref="ViewAxialRef">
          <crossHair
            v-if="AxialData.displayX && AxialData.displayY"
            class="absolute top-0 h-full w-full left-0 z-99 select-none pointer-events-none"
            :crosshairData="axialCrosshairData"
          />
        </div>
      </div>
      <div class="side viewbox view-coronal bg-slate-400">
        <div class="relative view-item bg-slate-400" ref="ViewCoronalRef">
          <crossHair
            v-if="CoronalData.displayX && CoronalData.displayY"
            class="absolute top-0 h-full w-full left-0 z-99 select-none pointer-events-none border-amber border-spacing-1"
            :crosshairData="coronalCrosshairData"
          />
        </div>
      </div>
      <div class="side viewbox view-sagittal bg-slate-600">
        <div
          class="relative view-item bg-slate-600 border-t-0.2 border-l-0.2 border-titleblue"
          ref="ViewSagittalRef"
        >
          <crossHair
            v-if="SagittalData.displayX && SagittalData.displayY"
            class="absolute top-0 h-full w-full left-0 z-99 select-none pointer-events-none border-amber border-spacing-1"
            :crosshairData="sagittalCrosshairData"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="javascript">
import {
  ButtonNames,
  LayoutIcons,
  toggleButtonState,
  suffix_name,
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";

import subScript from "@/picComps/home/subScript/subScript.vue";
import crossHair from "@/picComps/home/subScript/crossHair.vue";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

let btnStateGrp = {
  [`${ButtonNames.Ckcw}${suffix_name}`]: false,
  [`${ButtonNames.Mdtyms}${suffix_name}`]: false,
  [`${ButtonNames.Jbinfo}${suffix_name}`]: false,
  [`${ButtonNames.AiInfo}${suffix_name}`]: false,
  [`${ButtonNames.Szckx}${suffix_name}`]: false,
  [`${ButtonNames.Pyms}${suffix_name}`]: false,
};
console.log(btnStateGrp);
export default {
  name: "ViewBoard",
  data() {
    return {
      Axial: null, //轴切的 （原图）
      Coronal: null, //冠状的
      Sagittal: null, //矢状的
      ...btnStateGrp,
      szckx_on: btnStateGrp[`${ButtonNames.Szckx}${suffix_name}`],
      layout: "1", //1:肋骨高级图布局（pic_layout_3d） 2:mpr布局（pic_layout）3:原图（pic_layout_original）
    };
  },
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
    crossHair,
  },
  computed: {
    ...mapState("viewInitStore", [
      "AxialData",
      "CoronalData",
      "SagittalData",
      "showCrosshair",
    ]),
    ...mapState("toolBarStore", ["slice_CT_pic_layout"]),
    localSlice_CT_pic_layout: {
      get() {
        return this.slice_CT_pic_layout; // 从 Vuex 状态获取值
      },
      set(value) {
        this.setSlice_CT_pic_layout(value); // 调用 mutation 更新 Vuex 状态
      },
    },
    axialCrosshairData() {
      return {
        crosshair_x: this.AxialData.displayX,
        crosshair_y: this.AxialData.displayY,
        scale_length: this.AxialData.scaleLength,
      };
    },
    coronalCrosshairData() {
      return {
        crosshair_x: this.CoronalData.displayX,
        crosshair_y: this.CoronalData.displayY,
        scale_length: this.CoronalData.scaleLength,
      };
    },
    sagittalCrosshairData() {
      return {
        crosshair_x: this.SagittalData.displayX,
        crosshair_y: this.SagittalData.displayY,
        scale_length: this.SagittalData.scaleLength,
      };
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

  methods: {
    ...mapActions("viewInitStore", [
      "InitAxialView",
      "InitCoronalView",
      "InitSagittalView",
      "InitSlice",
      "resizeViews",
    ]),

    ...mapActions("viewsStore", ["init3DView"]),
  },

  mounted() {
    this.$nextTick(() => {
      this.init3DView(this.$refs.View3DRef);
      this.InitAxialView(this.$refs.ViewAxialRef);
      this.InitCoronalView(this.$refs.ViewCoronalRef);
      this.InitSagittalView(this.$refs.ViewSagittalRef);
      console.log("++++++++完成页面初始化了");
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
