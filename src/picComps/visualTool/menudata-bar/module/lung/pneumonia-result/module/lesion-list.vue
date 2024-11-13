<template>
  <div class="nodule_lesion-list" tabindex="0">
    <div class="wrappbox flex flex-col justify-between">
      <div class="content_main">

        <div class="table_container">
          <ta-big-table class="lung_table_custom" ref="tableLungPneu" :size="tableConfig.size" row-id="id"
            @header-cell-click="clickHeader"
            :checkbox-config="{ trigger: 'row', reserve: true, checkRowKeys: defaultSelecteRows }"
            :keyboard-config="{ isArrow: true }" height="200" :columns="tableConfig.tableColumns" :data="tableData"
            @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent" @cell-click="handleCellClick"
            :sort-config="tableConfig.sortConfig">

            <template #lobeName="{ row }">
              <span>{{ row.lobeName.label }}</span>
            </template>
            <template #diseaseVolume="{ row }">
              <span>{{ row.fixedDiseaseVolume }}cm³</span>
            </template>

            <template #dieaseRatio="{ row }">
              <div class="h1 cj_block">
                <span>{{ row.fixedRation }}%</span>
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
import reportViewBtn from "./reportView/btn.vue"

import { CodeSandboxOutline } from "@yh/icons-svg";
import Vue from 'vue';
import { SortOption } from "@/assets/js/utils/dicom/select";
import { mapState, mapActions } from "vuex";

import { message } from "@yh/ta404-ui";

import { pneu_dict } from "../assets/dict"
import { pneumoniaFindingTemplate, pneumoniaDiagnoseTemplate } from "@/assets/js/utils/dicom/select";


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
    allHealth: {
      get() {
        return this.lessionList.every(item => item.diseaseClass == null);
      }
    },
    totalDiseaseVolume: {
      get() {
        return this.lessionList.reduce((acc, item) => acc + item.diseaseVolume, 0).toFixed(1)
      }
    },
    totalVolumeRation: {
      get() {
        const totalLobeVolume = this.lessionList.reduce((acc, item) => acc + item.lobeVolume, 0)
        return ((this.totalDiseaseVolume / totalLobeVolume) * 100).toFixed(1)
      }
    },
    tableConfig: {
      get() {
        return {
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
              field: "checkBox", //危险级别
              title: "",
              width: "75",
              customRender: {
                default: "checkBox",
              },
            },
            {
              field: "lobeName",
              title: "全肺",
              width: "100",
              customRender: {
                default: "lobeName",
              },
            },
            {
              field: "diseaseVolume",
              title: (this.allHealth ? '-' : this.totalDiseaseVolume) + "cm³", //断层扫描/层组 ctMeasures.mean HU
              width: "100",
              customRender: {
                default: "diseaseVolume",
              },
            },
            {
              field: "dieaseRatio", //面积
              title: (this.allHealth ? '-' : this.totalVolumeRation) + "%",
              customRender: {
                default: "dieaseRatio",
              },
            },

          ],
        }
      }

    },
    lessionList: {
      get() {
        return this.menuResult.pneumoniaLesionList ?? []
      }
    },
    tableData: {
      get() {
        if (this.menuResult.pneumoniaLesionList) {
          console.log(this.menuResult.pneumoniaLesionList)
          const mappedList = this.lessionList.map((item, index) => {
            const isshow = item.diseaseClass != null
            const newItem = {
              ...item,
              fixedDiseaseVolume: isshow ? item.diseaseVolume.toFixed(1) : '-',
              fixedRation: isshow ? ((item.diseaseVolume / item.lobeVolume) * 100).toFixed(1) : '-',
              fixedIntensity: isshow != 0 ? item.intensity.toFixed(2) : 0,
              isshow,
              index: index + 1, // 添加 index 属性
            };
            Object.keys(item).forEach((key) => {
              if (pneu_dict[key]) {
                const matchingValue = item[key];
                const valueEntry = pneu_dict[key].find((val) => val.value === matchingValue);
                if (valueEntry) {
                  const value = newItem[key];
                  newItem[key] = valueEntry
                }
              }
            });

            return newItem;
          });
          mappedList.
            sort((a, b) => {
              return a.lobeName.order - b.lobeName.order
                ;
            });
          return mappedList; // 返回处理后的列表
        }
        return [];

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
        return this.tableData.filter(item => item.isshow && item.checked);
      }
    },
    findingItems: {
      get() {
        return {
          title: "影像所见",
          list: pneumoniaFindingTemplate(this.checkedTableData, this.selectedFracId)
        }
      }
    },
    diagnoseItems: {
      get() {
        return {
          title: "影像诊断",
          list: pneumoniaDiagnoseTemplate(this.checkedTableData, this.selectedFracId)
        }
      }
    }
  },
  data() {
    return {
      pneu_dict,
      selectedRow: null,


    };
  },
  methods: {
    ...mapActions("pneumoniaInfoStore", ["updatePneumoniaLession"]),
    setPopupContainer(trigger) {
      return trigger.parentElement;
    },

    handleCellClick(e) {
      const { row } = e
      this.selectedRow = row
    },

    selectAllEvent(ev) {
      this.chooseAll()
    },

    clickHeader() {
      this.chooseAll()
    },

    chooseAll() {
      const { isAllSelected, selection } = this.$refs.tableLungPneu
      if (isAllSelected) {
        this.$refs.tableLungPneu.clearCheckboxRow()
      } else {
        this.$refs.tableLungPneu.setAllCheckboxRow(true)
      }
      this.tableData.forEach(item => {
        if (item.checked != !isAllSelected) {
          this.updatePneumoniaLession({ pneuid: item.id, key: "checked", value: !item.checked })

        }
      })
    },
    selectChangeEvent(ev) {
      const { rowid, row, selection } = ev
      this.updatePneumoniaLession({ pneuid: row.id, key: "checked", value: !row.checked })
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
