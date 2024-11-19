<template>
  <div class="nodule_lesion-list" tabindex="0">
    <!-- {{ lesionOrderType }} -->
    <!-- {{ findingItems }} -->

    <div class="wrappbox flex flex-col justify-between">
      <div class="content_main">
        <div class="table_bar flex justify-between">
          <div class="tit">病变列表</div>
          <div class="btn_grp flex items-center">
            <ta-dropdown :trigger="['click']" class="flex justify-start items-center mr-[10px]">
              <a href="javascript:;">
                {{ lesionOrderType.selected ? lesionOrderType.selected.label : '' }}
                <ta-icon type="down" />
              </a>
              <ta-menu slot="overlay" @click="handleMenu_lesionOrderType">
                <ta-menu-item v-for="(item, index) in lesionOrderType.list" :key="item.value">
                  {{ item.label }}
                </ta-menu-item>
              </ta-menu>
            </ta-dropdown>
            <ta-dropdown :trigger="['click']" class="flex justify-start items-center">
              <a href="javascript:;" v-popover:mypop>
                筛选
                <ta-icon type="down" />
              </a>
            </ta-dropdown>
          </div>
        </div>
        <ta-popover v-model="filterForm.show" ref="mypop" @show="beforeShowFilterForm" :visible-arrow="true" :offset="1"
          :appendToBody="true" :placement="`bottom`" class="cus_poper">
          <div slot="content" class="boxBtn_extSelect">
            <ta-form-model :layout="'vertical'">
              <template>
                <ta-form-model-item :label="riskFilter.label">
                  <ta-checkbox :indeterminate="checkAllRisk.indeterminate" @change="riskFilter.checkAll"
                    :checked="checkAllRisk.checked">
                    全部
                  </ta-checkbox>
                  <ta-checkbox-group :options="riskFilter.options" v-model="riskFilter.list" />
                </ta-form-model-item>
                <ta-form-model-item :label="typeFilter.label">
                  <ta-checkbox :indeterminate="checkAllType.indeterminate" @change="typeFilter.checkAll"
                    :checked="checkAllType.checked">
                    全部
                  </ta-checkbox>
                  <ta-checkbox-group :options="typeFilter.options" v-model="typeFilter.list" />
                </ta-form-model-item>
                <ta-form-model-item :label="majorAxisSelectFilter.label">
                  <ta-checkbox :indeterminate="checkAllAxis.indeterminate" @change="majorAxisSelectFilter.checkAll"
                    :checked="checkAllAxis.checked">
                    全部
                  </ta-checkbox>
                  <ta-checkbox-group :options="majorAxisSelectFilter.options" v-model="majorAxisSelectFilter.list" />
                </ta-form-model-item>
              </template>
            </ta-form-model>
            <ta-divider style="background-color: #979797" />
            <div class="flex justify-end">
              <div class="btn_group">
                <ta-button size="small" @click="resetShowFilterForm">重置</ta-button>
                <ta-button type="primary" size="small" @click="confirmShowFilterForm">确定</ta-button>
              </div>
            </div>
          </div>
        </ta-popover>

        <div class="table_container">
          <ta-big-table class="lung_table_custom" ref="tableNoduleRef" :size="tableConfig.size" row-id="id"
            :checkbox-config="{ trigger: 'click', reserve: true, checkRowKeys: defaultSelecteRows }"
            :row-style="rowStyle" :keyboard-config="{ isArrow: true }" height="240" :columns="tableConfig.tableColumns"
            :data="tableData" @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent"
            :edit-config="{ trigger: 'click' }" @cell-click="handleCellClick">

            <template #checkBox="{ row }">
              <span class="ml-[10px]">{{ row.index }}</span> <br />
              <span :style="{ color: row.riskCode.color }">{{ row.riskCode.label }}</span>
            </template>

            <template #imVolume="{ row }">
              <span>IM {{ row.im }}</span><br>
              <span>{{ row.volume }} mm³</span>
            </template>

            <template #lobe="{ row }">
              <div class="h1 cj_block">
                <span>{{ row.lobe.label }}/{{ row.lobeSegment.label }}</span>
              </div>
              <div>
                <span>{{ row.ellipsoidAxisMajor }}x{{ row.ellipsoidAxisLeast }}mm</span>
              </div>
            </template>

            <template #type="{ row }">
              <div class="h1 mean_block">
                <span>{{ row.type.label }}</span>
              </div>
            </template>

            <template #LOBE_SEGMENT_EDIT="{ row, column }">
              <div class="h1 cj_block">
                <ta-dropdown :trigger="['click']" class="flex justify-start items-center mr-[10px]"
                  :getPopupContainer="setPopupContainer">
                  <a href="javascript:;">
                    <span>{{ row.lobe.label }}/{{ row.lobeSegment.label }}</span>
                    <ta-icon type="down" />
                  </a>
                  <ta-menu slot="overlay" @click="handleClick_lobeSegment">
                    <template v-if="column.property === 'lobe'">
                      <template v-for="(item, index) in lobeList">
                        <!-- {{ item.label }} -->
                        <template v-if="
                          item.segments &&
                          Array.isArray(item.segments) &&
                          item.segments.length > 0
                        ">
                          <ta-sub-menu :title="item.label" :key="item.value">
                            <ta-menu-item v-for="segment in item.segments" :key="`${item.value}/${segment.value}`">
                              {{ segment.label }}
                            </ta-menu-item>
                          </ta-sub-menu>
                        </template>
                      </template>
                    </template>
                  </ta-menu>
                  <div>

                  </div>
                </ta-dropdown>
              </div>
              <span>{{ row.ellipsoidAxisMajor }}x{{ row.ellipsoidAxisLeast }}mm</span>
            </template>
            <template #NODULE_TYPE_EDIT="{ row, column }">
              <div class="h1 cj_block">
                <ta-dropdown :trigger="['click']" class="flex justify-start items-center mr-[10px]"
                  :getPopupContainer="setPopupContainer">
                  <a href="javascript:;">
                    {{ row.type.label }} <ta-icon type="down" />
                  </a>
                  <ta-menu slot="overlay" @click="handleClick_noduleType">
                    <template v-if="column.property === 'type'">
                      <template v-for="(item, index) in nodule_dict.type">
                        <template>
                          <ta-menu-item :key="item.value">
                            {{ item.label }}</ta-menu-item>
                        </template>
                      </template>
                    </template>
                  </ta-menu>
                </ta-dropdown>
              </div>

            </template>

          </ta-big-table>
        </div>

        <div class="analytic_semantic_description ">
          <textBoard :bookItems="findingItems.list" :title="findingItems.title">
            <searchBar slot="searchBar" :options="findingOrderType.list" :selected="findingOrderType.selected"
              @selectItem="handleMenu_findingOrderType" />
          </textBoard>
        </div>
        <div class="analytic_semantic_description">
          <textBoard :bookItems="diagnosisItems.list" :title="diagnosisItems.title">
            <searchBar slot="searchBar" :options="diagnosisType.list" :selected="diagnosisType.selected"
              @selectItem="handleMenu_diagnosisType" />
          </textBoard>
        </div>

      </div>
      <div class="btn_cxt">
        <div class="report_item_bar flex">
          <reportView :reportData="textReport.data" @saveResult="saveManualDiagnosis"
            @resetReport="textReport.resetReport" @updateReport="" />
          <!-- <reportViewBtn :reportData="textReport.data" @saveResult="saveManualDiagnosis"> -->
          <!-- </reportViewBtn> -->
        </div>
      </div>
    </div>


  </div>
