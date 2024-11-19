import { overflow } from "html2canvas/dist/types/css/property-descriptors/overflow"

<template>
  <div class="AlgorithmTypeSelect_modal  ">
    <ta-big-table :size="tableConfig.size" highlight-hover-row :columns="tableConfig.tableColumns" :data="tableData"
      @checkbox-all="selectAllEvent" @checkbox-change="selectChangeEvent" :edit-config="{ trigger: 'click' }"
      @cell-click="handleCellClick">
      <template #mathType="{ row }">
        <div class="mathType_customer_block  ">
          <ta-row v-if="row.Modality == 'CT'">
            <ta-col>
              <ta-checkbox :indeterminate="CTmathSelectOb.indeterminate" @change="CTmathSelectOb.onCheckAllChange"
                :checked="CTmathSelectOb.checkAll">
                自动
              </ta-checkbox>
            </ta-col>
            <ta-col>
              <ta-checkbox-group :options="CTmathSelectOb.plainOptions" @change="CTmathSelectOb.onChange"
                :value="CTmathSelectOb.checkedList" />
            </ta-col>
          </ta-row>
          <ta-row v-if="row.Modality == 'CR'">
            <ta-col>
              <ta-checkbox :indeterminate="CRmathSelectOb.indeterminate" @change="CRmathSelectOb.onCheckedChange"
                :checked="CRmathSelectOb.checked">
                胸片
              </ta-checkbox>
            </ta-col>
          </ta-row>
        </div>
      </template>
    </ta-big-table>
  </div>
</template>
<script lang="javascript">
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
            field: "AccessionNumber",
            title: "检查号",
            width: "160",
          },
          {
            field: "Modality",
            title: "影像类型",
            width: "80",
          },
          {
            field: "PatientID",
            title: "患者ID",
            width: "90",
          },
          {
            field: "StudyInstanceUID",
            title: "序号ID",
            width: "200",
          },
          {
            field: "SeriesDescription",
            title: "序列描述",
            width: "200",
          },

          {
            field: "mathType",
            title: "算法类型",
            customRender: {
              default: "mathType",
            },
          },
        ],
      },
      CTmathSelectOb: {
        onCheckAllChange: (e) => {
          let isChecked = e.target.checked;

          if (isChecked) {
            //全选
            this.CTmathSelectOb.checkAll = true;
            this.CTmathSelectOb.checkedList = ["0", "1", "2", "3", "4"];
          } else {
            //反选
            this.CTmathSelectOb.checkAll = false;
            this.CTmathSelectOb.checkedList = [];
          }
          this.CTmathSelectOb.indeterminate = false;
        },
        onChange: (checkedList) => {
          //未全部选中的情况
          if (
            checkedList.length < this.CTmathSelectOb.plainOptions.length &&
            checkedList.length !== 0
          ) {
            //全选check设置为半选状态
            this.CTmathSelectOb.checkAll = false;
            this.CTmathSelectOb.indeterminate = true;
          } else if (checkedList.length === 0) {
            //一个都没选的情况
            //全选check设置为不选状态
            this.CTmathSelectOb.checkAll = false;
            this.CTmathSelectOb.indeterminate = false;
          } else {
            //全选全部选中的情况
            //全选check设置为选中状态
            this.CTmathSelectOb.checkAll = true;
            this.CTmathSelectOb.indeterminate = false;
          }
          this.CTmathSelectOb.checkedList = checkedList;
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
      CRmathSelectOb: {
        onCheckedChange: (e) => {
          let isChecked = e.target.checked;

          if (isChecked) {
            //全选
            this.CRmathSelectOb.checked = true;
          } else {
            //反选
            this.CRmathSelectOb.checked = false;
          }
        },
        indeterminate: false, //半选初始状态
        checked: true, //全选初始状态
      }
    };
  },
  created() {
    // console.log("itemData-----", this.itemData);
  },
  methods: {
    selectAllEvent() { },
    selectChangeEvent() { },
    handleCellClick() { },
  },
};
</script>
<style lang="less" scoped></style>
