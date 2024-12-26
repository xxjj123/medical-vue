<template>
  <div class="vsk_menudata-bar h-full w-full flex flex-col">
    <!-- 面板顶部操作小按钮 start-->
    <div class="menuTopBox flex justify-between p-5">
      <div class="sub_title">--</div>
      <div class="sub_tool flex items-center">
        <div v-if="caseInfo.myFavorite" @click="handle_star"
          class="flex hover:cursor-pointer justify-start items-center">
          <div class="icon ico_shouchang flex items-center">
            <ta-icon :style="starOn_style" type="star" theme="filled" />
          </div>
          <div class="txt ml-2">取消收藏</div>
        </div>
        <div v-else @click="handle_star" class="flex hover:cursor-pointer justify-start items-center">
          <div class="icon ico_shouchang flex items-center">
            <ta-icon type="star" />
          </div>
          <div class="txt ml-2">收藏数据</div>
        </div>


      </div>
    </div>

    <div class="wrappbox flex flex-col justify-between">
      <!-- <div>
        <div v-for="item in tableData">{{ item.id }}{{ item.cobb }}</div>
      </div> -->

      <div class="content_main">
        <div class="table_container">
          <div>
            <div class="h-[25px] lh-[25px]">类型：{{ spineInfo.sShapeLabel }} </div>
          </div>
          <div>
            <div class="h-[25px] lh-[25px] mb-3">锁骨倾斜角：{{ spineInfo.clavicleHorangle }} °</div>
          </div>
          <ta-big-table class="lung_table_custom" ref="tableSpineCobb" :size="tableConfig.size" row-id="id"
            :checkbox-config="{ trigger: 'row', reserve: true, checkRowKeys: defaultSelecteRows }"
            :columns="tableConfig.tableColumns" :data="tableData" @header-cell-click="clickHeader"
            @checkbox-change="selectChangeEvent" @checkbox-all="selectAllEvent">

            <template #cobb="{ row }">
              <div class="h1 cj_block">
                <span>{{ row.cobb }} °</span>
              </div>
            </template>
            <template #vertebralOffset="{ row }">
              <div class="h1 cj_block">
                <span>{{ row.vertebralOffset }} mm</span>
              </div>
            </template>
            <template #boneList="{ row }">
              <div class="h1 cj_block">
                <span>{{ row.boneList[0].boneCode }} - {{ row.boneList[2].boneCode }}</span>
              </div>
            </template>

          </ta-big-table>


        </div>

        <div class="analytic_semantic_description mb-10">
          <textBoard :bookItems="findingItems.list" :title="findingItems.title">
          </textBoard>
        </div>

        <div class="analytic_semantic_description">
          <textBoard :bookItems="diagnosisItems.list" :title="diagnosisItems.title">
          </textBoard>
        </div>

      </div>
      <div class="btn_cxt">
        <div class="report_item_bar flex">
          <!-- <reportView :reportData="reportData" :reportEditable="false" @saveResult="saveManualDiagnosis"
            @resetReport="resetReport" /> -->

          <reportView :reportData="textReport.data" :reportEditable="true" @saveResult="saveManualDiagnosis"
            @resetReport="resetReport" />

        </div>
      </div>
    </div>



  </div>
</template>

<script lang="javascript">
import textBoard from "@/picComps/visualTool/menudata-bar/module/lung/common/textBoard/index.vue";
import reportView from "@/picComps/visualTool/menudata-bar/module/lung/common/reportView/index.vue"
import { spine_dict } from "./assets/dict"
import { spineFindingTemplate, spineDiagnoseTemplate } from "@/assets/js/utils/dicom/select";
import { mapState, mapActions } from "vuex"
import { TextReport } from "./assets/reports"


import {
  xhr_saveSpineManualDiagnosis,
  xhr_querySpineTextReport,
  xhr_addFavorite,
  xhr_removeFavorite
} from "@/api";


