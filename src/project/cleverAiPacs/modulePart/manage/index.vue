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
            <ta-form-model :layout="'inline'" ref="searchForm" :model="form">
              <ta-form-model-item label="检查时间" prop="qaTime">
                <ta-select
                  style="width: 120px"
                  v-model="form.qaTime"
                  @change="qaTimeOb.onChange"
                  :options="qaTimeOb.options"
                  :options-key="qaTimeOb.optionskV"
                />
              </ta-form-model-item>
              <ta-form-model-item v-if="rangeDateOb.show" prop="rangeDate">
                <div class="custom_pickerDeepBlue">
                  <ta-range-picker
                    @change="rangeDateOb.onChange"
                    :format="rangeDateOb.dateFormat"
                    v-model="form.rangeDate"
                    :allow-one="true"
                    :getCalendarContainer="(trigger) => trigger.parentElement"
                  />
                </div>
              </ta-form-model-item>
              <ta-form-model-item label="患者信息" prop="patientValue">
                <ta-input-group compact>
                  <ta-select
                    style="width: 100px"
                    v-model="form.patientInfo"
                    @change="patientMapOb.onChange"
                    :options="patientMapOb.options"
                    :options-key="patientMapOb.optionskV"
                  >
                  </ta-select>
                  <ta-input
                    allowClear
                    style="width: 100px"
                    v-model="form.patientValue"
                  />
                </ta-input-group>
              </ta-form-model-item>
              <ta-form-model-item label="算法类型" prop="mathType">
                <ta-select
                  style="width: 120px"
                  v-model="form.mathType"
                  @change="mathTypeMapOb.onChange"
                  :options="mathTypeMapOb.options"
                  :options-key="mathTypeMapOb.optionskV"
                >
                </ta-select>
              </ta-form-model-item>
              <ta-form-model-item label="计算状态" prop="computeState">
                <ta-select
                  style="width: 120px"
                  v-model="form.computeState"
                  @change="computeStateMapOb.onChange"
                  :options="computeStateMapOb.options"
                  :options-key="computeStateMapOb.optionskV"
                >
                </ta-select>
              </ta-form-model-item>
              <ta-form-model-item>
                <ta-button
                  type="primary"
                  class="mr-[8px]"
                  @click="handle_queryDicomList"
                  >查询</ta-button
                >
                <ta-button @click="handle_searchItem_reset">重置</ta-button>
                <ta-button @click="goto_workplatform">跳转</ta-button>
              </ta-form-model-item>
            </ta-form-model>
          </ta-col>
          <ta-col>
            <div class="btn_ctrl flex justify-start">
              <ta-button
                @click="handle_favorite_querylist"
                class="aghost__border-grey-1 flex items-center mr-[12px]"
                :ghost="true"
                ><i class="ico_star mr-[5px]"></i
                ><span>我的收藏</span></ta-button
              >
              <ta-button
                class="aghost__border-grey-1 flex items-center"
                :ghost="true"
                @click="handle_openfiledraw"
                ><i class="ico_upd mr-[5px]"></i
                ><span>上传文件</span></ta-button
              >
            </div>
          </ta-col>
        </ta-row>
      </div>
      <div class="tableBox">
        <ta-big-table
          ref="xTable"
          height="auto"
          auto-resize
          :data="tableData"
          @cell-click="tableDataConfig.cellClickEvent"
          highlight-hover-row
          border="inner"
        >
          <ta-big-table-column
            field="myFavorite"
            title="#"
            width="60"
            fixed="left"
          >
            <template #default="{ row, rowIndex }">
              <div
                class="hover:cursor-pointer"
                @click="handle_star(row, rowIndex)"
              >
                <ta-icon
                  v-if="row.myFavorite"
                  :style="starOn_style"
                  type="star"
                  theme="filled"
                />
                <ta-icon v-else type="star" />
              </div>
            </template>
          </ta-big-table-column>
          <ta-big-table-column
            field="accessionNumber"
            title="检查号"
            width="150"
            fixed="left"
          >
          </ta-big-table-column>
          <ta-big-table-column
            field="patientId"
            title="患者ID"
            width="120"
            fixed="left"
          >
          </ta-big-table-column>
          <ta-big-table-column
            field="patientName"
            title="患者姓名"
            width="130"
            fixed="left"
          >
          </ta-big-table-column>
          <ta-big-table-column
            field="patientAge"
            title="年龄"
            :formatter="tableDataConfig.formatter.patientAge"
            width="70"
          >
          </ta-big-table-column>
          <ta-big-table-column
            field="studyDateAndTime"
            title="检查时间"
            width="180"
          >
          </ta-big-table-column>
          <ta-big-table-column
            field="studyDescription"
            title="检查描述"
            min-width="150"
          >
          </ta-big-table-column>
          <ta-big-table-column field="seriesCount" title="序列数" width="130">
          </ta-big-table-column>
          <ta-big-table-column
            field="algorithmType"
            title="算法类型"
            width="140"
          >
            <template #default="{}">
              <ta-tag color="blue">自动</ta-tag>
            </template>
          </ta-big-table-column>

          <ta-big-table-column
            fixed="right"
            field="operate"
            title="操作"
            width="320"
          >
            <template #default="{ row, rowIndex }">
              <ta-row type="flex" justify="space-around">
                <ta-col :span="18">
                  <pacs-abtn
                    :disabled.sync="row.isDisabled"
                    @click="handleEdit(rowIndex, row)"
                    >查看结果</pacs-abtn
                  >
                  <ta-divider type="vertical" />
                  <pacs-abtn
                    :disabled.sync="row.isDisabled"
                    :exclude="true"
                    @click="handle_replay_xrd(rowIndex, row)"
                    >重新分析</pacs-abtn
                  >
                  <ta-divider type="vertical" />
                  <pacs-abtn
                    :disabled.sync="row.isDisabled"
                    @click="handle_star(row, rowIndex)"
                  >
                    <template v-if="row.myFavorite"> 取消收藏 </template>
                    <template v-else> 添加收藏 </template>
                  </pacs-abtn>
                </ta-col>
                <ta-col>
                  <ta-icon
                    type="close-circle"
                    :style="{ color: '#959b9b' }"
                    theme="filled"
                    class="hover:cursor-pointer"
                    @click="handle_delRow(row, rowIndex)"
                  />
                </ta-col>
              </ta-row>
            </template>
          </ta-big-table-column>

          <template slot="bottomBar">
            <ta-pagination
              style="text-align: right"
              :dataSource.sync="tableData"
              :showTotal="false"
              sizeChangeInput
              :showSizeChanger="false"
              :url="managerDicomTableConf.queryUrl"
              :params="managerDicomTableConf.fnParams"
              :pageSize.sync="managerDicomTableConf.pageInfo.pageSize"
              @showSizeChange="managerDicomTableConf.onShowSizeChange"
              @change="managerDicomTableConf.onChange"
              :defaultCurrent="managerDicomTableConf.pageInfo.pageNumber"
              :total="managerDicomTableConf.pageInfo.total"
              ref="gridPager"
            />
          </template>
        </ta-big-table>
      </div>
      <div class="analysis_result_listbox">
        <ta-big-table
          ref="xTable_anaRes"
          height="auto"
          highlight-hover-row
          auto-resize
          :data="tableData_anaRes"
          border="inner"
        >
          <ta-big-table-column field="is-collect" title="#" width="60">
            <template #default="{ row, rowIndex }">
              <div
                class="hover:cursor-pointer"
                @click="handle_star_subTable(row, rowIndex)"
              >
                <ta-icon
                  v-if="row.myFavorite"
                  :style="starOn_style"
                  type="star"
                  theme="filled"
                />
                <ta-icon v-else type="star" />
              </div>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="seriesNumber" title="序列号">
          </ta-big-table-column>
          <ta-big-table-column field="seriesDescription" title="序列描述">
          </ta-big-table-column>
          <ta-big-table-column field="imageCount" title="图形数量">
          </ta-big-table-column>
          <ta-big-table-column field="algorithmType" title="算法类型">
            <template #default="{}">
              <ta-tag color="blue">自动</ta-tag>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="computeStatus" title="计算状态">
            <template #default="{ row }">
              <ta-tag v-if="row.computeStatus === '3'" color="#87cdfc"
                >计算成功</ta-tag
              >
              <ta-tag v-if="row.computeStatus === '2'" color="#e7ee33"
                >计算中</ta-tag
              >
              <ta-tag v-if="row.computeStatus === '1'" color="#e4393c"
                >计算失败</ta-tag
              >
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="ctrlState" title="操作状态">
            <template #default="{}">
              <ta-tag color="#f37c32">正常解析</ta-tag>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="ctrlDoctor" title="操作医师">
            <template #default="{}"> 汪彩霞 </template>
          </ta-big-table-column>
          <ta-big-table-column
            fixed="right"
            field="operate"
            title="操作"
            width="320"
          >
            <template #default="{ row, rowIndex }">
              <ta-row type="flex" justify="space-around">
                <ta-col :span="18">
                  <pacs-abtn
                    v-if="temp_isViewResultBtn(row.computeStatus)"
                    :disabled.sync="row.isDisabled"
                    @click="handleEdit1(rowIndex, row)"
                    >查看结果</pacs-abtn
                  >
                  <pacs-abtn v-else :disabled="true">查看结果</pacs-abtn>
                  <ta-divider type="vertical" />
                  <pacs-abtn
                    v-if="temp_isViewResultBtn(row.computeStatus)"
                    :disabled.sync="row.isDisabled"
                    :exclude="true"
                    @click="handle_replay_xrd1(rowIndex, row)"
                    >重新分析</pacs-abtn
                  >
                  <pacs-abtn v-else :disabled="true">重新分析</pacs-abtn>
                  <ta-divider type="vertical" />
                  <pacs-abtn
                    v-if="temp_isViewResultBtn(row.computeStatus)"
                    :disabled.sync="row.isDisabled"
                    @click="handle_star_subTable(row, rowIndex)"
                  >
                    <template v-if="row.myFavorite"> 取消收藏 </template>
                    <template v-else> 添加收藏 </template>
                  </pacs-abtn>
                  <pacs-abtn v-else :disabled="true">
                    <template v-if="row.myFavorite"> 取消收藏 </template>
                    <template v-else> 添加收藏 </template>
                  </pacs-abtn>
                </ta-col>
                <ta-col>
                  <ta-icon
                    type="close-circle"
                    :style="{ color: '#959b9b' }"
                    theme="filled"
                    class="hover:cursor-pointer"
                    @click="handle_delRow_subTable(row, rowIndex)"
                  />
                </ta-col>
              </ta-row>
            </template>
          </ta-big-table-column>
        </ta-big-table>
      </div>
    </div>

    <ta-drawer
      :title="fileDraw.title"
      :headerHeight="fileDraw.headerHeight"
      placement="right"
      :width="fileDraw.width"
      :headerStyle="fileDraw.headerStyle"
      :bodyStyle="fileDraw.bodyStyle"
      :wrapStyle="fileDraw.wrapStyle"
      @close="fileDraw.onClose"
      :visible="fileDraw.visible"
    >
      <ta-spin :spinning="spinning">
        <div class="custom_panel">
          <div class="custom_title pb-[20px]">上传数据</div>
          <div class="custom_context">
            <div
              class="upload_box border border-dashed border-white pt-[50px] pb-[50px]"
            >
              <ta-upload-dragger
                name="file"
                :multiple="false"
                webkitdirectory
                directory
                :showUploadList="false"
                @change="uploadObj.handleChange"
                :file-list="uploadObj.fileList"
                :before-upload="uploadObj.beforeUpload"
                :remove="uploadObj.handleRemove"
                style="background: transparent"
              >
                <div class="ant-upload-drag-icon">
                  <ta-button type="primary" icon="upload" class="mb-4"
                    >上传数据</ta-button
                  >
                </div>
                <div class="ant-upload-text">
                  <div class="mid_subTit text-center">
                    <div class="mr-[10px]">
                      点击或拖入.dcm文件/文件夹到本区域
                    </div>
                  </div>
                </div>
                <div class="ant-upload-hint">
                  <div class="mid_subTit text-center">
                    <div>文件大小最大5G,最多20个序列</div>
                  </div>
                </div>
              </ta-upload-dragger>
            </div>
          </div>
        </div>
        <div class="custom_panel">
          <div class="custom_title pb-[20px] pt-[20px]">数据列表</div>
          <div class="custom_context highBox">
            <ta-big-table
              ref="xTable_upload_anaRes"
              height="auto"
              highlight-hover-row
              auto-resize
              :data="tableData_upload_anaRes"
              border="inner"
            >
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
                  <ta-tag v-if="row.state === '1'" color="green"
                    >上传成功</ta-tag
                  >
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

    <ta-spin class="loadTop_full" :spinning="spinning"></ta-spin>
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
  xhr_pageStudies,
  xhr_addFavorite,
  xhr_removeFavorite,
  xhr_reCompute,
  xhr_deleteSeries,
  xhr_deleteStudy,
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
// import cornerstone from "cornerstone-core/dist/cornerstone";

