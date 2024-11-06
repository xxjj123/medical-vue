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
          <anaSemanticDesBlock :des-code="'yxsj'" :bookItems.sync="anaSecDesConf.bookItems"
            :selection.sync="checkedTableData" :blockMode="anaSecDesConf.mode" :selectVal.sync="filmIpt_curItem"
            :title="anaSecDesConf.title" :current.sync="selectedFracId">
          </anaSemanticDesBlock>
        </div>

        <div class="analytic_semantic_description">
          <anaSemanticDesBlock :des-code="'yxzd'" :bookItems.sync="anaSecDesConf_1.bookItems"
            :selectVal="filmIpt_curItem_1" :blockMode="anaSecDesConf_1.mode" :title="anaSecDesConf_1.title"
            :selection.sync="checkedTableData" :current.sync="selectedFracId">
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
import { isNull } from "@yh/ta-utils";
import { message } from "@yh/ta404-ui";


const frac_dict = {
  lobeName: [
    { value: "lobe_left_top", label: "左肺上叶", order: 0 },
    { value: "lobe_left_bottom", label: "左肺下叶", order: 1 },
    { value: "lobe_right_top", label: "右肺上叶", order: 2 },
    { value: "lobe_right_middle", label: "右肺中叶", order: 3 },
    { value: "lobe_right_bottom", label: "右肺下叶", order: 4 },
  ],
  diseaseClass: [
    { value: "", label: "", order: 0 },
    { value: "HD", label: "蜂窝影", order: 1 },
    { value: "GGO", label: "磨玻璃影", order: 2 },

  ]

};

const operateMenu = [
  {
    name: '',
    icon: 'delete',
    type: 'confirm',
    confirmTitle: '确认删除该信息？',
    onOk: (record, index) => {
      console.log("点了山吹")
      message.info('这里调用删除方法')
    },
  }
]
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
    cKey: {
      type: String,
    },
  },
  computed: {
    ...mapState("noduleInfoStore", ["noduleInfo", "selectedNoduleId"]),
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
              if (frac_dict[key]) {
                const matchingValue = item[key];
                const valueEntry = frac_dict[key].find((val) => val.value === matchingValue);
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
    }
  },
  watch: {

  },

  data() {
    return {
      frac_dict,
      selectedRow: null,
      selectedFracId: null,

      selection: [],
      tableCurrentIdx: -1,
      filmIpt_curItem: null,
      filmIpt_curItem_1: null,

      anaSecDesConf: {
        title: "影像所见",
        mode: "finding",
        bookItems: [
        ],
      },
      anaSecDesConf_1: {
        title: "影像诊断",
        mode: "diagnose",

        bookItems: [

        ],
      },

      chekboxFlag: false,
      form: {
        type: [], //类型1，
      },

    };
  },
  methods: {
    ...mapActions("pneumoniaInfoStore", ["updatePneumoniaLession"]),
    setPopupContainer(trigger) {
      return trigger.parentElement;
    },

    clickHeader() {
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
      // this.$refs.tableLungPneu.setAllCheckboxRow(true)

    },
    handleCellClick({
      row,

    }) {
      if (this.chekboxFlag) {
        this.chekboxFlag = false
        return;
      }
      this.selectedRow = row
      this.selectedFracId = row.id;
    },

    selectAllEvent(ev) {
      console.log("点击了单元格")
      this.clickHeader()
      // const { checked, selection } = ev;
      // this.tableData.forEach(item => {
      //   if (item.checked != checked) {
      //     this.updatePneumoniaLession({ pneuid: item.id, key: "checked", value: !item.checked })

      //   }
      // })

      // this.selection = selection;

    },
    selectChangeEvent(ev) {
      const { rowid, row, selection } = ev
      this.updatePneumoniaLession({ pneuid: row.id, key: "checked", value: !row.checked })
      // this.selection = selection;


    },

    onCheckAllChange({ e, index }) {
      console.log("onCheckAllChange", e)
      // let isChecked = e.target.checked;

    },
    onChange({ val, index }) {

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
