<template>
  <div class="page_full">
    <div class="headerTop">
      <PacsPageHeader></PacsPageHeader>
    </div>
    <div style="height: 80px"></div>
    <div class="contentMain">
      <div class="headerBox">
        <ta-row type="flex" justify="space-between">
          <ta-col :span="20">
            <ta-form-model :layout="'inline'" :model="form">
              <ta-form-model-item label="检查时间">
                <ta-select
                  defaultValue="custom"
                  style="width: 120px"
                  @change="handleChange_jstime"
                  :options="options_querytime"
                  :options-key="optionsKey"
                />
              </ta-form-model-item>
              <ta-form-model-item>
                <div class="custom_pickerDeepBlue">
                  <ta-range-picker
                    @change="onChange"
                    :value="form.rangeDate"
                    :allow-one="true"
                    :getCalendarContainer="(trigger) => trigger.parentElement"
                  />
                </div>
              </ta-form-model-item>
              <ta-form-model-item label="患者信息">
                <ta-input-group compact>
                  <ta-select
                    defaultValue="jch"
                    @change="handleChange_hzinfo"
                    :options="options_patientInfo"
                    :options-key="optionsKey_patientInfo"
                  >
                  </ta-select>
                  <ta-input style="width: 100px" />
                </ta-input-group>
              </ta-form-model-item>
              <ta-form-model-item label="算法类型">
                <ta-select
                  defaultValue=""
                  style="width: 120px"
                  @change="handleChange_sdlx"
                  :options="options_suanfa"
                  :options-key="optionsKey_suafa"
                >
                </ta-select>
              </ta-form-model-item>
              <ta-form-model-item label="计算状态">
                <ta-select
                  defaultValue=""
                  style="width: 120px"
                  @change="handleChange_jszt"
                  :options="options_jszt"
                  :options-key="optionsKey_jszt"
                >
                </ta-select>
              </ta-form-model-item>
              <ta-form-model-item>
                <ta-button type="primary">查询</ta-button>
                <ta-button>重置</ta-button>
              </ta-form-model-item>
            </ta-form-model>
          </ta-col>
          <ta-col>
            <div class="btn_ctrl flex justify-start">
              <ta-button
                class="aghost__border-grey-1"
                type="solid"
                :ghost="true"
                ><i class="ico_star"></i><span>我的收藏</span></ta-button
              >
              <ta-button
                class="aghost__border-grey-1"
                type="solid"
                :ghost="true"
                @click="handle_openfiledraw"
                ><i class="ico_upd"></i><span>上传文件</span></ta-button
              >
            </div>
          </ta-col>
        </ta-row>
      </div>
      <div class="tableBox">
        <!-- <ta-big-table
          border
          ref="xTable"
          height="300"
          :data="tableData"
          :columns="tableColumns"
        > -->
        <ta-big-table
          ref="xTable"
          height="auto"
          auto-resize
          :data="tableData"
          highlight-hover-row
          border="inner"
        >
          <ta-big-table-column field="is-collect" title="#" width="60">
            <template #default="{ row, rowIndex }">
              <div
                class="hover:cursor-pointer"
                @click="handle_star(row, rowIndex)"
              >
                <ta-icon
                  v-if="row.collect === 1"
                  :style="starOn_style"
                  type="star"
                  theme="filled"
                />
                <ta-icon v-else type="star" />
              </div>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="qid" title="检查号">
          </ta-big-table-column>
          <ta-big-table-column field="hzId" title="患者ID">
          </ta-big-table-column>
          <ta-big-table-column field="hzName" title="患者姓名">
          </ta-big-table-column>
          <ta-big-table-column field="age" title="年龄"> </ta-big-table-column>
          <ta-big-table-column field="qcTime" title="检查时间">
          </ta-big-table-column>
          <ta-big-table-column field="qcRemark" title="检查描述">
          </ta-big-table-column>
          <ta-big-table-column field="seqNo" title="序列数">
          </ta-big-table-column>
          <ta-big-table-column field="mathType" title="算法类型">
          </ta-big-table-column>

          <ta-big-table-column
            fixed="right"
            field="operate"
            title="操作"
            width="320"
          >
            <template #default="{ row, rowIndex }">
              <ta-row type="flex" justify="space-around">
                <ta-col :span="18">
                  <a class="alink"> 查看结果 </a>
                  <ta-divider type="vertical" />
                  <a class="alink"> 重新分析 </a>
                  <ta-divider type="vertical" />
                  <a class="alink" @click="handle_star(row, rowIndex)">
                    <template v-if="row.collect === 1"> 取消收藏 </template>
                    <template v-else> 添加收藏 </template>
                  </a>
                </ta-col>
                <ta-col>
                  <ta-icon
                    type="close-circle"
                    :style="{ color: '#959b9b' }"
                    theme="filled"
                    class="hover:cursor-pointer"
                    @click="handle_delRow(row, rowIndex)"
                  />
                </ta-col>
              </ta-row>
            </template>
          </ta-big-table-column>

          <template slot="bottomBar">
            <!-- <ta-pagination
              ref="gridPager"
              style="text-align: right"
              :data-source.sync="tableData"
              :params="userPageParams"
            /> -->
            <ta-pagination
              style="text-align: right"
              sizeChangeInput
              showSizeChanger
              :pageSize.sync="pageSizeInput"
              @showSizeChange="onShowSizeChange"
              :defaultCurrent="3"
              :total="500"
            />
          </template>
        </ta-big-table>
      </div>
      <div class="analysis_result_listbox">
        <ta-big-table
          ref="xTable_anaRes"
          height="auto"
          highlight-hover-row
          auto-resize
          :data="tableData_anaRes"
          border="inner"
        >
          <ta-big-table-column field="is-collect" title="#" width="60">
            <template #default="{ row, rowIndex }">
              <div
                class="hover:cursor-pointer"
                @click="handle_star_subTable(row, rowIndex)"
              >
                <ta-icon
                  v-if="row.collect === 1"
                  :style="starOn_style"
                  type="star"
                  theme="filled"
                />
                <ta-icon v-else type="star" />
              </div>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="xid" title="序列号">
          </ta-big-table-column>
          <ta-big-table-column field="desc" title="序列描述">
          </ta-big-table-column>
          <ta-big-table-column field="picNo" title="图形数量">
          </ta-big-table-column>
          <ta-big-table-column field="mathType" title="算法类型">
          </ta-big-table-column>
          <ta-big-table-column field="compactState" title="计算状态">
            <template #default="{ row }">
              <ta-tag v-if="row.compactState === '1'" color="cyan"
                >计算成功</ta-tag
              >
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="ctrlState" title="操作状态">
            <template #default="{ row }">
              <ta-tag v-if="row.ctrlState === '1'" color="pink">超时</ta-tag>
            </template>
          </ta-big-table-column>
          <ta-big-table-column field="ctrlDoctor" title="操作医师">
          </ta-big-table-column>
        </ta-big-table>
      </div>
    </div>

    <ta-drawer
      :title="fileDraw.title"
      :headerHeight="fileDraw.headerHeight"
      placement="right"
      :width="fileDraw.width"
      :headerStyle="fileDraw.headerStyle"
      :bodyStyle="fileDraw.bodyStyle"
      :wrapStyle="fileDraw.wrapStyle"
      @close="fileDraw.onClose"
      :visible="fileDraw.visible"
    >
      <div class="custom_panel">
        <div class="custom_title pb-[20px]">上传数据</div>
        <div class="custom_context">
          <div
            class="upload_box flex flex-col items-center justify-center border border-dashed border-white pt-[50px] pb-[50px]"
          >
            <ta-button type="primary" icon="upload" class="mb-4"
              >上传数据</ta-button
            >
            <div class="mid_subTit flex">
              <div class="mr-[10px]">点击或拖入.dcm文件/文件夹到本区域</div>
              <div>文件大小最大5G,最多20个序列</div>
            </div>
          </div>
        </div>
      </div>
      <div class="custom_panel">
        <div class="custom_title pb-[20px] pt-[20px]">数据列表</div>
        <div class="custom_context highBox">
          <ta-big-table
            ref="xTable_upload_anaRes"
            height="auto"
            highlight-hover-row
            auto-resize
            :data="tableData_upload_anaRes"
            border="inner"
          >
            <ta-big-table-column field="xid" title="检查号">
            </ta-big-table-column>
            <ta-big-table-column field="hzid" title="患者ID">
            </ta-big-table-column>
            <ta-big-table-column field="xlid" title="序列ID">
            </ta-big-table-column>
            <ta-big-table-column field="xlms" title="序列描述">
            </ta-big-table-column>
            <ta-big-table-column field="scsj" title="上传时间">
            </ta-big-table-column>
            <ta-big-table-column field="state" title="状态">
              <template #default="{ row }">
                <ta-tag v-if="row.state === '1'" color="green">上传成功</ta-tag>
              </template>
            </ta-big-table-column>
            <ta-big-table-column field="mathtype" title="算法类型">
              <template #default="{ row }">
                <ta-tag v-if="row.mathtype === '1'" color="blue">自动</ta-tag>
              </template>
            </ta-big-table-column>
          </ta-big-table>
        </div>
      </div>
    </ta-drawer>
  </div>
