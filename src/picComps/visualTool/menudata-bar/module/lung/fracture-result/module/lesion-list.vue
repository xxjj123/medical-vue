<template>
  <div class="nodule_lesion-list" tabindex="0">
    <div class="wrappbox flex flex-col justify-between">
      <div class="content_main">

        <div class="table_container">
          <ta-big-table class="lung_table_custom" ref="tableLungFrac" :size="tableConfig.size" row-id="id"
            :checkbox-config="{ trigger: 'click', reserve: true, checkRowKeys: defaultSelecteRows }"
            :row-style="rowStyle" :keyboard-config="{ isArrow: true }" height="200" :columns="tableConfig.tableColumns"
            :data="tableData" @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent"
            :edit-config="{ trigger: 'click' }" @cell-click="handleCellClick" :sort-config="tableConfig.sortConfig">

            <template #checkBox="{ row }">
              <span class="ml-[10px]">{{ row.index }}</span>
            </template>

            <template #ribNumber="{ row }">
              <span class="mr-[5px]"></span><span>{{ row.ribSide.value + row.ribNum }}</span>
            </template>

            <template #ribType="{ row }">
              <div class="h1 cj_block">
                <span>{{ row.ribType.label }}</span>
              </div>
            </template>

            <template #fracClass="{ row }">
              <div class="h1 mean_block">
                <span>{{ row.fracClass.label }}</span>
              </div>
            </template>

            <template #delete="{ row }">
              <div class="h1 cj_block">
                <ta-popconfirm placement="bottom" okText="确定" cancelText="取消" @confirm="deleteRow">
                  <template slot="title">
                    <p>确定删除该条数据吗？</p>
                  </template>
                  <ta-icon type="delete" />
                </ta-popconfirm>
              </div>
            </template>

            <template #RIB_NUMBER_EDIT="{ row, column }">
              <div class="h1 cj_block">
                <ta-dropdown :trigger="['click']" class="flex justify-start items-center mr-[10px]"
                  :getPopupContainer="setPopupContainer">
                  <a href="javascript:;">
                    {{ ribNumberDropDown.showValue }}
                    <ta-icon type="down" />
                  </a>
                  <ta-menu slot="overlay" @click="handleClick_ribNumber">
                    <template v-if="column.property === 'ribNumber'">
                      <template v-for="(item, index) in ribNumberDropDown.ribSideList">
                        <template v-if="
                          item.ribNums &&
                          Array.isArray(item.ribNums) &&
                          item.ribNums.length > 0
                        ">
                          <ta-sub-menu :title="item.value" :key="`${item.value}`">
                            <ta-menu-item v-for="ribNum in item.ribNums" :key="`${item.value}_${ribNum}`">
                              {{ ribNum }}
                            </ta-menu-item>
                          </ta-sub-menu>
                        </template>
                      </template>
                    </template>
                  </ta-menu>
                </ta-dropdown>
              </div>
            </template>

            <template #RIB_TYPE_EDIT="{ row, column }">
              <div class="h1 cj_block">
                <ta-dropdown :trigger="['click']" class="flex justify-start items-center mr-[10px]"
                  :getPopupContainer="setPopupContainer">
                  <a href="javascript:;">
                    {{ ribTypeDropDown.showValue }}
                    <ta-icon type="down" />
                  </a>
                  <ta-menu slot="overlay" @click="handleMenuClick_ribType">
                    <template v-if="column.property === 'ribType'">
                      <template v-for="(item, index) in ribTypeDropDown.list">
                        <template>
                          <ta-menu-item :key="`${item.value}`">
                            {{ item.label }}</ta-menu-item>
                        </template>
                      </template>
                    </template>
                  </ta-menu>
                </ta-dropdown>
              </div>
            </template>

            <template #FRAC_CLASS_EDIT="{ row, column }">
              <div class="h1 mean_block">
                <ta-dropdown :trigger="['click']" class="flex justify-start items-center mr-[10px]"
                  :getPopupContainer="setPopupContainer">
                  <a href="javascript:;">
                    {{ fracClassDropDown.showValue }}
                    <ta-icon type="down" />
                  </a>
                  <ta-menu slot="overlay" @click="handleMenuClick_fracClass">
                    <template v-if="column.property === 'fracClass'">
                      <ta-menu-item v-for="(item, index) in fracClassDropDown.list" :key="`${item.value}`">
                        {{ item.label }}</ta-menu-item>
                    </template>
                  </ta-menu>
                </ta-dropdown>
              </div>

            </template>
          </ta-big-table>
        </div>

        <div class="analytic_semantic_description ">
          <textBoard :bookItems="findingItems.list" :title="findingItems.title">
          </textBoard>
        </div>
        <div class="analytic_semantic_description">
          <textBoard :bookItems="diagnoseItems.list" :title="diagnoseItems.title">
          </textBoard>
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
import textBoard from "@/picComps/visualTool/menudata-bar/module/lung/common/textBoard/index.vue";

