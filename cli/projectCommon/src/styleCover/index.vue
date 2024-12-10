<template>
  <div class="page_full">
    <div class="headerTop">
      <PacsPageHeader></PacsPageHeader>
    </div>
    <div style="height: 80px"></div>
    <div class="contentMain">
      <div class="headerBox">
        <ta-row type="flex" justify="space-between">
          <ta-col :span="20">
            <ta-form-model :layout="'inline'" :model="form">
              <ta-form-model-item label="检查时间">
                <ta-select defaultValue="custom" style="width: 120px" @change="handleChange_jstime"
                  :options="options_querytime" :options-key="optionsKey" />
              </ta-form-model-item>
              <ta-form-model-item>
                <div class="custom_pickerDeepBlue">
                  <ta-range-picker @change="onChange" :value="form.rangeDate" :allow-one="true"
                    :getCalendarContainer="(trigger) => trigger.parentElement" />
                </div>
              </ta-form-model-item>
              <ta-form-model-item label="患者信息">
                <ta-input-group compact>
                  <ta-select defaultValue="011" @change="handleChange_hzinfo" :options="options_patientInfo"
                    :options-key="optionsKey_patientInfo">
                  </ta-select>
                  <ta-input style="width: 100px" />
                </ta-input-group>
              </ta-form-model-item>
              <ta-form-model-item label="算法类型">
                <ta-select defaultValue="" style="width: 120px" @change="handleChange_sdlx" :options="options_suanfa"
                  :options-key="optionsKey_suafa">
                </ta-select>
              </ta-form-model-item>
              <ta-form-model-item label="计算状态">
                <ta-select defaultValue="" style="width: 120px" @change="handleChange_jszt" :options="options_jszt"
                  :options-key="optionsKey_jszt">
                </ta-select>
              </ta-form-model-item>
              <ta-form-model-item>
                <ta-button type="primary" class="mr-[8px]">查询</ta-button>
                <ta-button>重置</ta-button>
                <!-- <ta-button @click="goto_workplatform">跳转</ta-button> -->
              </ta-form-model-item>
            </ta-form-model>
          </ta-col>
          <ta-col>
            <div class="btn_ctrl flex justify-start">
              <ta-button class="aghost__border-grey-1 flex items-center mr-[12px]" type="solid" :ghost="true"><i
                  class="ico_star mr-[5px]"></i><span>我的收藏</span></ta-button>
              <ta-button class="aghost__border-grey-1 flex items-center" type="solid" :ghost="true"
                @click="handle_openfiledraw"><i class="ico_upd mr-[5px]"></i><span>上传文件</span></ta-button>
            </div>
          </ta-col>
        </ta-row>
      </div>
      <div class="tableBox">
        <!-- <ta-big-table
          border
          ref="xTable"
          height="300"
          :data="tableData"
          :columns="tableColumns"
        > -->
        <ta-big-table ref="xTable" height="auto" auto-resize :data="tableData" highlight-hover-row border="inner">
          <ta-big-table-column field="is-collect" title="#" width="60" fixed="left">
            <template #default="{ row, rowIndex }">
              <div class="hover:cursor-pointer" @click="handle_star(row, rowIndex)">
                <ta-icon v-if="row.collect === 1" :style="starOn_style" type="star" theme="filled" />
                <ta-icon v-else type="star" />
              </div>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="examinationId" title="检查号" width="150" fixed="left">
          </ta-big-table-column>
          <ta-big-table-column field="patientId" title="患者ID" width="120" fixed="left">
          </ta-big-table-column>
          <ta-big-table-column field="patientName" title="患者姓名" width="130" fixed="left">
          </ta-big-table-column>
          <ta-big-table-column field="age" title="年龄" width="70">
          </ta-big-table-column>
          <ta-big-table-column field="examinationTime" title="检查时间" width="180">
          </ta-big-table-column>
          <ta-big-table-column field="examinationDescription" title="检查描述" min-width="150">
          </ta-big-table-column>
          <ta-big-table-column field="seriesCount" title="序列数" width="130">
          </ta-big-table-column>
          <ta-big-table-column field="mathType" title="算法类型" width="140">
          </ta-big-table-column>

          <ta-big-table-column fixed="right" field="operate" title="操作" width="320">
            <template #default="{ row, rowIndex }">
              <ta-row type="flex" justify="space-around">
                <ta-col :span="18">
                  <a class="alink" @click="handleEdit(rowIndex, row)">
                    查看结果
                  </a>
                  <ta-divider type="vertical" />
                  <a class="alink"> 重新分析 </a>
                  <ta-divider type="vertical" />
                  <a class="alink" @click="handle_star(row, rowIndex)">
                    <template v-if="row.collect === 1"> 取消收藏 </template>
                    <template v-else> 添加收藏 </template>
                  </a>
                </ta-col>
                <ta-col>
                  <ta-icon type="close-circle" :style="{ color: '#959b9b' }" theme="filled" class="hover:cursor-pointer"
                    @click="handle_delRow(row, rowIndex)" />
                </ta-col>
              </ta-row>
            </template>
          </ta-big-table-column>

          <template slot="bottomBar">
            <!-- <ta-pagination
              ref="gridPager"
              style="text-align: right"
              :data-source.sync="tableData"
              :params="userPageParams"
            /> -->
            <ta-pagination style="text-align: right" sizeChangeInput showSizeChanger :pageSize.sync="pageSizeInput"
              @showSizeChange="onShowSizeChange" :defaultCurrent="3" :total="500" />
          </template>
        </ta-big-table>
      </div>
      <div class="analysis_result_listbox">
        <ta-big-table ref="xTable_anaRes" height="auto" highlight-hover-row auto-resize :data="tableData_anaRes"
          border="inner">
          <ta-big-table-column field="is-collect" title="#" width="60">
            <template #default="{ row, rowIndex }">
              <div class="hover:cursor-pointer" @click="handle_star_subTable(row, rowIndex)">
                <ta-icon v-if="row.collect === 1" :style="starOn_style" type="star" theme="filled" />
                <ta-icon v-else type="star" />
              </div>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="xid" title="序列号">
          </ta-big-table-column>
          <ta-big-table-column field="desc" title="序列描述">
          </ta-big-table-column>
          <ta-big-table-column field="picNo" title="图形数量">
          </ta-big-table-column>
          <ta-big-table-column field="mathType" title="算法类型">
          </ta-big-table-column>
          <ta-big-table-column field="compactState" title="计算状态">
            <template #default="{ row }">
              <ta-tag v-if="row.compactState === '1'" color="cyan">计算成功</ta-tag>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="ctrlState" title="操作状态">
            <template #default="{ row }">
              <ta-tag v-if="row.ctrlState === '1'" color="pink">超时</ta-tag>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="ctrlDoctor" title="操作医师">
          </ta-big-table-column>
          <ta-big-table-column fixed="right" field="operate" title="操作" width="320">
            <template #default="{ row, rowIndex }">
              <ta-row type="flex" justify="space-around">
                <ta-col :span="18">
                  <a class="alink"> 查看结果 </a>
                  <ta-divider type="vertical" />
                  <a class="alink"> 重新分析 </a>
                  <ta-divider type="vertical" />
                  <a class="alink" @click="handle_star_subTable(row, rowIndex)">
                    <template v-if="row.collect === 1"> 取消收藏 </template>
                    <template v-else> 添加收藏 </template>
                  </a>
                </ta-col>
                <ta-col>
                  <ta-icon type="close-circle" :style="{ color: '#959b9b' }" theme="filled" class="hover:cursor-pointer"
                    @click="handle_delRow_subTable(row, rowIndex)" />
                </ta-col>
              </ta-row>
            </template>
          </ta-big-table-column>
        </ta-big-table>
      </div>
    </div>

    <ta-drawer :title="fileDraw.title" :headerHeight="fileDraw.headerHeight" placement="right" :width="fileDraw.width"
      :headerStyle="fileDraw.headerStyle" :bodyStyle="fileDraw.bodyStyle" :wrapStyle="fileDraw.wrapStyle"
      @close="fileDraw.onClose" :visible="fileDraw.visible">
      <ta-spin :spinning="spinning">
        <div class="custom_panel">
          <div class="custom_title pb-[20px]">上传数据</div>
          <div class="custom_context">
            <!-- <div
              class="upload_box flex flex-col items-center justify-center border border-dashed border-white pt-[50px] pb-[50px]"
            > -->
            <div class="upload_box border border-dashed border-white pt-[50px] pb-[50px]">
              <!-- <ta-upload
                :file-list="uploadObj.fileList"
                :before-upload="uploadObj.beforeUpload"
                :remove="uploadObj.handleRemove"
              >
                <ta-button type="primary" icon="upload" class="mb-4"
                  >上传数据</ta-button
                >
              </ta-upload> -->

              <ta-upload-dragger name="file" :multiple="false" webkitdirectory directory :showUploadList="false"
                @change="uploadObj.handleChange" :file-list="uploadObj.fileList" :before-upload="uploadObj.beforeUpload"
                :remove="uploadObj.handleRemove" style="background: transparent">
                <div class="ant-upload-drag-icon">
                  <ta-button type="primary" icon="upload" class="mb-4">上传数据</ta-button>
                  <!-- <input
                    type="file"
                    webkitdirectory
                    directory
                    @change="handleFile"
                  /> -->
                </div>
                <div class="ant-upload-text">
                  <div class="mid_subTit text-center">
                    <div class="mr-[10px]">
                      点击或拖入11.dcm文件/文件夹到本区域
                    </div>
                  </div>
                </div>
                <div class="ant-upload-hint">
                  <div class="mid_subTit text-center">
                    <div>文件大小最大5G,最多20个序列</div>
                  </div>
                </div>
              </ta-upload-dragger>

              <!-- <div class="mid_subTit flex">
                <div class="mr-[10px]">点击或拖入.dcm文件/文件夹到本区域</div>
                <div>文件大小最大5G,最多20个序列</div>
              </div> -->
            </div>
          </div>
        </div>
        <div class="custom_panel">
          <div class="custom_title pb-[20px] pt-[20px]">数据列表</div>
          <div class="custom_context highBox">
            <ta-big-table ref="xTable_upload_anaRes" height="auto" highlight-hover-row auto-resize
              :data="tableData_upload_anaRes" border="inner">
              <ta-big-table-column field="Accession_Number" title="检查号">
              </ta-big-table-column>
              <ta-big-table-column field="Patient_ID" title="患者ID">
              </ta-big-table-column>
              <ta-big-table-column field="Study_Instance_UID" title="序列ID">
              </ta-big-table-column>
              <ta-big-table-column field="Series_Description" title="序列描述">
              </ta-big-table-column>
              <ta-big-table-column field="Upload_time" title="上传时间">
              </ta-big-table-column>
              <ta-big-table-column field="state" title="状态">
                <template #default="{ row }">
                  <ta-tag v-if="row.state === '1'" color="green">上传成功</ta-tag>
                </template>
              </ta-big-table-column>
              <ta-big-table-column field="mathtype" title="算法类型">
                <template #default="{ row }">
                  <ta-tag v-if="row.mathtype === '1'" color="blue">自动</ta-tag>
                </template>
              </ta-big-table-column>
            </ta-big-table>
          </div>
        </div>
      </ta-spin>
    </ta-drawer>
  </div>