</template>
<script lang="jsx">
import Emitter from "@/assets/js/mixins/emitter.js";
import textBoard from "@/picComps/visualTool/menudata-bar/module/lung/common/textBoard/index.vue";
import searchBar from "@/picComps/visualTool/menudata-bar/module/lung/common/textBoard/searchBar.vue";
// import reportViewBtn from "@/picComps/visualTool/menudata-bar/module/lung/common/reportView/btn.vue"
import reportView from "@/picComps/visualTool/menudata-bar/module/lung/common/reportView/index.vue"


import filmInputState from "@/picComps/visualTool/menudata-bar/module/lung/common/ana-semantic-des-block/module/film-input-state/index.vue";
import { CodeSandboxOutline } from "@yh/icons-svg";
import Vue from 'vue';
import { mapState, mapActions } from "vuex";

// import reportViewBtn from "./reportView/btn.vue"

import { operate_dict, nodule_dict } from "../assets/dict"
import { TextReport } from "../assets/reports"
import { noduleFindingTemplate, noduleDiagnoseTemplate } from "@/assets/js/utils/dicom/select";

import {
  xhr_saveNoduleManualDiagnosis, xhr_queryNoduleTextReport, xhr_updateTextReport
} from "@/api";

// 病变列表
export default {
  name: "lesion-list",
  components: {
    filmInputState,
    // reportViewBtn,
    reportView,
    textBoard,
    searchBar
  },
  mixins: [Emitter],
  props: {
    menuResult: Object,
    operateResult: Object
  },
  computed: {
    ...mapState("mprViewStore", ["seriesInfo"]),
    ...mapState("noduleInfoStore", ["selectedNoduleId"]),
    lobeList: {
      get() {
        return nodule_dict.lobe.map(item => {
          // Find the corresponding lobeSegment and sort them by value
          let segments = nodule_dict.lobeSegment.filter(segment => segment.lobe == item.value);
          segments.sort((a, b) => a.value - b.value);
          return { ...item, segments };
        })
      }
    },
    lessionList: {
      get() {
        return this.menuResult.noduleLesionList ?? []
      }
    },
    tableData: {
      get() {
        let mappedList = this.lessionList.map((item, index) => {
          const newItem = {
            ...item,
          };
          Object.keys(item).forEach((key) => {
            if (nodule_dict[key]) {
              const matchingValue = item[key];
              const valueEntry = nodule_dict[key].find((val) => val.value === matchingValue);
              if (valueEntry) {
                newItem[key] = valueEntry
              }
            }
          });
          return newItem;
        });

        const { lesionOrderType, riskFilter, typeFilter, majorAxisSelectFilter } = this.operateResult

        if (riskFilter) {
          const riskList = riskFilter.split(",").map(Number)
          mappedList = mappedList.filter(item => riskList.includes(item.riskCode.value))
        }
        if (typeFilter) {
          const typeList = typeFilter.split(",")
          mappedList = mappedList.filter(item => typeList.includes(item.type.value))
        }

        if (majorAxisSelectFilter) {
          const majorAxisSelectList = majorAxisSelectFilter.split(",").map(Number);
          const getAxisLabel = (ellipsoidAxisMajor) => {
            if (ellipsoidAxisMajor < 3) return 1;
            if (ellipsoidAxisMajor < 5) return 2;
            if (ellipsoidAxisMajor < 8) return 3;
            return 4;
          };
          mappedList = mappedList.filter(item =>
            majorAxisSelectList.includes(getAxisLabel(item.ellipsoidAxisMajor))
          );

        }

        if (lesionOrderType) {
          const valueEntry = operate_dict.lesionOrderType.find(val => val.value === Number(lesionOrderType));
          const sortKeyPath = valueEntry.sortKey.split('.');
          const isReverse = valueEntry.reverse;

          mappedList.sort((a, b) => {
            const getValue = (item) => sortKeyPath.reduce((o, i) => o[i], item);
            const valueA = getValue(a);
            const valueB = getValue(b);

            return isReverse ? valueB - valueA : valueA - valueB;
          });
        }

        mappedList = mappedList.map((item, index) => {
          return {
            ...item,
            index: index + 1, // 添加 index 属性
          };

        });

        console.log("mappedList", mappedList);

        return mappedList; // 返回处理后的列表


      }
    },
    defaultSelecteRows: {
      get() {
        const ids = []
        if (this.tableData) {
          this.tableData.forEach(item => {
            if (item.checked) {
              ids.push(item.id)
            }
          })
        }
        return ids;
      }

    },
    checkedTableData: {
      get() {
        return this.tableData.filter(item => item.checked);
      }
    },

    lesionOrderType: {
      get() {
        const { lesionOrderType } = this.operate_dict
        return {
          selected: lesionOrderType.find(item => item.value == Number(this.operateResult.lesionOrderType)),
          list: this.operate_dict.lesionOrderType
        }
      }
    },
    checkAllRisk: {
      get() {
        const { list, options } = this.riskFilter
        return {
          checked: list.length == options.length,
          indeterminate: list.length != options.length && list.length != 0
        }
      }
    },
    checkAllType: {
      get() {
        const { list, options } = this.typeFilter
        return {
          checked: list.length == options.length,
          indeterminate: list.length != options.length && list.length != 0
        }
      }
    },
    checkAllAxis: {
      get() {
        const { list, options } = this.majorAxisSelectFilter
        return {
          checked: list.length == options.length,
          indeterminate: list.length != options.length && list.length != 0
        }
      }
    },
    findingOrderType: {
      get() {
        const { findingOrderType } = this.operate_dict
        return {
          selected: findingOrderType.find(item => item.value == Number(this.operateResult.findingOrderType)),
          list: findingOrderType
        }
      }
    },
    diagnosisType: {
      get() {
        const { diagnosisType } = this.operate_dict
        return {
          selected: diagnosisType.find(item => item.value == Number(this.operateResult.diagnosisType)),
          list: diagnosisType
        }
      }
    },
    findingItems: {
      get() {
        const { imageCount } = this.seriesInfo
        return {
          title: "影像所见",
          list: noduleFindingTemplate(this.checkedTableData, Number(this.operateResult.findingOrderType), imageCount, this.selectedNoduleId)
        }
      }

    },
    diagnosisItems: {
      get() {
        return {
          title: "影像诊断",
          list: noduleDiagnoseTemplate(this.checkedTableData, Number(this.operateResult.diagnosisType))
        }

      }

    }
  },
  watch: {
    tableData: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          const checkedData = newVal.filter(item => item.checked);
          this.$refs.tableNoduleRef.setCheckboxRow(checkedData, true)
        })
      },
      deep: true
    }

  },


  data() {
    return {
      nodule_dict,
      operate_dict,
      selectedRow: null,
      textReport: {
        title: "文本报告",
        class: "textReport",
        data: null,
        QueryReport: () => {

        },
        updateReport: () => {


        },
        resetReport: async () => {
          const { computeSeriesId } = this.seriesInfo

          const result = await xhr_queryNoduleTextReport({ computeSeriesId, reset: true })
          const textReport = Object.assign(new TextReport(), result.data.resultData)
          this.textReport.data = textReport
        },
      },


      tableConfig: {
        size: "small",
        showHiddenOrSortColumn: {
        },
        sortConfig: {
          trigger: 'default',
          defaultSort: { field: 'riskCode', order: 'asc' },
          orders: ['desc', 'asc', null]
        },

        tableOriginalData: [],
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
      filterForm: {
        show: false
      },
      riskFilter: {
        label: "良恶性",
        list: [],
        options: operate_dict.riskFilter,
        checkAll: () => {
          const { list, options } = this.riskFilter
          if (list.length != options.length) {
            this.riskFilter.list = options.map(item => item.value)
          } else {
            this.riskFilter.list = []
          }
        }
      },
      typeFilter: {
        label: "类型",
        list: [],
        options: operate_dict.typeFilter,
        checkAll: () => {
          const { list, options } = this.typeFilter
          if (list.length != options.length) {
            this.typeFilter.list = options.map(item => item.value)
          } else {
            this.typeFilter.list = []
          }
        }
      },
      majorAxisSelectFilter: {
        label: "长径",
        list: [],
        options: operate_dict.majorAxisSelectFilter,
        checkAll: () => {
          const { list, options } = this.majorAxisSelectFilter
          if (list.length != options.length) {
            this.majorAxisSelectFilter.list = options.map(item => item.value)
          } else {
            this.majorAxisSelectFilter.list = []
          }
        }
      }

    };
  },
  methods: {
    ...mapActions("noduleInfoStore", ["ChooseAnnotation", "updateNoduleLesion", "updateNoduleOperate"]),

    async updateTextReport(updateData) {
      await xhr_updateTextReport(updateData)
    },
    setPopupContainer(trigger) {
      return trigger.parentElement;
    },
    rowStyle({ row, rowIndex }) {
      if (row.id == this.selectedNoduleId) {
        return {
          backgroundColor: 'grey',
          color: '#ffffff'
        }
      }
    },
    beforeShowFilterForm() {
      const { riskFilter, typeFilter, majorAxisSelectFilter } = this.operateResult
      console.log("this.operateResult", this.operateResult)
      this.riskFilter.list = riskFilter ? riskFilter.split(",").map(Number) : []
      this.typeFilter.list = typeFilter ? typeFilter.split(",") : []
      this.majorAxisSelectFilter.list = majorAxisSelectFilter ? majorAxisSelectFilter.split(",").map(Number) : []

    },
    resetShowFilterForm() {
      this.riskFilter.list = []
      this.typeFilter.list = []
      this.majorAxisSelectFilter.list = [2, 3, 4]
      this.confirmShowFilterForm()
      this.filterForm.show = false

    },
    confirmShowFilterForm() {
      const updateList = [
        { key: "riskFilter", value: this.riskFilter.list ? this.riskFilter.list.join(",") : '' },
        { key: "typeFilter", value: this.typeFilter.list ? this.typeFilter.list.join(",") : '' },
        { key: "majorAxisSelectFilter", value: this.majorAxisSelectFilter.list ? this.majorAxisSelectFilter.list.join(",") : '' },
      ]
      this.updateNoduleOperate({ updateList })
      this.filterForm.show = false

    },
    handleCellClick(e) {
      const { row, columnIndex, triggerCheckbox } = e
      if (!triggerCheckbox) {
        this.selectedRow = row
        this.ChooseAnnotation({ bboxindex: row.id });

      }
    },
    handleMenu_lesionOrderType(e) {
      const { key } = e
      const updateList = [
        { key: "lesionOrderType", value: key },
      ]
      this.updateNoduleOperate({ updateList })
    },
    handleMenu_findingOrderType(value) {
      console.log("handleMenu_findingOrderType")
      const updateList = [
        { key: "findingOrderType", value },
      ]
      this.updateNoduleOperate({ updateList })
    },
    handleMenu_diagnosisType(value) {
      console.log("handleMenu_diagnosisType")

      const updateList = [
        { key: "diagnosisType", value },
      ]
      this.updateNoduleOperate({ updateList })
    },
    selectAllEvent(ev) {
      const { checked, selection } = ev;
      this.tableData.forEach(item => {
        if (item.checked != checked) {
          const updateList = [{ key: "checked", value: !item.checked }]
          this.updateNoduleLesion({ noduleid: item.id, updateList })

        }
      })

    },
    selectChangeEvent(ev) {
      const { rowid, row, selection } = ev
      const updateList = [{ key: "checked", value: !row.checked }]

      this.updateNoduleLesion({ noduleid: row.id, updateList })
    },

    handleClick_noduleType(e) {
      const { key } = e
      const selectedRow = this.selectedRow
      const updateList = [{ key: "type", value: key }]
      this.updateNoduleLesion({ noduleid: selectedRow.id, updateList })
    },

    handleClick_lobeSegment(e) {
      const { key } = e;
      const [lobe, segment] = key.split("/");
      const selectedRow = this.selectedRow
      const updateList = [
        { key: "lobe", value: lobe },
        { key: "lobeSegment", value: Number(segment) },
      ]

      this.updateNoduleLesion({ noduleid: selectedRow.id, updateList })
    },
    async saveManualDiagnosis() {
      const { computeSeriesId } = this.seriesInfo
      const manualDiagnosis = {
        computeSeriesId,
        diagnosis: this.diagnosisItems.list.map(item => item.desc).join("\n"),
        finding: this.findingItems.list.map(item => item.desc).join("\n")
      }
      xhr_saveNoduleManualDiagnosis(manualDiagnosis).then(async res => {
        const result = await xhr_queryNoduleTextReport({ computeSeriesId })
        const textReport = Object.assign(new TextReport(), result.data.resultData)
        this.textReport.data = textReport
      })

    }



  },
  created() {
    // this.init_lesionPanelSearchBar();

  },
};
</script>
<style lang="less" scoped>
body {

  // .cus_poper {
  .el-popover {
    &.el-popper {
      background-color: @input-bg;
    }
  }

  // }
}

