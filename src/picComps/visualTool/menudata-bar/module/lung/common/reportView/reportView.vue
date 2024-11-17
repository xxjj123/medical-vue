<template>
  <ta-modal :footer="null" v-model="visible" class="custom_modal_box " title="影像报告" @on-ok="handleOk" width="1300px"
    height="800px">
    <div class="card-container flex justify-between items-start h-full ">
      <div class="flex-1 h-full  ">
        <ta-tabs class="custom_report_bar    h-full p-0" defaultActiveKey="1" tabPosition="left">
          <ta-tab-pane key="1">
            <div slot="tab" class="flex  items-center">
              <ta-icon type="profile" />
              <span>文本报告</span>
            </div>
            <textReport id="textReportRef" ref="textReportRef" :editAble="editAble" :reportData="reportData" />
            <div>

            </div>
          </ta-tab-pane>
          <ta-tab-pane key="2">
            <div slot="tab" class="flex  justify-start"><ta-icon type="profile" /><span>图文报告</span></div>
            图文报告
          </ta-tab-pane>
        </ta-tabs>
      </div>
      <div class="w-[320px] h-full flex flex-col  px-5">
        <div class="w-full  text-lg font-bold flex items-center">
          报告设置
        </div>
        <!-- 中间部分（占满剩余空间） -->
        <div class="w-full flex-1   ">
          <div class="mt-3 text-base font-semibold">基本操作</div>
          <div class="mt-5 flex space-x-2">
            <div @click="changeEditable" :style="{ color: editAble ? 'green' : 'white' }"><ta-icon type="edit" /></div>
            <div><ta-icon type="undo" /></div>
          </div>
        </div>

        <!-- 打印和下载按钮行（固定高度） -->
        <div class="w-full h-12 flex space-x-2 items-center ">
          <div class="w-1/2">
            <ta-button class="w-full" @click="printReport">打印报告</ta-button>
          </div>
          <div class="w-1/2">
            <ta-button class="w-full" @click="generatePDF">下载报告</ta-button>
          </div>
        </div>

      </div>


    </div>

  </ta-modal>



</template>
<script lang='javascript'>
import textReport from "./module/textReport.vue"


import { serializeAge } from "@/assets/js/utils/dicom/inputFormat";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import moment from 'moment';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { xhr_queryTextReport } from "@/api"


function forceReflow(element) {
  element.style.display = 'none';
  element.offsetHeight; // 触发重绘
  element.style.display = '';
}

export default {
  name: 'report-modal',
  props: {
    reportData: Object,
    visible: {
      type: Boolean,
      // required: true,
    },
    findingText: String,
    diagnosisText: String,
    // 主体内容正文
    contentMainData: {
      type: Object,
      default: () => ({})
    },
  },
  components: {
    // reportModal
    textReport
  },
  data() {
    return {
      editAble: false,
      // 打开时初始化一次currentLength

      // 打开时初始化一次currentLength

      loading: false,
      paperObj: {
        patientInfo: {
          code: "",
          jianchahao: "",
          jianchaDate: "",
          name: "",
          sex: "",
          age: "",
          product: "胸部CT平扫",
        },
        footerInfo: {
          bgdate: "",
          bgdoctor: "",
          postDoctor: "",

        },
        filmLookBook: "",
        filmZdBook: "",
      },
    }
  },
  watch: {

  },
  methods: {
    changeEditable() {
      this.editAble = !this.editAble
    },
    generatePDF() {
      this.editAble = false
      this.$nextTick(() => {

        const input = document.getElementById("textReportRef");
        html2canvas(document.getElementById("reportContent"), {
          useCORS: true,  // 允许跨域资源
          scale: 3,       // 提高缩放比例，提升图片清晰度
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/png");
          const pdf = new jsPDF("p", "mm", "a4");
          const imgWidth = 210; // A4 尺寸
          const pageHeight = 297;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          let heightLeft = imgHeight;
          let position = 0;

          pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;
          }

          pdf.save("CT影像诊断报告.pdf");
        });

      })


    },
    printReport() {
      this.editAble = false
      this.$nextTick(() => {
        html2canvas(document.getElementById("reportContent"), {
          useCORS: true,  // 允许跨域资源
          scale: 3        // 提高缩放比例，提升图片清晰度
        }).then((canvas) => {
          // 将 Canvas 转换为图片
          const imgData = canvas.toDataURL("image/png");

          // 打开一个新窗口并写入内容
          const printWindow = window.open("", "_blank");
          printWindow.document.write(`
      <html>
      <head>
        <title>打印报告</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          @media print {
            body {
              margin: 0;
            }
            img {
              width: ${210}mm;
              height: auto;
            }
            textarea {
              height: auto !important;
              overflow: visible !important;
            }
          }
        </style>
      </head>
      <body>
        <img src="${imgData}" />
         <img src="${imgData}" />
        <br/>
      </html>
    `);

          // 等待页面加载完成后打印
          printWindow.document.close();
          printWindow.onload = () => {
            printWindow.print();
            printWindow.close();
          };
        });
      })

    }





  },
  created() {
    // xhr_queryTextReport()
  }

}
</script>
<style></style>