</template>
<script lang='jsx'>
import Vue from "vue";
import PacsPageHeader from "@/components/pacs-page-header/index.vue";

import {
  startDiagnose,
  getExaminationList,
  uploadExamination,
  isExit,
  xhr_uploadDicom,
} from "@/api";
import { v4 as uuidv4 } from "uuid";
// import dicomParser from "dicom-parser/dist/dicomParser.js";
// import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoaderNoWebWorkers.bundle.min";
// import cornerstone from "cornerstone-core";
// import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoader.min.js";
// wasm单独用全局版-生成bug先注释
// import cornerstoneWADOImageLoader from "cornerstone-wado-image-loader/dist/cornerstoneWADOImageLoaderNoWebWorkers.bundle.min";
// import * as cornerstone from "cornerstone-core";
// import dicomParser from "dicom-parser";
// import * as dicomParser from 'dicom-parser';
// import cornerstoneWADOImageLoader from "@cornerstonejs/dicom-image-loader";

import JSZip from "jszip";
// import cornerstone from "cornerstone-core/dist/cornerstone";

import { readDicomTags } from "@itk-wasm/dicom";
import { dicomTagsDescriptions } from "@/assets/js/utils/dicom/codeDesc";

import Upload from "@yh/ta404-ui/es/upload";
import "@yh/ta404-ui/es/upload/style";
Vue.use(Upload);