.table_bar {
  margin: 0 0 10px 0;

  .tit {
    font-size: 16px;
  }
}

/deep/ .ant-checkbox-wrapper {
  &.check_block_area {
    >.ant-checkbox {
      &+span {
        display: inline-block;
      }
    }
  }
}

.table_container {

  &:before {
    content: "";
    display: block;
    height: 0;
    width: 20px;
    /* 预留滚动条宽度 */
  }
}

.nodule_lesion-list {
  height: calc(100vh - 239px);
  transition: overflow 0.8s;
  /* 可选，为了动画效果 */
  margin-right: -20px;
  /* 预留滚动条宽度 */
  padding-right: 20px;
  /* 预留滚动条宽度 */
  box-sizing: border-box;
  overflow-anchor: none;
  /* 或其他值，如 'auto' */
  resize: both;
  /* 或 'horizontal', 'vertical' */
  // overflow: auto;

  &:before {
    content: "";
    display: block;
    height: 0;
    width: 20px;
    /* 预留滚动条宽度 */
  }
}


.lung_table_custom {

  /deep/table {
    // display: none;
    thead {
      th {
        &[data-colid='col_17'] {
          // background: red;

          .vxe-cell--sort {
            visibility: hidden;
          }
        }
      }
    }

  }
}

.wrappbox {
  height: calc(100vh - 253px);

  .content_main {
    height: calc(100vh - 155px);
    width: 100%;
    flex: 1 1 0%;
    overflow-y: scroll;
    /* 允许垂直滚动 */
    padding-right: 16px;
    /* 留出空间给滚动条，确保内容不被覆盖 */
    box-sizing: content-box;
    /* 使内边距不包含在滚动区域内 */
    margin-right: -16px;
    /* 使用负边距拉出滚动条 */
  }

  .btn_cxt {
    width: 100%;
    height: 60px;
    padding: 23px 0px 0px 0px;
    border-top: 1px solid rgba(255, 255, 255, 0.12);
    display: flex;
    -webkit-box-pack: justify;
    justify-content: space-between;

    // height: auto;
    .report_item_bar {
      width: 100%;
    }
  }
}
</style>
