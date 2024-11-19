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
            <ta-form-model :layout="'inline'" ref="searchForm" :model="searchForm">
              <ta-form-model-item label="检查时间" prop="qaTime">
                <ta-select style="width: 120px" v-model="searchForm.qaTime" @change="examinationTime.onChange"
                  :options="examinationTime.options" :options-key="examinationTime.optionskV" />
              </ta-form-model-item>
              <ta-form-model-item v-if="rangeDateOb.show" prop="rangeDate">
                <div class="custom_pickerDeepBlue">
                  <ta-range-picker @change="rangeDateOb.onChange" :format="rangeDateOb.dateFormat"
                    v-model="searchForm.rangeDate" :allow-one="true"
                    :getCalendarContainer="(trigger) => trigger.parentElement" />
                </div>
              </ta-form-model-item>
              <ta-form-model-item label="患者信息" prop="patientValue">
                <ta-input-group compact>

                  <ta-select style="width: 100px" v-model="searchForm.patientInfo" @change="patientMapOb.onChange"
                    :options="patientMapOb.options" :options-key="patientMapOb.optionskV">
                  </ta-select>
                  <ta-input-search allowClear style="width: 120px" @search="patientMapOb.searchInfo" />


                </ta-input-group>
              </ta-form-model-item>
              <ta-form-model-item label="算法类型" prop="mathType">
                <ta-select style="width: 120px" v-model="searchForm.mathType" @change="mathTypeMapOb.onChange"
                  :options="mathTypeMapOb.options" :options-key="mathTypeMapOb.optionskV">
                </ta-select>
              </ta-form-model-item>
              <ta-form-model-item label="计算状态" prop="computeState">
                <ta-select style="width: 120px" v-model="searchForm.computeState" @change="computeStateMapOb.onChange"
                  :options="computeStateMapOb.options" :options-key="computeStateMapOb.optionskV">
                </ta-select>
              </ta-form-model-item>
              <ta-form-model-item>
                <!-- <ta-button type="primary" class="mr-[8px]" @click="handle_queryDicomList">查询</ta-button> -->
                <ta-button @click="handle_searchItem_reset">重置</ta-button>
                <ta-button @click="goto_workplatform">跳转</ta-button>
              </ta-form-model-item>
            </ta-form-model>
          </ta-col>
          <ta-col>
            <div class="btn_ctrl flex justify-start">
              <ta-button @click="handle_favorite_querylist" class="aghost__border-grey-1 flex items-center mr-[12px]"
                :ghost="!managerDicomTableConf.myFavorite"><i
                  class="ico_star mr-[5px]"></i><span>我的收藏</span></ta-button>
              <ta-button class="aghost__border-grey-1 flex items-center" :ghost="true" @click="handle_openfiledraw"><i
                  class="ico_upd mr-[5px]"></i><span>上传文件</span></ta-button>
            </div>
          </ta-col>
        </ta-row>
      </div>
      <div class="tableBox">
        <ta-big-table ref="xTable" height="auto" auto-resize :data="tableData"
          @cell-click="tableDataConfig.cellClickEvent" highlight-hover-row border="inner">
          <ta-big-table-column field="myFavorite" title="#" width="60" fixed="left">
            <template #default="{ row, rowIndex }">
              <div class="hover:cursor-pointer" @click="handle_star(row, rowIndex)">
                <ta-icon v-if="row.myFavorite" :style="starOn_style" type="star" theme="filled" />
                <ta-icon v-else type="star" />
              </div>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="accessionNumber" title="检查号" width="150" fixed="left">
          </ta-big-table-column>
          <ta-big-table-column field="patientId" title="患者ID" width="120" fixed="left">
          </ta-big-table-column>
          <ta-big-table-column field="patientName" title="患者姓名" width="130" fixed="left">
          </ta-big-table-column>
          <ta-big-table-column field="patientAge" title="年龄" :formatter="tableDataConfig.formatter.patientAge"
            width="70">
          </ta-big-table-column>
          <ta-big-table-column field="studyDateAndTime" title="检查时间" width="180">
          </ta-big-table-column>
          <ta-big-table-column field="studyDescription" title="检查描述" min-width="150">
          </ta-big-table-column>
          <ta-big-table-column field="seriesCount" title="序列数" width="130">
          </ta-big-table-column>
          <ta-big-table-column field="computeType" title="算法类型" width="140">
            <template #default="{ row }">
              {{ mathTypeMapOb.options.find(option => option.key == row.computeType)?.label }}
            </template>
          </ta-big-table-column>

          <ta-big-table-column fixed="right" field="operate" title="操作" width="320">
            <template #default="{ row, rowIndex }">
              <ta-row type="flex" justify="space-around">
                <ta-col :span="18">
                  <pacs-abtn :disabled.sync="row.isDisabled" @click="handleEdit(rowIndex, row)">查看结果</pacs-abtn>
                  <ta-divider type="vertical" />
                  <pacs-abtn :disabled.sync="row.isDisabled" :exclude="true"
                    @click="handle_replay_xrd(rowIndex, row)">重新分析</pacs-abtn>
                  <ta-divider type="vertical" />
                  <pacs-abtn :disabled.sync="row.isDisabled" @click="handle_star(row, rowIndex)">
                    <template v-if="row.myFavorite"> 取消收藏 </template>
                    <template v-else> 添加收藏 </template>
                  </pacs-abtn>
                </ta-col>
                <ta-col>
                  <ta-icon type="close-circle" :style="{ color: '#959b9b' }" theme="filled" class="hover:cursor-pointer"
                    @click="handle_delRow(row, rowIndex)" />
                </ta-col>
              </ta-row>
            </template>
          </ta-big-table-column>

          <template slot="bottomBar">
            <ta-pagination style="text-align: right" :dataSource.sync="tableData" :showTotal="false" sizeChangeInput
              :showSizeChanger="false" :url="managerDicomTableConf.queryUrl" :params="managerDicomTableConf.fnParams"
              :pageSize.sync="managerDicomTableConf.pageInfo.pageSize"
              @showSizeChange="managerDicomTableConf.onShowSizeChange" @change="managerDicomTableConf.onChange"
              :defaultCurrent="managerDicomTableConf.pageInfo.pageNumber" :total="managerDicomTableConf.pageInfo.total"
              ref="gridPager" />
          </template>
        </ta-big-table>
      </div>
      <div class="analysis_result_listbox">
        <ta-big-table ref="xTable_anaRes" height="auto" highlight-hover-row auto-resize :data="showTableData_anaRes"
          border="inner">
          <ta-big-table-column field="is-collect" title="#" width="60">
            <template #default="{ row, rowIndex }">
              <div class="hover:cursor-pointer" @click="handle_star_subTable(row, rowIndex)">
                <ta-icon v-if="row.myFavorite" :style="starOn_style" type="star" theme="filled" />
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
          <ta-big-table-column field="computeType" title="算法类型">
            <template #default="{ row }">
              {{ mathTypeMapOb.options.find(option => option.key == row.computeType)?.label }}
            </template>
          </ta-big-table-column>

          <ta-big-table-column field="computeStatus" title="计算状态2">
            <template #default="{ row }">
              <ta-tag v-for="option in computeStateMapOb.options" v-if="option.statu == row.computeStatus"
                :key="option.key" :color="option.color">
                {{ option.label }}
              </ta-tag>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="ctrlState" title="操作状态">
            <template #default="{}">
              正常解析
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="ctrlDoctor" title="操作医师">
            <template #default="{}"> 汪彩霞 </template>
          </ta-big-table-column>
          <ta-big-table-column fixed="right" field="operate" title="操作" width="320">
            <template #default="{ row, rowIndex }">
              <ta-row type="flex" justify="space-around">
                <ta-col :span="18">
                  <pacs-abtn v-if="temp_isViewResultBtn(row.computeStatus)" :disabled.sync="row.isDisabled"
                    @click="handleEdit1(rowIndex, row)">查看结果</pacs-abtn>
                  <pacs-abtn v-else :disabled="true">查看结果</pacs-abtn>
                  <ta-divider type="vertical" />
                  <pacs-abtn v-if="temp_isViewResultBtn(row.computeStatus)" :disabled.sync="row.isDisabled"
                    :exclude="true" @click="handle_replay_xrd1(rowIndex, row)">重新分析</pacs-abtn>
                  <pacs-abtn v-else :disabled="true">重新分析</pacs-abtn>
                  <ta-divider type="vertical" />
                  <pacs-abtn v-if="temp_isViewResultBtn(row.computeStatus)" :disabled.sync="row.isDisabled"
                    @click="handle_star_subTable(row, rowIndex)">
                    <template v-if="row.myFavorite"> 取消收藏 </template>
                    <template v-else> 添加收藏 </template>
                  </pacs-abtn>
                  <pacs-abtn v-else :disabled="true">
                    <template v-if="row.myFavorite"> 取消收藏 </template>
                    <template v-else> 添加收藏 </template>
                  </pacs-abtn>
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
      <div>
        {{ confirmBox.visible }}
        <div class="custom_title pb-[20px]  ">上传数据</div>
        <div class="w-full border border-dashed   h-[200px] py-[10px] flex justify-center items-center flex-wrap">
          <div class="w-full  text-center">
            <input class="hidden " ref="fileInputRef" type="file" @change="handleFileChange" multiple>
            <ta-button @click="triggerFileInput">
              <ta-icon type="upload" />
              选择文件
            </ta-button>
            <div class="mt-[10px]">文件大小最大5G,最多20个序列</div>
          </div>
        </div>
      </div>
      <ta-modal :width="1200" :visible="confirmBox.visible" @ok="confirmBox.handleOk" @cancel="confirmBox.handleCancel">
        <div slot="title" class="text-white"> 算法类型选择</div>
        <AlgorithmTypeSelect :itemData="previewTableSeriesInfo" />
      </ta-modal>

      <div class="custom_panel">
        <div class="custom_title pb-[20px] pt-[20px]">数据列表</div>
        <div class="custom_context highBox">
          <ta-big-table ref="xTable_upload_anaRes" height="auto" highlight-hover-row auto-resize
            :data="confirmBox.confirm ? previewTableSeriesInfo : []" border="inner">

            <ta-big-table-column field="AccessionNumber" title="检查号">
            </ta-big-table-column>
            <ta-big-table-column field="PatientID" title="患者ID">
            </ta-big-table-column>
            <ta-big-table-column field="StudyInstanceUID" title="序列ID">
            </ta-big-table-column>
            <ta-big-table-column field="SeriesDescription" title="序列描述">
            </ta-big-table-column>
            <ta-big-table-column field="UploadTime" title="上传时间">
            </ta-big-table-column>
            <ta-big-table-column field="State" title="状态">
              <template #default="{ row }">
                <div v-if="row.State === 'uploading'">
                  上传中
                </div>
                <div v-if="row.State === 'done'">
                  上传成功
                </div>
              </template>
            </ta-big-table-column>
            <ta-big-table-column field="MathType" title="算法类型">
              <!-- <template #default="{ row }">
                {{ row.MathType }}
                <template v-if="row.mathtype === '1'">自动</template>
              </template> -->
            </ta-big-table-column>
          </ta-big-table>
        </div>
      </div>



    </ta-drawer>

    <ta-spin class="loadTop_full" :spinning="spinning"></ta-spin>
  </div>
