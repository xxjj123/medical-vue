<template>
  <div class="nodule_lesion-list" tabindex="0">
    <div class="wrappbox flex flex-col justify-between">
      <div class="content_main">
        <div class="table_bar flex justify-between">
          <div class="tit">病变列表</div>
          <div class="btn_grp flex items-center">
            <ta-dropdown :trigger="['click']" class="flex justify-start items-center mr-[10px]">
              <a href="javascript:;">
                {{ sort_condition.type_select.showValue }}
                <ta-icon type="down" />
              </a>
              <ta-menu slot="overlay" @click="handleMenuClick">
                <ta-menu-item v-for="(item, index) in sort_condition.type_select.list" :key="`${index}_${item.value}`">
                  {{ item.label }}</ta-menu-item>
              </ta-menu>
            </ta-dropdown>
            <ta-dropdown :trigger="['click']" class="flex justify-start items-center">
              <a href="javascript:;" v-popover:mypop>
                {{ sort_condition.tumorType_select.showValue }}
                <ta-icon type="down" />
              </a>
            </ta-dropdown>
          </div>
        </div>

        <div class="table_container">
          <ta-big-table class="lung_table_custom" ref="tableLungNodule" :size="tableConfig.size" row-id="id"
            :checkbox-config="{ trigger: 'click', checkRowKeys: defaultSelecteRows }"
            @current-change="handleTableCurrentChange" :row-style="rowStyle" :keyboard-config="{ isArrow: true }"
            height="200" :columns="tableConfig.tableColumns" :data="tableConfig.tableData"
            @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent" :edit-config="{ trigger: 'click' }"
            @cell-click="handleCellClick" :sort-config="tableConfig.sortConfig">
            <template #risk="{ row }">
              <span class="ml-[10px]">{{ row.riskCode }}</span><br />
              <div v-if="row.riskCode == 1">
                <span class="levelTag">低危</span>
              </div>
              <div v-if="row.riskCode == 2">
                <span class="levelTag text-green-500">中危</span>
              </div>
              <div v-if="row.riskCode == 3">
                <span class="levelTag text-red-500">高危</span>
              </div>
            </template>
            <template #lobeSegmentSort="{ row }">
              <div v-show="false">-{{ row }}-</div>
            </template>

            <template #volume="{ row }">
              <div class="h1 im_block">
                <span class="mr-[5px]">IM</span><span>{{ row.im }}</span>
              </div>
              <div class="h2 volumn_block">
                <span class="mr-[5px]">{{ row.volume }}</span><span>mm³</span>
              </div>
            </template>
            <template #CHENGJI_VAL="{ row }">
              <div class="h1 cj_block">
                <!-- <span>左肺下叶</span><span class="mr-[5px] ml-[5px]">&frasl;</span><span>前内基底段</span> -->
                <span>{{ row.lobeSegment.label }}</span><span class="mr-[5px] ml-[5px]">&frasl;</span><span>{{
                  row.lobeSegment.name }}</span>
              </div>
              <div class="h2 cjVal_block">
                <span>{{ row.ellipsoidAxisMajor }}x{{ row.ellipsoidAxisLeast }}mm</span>
              </div>
            </template>
            <template #mean="{ row }">
              <div class="h1 mean_block">
                <span>{{ row.type.name }}</span>
              </div>
              <div class="h2 meanVal_block">
                <span>{{ row.ctMeasuresMean }}</span><span>HU</span>
              </div>
            </template>
            <template #typeSort="{ row }">
              <div v-show="false">-{{ row }}-</div>
            </template>
            <template #im="{ row }">
              <div v-show="false">-{{ row }}-</div>
            </template>
            <template #ellipsoidAxisMajor="{ row }">
              <div v-show="false">-{{ row }}-</div>
            </template>


            <!-- edit holder begin-->
            <template #CHENGJI_ROLE="{ row, column }">
              <div class="h1 cj_block">
                <!-- <span>左肺下叶</span><span class="mr-[5px] ml-[5px]">&frasl;</span
            ><span>前内基底段</span> -->
                <ta-dropdown :trigger="['click']" class="flex justify-start items-center mr-[10px]"
                  :getPopupContainer="setPopupContainer">
                  <a href="javascript:;">
                    {{ lungLobeDropDown.showValue }}
                    <!-- {{ sort_condition.type_select.showValue }} -->
                    <ta-icon type="down" />
                  </a>
                  <ta-menu slot="overlay" @click="handleMenuClick_lungList">
                    <template v-if="column.property === 'CHENGJI_VAL'">
                      <template v-for="(item, index) in lungLobeDropDown.list">
                        <template v-if="
                          item.childs &&
                          Array.isArray(item.childs) &&
                          item.childs.length > 0
                        ">
                          <ta-sub-menu :title="item.label" :key="`${index}_${item.value}`">
                            <ta-menu-item v-for="(child, subIndex) in item.childs" :key="`${subIndex}_${child.value}`">
                              {{ child.label }}
                            </ta-menu-item>
                          </ta-sub-menu>
                        </template>
                        <template v-else>
                          <ta-menu-item :key="`${item.value}`">
                            {{ item.label }}</ta-menu-item>
                        </template>
                      </template>
                    </template>
                  </ta-menu>
                </ta-dropdown>
                <div>{{ lungLobeDropDown.colstrValue }}</div>
              </div>
              <div class="h2 cjVal_block">
                <span>{{ row.CHENGJI_VAL }}</span>
              </div>
            </template>

            <template #MEAN_EDIT="{ row, column }">
              <div class="h1 mean_block">
                <ta-dropdown :trigger="['click']" class="flex justify-start items-center mr-[10px]"
                  :getPopupContainer="setPopupContainer">
                  <a href="javascript:;">
                    {{ noduleTypeDropDown.showValue }}
                    <ta-icon type="down" />
                  </a>
                  <ta-menu slot="overlay" @click="handleMenuClick_noduleList">
                    <template v-if="column.property === 'mean'">
                      <ta-menu-item v-for="(item, index) in noduleTypeDropDown.list" :key="`${index}_${item.value}`">
                        {{ item.label }}</ta-menu-item>
                    </template>
                  </ta-menu>
                </ta-dropdown>
              </div>
              <div class="h2 meanVal_block">
                <span>{{ row.ctMeasuresMean }}</span><span>HU</span>
              </div>
            </template>
            <!-- edit holder end-->
          </ta-big-table>
        </div>

        <div class="analytic_semantic_description">
          <anaSemanticDesBlock :des-code="'yxsj'" :bookItems.sync="anaSecDesConf.bookItems" :selection.sync="selection"
            :blockMode="anaSecDesConf.mode" :selectVal.sync="filmIpt_curItem" :title="anaSecDesConf.title"
            :current.sync="selectedNoduleId">
            <filmInputState slot="searchBar" v-model="filmIpt_curItem" :typec="`dropdown`" :selectCurIdx="`0`"
              :optionNum="`1`" @cb-click="handle_filmIptClick_yxsj"></filmInputState>
          </anaSemanticDesBlock>
        </div>

        <div class="analytic_semantic_description">
          <anaSemanticDesBlock :des-code="'yxzd'" :bookItems.sync="anaSecDesConf_1.bookItems"
            :selectVal="filmIpt_curItem_1" :blockMode="anaSecDesConf_1.mode" :title="anaSecDesConf_1.title"
            :selection.sync="selection">
            <filmInputState slot="searchBar" v-model="filmIpt_curItem_1" :typec="`dropdown`" :selectCurIdx="`0`"
              :optionNum="`2`" @cb-click="handle_filmIptClick_yxzd"></filmInputState>
          </anaSemanticDesBlock>
        </div>
        <!-- ext -->
        <!-- 筛选气泡框 -->
        <ta-popover ref="mypop" @after-leave="afterLeaveEvents" :visible-arrow="true" :offset="1" :appendToBody="true"
          :placement="`bottom`" class="cus_poper">
          <div slot="content" class="boxBtn_extSelect">
            <ta-form-model :layout="'vertical'" :model="form">
              <template v-for="(item, index) in sort_condition.tumorType_select.searchPanel">
                <ta-form-model-item :key="index" :label="item.title">
                  <ta-checkbox :indeterminate="item.allSelect.indeterminate"
                    @change="(e) => onCheckAllChange({ e, index })" :checked="item.allSelect.checkAll">
                    全部
                  </ta-checkbox>
                  <ta-checkbox-group :options="item.list" @change="(val) => onChange({ val, index })"
                    :value="index === 0 ? form[`type`] : form[`type${index}`]" />
                  <br />
                  <ta-checkbox v-if="index === 2" :indeterminate="majorAxis.indeterminate"
                    @change="(ev) => majorAxis.onCheckAllChange({ ev })" :checked="majorAxis.checkAll"
                    class="check_block_area">
                    <div class="flex">
                      <div>
                        <ta-input-number :min="1" :max="35" style="width: 77px" v-model="majorAxis.start_value"
                          placeholder="最小值" @change="majorAxis.begin_onChange" />
                      </div>
                      <div>-</div>
                      <div>
                        <ta-input-number :min="1" :max="55" style="width: 77px" placeholder="最大值"
                          v-model="majorAxis.end_value" @change="majorAxis.end_onChange" />mm
                      </div>
                    </div>
                  </ta-checkbox>
                </ta-form-model-item>
              </template>
            </ta-form-model>
            <ta-divider style="background-color: #979797" />
            <div class="flex justify-end">
              <div class="btn_group">
                <ta-button size="small">重置</ta-button>
                <ta-button type="primary" size="small" @click="filterConfirm">确定</ta-button>
              </div>
            </div>
          </div>
        </ta-popover>
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
import anaSemanticDesBlock from "@/picComps/visualTool/menudata-bar/module/lung/common/ana-semantic-des-block/index.vue";
import filmInputState from "@/picComps/visualTool/menudata-bar/module/lung/common/ana-semantic-des-block/module/film-input-state/index.vue";
import { CodeSandboxOutline } from "@yh/icons-svg";
import { mapActions } from "vuex";
import Vue from 'vue';
import { SortOption } from "@/assets/js/utils/dicom/select";
import { mapState } from "vuex";

