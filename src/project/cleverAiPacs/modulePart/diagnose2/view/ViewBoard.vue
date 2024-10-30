<template>
  <div class="ViewBoard_panel">
    <div :class="[
      'pic_views',
      { pic_layout_3d: computedLayout === '1' },
      { pic_layout: computedLayout === '2' },
      { pic_layout_original: computedLayout === '3' },
      { pic_layout_recon: computedLayout === '6' }
    ]">

      <div class="side viewbox view-3d">
        <div class="view-item bg-slate-300 border-r-0.2 border-b-0.2 border-titleblue" ref="View3DRef"></div>
        <!-- <view3D class="h-full w-full" ref="view3DRef" :seriesId="seriesInfo.seriesId" /> -->

      </div>
      <div :class="[
        'side viewbox view-axial bg-slate-500',
        {
          viewOriginal: computedLayout === '3',
        },
      ]">
        <div class="relative view-item bg-slate-500">
          <threeViewSecTool :sheetStyle="sheetStyle_AxialData" :dicomTags_msg="AxialDataInfo"
            :viewType="AxialData.viewIndex" class="absolute z-2" :TracheaName="`lung`">
            <div class="relative view-item bg-slate-500" ref="ViewAxialRef">
              <crossHair v-if="AxialData.displayX && AxialData.displayY" class="absolute top-0 h-full w-full left-0 z-1"
                :crosshairData="axialCrosshairData" />
            </div>
          </threeViewSecTool>
        </div>
      </div>
      <div :class="[
        'side viewbox view-axial bg-slate-400',
        {
          viewOriginal: computedLayout === '4',
        },
      ]">
        <div class="relative view-item bg-slate-400">
          <threeViewSecTool :dicomTags_msg="CoronalDataInfo" :viewType="CoronalData.viewIndex" class="absolute z-2"
            :TracheaName="`lung`">
            <div class="relative view-item bg-slate-400" ref="ViewCoronalRef">
              <crossHair v-if="CoronalData.displayX && CoronalData.displayY"
                class="absolute top-0 h-full w-full left-0 z-99 select-none pointer-events-none border-amber border-spacing-1"
                :crosshairData="coronalCrosshairData" />

            </div>
          </threeViewSecTool>
        </div>
      </div>
      <div :class="[
        'side viewbox view-axial bg-slate-600',
        {
          viewOriginal: computedLayout === '5',
        },
      ]">
        <div class="relative view-item bg-slate-600 border-t-0.2 border-l-0.2 border-titleblue">
          <threeViewSecTool :dicomTags_msg="SagittalDataInfo" :viewType="SagittalData.viewIndex" class="absolute z-2"
            :TracheaName="`lung`">
            <div class="relative view-item bg-slate-600" ref="ViewSagittalRef">
              <crossHair v-if="SagittalData.displayX && SagittalData.displayY"
                class="absolute top-0 h-full w-full left-0 z-99 select-none pointer-events-none border-amber border-spacing-1"
                :crosshairData="sagittalCrosshairData" />
            </div>
          </threeViewSecTool>
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
import threeViewSecTool from "@/picComps/home/subScript/threeViewSecTool/index.vue";
import view3D from "@/picComps/viewTemplate/view3D.vue";

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

import { getStorage, createWebStorage, } from '@yh/ta-utils'

