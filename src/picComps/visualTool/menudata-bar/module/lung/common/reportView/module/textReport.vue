<template>
  <div>
    <div id="reportContent" class="report-container p-20">
      <!-- <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="changeEditable">编辑</button> -->
      <div class="header ">
        <h2 class="text-[26px] font-bold ">影像诊断报告单</h2>
      </div>
      <div class="w-full     text-5 border-b pb-[10px] mb-[20px]">
        <div class="w-full flex justify-between  items-center space-x-4 py-2">
          <div class="  flex items-center">
            <span class="mr-2 w-[60px]">患者编号: </span>
            <div class=" w-[125px]">
              <input v-if="editAble" v-model="formData.patientId" type="text" class=" border  w-full" />
              <p v-else class="w-full    my-0">
                {{ formData.patientId }}
              </p>
            </div>

          </div>
          <div class="  flex items-center">
            <span class="mr-2 w-[48px]">检查号: </span>
            <div class=" w-[125px]">
              <input v-if="editAble" v-model="formData.accessionNumber" type="text" class=" border w-full " />
              <p v-else class="w-full     my-0">
                {{ formData.accessionNumber }}
              </p>
            </div>
          </div>
          <div class=" flex items-center">
            <span class="mr-2 w-[60px]">检查日期: </span>
            <div class=" w-[80px]">
              <input v-if="editAble" v-model="formData.studyDate" type="text" class=" border w-full" />
              <p v-else class="w-full    my-0 ">
                {{ formData.studyDate }}
              </p>
            </div>
          </div>

        </div>
        <div class="w-full flex   justify-between  items-center  ">
          <div class="flex items-center">
            <span class="mr-2 w-[36px]">姓名:</span>
            <div class="w-[100px]">
              <input v-if="editAble" v-model="formData.patientName" type="text" class=" border w-full " />
              <p v-else class="w-full     my-0">
                {{ formData.patientName }}
              </p>
            </div>

          </div>

          <div class="  flex items-center">
            <span class="mr-2 w-[36px]">性别:</span>
            <div class="w-[100px]">
              <input v-if="editAble" v-model="formData.patientSex" type="text" class=" border w-full " />
              <p v-else class=" w-full    my-0 inline-block">
                {{ formData.patientSex }}
              </p>
            </div>

          </div>
          <div class="  flex items-center">
            <span class="mr-2 w-[36px]">年龄: </span>

            <div class="w-[100px]">
              <input v-if="editAble" v-model="formData.patientAge" type="text" class="w-full border   " />
              <p v-else class=" w-full     my-0 inline-block">
                {{ formData.patientAge }}
              </p>

            </div>

          </div>
          <div class="  flex items-center">
            <span class="mr-2 w-[60px]">检查项目: </span>
            <div class="w-[80px]">
              <input v-if="editAble" v-model="formData.examinedName" type="text" class="w-full border   " />
              <p v-else class="flex-1     my-0 inline-block   ">
                {{ formData.examinedName }}
              </p>
            </div>
          </div>

        </div>


      </div>
      <div class=" mb-[20px]">
        <h3 class="text-base font-bold mb-1">影像所见</h3>
        <div>
          <ta-textarea v-if="editAble" class="  b-none bg-white" v-model="formData.finding" :max-length="400"
            :show-max-length="true" :rows="10" />

          <p v-else class="flex-1     my-0 inline-block whitespace-pre-wrap">
            {{ formData.finding }}
          </p>

        </div>

      </div>
      <div class="mb-5">
        <h3 class="text-base font-bold mb-1">影像诊断</h3>
        <div>
          <ta-textarea v-if="editAble" class="  b-none bg-white" v-model="formData.diagnosis" :max-length="400"
            :show-max-length="true" :rows="10" />

          <p v-else class="flex-1     my-0 inline-block  whitespace-pre-wrap">
            {{ formData.diagnosis }}
          </p>

        </div>
      </div>
      <div class=" footer     flex justify-between">
        <div class="w-full flex justify-between  items-center space-x-4 py-2">
          <div class="  flex items-center">
            <span class="mr-2 w-[60px]">报告日期: </span>
            <div class=" w-[125px]">
              <input v-if="editAble" v-model="formData.reportDate" type="text" class=" border  w-full" />
              <p v-else class="w-full    my-0">
                {{ formData.reportDate }}
              </p>
            </div>

          </div>
          <div class="  flex items-center">
            <span class="mr-2 w-[60px]">报告医生: </span>
            <div class=" w-[125px]">
              <input v-if="editAble" type="text" class=" border w-full " />
              <p v-else class="w-full     my-0">
                {{ formData.reportDoctor }}
              </p>
            </div>
          </div>
          <div class=" flex items-center">
            <span class="mr-2 w-[60px]">审核医生: </span>
            <div class=" w-[125px]">
              <input v-if="editAble" type="text" class=" border w-full" />
              <p v-else class="w-full    my-0 ">
                {{ formData.auditDoctor }}
              </p>
            </div>
          </div>

        </div>


      </div>

    </div>



  </div>