</template>
<script lang='jsx'>
import PacsPageHeader from "@/components/pacs-page-header/index.vue";
import Vue from 'vue';
import {
  Icon
} from '@yh/ta404-ui';

export default {
  name: "manageDicom",
  components: {
    PacsPageHeader,
  },
  data() {
    const tableColumns = [
      {
        title:'#',
        field:'is-collect',
        width:50

      },
      {
        title:'检查号',
        field:'qid',
        customRender:{
          default:({row,},h)=>{
            console.log("row, h",row,h);
            console.log("-this.$createElement",this.$createElement);
            // return '-'
             return h('span', {}, `${row.qid}来了老弟`);
          }
        }

      }
    ];
    return {
      tableData_upload_anaRes:[
        {
          xid:"20210407000133",
          hzid:"16187278",
          xlid:"1.2.840.113619.2.289.3.168430441.447.1617294423.131.3",
          xlms:"1.25mm CHEST",
          scsj:"2024-06-14 11:52:02",
          state:"1",
          mathtype:"1",
        }
      ],
      fileDraw:{
        title:"dicom文件上传",
        headerHeight:"65px",
        visible:false,
        onClose:()=>{
          console.log("onClose");
          this.fileDraw.visible = false;
        },
        width:'100vw',
        headerStyle:{
          background:'#1F1F1F',
          color:'#fff'
        },
        bodyStyle:{
          background:'#1F1F1F',
          color:'#fff'
        },
        wrapStyle:{
          // width:'100vw'
        }
      },
      form: {
        fieldA: "",
        rangeDate: "",
      },
      optionsKey: {
        value: "value",
        label: "labName", // 默认值为'label'
        disabled: "disabled",
        key: "key",
      },
      options_querytime: [
        {
          labName: "今天",
          value: "today",
          key: "011",
        },
        {
          labName: "昨天",
          value: "yesterday",
          key: "012",
        },
        {
          labName: "三天内",
          value: "threedays",
          key: "013",
        },
        {
          labName: "一周内",
          value: "inweek",
          key: "014",
        },
        {
          labName: "自定义",
          value: "custom",
          key: "015",
        },
      ],
      optionsKey_patientInfo: {
        value: "value",
        label: "labName", // 默认值为'label'
        disabled: "disabled",
        key: "key",
      },
      options_patientInfo: [
        {
          labName: "检查号",
          value: "jch",
          key: "011",
        },
        {
          labName: "患者ID",
          value: "huanzheID",
          key: "012",
        },
        {
          labName: "患者姓名",
          value: "huanzheName",
          key: "013",
        },
      ],
      optionsKey_suafa: {
        value: "value",
        label: "labName", // 默认值为'label'
        disabled: "disabled",
        key: "key",
      },
      options_suanfa: [
        {
          labName: "全部",
          value: "",
          key: "all",
        },
        {
          labName: "冠脉CTA",
          value: "gm-cta",
          key: "011",
        },
        {
          labName: "门控钙化积分",
          value: "mk-ghjf",
          key: "012",
        },
        {
          labName: "头颈CTA",
          value: "tj-cta",
          key: "013",
        },
        {
          labName: "ICH",
          value: "ich",
          key: "014",
        },
        {
          labName: "胸肺CT",
          value: "xf-ct",
          key: "015",
        },
      ],
      optionsKey_jszt: {
        value: "value",
        label: "labName", // 默认值为'label'
        disabled: "disabled",
        key: "key",
      },
      options_jszt: [
        {
          labName: "全部",
          value: "",
          key: "all",
        },
        {
          labName: "计算成功",
          value: "jscg",
          key: "001",
        },
        {
          labName: "计算失败",
          value: "jssb",
          key: "002",
        },
        {
          labName: "计算中",
          value: "jsz",
          key: "003",
        },
        {
          labName: "等待计算",
          value: "ddjs",
          key: "004",
        },
        {
          labName: "计算取消",
          value: "jsqx",
          key: "005",
        },
      ],
      tableColumns,
      tableData: [],


      starOn_style:{
        color:`#F5A623`,
      },

      tableData_anaRes:[],
      pageSize: 20,
      current:4,
      pageSizeInput: 12,

    };
  },
  watch:{
      pageSize(val) {
          console.log('pageSize',val);
      },
      current(val) {
          console.log('current',val);
      }
  },
  methods: {
    onShowSizeChange(current, pageSize) {
                console.log(current, pageSize);
    },
    handle_openfiledraw(){
      this.fileDraw.visible = true;
    },
    handleChange_jstime(value) {
      console.log(`selected ${value}`);
    },
    handleChange_hzinfo(value) {
      console.log(`selected ${value}`);
    },
    handleChange_sdlx(value) {
      console.log(`selected ${value}`);
    },
    handleChange_jszt(value) {
      console.log(`selected ${value}`);
    },
    onChange(date, dateString) {
      console.log(date, dateString);
    },
    handle_star(row,rowIndex){
      // row.collect = 1;
      const { collect } = this.tableData[rowIndex];
      if(collect === 1){
        this.$set(this.tableData[rowIndex],"collect",0);
        this.$message.success('取消收藏成功');
      }else{
        this.$set(this.tableData[rowIndex],"collect",1);
        this.$message.success('收藏成功');
      }
      console.log("row",row,rowIndex);
      console.log("this.tableData[rowIndex]=",this.tableData[rowIndex]);
    },
    handle_delRow(row,rowIndex){
      console.log("this",this);
      this.$confirm({
        // icon:(<ta-icon type="info-circle" />),
        // icon:(<i>12312</i>),
        iconType:"info-circle",
        title: '确定删除该数据吗?',
        // 如果需要弹窗显示的仅为一个字符串文本，则可以直接传入字符串
        content: '确定要将骨折病变检出结果恢复至初始状态吗？',
        maskClosable:true,
        onOk:()=>{
            this.$delete(this.tableData,rowIndex);
            this.$message.success("删除成功");
        }

      })

    },
     handle_star_subTable(row,rowIndex){
      // row.collect = 1;
      const { collect } = this.tableData_anaRes[rowIndex];
      if(collect === 1){
        this.$set(this.tableData_anaRes[rowIndex],"collect",0);
        this.$message.success('取消收藏成功');
      }else{
        this.$set(this.tableData_anaRes[rowIndex],"collect",1);
        this.$message.success('收藏成功');
      }
      console.log("row",row,rowIndex);
      console.log("this.tableData[rowIndex]=",this.tableData_anaRes[rowIndex]);
    },
    userPageParams() {
      return {}
    },
  },
  created(){
    this.tableData =  [
       {
          qid: "DJ109090910212", //检查号
          hzId: "4123122111", //患者ID
          hzName: "李文豪", //患者姓名
          age: "62", //年龄
          qcTime: "2024.04.01 11:28", //检查时间
          qcRemark: "Chest", //检查描述
          seqNo: "01", //序列数
          mathType: "胸肺CT", //算法类型
        },
        {
          qid: "DJ109090910212", //检查号
          hzId: "4123122111", //患者ID
          hzName: "李文豪", //患者姓名
          age: "62", //年龄
          qcTime: "2024.04.01 11:28", //检查时间
          qcRemark: "Chest", //检查描述
          seqNo: "01", //序列数
          mathType: "胸肺CT", //算法类型
        },
        {
          qid: "DJ109090910212", //检查号
          hzId: "4123122111", //患者ID
          hzName: "李文豪", //患者姓名
          age: "62", //年龄
          qcTime: "2024.04.01 11:28", //检查时间
          qcRemark: "Chest", //检查描述
          seqNo: "01", //序列数
          mathType: "胸肺CT", //算法类型
        },
        {
          qid: "DJ109090910212", //检查号
          hzId: "4123122111", //患者ID
          hzName: "李文豪", //患者姓名
          age: "62", //年龄
          qcTime: "2024.04.01 11:28", //检查时间
          qcRemark: "Chest", //检查描述
          seqNo: "01", //序列数
          mathType: "胸肺CT", //算法类型
        },
        {
          qid: "DJ109090910212", //检查号
          hzId: "4123122111", //患者ID
          hzName: "李文豪", //患者姓名
          age: "62", //年龄
          qcTime: "2024.04.01 11:28", //检查时间
          qcRemark: "Chest", //检查描述
          seqNo: "01", //序列数
          mathType: "胸肺CT", //算法类型
        },
        {
          qid: "DJ109090910212", //检查号
          hzId: "4123122111", //患者ID
          hzName: "李文豪", //患者姓名
          age: "62", //年龄
          qcTime: "2024.04.01 11:28", //检查时间
          qcRemark: "Chest", //检查描述
          seqNo: "01", //序列数
          mathType: "胸肺CT", //算法类型
        },
    ];

    this.tableData_anaRes = [
      {
          xid: "4", //序列号
          desc: "1.25mm lung", //序列描述
          picNo: "209",  //图形数量
          mathType: "胸肺CT", //算法类型
          compactState:"1",//计算状态 1：计算成功 2：失算失败 3：计算取消
          ctrlState:"1",//操作状态 1：超时 2：撤回 3:待审核 4：通过
          ctrlDoctor:"华佗",
        },
         {
          xid: "5", //序列号
          desc: "1.25mm lung", //序列描述
          picNo: "209",  //图形数量
          mathType: "胸肺CT", //算法类型
          compactState:"1",//计算状态 1：计算成功 2：失算失败 3：计算取消
          ctrlState:"1",//操作状态 1：超时 2：撤回 3:待审核 4：通过
          ctrlDoctor:"华佗",
        },
         {
          xid: "6", //序列号
          desc: "1.25mm lung", //序列描述
          picNo: "209",  //图形数量
          mathType: "胸肺CT", //算法类型
          compactState:"1",//计算状态 1：计算成功 2：失算失败 3：计算取消
          ctrlState:"1",//操作状态 1：超时 2：撤回 3:待审核 4：通过
          ctrlDoctor:"华佗",
        },
    ]
  },
     mounted() {
      this.$refs.gridPager.loadData((data) => {})
    },
};
</script>
<style lang='less' scoped>
.func_bgCover() {
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: 0 0;
}

