<template>
  <div class="film-input-state_wrapperbox flex justify-start items-center">
    <template v-if="optionNum">
      <ta-dropdown :trigger="['click']" class="flex justify-start items-center">
        <a href="javascript:;">
          {{ showValueData }}
          <ta-icon type="down" />
        </a>
        <ta-menu slot="overlay" @click="handleMenuClick">
          <ta-menu-item
            v-for="(item, index) in optionList"
            :key="`${index}_${item.value}`"
            >{{ item.label }}</ta-menu-item
          >
        </ta-menu>
      </ta-dropdown>
    </template>
  </div>
</template>
<script lang='javascript'>
import { selectOptions1, selectOptions2 } from "./assets/js/select-condition";
// 查询条件输入选择组件
export default {
  name: "film-input-state",
  props: {
    value: {
      // type: String,
      required: true,
    },
    typec: {
      type: String,
      default: "dropdown", //dropdown
    },
    optionNum: {
      type: [String],
      default: "", //1,2,...
      required: true,
    },
    selectCurIdx: {
      type: [String],
      default: "0", //1,2,...
    },
  },
  computed: {
    showValue: {
      get() {
        return this.optionList[this.selectCurIdx]?.label
          ? this.optionList[this.selectCurIdx].label
          : `筛选条件${this.optionNum}`;
      },
      set(val) {
        console.log(val, "sssssssssss");
        return val;
      },
    },
    optionList: {
      get() {
        if (this.optionNum === "1") {
          return selectOptions1;
        } else if (this.optionNum == "2") {
          return selectOptions2;
        }
      },
      set(val) {
        return val;
      },
    },
  },
  data() {
    return {
      showValueData: "",
    };
  },
  methods: {
    handleMenuClick(ev) {
      // const ev = {
      //   item,
      //   index,
      // };
      const { key } = ev;
      const index = key.split("_")[0];
      const curRow = this.optionList[index];
      console.log("curRow==", curRow);
      this.showValueData = curRow.label;
      // this.$set(this.$data, "showValue", curRow.label);
      this.$forceUpdate();
      console.log("this.showValueData", this.showValueData);

      this.$emit("input", curRow);
      this.$emit("cb-click", curRow);
    },
    initPush_FatherPrevSfc() {
      const selectRow = this.optionList[this.selectCurIdx];
      this.$emit("input", selectRow);

      this.showValueData = this.showValue;

      console.log("optionList==", this.optionList);
    },
  },
  created() {
    this.$nextTick(() => {
      this.initPush_FatherPrevSfc();
    });
  },
};
</script>
<style lang='less' scoped>
.film-input-state_wrapperbox {
  margin-left: 10px;
}
</style>
