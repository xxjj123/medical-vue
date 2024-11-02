<template>
  <div class="diagnose_page flex flex-col">

    <!-- diagnose_page -->
    <PacsPageHeader :bread="true" :filmModeBtn="true">
      <template slot="filmModeCtrl">

        <filmBar ref="filmBarRef"></filmBar>

      </template>
      <template slot="vtkTool">
        <vskToolbar ref="vskToolbarRef">
        </vskToolbar>
        <!-- <button class="mr-10" @click="nodule">结节</button>

        <button class="mr-10" @click="pneumonia">肺炎</button> -->


        <!-- <button @click="hidedraw">隐藏</button> -->


        <!-- <button @click="clip3D">切割</button>   -->
        <!-- <button class="mr-10" @click="initNodule">结节ini</button>
        <button @click="initCube">initCube</button> -->



      </template>

    </PacsPageHeader>
    <div class="main">
      <div class="pacs_container">
        <!-- <div class="toolBar"> -->
        <!-- <button @click="getRecon">靶重建</button> -->
        <!-- <button @click="add3DCube">添加3d</button>
          <button @click="clip3D">切割</button>
          <button @click="back">还原</button> -->


        <!-- <vskToolbar ref="vskToolbarRef" @UpdateColorWindow="UpdateColorWindow_self"
            @UpdateColorLevel="UpdateColorLevel_self" @ChangePan="ChangePan_self" @GetRecon="GetRecon_self"
            :windowcolor="{ ww: 1500, wl: -500 }">
          </vskToolbar> -->
        <!-- </div> -->
        <div>
          <ViewBoard :seriesInfo="seriesInfo"></ViewBoard>
        </div>
        <div class="menu_data">
          <menudataBar v-if="menubarShow"></menudataBar>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="javascript">
import vskToolbar from "@/picComps/visualTool/tool-bar/index.vue";
import filmBar from "@/picComps/visualTool/film-bar/index.vue";
import menudataBar from "@/picComps/visualTool/menudata-bar/index.vue";

import ViewBoard from "./view/ViewBoard.vue";

import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
} from "vuex";

import {
  getSysDict,
  xhr_getSeriesInfo,
  xhr_queryNodule,
} from "@/api";

import {
  ButtonNames,
  LayoutIcons
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";

import JSZip from "jszip";
import PacsPageHeader from "@/components/pacs-page-header/index.vue";


export default {
  name: "diagnose",
  components: {
    PacsPageHeader,
    vskToolbar,
    filmBar,
    menudataBar,
    ViewBoard,
  },
  computed: {
    ...mapState("toolBarStore", ["slice_CT_pic_layout"]),

  },
  data() {
    return {
      ActiveIndex: 0,
      menubarShow: false,

      seriesInfo: {},
    };
  },
  watch: {

  },
  methods: {
    ...mapMutations("mprViewStore", ["SET_SERIES_INFO"]),
    ...mapActions("mprViewStore", ["UpdateDraw", "UpdateDiagnoseState", "InitSlice", "SetAllViewData"]),
    ...mapActions("mprToolsStore", ["UpdateColorWindow", "UpdateColorLevel", "ChangePan"]),

    ...mapActions("noduleInfoStore", ["InitNoduleState", "ActiveNoduleState", "InitAnnotations"]),
    ...mapMutations("noduleInfoStore", ["SET_NODULE_INFO"]),

    ...mapActions("pneumoniaInfoStore", ["InitPneumoniaState"]),

    ...mapActions("fracInfoStore", ["InitFracState"]),
    ...mapMutations("toolBarStore", ["INIT_BUTTON_ACTIVE_STATE", "INIT_BUTTON_SHOW_STATE", "SET_SLICE_CT_PIC_LAYOUT"]),

    ...mapActions("view3DStore", [
      "Init3DScene",
      "Init3DView",
      "AddCube",
      "CubeClip",
      "setupCamera",
      "Back"
    ]),


    getRecon() {
      console.log("切换靶重建", LayoutIcons.RECON)
      this.SET_SLICE_CT_PIC_LAYOUT(LayoutIcons.RECON);

    },
    clip3D() {
      this.CubeClip()
    },
    add3DCube() {
      this.AddCube()
    },
    back() {
      this.Back()
    },
    nodule() {
      this.ActiveNoduleState()
    },
    pneumonia() {
      this.ActivePneumoniaState()
    },


    async GetSeriesInfo(computeSeriesId) {
      try {
        const result = await xhr_getSeriesInfo({ computeSeriesId });
        if (result.serviceSuccess) {
          return result.data.resultData;
        }
        return null; // 如果 serviceSuccess 为 false，返回 null
      } catch (error) {
        return null; // 出现错误时返回 null
      }
    }



    ,
    async GetNodoleInfo(computeSeriesId) {
      try {
        const result = await xhr_queryNodule({ computeSeriesId });
        if (result.serviceSuccess) {
          return result.data.resultData;
        }
        return null; // 如果 serviceSuccess 为 false，返回 null
      } catch (error) {
        return null; // 出现错误时返回 null
      }

    },


  },
  created() {
    getSysDict().then(async (res) => {
      const carplay = localStorage.getItem("carplay");
      if (!carplay) {
        localStorage.setItem("carplay", JSON.stringify(res));
      } else {
        // console.log("carplay-已存在");
      }
      const { computeSeriesId } = this.$route.query;
      const noduleInfo = await this.GetNodoleInfo(computeSeriesId);
      console.log("noduleInfonoduleInfonoduleInfo", noduleInfo)
      if (noduleInfo) {
        this.SET_NODULE_INFO(noduleInfo);
        this.menubarShow = true
      }
      const seriesInfo = await this.GetSeriesInfo(computeSeriesId);
      if (seriesInfo) {
        // console.log(seriesInfo)
        this.Init3DView(seriesInfo.seriesId)
        this.SET_SERIES_INFO(seriesInfo);
        this.InitNoduleState(seriesInfo);
        this.InitPneumoniaState(seriesInfo);
        this.InitFracState(seriesInfo)
        this.ActiveNoduleState()
      }

    });


  },
  beforeDestroy() {
    // 执行退出前的清理操作
    console.log('组件即将被销毁');
  }

};
</script>
<style lang="less" scoped>
.diagnose_page {
  background-color: @theme_backBg;
  width: 100vw;
  height: 100vh;
}

.main {
  flex-grow: 1;
  height: calc(100% - 80px);
  overflow: hidden;
}

.pacs_container {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: calc(100% - 425px) 425px;
  grid-template-rows: 100%;
  // background: rgba(104, 102, 102, 0.774);
}

.toolBar {
  // width: 22%;
  max-width: 85px;
  height: 100%;
  background-color: @theme_backBg;
  padding: 49px 16px 0 22px;
}

.fixFileMuil {
  position: fixed;
  top: 0;
  left: 50%;
}

.menu_data {
  background: #1F1F1F;
}
</style>