// import Spin from '@yh/ta404-ui/es/spin';
// import '@yh/ta404-ui/es/spin/style';
// Vue.use(Spin)

import AlgorithmTypeSelect from "./module/AlgorithmTypeSelect.vue";

export default {
  name: "manageDicom",
  components: {
    PacsPageHeader,
    AlgorithmTypeSelect,
  },
  data() {
    const tableColumns = [
      {
        title: "#",
        field: "is-collect",
        width: 50,
      },
      {
        title: "检查号",
        field: "qid",
        customRender: {
          default: ({ row }, h) => {
            console.log("row, h", row, h);
            console.log("-this.$createElement", this.$createElement);
            // return '-'
            return h("span", {}, `${row.qid}来了老弟`);
          },
        },
      },
    ];
    return {
      algorMathSelectConfig: {
        show: true,
        confirmLoading: false,
        onOk: async (e) => {
          console.log("onOk", e);
          const { fileList } = this.uploadObj;
          console.log("压缩前-", fileList);

          if (fileList.length > 0) {
            const zip = new JSZip();

            const filePromises = fileList.map(async (file) => {
              try {
                const arrayBuffer = await file.arrayBuffer();
                console.log("arrayBuffer==", arrayBuffer);
                const byteArray = new Uint8Array(arrayBuffer);
                console.log("byteArray==", byteArray);

                const isDicom = dicomParser.parseDicom(byteArray);
                console.log("isDicom==", isDicom);

                if (isDicom) {
                  zip.file(file.name, file);
                } else {
                  console.log(`${file.name} is not a DICOM file.`);
                }
              } catch (error) {
                console.error(`Error processing file ${file.name}:`, error);
              }
            });

            const results = await Promise.allSettled(filePromises);

            results.forEach((result, index) => {
              if (result.status === "rejected") {
                console.error(`Error processing file ${fileList[index].name}:`, result.reason);
              }
            });




            const content = zip.generateAsync({ type: 'blob', compression: 'DEFLATE' }).then((blob) => {
              console.log("merge--zip-blob:", blob);

              // 获取当前时间戳并格式化
              const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
              const zipFileName = `archive-${timestamp}.zip`;

              const zipFile = new File([blob], zipFileName, { type: blob.type });
              console.log("zipFile=", zipFile);

              /* api文件测试用 start*/
              // 创建一个指向 Blob 的 URL
              //  const url = URL.createObjectURL(blob);
              // 创建一个下载链接
              // const link = document.createElement('a');
              //  link.href = url;
              // link.download = 'archive.zip'; // 设置下载文件的名称
              // 触发点击事件以开始下载
              // document.body.appendChild(link);
              // link.click();
              // 下载完成后，撤销 URL 并清理锚点
              // document.body.removeChild(link);
              // URL.revokeObjectURL(url);
              /* api文件测试用 end*/

              xhr_uploadDicom({
                // algorithmConfig: `[{}]`,
                caseFile: zipFile,
              })
                .then((item) => {
                  console.log("xhr_uploadDicom___item:", item);
                  this.$set(this.tableData_upload_anaRes, 0, {
                    ...this.tableData_upload_anaRes[0],
                    state: "1",
                    mathtype: "1",
                  })
                  this.$box.update({ visible: false });
                });
            });
          }
        },
        onCancel: (e) => {
          console.log("onCancel", e);
          // this.algorMathSelectConfig.show = false;
          // console.log("this.$box==onCancel",this.$box);



          this.$box.update({ visible: false })
        },
      },
      spinning: false,
      uploadObj: {
        fileList: [],
        size: 0,
        handleChange: async (info) => {
          console.log(
            "info---",
            info,
            "info.fileList.length",
            info.fileList.length
          );

          const status = info.file.status;

          if (status !== "uploading") {
            console.log(info.file, info.fileList);
          }
          if (status === "done") {
            // this.$message.success(
            //   `${info.file.name} file uploaded successfully.`
            // );
            console.log(
              "info.file, info.fileList==change",
              info.file,
              info.fileList,
              info.fileList.length
            );

            if (info.fileList.length % 2 === 1) {
              this.$set(this.uploadObj, "size", info.fileList.length - 1);
              // this.uploadObj.size = info.fileList.length - 1;
            } else if (info.fileList.length % 2 === 0) {
              this.$set(this.uploadObj, "size", info.fileList.length);
              // this.uploadObj.size = info.fileList.length;
            }
            console.log("this.uploadObj==size", this.uploadObj.size);
            if (this.uploadObj.size === info.fileList.length) {
              console.log("全部载入", this.uploadObj.size);

              // this.uploadObj.fnUpload(info.file, info.fileList);

            }
          } else if (status === "error") {
            this.$message.error(`${info.file.name} file upload failed.`);
          }
        },
        beforeUpload: async (file) => {
          this.spinning = true;
          // console.log("beforeUpload*****", file);

          this.uploadObj.fileList = [...this.uploadObj.fileList, file];
          // console.log(
          //   "this.uploadObj.fileList--befire",
          //   this.uploadObj.fileList
          // );
          /**
           * 前端解析校验逻辑和提起逻辑
           */
          if (this.uploadObj.fileList.length === 1) {
            console.log("第一片载入开始", this.uploadObj.fileList);
            // tags信息读取
            const fileOne = this.uploadObj.fileList[0];
            console.log("fileOne", fileOne);
            const tags = await readDicomTags(fileOne);
            this.tags = await readDicomTags(fileOne);
            console.log("tags____", tags, this.tags.tags);
            try {
              /* 参考：  {
              Accession_Number: "2021010203011",
              Patient_ID: "123123123",
              Study_Instance_UID: "1.2.3..3.1.123123123123",
              Series_Description: "1.25mm CHEST",
              mathType: "auto", //1:肺炎 2:肺结节 3:骨折 4：非门控钙化积分 （预设）
            }, */

              this.$ut
                .convertDicomTags(this.tags, dicomTagsDescriptions)
                .then((sysDicomTagInfo) => {
                  console.log("sysDicomTagInfo=", sysDicomTagInfo);
                  this.$message.success(`序列 解析完成`, 10);

                  const fieldsToMap = ["Accession_Number", "Patient_ID", "Study_Instance_UID", "Series_Description"];

                  const mappedValues = this.$ut.mapDicomTagsToValues(sysDicomTagInfo, fieldsToMap)

                  console.log("mappedValues==", mappedValues);
                  this.mappedValues = mappedValues;
                  this.spinning = false;
                  const { show, onOk, onCancel } = this.algorMathSelectConfig
                  this.$box = this.$confirm({
                    title: "算法类型选择",
                    icon: false,
                    // 建议使用这种方式传入content值，这里可以写原生HTML标签
                    // 或vue组件也可以以标签的形式在这里引入
                    // 写法与vue文件的template 完全一致，
                    // 需要注意的是，使用此种方式传入值时，必须使用英文的`()`包围
                    // 否则，编译会报错
                    content: (<AlgorithmTypeSelect itemData={[mappedValues]} />),
                    footer: (
                      <div class="btn_group flex">
                        <div class="w-full flex justify-end">
                          <div>
                            <ta-button on-click={(e) => onCancel(e)}>取消</ta-button>
                            <ta-button on-click={(e) => onOk(e)} type="primary">上传</ta-button>
                          </div>
                        </div>
                      </div>
                    ),
                    okText: "上传",
                    zoomable: true,
                    confirmLoading: this.algorMathSelectConfig.confirmLoading,
                    width: "calc(1358 / 1920 * 100vw)",
                    keyboard: false,
                    visible: this.algorMathSelectConfig.show,
                  });
                });
            } catch (error) {
              console.error("Error converting DICOM tags:", error.message);
            }
          }
          // this.uploadObj.fnUpload();

          return;
          // return false;
        },
        handleRemove: (file) => {
          const index = this.uploadObj.fileList.indexOf(file);
          const newFileList = this.uploadObj.fileList.slice();
          newFileList.splice(index, 1);
          this.uploadObj.fileList = newFileList;
        },
        // 测试用
        fnUpload: (file, fileList) => {
          console.log("start----fnUpload file, fileList", file, fileList);
          const dicom = fileList[0];
          console.log("dicom=", dicom);
          // debugger;
          xhr_uploadDicom({
            // algorithmConfig: `[{}]`,
            caseFile: dicom,
          }).then((item) => {
            console.log("xhr_uploadDicom___item:", item);
          });
        },
      },
      tableData_upload_anaRes: [
        // {
        //   Accession_Number: "20210407000133",
        //   Patient_ID: "16187278",
        //   Study_Instance_UID: "1.2.840.113619.2.289.3.168430441.447.1617294423.131.3",
        //   Series_Description: "1.25mm CHEST",
        //   Upload_time: "2024-06-14 11:52:02",
        //   state: "1",
        //   mathtype: "1",
        // },
      ],
      fileDraw: {
        title: "dicom文件上传",
        headerHeight: "65px",
        visible: false,
        onClose: () => {
          console.log("onClose");
          this.fileDraw.visible = false;
        },
        width: "100vw",
        headerStyle: {
          background: "#1F1F1F",
          color: "#fff",
        },
        bodyStyle: {
          background: "#1F1F1F",
          color: "#fff",
        },
        wrapStyle: {
          // width:'100vw'
        },
      },
      form: {
        fieldA: "",
        rangeDate: "",
      },
      optionsKey: {
        value: "value",
        label: "labName", // 默认值为'label'
        disabled: "disabled",
        key: "key",
      },
      options_querytime: [
        {
          labName: "今天",
          value: "today",
          key: "011",
        },
        {
          labName: "昨天",
          value: "yesterday",
          key: "012",
        },
        {
          labName: "三天内",
          value: "threedays",
          key: "013",
        },
        {
          labName: "一周内",
          value: "inweek",
          key: "014",
        },
        {
          labName: "自定义",
          value: "custom",
          key: "015",
        },
      ],
      optionsKey_patientInfo: {
        value: "value",
        label: "labName", // 默认值为'label'
        disabled: "disabled",
        key: "key",
      },
      options_patientInfo: [
        {
          labName: "检查号",
          value: "jch",
          key: "011",
        },
        {
          labName: "患者ID",
          value: "huanzheID",
          key: "012",
        },
        {
          labName: "患者姓名",
          value: "huanzheName",
          key: "013",
        },
      ],
      optionsKey_suafa: {
        value: "value",
        label: "labName", // 默认值为'label'
        disabled: "disabled",
        key: "key",
      },
      options_suanfa: [
        {
          labName: "全部",
          value: "",
          key: "all",
        },
        {
          labName: "冠脉CTA",
          value: "gm-cta",
          key: "011",
        },
        {
          labName: "门控钙化积分",
          value: "mk-ghjf",
          key: "012",
        },
        {
          labName: "头颈CTA",
          value: "tj-cta",
          key: "013",
        },
        {
          labName: "ICH",
          value: "ich",
          key: "014",
        },
        {
          labName: "胸肺CT",
          value: "xf-ct",
          key: "015",
        },
      ],
      optionsKey_jszt: {
        value: "value",
        label: "labName", // 默认值为'label'
        disabled: "disabled",
        key: "key",
      },
      options_jszt: [
        {
          labName: "全部",
          value: "",
          key: "all",
        },
        {
          labName: "计算成功",
          value: "jscg",
          key: "001",
        },
        {
          labName: "计算失败",
          value: "jssb",
          key: "002",
        },
        {
          labName: "计算中",
          value: "jsz",
          key: "003",
        },
        {
          labName: "等待计算",
          value: "ddjs",
          key: "004",
        },
        {
          labName: "计算取消",
          value: "jsqx",
          key: "005",
        },
      ],
      tableColumns,
      tableData: [],

      starOn_style: {
        color: `#F5A623`,
      },

      tableData_anaRes: [],
      pageSize: 20,
      current: 4,
      pageSizeInput: 12,
    };
  },
  watch: {
    pageSize(val) {
      console.log("pageSize", val);
    },
    current(val) {
      console.log("current", val);
    },
  },
  methods: {
    handleFile(e) {
      console.log("handleFile__", e);
    },
    goto_workplatform() {
      this.$router.push({
        path: "diagnose",
        query: {
          applyId: "83299b46-8d18-4e41-88eb-cab1afa67523",
        },
      });
    },
    handleEdit(index, row) {
      this.$router.push({
        path: "diagnose",
        query: {
          applyId: row.applyId,
        },
      });
    },
    extractDicomData(dataSet) {
      let examID = dataSet.string("x0020000d");
      if (examID !== "") {
        let lastIndex = examID.lastIndexOf(".");
        examID = examID.substring(lastIndex + 1);
      }

      let age = dataSet.string("x00101010");
      const regex = /0([^Y]*)Y/;
      const match = regex.exec(age);
      if (match && match[1]) {
        age = match[1];
      }
      return {
        examinationID: examID,
        studyInstanceUID: dataSet.string("x0020000d"),
        StudyDescription: dataSet.string("x00081030"),
        hospitalId: dataSet.string("x00081010"),
        modality: dataSet.string("x00080060"),
        accessionNumber: dataSet.string("x00080050"),
        patientID: dataSet.string("x00100020"),
        patientName: dataSet.string("x00100010"),
        patientAge: age,
        studyDate: dataSet.string("x00080020"),
        studyDescription: dataSet.string("x00081030"),
        seriesNumber: dataSet.string("x00200011"),
        applyId: uuidv4(),
      };
    },

    async createFormData(files, dicomData) {
      const zip = new JSZip();

      // 检查文件列表是否为空
      if (files && files.length > 0) {
        // 将所有文件添加到 zip 中
        files.forEach((file) => {
          const filename = file.name;
          const fileData = file instanceof Blob ? file : new Blob([file]);
          zip.file(filename, fileData);
        });
      }

      console.time("zip");
      // 生成 zip 文件
      const zipBlob = await zip.generateAsync({ type: "blob" });
      console.timeEnd("zip");
      // 创建 FormData 对象
      const formData = new FormData();
      formData.append("files", zipBlob, "files.zip");

      // 添加 DICOM 数据和其他参数到 FormData 对象
      Object.entries(dicomData).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      formData.append("examinedName", "胸部平扫");
      formData.append(
        "callbackUrl",
        "http://admin.itsea.com.cn:56808/api/examinations/aiResult"
        // ' http://5c24d9.natappfree.cc/api/examinations/aiResult' //不能用这个，修改状态接收不到了
      );

      return formData;
    },

    onShowSizeChange(current, pageSize) {
      console.log(current, pageSize);
    },
    handle_openfiledraw() {
      this.fileDraw.visible = true;
    },
    handleChange_jstime(value) {
      console.log(`selected ${value}`);
    },
    handleChange_hzinfo(value) {
      console.log(`selected ${value}`);
    },
    handleChange_sdlx(value) {
      console.log(`selected ${value}`);
    },
    handleChange_jszt(value) {
      console.log(`selected ${value}`);
    },
    onChange(date, dateString) {
      console.log(date, dateString);
    },
    handle_star(row, rowIndex) {
      // row.collect = 1;
      const { collect } = this.tableData[rowIndex];
      if (collect === 1) {
        this.$set(this.tableData[rowIndex], "collect", 0);
        this.$message.success("取消收藏成功");
      } else {
        this.$set(this.tableData[rowIndex], "collect", 1);
        this.$message.success("收藏成功");
      }
      console.log("row", row, rowIndex);
      console.log("this.tableData[rowIndex]=", this.tableData[rowIndex]);
    },
    handle_delRow(row, rowIndex) {
      console.log("this", this);
      this.$confirm({
        // icon:(<ta-icon type="info-circle" />),
        // icon:(<i>12312</i>),
        iconType: "info-circle",
        title: "确定删除该数据吗?",
        // 如果需要弹窗显示的仅为一个字符串文本，则可以直接传入字符串
        content: "确定要将骨折病变检出结果恢复至初始状态吗？",
        maskClosable: true,
        onOk: () => {
          this.$delete(this.tableData, rowIndex);
          this.$message.success("删除成功");
        },
      });
    },
    handle_delRow_subTable(row, rowIndex) {
      console.log("this", this);
      this.$confirm({
        // icon:(<ta-icon type="info-circle" />),
        // icon:(<i>12312</i>),
        iconType: "info-circle",
        title: "确定删除该数据吗?",
        // 如果需要弹窗显示的仅为一个字符串文本，则可以直接传入字符串
        content: "确定要将骨折病变检出结果恢复至初始状态吗？",
        maskClosable: true,
        onOk: () => {
          this.$delete(this.tableData_anaRes, rowIndex);
          this.$message.success("删除成功");
        },
      });
    },
    handle_star_subTable(row, rowIndex) {
      // row.collect = 1;
      const { collect } = this.tableData_anaRes[rowIndex];
      if (collect === 1) {
        this.$set(this.tableData_anaRes[rowIndex], "collect", 0);
        this.$message.success("取消收藏成功");
      } else {
        this.$set(this.tableData_anaRes[rowIndex], "collect", 1);
        this.$message.success("收藏成功");
      }
      console.log("row", row, rowIndex);
      console.log("this.tableData[rowIndex]=", this.tableData_anaRes[rowIndex]);
    },
    userPageParams() {
      return {};
    },
  },
  created() {
    this.tableData = [
      {
        qid: "DJ109090910212", //检查号
        hzId: "4123122111", //患者ID
        hzName: "李文豪", //患者姓名
        age: "62", //年龄
        qcTime: "2024.04.01 11:28", //检查时间
        qcRemark: "Chest", //检查描述
        seqNo: "01", //序列数
        mathType: "胸肺CT", //算法类型
      },
      {
        qid: "DJ109090910212", //检查号
        hzId: "4123122111", //患者ID
        hzName: "李文豪", //患者姓名
        age: "62", //年龄
        qcTime: "2024.04.01 11:28", //检查时间
        qcRemark: "Chest", //检查描述
        seqNo: "01", //序列数
        mathType: "胸肺CT", //算法类型
      },
      {
        qid: "DJ109090910212", //检查号
        hzId: "4123122111", //患者ID
        hzName: "李文豪", //患者姓名
        age: "62", //年龄
        qcTime: "2024.04.01 11:28", //检查时间
        qcRemark: "Chest", //检查描述
        seqNo: "01", //序列数
        mathType: "胸肺CT", //算法类型
      },
      {
        qid: "DJ109090910212", //检查号
        hzId: "4123122111", //患者ID
        hzName: "李文豪", //患者姓名
        age: "62", //年龄
        qcTime: "2024.04.01 11:28", //检查时间
        qcRemark: "Chest", //检查描述
        seqNo: "01", //序列数
        mathType: "胸肺CT", //算法类型
      },
      {
        qid: "DJ109090910212", //检查号
        hzId: "4123122111", //患者ID
        hzName: "李文豪", //患者姓名
        age: "62", //年龄
        qcTime: "2024.04.01 11:28", //检查时间
        qcRemark: "Chest", //检查描述
        seqNo: "01", //序列数
        mathType: "胸肺CT", //算法类型
      },
      {
        qid: "DJ109090910212", //检查号
        hzId: "4123122111", //患者ID
        hzName: "李文豪", //患者姓名
        age: "62", //年龄
        qcTime: "2024.04.01 11:28", //检查时间
        qcRemark: "Chest", //检查描述
        seqNo: "01", //序列数
        mathType: "胸肺CT", //算法类型
      },
    ];

    this.tableData_anaRes = [
      {
        xid: "4", //序列号
        desc: "1.25mm lung", //序列描述
        picNo: "209", //图形数量
        mathType: "胸肺CT", //算法类型
        compactState: "1", //计算状态 1：计算成功 2：失算失败 3：计算取消
        ctrlState: "1", //操作状态 1：超时 2：撤回 3:待审核 4：通过
        ctrlDoctor: "华佗",
      },
      {
        xid: "5", //序列号
        desc: "1.25mm lung", //序列描述
        picNo: "209", //图形数量
        mathType: "胸肺CT", //算法类型
        compactState: "1", //计算状态 1：计算成功 2：失算失败 3：计算取消
        ctrlState: "1", //操作状态 1：超时 2：撤回 3:待审核 4：通过
        ctrlDoctor: "华佗",
      },
      {
        xid: "6", //序列号
        desc: "1.25mm lung", //序列描述
        picNo: "209", //图形数量
        mathType: "胸肺CT", //算法类型
        compactState: "1", //计算状态 1：计算成功 2：失算失败 3：计算取消
        ctrlState: "1", //操作状态 1：超时 2：撤回 3:待审核 4：通过
        ctrlDoctor: "华佗",
      },
    ];
  },
  created() {
    const userId = "0";
    getExaminationList(userId).then((res) => {
      console.log("res.data=", res);
      this.tableData = res;
      // const result = res.data;
      // const { code } = result;
      // if (code === 1 || code === 2) {
      //   console.log("result.data=", result.data);
      //   this.tableData = result.data;
      // }
    });
    this.$nextTick(() => {
      setTimeout(() => {
        console.log("dicomParser===", dicomParser);
        // console.log("cornerstone==", cornerstone);
        // cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        // cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
        // console.log("cornerstoneWADOImageLoader==", cornerstoneWADOImageLoader);
      }, 5000);
    });
  },
  mounted() {
    this.$refs.gridPager.loadData((data) => { });
  },
};
</script>
<style lang='less' scoped>
.func_bgCover() {
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: 0 0;
}

