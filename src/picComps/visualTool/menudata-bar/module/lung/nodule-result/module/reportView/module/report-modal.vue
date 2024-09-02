<template>
  <ta-modal :footer="null" v-model="modalVisible" class="report-modal custom_modal_box" title="影像报告" @on-ok="handleOk"
    width="calc(1158 / 1920 * 100vw)" height="calc(900 / 1080 * 100vh - 100px)">
    <!-- <template slot="footer">
      <div class="flex justify-between">
        <div>
          <ta-button :ghost="true"> 恢复默认</ta-button>
        </div>
        <div>
          <ta-button key="back" @click="handleCancel">取消</ta-button>
          <ta-button key="submit" type="primary" :loading="loading" @click="handleOk">
            确定
          </ta-button>
        </div>
      </div>
    </template> -->
    <div class="btn_group flex justify-between items-center">
      <div class="film_ctrl_box flex">
        <div class="baogao flex items-end">
          <div class="ifontyhpacs ico_pacsgz-edit"></div>
          <div>报告设置</div>
        </div>
        <div class="reset flex items-end">
          <div class="ifontyhpacs ico_pacszhongzhi1"></div>
          <div>重置</div>
        </div>
        <div class="copyfilmsee flex items-end">
          <div class="ifontyhpacs ico_pacsfuzhi"></div>
          <div>复制影像所见</div>
        </div>
        <div class="copyfilmzd flex items-end">
          <div class="ifontyhpacs ico_pacsfuzhi"></div>
          <div>复制影像诊断</div>
        </div>
      </div>
      <div class="film_useBtn flex">
        <ta-button type="primary" @click="printPreview">打印报告</ta-button>
        <ta-button type="primary" @click="fnPrint">下载报告</ta-button>
      </div>
    </div>
    <div class="content_main">
      <div class="a4-template" ref="printableArea">
        <!-- <div class="editable-text" contenteditable="true" style="top: 50px; left: 50px; width: 200px; height: 100px;">
          Editable text here...
        </div> -->
        <div class="paper_main flex flex-col justify-end">
          <div class="content_wrapper">
            <div class="header_info">
              <div class="h_1 font-bold text-center">CT影像诊断报告单</div>
            </div>
            <div class="layout_content">
              <div class="patient_information">
                <div class="cell_row flex justify-between">
                  <div class="itemInput flex">
                    <div class="keyName font-bold">患者编号：</div>
                    <div class="value">
                      <input type="text" v-model="paperObj.patientInfo.code" class="custom_input ">
                    </div>
                  </div>
                  <div class="itemInput flex">
                    <div class="keyName font-bold">检查号：</div>
                    <div class="value">
                      <input type="text" v-model="paperObj.patientInfo.jianchahao" class="custom_input ">
                    </div>
                  </div>
                  <div class="itemInput flex">
                    <div class="keyName font-bold">检查日期：</div>
                    <div class="value">
                      <input type="text" class="custom_input " v-model="paperObj.patientInfo.jianchaDate">
                    </div>
                  </div>
                </div>
                <div class="cell_row flex justify-between">
                  <div class="itemInput flex">
                    <div class="keyName font-bold">姓名：</div>
                    <div class="value">
                      <input type="text" disabled v-model="paperObj.patientInfo.name" class="custom_input ">
                    </div>
                  </div>
                  <div class="itemInput flex sex">
                    <div class="keyName font-bold">性别：</div>
                    <div class="value">
                      <input type="text" v-model="paperObj.patientInfo.sex" class="custom_input ">
                    </div>
                  </div>
                  <div class="itemInput flex yearno">
                    <div class="keyName font-bold">年龄：</div>
                    <div class="value">
                      <input type="text" v-model="paperObj.patientInfo.age" class="custom_input ">
                    </div>
                  </div>
                  <div class="itemInput flex">
                    <div class="keyName font-bold">检查项目：</div>
                    <div class="value">
                      <input type="text" v-model="paperObj.patientInfo.product" class="custom_input ">
                    </div>
                  </div>
                </div>
              </div>
              <div class="film_look_content">
                <div class="sub_title font-bold">影像所见</div>
                <textarea class="custom_textarea" name="description1" v-model="paperObj.filmLookBook" rows="4"
                  maxlength="500"></textarea>
              </div>
              <div class="film_diagnose_content">
                <div class="sub_title font-bold">影像诊断</div>
                <textarea class="custom_textarea" name="description2" v-model="paperObj.filmZdBook" rows="4"
                  maxlength="500"></textarea>
              </div>
            </div>
          </div>


          <div class="footer_info">
            <div class="cell_row flex justify-between">
              <div class="itemInput flex">
                <div class="keyName font-bold">报告日期：</div>
                <div class="value">
                  <input type="text" v-model="paperObj.patientInfo.code" class="custom_input ">
                </div>
              </div>
              <div class="itemInput flex">
                <div class="keyName font-bold">报告医生：</div>
                <div class="value">
                  <input type="text" v-model="paperObj.patientInfo.jianchahao" class="custom_input ">
                </div>
              </div>
              <div class="itemInput flex">
                <div class="keyName font-bold">审核医生：</div>
                <div class="value">
                  <input type="text" class="custom_input " v-model="paperObj.patientInfo.jianchaDate">
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>


    <iframe id="printFrame" style="display: none;"></iframe>
  </ta-modal>



