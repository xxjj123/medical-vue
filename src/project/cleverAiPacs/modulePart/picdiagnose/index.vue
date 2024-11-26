<template>
  <div class="diagnose_page flex flex-col">
    <PacsPageHeader :bread="true" :filmModeBtn="true">

      <template slot="filmModeCtrl">
        <input class="hidden " ref="fileInputRef" type="file" @change="handleFileChange">
        <ta-button @click="triggerFileInput">
          <ta-icon type="upload" />
          选择文件
        </ta-button>

      </template>

      <template slot="vtkTool">
        <vskToolbar ref="vskToolbarRef" class="ml-[15px]">
        </vskToolbar>

      </template>

    </PacsPageHeader>
    <div class="main">
      <div class="pacs_container">

        <div>
          <PicBoard />
        </div>
        <div class="menu_data">
          {{ allViewData }}
          <!-- <img :src="image" alt="" class="w-[200px]"> -->

          <!-- <ta-button @click="addAngleWidget">测量角度</ta-button>
          <ta-button @click="hiddenAngle">隐藏角度</ta-button>


          测量角度：{{ allViewData.cobb }} -->
          <!-- {{ boneInfo.angle }} -->

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
} from "vuex";

import PacsPageHeader from "@/components/pacs-page-header/index.vue";
import JSZip from "jszip";
import dicomParser from "dicom-parser";
import spineInfo from './assets/boneInfo.json';

import { xhr_getSpineInfo } from '@/api'

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
    ...mapState("spineViewStore", ["allViewData"])
  },
  methods: {
    ...mapActions("toolBarStore", ["setActiveModule"]),
    ...mapActions("spineViewStore", ["beforeViewDestory", "GetSlice", "UpdateSlice", "addBoxes", "addKeyPoints", "drawLine", "calculateAngle", "drawVerticalLine", "drawShape", "freshView"]),
    ...mapActions("spineToolsStore", ["addAngleWidget", "hiddenAngle"]),



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

        // console.log(this.spineInfo.template);
        this.boneInfo = this.spineInfo.data.resultData.data
        console.log(this.boneInfo);
        const { beginpnt1, beginpnt2, endpnt1, endpnt2, keypoints, boxes, keypnts } = this.boneInfo
        // this.addKeyPoints({ contours: keypoints })
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
        // xhr_getSpineInfo({ dicom: zipfile }).then((res) => {
        //   this.$message.success(`上传成功,: ${''}`);
        //   this.boneInfo = res.data.resultData.data
        //   console.log(res.data.resultData.data);
        //   const { beginpnt1, beginpnt2, endpnt1, endpnt2, keypoints, boxes, keypnts } = this.boneInfo
        //   this.addKeyPoints({ contours: keypoints })
        // })


        // const image = await this.dicomToJpg(file)
        // this.image = image
        // xhr_getSpineInfo({ input_para: 1, input: image }).then(res => {
        //   if (res.data && res.data.msg == 'ok') {
        //     this.$message.success(`上传成功,: ${''}`);
        //     this.boneInfo = res.data.template
        //     const { beginpnt1, beginpnt2, endpnt1, endpnt2, keypoints, boxes, keypnts } = this.boneInfo

        //     this.addKeyPoints({ contours: keypoints })
        //     const line1 = [beginpnt1, beginpnt1.map((coord, index) => (coord + endpnt1[index]) / 2)]
        //     const line2 = [beginpnt2, beginpnt2.map((coord, index) => (coord + endpnt2[index]) / 2)]

        //     this.drawLine({ points: line1, color: [0, 1, 0] })
        //     this.drawLine({ points: line2, color: [0, 1, 0] })
        //     this.freshView()
        //     this.addBoxes({ contours: boxes })

        //   }

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
    // async dicomToJpg(file) {
    //   const buffer = await file.arrayBuffer();
    //   const byteArray = new Uint8Array(buffer);

    //   const dataSet = dicomParser.parseDicom(byteArray);

    //   const rows = dataSet.uint16('x00280010');
    //   const columns = dataSet.uint16('x00280011');
    //   const bitsAllocated = dataSet.uint16('x00280100');
    //   const pixelRepresentation = dataSet.uint16('x00280103');
    //   const pixelDataElement = dataSet.elements.x7fe00010;

    //   if (!pixelDataElement) {
    //     throw new Error('No pixel data found in the DICOM file.');
    //   }

    //   const pixelData = new DataView(
    //     byteArray.buffer,
    //     pixelDataElement.dataOffset,
    //     pixelDataElement.length
    //   );

    //   const isSigned = pixelRepresentation === 1;

    //   let minPixelValue = Infinity;
    //   let maxPixelValue = -Infinity;

    //   for (let i = 0; i < rows * columns; i++) {
    //     let pixelValue;
    //     if (bitsAllocated === 8) {
    //       pixelValue = pixelData.getUint8(i);
    //     } else if (bitsAllocated === 16) {
    //       pixelValue = isSigned
    //         ? pixelData.getInt16(i * 2, true)
    //         : pixelData.getUint16(i * 2, true);
    //     } else {
    //       throw new Error('Unsupported bit depth: ' + bitsAllocated);
    //     }
    //     minPixelValue = Math.min(minPixelValue, pixelValue);
    //     maxPixelValue = Math.max(maxPixelValue, pixelValue);
    //   }

    //   const canvas = document.createElement('canvas');
    //   const context = canvas.getContext('2d');
    //   canvas.width = columns;
    //   canvas.height = rows;

    //   const imageData = context.createImageData(columns, rows);
    //   const data = imageData.data;

    //   for (let i = 0; i < rows * columns; i++) {
    //     let pixelValue;
    //     if (bitsAllocated === 8) {
    //       pixelValue = pixelData.getUint8(i);
    //     } else if (bitsAllocated === 16) {
    //       pixelValue = isSigned
    //         ? pixelData.getInt16(i * 2, true)
    //         : pixelData.getUint16(i * 2, true);
    //     }

    //     const grayValue = Math.floor(((pixelValue - minPixelValue) / (maxPixelValue - minPixelValue)) * 255);
    //     const index = i * 4;
    //     data[index] = grayValue;
    //     data[index + 1] = grayValue;
    //     data[index + 2] = grayValue;
    //     data[index + 3] = 255;
    //   }

    //   context.putImageData(imageData, 0, 0);
    //   return canvas.toDataURL('image/jpeg');
    // }


  },
  created() {
    this.setActiveModule('SPINE')
  },
  beforeDestroy() {
    this.beforeViewDestory();
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