import reportViewBtn from "./reportView/btn.vue"

import { xhr_updateNoduleLesion } from "@/api/index";

// 病理部位标志
const LESION_PART_SITE = {
  CALCIUM: "calcium", //钙化
  FRAC: "frac", //骨折
  NODULE: "nodule", //结节
  PNEUMONIA: "pneumonia", //肺炎
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
    value: Object,
    cKey: {
      type: String,
    },
  },
  computed: {
    // ...mapState("viewInitStore", ["noduleInfo", "selectedNoduleId"]),
    ...mapState("noduleInfoStore", ["noduleInfo", "selectedNoduleId"]),


    menuResult: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
        return val;
      },
    },
    defaultSelecteRows: {
      get() {
        const ids = []
        // console.log(this.tableConfig.tableData)
        if (this.tableConfig.tableData) {
          this.tableConfig.tableData.forEach(item => {
            if (item.checked) {
              ids.push(item.id)
            }
          })
        }
        return ids;
      }

    },
  },
  watch: {
    filmIpt_curItem: {
      handler(nVal, oVal) {
        // console.log("watch-----filmIpt_curItem", nVal, oVal);
        if (nVal) {
          const { value } = nVal;
          if (value === '0') {

          } else if (value === '1') {

          } else if (value === '2') {

          } else if (value === '3') {

          } else if (value === '4') {

          }
        }
      },
      immediate: true,
    },

    filmIpt_curItem_1: {
      handler(nVal, oVal) {
        // console.log("watch-----filmIpt_curItem1", nVal, oVal);
        if (nVal) {
          const { value } = nVal;
          if (value === '') {

          } else if (value === '1') {

          }
        }
      },
      immediate: true,
    },
    "anaSecDesConf.bookItems": {
      handler(nVal, oVal) {

        // console.log("watch-------anaSecDesConf.bookItems", nVal, oVal);

      },
      immediate: true,
    },
    lunglistSelectRow: {
      handler(nVal, oVal) {
        // console.log("watch____lunglistSelectRow", nVal, oVal);
        if (nVal) {
          const valState = this.validateObject(nVal.lobeSegment);

        }
      },
      immediate: true
    },
    noduleTypeListSelectRow: {
      handler(nVal, oVal) {

        if (nVal) {
          const valState = this.validateObject(nVal.type);

        }
      },
      immediate: true
    }
    ,
  },

  data() {
    return {
      selection: [],
      tableCurrentIdx: -1,
      // selectedNoduleId: null,
      NoduleLesion_row: {},//临时用
      lunglistSelectRow: {},//结节改变中转数据
      noduleTypeListSelectRow: {},//类型结节-中转
      nodule_type: [],
      left_lung: [],
      right_lung: [],
      filmIpt_curItem: null,
      filmIpt_curItem_1: null,
      anaSecDesConf: {
        title: "影像所见",
        mode: "finding",
        bookItems: [
          // `右肺上叶前段【39/259】见混合性结节，大小约13.8mmx8.3mm，体积约649.3mm³，平均CT值约-277.6HU`,
          // `左肺上叶前段【63/259】见磨玻璃性结节，大小约4.6mmx2.4mm，体积约28.9mm³，平均CT值约-702.2HU。`,
          // `左肺上叶前段【78/259】见磨玻璃性结节，大小约6.3mmx2.8mm，体积约49.6mm³，平均CT值约-529.3HU。`,
          // `右肺上叶前段【78/259】见磨玻璃性结节，大小约4.9mmx3.7mm，体积约51.0mm³，平均CT值约-634.0HU。`,
        ],
      },
      anaSecDesConf_1: {
        title: "影像诊断",
        mode: "diagnose",

        bookItems: [
          // `右肺上叶后段见肿块, 约3.0mmx1.6mm。`,
          // `右肺中叶外侧段见肿块, 约7.1mmx2.8mm。`,
          // `右肺下叶外基底段见肿块, 约4.5mmx2.3mm。`,
          // `左肺上叶尖后段见肿块, 约4.5mmx2.4mm。`,
          // `右肺上叶后段、右肺上叶前段、右肺中叶外侧段、右肺中叶内侧段、左肺上叶前段多发结节。`,
          // `右肺上叶后段、右肺上叶前段、右肺中叶外侧段、右肺中叶内侧段、左肺上叶前段多发结节。`,
        ],
      },
      tableConfig: {
        size: "small",
        showHiddenOrSortColumn: {
          // disabledControlCol: (column) => {
          //   console.log("showHiddenOrSortColumn_disabledControlCol", column);
          //   return column.type === 'lobeSegmentSort';
          // }
        },
        sortConfig: {
          trigger: 'default',
          defaultSort: { field: 'riskCode', order: 'asc' },
          orders: ['desc', 'asc', null]
        },
        tableData: [
          // {
          //   risk: "1",
          //   volume: "41",
          //   lobe: "lobe_left_top",
          // },
          // {
          //   risk: "2",
          //   volume: "41",
          //   lobe: "lobe_left_top",
          // },


        ],
        tableOriginalData: [],
        tableColumns: [
          {
            type: {
              type: "checkbox",
            },
            field: "riskCode", //危险级别
            title: "全部",
            width: "65",
            sortable: true,
            customRender: {
              default: "risk",

            },
          },
          {
            field: "lobeSegmentSort",
            title: "",
            sortable: true,
            type: {
              type: "seq",
            },
            orderIndex: "0",
            orderAsc: ['asc', 'desc', null],
            width: '0.1',
            customRender: {
              default: "lobeSegmentSort"
            }
          },
          {
            field: "typeSort",
            title: "",
            sortable: true,
            type: {
              type: "seq",
            },
            orderIndex: "0",
            orderAsc: ['asc', 'desc', null],
            width: '0.1',
            customRender: {
              default: "typeSort"
            }
          },
          {
            field: "im",
            title: "",
            sortable: true,
            type: {
              type: "seq",
            },
            orderIndex: "0",
            orderAsc: ['asc', 'desc', null],
            width: '0.1',
            customRender: {
              default: "im"
            }
          },
          {
            field: "ellipsoidAxisMajor",
            title: "",
            sortable: true,
            type: {
              type: "seq",
            },
            orderIndex: "0",
            orderAsc: ['asc', 'desc', null],
            width: '0.1',
            customRender: {
              default: "ellipsoidAxisMajor"
            }
          },
          {
            field: "volume",
            title: "", //ellipsoidAxis major * least mm
            width: "76",
            sortable: true,
            orderIndex: "0",
            orderAsc: ['asc', 'desc', null],
            customRender: {
              default: "volume",
            },
          },
          {
            field: "CHENGJI_VAL", //面积
            title: "",
            width: "141",
            editRender: {},
            customRender: {
              default: "CHENGJI_VAL",
              edit: "CHENGJI_ROLE",
            },
          },
          {
            field: "mean",
            title: "", //断层扫描/层组 ctMeasures.mean HU
            width: "115",
            editRender: {},
            customRender: {
              default: "mean",
              edit: "MEAN_EDIT",
            },
          },

        ],
      },
      majorAxis: {
        // indeterminate: false,
        onCheckAllChange: ({ ev }) => {
          let isChecked = ev.target.checked;
          if (isChecked) {
            this.$set(this.majorAxis, "checkAll", true);
            const { type2 } = this.form;
            if (type2 && type2.length > 0) {
              this.$delete(this.form, "type2");
              const row2 = this.sort_condition.tumorType_select.searchPanel[2];
              this.$set(row2.allSelect, "indeterminate", false);
              this.$set(row2.allSelect, "checkAll", false);
            }
          } else {
            this.$set(this.majorAxis, "checkAll", false);

          }
        },
        checkAll: false,
        begin_onChange: () => { },
        end_onChange: () => { },
        start_value: "",
        end_value: "",
      },
      chekboxFlag: false,
      form: {
        type: [], //类型1，
        // type1:[]//类型2，
        // type2:[]//类型3，
      },
      // 结节类型
      noduleTypeDropDown: {
        showValue: "",
        list: [
          {
            label: "磨玻璃性结节",
            value: "GCN",
          },
          {
            label: "实性结节",
            value: "Solid",
          },
          {
            label: "钙化结节",
            value: "Calcified",
          },
          {
            label: "混合性结节",
            value: "Mixed",
          },
          {
            label: "肿块",
            value: "Mass",
          },
        ],
      },
      // 肺部dropdown数据
      lungLobeDropDown: {
        showValue: "",
        colstrValue: "1.1x2.2mm",
        list: [
          {
            label: "左肺",
            value: "left",
            childs: [
              {
                label: "上叶上舌段",
                value: "11",
              },
              {
                label: "上叶下舌段",
                value: "12",
              },
              {
                label: "上叶前段",
                value: "13",
              },
              {
                label: "上叶尖后段",
                value: "14",
              },
              {
                label: "下叶内前基底段",
                value: "15",
              },
              {
                label: "下叶后基底段",
                value: "16",
              },
              {
                label: "下叶外基底段",
                value: "17",
              },
              {
                label: "下叶背段",
                value: "18",
              },
            ],
          },
          {
            label: "右肺",
            value: "right",
            childs: [
              {
                label: "上叶前段",
                value: "1",
              },
              {
                label: "上叶后段",
                value: "2",
              },
              {
                label: "上叶尖段",
                value: "3",
              },
              {
                label: "中叶内侧段",
                value: "4",
              },
              {
                label: "下叶内基底段",
                value: "6",
              },
              {
                label: "下叶前基底段",
                value: "7",
              },
              {
                label: "下叶后基底段",
                value: "8",
              },
              {
                label: "下叶外基底段",
                value: "9",
              },
              {
                label: "下叶背段",
                value: "10",
              },
            ],
          },
        ],
      },
      sort_condition: {
        // 普通类型 （风险~体积~）
        type_select: {
          showValue: "按类型", //显示选中值
          list: [
            {
              label: "默认",
              value: "",
            },
            {
              label: "按风险",
              value: "0",
            },
            {
              label: "按IM",
              value: "1",
            },
            {
              label: "按肺段",
              value: "2",
            },
            {
              label: "按长径",
              value: "3",
            },
            {
              label: "按体积",
              value: "4",
            },
            {
              label: "按类型",
              value: "5",
            },
          ],
        },
        // 肿瘤信息类型
        tumorType_select: {
          showValue: "筛选",
          searchPanel: [
            {
              title: "良恶性",
              allSelect: {
                indeterminate: false,
                checkAll: false,
              },
              list: [
                {
                  label: "低危",
                  value: "0",
                },
                {
                  label: "中危",
                  value: "1",
                },
                {
                  label: "高危",
                  value: "2",
                },
              ],
            },
            {
              title: "类型",
              allSelect: {
                indeterminate: false,
                checkAll: false,
              },
              list: [
                {
                  label: "肿块",
                  value: "0",
                },
                {
                  label: "混合",
                  value: "1",
                },
                {
                  label: "磨玻璃",
                  value: "2",
                },
                {
                  label: "实性",
                  value: "3",
                },
                {
                  label: "钙化",
                  value: "4",
                },
              ],
            },
            {
              title: "长径",
              allSelect: {
                indeterminate: false,
                checkAll: false,
              },
              list: [
                {
                  label: "0-3mm",
                  value: "0",
                },
                {
                  label: "3-5mm",
                  value: "1",
                },
                {
                  label: "5-8mm",
                  value: "2",
                },
                {
                  label: ">8mm",
                  value: "3",
                },
              ],
            },
          ],
        },
      },
    };
  },
  methods: {
    ...mapActions("noduleInfoStore", ["ChooseAnnotation"]),

    setPopupContainer(trigger) {
      return trigger.parentElement;
    },

    reset_cache_selectedNodule() {
      // this.NoduleLesion_row = {};
      this.lunglistSelectRow = {};
      this.noduleTypeListSelectRow = {};
    },
    rowStyle({ row, rowIndex }) {
      if (row.id == this.selectedNoduleId) {
        return {
          backgroundColor: 'grey',
          color: '#ffffff'
        }
      }
    },

    filterConfirm() {
      console.log(this.form["type"])
      console.log(this.form["type1"])
      console.log(this.form["type2"])
      const type = this.form["type"]
      const type1 = this.form["type1"]
      const type2 = this.form["type2"]

      console.log(type2)
      console.log(this.form)
      console.log(this.majorAxis)

      console.log(this.anaSecDesConf)
      let filteredData = this.tableConfig.tableOriginalData


      console.log(this.tableConfig.tableOriginalData);
      if (type && type.length !== 0) {
        console.log("筛选风险")
        console.log(type[0])
        console.log(this.tableConfig.tableOriginalData[3].riskCode)
        filteredData = this.tableConfig.tableOriginalData.filter(item =>
          type.includes(String(item.riskCode))
        );
        console.log(filteredData)

      }
      console.log(type1)
      if (type1 && type1.length !== 0) {
        console.log("筛选类型")
        console.log(type1[0])
        filteredData = filteredData.filter(item =>
          type1.includes(String(item.typeSort))
        );
        console.log(filteredData)
      }
      filteredData.forEach(item => item.checked = true)
      // const selection = filteredData.filter(item => item.checked)

      const selection = filteredData
      this.tableConfig.tableData = filteredData
      this.selection = selection

      // this.tableConfig.tableData.filter(item => item.checked);

      // // console.log(column)
      // this.$refs.tableLungNodule.setFilter(column, [{ value: "1" }])
    }
    ,
    validateObject(obj) {
      // 检查是否为对象且不是null
      if (typeof obj === 'object' && obj !== null && Object.keys(obj).length > 0) {
        // 检查对象是否有label和value属性
        return 'label' in obj && 'value' in obj;
      }
      // 如果对象为空或不包含label和value属性，返回false
      return false;
    },
    handleCellClick({
      row,
      rowIndex,
      $rowIndex,
      column,
      columnIndex,
      $columnIndex,
      triggerRadio,
      triggerCheckbox,
      $event,
    }) {
      if (this.chekboxFlag) {
        this.chekboxFlag = false
        return;
      }
      this.tableCurrentIdx = rowIndex;

      // console.log(this.$refs.tableLungNodule.getCurrentRecord())

      const currentid = this.$refs.tableLungNodule.getCheckboxRecords().id
      const currentim = this.$refs.tableLungNodule.getCheckboxRecords()

      if (currentid !== this.selectedNoduleId) {
        const bboxindex = row.id;
        console.log(row.im)
        const currentim = row.im
        this.ChooseAnnotation({ currentim, bboxindex });
        // this.selectedNoduleId = row.id;
      }

      console.log("handleCellClick--row", row, "row.boxIndex", row.boxIndex, "this.tableCurrentIdx", this.tableCurrentIdx);

      this.NoduleLesion_row = row;

      const { property } = column;
      // if(property === 'CHENGJI_VAL'){
      const { lobe, lobeSegment } = row;

      const mark = this.$api.getLungSide(lobe);

      console.log("mark----", mark);

      if (mark === "left") {
        this.$api.query_humen_boot_data().then((item) => {
          const rowSelectItem = this.$api.findObjectByValue(
            item,
            "lung.segments",
            lobeSegment.value.toString(),
          )[0];
          console.log("rowSelectItem=....", rowSelectItem);
          this.lungLobeDropDown.showValue = `${rowSelectItem.label} / ${rowSelectItem.name}`;

          this.lungLobeDropDown.colstrValue = `${row.ellipsoidAxisMajor}x${row.ellipsoidAxisLeast}mm`
        });
      } else if (mark === "right") {
        this.$api.query_humen_boot_data().then((item) => {
          const rowSelectItem = this.$api.findObjectByValue(
            item,
            "lung.segments",
            lobeSegment.value.toString(),
          )[0];
          console.log("rowSelectItem=....", rowSelectItem);
          this.lungLobeDropDown.showValue = `${rowSelectItem.label} / ${rowSelectItem.name}`;
          this.lungLobeDropDown.colstrValue = `${row.ellipsoidAxisMajor}x${row.ellipsoidAxisLeast}mm`
        });
      }
      const { type } = row;
      this.$api.query_humen_boot_data().then((item) => {
        const rowSelectItem = this.$api.findObjectByValue(
          item,
          "lung.noduleType",
          type.value.toString(),
        )[0];
        this.noduleTypeDropDown.showValue = `${rowSelectItem.name}`;
      });

    },
    async init_lesionPanelSearchBar() {
      const item = await this.init_select("LESION_LIST_TYPE");
      const LESION_LIST_TYPE = this.$ut.serializeDropdownList(item);
      const { type_select, tumorType_select } = this.sort_condition;
      const { searchPanel } = tumorType_select;
      const lex = searchPanel[0];
      const typeAll = searchPanel[1];
      const longSer = searchPanel[2];

      this.$set(type_select, "list", LESION_LIST_TYPE);

      const group = [
        "LESION_LIST_FILTER_LEX",
        "LESION_LIST_FILTER_NODULETYPE",
        "LESION_LIST_FILTER_MAJOR_AXIS",
      ];
      // const item1 = await
      this.init_lesion_filter_Item(group).then((itemRes) => {
        const LESION_LIST_FILTER_LEX = this.$ut
          .serializeDropdownList(itemRes[group[0]])
          .filter((v) => v.label !== "全部");

        const LESION_LIST_FILTER_NODULETYPE = this.$ut
          .serializeDropdownList(itemRes[group[1]])
          .filter((v) => v.label !== "全部");

        const LESION_LIST_FILTER_MAJOR_AXIS = this.$ut
          .serializeDropdownList(itemRes[group[2]])
          .filter((v) => v.label !== "全部");

        this.$set(lex, "list", LESION_LIST_FILTER_LEX);
        this.$set(typeAll, "list", LESION_LIST_FILTER_NODULETYPE);
        this.$set(longSer, "list", LESION_LIST_FILTER_MAJOR_AXIS);
      });

      // console.log("this.sort_condition-all", this.sort_condition);
    },
    async init_lesion_filter_Item(grp) {
      return new Promise((resolve, reject) => {
        let igoArray = {};
        if (!Array.isArray(grp)) {
          throw new Error("传入的参数grp不是一个数组");
        } else {
          grp.forEach(async (v, i) => {
            const iv = await this.init_select(v);
            igoArray[v] = iv;
          });
          // return igoArray;
        }
        resolve(igoArray);
      });
    },
    async init_select(type) {
      // "LESION_LIST_TYPE"
      const selectValues = await this.$api.select_codeTable_type_group(type);
      return selectValues;
    },
    handle_filmIptClick_yxsj(ev) {
      console.log(
        "handle_filmIptClick___",
        ev,
        "filmIpt_curItem",
        this.filmIpt_curItem
      );
    },
    handle_filmIptClick_yxzd(ev) {
      console.log(
        "handle_filmIptClick___",
        ev,
        "filmIpt_curItem_1",
        this.filmIpt_curItem_1
      );
    },

    selectAllEvent(ev) {
      const { selection } = ev;
      console.log("selection", selection);

      this.selection = selection;
      // this.selection = this.tableConfig.tableData;
    },
    selectChangeEvent(ev) {
      console.log("selectChangeEvent___", ev);
      // this.flag = false;
      this.chekboxFlag = true;


      const { selection } = ev;
      // console.log("selection===:", JSON.stringify(selection), "this.tableCurrentIdx", this.tableCurrentIdx);
      console.log("selection", selection);

      this.selection = selection;
    },
    handleTableCurrentChange({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event }) {
      console.log("handleTableCurrentChange:row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event --", row, rowIndex, $rowIndex, column, columnIndex, $columnIndex, $event);

    },
    afterLeaveEvents() { },
    onCheckAllChange({ e, index }) {
      let isChecked = e.target.checked;
      // console.log("isChecked=", isChecked);
      const typeArr =
        this.sort_condition.tumorType_select.searchPanel[index].list;
      const allSelect =
        this.sort_condition.tumorType_select.searchPanel[index].allSelect;
      const alltypeArr = typeArr.map((vo) => vo.value);

      if (isChecked) {
        //全选
        this.$set(allSelect, "checkAll", true);

        if (index === 0) {
          this.form.type = alltypeArr;
        } else {
          this.$set(this.form, `type${index}`, alltypeArr);
          if (index === 2) {
            this.$set(this.majorAxis, "checkAll", false);
          }
        }
      } else {
        //反选
        this.$set(allSelect, "checkAll", false);
        // this.form.type = [];
        if (index === 0) {
          this.form.type = [];
        } else {
          this.$set(this.form, `type${index}`, []);
        }
      }
      this.$set(allSelect, "indeterminate", false);
    },
    onChange({ val, index }) {
      // console.log("onChange-----", val, index);
      const typeArr =
        this.sort_condition.tumorType_select.searchPanel[index].list;
      const allSelect =
        this.sort_condition.tumorType_select.searchPanel[index].allSelect;
      if (val.length < typeArr.length && val.length !== 0) {
        //全选check设置为半选状态
        this.$set(allSelect, "checkAll", false);
        this.$set(allSelect, "indeterminate", true);
      } else if (val.length === 0) {
        //全选check设置为不选状态
        this.$set(allSelect, "checkAll", false);
        this.$set(allSelect, "indeterminate", false);
      } else {
        //全选check设置为选中状态
        this.$set(allSelect, "checkAll", true);
        this.$set(allSelect, "indeterminate", false);
        if (index === 2) {
          // console.log(
          //   "全选check设置为选中状态",
          //   "allSelect",
          //   allSelect.checkAll
          // );
          if (allSelect.checkAll) {
            this.$set(this.majorAxis, "checkAll", false);
          }
        }
      }
      if (index === 0) {
        // this.form.type = val;
        this.$set(this.form, `type`, val);
      } else {
        this.$set(this.form, `type${index}`, val);
        // this.form[`type${index}`] = val;
      }

      // console.log(" this.form===change", this.form);
    },
    checkGroup_change(val) {
      // console.log("checkGroup_change___", val);

      // console.log("this.form===", this.form);
      const empty = val.findIndex((vo) => vo === "");
      // console.log("empty=", empty);
      const typeArr = this.sort_condition.tumorType_select.searchPanel[0].list;
      const alltypeArrNotEmpty = typeArr
        .map((vo) => vo.value)
        .filter((vo) => vo !== "");
      // console.log("alltypeArrNotEmpty=", alltypeArrNotEmpty);
      //
      if (empty === -1) {
        this.form.type = [];
        this.$set(typeArr[0], "checkAll", false);
        this.$set(typeArr[0], "indeterminate", false);
        // console.log("不存在", "val--", val, "this.form.type", this.form.type);
      } else {
        // console.log("存在");
        // this.form.type = ["", ...alltypeArrNotEmpty];
        // this.$set(typeArr[0], "checkAll", true);
        // this.$set(typeArr[0], "indeterminate", false);
        // console.log("val----", val, val.length);
        // if (val.length > 1) {
        //   this.form.type = [...val];
        // }
      }
    },
    handleMenuClick(e) {
      console.log("click:handleMenuClick:", e);
      const { key } = e;
      const keyFindArr = key.split("_");
      console.log("keyFindArr=", keyFindArr);
      console.log("this.sort_condition.type_select.list==", this.sort_condition.type_select.list);

      // return
      // const idx = keyFindArr[0];
      const idx = keyFindArr[1];
      const row = this.sort_condition.type_select.list.filter(item => item.value === idx)[0]
      // const row = this.sort_condition.type_select.list[idx];

      console.log("sort_condition.type_select==row", row);

      const { label, value } = row;

      this.sort_condition.type_select.showValue = label;

      switch (value) {
        case SortOption.Default: {
          let that = this;
          const riskCode_col = this.$refs.tableLungNodule.getColumnByField('im');
          console.log("riskCode_col++++", riskCode_col);

          const lobeSegmentSort_col = this.tableConfig.tableColumns[3]

          function get_lobeSegmentSort_col_index() {
            const col = that.tableConfig.tableColumns[3];
            const { orderIndex } = col;
            return orderIndex;
          }

          function next_lobeSegmentSort_col_index() {
            const col = that.tableConfig.tableColumns[3];
            const idx = get_lobeSegmentSort_col_index();
            col.orderIndex = (parseInt(idx, 10) + 1) % col.orderAsc.length;
            return col.orderIndex;
          }

          const orderIndex = next_lobeSegmentSort_col_index();
          const order = that.tableConfig.tableColumns[3].orderAsc[orderIndex];

          this.$refs.tableLungNodule.sort('im', 'desc');


          console.log("SortOption.IM=默认=", SortOption.IM);
        }
          break;
        case SortOption.Risk: {
          const riskCode_col = this.$refs.tableLungNodule.getSortColumns('riskCode')[0];
          console.log("riskCode_col___", riskCode_col);
          const { order } = riskCode_col;

          console.log("order==", order);

          if (order === 'desc') {
            this.$refs.tableLungNodule.sort('riskCode', 'asc');
          } else if (order === 'asc') {
            this.$refs.tableLungNodule.sort('riskCode', 'desc');
          } else {
            this.$refs.tableLungNodule.sort('riskCode', 'asc');
          }
          console.log("SortOption.Risk==", SortOption.Risk);
        }
          break;
        case SortOption.IM: {
          let that = this;
          const riskCode_col = this.$refs.tableLungNodule.getColumnByField('im');
          console.log("riskCode_col++++", riskCode_col);

          const lobeSegmentSort_col = this.tableConfig.tableColumns[3]

          function get_lobeSegmentSort_col_index() {
            const col = that.tableConfig.tableColumns[3];
            const { orderIndex } = col;
            return orderIndex;
          }

          function next_lobeSegmentSort_col_index() {
            const col = that.tableConfig.tableColumns[3];
            const idx = get_lobeSegmentSort_col_index();
            col.orderIndex = (parseInt(idx, 10) + 1) % col.orderAsc.length;
            return col.orderIndex;
          }

          const orderIndex = next_lobeSegmentSort_col_index();
          const order = that.tableConfig.tableColumns[3].orderAsc[orderIndex];

          if (order === 'desc') {
            this.$refs.tableLungNodule.sort('im', 'asc');
          } else if (order === 'asc') {
            this.$refs.tableLungNodule.sort('im', 'desc');
          } else {
            this.$refs.tableLungNodule.sort('im', 'asc');
          }

          console.log("SortOption.IM==", SortOption.IM);
        }
          break;
        case SortOption.LobeSegment: {
          let that = this;
          const riskCode_col = this.$refs.tableLungNodule.getColumnByField('lobeSegmentSort');

          const lobeSegmentSort_col = this.tableConfig.tableColumns[1]

          function get_lobeSegmentSort_col_index() {
            const col = that.tableConfig.tableColumns[1];
            const { orderIndex } = col;
            return orderIndex;
          }

          function next_lobeSegmentSort_col_index() {
            const col = that.tableConfig.tableColumns[1];
            const idx = get_lobeSegmentSort_col_index();
            col.orderIndex = (parseInt(idx, 10) + 1) % col.orderAsc.length;
            return col.orderIndex;
          }

          const orderIndex = next_lobeSegmentSort_col_index();
          const order = that.tableConfig.tableColumns[1].orderAsc[orderIndex];

          if (order === 'desc') {
            this.$refs.tableLungNodule.sort('lobeSegmentSort', 'asc');
          } else if (order === 'asc') {
            this.$refs.tableLungNodule.sort('lobeSegmentSort', 'desc');
          } else {
            this.$refs.tableLungNodule.sort('lobeSegmentSort', 'asc');
          }
          console.log("SortOption.LobeSegment==", SortOption.LobeSegment);
        }
          break;
        case SortOption.Length: {
          let that = this;
          const riskCode_col = this.$refs.tableLungNodule.getColumnByField('im');
          console.log("riskCode_col++++", riskCode_col);

          const lobeSegmentSort_col = this.tableConfig.tableColumns[4]

          function get_lobeSegmentSort_col_index() {
            const col = that.tableConfig.tableColumns[4];
            const { orderIndex } = col;
            return orderIndex;
          }

          function next_lobeSegmentSort_col_index() {
            const col = that.tableConfig.tableColumns[4];
            const idx = get_lobeSegmentSort_col_index();
            col.orderIndex = (parseInt(idx, 10) + 1) % col.orderAsc.length;
            return col.orderIndex;
          }

          const orderIndex = next_lobeSegmentSort_col_index();
          const order = that.tableConfig.tableColumns[4].orderAsc[orderIndex];

          if (order === 'desc') {
            this.$refs.tableLungNodule.sort('ellipsoidAxisMajor', 'desc');
          } else if (order === 'asc') {
            this.$refs.tableLungNodule.sort('ellipsoidAxisMajor', 'asc');
          } else {
            this.$refs.tableLungNodule.sort('ellipsoidAxisMajor', 'desc');
          }



          console.log("SortOption.Length==", SortOption.Length);
        }
          break;
        case SortOption.Volume: {
          let that = this;
          const riskCode_col = this.$refs.tableLungNodule.getColumnByField('volume');
          console.log("riskCode_col++++", riskCode_col);

          const lobeSegmentSort_col = this.tableConfig.tableColumns[5]

          function get_lobeSegmentSort_col_index() {
            const col = that.tableConfig.tableColumns[5];
            const { orderIndex } = col;
            return orderIndex;
          }

          function next_lobeSegmentSort_col_index() {
            const col = that.tableConfig.tableColumns[5];
            const idx = get_lobeSegmentSort_col_index();
            col.orderIndex = (parseInt(idx, 10) + 1) % col.orderAsc.length;
            return col.orderIndex;
          }

          const orderIndex = next_lobeSegmentSort_col_index();
          const order = that.tableConfig.tableColumns[5].orderAsc[orderIndex];

          if (order === 'desc') {
            this.$refs.tableLungNodule.sort('volume', 'desc');
          } else if (order === 'asc') {
            this.$refs.tableLungNodule.sort('volume', 'asc');
          } else {
            this.$refs.tableLungNodule.sort('volume', 'desc');
          }



          console.log("SortOption.Volume==", SortOption.Volume);
        }
          break;
        case SortOption.Type: {
          let that = this;
          const riskCode_col = this.$refs.tableLungNodule.getColumnByField('typeSort');

          const lobeSegmentSort_col = this.tableConfig.tableColumns[2]

          function get_lobeSegmentSort_col_index() {
            const col = that.tableConfig.tableColumns[2];
            const { orderIndex } = col;
            return orderIndex;
          }

          function next_lobeSegmentSort_col_index() {
            const col = that.tableConfig.tableColumns[2];
            const idx = get_lobeSegmentSort_col_index();
            col.orderIndex = (parseInt(idx, 10) + 1) % col.orderAsc.length;
            return col.orderIndex;
          }

          const orderIndex = next_lobeSegmentSort_col_index();
          const order = that.tableConfig.tableColumns[2].orderAsc[orderIndex];

          if (order === 'desc') {
            this.$refs.tableLungNodule.sort('typeSort', 'asc');
          } else if (order === 'asc') {
            this.$refs.tableLungNodule.sort('typeSort', 'desc');
          } else {
            this.$refs.tableLungNodule.sort('typeSort', 'asc');
          }
          console.log("SortOption.Type==", SortOption.Type);

        }
          break;
        default:
          return void 0;
      }
    },
    handleMenuClick_lungList(e) {
      console.log("handleMenuClick_lungList", e, "this.tableCurrentIdx", this.tableCurrentIdx, "this.tableConfig.tableData", this.tableConfig.tableData, "this.NoduleLesion_row ", this.NoduleLesion_row);
      const { key } = e;
      const arr = key.split("_");
      const code = arr[arr.length - 1];

      this.$api.query_humen_boot_data().then(async item => {
        const rowSelectItem = await this.$api.findObjectByValue(item, "lung.segments", code.toString())[0];

        this.lunglistSelectRow = { lobeSegment: rowSelectItem };

        console.log("this.lunglistSelectRow---handleMenuClick_after:", this.lunglistSelectRow, "this.tableConfig.tableData[this.tableCurrentIdx]", this.tableConfig.tableData[this.tableCurrentIdx])

        // 同步最新表格数据
        this.$set(this.tableConfig.tableData[this.tableCurrentIdx], 'lobeSegment', rowSelectItem);
        // 同步edit状态下的对应行数据回显内容
        this.lungLobeDropDown.showValue = `${rowSelectItem.label} / ${rowSelectItem.name}`;
        // this.reset_cache_selectedNodule();

        if (this.validateObject(this.lunglistSelectRow.lobeSegment)) {

          // this.$set(this.NoduleLesion_row, "lobeSegment", this.lunglistSelectRow.lobeSegment.value)

          let param = {};
          param = {
            ...this.NoduleLesion_row,
            lobeSegment: this.lunglistSelectRow.lobeSegment.value,
            type: typeof this.NoduleLesion_row.type === 'object' ? this.NoduleLesion_row.type.value : typeof this.NoduleLesion_row.type === 'string' ? this.NoduleLesion_row.type : undefined,
          }

          console.log("param___param__lung", this.NoduleLesion_row)
          xhr_updateNoduleLesion(param).then(result => {
            console.log("xhr_updateNoduleLesion__lung", result);
            //  this.reset_cache_selectedNodule();
            setTimeout(() => {
              this.$message.success(`更新数据成功`)
            }, 500)
          })
        } else {

        }
      })


    },
    handleMenuClick_noduleList(e) {
      console.log("handleMenuClick_noduleList", e, "this.tableCurrentIdx", this.tableCurrentIdx, "this.tableConfig.tableData", this.tableConfig.tableData);
      const { key } = e;
      const arr = key.split("_");
      const code = arr[arr.length - 1];

      this.$api.query_humen_boot_data().then(async item => {
        const rowSelectItem = await this.$api.findObjectByValue(item, "lung.noduleType", code.toString())[0];

        console.log("rowSelectItem__lungNodule---", rowSelectItem);

        this.noduleTypeListSelectRow = { type: rowSelectItem };

        console.log("this.noduleTypeListSelectRow--", this.noduleTypeListSelectRow)

        console.log("this.noduleTypeListSelectRow---handleMenuClick_after:", this.noduleTypeListSelectRow)

        // 同步最新表格数据
        this.$set(this.tableConfig.tableData[this.tableCurrentIdx], 'type', rowSelectItem);
        // 同步edit状态下的对应行数据回显内容
        this.lungLobeDropDown.showValue = `${rowSelectItem.name}`;
        // this.reset_cache_selectedNodule();


        if (this.validateObject(this.noduleTypeListSelectRow.type)) {
          // this.$set(this.NoduleLesion_row, "type", this.noduleTypeListSelectRow.type.value)

          console.log("this.NoduleLesion_row==this.NoduleLesion_row", this.NoduleLesion_row)
          let param = {};
          param = {
            ...this.NoduleLesion_row,
            type: this.noduleTypeListSelectRow.type.value,
            lobeSegment: typeof this.NoduleLesion_row.lobeSegment === 'object' ? this.NoduleLesion_row.lobeSegment.value : typeof this.NoduleLesion_row.lobeSegment === 'string' ? this.NoduleLesion_row.lobeSegment : undefined,
          }

          console.log("param___param__type", this.NoduleLesion_row)
          xhr_updateNoduleLesion(param).then(result => {
            console.log("xhr_updateNoduleLesion___type", result);
            // this.reset_cache_selectedNodule();
            setTimeout(() => {
              this.$message.success(`更新数据成功`)
            }, 500)

          })
        } else {

        }

      })

    },

    // 应用 customizeJson 和 策略
    async processJsonData(jsonData) {
      const { noduleLesionList } = this.menuResult;
      if (this.menuResult) {
        const processedData_lobe = this.$api.processLungItems.call(this, noduleLesionList, ['lobeSegment']).then(async (item) => {

          console.log("item----", item);
          const processedData_type = await this.$api.processLungItems.call(this, item, ['type'], 'noduleType')

          console.log("processedData_type=", processedData_type);
          this.tableConfig.tableData = processedData_type;
          this.tableConfig.tableOriginalData = processedData_type;
          this.tableConfig.tableOriginalData.forEach(item => item.checked = true)


          this.selection = this.tableConfig.tableData.filter(item => item.checked);

        })
      }


    },
    init_tableData() {
      const tableItem = this.menuResult;
      const jsonData = tableItem.focalDetailList;
      // console.log(jsonData);

      this.processJsonData(jsonData).then(() => {
        //finding 所见，diagnosis 诊断
        const { finding, diagnosis } = tableItem;
        // console.log("finding",finding);
        if (finding) {
          const arr_find = finding.split("\n");
          // console.log("arr_find",arr_find);
          const arr_diagnosis = diagnosis.split("\n");
          this.anaSecDesConf.bookItems = arr_find;
          this.anaSecDesConf_1.bookItems = arr_diagnosis;
          // this.anaSecDesConf.selection =
        }

      });


    },
  },
  created() {
    this.init_lesionPanelSearchBar();
    // 表格初始化
    this.init_tableData();
    this.$nextTick(() => {
      document
        .querySelector(".nodule_lesion-list")
        .addEventListener("mouseover", function () {
          this.style.overflow = "auto"; // 获得焦点时显示滚动条
        });

      document
        .querySelector(".nodule_lesion-list")
        .addEventListener("mouseout", function () {
          this.style.overflow = "hidden"; // 失去焦点时隐藏滚动条
        });

    });

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

  // box-sizing: border-box;
  // margin-right: -20px; /* 预留滚动条宽度 */
  // padding-right: 20px; /* 预留滚动条宽度 */
  // resize: both;
  // width: calc(400px - 2%);
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
