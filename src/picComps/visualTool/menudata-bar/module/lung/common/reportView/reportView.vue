<template>
  <ta-modal :footer="null" v-model="modalVisible" class="custom_modal_box" title="影像报告" @on-ok="handleOk"
    width="calc(1350 / 1920 * 100vw)" height="calc(1000 / 1080 * 100vh - 100px)">

    <div class="card-container flex justify-between items-start h-full">
      <ta-tabs class="custom_report_bar  " defaultActiveKey="1" tabPosition="left">
        <ta-tab-pane key="1">
          <div slot="tab" class="flex  items-center">
            <ta-icon type="profile" />
            <span>文本报告</span>
          </div>
          <div class="center-content  flex items-center justify-center ">
            <div class="content_main ">
              <div class="a4-template" ref="printableArea" id="printMe">

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
                      <!-- <textarea class="custom_textarea" name="description1" v-model="paperObj.filmLookBook" rows="4"
                maxlength="500"></textarea> -->
                      <div class="textarea_pre_book" :contenteditable="true" v-html="paperObj.filmLookBook"
                        @input="filmLookBookOb.handleInput"></div>
                      <div class="textcounter_ctrl flex justify-end">
                        <div class="text-counter">{{ filmLookBookOb.currentLength }}/{{ filmLookBookOb.maxLen }}</div>
                      </div>
                    </div>
                    <div class="film_diagnose_content">
                      <div class="sub_title font-bold">影像诊断</div>
                      <!-- <textarea class="custom_textarea" name="description2" v-model="paperObj.filmZdBook" rows="4"
                maxlength="500"></textarea> -->
                      <div class="textarea_pre_book" :contenteditable="true" v-html="paperObj.filmZdBook"
                        @input="filmZdBookOb.handleInput" @paste="filmZdBookOb.handlePaste">
                      </div>
                      <div class="textcounter_ctrl flex justify-end">
                        <div class="text-counter">{{ filmZdBookOb.currentLength }}/{{ filmZdBookOb.maxLen }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="footer_boxes">
                  <div class="footer_info">
                    <div class="cell_row flex justify-between">
                      <div class="itemInput flex">
                        <div class="keyName font-bold">报告日期：</div>
                        <div class="value">
                          <input type="text" v-model="paperObj.footerInfo.bgdate" class="custom_input ">
                        </div>
                      </div>
                      <div class="itemInput flex">
                        <div class="keyName font-bold">报告医生：</div>
                        <div class="value">
                          <input type="text" v-model="paperObj.footerInfo.bgdoctor" class="custom_input ">
                        </div>
                      </div>
                      <div class="itemInput flex">
                        <div class="keyName font-bold">审核医生：</div>
                        <div class="value">
                          <input type="text" class="custom_input " v-model="paperObj.footerInfo.postDoctor">
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="foot_info">
                    <div class="cell_row flex justify-between">
                      <div class="remark">本报告仅供临床医生参考</div>
                      <div class="jaobiao">
                        <span>1</span><span>/</span><span>1</span>
                      </div>
                    </div>
                  </div>

                </div>
                <!-- </div> -->
              </div>
            </div>
          </div>
          <div>

          </div>
        </ta-tab-pane>
        <ta-tab-pane key="2">
          <div slot="tab" class="flex  justify-start"><ta-icon type="profile" /><span>图文报告</span></div>
          图文报告
        </ta-tab-pane>
      </ta-tabs>
      <div class="w-[320px] h-full flex flex-col  px-2">
        <div class="w-full  text-lg font-bold flex items-center">
          报告设置
        </div>
        <!-- 中间部分（占满剩余空间） -->
        <div class="w-full flex-1   ">
          <div class="mt-3 text-base font-semibold">基本操作</div>
          <div class="mt-5 flex space-x-2">
            <div><ta-icon type="edit" /></div>
            <div><ta-icon type="undo" /></div>
          </div>
        </div>

        <!-- 打印和下载按钮行（固定高度） -->
        <div class="w-full h-12 flex space-x-2 items-center px-3">
          <div class="w-1/2">
            <ta-button class="w-full">打印报告</ta-button>
          </div>
          <div class="w-1/2">
            <ta-button class="w-full">下载报告</ta-button>
          </div>
        </div>

      </div>



    </div>

  </ta-modal>



</template>
<script lang='javascript'>
import { serializeAge } from "@/assets/js/utils/dicom/inputFormat";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import moment from 'moment';

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
    findingText: String,
    diagnosisText: String,
    // 主体内容正文
    contentMainData: {
      type: Object,
      default: () => ({})
    },
  },
  computed: {
    ...mapState("mprViewStore", ["seriesInfo"]),
    // contentMainDataCache: {
    //   get() {
    //     return this.contentMainData;
    //   },
    //   set(val) {
    //     this.$emit('update:contentMainData', val);
    //     return val;
    //   },
    // }
  },
  data() {
    return {
      // 打开时初始化一次currentLength
      filmLookBookOb: {
        currentLength: 0,
        maxLen: 400,
        handleInput: (e) => {
          const text = e.target.innerText;
          this.filmLookBookOb.currentLength = text.length;

          // 如果当前长度超过最大长度，则截断文本
          if (this.filmLookBookOb.currentLength > this.filmLookBookOb.maxLen) {
            e.target.innerText = text.substring(0, this.filmLookBookOb.maxLen);
            this.filmLookBookOb.currentLength = this.filmLookBookOb.maxLen;
          }

          // 更新警告状态
          this.filmLookBookOb.isWarning = this.filmLookBookOb.currentLength >= 399;
        }
      },
      // 打开时初始化一次currentLength
      filmZdBookOb: {
        currentLength: 0,
        maxLen: 400,
        handleInput: (e) => {
          let text = e.target.innerText;
          let currentLength = text.length;

          // 如果当前长度超过最大长度，则截断文本
          if (currentLength > this.filmZdBookOb.maxLen) {
            text = text.substring(0, this.filmZdBookOb.maxLen);
            currentLength = this.filmZdBookOb.maxLen;
          }

          // 更新 contenteditable 元素的内容
          e.target.innerText = text;

          // 设置光标位置在文本末尾
          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(e.target);
          range.collapse(false); // 将光标设置在文本的末尾
          selection.removeAllRanges();
          selection.addRange(range);

          // 更新长度计数
          this.filmZdBookOb.currentLength = currentLength;
          this.filmZdBookOb.isWarning = currentLength >= 399;
        },
        handlePaste: (e) => {
          e.preventDefault();

          let text = e.clipboardData.getData('text/plain');
          const currentText = e.target.innerText;
          const currentLength = currentText.length;

          // 如果当前长度加上粘贴内容超过最大长度，则截断粘贴内容
          if (currentLength + text.length > this.filmZdBookOb.maxLen) {
            const allowedLength = this.filmZdBookOb.maxLen - currentLength;
            text = text.substring(0, allowedLength);
          }

          if (text.length > 0) {
            const selection = window.getSelection();
            const range = selection.getRangeAt(0);

            // 插入粘贴内容
            range.deleteContents();
            range.insertNode(document.createTextNode(text));

            // 更新光标位置
            range.setStart(range.endContainer, range.endOffset);
            range.collapse(true);
            selection.removeAllRanges();
            selection.addRange(range);
          }

          // 更新 contenteditable 元素的内容
          e.target.innerText = e.target.innerText.substring(0, this.filmZdBookOb.maxLen);

          // 更新长度计数
          this.filmZdBookOb.currentLength = e.target.innerText.length;
          this.filmZdBookOb.isWarning = this.filmZdBookOb.currentLength >= 399;
        },

      },
      loading: false,
      modalVisible: false,
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
    visible(value) {
      this.modalVisible = value;
      console.log("seriesInfo==~~~~~~~~~~=", this.seriesInfo);

    },
    modalVisible(value) {
      if (value) {
        this.$nextTick(() => {
          console.log(" this.paperObj", this.paperObj);
          const { patientId, studyId, studyDateAndTime, patientName, patientSex, patientAge, } = this.seriesInfo;
          // console.log("patientId, studyId, studyDateAndTime, patientName, patientSex, patientAge,", patientId, studyId, studyDateAndTime, patientName, patientSex, patientAge,)
          this.$set(this.paperObj.patientInfo, "code", patientId)
          this.paperObj.patientInfo.jianchahao = studyId;
          this.paperObj.patientInfo.jianchaDate = studyDateAndTime;
          this.paperObj.patientInfo.name = patientName;
          this.paperObj.patientInfo.sex = this.$ut.getGenderString(patientSex);
          const patientAge_Val = serializeAge({
            dataSource: patientAge,
            unit: true,
            language: "zh",
          }).replaceAll('岁', '');
          this.paperObj.patientInfo.age = patientAge_Val;
          this.paperObj.footerInfo.bgdate = moment().format("YYYY-MM-DD");
          // console.log("this.contentMainDataCache=", this.contentMainDataCache);

          this.paperObj.filmLookBook = this.findingText;
          this.paperObj.filmZdBook = this.diagnosisText;
        })
      }

      this.$emit("update:visible", value);

    },
  },
  methods: {
    handleClick_selectReport() {

    },
    async printPreview2() {
      try {
        const element = this.$refs.printableArea;
        const maxA4HeightPx = 1122; // A4 height in pixels (297mm * 3.7795 px/mm)
        let totalHeight = 0;
        const canvasArray = [];

        // 获取所有子元素
        const childElements = Array.from(element.children);

        // 遍历所有子元素，计算高度并分页
        for (const el of childElements) {
          let elHeight = 0;

          // 如果是 textarea_pre_book，计算其内容高度
          if (el.classList.contains('textarea_pre_book')) {
            const textareaContent = el.innerText || el.value;
            const tempDiv = document.createElement('div');
            tempDiv.style.width = el.style.width;
            tempDiv.style.position = 'absolute';
            tempDiv.style.visibility = 'hidden';
            tempDiv.innerHTML = textareaContent;
            document.body.appendChild(tempDiv);
            elHeight = tempDiv.offsetHeight;
            document.body.removeChild(tempDiv);
          } else {
            // 其它元素的固定高度
            elHeight = el.offsetHeight;
          }

          totalHeight += elHeight;

          // 当总高度超出A4纸张的高度时，生成新的 canvas
          if (totalHeight > maxA4HeightPx) {
            const canvas = await html2canvas(element, {
              scale: 2,
              useCORS: true,
              backgroundColor: null,
              scrollX: 0,
              scrollY: 0,
              width: el.scrollWidth,
              height: elHeight,
            });
            canvasArray.push(canvas.toDataURL('image/png')); // 保存每个 canvas 的图像数据
            totalHeight = elHeight; // 重置当前高度为新的起点
          }
        }

        // 创建打印 iframe
        const printFrame = document.createElement('iframe');
        printFrame.id = 'print_win';
        printFrame.style.position = 'absolute';
        printFrame.style.width = '0';
        printFrame.style.height = '0';
        printFrame.style.border = 'none';
        document.body.appendChild(printFrame);

        // 在 iframe 中创建新的打印页面
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
              width: 210mm;
              height: auto;
            }
          }
        </style>
      </head>
      <body>
        ${canvasArray.map(img => `<img src="${img}" /><br/>`).join('')}
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
    async printPreview() {
      try {
        const element = this.$refs.printableArea;
        const childElements = Array.from(element.children);
        let tprebook = document.body.querySelectorAll('.textarea_pre_book');

        let tp1_scrollHeight = tprebook[0].scrollHeight;
        let tp1_offsetHeight = tprebook[0].offsetHeight;
        let tp1_clientHeight = tprebook[0].clientHeight;
        let tp1_getBoundingClientRect = tprebook[0].getBoundingClientRect();


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
        printFrame.id = 'print_win';
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
        <br/>
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
                           page-break-after: always;
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
      // this.$emit("update:visible", false); // 触发自定义事件，通知外部visible的变化
      // }, 3000);
    },
    handleCancel(e) {
      this.modalVisible = false;
      // this.$emit("update:visible", false); // 触发自定义事件，通知外部visible的变化
    },
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
    // width: 606px;
    width: 606px;
    /* A4 width in pixels */
    height: 803px;
    /* A4 height in pixels */
    border: 1px solid #000;
    border-color: transparent !important;
    position: relative;
    background: #fff;
    margin: 0 auto;
    padding: 0 27px;
    page-break-after: always;

    .content_wrapper {
      width: 100%;

      textarea {
        width: 100%;
      }

    }

    .footer_boxes {
      width: 89%;
      position: absolute;
      bottom: 0;
    }

    .footer_info {}

    .foot_info {
      // position: absolute;
      // bottom: 0;
      // width: 89%;
      border-top: 1px solid #E8E8E8;
      font-size: 14px;
      padding: 27px 0;

      .remark {
        font-size: 13px;
      }

      .jaobiao {
        font-size: 12px;
      }
    }
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
    page-break-after: always;
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
      page-break-after: always;
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
      page-break-after: always;
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

.textarea_pre_book {
  white-space: pre-wrap;
  word-wrap: break-word;
  font-size: 12px;
  min-height: 75px;
  max-height: 180px;
  overflow-y: auto;
  height: auto;
  // line-height: 1.8;
  padding: 5px;
}
</style>
