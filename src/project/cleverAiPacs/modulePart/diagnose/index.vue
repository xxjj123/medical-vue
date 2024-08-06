<template>
  <div class="diagnose_page flex flex-col">
    <!-- diagnose_page -->
    <PacsPageHeader :bread="true" :filmModeBtn="true">
      <template slot="filmModeCtrl">
        <filmBar></filmBar>
        <div class="fixFileMuil">
          <input ref="Fileinput" type="file" multiple @change="handleFile" />
        </div>
      </template>
    </PacsPageHeader>
    <div class="main">
      <div class="pacs_container">
        <div class="toolBar">
          <vskToolbar></vskToolbar>
        </div>
        <!-- <div class="pic_views pic_layout">
          <div class="side viewbox"></div>
          <div class="side viewbox"></div>
          <div class="side viewbox"></div>
          <div class="side viewbox"></div>
        </div> -->
        <div>
          <ViewBoard></ViewBoard>
        </div>
        <div class="menu_data">
          <menudataBar
            v-if="menubarShow"
            v-model="DiagnoseMenuResult"
          ></menudataBar>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='javascript'>
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

// import ViewBoard from "@/project/clevelAiPacs/modulePart/diagnose/view/index.vue";
// import toolBar from "@/picComps/home/dataresult/toolBar.vue";
// import calciumResult from "@/picComps/home/dataresult/calciumResult.vue";
// import fracResult from "@/picComps/home/dataresult/fracResult.vue";
// import noduleResult from "@/picComps/home/dataresult/noduleResult.vue";
// import pneumoniaResult from "@/picComps/home/dataresult/pneumoniaResult.vue";

import {
  getExaDetail_keya,
  readBlobAsArrayBuffer,
  getExaminationDetail,
  getFile,
  getDiagnoseResult,
  getSysDict,
} from "@/api";

import JSZip from "jszip";
import PacsPageHeader from "@/components/pacs-page-header/index.vue";
export default {
  name: "diagnose",
  components: {
    PacsPageHeader,
    // ViewBoard,
    // toolBar,
    // calciumResult,
    // fracResult,
    // noduleResult,
    // pneumoniaResult,
    vskToolbar,
    filmBar,
    menudataBar,
    ViewBoard,
  },
  computed: {
    // 测试 ------ 使用方法时，指定一下模块即可
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
    };
  },
  methods: {
    // 测试
    ...mapActions("toolsStore", ["actRun", "updateActRun"]),
    ...mapMutations("viewsStore", ["SET_HELLOVIEWS"]),
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
      // const loading = ElLoading.service({
      //   lock: true,
      //   text: 'Loading',
      //   background: 'rgba(0, 0, 0, 0.7)'
      // })]l
      console.log("handleFilehandleFile", e);

      const files = Array.from(e.target.files);

      await this.readFile(files);
      // await
      /* await this.processDicomFiles(files);
      console.log("processDFile==imageData", this.imageData);
      console.log(
        "processDFile==imageData:getDimensions",
        this.imageData.getDimensions()
      ); */

      // const applyId = "83299b46-8d18-4e41-88eb-cab1afa67523";
      // await this.Diagnose(applyId);
      // loading.close()
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
    Diagnose(applyId) {
      return new Promise(async (resolve, reject) => {
        const result = await getDiagnoseResult(applyId);
        console.log("result-Diagnose", result);
        this.DiagnoseMenuResult = result;
        this.menubarShow = true;
        // .then((res) => {
        //   if (res.message === "success") {
        //     let data = res.data.result;
        //     console.log(data);
        //     /**
        //      * TODO:更新面板数据
        //      */

        //     resolve(res); // Success: resolve result
        //   } else {
        //     reject(res.message);
        //   }
        // })
        // .catch((err) => {
        //   console.log(err);
        //   reject(err); // Error: reject with error
        // });
        // const data = await getExaDetail_keya();
        // console.log("data==,data  keya", data);
        /*     const data = await getExaminationDetail(applyId);
        console.log("row==getExaminationDetail", data);
        try {
          this.menuResult.forEach((item) => {
            item.data = data[item.des];
          });
          // Set the first available diagnosis as activeDiagnose
          const firstValidDiagnosis = this.menuResult.find((item) => item.data);
          if (firstValidDiagnosis) {
            this.activeDiagnose = firstValidDiagnosis;
          }
          resolve(data); // Success: resolve result
        } catch (error) {
          reject(error);
        } */
      });
    },
    async loadFile(applyId) {
      console.time("unzip");
      // return new Promise((resolve, reject) => {
      try {
        const res = await getFile(applyId);
        console.log("res----fetch", res);
        // debugger;
        const fileList = [];
        const zip = new JSZip();
        const blob = res.data;

        // 将 Blob 转换为 ArrayBuffer
        const arrayBuffer = await readBlobAsArrayBuffer(blob);

        const zipContent = await zip.loadAsync(arrayBuffer);
        // const zipContent = zip.loadAsync(blob);

        const filePromises = [];
        console.log("zipContent==", zipContent);
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

        // console.log("filePromises=", filePromises);
        // return Promise.all(filePromises)
        //   .finally(() => {
        //     // console.timeEnd("unzip");
        //     console.log("fileList=", fileList);
        //     return Promise.resolve(fileList);
        //   })
        //   .catch((err) => {
        //     console.error("filePromises===err", err);
        //     return Promise.reject(err);
        //   });
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
  },
  created() {
    this.SET_HELLOVIEWS("hello world~");
    console.log("helloViews==", this.helloViews);
    console.log("combinedState==", this.combinedState);
    this.actRun({ a: 1 });

    setTimeout(() => {
      this.SET_HELLOVIEWS("WWWW~");
      this.actRun({ a: 2 });

      this.updateActRun({ q: 123123 });
    }, 5000);

    console.log("this.$router", this.$router);

    getSysDict().then((res) => {
      const carplay = localStorage.getItem("carplay");
      if (!carplay) {
        localStorage.setItem("carplay", JSON.stringify(res));
      } else {
        console.log("carplay-已存在");
      }
      const { applyId } = this.$route.query;
      this.Diagnose(applyId);
    });

    this.setClockUpdateDict();
    /*
    this.$nextTick(() => {
      const { applyId } = this.$route.query;
      // , this.Diagnose(applyId)
      // console.log("Diagnose==",Diagnose);
      this.Diagnose(applyId);
      Promise.all([this.Diagnose(applyId), this.loadFile(applyId)])
        .then((res) => {
          console.log("最终=", res);
          // debugger;
          this.readFile(res[1]);
        })
        .catch((err) => {
          console.log(err);
          Message(err);
        })
        .finally(() => {
          loading.close();
        });
    }); */
  },
  mounted() {},
};
</script>
<style lang='less' scoped>
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
  background: rgba(104, 102, 102, 0.774);
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
</style>