import cornerstoneWADOImageLoader from "@cornerstonejs/dicom-image-loader";
import JSZip from "jszip";

import { readDicomTags } from "@itk-wasm/dicom";
import { dicomTagsDescriptions } from "@/assets/js/utils/dicom/codeDesc";
import { PATIENT_LABOPTIONS,isPatientOptionValid } from "@/assets/js/utils/dicom/select";
import { CalculationStatus,calculationStatusDictionary,isCalculationStatusValid } from "@/assets/js/utils/dicom/computeState";
import { serializeAge } from "@/assets/js/utils/dicom/inputFormat";

import Upload from "@yh/ta404-ui/es/upload";
import "@yh/ta404-ui/es/upload/style";
Vue.use(Upload);

import pacsAbtn from "@/components/pacs-abtn/index.vue";

import AlgorithmTypeSelect from "./module/AlgorithmTypeSelect.vue";
import moment from "moment";
import { debounce } from "lodash";
import urlJson from '@/api/collect-api';
import {
  apiOps,
  testDevOps
} from '@/api/options';
const { study } = testDevOps;



export default {
  name: "manageDicom",
  components: {
    pacsAbtn,
    PacsPageHeader,
    AlgorithmTypeSelect,
  },
  computed:{
    tableData:{
      get(){
        return this.tableDataValue;
      },
      set(val){
        // return val
        this.tableDataValue = val;
      },
    }
  },
  data() {



    return {
      tableDataConfig:{
        cellClickEvent:({ row, rowIndex, $rowIndex,column })=>{
          const { property } = column;
          // if(property !== "myFavorite" && property !== "operate"){
          if(property !== "myFavorite"){
            console.log("column=cellClickEvent=",column,"row, rowIndex, $rowIndex",row, rowIndex, $rowIndex);

            const { seriesList,myFavorite,isDisabled } = row;

            let newSeriesList = [];


            newSeriesList = seriesList.map(vo=>({ ...vo, myFavorite, isDisabled }))


            this.tableData_anaRes = newSeriesList;




          }
        },
        formatter:{
          patientAge:({cellValue})=>{

            const newCellVal = serializeAge({
              dataSource:cellValue,
              unit: true,
              language: 'zh'
            })

            return newCellVal;

          }
        },
      },
      rangeDateOb:{
        show:false,
        dateFormat:"YYYY-MM-DD",
        onChange:(date, dateString)=>{
          console.log(date, dateString);
        },
      },
      patientMapOb:{
        onChange:(value)=>{
          console.log(`selected ${value}`);
        },
        options:[
          {
            labName: "检查号",
            value: "accessionNumber",
            key: "011",
          },
          {
            labName: "患者ID",
            value: "patientId",
            key: "012",
          },
          {
            labName: "患者姓名",
            value: "patientName",
            key: "013",
          },
        ],
        optionskV:{
          value: "value",
          label: "labName", // 默认值为'label'
          disabled: "disabled",
          key: "key",
        },
      },
      mathTypeMapOb:{
        onChange:(value)=>{
          console.log(`selected ${value}`);
        },
        options:[
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
        optionskV:{
          value: "value",
          label: "labName", // 默认值为'label'
          disabled: "disabled",
          key: "key",
        }


      },
      computeStateMapOb:{
          onChange:(value)=> {
            console.log(`selected ${value}`);
          },
          optionskV: {
            value: "value",
            label: "labName", // 默认值为'label'
            disabled: "disabled",
            key: "key",
          },
          options: [
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
      },
      tableDataValue: [],
      managerDicomTableConf:{
        onChange:(page, pageSize)=>{
          console.log("onChange--page, pageSize",page, pageSize);
          this.managerDicomTableConf.pageInfo.pageNumber = page;
          this.managerDicomTableConf.pageInfo.pageSize = pageSize;

          this.managerDicomTableConf.queryPagerInfo()
          this.handle_queryDicomList();
        },
        onShowSizeChange:(current, pageSize)=>{
          console.log("this.managerDicomTableConf.pageInfo.pageNumber",this.managerDicomTableConf.pageInfo.pageNumber)
            console.log(current, pageSize);
            this.managerDicomTableConf.pageInfo.pageNumber = this.managerDicomTableConf.pageInfo.pageNumber;
          this.managerDicomTableConf.pageInfo.pageSize = pageSize;
        },
        queryUrl:study + urlJson['pageStudies'],
        pageInfo:{
          pageNumber:1,
          pageSize:10,
          total:0,
          // pages:-1,//页数
          paginationModel:"mostCount",
        },
        myFavorite:false,
        queryPagerInfo:()=>{
          const pager = this.$refs.gridPager.getPagerInfo()
          console.log("pager--",pager);
          return pager;
        },
        fnParams:()=>{
          const baseModel = {
            paginationModel:"mostCount"
          }
          console.log("fnParams----this.form",this.form);
          let ExtParams = {};
          const { patientInfo,patientValue,rangeDate } = this.form;
          // debugger
          const isisPatientOptionValid_state = isPatientOptionValid(patientInfo)
          if(isisPatientOptionValid_state){
            switch (patientInfo){
              case PATIENT_LABOPTIONS.AccessionNumber:{
                ExtParams.accessionNumber = patientValue;
              }
                break;
              case PATIENT_LABOPTIONS.PatientId:{
                ExtParams.patientId = patientValue;
              }
                break;
              case PATIENT_LABOPTIONS.PatientName:{
                ExtParams.patientName = patientValue;
              }
                break;
              default:
                return void 0;
            }
          }
          ExtParams.startData = rangeDate[0];
          ExtParams.endData = rangeDate[1];

          if(this.managerDicomTableConf.myFavorite){
            ExtParams.myFavorite = true;
          }


          const fullExtParam = Object.assign({},baseModel,ExtParams)

          return fullExtParam;
        }
      },
      algorMathSelectConfig:{
        show:true,
        confirmLoading:false,
        onOk:async (e) => {
            console.log("onOk", e);
            const { fileList } = this.uploadObj;
            console.log("压缩前-", fileList);
            this.spinning = true;
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




              const content = zip.generateAsync({ type: 'blob',compression: 'DEFLATE' }).then((blob) => {
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
                  algorithmConfig: `[{}]`,
                  dicom: zipFile,
                })
                  .then((item) => {
                    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
                    console.log("xhr_uploadDicom___item:", item);
                    // this.tableData_upload_anaRe[0] = {
                    //   ...this.tableData_upload_anaRes[0],
                    //   Upload_time:currentTime,
                    //   state:"1",
                    //   mathtype:"1"
                    // }
                    this.$set(this.tableData_upload_anaRes,0,{
                      ...this.tableData_upload_anaRes[0],
                      Upload_time:currentTime,
                      state:"1",
                      mathtype:"1"
                    })
                    this.spinning = false;
                    this.$box.update({ visible: false });
                  });
              });
            }

        },
        onCancel:(e)=>{
          console.log("onCancel",e);
          // this.algorMathSelectConfig.show = false;
          // console.log("this.$box==onCancel",this.$box);



          this.$box.update({visible:false})
        },
      },
      spinning:false,
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

                  const fieldsToMap = ["Accession_Number", "Patient_ID", "Study_Instance_UID","Series_Description"];

                  const mappedValues = this.$ut.mapDicomTagsToValues(sysDicomTagInfo,fieldsToMap)

                  console.log("mappedValues==",mappedValues);
                  this.mappedValues = mappedValues;
                  this.tableData_upload_anaRes.push(this.mappedValues);
                  this.spinning = false;
                  const { show,onOk,onCancel } = this.algorMathSelectConfig
                 this.$box =  this.$confirm({
                    title: "算法类型选择",
                    icon:false,
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
                            <ta-button on-click={(e)=>onCancel(e)}>取消</ta-button>
                            <ta-button on-click={(e)=>onOk(e)} type="primary">上传</ta-button>
                          </div>
                        </div>
                      </div>
                    ),
                    okText:"上传",
                    zoomable:true,
                    confirmLoading:this.algorMathSelectConfig.confirmLoading,
                    width:"calc(1358 / 1920 * 100vw)",
                    keyboard:false,
                    visible:this.algorMathSelectConfig.show,
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
            algorithmConfig: `[{}]`,
            dicom,
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
          this.cache_init_pageData();
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
        qaTime:"",
        rangeDate: ['',''],
        patientInfo:"",
        patientValue:"",
        mathType:"",
        computeState:"",

      },
      qaTimeOb:{
        onChange:(value)=>{
          console.log(`selected ${value}`);
        },
        options:[
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
        optionskV: {
          value: "value",
          label: "labName", // 默认值为'label'
          disabled: "disabled",
          key: "key",
        }
      },

      // tableData: [],

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
    tableData:{
      handler(nVal,oVal){
        console.log("tableData==",nVal,oVal);
        // this.tableData = nVal;
      },
      deep:true,
      immediate:true
    },
    pageSize(val) {
      console.log("pageSize", val);
    },
    current(val) {
      console.log("current", val);
    },
  },
  methods: {
  /**
   * 模版处理：根据计算状态返回切换按钮是否可点击
   * @param computeStatus
   */
    temp_isViewResultBtn(computeStatus){
      // debugger;
      const computeStatusNum = Number(computeStatus);
        if (!isCalculationStatusValid(computeStatusNum)) {
          return false; // 如果状态无效，则不显示按钮
        }
        // 定义哪些状态下按钮不可点击
        const nonClickableStatuses = [
          CalculationStatus.Waiting,
          CalculationStatus.Calculating
        ];
        // 检查计算状态是否在不可点击的状态列表中
        return !nonClickableStatuses.includes(computeStatusNum);
    },

    // 重新分析
    handle_replay_xrd(rowIndex, row){
      console.log("main=handle_replay_xrd",rowIndex, row);

    },
    // 重新分析1
    handle_replay_xrd1(rowIndex, row){
      console.log("sub=handle_replay_xrd",rowIndex, row);
      const { computeSeriesId } = row;
      xhr_reCompute({
        computeSeriesId
      }).then(item=>{
        console.log("重新分析1 sub=item",item);
      })

    },
    handle_favorite_querylist(){
      const {myFavorite} = this.managerDicomTableConf
      if(!myFavorite){
        this.$set(this.managerDicomTableConf,"myFavorite",true)
        this.init_loadData();
        this.$message.success(`切换查看我的收藏列表`)
      }else{
        this.$set(this.managerDicomTableConf,"myFavorite",false)
        this.init_loadData();
        this.$message.success(`返回默认查询列表数据`)
      }
    },
    handle_searchItem_reset(){
      console.log("handle_searchItem_reset");
      this.$refs['searchForm'].resetFields();
      console.log("this.$refs['searchForm']",this.$refs['searchForm']);
    },
    init_searchData(){
      //初始化 form 查询条件数据
      const startDate =  moment().format(this.rangeDateOb.dateFormat);
      const endDate = moment().format(this.rangeDateOb.dateFormat);
      this.form.rangeDate = [startDate,endDate];
      this.rangeDateOb.show = true;
    },
    init_loadData(){

      this.$refs.gridPager.loadData(result=>{
        console.log("loadata-data",result);
        // const pageObj = result?.data?.pageBean;
        // const list = pageObj?.list;
        // const { pageNum:pageNumber,pageSize,currentSize,total,pages } = pageObj;
        // this.managerDicomTableConf.pageInfo = {
        //   ...this.managerDicomTableConf.pageInfo,
        //   total
        // }
        //   if(Array.isArray(list)){
        //     this.tableDataValue = list;
        //   }

      })
    },
    handle_queryDicomList(){
      // 注入条件
      console.log("this.form=",this.form)


      this.cache_init_pageData();
    },
    async cache_init_pageData(){
      this.init_loadData();
      // const pageInfo = {
      //   ...this.managerDicomTableConf.pageInfo
      // }

      // try{
      //   const pageList = await xhr_pageStudies(pageInfo);
      //   const pageObj = pageList?.data?.pageBean;
      //   const list = pageObj?.list;
      //   const { pageNum:pageNumber,pageSize,currentSize,total,pages } = pageObj;

      //   this.managerDicomTableConf.pageInfo = {
      //     ...this.managerDicomTableConf.pageInfo,
      //     total
      //   }

      //   if(Array.isArray(list)){

      //     this.tableDataValue = list;

      //   }



      //   console.log("xhr_pageStudies----pageList",pageList);
      // }catch(e){
      //   //TODO handle the exception
      //   console.error(e);
      // }

    },
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
    handleEdit1(index, row) {
      console.log("handleEdit--manage",index, row);
     /*  this.$router.push({
        path: "diagnose",
        query: {
          applyId: row.applyId,
        },
      }); */
    },
    handleEdit(index, row) {
      console.log("handleEdit--manage",index, row);
     /*  this.$router.push({
        path: "diagnose",
        query: {
          applyId: row.applyId,
        },
      }); */
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


    handle_openfiledraw() {
      this.fileDraw.visible = true;
    },



    handle_star(row, rowIndex) {
      console.log("row---handle_star",row);
      const {studyId} = row;
      if(studyId){

         if (row.myFavorite) {
            xhr_removeFavorite({
              studyId
            }).then(item=>{
              console.log("xhr_addFavorite___",item);
              this.$set(this.tableData[rowIndex], "myFavorite", false);
              this.$message.success("取消收藏成功");
            })

          } else {
            xhr_addFavorite({
              studyId
            }).then(item=>{
              console.log("xhr_addFavorite___",item);
              this.$set(this.tableData[rowIndex], "myFavorite", true);
              this.$message.success("收藏成功");

            })
          }

      }else{
        return
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
        content: "确定要将该组病变检出结果恢复至初始状态吗？",
        maskClosable: true,
        onOk: () => {

          const { studyId } = row;

          xhr_deleteStudy({
            studyId
          }).then(item=>{
            console.log("xhr_deleteStudy___",item);
            this.$delete(this.tableData, rowIndex);
            this.$message.success("删除成功");
          })

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
        content: "确定要将该组病变检出结果恢复至初始状态吗？",
        maskClosable: true,
        onOk: () => {

          const { computeSeriesId } = row;


          xhr_deleteSeries({
            computeSeriesId
          }).then(item=>{
            console.log("xhr_deleteSeries___",item);
            this.$delete(this.tableData_anaRes, rowIndex);
            this.$message.success("删除成功");
            // reload main table
            this.handle_queryDicomList();
          })
        },
      });
    },
    handle_star_subTable(row, rowIndex) {
     return;
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
    this.init_searchData();
    console.log("moment----",moment().format('YYYY-MM-DD'));
    this.$nextTick(() => {
      // this.init_loadData();

      setTimeout(() => {
        console.log("dicomParser===", dicomParser);
        // console.log("cornerstone==", cornerstone);
        cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
        console.log("cornerstoneWADOImageLoader==", cornerstoneWADOImageLoader);



      }, 5000);
    });
  },
  mounted() {
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
    min-height: calc(100% - 400px); /* 适配稍小的屏幕，减少高度 */
  }
}

/* 当屏幕宽度小于1366px时应用的样式 */
@media only screen and (max-width: 1365px) {
  .tableBox {
    min-height: calc(100% - 390px); /* 进一步适配更小的屏幕 */
  }
  .analysis_result_listbox {
    min-height: 250px; /* 减小列表框的最小高度 */
  }
}

/* 特定于笔记本分辨率的样式 */
@media only screen and (min-width: 1367px) and (max-width: 1919px) {
  .tableBox {
    min-height: calc(100% - 395px); /* 适配笔记本屏幕 */
  }
  .analysis_result_listbox {
    min-height: 200px; /* 适配笔记本屏幕的列表框最小高度 */
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
.page_full {
  /deep/ .loadTop_full {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 111111;
    width: 100%;
    height: 100%;
    > span {
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      margin: auto;
    }
  }
}
</style>