export default {
  name: "ViewBoard",
  data() {
    return {
      sheetStyle_AxialData: {
        // top: '60px',
        // left: "30px"
      },
      SagittalDataInfo: {
        group: [{ label: 'WW/WL', value: '1500/-500' }, { label: 'Image', value: '240/512' }],
        verseTag: true,
        HuShow: true,
        ThicknessShow: false,

        HuVal: "",
        fixHere: 'leftTop'
      },
      CoronalDataInfo: {
        group: [{ label: 'WW/WL', value: '1500/-500' }, { label: 'Image', value: '240/512' }],
        verseTag: true,
        HuShow: true,
        ThicknessShow: false,

        HuVal: "",
        fixHere: 'leftTop'
      },
      AxialDataInfo: {
        group: [{ label: 'WW/WL', value: '1500/-500' }, { label: 'Image', value: '240/512' }],
        verseTag: true,
        HuShow: true,
        HuVal: "",
        SpaceShow: true,
        SpacVal: "",
        KvpShow: true,
        ThicknessShow: true,
        KvpVal: "",
        DimensionShow: true,
        DimensionVal: "",
        scaleplate: {
          unit: 'cm',
          value: '1',
          width: '16px',
          verse: true
        },
        fixHere: 'leftTop'
      },
      Axial: null, //轴切的 （原图）
      Coronal: null, //冠状的
      Sagittal: null, //矢状的

      layout: "1", //1:肋骨高级图布局（pic_layout_3d） 2:mpr布局（pic_layout）3:原图（pic_layout_original）
    };
  },
  props: {
    seriesInfo: {
      type: Object,
    },
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
    threeViewSecTool, view3D
  },
  computed: {

    ...mapState("mprViewStore", [
      "AxialData",
      "CoronalData",
      "SagittalData",
      "showCrosshair",
      // // "seriesInfo",
      "allViewData",
      "series_map_dicom",
      "studies_selected",

    ]),


    ...mapState("toolBarStore", ["slice_CT_pic_layout"]),
    ...mapState("toolBarStore", {
      ckcwButtonState: state => state[`${ButtonNames.Ckcw}${suffix_name}`],
      szckxButtonState: state => state[`${ButtonNames.Szckx}${suffix_name}`],

    }),


    // localSlice_CT_pic_layout: {
    //   get() {
    //     return this.slice_CT_pic_layout; // 从 Vuex 状态获取值
    //   },
    //   set(value) {
    //     this.setSlice_CT_pic_layout(value); // 调用 mutation 更新 Vuex 状态
    //   },
    // },
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
    computedLayout() {
      if (this.allViewData.zoomView) {
        switch (this.allViewData.zoomView) {
          case LayoutIcons.AXIAL:
            return "3";
          case LayoutIcons.CORONAL:
            return "4";
          case LayoutIcons.SAGITTAL:
            return "5";
        }
      } else {
        switch (this.allViewData.layOut) {
          case LayoutIcons.LGGJST:
            return "1";
          case LayoutIcons.MPR:
            return this.allViewData.isRecon ? "1" : "2";
          case LayoutIcons.AXIAL:
            return this.allViewData.isRecon ? "6" : "3";
          case LayoutIcons.CORONAL:
            return "4";
          case LayoutIcons.SAGITTAL:
            return "5";
          case LayoutIcons.RECON:
            return "6";
          default:
            return "1";
        }
      }

    },
  },
  watch: {
    computedLayout(newVal, oldVal) {
      if (newVal !== oldVal) {
        requestAnimationFrame(() => {
          this.resizeViews();
          // this.resizeCamera(); // Uncomment if needed
          // dispatch("setupCamera", view.viewIndex); // Uncomment if needed
        });
      }
    },



    AxialData: {
      handler(nVal, oVal) {
        if (nVal) {
          this.initCompData_AxialDataInfo();
        }
      },
      deep: true,
      immediate: true
    },

    CoronalData: {
      handler(nVal, oVal) {
        if (nVal) {
          this.initCompData_CoronalData();
        }
      },
      deep: true,
      immediate: true,
    },
    SagittalData: {
      handler(nVal, oVal) {
        if (nVal) {
          this.initCompData_SagittalData();
        }
      },
      deep: true,
      immediate: true,
    }
  },

  methods: {
    ...mapActions("mprViewStore", ["InitAxialView",
      "InitCoronalView",
      "InitSagittalView", "beforeViewDestory"]),

    ...mapActions("mprToolsStore", ["resizeSliceViews", "resizeCamera"]),

    ...mapActions("view3DStore", [
      "Init3DScene",
      "Init3DView",
      "resize3DView",
      // "setupCamera"
    ]),

    // ...mapActions("view3DStore", ["Init3DView", "resize3DViews"]),

    // ...mapActions("viewsStore", ["init3DView"]),
    fnOnlod() {
      this.initCompData_AxialDataInfo();
    },
    resizeViews() {
      // this.resize3DViews();
      this.resizeSliceViews();
      // this.setupCamera();

      this.resize3DView()


    },
    initCompData_SagittalData() {
      const { Ww, Wl, changedPageIndex, dimension, hu } = this.SagittalData;
      // let group = [
      //   { label: 'Image', value: `${changedPageIndex}/${dimension}` },
      // ]
      // this.$set(this.SagittalDataInfo, "group", group);
      this.$set(this.SagittalDataInfo, "image", `${changedPageIndex}/${dimension}`);


      this.$set(this.SagittalDataInfo, "HuVal", hu);


    },
    initCompData_CoronalData() {
      const { Ww, Wl, changedPageIndex, dimension, hu } = this.CoronalData;

      this.$set(this.CoronalDataInfo, "image", `${changedPageIndex}/${dimension}`);


      this.$set(this.CoronalDataInfo, "HuVal", hu);



    },
    initCompData_AxialDataInfo() {
      const { Ww, Wl, changedPageIndex, dimension, hu } = this.AxialData;

      const localDb = getStorage('#_st', 'studySelectItem', true)

      if (localDb) {
        const storage = createWebStorage('#_st', { isLocal: true, })
        const skItem = storage.get('studySelectItem')
        if (skItem) {
          this.$set(this.AxialDataInfo, "studies_selected", { ...skItem });
        } else {
          throw new Error(`vuex+storge都不存在-studySelectItem`)
        }
      } else {
        this.$set(this.AxialDataInfo, "studies_selected", this.studies_selected);
      }


      this.$set(this.AxialDataInfo, "image", `${changedPageIndex}/${dimension}`);

      // this.$set(this.AxialDataInfo, "KvpVal", '120');

      this.$set(this.AxialDataInfo, "HuVal", hu);

      // this.$set(this.AxialDataInfo, "SpacVal", "0.96/0.96");

      // this.$set(this.AxialDataInfo, "DimensionVal", `${coronalCount}/${sagittalCount}`);

    }
  },

  beforeDestroy() {
    this.beforeViewDestory();
  },
  mounted() {
    this.$nextTick(() => {
      // this.setSlice_CT_pic_layout("1");
      this.layout = "1"
      // this.Init3DView(this.$refs.View3DRef);/

      this.Init3DScene(this.$refs.View3DRef);

      this.InitAxialView(this.$refs.ViewAxialRef);
      this.InitCoronalView(this.$refs.ViewCoronalRef);
      this.InitSagittalView(this.$refs.ViewSagittalRef);

      // window.addEventListener('load', this.fnOnlod)
      setTimeout(() => {
        this.fnOnlod();

      }, 3000)
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
  // background-color: rgba(161, 148, 148, 0.192);
  background: #262626;
}

.viewbox {
  // background-color: rgba(255, 255, 255, 0.242);
  background: #262626;
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

.pic_layout_recon {
  display: grid;
  grid-template-columns: 1fr 1fr; // 两列，各占50%
  grid-template-rows: 1fr; // 设置行高度为1fr，使每行占满高度
  grid-template-areas: "left right"; // 第1个元素在左边，第二个在右边
  height: 100%; // 让父容器高度为100%

  &>div {
    &:nth-child(1) {
      grid-area: right; // 第1个元素在左边
      height: 100%; // 高度占满
    }

    &:nth-child(2) {
      grid-area: left; // 第2个元素在右边
      height: 100%; // 高度占满
    }

    &:nth-child(3),
    &:nth-child(4) {
      visibility: hidden; // 隐藏第3和第4个元素
      // 如果想完全移除，可以使用 display: none;
      // display: none;
    }
  }




  .side {
    background: rgb(0, 0, 0);
    height: 100%;
    border: 1px solid rgb(14, 17, 23);
  }
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
