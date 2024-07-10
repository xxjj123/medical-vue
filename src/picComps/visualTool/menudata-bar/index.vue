<template>
  <div class="vsk_menudata-bar">
    <!-- 面板顶部操作小按钮 start-->
    <div class="menuTopBox flex justify-between">
      <div class="sub_title">--</div>
      <div class="sub_tool flex items-center">
        <div
          @click="handle_shouchang"
          class="flex hover:cursor-pointer justify-start items-center"
        >
          <div class="icon ico_shouchang flex items-center">
            <ta-icon
              v-if="menuTopTool.collect === true"
              :style="starOn_style"
              type="star"
              theme="filled"
            />
            <ta-icon v-else type="star" />
          </div>
          <div class="txt">收藏数据</div>
        </div>
        <div>
          <ta-divider type="vertical" class="cus_fgx" />
        </div>
        <div class="flex hover:cursor-pointer">
          <div class="icon ico_reset flex items-center">
            <ta-icon type="undo" />
          </div>
          <div class="txt">重置结果</div>
        </div>
      </div>
    </div>
    <!-- 面板顶部操作小按钮 end-->

    <ta-tabs defaultActiveKey="1" @change="callback">
      <ta-tab-pane tab="结节" key="1">
        <!-- Content of Tab Pane 1 -->
        <noduleResult v-model="menuResult"></noduleResult>
      </ta-tab-pane>
      <ta-tab-pane tab="肺炎" key="2">
        <!-- Content of Tab Pane 2 -->
        <pneumonia-result v-model="menuResult"></pneumonia-result>
      </ta-tab-pane>
      <ta-tab-pane tab="骨折" key="3">
        <!-- Content of Tab Pane 3 -->
        <fracture-result v-model="menuResult"></fracture-result>
      </ta-tab-pane>
      <ta-tab-pane tab="钙化积分" key="4">
        <!-- Content of Tab Pane 4 -->
        <calcium-score-result v-model="menuResult"></calcium-score-result>
      </ta-tab-pane>
    </ta-tabs>
  </div>
</template>
<script lang='javascript'>
import noduleResult from "@/picComps/visualTool/menudata-bar/module/lung/nodule-result/index.vue";
import pneumoniaResult from "@/picComps/visualTool/menudata-bar/module/lung/pneumonia-result/index.vue";
import fractureResult from "@/picComps/visualTool/menudata-bar/module/lung/fracture-result/index.vue";
import calciumScoreResult from "@/picComps/visualTool/menudata-bar/module/lung/calcium-score-result/index.vue";
export default {
  name: "menudata-bar",
  components: {
    noduleResult,
    pneumoniaResult,
    fractureResult,
    calciumScoreResult,
  },
  props: {
    value: Object,
  },
  computed: {
    menuResult: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
        return val;
      },
    },
  },
  data() {
    return {
      menuTopTool: {
        collect: false,
      },
      starOn_style: {
        color: `rgb(245, 166, 35)`,
      },
    };
  },
  methods: {
    callback(key) {
      console.log(key);
    },
    handle_shouchang() {
      this.menuTopTool.collect = !this.menuTopTool.collect;
      this.$emit("cb-sc", this.menuTopTool.collect);
    },
  },
};
</script>
<style lang='less' scoped>
.menuTopBox {
  padding: 20px;

  /deep/ .cus_fgx {
    background: #979797 !important;
  }
}
.sub_tool {
}
</style>
