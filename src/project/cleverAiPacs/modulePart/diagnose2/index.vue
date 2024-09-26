<template>
  <div class="diagnose_page flex flex-col">
    <!-- diagnose_page -->
    <PacsPageHeader :bread="true" :filmModeBtn="true">
      <template slot="filmModeCtrl">
        <filmBar ref="filmBarRef" @changeColor="changeColor"></filmBar>
        <!-- <div class="fixFileMuil">
          <input ref="Fileinput" type="file" multiple @change="handleFile" />
        </div> -->
      </template>
    </PacsPageHeader>
    <div class="main">
      <div class="pacs_container">
        <div class="toolBar">
          <vskToolbar ref="vskToolbarRef" @UpdateColorWindow="UpdateColorWindow_self"
            @UpdateColorLevel="UpdateColorLevel_self" @ChangePan="ChangePan_self" :windowcolor="{ ww: 1500, wl: -500 }">
          </vskToolbar>
        </div>
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

import {
  ButtonNames,
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";

import JSZip from "jszip";
import PacsPageHeader from "@/components/pacs-page-header/index.vue";


//视窗，窗宽窗位
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
    ViewBoard,
  },
  computed: {
    ...mapState("viewInitStore", ["noduleDiagnoseState"]),
    ...mapState("viewsStore", [
      "helloViews",
      "imageData",
      "view3D",
      "viewMprViews",
      "viewsData",
      "imageData",
      "mouseDown",
      "Coronal",
      "Axial",
      "Sagittal",
    ]),
    ...mapState("toolsStore", ["helloTools", "widget"]),
    ...mapGetters("toolsStore", ["combinedState"]),

  },
  data() {
    return {
      ActiveIndex: 0,
      menubarShow: false,
      vskToolbarData: {},
      viewTheme: "",
      showsub: true,
      menuResult: [
        { des: "nodule", title: "结节", comp: "nodule" },
        { des: "pneumonia", title: "肺炎", comp: "pneumonia" },
        { des: "frac", title: "骨折", comp: "pneumonia" },
        { des: "calcium", title: "钙化积分", comp: "pneumonia" },
      ],
      activeDiagnose: null,
      activeIndex: null,
      DiagnoseMenuResult: {},
      seriesInfo: {},
    };
  },
  watch: {
    noduleDiagnoseState: {
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
  methods: {
    ...mapMutations("toolBarStore", ["INIT_BUTTON_ACTIVE_STATE", "INIT_BUTTON_SHOW_STATE"]),

    ...mapMutations("viewInitStore", ["SET_SERIES_INFO", "SET_NODULE_INFO", "SET_NODULE_DIAGNOSE_DATA"]),

    ...mapActions("viewInitStore", ["InitSlice", "UpdateColorWindow", "UpdateColorLevel", "ChangePan"]),
    // 测试
    ...mapActions("toolsStore", ["actRun", "updateActRun"]),
    // 正规业务start
    ...mapActions("viewsStore", ["readFile", "processDicomFiles"]),

    // 定时更新dict(developer)
    async setClockUpdateDict() {
      setInterval(() => {
        getSysDict().then((res) => {
          localStorage.setItem("carplay", JSON.stringify(res));
        });
      }, 10000);
    },

    async handleFile(e) {
      const files = Array.from(e.target.files);

      await this.readFile(files);
    },
    // 本页面方法

    ChangeTheme(theme) {
      this.viewTheme = theme;
      // toolsStore.resizeWindow()
    },
    ChangeSubshow() {
      this.showsub = !this.showsub;
    },
    SelectDiagnose(key) {
      this.menuResult.forEach((item, index) => {
        if (item.des === key) {
          this.activeDiagnose = item;
          this.activeIndex = index;
        }
      });
    },
    GetSeriesInfo(computeSeriesId) {
      return new Promise(async (resolve, reject) => {
        const result = await xhr_getSeriesInfo({ computeSeriesId });
        if (result.serviceSuccess) {
          let seriesInfo = result.data.resultData;
          this.seriesInfo = seriesInfo;
          this.SET_SERIES_INFO(seriesInfo);
          this.InitSlice();
        }
      });
    },
    changeColor(colorwindow, colrlevel) {
      requestAnimationFrame(() => {
        this.$refs.vskToolbarRef.changeColor(colorwindow, colrlevel)
      })
    },
    async Diagnose(computeSeriesId) {
      return new Promise(async (resolve, reject) => {
        const result = await xhr_queryNodule({ computeSeriesId });
        if (result.serviceSuccess) {
          this.SET_NODULE_INFO(result.data.resultData);
          //结节病变列表查询
          // const newRes = await xhr_queryNodule({computeSeriesId: "1825804835303624706"})
          // console.log("newRes====", newRes);

          this.menubarShow = true;
        } else {
          console.log("xhr_queryNodule失败");
        }
        // const result = await xhr_getNoduleInfo({computeSeriesId});
        // if (result.serviceSuccess) {
        //   console.log(result.data.resultData);
        //   //TODO: wait turn new api
        //   this.SET_NODULE_INFO(result.data.resultData);


        //   this.menubarShow = true;
        // } else {
        //   console.log("xhr_getNoduleInfo失败");
        // }
      });
    },

    async loadFile(applyId) {
      console.time("unzip");
      try {
        const res = await getFile(applyId);
        const fileList = [];
        const zip = new JSZip();
        const blob = res.data;

        // 将 Blob 转换为 ArrayBuffer
        const arrayBuffer = await readBlobAsArrayBuffer(blob);

        const zipContent = await zip.loadAsync(arrayBuffer);
        // const zipContent = zip.loadAsync(blob);

        const filePromises = [];
        // console.log("zipContent==", zipContent);
        zipContent.forEach((relativePath, zipEntry) => {
          // console.log("relativePath, zipEntry===", relativePath, zipEntry);
          if (!zipEntry.dir) {
            const filePromise = zipEntry.async("blob").then((fileData) => {
              const blob = new Blob([fileData], {
                type: zipEntry._data ? zipEntry._data.mimeType : "",
              }); // Create Blob object
              const file = new File([blob], relativePath); // Create File object
              fileList.push(file);
            });
            filePromises.push(filePromise);
          }
        });

        await Promise.all(filePromises);
        console.timeEnd("unzip");
        return fileList;
      } catch (err) {
        console.error(err);
        // return Promise.reject(err);
        throw err;
      }
      // });
    },
    UpdateColorWindow_self(nVal) {
      this.UpdateColorWindow(nVal)
      this.SET_NODULE_DIAGNOSE_DATA({
        key: "colorWindow",
        value: nVal
      })
    },
    UpdateColorLevel_self(nVal) {
      this.UpdateColorLevel(nVal)
      this.SET_NODULE_DIAGNOSE_DATA({
        key: "colorLevel",
        value: nVal
      })
    },
    ChangePan_self() {
      this.ChangePan();
    }
  },
  created() {
    this.actRun({ a: 1 });

    setTimeout(() => {
      this.actRun({ a: 2 });

      this.updateActRun({ q: 123123 });
    }, 5000);

    // console.log("this.$router", this.$router);

    getSysDict().then((res) => {
      const carplay = localStorage.getItem("carplay");
      if (!carplay) {
        localStorage.setItem("carplay", JSON.stringify(res));
      } else {
        // console.log("carplay-已存在");
      }
      const { computeSeriesId } = this.$route.query;
      this.Diagnose(computeSeriesId);
      this.GetSeriesInfo(computeSeriesId);
    });

    this.setClockUpdateDict();

    this.INIT_BUTTON_SHOW_STATE([ButtonNames.Layout, ButtonNames.Ckcw, ButtonNames.Jbinfo, ButtonNames.Szckx, ButtonNames.Pyms])
    this.INIT_BUTTON_ACTIVE_STATE([ButtonNames.Jbinfo])
  },
  mounted() { },
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