</template>
<script lang='javascript'>

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
function forceReflow(element) {
  element.style.display = 'none';
  element.offsetHeight; // 触发重绘
  element.style.display = '';
}
export default {
  name: 'report-modal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      modalVisible: false,
      paperObj: {
        patientInfo: {
          code: "1231231",
          jianchahao: "DJ123123123",
          jianchaDate: "2024-01-02",
          name: "张三",
          sex: "女",
          age: "38",
          product: "胸部CT平扫",



        },
        filmLookBook: "左侧肋骨2投影",
        filmZdBook: "左侧肋骨2投影,左侧肋骨2投影,左侧肋骨2投影,左侧肋骨2投影",
      },
    }
  },
  watch: {
    visible(value) {
      this.modalVisible = value;
    },
    modalVisible(value) {
      // console.log("wwww-", value);
      this.$emit("update:visible", value);
    },
  },
  methods: {
    async printPreview() {
      try {
        const element = this.$refs.printableArea;

        // 强制重新渲染 textarea
        const textareas = element.querySelectorAll('textarea');
        textareas.forEach(textarea => forceReflow(textarea));

        // 调整 textarea 高度以适应内容
        textareas.forEach(textarea => {
          textarea.style.height = 'auto'; // 使 textarea 高度自适应
          textarea.style.height = `${textarea.scrollHeight}px`; // 设置为实际内容高度
        });

        // 使用 html2canvas 生成画布
        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: true,
          backgroundColor: null,
          scrollX: 0,
          scrollY: 0,
          width: element.scrollWidth,
          height: element.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 210;
        const imgHeight = canvas.height * imgWidth / canvas.width;

        // 创建打印内容
        const printFrame = document.createElement('iframe');
        printFrame.style.position = 'absolute';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = 'none';
        document.body.appendChild(printFrame);

        const doc = printFrame.contentWindow.document;
        doc.open();
        doc.write(`
      <html>
      <head>
        <title>打印预览</title>
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
              width: ${imgWidth}mm;
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
      </body>
      </html>
    `);
        doc.close();

        // 打印
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      } catch (error) {
        console.error('Error generating print preview:', error);
      }
    },





    async fnPrint() {
      try {
        const element = this.$refs.printableArea;

        // 创建一个样式元素，用于移除 input 和 textarea 的样式
        const style = document.createElement('style');
        style.textContent = `
                    input, textarea {
                        border: none !important;
                        background: transparent !important;
                        box-shadow: none !important;
                        outline: none !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        font-size: inherit !important;
                        line-height: 1.8 !important;
                    }
                    .a4-template {
                        border: none !important;
                        box-shadow: none !important;
                    }
                `;
        document.head.appendChild(style);

        // 等待样式添加到 DOM 中
        await new Promise(resolve => setTimeout(resolve, 0));

        // 使用 html2canvas 进行截图
        const canvas = await html2canvas(element, {
          scale: 2, // 提高图像分辨率
          useCORS: true, // 允许跨域请求
          logging: true, // 启用日志以调试
          backgroundColor: null // 透明背景
        });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });

        const imgWidth = 210; // A4纸的宽度
        const pageHeight = 297; // A4纸的高度
        const imgHeight = canvas.height * imgWidth / canvas.width; // 图像高度

        let heightLeft = imgHeight;
        let position = 0;

        // 添加第一页的图像
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        // 添加额外的页面（如果需要）
        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save('download.pdf');

        // 移除临时样式
        document.head.removeChild(style);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
    },
    showModal() {
      this.modalVisible = true;
    },
    handleOk(e) {
      this.loading = true;
      // setTimeout(() => {
      this.modalVisible = false;
      this.loading = false;
      this.$emit("update:visible", false); // 触发自定义事件，通知外部visible的变化
      // }, 3000);
    },
    handleCancel(e) {
      this.modalVisible = false;
      this.$emit("update:visible", false); // 触发自定义事件，通知外部visible的变化
    },
  },
  beforeDestroy() {
    // console.log("beforeDestroy:::this.modalVisible==", this.modalVisible);
  },
}
</script>
<style lang='less' scoped>
.paper_main {
  padding: 0 21px;

  /deep/input:disabled {
    background-color: transparent;
    /* 灰色背景 */
    color: #1a1818;
    /* 灰色文字 */
    cursor: not-allowed;
    /* 禁用时的鼠标指针 */
    border: 1px solid transparent !important;
  }

  .content_wrapper {
    height: calc(100vh - 155px - 55px);
    overflow: auto;
  }

  .custom_textarea {
    border: 1px solid @primary-color;
    width: 100%;
  }
}

.footer_info {
  border-top: 1px solid #E8E8E8;
  padding-top: 25px;
  padding-bottom: 18px;

  .cell_row {
    .itemInput {
      .keyName {
        width: 80px;
      }

      .value {
        input {
          width: 85px;
          border: 1px solid @primary-color;
        }
      }
    }
  }
}

