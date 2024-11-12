<template>
  <div class="nodule_lesion-list" tabindex="0">
    <!-- {{ lesionOrderType }} -->
    <div class="wrappbox flex flex-col justify-between">
      <div class="content_main">
        <div class="table_bar flex justify-between">
          <div class="tit">病变列表</div>
          <div class="btn_grp flex items-center">
            <ta-dropdown :trigger="['click']" class="flex justify-start items-center mr-[10px]">
              <a href="javascript:;">
                {{ lesionOrderType.selected.label }}
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
        <ta-popover ref="mypop" @show="beforeShowFilterForm" :visible-arrow="true" :offset="1" :appendToBody="true"
          :placement="`bottom`" class="cus_poper">
          <div slot="content" class="boxBtn_extSelect">
            <ta-form-model :layout="'vertical'" :model="filterForm">
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
          <anaSemanticDesBlock :des-code="'yxsj'" :bookItems.sync="anaSecDesConf.bookItems"
            :selection="checkedTableData" :blockMode="anaSecDesConf.mode" :selectVal="filmIpt_curItem"
            :title="anaSecDesConf.title" :current="selectedNoduleId">
            <filmInputState slot="searchBar" v-model="filmIpt_curItem" :typec="`dropdown`" :selectCurIdx="`0`"
              :optionNum="`1`">
            </filmInputState>
          </anaSemanticDesBlock>
        </div>

        <div class="analytic_semantic_description">
          <anaSemanticDesBlock :des-code="'yxzd'" :bookItems.sync="anaSecDesConf_1.bookItems"
            :selectVal="filmIpt_curItem_1" :blockMode="anaSecDesConf_1.mode" :title="anaSecDesConf_1.title"
            :selection="checkedTableData" :current="selectedNoduleId">
            <filmInputState slot="searchBar" v-model="filmIpt_curItem_1" :typec="`dropdown`" :selectCurIdx="`0`"
              :optionNum="`2`"></filmInputState>
          </anaSemanticDesBlock>
        </div>

      </div>
      <div class="btn_cxt">
        <div class="report_item_bar flex">
          <reportViewBtn></reportViewBtn>
        </div>
      </div>
    </div>


  </div>
</template>
<script lang="jsx">
import Emitter from "@/assets/js/mixins/emitter.js";
import anaSemanticDesBlock from "../ana-semantic-des-block/index.vue";
import filmInputState from "@/picComps/visualTool/menudata-bar/module/lung/common/ana-semantic-des-block/module/film-input-state/index.vue";
import { CodeSandboxOutline } from "@yh/icons-svg";
import { mapActions } from "vuex";
import Vue from 'vue';
import { SortOption } from "@/assets/js/utils/dicom/select";
import { mapState } from "vuex";

import reportViewBtn from "./reportView/btn.vue"

import { xhr_updateNoduleLesion } from "@/api/index";
import { color } from "echarts";

const operate_dict = {
  lesionOrderType: [
    { value: 1, label: "IM", sortKey: "im", reverse: false, order: 1 },
    { value: 2, label: "肺段", sortKey: "lobeSegment.order", reverse: false, order: 2 },
    { value: 3, label: "长径", sortKey: "ellipsoidAxisMajor", reverse: false, order: 3 },
    { value: 4, label: "体积", sortKey: "volume", reverse: true, order: 4 },
    { value: 5, label: "风险", sortKey: "riskCode.order", reverse: true, order: 5 },
    { value: 6, label: "类型", sortKey: "type.order", reverse: false, order: 6 },
  ],
  riskFilter: [
    { value: 1, label: "低危", order: 1 },
    { value: 2, label: "中危", order: 2 },
    { value: 3, label: "高危", order: 3 },
  ],
  typeFilter: [
    { value: "Mass", label: "肿块", order: 1 },
    { value: "Mixed", label: "混合性", order: 2 },
    { value: "GCN", label: "磨玻璃性", order: 3 },
    { value: "Solid", label: "实性", order: 4 },
    { value: "Calcified", label: "钙化", order: 5 },
  ],
  majorAxisSelectFilter: [
    { value: 1, label: "0-3mm", order: 1 },
    { value: 2, label: "3-5mm", order: 2 },
    { value: 3, label: "5-8mm", order: 3 },
    { value: 4, label: ">8mm", order: 4 },
  ],
  findingOrderType: [
    { value: 1, label: "层数", order: 1 },
    { value: 2, label: "肺段", order: 2 },
    { value: 3, label: "类型", order: 3 },
    { value: 4, label: "结构化描述", order: 4 },
    { value: 5, label: "结节汇总", order: 5 },
  ],
  diagnosisType: [
    { value: 1, label: "无", order: 1 },
    { value: 2, label: "NCCN", order: 2 },
  ]

}