export default {
  name: "menudata-bar",
  components: { textBoard, reportView },
  props: {
    boneInfo: Object,
  },
  computed: {
    ...mapState("spineViewStore", ["spineInfo", "caseInfo", "selectedCobbId"]),
    tableData: {
      get() {
        if (this.spineInfo.angleList) {
          let mapperList = this.spineInfo.angleList.map(item => {

            return {
              ...item
            }
          })
          mapperList = mapperList.sort((a, b) => a.firstBone - b.firstBone);

          return mapperList
        }
        return []


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
    findingItems: {
      get() {
        return {
          title: "影像所见",
          list: spineFindingTemplate(this.tableData)
        }

      }
    },
    diagnosisItems: {
      get() {
        return {
          title: "影像诊断",
          list: spineDiagnoseTemplate(this.tableData)
        }

      }

    }
  },
  data() {
    return {
      tableConfig: {
        size: "small",
        tableColumns: [
          {
            type: {
              type: "checkbox",
            },
            field: "checkBox", //危险级别
            title: "",
            width: "60",
            customRender: {
              default: "checkBox",
            },
          },
          {
            field: "cobb", //危险级别
            title: "cobb角",
            // sortable: true,
            width: "90",
            customRender: {
              default: "cobb",
            },
          },
          {
            field: "boneList", //危险级别
            title: "区间",
            width: "100",
            customRender: {
              default: "boneList",
            },
          },
          {
            field: "vertebralOffset", //危险级别
            title: "顶椎离中线距离",
            customRender: {
              default: "vertebralOffset",
            },
          },



        ],
      },

      textReport: {
        title: "文本报告",
        class: "textReport",
        data: null
      },
      menuTopTool: {
        collect: false,
      },
      starOn_style: {
        color: `rgb(245, 166, 35)`,
      },
    };
  },
  methods: {
    ...mapActions("spineViewStore", ["addMyFavorite", "setSelectedCobb", "UpdateCobb"]),
    handle_star() {
      console.log(this.caseInfo);
      const { studyId, myFavorite } = this.caseInfo
      if (myFavorite) {
        xhr_removeFavorite({
          studyId
        }).then((item) => {
          this.$message.success("取消收藏成功");
        });
      } else {
        xhr_addFavorite({
          studyId
        }).then((item) => {
          this.$message.success("收藏成功");
        });
      }
      this.addMyFavorite(!myFavorite)

    },
    rowStyle({ row }) {
      if (row.id == this.selectedCobbId) {
        return {
          backgroundColor: 'grey',
          color: '#ffffff'
        }
      }
    },
    clickHeader() {
      this.$refs.tableSpineCobb.sort((a, b) => a.firstBone - b.firstBone)
      console.log("this.$refs.tableSpineCobb", this.$refs.tableSpineCobb);

      this.chooseAll()
    },
    selectAllEvent() {
      this.chooseAll()
    },
    chooseAll() {
      const { isAllSelected, selection } = this.$refs.tableSpineCobb
      if (isAllSelected) {
        this.$refs.tableSpineCobb.clearCheckboxRow()
      } else {
        this.$refs.tableSpineCobb.setAllCheckboxRow(true)
      }
      this.tableData.forEach(item => {
        if (item.checked != !isAllSelected) {
          this.setSelectedCobb(item.id)

        }
      })
      this.UpdateCobb()
    },
    selectChangeEvent(ev) {
      const { rowid, row, selection } = ev
      this.setSelectedCobb(row.id)
      this.UpdateCobb()
    },

    async saveManualDiagnosis() {
      const { computeSeriesId } = this.caseInfo
      const manualDiagnosis = {
        computeSeriesId,
        diagnosis: this.diagnosisItems.list.map(item => item.desc).join("\n"),
        finding: this.findingItems.list.map(item => item.desc).join("\n")
      }
      xhr_saveSpineManualDiagnosis(manualDiagnosis).then(async res => {
        const result = await xhr_querySpineTextReport({ computeSeriesId })
        const textReport = Object.assign(new TextReport(), result.data.resultData)
        this.textReport.data = textReport
      })

    },
    async resetReport() {
      const { computeSeriesId } = this.caseInfo
      const result = await xhr_querySpineTextReport({ computeSeriesId, reset: true })
      const textReport = Object.assign(new TextReport(), result.data.resultData)
      this.textReport.data = textReport
    }

  }
};
</script>

<style lang="less" scoped>
.wrappbox {
  position: relative;
  height: 100%;
  padding: 0 20px;
  display: flex;
  overflow-y: auto;
  flex-direction: column;

  .content_main {
    flex: 1;
    /* 占据剩余高度 */

    .table_container {
      height: 300px;
    }

    overflow-y: auto;
  }

  .btn_cxt {
    position: relative;
    /* 不再需要 absolute */
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;

    /* 修正错别的justify-items */
    .report_item_bar {
      width: 100%;
    }
  }
}
</style>