.page_full {
  width: 100%;
  height: 100vh;
  background-color: @theme_backBg;

  .headerTop {
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
  }

  .contentMain {
    background-color: @theme_backBg;
    height: calc(100% - 81px);
    min-width: 1080px;
  }
}

.btn_ctrl {
  .ico_star {
    width: 15px;
    height: 15px;
    .func_bgCover();
    background-image: url(@/assets/images/manage/btn/star.png);
  }

  .ico_upd {
    width: 15px;
    height: 15px;
    .func_bgCover();
    background-image: url(@/assets/images/manage/btn/upload.png);
  }
}

.headerBox {
  padding: 32px 48px 31px 41px;
  // max-height: 103px;
  // height: calc(100% - 183px);
  // height: 448px;
}

/* 默认样式，适用于1920*1080分辨率 */
.tableBox {
  min-height: calc(100% - 434px);
}

.analysis_result_listbox {
  min-height: 300px;
}

/* 当屏幕宽度小于1920px时应用的样式 */
@media only screen and (max-width: 1919px) {
  .tableBox {
    min-height: calc(100% - 400px);
    /* 适配稍小的屏幕，减少高度 */
  }
}

/* 当屏幕宽度小于1366px时应用的样式 */
@media only screen and (max-width: 1365px) {
  .tableBox {
    min-height: calc(100% - 390px);
    /* 进一步适配更小的屏幕 */
  }

  .analysis_result_listbox {
    min-height: 250px;
    /* 减小列表框的最小高度 */
  }
}

/* 特定于笔记本分辨率的样式 */
@media only screen and (min-width: 1367px) and (max-width: 1919px) {
  .tableBox {
    min-height: calc(100% - 395px);
    /* 适配笔记本屏幕 */
  }

  .analysis_result_listbox {
    min-height: 200px;
    /* 适配笔记本屏幕的列表框最小高度 */
  }
}

// .custom_pickerDeepBlue {
//   /deep/.ant-calendar-picker-container {
//     color: @primary-color !important;
//   }
// }

.tableBox,
.analysis_result_listbox {
  margin: 0 41px;
}

.highBox {
  height: calc(100vh - 500px);
}

.upload_box {
  /deep/ .ant-upload {
    background: transparent !important;
  }
}
</style>
