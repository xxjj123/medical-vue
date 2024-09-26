<template>
  <div class="diagnose_page flex flex-col">
    <!-- diagnose_page -->
    <PacsPageHeader :bread="true" :filmModeBtn="true">
      <template slot="filmModeCtrl">
        <filmBar ref="filmBarRef" @changeColor="changeColor"></filmBar>

      </template>
    </PacsPageHeader>
    <div class="main">
      <div class="pacs_container">
        <div class="toolBar">

          <vskToolbar ref="vskToolbarRef" @UpdateColorWindow="UpdateColorWindow_self"
            @UpdateColorLevel="UpdateColorLevel_self" @ChangePan="ChangePan_self" :windowcolor="{ ww: 4094, wl: 2046 }">
          </vskToolbar>
        </div>
        <div class="h-full w-full border-amber-3">
          <PicBoard />

        </div>
        <div class="menu_data">
          <MenuData />
          <!-- <menudataBar v-if="menubarShow"></menudataBar> -->
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="javascript">
import vskToolbar from "@/picComps/visualTool/tool-bar/index.vue";
import filmBar from "@/picComps/visualTool/film-bar/index.vue";
import menudataBar from "@/picComps/visualTool/menudata-bar/index.vue";

import PicBoard from "./view/PicBoard.vue"
import MenuData from "@/picComps/picDiagnose/menudata/lung/index.vue"
import {
  ButtonNames,
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
  createNamespacedHelpers,
} from "vuex";

import {
  getExaDetail_keya,
  readBlobAsArrayBuffer,
  getExaminationDetail,
  getFile,
  getDiagnoseResult,
  getSysDict,
  xhr_getNoduleInfo,
  xhr_getSeriesInfo,
  xhr_queryNodule,
} from "@/api";

import JSZip from "jszip";
import PacsPageHeader from "@/components/pacs-page-header/index.vue";

const winCtrl = {
  lung: {
    ww: 1500,
    wl: -500,
  },
  mediastinal: {
    ww: 300,
    wl: 50,
  },
  bone: {
    ww: 1500,
    wl: 300,
  },
};

export default {
  name: "diagnose",
  components: {
    PacsPageHeader,
    vskToolbar,
    filmBar,
    menudataBar,
    MenuData,
    PicBoard
  },
  data() {
    return {
      ActiveIndex: null,
    };
  },
  watch: {


    diagnoseState: {
      handler(nVal, oVal) {
        requestAnimationFrame(() => {
          let colorWindow = nVal.colorWindow
          let colorLevel = nVal.colorLevel

          if (winCtrl.lung.ww == colorWindow && winCtrl.lung.wl == colorLevel) {
            this.$refs.filmBarRef.activate(0)
          } else if (winCtrl.mediastinal.ww == colorWindow && winCtrl.mediastinal.wl == colorLevel) {

            this.$refs.filmBarRef.activate(1)
          } else if (winCtrl.bone.ww == colorWindow && winCtrl.bone.wl == colorLevel) {
            this.$refs.filmBarRef.activate(2)
          }
        })
      },
      deep: true,
      immediate: true,
    }
  },
  computed: {
    ...mapState("picViewStore", ["diagnoseState"])
  },
  methods: {
    ...mapMutations("toolBarStore", ["INIT_BUTTON_ACTIVE_STATE", "INIT_BUTTON_SHOW_STATE"]),
    ...mapMutations("picViewStore", ["SET_STATE_DATA"]),
    ...mapActions("picViewStore", [
      "UpdateColorWindow",
      "UpdateColorLevel",
      "ChangePan"
    ]),
    UpdateColorWindow_self(nVal) {
      this.UpdateColorWindow(nVal)
      this.SET_STATE_DATA({
        key: "colorWindow",
        value: nVal
      })
    },
    UpdateColorLevel_self(nVal) {
      this.UpdateColorLevel(nVal)
      this.SET_STATE_DATA({
        key: "colorLevel",
        value: nVal
      })
    },
    changeColor(colorwindow, colrlevel) {
      requestAnimationFrame(() => {
        this.$refs.vskToolbarRef.changeColor(colorwindow, colrlevel)

      })
    },
    ChangePan_self() {
      this.ChangePan()
    }
  },
  created() {
    this.INIT_BUTTON_SHOW_STATE([ButtonNames.Ckcw, ButtonNames.Jbinfo, ButtonNames.Pyms])
    this.INIT_BUTTON_ACTIVE_STATE([ButtonNames.Jbinfo])
  },
  mounted() { },
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
  grid-template-columns: 85px calc(100% - 505px) 420px;
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