.patient_information {
  border-top: 1px solid #E8E8E8;
  border-bottom: 1px solid #E8E8E8;
  padding: 5px 0;

  .cell_row {
    &:nth-child(1) {
      margin-top: 0;
    }

    margin-top: 10px;

    .itemInput {
      &.sex {
        .keyName {
          width: 55px;
          text-indent: 5px;
        }

        input {
          width: 35px;
        }
      }

      &.yearno {
        .keyName {
          width: 55px;
          text-indent: 5px;
        }

        input {
          margin-right: 5px;
          width: 35px;
        }
      }

      .keyName {
        width: 70px;
      }

      .value {}
    }

    .custom_input {
      width: 110px;

      border: 1px solid @primary-color;

      /* 灰色边框 */
      &.hidd_holder {
        visibility: hidden;
      }

    }


  }
}

textarea {
  overflow: visible;
  resize: none;
  /* 禁止调整大小以防止超出边界 */
  height: auto;
  /* 高度自适应 */
}

/* 临时样式，用于处理打印预览的样式 */
.print-preview-styles input,
.print-preview-styles textarea {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  outline: none !important;
  padding: 0 !important;
  margin: 0 !important;
  line-height: 1.8 !important;
}

.content_main {
  color: #2E2E2E;

  .a4-template {
    width: 606px;
    /* A4 width in pixels */
    height: 803px;
    /* A4 height in pixels */
    border: 1px solid #000;
    position: relative;
    background: #fff;
    margin: 0 auto;
  }

  .editable-text {
    position: absolute;
    border: 1px dashed #000;
    padding: 5px;
    background: rgba(255, 255, 255, 0.8);
    resize: both;
    overflow: auto;
  }

  .a4-template {
    width: 210mm;
    /* A4 width */
    height: 297mm;
    /* A4 height */
    border: none;
    background: #fff;
  }

  input,
  textarea {
    border: none !important;
    background: transparent !important;
    box-shadow: none !important;
    outline: none !important;
    padding: 0 !important;
    margin: 0 !important;
    font-size: inherit;
    line-height: 1.8 !important;
    /* 设置行高 */
  }

  &.ca_hiddenBorderbug {}

  /* print.css */
  @media print {
    @page {
      size: A4;
      margin: 0;
    }

    body {
      margin: 0;
      padding: 0;
    }

    img {
      width: 100%;
      /* 让图像适应页面宽度 */
      height: auto;
      /* 保持图像的高度自动适应 */
      display: block;
      margin: 0;
      border: none;
      padding: 0;
    }

    body * {
      visibility: hidden;
      /* 隐藏页面上的所有元素 */
    }

    .a4-template,
    .a4-template * {
      visibility: visible;
      /* 只显示 .a4-template 区域的内容 */
    }

    .a4-template {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
    }


    .a4-template {
      width: 210mm;
      /* A4 width */
      height: 297mm;
      /* A4 height */
      border: none;
      background: #fff;
    }

    input,
    textarea {
      border: none;
      background: transparent;
      box-shadow: none;
      outline: none;
      padding: 0;
      margin: 0;
      font-size: inherit;
      line-height: 1.8;
      /* 设置行高 */
    }

    html,
    body {
      width: 210mm;
      /* A4 宽度约为 210mm */
      height: 297mm;
      /* A4 高度约为 297mm */
      margin: 0;
      padding: 0;
      background: #FFF;
    }

    /* 根据需要添加更多样式 */
  }

  @media screen {
    .a4-template {
      width: 606px;
      /* Adjusted for screen display */
      height: 803px;
      /* Adjusted for screen display */
      border: 1px solid #000;
      background: #fff;
    }
  }
}

.header_info {
  padding: 23px 0;
  font-size: 18px;
}

.sub_title {
  padding: 17px 0 10px 0;
}

.film_look_content {
  .sub_title {}
}

.film_diagnose_content {
  .sub_title {}
}

.btn_group {
  margin-bottom: 40px;
  position: sticky;
  top: -25px;
  /* 按钮组将保持在距离视窗顶部100px的位置 */
  z-index: 10;
  /* 确保按钮组在页面其他内容的上方 */
  background: rgba(2, 31, 31, 0.95);
  // -webkit-box-shadow: inset 0px 0px 20px 12px rgba(24, 151, 151, 0.35);
  // box-shadow: inset 0px 0px 20px 12px rgba(24, 151, 151, 0.35);
  // border-radius: 8px;
  // border: 1px solid #00AFB0;
  // -webkit-backdrop-filter: blur(6px);
  // backdrop-filter: blur(6px);


  .baogao {}

  .film_ctrl_box {
    >div {
      margin-right: 60px;

      >div {
        cursor: pointer;

        &.ifontyhpacs {
          margin-right: 5px;
          font-size: 18px;
          color: @primary-color;
        }

        &:nth-child(2) {
          font-size: 15px;
          color: rgb(180, 191, 191);
        }
      }
    }
  }

  .film_useBtn {
    button {
      border-radius: 6px;
      margin-right: 10px;
    }
  }

}
</style>