const nodule_dict = {
  riskCode: [
    { value: 1, label: "低危", color: "green", order: 1 },
    { value: 2, label: "中危", color: "yellow", order: 2 },
    { value: 3, label: "高危", color: "red", order: 3 },
  ],
  type: [
    { value: "Mass", label: "肿块", order: 1 },
    { value: "Mixed", label: "混合性结节", order: 2 },
    { value: "GCN", label: "磨玻璃性结节", order: 3 },
    { value: "Solid", label: "实性结节", order: 4 },
    { value: "Calcified", label: "钙化结节", order: 5 },
  ],
  lobe: [
    { value: "lobe_left_top", label: "左肺上叶", order: 1 },
    { value: "lobe_left_bottom", label: "左肺下叶", order: 2 },
    { value: "lobe_right_top", label: "右肺上叶", order: 3 },
    { value: "lobe_right_middle", label: "右肺中叶", order: 4 },
    { value: "lobe_right_bottom", label: "右肺下叶", order: 5 },
  ],
  lobeSegment: [
    { value: 14, label: "尖后段", lobe: "lobe_left_top", order: 1 },
    { value: 13, label: "前段", lobe: "lobe_left_top", order: 2 },
    { value: 11, label: "上舌段", lobe: "lobe_left_top", order: 3 },
    { value: 12, label: "下舌段", lobe: "lobe_left_top", order: 4 },
    { value: 18, label: "背段", lobe: "lobe_left_bottom", order: 5 },
    { value: 15, label: "内前基底段", lobe: "lobe_left_bottom", order: 6 },
    { value: 17, label: "外基底段", lobe: "lobe_left_bottom", order: 7 },
    { value: 16, label: "后基底段", lobe: "lobe_left_bottom", order: 8 },
    { value: 3, label: "尖段", lobe: "lobe_right_top", order: 9 },
    { value: 2, label: "后段", lobe: "lobe_right_top", order: 10 },
    { value: 1, label: "前段", lobe: "lobe_right_top", order: 11 },
    { value: 5, label: "外侧段", lobe: "lobe_right_middle", order: 12 },
    { value: 4, label: "内侧段", lobe: "lobe_right_middle", order: 13 },
    { value: 10, label: "背段", lobe: "lobe_right_bottom", order: 14 },
    { value: 6, label: "内基底段", lobe: "lobe_right_bottom", order: 15 },
    { value: 7, label: "前基底段", lobe: "lobe_right_bottom", order: 16 },
    { value: 9, label: "外基底段", lobe: "lobe_right_bottom", order: 17 },
    { value: 8, label: "后基底段", lobe: "lobe_right_bottom", order: 18 }

  ]
};


// 病变列表
export default {
  name: "lesion-list",
  components: {
    anaSemanticDesBlock,
    filmInputState,
    reportViewBtn,
  },
  mixins: [Emitter],
  props: {
    menuResult: Object,
    operateResult: Object
  },
  computed: {
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
    ribTypeDropDown: {
      get() {
        return {
          showValue: this.selectedRow ? this.selectedRow.ribType.label : "",
          list: nodule_dict.ribType,
        }
      }

    },
    noduleClassDropDown: {
      get() {
        return {
          showValue: this.selectedRow ? this.selectedRow.noduleClass.label : "",
          list: nodule_dict.noduleClass,
        }
      }

    },
    ribNumberDropDown: {
      get() {
        return {
          showValue: this.selectedRow ? this.selectedRow.ribSide.value + this.selectedRow.ribNum : "",
          ribSideList: nodule_dict.ribSide,
        }
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
          const majorAxisSelectList = majorAxisSelectFilter.split(",").map(Number)
          mappedList = mappedList.filter(item => {
            const ellipsoidAxisMajor = item.ellipsoidAxisMajor
            let axisLabel = ''
            if (ellipsoidAxisMajor < 3) {
              axisLabel = 1
            } else if (ellipsoidAxisMajor < 5) {
              axisLabel = 2
            }
            else if (ellipsoidAxisMajor < 8) {
              axisLabel = 3
            } else {
              axisLabel = 4
            }
            return majorAxisSelectList.includes(axisLabel)
          })

        }

        if (lesionOrderType) {
          const valueEntry = operate_dict.lesionOrderType.find(val => val.value == Number(lesionOrderType));
          mappedList.sort((a, b) => {
            const valueA = valueEntry.sortKey.split('.').reduce(function (o, i) {
              return o[i];
            }, a);
            const valueB = valueEntry.sortKey.split('.').reduce(function (o, i) {
              return o[i];
            }, b);

            return valueEntry.reverse ? valueB - valueA : valueA - valueB

          });
        }

        mappedList = mappedList.map((item, index) => {
          return {
            ...item,
            index: index + 1, // 添加 index 属性
          };

        });

        console.log(mappedList);

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
    }
  },


  data() {
    return {
      nodule_dict,
      operate_dict,
      filmIpt_curItem: null,
      filmIpt_curItem_1: null,
      selectedRow: null,
      anaSecDesConf: {
        title: "影像所见",
        mode: "finding",
        bookItems: [],
      },
      anaSecDesConf_1: {
        title: "影像诊断",
        mode: "diagnose",
        bookItems: [],
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
    },
    confirmShowFilterForm() {
      const updateList = [
        { key: "riskFilter", value: this.riskFilter.list ? this.riskFilter.list.join(",") : '' },
        { key: "typeFilter", value: this.typeFilter.list ? this.typeFilter.list.join(",") : '' },
        { key: "majorAxisSelectFilter", value: this.majorAxisSelectFilter.list ? this.majorAxisSelectFilter.list.join(",") : '' },
      ]
      this.updateNoduleOperate({ updateList })
      this.$nextTick(() => {
        const checkedData = this.tableData.filter(item => item.checked);
        this.$refs.tableNoduleRef.setCheckboxRow(checkedData, true)
      })
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
