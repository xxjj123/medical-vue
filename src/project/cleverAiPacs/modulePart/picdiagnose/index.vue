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
  mapState,
  mapActions,
} from "vuex";

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
      ActiveIndex: null,
    };
  },
  computed: {
    ...mapState("spineViewStore", ["allViewData"])
  },
  methods: {
    ...mapActions("toolBarStore", ["setActiveModule"]),

  },
  created() {
    this.setActiveModule('SPINE')
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