.page_full {
  width: 100%;
  height: 100vh;
  background-color: @theme_backBg;
  .headerTop {
    z-index: 2;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
  }
  .contentMain {
    background-color: @theme_backBg;
    height: calc(100% - 81px);
    min-width: 1080px;
  }
}

.btn_ctrl {
  .ico_star {
    width: 15px;
    height: 15px;
    .func_bgCover();
    background-image: url(@/assets/images/manage/btn/star.png);
  }
  .ico_upd {
    width: 15px;
    height: 15px;
    .func_bgCover();
    background-image: url(@/assets/images/manage/btn/upload.png);
  }
}

.headerBox {
  padding: 32px 48px 31px 41px;
  // max-height: 103px;
  // height: calc(100% - 183px);
  // height: 448px;
}

/* 默认样式，适用于1920*1080分辨率 */
.tableBox {
  min-height: calc(100% - 434px);
}

.analysis_result_listbox {
  min-height: 300px;
}

/* 当屏幕宽度小于1920px时应用的样式 */
@media only screen and (max-width: 1919px) {
  .tableBox {
    min-height: calc(100% - 400px); /* 适配稍小的屏幕，减少高度 */
  }
}

/* 当屏幕宽度小于1366px时应用的样式 */
@media only screen and (max-width: 1365px) {
  .tableBox {
    min-height: calc(100% - 390px); /* 进一步适配更小的屏幕 */
  }
  .analysis_result_listbox {
    min-height: 250px; /* 减小列表框的最小高度 */
  }
}

/* 特定于笔记本分辨率的样式 */
@media only screen and (min-width: 1367px) and (max-width: 1919px) {
  .tableBox {
    min-height: calc(100% - 395px); /* 适配笔记本屏幕 */
  }
  .analysis_result_listbox {
    min-height: 200px; /* 适配笔记本屏幕的列表框最小高度 */
  }
}

// .custom_pickerDeepBlue {
//   /deep/.ant-calendar-picker-container {
//     color: @primary-color !important;
//   }
// }

.tableBox,
.analysis_result_listbox {
  margin: 0 41px;
}

.highBox {
  height: calc(100vh - 500px);
}
</style>
