<template>
  <div class="a4-template bg-whi" ref="printableArea" id="printMe">

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
          <div class="textarea_pre_book" :contenteditable="true" v-html="paperObj.filmLookBook"></div>
          <div class="textcounter_ctrl flex justify-end">
            <div class="text-counter">{{ paperObj.currentLength }}/{{ paperObj.maxLen }}</div>
          </div>
        </div>
        <div class="film_diagnose_content">
          <div class="sub_title font-bold">影像诊断</div>
          <!-- <textarea class="custom_textarea" name="description2" v-model="paperObj.filmZdBook" rows="4"
        maxlength="500"></textarea> -->
          <div class="textarea_pre_book" :contenteditable="true">
          </div>
          <div class="textcounter_ctrl flex justify-end">
            <div class="text-counter">{{ paperObj.currentLength }}/{{ paperObj.maxLen }}</div>
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
  </div>

</template>
<script lang='javascript'>

export default {
  name: 'report-modal',
  props: {
    editable: {
      type: Boolean,
      required: true,
    },
    // visible: {
    //   type: Boolean,
    //   required: true,
    // },
    // 主体内容正文
    formData: {
      type: Object,
      default: () => ({})
    },
  },

  data() {
    return {
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
        currentLength: "",
        maxLen: ""

      },

    }
  },
  methods: {

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
  background-color: #fff;

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