</template>
<script lang="jsx">
import Vue from "vue";
import PacsPageHeader from "@/components/pacs-page-header/index.vue";
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters,
  createNamespacedHelpers,
} from "vuex";
import {
  startDiagnose,
  getExaminationList,
  uploadExamination,
  isExit,
  xhr_uploadDicom,
  xhr_uploadSingleDicom,
  xhr_pageStudies,
  xhr_addFavorite,
  xhr_removeFavorite,
  xhr_reComputeStudy,
  xhr_recomputeSeries,
  xhr_deleteSeries,
  xhr_deleteStudy,
} from "@/api";
import { v4 as uuidv4 } from "uuid";

// import cornerstoneWADOImageLoader from "@cornerstonejs/dicom-image-loader";
import JSZip from "jszip";

import { readDicomTags } from "@itk-wasm/dicom";
import dicomParser from "dicom-parser";

import { dicomTagsDescriptions } from "@/assets/js/utils/dicom/codeDesc";


import {
  PATIENT_LABOPTIONS,
  isPatientOptionValid,
} from "@/assets/js/utils/dicom/select";
import {
  CalculationStatus,
  calculationStatusDictionary,
  isCalculationStatusValid,
} from "@/assets/js/utils/dicom/computeState";
import { serializeAge } from "@/assets/js/utils/dicom/inputFormat";

