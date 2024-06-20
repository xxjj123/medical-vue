<template>
  <div class="diagnose_page">
    <!-- diagnose_page -->
    <div class="flex flex-col h-vh relative">
      <Header>
        <toolBar
          class="col-span-3"
          @ChangeTheme="ChangeTheme"
          @ChangeSubshow="ChangeSubshow"
          ref="toolBarRef"
        />
      </Header>
      <div class="absolute">
        <!-- <input ref="Fileinput" type="file" multiple @change="handleFile" /> -->
      </div>
      <div class="flex-1 flex bg-titleblue">
        <!-- mpr视图 -->
        <div class="h-full">
          <ViewBoard :theme="viewTheme" :showsub="showsub" ref="ViewBoardRef" />
        </div>
        <!-- 分析结果 -->
        <div class="w-110 flex flex-col">
          <div class="h-13 lh-13 w-full bg-sky-950 text-white text-3 px-5 flex">
            <div>admin</div>
            <div class="ml-auto flex">
              <div class="mr-8">收藏</div>
              <div>重置结果</div>
            </div>
          </div>
          <div class="px-3">
            <!-- <el-menu
              class="!h-10 !bg-transparent !border-0 !w-full"
              :default-active="menuResult[0].des"
              mode="horizontal"
              :ellipsis="false"
              @select="SelectDiagnose"
            >
              <template v-for="(item, index) in menuResult">
                <el-menu-item
                  class="!text-white !hover:bg-transparent !focus:bg-transparent"
                  :index="item.des"
                  :key="index"
                  ><span
                    v-if="activeDiagnose && activeDiagnose.data"
                    :style="{ color: item.data.hasLesion ? 'blue' : 'white' }"
                    >。</span
                  >{{ item.title }}</el-menu-item
                >
              </template>
            </el-menu> -->
          </div>
          <component
            v-if="activeDiagnose && activeDiagnose.data"
            :is="activeDiagnose.comp"
            :data="activeDiagnose.data"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='javascript'>
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
  createNamespacedHelpers,
} from "vuex";

import ViewBoard from "@/project/clevelAiPacs/modulePart/diagnose/view/index.vue";
import toolBar from "@/picComps/home/dataresult/toolBar.vue";
import calciumResult from "@/picComps/home/dataresult/calciumResult.vue";
import fracResult from "@/picComps/home/dataresult/fracResult.vue";
import noduleResult from "@/picComps/home/dataresult/noduleResult.vue";
import pneumoniaResult from "@/picComps/home/dataresult/pneumoniaResult.vue";

import { getExaminationDetail, getFile } from "@/api";
import JSZip from "jszip";

export default {
  name: "diagnose",
  components: {
    ViewBoard,
    toolBar,
    calciumResult,
    fracResult,
    noduleResult,
    pneumoniaResult,
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
}
</style>
