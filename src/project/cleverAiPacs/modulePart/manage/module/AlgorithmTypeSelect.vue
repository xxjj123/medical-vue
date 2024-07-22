<template>
  <div class="AlgorithmTypeSelect_modal">
    <ta-big-table
      :size="tableConfig.size"
      highlight-hover-row
      height="200"
      :columns="tableConfig.tableColumns"
      :data="tableData"
      @checkbox-all="selectAllEvent"
      @checkbox-change="selectChangeEvent"
      :edit-config="{ trigger: 'click' }"
      @cell-click="handleCellClick"
    >
      <template #mathType="{}">
        <div class="mathType_customer_block">
          <ta-row>
            <ta-col>
              <ta-checkbox
                :indeterminate="mathSelectOb.indeterminate"
                @change="mathSelectOb.onCheckAllChange"
                :checked="mathSelectOb.checkAll"
              >
                自动
              </ta-checkbox>
            </ta-col>
            <ta-col>
              <ta-checkbox-group
                :options="mathSelectOb.plainOptions"
                @change="mathSelectOb.onChange"
                :value="mathSelectOb.checkedList"
              />
            </ta-col>
          </ta-row>
        </div>
      </template>
    </ta-big-table>
  </div>
</template>
<script lang='javascript'>
export default {
  name: "AlgorithmTypeSelect",
  props: {
    //表单数据
    itemData: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  computed: {
    tableData: {
      get() {
        return this.itemData;
      },
      set(val) {
        return val;
      },
    },
  },
  data() {
    return {
      tableConfig: {
        size: "small",
        // tableData: [
        //   {
        //     Accession_Number: "2021010203011",
        //     Patient_ID: "123123123",
        //     Study_Instance_UID: "1.2.3..3.1.123123123123",
        //     Series_Description: "1.25mm CHEST",
        //     mathType: "auto", //1:肺炎 2:肺结节 3:骨折 4：非门控钙化积分 （预设）
        //   },
        // ],
        tableColumns: [
          {
            field: "Accession_Number",
            title: "检查号",
            width: "168",
          },
          {
            field: "Patient_ID",
            title: "患者ID",
            width: "100",
          },
          {
            field: "Study_Instance_UID",
            title: "序号ID",
            width: "230",
          },
          {
            field: "Series_Description",
            title: "序列描述",
            width: "130",
          },
          {
            field: "mathType",
            title: "算法类型",
            // width: "260",
            customRender: {
              default: "mathType",
            },
          },
        ],
      },
      mathSelectOb: {
        onCheckAllChange: (e) => {
          let isChecked = e.target.checked;

          if (isChecked) {
            //全选
            this.mathSelectOb.checkAll = true;
            this.mathSelectOb.checkedList = ["0", "1", "2"];
          } else {
            //反选
            this.mathSelectOb.checkAll = false;
            this.mathSelectOb.checkedList = [];
          }
          this.mathSelectOb.indeterminate = false;
        },
        onChange: (checkedList) => {
          //未全部选中的情况
          if (
            checkedList.length < this.mathSelectOb.plainOptions.length &&
            checkedList.length !== 0
          ) {
            //全选check设置为半选状态
            this.mathSelectOb.checkAll = false;
            this.mathSelectOb.indeterminate = true;
          } else if (checkedList.length === 0) {
            //一个都没选的情况
            //全选check设置为不选状态
            this.mathSelectOb.checkAll = false;
            this.mathSelectOb.indeterminate = false;
          } else {
            //全选全部选中的情况
            //全选check设置为选中状态
            this.mathSelectOb.checkAll = true;
            this.mathSelectOb.indeterminate = false;
          }
          this.mathSelectOb.checkedList = checkedList;
        },

        indeterminate: false, //半选初始状态
        checkAll: true, //全选初始状态
        checkedList: ["1", "2", "3", "4"], //选中的数组
        plainOptions: [
          {
            label: "肺炎",
            value: "1",
          },
          {
            label: "肺结节",
            value: "2",
          },
          {
            label: "骨折",
            value: "3",
          },
          {
            label: "非门控钙化积分",
            value: "4",
          },
        ],
      },
    };
  },
  created() {
    console.log("itemData-----", this.itemData);
  },
  methods: {
    selectAllEvent() {},
    selectChangeEvent() {},
    handleCellClick() {},
  },
};
</script>
<style lang='less' scoped>
</style>
