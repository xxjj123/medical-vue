<template>
  <div class="diagnose_page flex flex-col">
    <PacsPageHeader :bread="true" :filmModeBtn="true">

      <!-- <template slot="filmModeCtrl">
        <input class="hidden " ref="fileInputRef" type="file" @change="handleFileChange">
        <ta-button @click="triggerFileInput">
          <ta-icon type="upload" />
          选择文件
        </ta-button>

      </template> -->

      <template slot="vtkTool">
        <vskToolbar ref="vskToolbarRef" class="ml-[15px]" :toolsState="toolsState">
        </vskToolbar>

      </template>

    </PacsPageHeader>
    <div class="main">
      <div class="pacs_container">
        <div>
          <PicBoard />
        </div>
        <div class="menu_data">
          <!-- {{ toolsState.window }} -->
          <!-- <div>{{ allViewData }}</div> -->
          <!-- <img :src="image" alt="" class="w-[200px]"> -->

          <!-- <ta-button @click="addAngleWidget">测量角度</ta-button>
          <ta-button @click="hiddenAngle">隐藏角度</ta-button>


          测量角度：{{ allViewData.cobb }} -->
          <!-- {{ boneInfo.angle }} -->
          <!-- <ta-button @click="getAnnotationInfo">获取注释信息</ta-button>  -->

          <MenuData :boneInfo="boneInfo" />

        </div>


      </div>
    </div>
  </div>
  </div>
</template>
<script lang="javascript">
import vskToolbar from "@/picComps/visualTool/tool-bar/index.vue";
import menudataBar from "@/picComps/visualTool/menudata-bar/index.vue";

import PicBoard from "./view/PicBoard.vue"
import MenuData from "@/picComps/picDiagnose/menudata/spine/index.vue"


import {
  mapState,
  mapActions,
  mapGetters,
} from "vuex";

import PacsPageHeader from "@/components/pacs-page-header/index.vue";
import JSZip from "jszip";
// import dicomParser from "dicom-parser";
import spineInfo from './assets/boneInfo.json';

import { xhr_getSeriesInfo } from '@/api'

export default {
  name: "diagnose",
  components: {
    PacsPageHeader,
    vskToolbar,
    menudataBar,
    MenuData,
    PicBoard,
  },
  data() {
    return {
      ActiveIndex: null,
      spineInfo,
      boneInfo: {
        angle: null,
        dist: null,
        horangle: null,


      },
      image: "#"
    };
  },
  computed: {
    ...mapState("spineViewStore", ["allViewData"]),
    ...mapState("spineToolsStore", ["toolsState",]),
    // ...mapGetters("spineToolsStore", ["toolState"])

  },
  methods: {
    ...mapActions("toolBarStore", ["setActiveModule"]),
    ...mapActions("spineViewStore", ["InitCaseInfo", "resizeView", "beforeViewDestory", "GetSlice", "UpdateSlice", "addBoxes", "addKeyPoints", "addCobb", "getAnnotationInfo", "drawLine", "calculateAngle", "drawVerticalLine", "drawShape", "freshView"]),
    ...mapActions("spineToolsStore", ["UpdateWindowCenter", "UpdateWindowWidth", "invertView", "editBbox", "changetoolState", "resetView", "changePan", "zoomView", "magnifyView", "editCobb", "addAngleWidget", "hiddenAngle"]),

    triggerFileInput() {
      this.$refs.fileInputRef.click();
    },
    async handleFileChange(event) {
      console.log("handleFileChange");

      const files = event.target.files
      if (files && files.length > 0) {
        const file = files[0]
        console.log(file);
        this.boneInfo = {}
        await this.UpdateSlice({ file })

        this.boneInfo = this.spineInfo.template
        // // this.boneInfo = this.spineInfo.data.resultData.data
        // console.log(this.boneInfo);
        const { beginpnt1, beginpnt2, endpnt1, endpnt2, keypoints, boxes, keypnts } = this.boneInfo

        console.log("keypoints", keypoints);
        this.addKeyPoints({ contours: keypoints })
        this.addCobb({ cobbPoints: [beginpnt1, endpnt1, beginpnt2, endpnt2] })
        // const line1 = [beginpnt1, beginpnt1.map((coord, index) => (coord + endpnt1[index]) / 2)]
        // const line2 = [beginpnt2, beginpnt2.map((coord, index) => (coord + endpnt2[index]) / 2)]

        // this.drawLine({ points: line1, color: [0, 1, 0] })
        // this.drawLine({ points: line2, color: [0, 1, 0] })

        // this.addBoxes({ contours: boxes })
        // this.drawVerticalLine({ points: [beginpnt1, endpnt2], color: [0, 1, 0] })
        // this.drawVerticalLine({ points: [beginpnt2, endpnt1], color: [0, 1, 0] })
        // this.addAngleWidget()

        // this.calculateAngle({ line1, line2 })
        // this.freshView()


        // const zipfile = await this.zipFile(file)
        // xhr_getSpineInfo({ dicom: zipfile }).then(async (res) => {
        //   this.$message.success(`上传成功,: ${''}`);
        //   this.boneInfo = res.data.resultData.data
        //   console.log(res.data.resultData.data);
        //   const { beginpnt1, beginpnt2, endpnt1, endpnt2, keypoints, boxes, keypnts } = this.boneInfo
        //   this.addKeyPoints({ contours: keypoints })

        // })




      }
      event.target.value = null


    },
    async zipFile(file) {
      const zip = new JSZip();
      // 添加文件到 ZIP 中
      zip.file(file.name, file);

      // 生成 ZIP Blob
      const blob = await zip.generateAsync({ type: "blob" });

      // 创建新的 ZIP 文件对象
      return new File([blob], "uploadDicom.zip", {
        type: "application/zip", // 明确指定 ZIP 类型
      });
    }
    ,

  },
  async created() {
    this.setActiveModule('SPINE')
    const { computeSeriesId } = this.$route.query;
    const res = await xhr_getSeriesInfo({ computeSeriesId });
    if (res) {
      const info = res.data.resultData;
      this.InitCaseInfo(info)

    }
  },
  beforeDestroy() {
    this.beforeViewDestory();
  },


  mounted() {
    window.addEventListener("resize", this.resizeView);
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
