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
      <div slot="content" class="boxBtn_extSelect">1</div>
    </ta-popover>
  </div>
</template>
<script lang='javascript'>
// 病变列表
export default {
  name: "lesion-list",
  data() {
    return {
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
              list: [
                {
                  label: "全部",
                  value: "",
                },
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
              list: [
                {
                  label: "全部",
                  value: "",
                },
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
              list: [
                {
                  label: "全部",
                  value: "",
                },
                {
                  label: "0-3mm",
                  value: "",
                },
                {
                  label: "3-5mm",
                  value: "",
                },
                {
                  label: "5-8mm",
                  value: "",
                },
                {
                  label: ">8mm",
                  value: "",
                },
              ],
            },
          ],
        },
      },
    };
  },
  methods: {
    afterLeaveEvents() {},
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
</style>
