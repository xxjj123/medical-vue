<template>
  <div class="film-input-state_wrapperbox flex justify-start items-center">
    <template v-if="optionNum">
      <ta-dropdown :trigger="['click']" class="flex justify-start items-center">
        <a href="javascript:;">
          {{ showValueData }}
          <ta-icon type="down" />
        </a>
        <ta-menu slot="overlay" @click="handleMenuClick">
          <ta-menu-item v-for="(item, index) in optionList" :key="`${index}_${item.value}`">{{ item.label
            }}</ta-menu-item>
        </ta-menu>
      </ta-dropdown>
    </template>
  </div>
</template>
<script lang="javascript">
import { selectOptions1, selectOptions2 } from "./assets/js/select-condition";
import Vue from "vue";
const instance = Vue.prototype;
const init_select = async (type) => {
  const selectValues = await instance.$api.select_codeTable_type_group(type);
  // console.log("selectValues_", selectValues);
  return selectValues;
};
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
        return val;
      },
    },
    optionList: {
      get() {
        if (this.optionNum === "1") {
          //所见
          return selectOptions1;
        } else if (this.optionNum == "2") {
          //诊断
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
    async init_api_selectOps() {
      if (this.optionNum === "1") {
        //所见
        const apiOPSData = await init_select("IMAGE_VIEW_SORT");
        // console.log("//所见", apiOPSData);
        const suojian = this.$ut.serializeDropdownList(apiOPSData);
        if (apiOPSData) {
          // console.log("suojian==", suojian);
          return suojian;
        } else {
          return selectOptions1;
        }
      } else if (this.optionNum == "2") {
        //诊断
        const apiOPSData = await init_select("TYPOLOGY_TYPE");
        // console.log("//诊断", apiOPSData);
        if (apiOPSData) {
          return apiOPSData;
        } else {
          return selectOptions2;
        }
      }
    },
    async update_optionList() {
      this.optionList = await this.init_api_selectOps();
    },
    handleMenuClick(ev) {
      // const ev = {
      //   item,
      //   index,
      // };
      const { key } = ev;
      const index = key.split("_")[0];
      const curRow = this.optionList[index];
      // console.log("curRow==", curRow);
      this.showValueData = curRow.label;
      // this.$set(this.$data, "showValue", curRow.label);
      this.$forceUpdate();
      // console.log("this.showValueData", this.showValueData);

      this.$emit("input", curRow);
      this.$emit("cb-click", curRow);
    },
    initPush_FatherPrevSfc() {
      const selectRow = this.optionList[this.selectCurIdx];
      this.$emit("input", selectRow);

      this.showValueData = this.showValue;

      // console.log("optionList==", this.optionList);
    },
  },
  created() {
    this.update_optionList();
    this.initPush_FatherPrevSfc();
    this.$nextTick(() => { });
  },
};
</script>
<style lang="less" scoped>
.film-input-state_wrapperbox {
  margin-left: 10px;
}
</style>
