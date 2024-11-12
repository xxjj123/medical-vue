<template>
  <div class="nodule_lesion-list" tabindex="0">
    <div class="wrappbox flex flex-col justify-between">
      <div class="content_main">

        <div class="table_container">
          <ta-big-table class="lung_table_custom" ref="tableLungNodule" :size="tableConfig.size" row-id="id"
            :checkbox-config="{ trigger: 'click', reserve: true, checkRowKeys: defaultSelecteRows }"
            :row-style="rowStyle" :keyboard-config="{ isArrow: true }" height="200" :columns="tableConfig.tableColumns"
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
                </ta-dropdown>
              </div>
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
            :selection.sync="checkedTableData" :blockMode="anaSecDesConf.mode" :selectVal="null"
            :title="anaSecDesConf.title" :current.sync="selectedNoduleId">
          </anaSemanticDesBlock>
        </div>

        <div class="analytic_semantic_description">
          <anaSemanticDesBlock :des-code="'yxzd'" :bookItems.sync="anaSecDesConf_1.bookItems" :selectVal="null"
            :blockMode="anaSecDesConf_1.mode" :title="anaSecDesConf_1.title" :selection.sync="checkedTableData"
            :current.sync="selectedNoduleId">
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
    { value: 1, label: "IM", key: "", reversed: false, order: 1 },
    { value: 2, label: "肺段", key: "", reversed: false, order: 2 },
    { value: 3, label: "长径", key: "", reversed: false, order: 3 },
    { value: 4, label: "体积", key: "", reversed: false, order: 4 },
    { value: 5, label: "风险", key: "", reversed: false, order: 5 },
    { value: 6, label: "类型", key: "", reversed: false, order: 6 },
  ],
  riskFilter: [
    { value: 1, label: "低危", order: 1 },
    { value: 2, label: "中危", order: 2 },
    { value: 3, label: "高危", order: 3 },
  ],
  typeFilter: [
    { value: "Mass", label: "肿块", order: 1 },
    { value: "Mixed", label: "混合性结节", order: 2 },
    { value: "GCN", label: "磨玻璃性结节", order: 3 },
    { value: "Solid", label: "实性结节", order: 4 },
    { value: "Calcified", label: "钙化结节", order: 5 },
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
    }
  },
  watch: {

  },

  data() {
    return {
      nodule_dict,
      operate_dict,
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

    };
  },
  methods: {
    ...mapActions("noduleInfoStore", ["ChooseAnnotation", "updateNoduleLesion"]),
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
    handleCellClick(e) {
      const { row, columnIndex, triggerCheckbox } = e
      if (!triggerCheckbox) {
        this.selectedRow = row
        this.ChooseAnnotation({ bboxindex: row.id });

      }
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
      this.updateNoduleLesion({ noduleid: row.id, key: "checked", value: !row.checked })
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
  margin: 10px 0 14px 0;

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
