<template>
  <div class="diagnose_page flex flex-col">

    <PacsPageHeader :bread="true" :filmModeBtn="true">
      <template slot="filmModeCtrl">

        <filmBar ref="filmBarRef"></filmBar>

      </template>
      <template slot="vtkTool">
        <vskToolbar ref="vskToolbarRef">
        </vskToolbar>


      </template>

    </PacsPageHeader>
    <div class="main">
      <div class="pacs_container">

        <div>
          <ViewBoard :seriesInfo="seriesInfo"></ViewBoard>
        </div>
        <div class="menu_data">
          <menudataBar></menudataBar>
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

// import {
//   ButtonNames,
//   LayoutIcons
// } from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";

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

      seriesInfo: {},
    };
  },
  watch: {

  },
  methods: {
    // ...mapMutations("lungViewStore", ["SET_SERIES_INFO"]),
    // ...mapActions("lungViewStore", ["InitAllSlice", "beforeViewDestory"]),




    ...mapMutations("mprViewStore", ["SET_SERIES_INFO"]),
    ...mapActions("lungViewStore", ["InitAllSlice", "beforeViewDestory"]),

    ...mapActions("toolBarStore", ["setActiveModule"]),


    ...mapActions("view3DStore", [
      "Init3DScene",
      "Init3DView",
      "AddCube",
      "CubeClip",
      "setupCamera",
      "Back"
    ]),



    clip3D() {
      this.CubeClip()
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
    this.setActiveModule('MPR')
    // const carplay = localStorage.getItem("carplay");
    // if (!carplay) {
    //   localStorage.setItem("carplay", JSON.stringify(res));
    // }
    const { computeSeriesId } = this.$route.query;

    const seriesInfo = await this.GetSeriesInfo(computeSeriesId);
    if (seriesInfo) {
      console.log(seriesInfo)
      // const ijk = [SagittalData.changedPageIndex, CoronalData.changedPageIndex, AxialData.changedPageIndex]
      const dimensions = [seriesInfo.sagittalCount, seriesInfo.coronalCount, seriesInfo.axialCount]
      const ijk = dimensions.map(item => Math.round(item / 2) + 1)

      this.$nextTick(async () => {
        this.Init3DView(seriesInfo.seriesId)
        this.SET_SERIES_INFO(seriesInfo);
        this.InitAllSlice(seriesInfo)
        // await this.InitAllSlice(seriesInfo)

      })

    }
    // getSysDict().then(async (res) => {
    //   this.setActiveModule('MPR')
    //   const carplay = localStorage.getItem("carplay");
    //   if (!carplay) {
    //     localStorage.setItem("carplay", JSON.stringify(res));
    //   }
    //   const { computeSeriesId } = this.$route.query;

    //   const seriesInfo = await this.GetSeriesInfo(computeSeriesId);
    //   if (seriesInfo) {
    //     console.log(seriesInfo)
    //     // const ijk = [SagittalData.changedPageIndex, CoronalData.changedPageIndex, AxialData.changedPageIndex]
    //     const dimensions = [seriesInfo.sagittalCount, seriesInfo.coronalCount, seriesInfo.axialCount]
    //     const ijk = dimensions.map(item => Math.round(item / 2) + 1)

    //     this.$nextTick(async () => {
    //       this.Init3DView(seriesInfo.seriesId)
    //       this.SET_SERIES_INFO(seriesInfo);
    //       this.InitAllSlice(seriesInfo)
    //       // await this.InitAllSlice(seriesInfo)

    //     })

    //   }

    // });


  },
  beforeDestroy() {
    this.beforeViewDestory();
  },

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
