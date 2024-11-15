<template>
  <div>
    <div id="reportContent" class="report-container">
      <button class="bg-blue-500 text-white px-4 py-2 rounded" @click="changeEditable">编辑</button>

      <h2 class="text-center text-2xl  lh-5 font-bold my-6">CT影像诊断报告单</h2>
      <div class="w-full     text-5 border-b pb-2 mb-3">


        <div class="w-full flex justify-between border items-center space-x-4 py-2">
          <div>
            <span>患者编号: </span>
            <input v-if="editAble" type="text" class="w-20 border px-2 py-1" />
            <p v-else class="  bg-amber px-2 py-1 inline-block">
              {{ reportData.patientId }}
            </p>
          </div>
          <div class="w-1/3">
            <span>检查号: </span>
            <input v-if="editAble" type="text" class="w-20 border px-2 py-1" />
            <p v-else class="  bg-amber px-2 py-1 inline-block">
              {{ reportData.accessionNumber }}
            </p>
          </div>
          <div class="w-1/3">
            <span>检查日期: </span>
            <input v-if="editAble" type="text" class="w-20 border px-2 py-1" />
            <p v-else class="  bg-amber px-2 py-1 inline-block">
              {{ reportData.studyDate }}
            </p>
          </div>

        </div>
        <div class="w-full flex border items-center   py-2">
          <span></span>
          <p>姓名: {{ reportData.patientName }}</p>
          <p>性别: {{ reportData.patientSex }}</p>
          <p>年龄: {{ reportData.patientAge }}</p>
          <p>检查项目: {{ reportData.examinedName }}</p>
        </div>


      </div>
      <div class=" mb-5">
        <h3 class="text-base font-bold mb-1">影像所见</h3>
        <div>
          <ta-textarea class="  b-none bg-white" :defaultValue="reportData.finding" :max-length="400"
            :show-max-length="true" :rows="10" />
        </div>

      </div>
      <div class="mb-5">
        <h3 class="text-base font-bold mb-1">影像诊断</h3>
        <div>
          <ta-textarea class="  b-none bg-white" :defaultValue="reportData.diagnosis" :max-length="400"
            :show-max-length="true" :rows="8" />
        </div>
      </div>
      <div class="text-sm border-t pt-2 flex justify-between">
        <p>报告日期: {{ reportData.reportDate }}</p>
        <p>报告医生: {{ reportData.reportDoctor }}</p>
        <p>审核医生: {{ reportData.auditDoctor }}</p>
      </div>
    </div>
    <div class="mt-5 flex space-x-3">
      <button @click="generatePDF" class="bg-blue-500 text-white px-4 py-2 rounded">生成PDF并下载</button>
      <button @click="printReport" class="bg-green-500 text-white px-4 py-2 rounded">打印报告</button>
    </div>
  </div>
</template>

<script>
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default {
  name: "DiagnosisReport",
  props: {
    reportData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editAble: false,
    }
  },
  methods: {
    changeEditable() {
      this.editAble = !this.editAble
    },
    generatePDF() {
      const input = document.getElementById("reportContent");
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");

        const imgWidth = 190;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save("diagnosis_report.pdf");
      });
    },
    printReport() {
      const content = document.getElementById("reportContent");
      const printWindow = window.open("", "_blank");
      const styles = [...document.styleSheets]
        .map(style => style.href ? `<link rel="stylesheet" href="${style.href}" />` : "")
        .join("\n");

      printWindow.document.open();
      printWindow.document.write(`
    <html>
      <head>
        <title>打印报告</title>
        ${styles}
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
        </style>
      </head>
      <body onload="window.print(); window.close();">
        ${content.outerHTML}
      </body>
    </html>
  `);
      printWindow.document.close();
    }
  },
};
</script>

<style scoped>
.report-container {
  font-family: Arial, sans-serif;
  width: 700px;
  height: 980px;
  background-color: #fff;
  color: black;
  border: 1px solid #ddd;
  padding: 0 35px;
  box-sizing: border-box;
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