import Upload from "@yh/ta404-ui/es/upload";
import "@yh/ta404-ui/es/upload/style";
Vue.use(Upload);

import pacsAbtn from "@/components/pacs-abtn/index.vue";

import AlgorithmTypeSelect from "./module/AlgorithmTypeSelect.vue";
import moment from "moment";
import { debounce } from "lodash";
import urlJson from "@/api/collect-api";
import { apiOps, testDevOps } from "@/api/options";
const { study, Case } = testDevOps;

import { getStorage, createWebStorage, } from '@yh/ta-utils'


export default {
  name: "manageDicom",
  components: {
    pacsAbtn,
    PacsPageHeader,
    AlgorithmTypeSelect,
  },
  computed: {
    previewTableSeriesInfo: {
      get() {
        return this.previewTable.seriesList.map(series => series[0].metadata);
      },
    },
    tableData: {
      get() {
        return this.tableDataValue;
      },
      set(val) {
        // return val
        this.tableDataValue = val;
      },
    },
    showTableData_anaRes: {
      get() {
        const isShow = this.tableDataValue.some(row => row.studyId === this.selectedstudyId);
        return isShow ? this.tableData_anaRes : [];

      }
    }
  },
  data() {
    return {
      previewTable: {
        size: "small",
        seriesList: [],
        tableColumns: [
          {
            type: {
              type: "checkbox",
            },
            field: "checkBox",
            title: "全选",
            width: "65",
            customRender: {
              default: "checkBox",
            },
          }, {
            field: "imVolume",
            title: "",
            width: "95",
            customRender: {
              default: "imVolume",
            },
          }, {
            field: "lobe",
            title: "",
            width: "135",
            editRender: {},
            customRender: {
              default: "lobe",
              edit: "LOBE_SEGMENT_EDIT",
            },
          }, {
            field: "type",
            title: "",
            editRender: {},
            customRender: {
              default: "type",
              edit: "NODULE_TYPE_EDIT",
            },
          }

        ],

      },
      confirmBox: {
        visible: false,
        confirm: false,
        handleOk: async () => {
          try {
            await this.previewTable.seriesList.forEach(async (series, index) => {
              const files = series.map(item => item.file)
              const zip = new JSZip();
              const zipPromises = Array.from(files).map(file => zip.file(file.name, file));
              await Promise.all(zipPromises);
              const metadata = series[0].metadata
              const seriesType = metadata.Modality

              zip.generateAsync({ type: "blob" }).then(blob => {
                const zipFile = new File([blob], "uploadDicom.zip", {
                  type: blob.type,
                });
                const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");


                console.log(seriesType);

                if (seriesType == 'CT') {
                  this.previewTable.seriesList[index][0].metadata = {
                    ...this.previewTable.seriesList[index][0].metadata,
                    UploadTime: currentTime,
                    State: "uploading",
                    MathType: "胸肺"
                  };
                  xhr_uploadDicom({ caseFile: zipFile }).then(res => {
                    this.$message.success(`上传成功,: ${''}`);
                    this.previewTable.seriesList[index][0].metadata = {
                      ...this.previewTable.seriesList[index][0].metadata,
                      State: "done"
                    };
                  })
                } else if (seriesType == 'CR') {
                  this.previewTable.seriesList[index][0].metadata = {
                    ...this.previewTable.seriesList[index][0].metadata,
                    State: "done"
                  };
                  xhr_uploadSingleDicom({ dicom: zipFile }).then(() => {
                    this.$message.success(`上传成功,: ${''}`);

                  })
                }


              });

            })
            this.confirmBox.confirm = true


          } catch (error) {
            this.$message.error('上传失败');
            console.error("文件解析过程中出现错误:", error);
          }
          this.confirmBox.visible = false

        },
        handleCancel: () => {
          this.confirmBox.visible = false
          this.confirmBox.confirm = false
        },
      },

      mappedValues: {},
      selectedstudyId: "",
      tableDataConfig: {
        cellClickEvent: ({ row, rowIndex, $rowIndex, column }) => {
          const { property } = column;
          if (property !== "myFavorite") {

            const { caseSeriesList, myFavorite, isDisabled } = row;

            let newSeriesList = [];

            newSeriesList = caseSeriesList.map((vo) => ({
              ...vo,
              myFavorite,
              isDisabled,
            }));

            this.selectedstudyId = row.studyId
            this.tableData_anaRes = newSeriesList;
            const row1 = row;
            const { seriesList: _, ...studySelectItem } = row1;
            const localDb = getStorage('#_st', 'studySelectItem', true)

            if (localDb) {
              const storage = createWebStorage('#_st', { isLocal: true, })
              const skItem = storage.get('studySelectItem')
              // storage.remove('studySelectItem');
              storage.set('studySelectItem', studySelectItem)

            } else {
              const storage = createWebStorage('#_st', { isLocal: true, })
              storage.set('studySelectItem', studySelectItem)
            }


          }
        },
        formatter: {
          patientAge: ({ cellValue }) => {
            const newCellVal = serializeAge({
              dataSource: cellValue,
              unit: true,
              language: "zh",
            });

            return newCellVal;
          },
        },
      },
      rangeDateOb: {
        show: false,
        dateFormat: "YYYY-MM-DD",
        onChange: (date, dateString) => {
          console.log(date, dateString);
          this.handle_queryDicomList()
        },
      },
      patientMapOb: {
        onChange: (value) => {
          console.log(`selected ${value}`);
        },
        searchInfo: (value) => {
          this.searchForm.patientValue = value
          this.handle_queryDicomList()

        },
        options: [
          {
            label: "检查号",
            value: "accessionNumber",
            key: "011",
          },
          {
            label: "患者ID",
            value: "patientId",
            key: "012",
          },
          {
            label: "患者姓名",
            value: "patientName",
            key: "013",
          },
        ],
        optionskV: {
          value: "value",
          label: "label", // 默认值为'label'
          disabled: "disabled",
          key: "key",
        },
      },
      mathTypeMapOb: {
        onChange: (value) => {
          this.handle_queryDicomList()

        },
        options: [
          {
            label: "全部",
            value: "",
            key: "",
          },
          {
            label: "冠脉CTA",
            value: "gm-cta",
            key: "011",
          },
          {
            label: "门控钙化积分",
            value: "mk-ghjf",
            key: "012",
          },
          {
            label: "头颈CTA",
            value: "tj-cta",
            key: "013",
          },
          {
            label: "ICH",
            value: "ich",
            key: "014",
          },
          {
            label: "胸肺CT",
            value: "xf-ct",
            key: "1",
          },
        ],
        optionskV: {
          value: "value",
          label: "label", // 默认值为'label'
          disabled: "disabled",
          key: "key",
        },
      },
      computeStateMapOb: {
        onChange: (value) => {
          console.log(`selected ${value}`);
          this.handle_queryDicomList()

        },
        optionskV: {
          value: "value",
          label: "label", // 默认值为'label'
          disabled: "disabled",
          key: "key",
        },
        options: [
          {
            label: "全部",
            value: "",
            key: "all",
            statu: "",
            color: " "  // 默认颜色，白色
          },
          {
            label: "计算成功",
            value: "jscg",
            key: "001",
            statu: "3",
            color: "green"  // 成功状态，绿色
          },
          {
            label: "计算失败",
            value: "jssb",
            key: "002",
            statu: "4",
            color: "red"  // 失败状态，红色
          },
          {
            label: "计算中",
            value: "jsz",
            key: "003",
            statu: "2",
            color: "orange"  // 进行中状态，橙色
          },
          {
            label: "等待计算",
            value: "ddjs",
            key: "004",
            statu: "1",
            color: "orange"  // 等待状态，金色
          },
          {
            label: "计算取消",
            value: "jsqx",
            key: "005",
            statu: "5",
            color: "grey"  // 取消状态，灰色
          },
          {
            label: "计算异常",
            value: "jsyc",
            key: "006",
            statu: "6",
            color: "red"  // 取消状态，灰色
          }

        ],
      },
      tableDataValue: [],
      managerDicomTableConf: {
        onChange: (page, pageSize) => {
          console.log("onChange--page, pageSize", page, pageSize);
          this.managerDicomTableConf.pageInfo.pageNumber = page;
          this.managerDicomTableConf.pageInfo.pageSize = pageSize;

          this.managerDicomTableConf.queryPagerInfo();
          // this.handle_queryDicomList();
        },
        onShowSizeChange: (current, pageSize) => {
          this.managerDicomTableConf.pageInfo.pageNumber =
            this.managerDicomTableConf.pageInfo.pageNumber;
          this.managerDicomTableConf.pageInfo.pageSize = pageSize;
        },
        queryUrl: Case + urlJson["pageStudies"],
        pageInfo: {
          pageNumber: 1,
          pageSize: 10,
          total: 0,
          // pages:-1,//页数
          paginationModel: "mostCount",
        },
        myFavorite: false,
        queryPagerInfo: () => {
          const pager = this.$refs.gridPager.getPagerInfo({ patientId: '16187278' });
          // console.log("pager--", pager);
          return pager;
        },
        fnParams: () => {
          const baseModel = {
            paginationModel: "mostCount",
          };
          // console.log("fnParams----this.form", this.form);
          let ExtParams = {};
          const { patientInfo, patientValue, rangeDate, mathType, computeState } = this.searchForm;
          // debugger
          const isisPatientOptionValid_state =
            isPatientOptionValid(patientInfo);
          if (isisPatientOptionValid_state) {
            switch (patientInfo) {
              case PATIENT_LABOPTIONS.AccessionNumber:
                {
                  ExtParams.accessionNumber = patientValue;
                }
                break;
              case PATIENT_LABOPTIONS.PatientId:
                {
                  ExtParams.patientId = patientValue;
                }
                break;
              case PATIENT_LABOPTIONS.PatientName:
                {
                  ExtParams.patientName = patientValue;
                }
                break;
              default:
                return void 0;
            }
          }

          ExtParams.computeType = this.mathTypeMapOb.options.find(option => option.value == mathType)?.key
          ExtParams.computeStatus = this.computeStateMapOb.options.find(option => option.value == computeState)?.statu

          ExtParams.startDate = ""
          ExtParams.endDate = ""


          if (moment.isMoment(rangeDate[0])) {
            ExtParams.startDate = rangeDate[0].format(this.rangeDateOb.dateFormat)

          }
          if (moment.isMoment(rangeDate[1])) {
            ExtParams.endDate = rangeDate[1].format(this.rangeDateOb.dateFormat)

          }

          if (this.managerDicomTableConf.myFavorite) {
            ExtParams.myFavorite = true;
          }

          const fullExtParam = Object.assign({}, baseModel, ExtParams);

          return fullExtParam;
        },
      },
      algorMathSelectConfig: {
        show: true,
        confirmLoading: false,
        onOk: async (e) => {
          const { fileList } = this.uploadObj;
          // console.log("压缩前-", fileList);
          this.spinning = true;
          if (fileList.length > 0) {
            const zip = new JSZip();

            const filePromises = fileList.map(async (file) => {
              try {
                const arrayBuffer = await file.arrayBuffer();
                const byteArray = new Uint8Array(arrayBuffer);

                const isDicom = dicomParser.parseDicom(byteArray);

                if (isDicom) {
                  zip.file(file.name, file);
                } else {
                  // console.log(`${file.name} is not a DICOM file.`);
                }
              } catch (error) {
                console.error(`Error processing file ${file.name}:`, error);
              }
            });

            const results = await Promise.allSettled(filePromises);

            results.forEach((result, index) => {
              if (result.status === "rejected") {
                console.error(
                  `Error processing file ${fileList[index].name}:`,
                  result.reason,
                );
              }
            });

            const content = zip
              .generateAsync({ type: "blob", compression: "DEFLATE" })
              .then((blob) => {
                // console.log("merge--zip-blob:", blob);

                // 获取当前时间戳并格式化
                const timestamp = new Date()
                  .toISOString()
                  .replace(/[:.]/g, "-");
                const zipFileName = `archive-${timestamp}.zip`;

                const zipFile = new File([blob], zipFileName, {
                  type: blob.type,
                });


                if (this.mappedValues.Modality == "CT") {
                  console.log("xhr_uploadDicom")

                  xhr_uploadDicom({
                    // algorithmConfig: `[{}]`,
                    caseFile: zipFile,
                  }).then((item) => {
                    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

                    this.$set(this.tableData_upload_anaRes, 0, {
                      ...this.tableData_upload_anaRes[0],
                      Upload_time: currentTime,
                      state: "1",
                      mathtype: "1",
                    });
                    this.spinning = false;
                    this.$box.update({ visible: false });
                  });
                }
                if (this.mappedValues.Modality == "CR") {
                  console.log("xhr_uploadSingleDicom")

                  xhr_uploadSingleDicom({
                    dicom: zipFile,
                  }).then((item) => {
                    const currentTime = moment().format("YYYY-MM-DD HH:mm:ss");

                    this.$set(this.tableData_upload_anaRes, 0, {
                      ...this.tableData_upload_anaRes[0],
                      Upload_time: currentTime,
                      state: "1",
                      mathtype: "1",
                    });
                    this.spinning = false;
                    this.$box.update({ visible: false });
                  });
                }
              });
          }
        },
        onCancel: (e) => {
          this.$box.update({ visible: false });
        },
      },
      spinning: false,
      uploadObj: {
        fileList: [],
        size: 0,
        handleChange: async (info) => {

          const status = info.file.status;

          if (status !== "uploading") {
            // console.log(info.file, info.fileList);
          }
          if (status === "done") {

            if (info.fileList.length % 2 === 1) {
              this.$set(this.uploadObj, "size", info.fileList.length - 1);
              // this.uploadObj.size = info.fileList.length - 1;
            } else if (info.fileList.length % 2 === 0) {
              this.$set(this.uploadObj, "size", info.fileList.length);
              // this.uploadObj.size = info.fileList.length;
            }
            // console.log("this.uploadObj==size", this.uploadObj.size);
            if (this.uploadObj.size === info.fileList.length) {
              // console.log("全部载入", this.uploadObj.size);
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

          if (this.uploadObj.fileList.length === 1) {
            // console.log("第一片载入开始", this.uploadObj.fileList);
            // tags信息读取
            const fileOne = this.uploadObj.fileList[0];
            // console.log("fileOne", fileOne);
            const tags = await readDicomTags(fileOne);
            this.tags = await readDicomTags(fileOne);
            console.log("tags____", tags, this.tags);

            // const dateSet = dicomParser.

            try {

              this.$ut
                .convertDicomTags(this.tags, dicomTagsDescriptions)
                .then((sysDicomTagInfo) => {
                  console.log("sysDicomTagInfo=", sysDicomTagInfo);


                  this.$message.success(`序列 解析完成`, 10);

                  const fieldsToMap = [
                    "Accession_Number",
                    "Patient_ID",
                    "Study_Instance_UID",
                    "Series_Description",
                    "Modality"
                  ];

                  const mappedValues = this.$ut.mapDicomTagsToValues(
                    sysDicomTagInfo,
                    fieldsToMap,
                  );
                  console.log("mappedValues", mappedValues)
                  // console.log("mappedValues==", mappedValues);
                  this.mappedValues = mappedValues;
                  this.tableData_upload_anaRes.push(this.mappedValues);
                  this.spinning = false;
                  const { show, onOk, onCancel } = this.algorMathSelectConfig;
                  this.$box = this.$confirm({
                    title: "算法类型选择",
                    icon: false,
                    // 建议使用这种方式传入content值，这里可以写原生HTML标签
                    // 或vue组件也可以以标签的形式在这里引入
                    // 写法与vue文件的template 完全一致，
                    // 需要注意的是，使用此种方式传入值时，必须使用英文的`()`包围
                    // 否则，编译会报错
                    content: <AlgorithmTypeSelect itemData={[mappedValues]} />,
                    footer: (
                      <div class="btn_group flex">
                        <div class="w-full flex justify-end">
                          <div>
                            <ta-button on-click={(e) => onCancel(e)}>
                              取消
                            </ta-button>
                            <ta-button on-click={(e) => onOk(e)} type="primary">
                              上传
                            </ta-button>
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

      },
      tableData_upload_anaRes: [

      ],
      fileDraw: {
        title: "dicom文件上传",
        headerHeight: "65px",
        visible: false,
        onClose: () => {
          // console.log("onClose");
          this.cache_init_pageData();
          this.fileDraw.visible = false;
          this.previewTable.seriesList = []
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
      searchForm: {
        qaTime: "",
        rangeDate: ["", ""],
        patientInfo: "",
        patientValue: "",
        mathType: "",
        computeState: "",
      },
      examinationTime: {
        onChange: (value) => {

          const dateFormat = this.rangeDateOb.dateFormat;
          const today = moment();

          let startDate;
          let endDate;

          switch (value) {
            case "today":
              startDate = today
              endDate = today
              break;
            case "yesterday":
              startDate = today.clone().subtract(1, 'days')
              endDate = startDate;
              break;
            case "threedays":
              startDate = today.clone().subtract(2, 'days')
              endDate = today
              break;
            case "inweek":
              startDate = today.clone().subtract(7, 'days')
              endDate = today
              break;
            default:
              startDate = "";
              endDate = "";
          }

          this.searchForm.rangeDate = [startDate, endDate];

          this.handle_queryDicomList()

        },
        options: [
          {
            label: "今天",
            value: "today",
            key: "011",
          },
          {
            label: "昨天",
            value: "yesterday",
            key: "012",
          },
          {
            label: "三天内",
            value: "threedays",
            key: "013",
          },
          {
            label: "一周内",
            value: "inweek",
            key: "014",
          },
          {
            label: "自定义",
            value: "custom",
            key: "015",
          },
        ],
        optionskV: {
          value: "value",
          label: "label", // 默认值为'label'
          disabled: "disabled",
          key: "key",
        },
      },

      // tableData: [],

      starOn_style: {
        color: `#F5A623`,
        // color: `#FFFFFF`,
      },

      tableData_anaRes: [],
      pageSize: 20,
      current: 4,
      pageSizeInput: 12,
    };
  },
  watch: {
    tableData: {
      handler(nVal, oVal) {
        // console.log("tableData==", nVal, oVal);
        // this.tableData = nVal;
      },
      deep: true,
      immediate: true,
    },
    pageSize(val) {
      // console.log("pageSize", val);
    },
    current(val) {
      // console.log("current", val);
    },

  },
  methods: {
    triggerFileInput() {
      this.$refs.fileInputRef.click();
    },
    async handleFileChange(event) {
      console.log("handleFileChange");

      const files = event.target.files
      if (!files.length) return;

      const dicomFilesData = [];

      this.confirmBox.confirm = false
      this.previewTable.seriesList = []
      try {
        const promises = Array.from(files).map((file) => this.processFile(file));
        const results = await Promise.all(promises);

        console.log(results);

        const seriesList = Object.values(
          results.reduce((acc, item) => {
            const key = item.metadata?.SeriesInstanceUID; // 确保访问安全

            if (!key) {
              return acc; // 忽略没有 SeriesInstanceUID 的项
            }
            if (!acc[key]) {
              acc[key] = []; // 如果该 SeriesInstanceUID 尚不存在，初始化为数组
            }
            acc[key].push(item); // 将 item 加入对应的数组
            return acc;
          }, {})
        );

        console.log(seriesList);

        this.previewTable.seriesList = seriesList
        this.confirmBox.visible = true


      } catch (error) {
        this.$message.error('解析失败');
        console.error("文件解析过程中出现错误:", error);
      }

      event.target.value = '';
    },
    processFile(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            // 获取文件内容
            const arrayBuffer = e.target.result;
            // 使用 dicomParser 解析 DICOM 文件
            const dataSet = dicomParser.parseDicom(new Uint8Array(arrayBuffer));

            const fieldsToMap = [
              "AccessionNumber",
              "PatientID",
              "StudyInstanceUID",
              "SeriesInstanceUID",
              "SeriesDescription",
              "Modality",
            ];

            const metadata = this.$ut.dicomTagsToValues(dataSet, fieldsToMap);
            // zip.file(file.name, file);
            resolve({ metadata, file });
          } catch (error) {
            console.error("解析 DICOM 文件时出错:", error);
            resolve("无法解析此 DICOM 文件");
          }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
      });
    },



    /**
     * 模版处理：根据计算状态返回切换按钮是否可点击
     * @param computeStatus
     */
    temp_isViewResultBtn(computeStatus) {
      // debugger;
      const computeStatusNum = Number(computeStatus);
      if (!isCalculationStatusValid(computeStatusNum)) {
        return false; // 如果状态无效，则不显示按钮
      }
      // 定义哪些状态下按钮不可点击
      const nonClickableStatuses = [
        CalculationStatus.Waiting,
        CalculationStatus.Calculating,
      ];
      // 检查计算状态是否在不可点击的状态列表中
      return !nonClickableStatuses.includes(computeStatusNum);
    },

    // 重新分析
    handle_replay_xrd(rowIndex, row) {
      const { studyId } = row;
      xhr_reComputeStudy({
        studyId,
      }).then((item) => {
        // console.log("重新分析1 sub=item", item);/
      });

    },
    // 重新分析1
    handle_replay_xrd1(rowIndex, row) {

      // console.log("sub=handle_replay_xrd", rowIndex, row);
      const { computeSeriesId } = row;
      xhr_recomputeSeries({
        computeSeriesId,
      }).then((item) => {
        // console.log("重新分析1 sub=item", item);/
      });
    },
    handle_favorite_querylist() {
      const { myFavorite } = this.managerDicomTableConf;
      if (!myFavorite) {
        this.$set(this.managerDicomTableConf, "myFavorite", true);
        this.init_loadData();
        this.$message.success(`切换查看我的收藏列表`);
      } else {
        this.$set(this.managerDicomTableConf, "myFavorite", false);
        this.init_loadData();
        this.$message.success(`返回默认查询列表数据`);
      }
    },
    handle_searchItem_reset() {
      this.tableData_anaRes = []
      this.init_searchData()
      this.handle_queryDicomList()
    },
    init_searchData() {
      this.searchForm.qaTime = "custom"
      this.searchForm.patientInfo = "accessionNumber"
      this.searchForm.patientValue = ""
      this.searchForm.mathType = ""
      this.searchForm.computeState = ""
      this.searchForm.rangeDate = ["", ""]
      this.rangeDateOb.show = true;
    },
    init_loadData() {
      // xhr_pageStudies
      this.$refs.gridPager?.loadData((result) => {


      });
    },
    handle_queryDicomList() {
      this.cache_init_pageData();
    },
    async cache_init_pageData() {
      this.init_loadData();

    },
    handleFile(e) {

    },
    goto_workplatform() {
      this.$router.push({
        path: "picdiagnose",
        query: {
          computeSeriesId: "1836238824598966274",
        },
      });
    },
    handleEdit1(index, row) {
      console.log("handleEdit--manage1", index, row);
      const { computeSeriesId } = row;
      // 同步dicom map info


      this.$router.push({
        path: "diagnose",
        query: {
          computeSeriesId,
        },
      });
    },
    handleEdit(index, row) {
      console.log("handleEdit--manage", index, row);
      const { caseSeriesList } = row;
      const { computeSeriesId } = caseSeriesList[0];
      this.$router.push({
        path: "diagnose",
        query: {
          computeSeriesId,
        },
      });
    },

    handle_openfiledraw() {
      this.fileDraw.visible = true;
    },

    handle_star(row, rowIndex) {
      const { studyId } = row;
      if (studyId) {
        if (row.myFavorite) {
          xhr_removeFavorite({
            studyId,
          }).then((item) => {
            this.$set(this.tableData[rowIndex], "myFavorite", false);
            this.$message.success("取消收藏成功");
          });
        } else {
          xhr_addFavorite({
            studyId,
          }).then((item) => {
            this.$set(this.tableData[rowIndex], "myFavorite", true);
            this.$message.success("收藏成功");
          });
        }
      } else {
        return;
      }

    },
    handle_delRow(row, rowIndex) {
      this.$confirm({
        iconType: "info-circle",
        title: "确定删除该数据吗?",
        content: "确定要将该组病变检出结果恢复至初始状态吗？",
        maskClosable: true,
        onOk: () => {
          const { studyId } = row;

          xhr_deleteStudy({
            studyId,
          }).then((item) => {
            this.$delete(this.tableData, rowIndex);
            this.$message.success("删除成功");
            this.init_loadData()
          });
        },
      });
    },
    handle_delRow_subTable(row, rowIndex) {

      this.$confirm({
        iconType: "info-circle",
        title: "确定删除该数据吗?",
        // 如果需要弹窗显示的仅为一个字符串文本，则可以直接传入字符串
        content: "确定要将该组病变检出结果恢复至初始状态吗？",
        maskClosable: true,
        onOk: () => {
          const { computeSeriesId } = row;

          xhr_deleteSeries({
            computeSeriesId,
          }).then((item) => {
            this.$delete(this.tableData_anaRes, rowIndex);
            this.$message.success("删除成功");
          });
        },
      });
    },
    handle_star_subTable(row, rowIndex) {
      return;
    },
    userPageParams() {
      return {};
    },
  },

  created() {
    this.init_searchData();
    this.$nextTick(() => {
      this.cache_init_pageData();

      // setTimeout(() => {
      //   cornerstoneWADOImageLoader.external.cornerstone = cornerstone;
      //   cornerstoneWADOImageLoader.external.dicomParser = dicomParser;
      // }, 5000);
    });
  },
  mounted() { },
};
</script>
<style lang="less" scoped>
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

.page_full {
  /deep/ .loadTop_full {
    position: fixed;
    top: 0;
    right: 0;
    z-index: 111111;
    width: 100%;
    height: 100%;

    >span {
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
