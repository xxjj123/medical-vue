<template>
  <div class="nodule_lesion-list">
    <div class="table_bar flex justify-between">
      <div class="tit">病变列表</div>
      <div class="btn_grp flex">
        <ta-dropdown :trigger="['click']">
          <a href="javascript:;">
            {{ sort_condition.type_select.showValue }} <ta-icon type="down" />
          </a>
          <ta-menu slot="overlay" @click="handleMenuClick">
            <ta-menu-item
              v-for="(item, index) in sort_condition.type_select.list"
              :key="`${index}_${item.value}`"
              >{{ item.label }}</ta-menu-item
            >
            <!-- <ta-menu-divider /> -->
          </ta-menu>
        </ta-dropdown>
        <ta-dropdown :trigger="['click']">
          <a href="javascript:;" v-popover:mypop>
            {{ sort_condition.tumorType_select.showValue }}
            <ta-icon type="down" />
          </a>
        </ta-dropdown>
      </div>
    </div>

    <div class="table_container">
      <ta-big-table
        :size="tableConfig.size"
        highlight-hover-row
        :columns="tableConfig.tableColumns"
        :data="tableConfig.tableData"
        @checkbox-all="selectAllEvent"
        @checkbox-change="selectChangeEvent"
        :checkbox-config="{
          trigger: 'row',
        }"
      >
      </ta-big-table>
    </div>

    <div class="analytic_semantic_description">
      <anaSemanticDesBlock :title="anaSecDesConf.title"></anaSemanticDesBlock>
    </div>

    <!-- ext -->
    <ta-popover
      ref="mypop"
      @after-leave="afterLeaveEvents"
      :visible-arrow="true"
      :offset="1"
      :appendToBody="true"
      :placement="`bottom`"
      class="cus_poper"
    >
      <div slot="content" class="boxBtn_extSelect">
        <ta-form-model :layout="'vertical'" :model="form">
          <template
            v-for="(item, index) in sort_condition.tumorType_select.searchPanel"
          >
            <ta-form-model-item :key="index" :label="item.title">
              <ta-checkbox
                :indeterminate="item.allSelect.indeterminate"
                @change="(e) => onCheckAllChange({ e, index })"
                :checked="item.allSelect.checkAll"
              >
                全部
              </ta-checkbox>
              <ta-checkbox-group
                :options="item.list"
                @change="(val) => onChange({ val, index })"
                :value="index === 0 ? form[`type`] : form[`type${index}`]"
              />
              <br />
              <ta-checkbox
                v-if="index === 2"
                :indeterminate="majorAxis.indeterminate"
                @change="(ev) => majorAxis.onCheckAllChange({ ev })"
                :checked="majorAxis.checkAll"
                class="check_block_area"
              >
                <div class="flex">
                  <div>
                    <ta-input-number
                      :min="1"
                      :max="35"
                      style="width: 77px"
                      v-model="majorAxis.start_value"
                      placeholder="最小值"
                      @change="majorAxis.begin_onChange"
                    />
                  </div>
                  <div>-</div>
                  <div>
                    <ta-input-number
                      :min="1"
                      :max="55"
                      style="width: 77px"
                      placeholder="最大值"
                      v-model="majorAxis.end_value"
                      @change="majorAxis.end_onChange"
                    />mm
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
            <ta-button type="primary" size="small">确定</ta-button>
          </div>
        </div>
      </div>
    </ta-popover>
  </div>
</template>
<script lang='javascript'>
import anaSemanticDesBlock from "@/picComps/visualTool/menudata-bar/module/lung/common/ana-semantic-des-block/index.vue";
// 病变列表
export default {
  name: "lesion-list",
  components: {
    anaSemanticDesBlock,
  },
  data() {
    return {
      anaSecDesConf: {
        title: "影像所见",
      },
      tableConfig: {
        size: "small",
        tableData: [
          {
            risk: "1",
            volume: "41",
            lobe: "lobe_left_top",
          },
          {
            risk: "2",
            volume: "41",
            lobe: "lobe_left_top",
          },
          {
            risk: "3",
            volume: "41",
            lobe: "lobe_left_top",
          },
          {
            risk: "4",
            volume: "41",
            lobe: "lobe_left_top",
          },
        ],
        tableColumns: [
          {
            type: {
              type: "checkbox",
            },
            width: "60",
          },
          {
            field: "risk",
            title: "risk",
            width: "60",
          },
          {
            field: "volume",
            title: "volume",
            width: "110",
          },
          {
            field: "lobe",
            title: "lobe",
            width: "160",
          },
        ],
      },
      majorAxis: {
        // indeterminate: false,
        onCheckAllChange: ({ ev }) => {
          console.log("onCheckAllChange--mg", ev, ev.target.checked);
          let isChecked = ev.target.checked;
          if (isChecked) {
            this.$set(this.majorAxis, "checkAll", true);
            console.log("this.form---", this.form);
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
        begin_onChange: () => {},
        end_onChange: () => {},
        start_value: "",
        end_value: "",
      },
      form: {
        type: [], //类型1，
        // type1:[]//类型2，
        // type2:[]//类型3，
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
    selectAllEvent(ev) {
      console.log("selectAllEvent___", ev);
    },
    selectChangeEvent(ev) {
      console.log("selectChangeEvent___", ev);
    },
    afterLeaveEvents() {},
    onCheckAllChange({ e, index }) {
      let isChecked = e.target.checked;
      console.log("isChecked=", isChecked);
      const typeArr =
        this.sort_condition.tumorType_select.searchPanel[index].list;
      const allSelect =
        this.sort_condition.tumorType_select.searchPanel[index].allSelect;
      const alltypeArr = typeArr.map((vo) => vo.value);

      if (isChecked) {
        //全选
        this.$set(allSelect, "checkAll", true);
        // this.form.type = alltypeArr;
        console.log("alltypeArr==", alltypeArr);

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
      console.log("onChange-----", val, index);
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
          console.log(
            "全选check设置为选中状态",
            "allSelect",
            allSelect.checkAll
          );
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

      console.log(" this.form===change", this.form);
    },
    checkGroup_change(val) {
      console.log("checkGroup_change___", val);

      console.log("this.form===", this.form);
      const empty = val.findIndex((vo) => vo === "");
      console.log("empty=", empty);
      const typeArr = this.sort_condition.tumorType_select.searchPanel[0].list;
      const alltypeArrNotEmpty = typeArr
        .map((vo) => vo.value)
        .filter((vo) => vo !== "");
      console.log("alltypeArrNotEmpty=", alltypeArrNotEmpty);

      if (empty === -1) {
        this.form.type = [];
        this.$set(typeArr[0], "checkAll", false);
        this.$set(typeArr[0], "indeterminate", false);
        console.log("不存在", "val--", val, "this.form.type", this.form.type);
      } else {
        console.log("存在");
        // this.form.type = ["", ...alltypeArrNotEmpty];
        // this.$set(typeArr[0], "checkAll", true);
        // this.$set(typeArr[0], "indeterminate", false);
        console.log("val----", val, val.length);
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
      const idx = keyFindArr[0];

      const row = this.sort_condition.type_select.list[idx];
      console.log("sort_condition.type_select==row", row);
      this.sort_condition.type_select.showValue = row.label;
    },
  },
};
</script>
<style lang='less' scoped>
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
    > .ant-checkbox {
      & + span {
        display: inline-block;
      }
    }
  }
}
</style>