import filmInputState from "@/picComps/visualTool/menudata-bar/module/lung/common/ana-semantic-des-block/module/film-input-state/index.vue";
import { CodeSandboxOutline } from "@yh/icons-svg";
import Vue from 'vue';
import { SortOption } from "@/assets/js/utils/dicom/select";
import { mapState, mapActions } from "vuex";

import reportViewBtn from "./reportView/btn.vue"

import { frac_dict } from "../assets/dict"
import { fracFindingTemplate, fracDiagnoseTemplate } from "@/assets/js/utils/dicom/select";


// 病变列表
export default {
  name: "lesion-list",
  components: {
    textBoard,
    filmInputState,
    reportViewBtn,
  },
  mixins: [Emitter],
  props: {
    menuResult: Object,
  },
  computed: {
    ...mapState("fracInfoStore", ["selectedFracId"]),
    ribTypeDropDown: {
      get() {
        return {
          showValue: this.selectedRow ? this.selectedRow.ribType.label : "",
          list: frac_dict.ribType,
        }
      }

    },
    fracClassDropDown: {
      get() {
        return {
          showValue: this.selectedRow ? this.selectedRow.fracClass.label : "",
          list: frac_dict.fracClass,
        }
      }

    },
    ribNumberDropDown: {
      get() {
        return {
          showValue: this.selectedRow ? this.selectedRow.ribSide.value + this.selectedRow.ribNum : "",
          ribSideList: frac_dict.ribSide,
        }
      }
    },
    lessionList: {
      get() {
        return this.menuResult.fracLesionList ?? []
      }
    },
    tableData: {
      get() {
        const mappedList = this.lessionList.map((item, index) => {
          const newItem = {
            ...item,
            index: index + 1, // 添加 index 属性
          };
          Object.keys(item).forEach((key) => {
            if (frac_dict[key]) {
              const matchingValue = item[key];
              const valueEntry = frac_dict[key].find((val) => val.value === matchingValue);
              if (valueEntry) {
                newItem[key] = valueEntry
              }
            }
          });

          return newItem;
        });
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
    findingItems: {
      get() {
        return {
          title: "影像所见",
          list: fracFindingTemplate(this.checkedTableData, this.selectedFracId)
        }

      }
    },
    diagnoseItems: {
      get() {
        return {
          title: "影像诊断",
          list: fracDiagnoseTemplate(this.checkedTableData, this.selectedFracId)
        }

      }

    }
  },
  data() {
    return {
      frac_dict,
      selectedRow: null,

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
            width: "75",
            customRender: {
              default: "checkBox",
            },
          }, {
            field: "ribNumber",
            title: "",
            editRender: {},
            width: "75",
            customRender: {
              default: "ribNumber",
              edit: "RIB_NUMBER_EDIT"
            },
          }, {
            field: "ribType",
            title: "",
            width: "80",
            editRender: {},
            customRender: {
              default: "ribType",
              edit: "RIB_TYPE_EDIT",
            },
          }, {
            field: "fracClass",
            title: "",
            width: "120",
            editRender: {},
            customRender: {
              default: "fracClass",
              edit: "FRAC_CLASS_EDIT",
            },
          }, {
            field: "delete", //危险级别
            title: "",
            customRender: {
              default: "delete",
            },
          },

        ],
      },

    };
  },
  methods: {
    ...mapActions("fracInfoStore", ["ChooseAnnotation", "updateFracLesion"]),
    setPopupContainer(trigger) {
      return trigger.parentElement;
    },
    rowStyle({ row, rowIndex }) {
      if (row.id == this.selectedFracId) {
        return {
          backgroundColor: 'grey',
          color: '#ffffff'
        }
      }
    },
    deleteRow(e) {
      message.info('删除成功.')
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
          this.updateFracLesion({ fracid: item.id, key: "checked", value: !item.checked })

        }
      })

    },
    selectChangeEvent(ev) {
      const { rowid, row, selection } = ev
      this.updateFracLesion({ fracid: row.id, key: "checked", value: !row.checked })

    },

    handleMenuClick_ribType(e) {
      const selectedRow = this.selectedRow
      this.updateFracLesion({ fracid: selectedRow.id, key: "ribType", value: e.key })
    },
    handleMenuClick_fracClass(e) {
      const selectedRow = this.selectedRow
      this.updateFracLesion({ fracid: selectedRow.id, key: "fracClass", value: e.key })
    },
    handleClick_ribNumber(e) {
      const { key } = e;
      const arr = key.split("_");
      const selectedRow = this.selectedRow

      this.updateFracLesion({ fracid: selectedRow.id, key: "ribSide", value: arr[0] })
      this.updateFracLesion({ fracid: selectedRow.id, key: "ribNum", value: Number(arr[1]) })
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