</template>

<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import { serializeAge } from "@/assets/js/utils/dicom/inputFormat";

export default {
  name: "DiagnosisReport",

  props: {
    editAble: {
      type: Boolean,

    },
    reportData: {
      type: Object,
    },
  },
  watch: {
    reportData: {
      handler(newVal, oldVal) {
        const { studyDate, reportDate, finding, diagnosis, patientAge } = newVal
        this.formData = newVal
        this.formData.studyDate = studyDate ? studyDate.split(" ")[0] : ''
        this.formData.reportDate = reportDate ? reportDate.split(" ")[0] : ''


        this.formData.patientAge = serializeAge({
          dataSource: patientAge,
          unit: true,
          language: "zh",
        }).replaceAll('岁', '');
        this.formData.finding = finding ? finding
          .replace(/&sup3;/g, "³")  // 替换 &sup3; 为 ³
          .replace(/&#xff0c;/g, "，") // 替换 &#xff0c; 为 ，
          .replace(/&#x5c;n/g, "\n") // 替换 &#x5c;n 为 换行符
          .replace(/&#x28;/g, "(")  // 替换 &#x28; 为 (
          .replace(/&#x29;/g, ")")  // 替换 &#x29; 为 )
          .replace(/&deg;/g, "°")  // 替换 &deg; 为 °
          : ''
        this.formData.diagnosis = diagnosis ? diagnosis
          .replace(/&sup3;/g, "³")  // 替换 &sup3; 为 ³
          .replace(/&#xff0c;/g, "，") // 替换 &#xff0c; 为 ，
          .replace(/&#x5c;n/g, "\n") // 替换 &#x5c;n 为 换行符
          .replace(/&#x28;/g, "(")  // 替换 &#x28; 为 (
          .replace(/&#x29;/g, ")")  // 替换 &#x29; 为 )
          .replace(/&deg;/g, "°")  // 替换 &deg; 为 °
          : ''
      }
    },
    deep: true
  },
  data() {
    return {
      formData: {}
    }
  },
  methods: {
    // created() {
    //   const { studyDate, reportDate, finding, diagnosis } = this.reportData
    //   this.formData = this.reportData
    //   this.formData.studyDate = studyDate ? studyDate.split(" ")[0] : ''
    //   this.formData.reportDate = reportDate ? reportDate.split(" ")[0] : ''
    //   this.formData.finding = finding ? finding.replace(/&sup3;/g, "³").replace(/&#xff0c;/g, "，") : ''
    //   this.formData.diagnosis = diagnosis ? diagnosis.replace(/&sup3;/g, "³").replace(/&#xff0c;/g, "，") : ''

    // }
  },
};
</script>

<style scoped>
.report-container {
  position: relative;
  font-family: Arial, sans-serif;
  width: 700px;
  height: 980px;
  background-color: #fff;
  color: black;
  padding: 0 35px;
  box-sizing: border-box;

  .header {
    line-height: 80px;
    height: 80px;
    text-align: center;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    margin: 0 35px;
    /* width: 100%; */
    width: 630px;
    position: absolute;
    left: 0px;
    bottom: 0px;
    height: 80px;

  }

  .footer {}
}

@media print {
  body {
    margin: 0;
    padding: 0;
    background: #fff;
  }

  .report-container {
    width: auto;
    min-height: auto;
    padding: 20mm;
    border: none;
    box-shadow: none;
  }

  button {
    display: none;
  }
}
</style>
