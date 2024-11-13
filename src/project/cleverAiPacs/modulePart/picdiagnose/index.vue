<template>
  <div class="diagnose_page flex flex-col">
    <!-- {{ allViewData }} -->
    <PacsPageHeader :bread="true" :filmModeBtn="true">

      <template slot="vtkTool">
        <vskToolbar ref="vskToolbarRef">
        </vskToolbar>


      </template>

    </PacsPageHeader>
    <div class="main">
      <div class="pacs_container">

        <div>
          <PicBoard />
        </div>
        <div class="menu_data">
          <MenuData />
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


  },
  computed: {
    ...mapState("spineViewStore", ["allViewData"])
  },
  methods: {
    ...mapMutations("toolBarStore", ["INIT_BUTTON_ACTIVE_STATE", "INIT_BUTTON_SHOW_STATE"]),
    ...mapActions("toolBarStore", ["setActiveModule"]),



    ...mapMutations("spineViewStore", ["SET_STATE_DATA"]),
    ...mapActions("spineViewStore", [
      "UpdateColorWindow",
      "UpdateColorLevel",
      "ChangePan"
    ]),

  },
  created() {

    this.setActiveModule('SPINE')


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
