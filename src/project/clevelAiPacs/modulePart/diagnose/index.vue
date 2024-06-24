<template>
  <div class="diagnose_page flex flex-col">
    <!-- diagnose_page -->
    <PacsPageHeader :bread="true" :filmModeBtn="true">
      <template slot="filmModeCtrl">
        <filmBar></filmBar>
      </template>
    </PacsPageHeader>
    <div class="main">
      <div class="pacs_container">
        <div class="toolBar">
          <vskToolbar></vskToolbar>
        </div>
        <div class="pic_views pic_layout">
          <div class="side viewbox"></div>
          <div class="side viewbox"></div>
          <div class="side viewbox"></div>
          <div class="side viewbox"></div>
        </div>
        <div class="menu_data">
          <menudataBar></menudataBar>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='javascript'>
import vskToolbar from "@/picComps/visualTool/tool-bar/index.vue";
import filmBar from "@/picComps/visualTool/film-bar/index.vue";
import menudataBar from "@/picComps/visualTool/menudata-bar/index.vue";

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

import { getExaminationDetail, getFile } from "@/api";
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
  },
  computed: {
    // 测试 ------ 使用方法时，指定一下模块即可
    ...mapState("viewsStore", ["helloViews"]),
    ...mapState("toolsStore", ["helloTools"]),
    ...mapGetters("toolsStore", ["combinedState"]),
  },
  data() {
    return {
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
    };
  },
  methods: {
    // 测试
    ...mapActions("toolsStore", ["actRun", "updateActRun"]),
    ...mapMutations("viewsStore", ["SET_HELLOVIEWS"]),
    // 正规业务start
    ...mapActions("viewsStore", ["ReadFile"]),

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
      return new Promise((resolve, reject) => {
        getExaminationDetail(applyId)
          .then((res) => {
            if (res.msg === "success") {
              let data = res.data;

              this.menuResult.forEach((item) => {
                item.data = data[item.des];
              });
              // Set the first available diagnosis as activeDiagnose
              const firstValidDiagnosis = this.menuResult.find(
                (item) => item.data
              );
              if (firstValidDiagnosis) {
                this.activeDiagnose = firstValidDiagnosis;
              }

              resolve(res); // Success: resolve result
            } else {
              reject(res.message);
            }
          })
          .catch((err) => {
            console.log(err);
            reject(err); // Error: reject with error
          });
      });
    },
    loadFile(applyId) {
      console.time("unzip");
      return new Promise((resolve, reject) => {
        try {
          getFile(applyId).then((res) => {
            const fileList = [];
            const zip = new JSZip();
            const blob = res.data;
            const zipContent = zip.loadAsync(blob);

            const filePromises = [];

            zipContent.forEach((relativePath, zipEntry) => {
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

            Promise.all(filePromises).then(() => {
              console.timeEnd("unzip");
              resolve(fileList);
            });
          });
        } catch (err) {
          console.error(err);
          reject(err);
        }
      });
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
  },
  mounted() {
    this.$nextTick(() => {
      const { applyId } = this.$route.query;

      Promise.all([this.loadFile(applyId), this.Diagnose(applyId)])
        .then((res) => {
          this.ReadFile(res[0]);
        })
        .catch((err) => {
          console.log(err);
          Message(err);
        })
        .finally(() => {
          loading.close();
        });
    });
  },
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
  padding: 49px 27px 0 27px;
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
