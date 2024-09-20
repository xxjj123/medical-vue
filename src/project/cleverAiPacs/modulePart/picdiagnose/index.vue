<template>
  <div class="diagnose_page flex flex-col">
    <!-- diagnose_page -->
    <PacsPageHeader :bread="true" :filmModeBtn="true">
      <template slot="filmModeCtrl">
        <!-- <filmBar @changeColor="changeColor"></filmBar> -->
        <!-- <div class="fixFileMuil">
          <input ref="Fileinput" type="file" multiple @change="handleFile" />
        </div> -->
      </template>
    </PacsPageHeader>
    <div class="main">
      <div class="pacs_container">
        <div class="toolBar">
          <vskToolbar ref="vskToolbarRef"></vskToolbar>
        </div>
        <div>
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

    };
  },
  methods: {

  },
  created() {

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
