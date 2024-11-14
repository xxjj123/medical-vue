<template>
  <div class="vsk_menudata-bar">
    <!-- 面板顶部操作小按钮 start-->
    <div class="menuTopBox flex justify-between">
      <div class="sub_title">--</div>
      <div class="sub_tool flex items-center">
        <div @click="handle_collect" class="flex hover:cursor-pointer justify-start items-center">
          <div class="icon ico_shouchang flex items-center">
            <ta-icon v-if="menuTopTool.collect === true" :style="starOn_style" type="star" theme="filled" />
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

    <ta-tabs :defaultActiveKey="defaultActiveKey" :tabBarGutter="25" @change="tab_callback">
      <ta-tab-pane :key="item.key" v-for="item in tabItems">
        <div slot="tab">
          <span :style="{ color: item.hasLesion ? 'rgb(24, 151, 151)' : 'grey' }">●</span>
          <span> {{ item.title }}
          </span>
        </div>
        <component :is="item.component" />
      </ta-tab-pane>

    </ta-tabs>
  </div>
</template>
<script lang="javascript">
import noduleResult from "@/picComps/visualTool/menudata-bar/module/lung/nodule-result/index.vue";
import pneumoniaResult from "@/picComps/visualTool/menudata-bar/module/lung/pneumonia-result/index.vue";
import fractureResult from "@/picComps/visualTool/menudata-bar/module/lung/fracture-result/index.vue";
import calciumScoreResult from "@/picComps/visualTool/menudata-bar/module/lung/calcium-score-result/index.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "menudata-bar",
  components: {
    noduleResult,
    pneumoniaResult,
    fractureResult,
    calciumScoreResult,
  },

  data() {
    return {
      defaultActiveKey: "1",
      activeKey: "",
      menuTopTool: {
        collect: false,
      },
      starOn_style: {
        color: `rgb(245, 166, 35)`,
      },
    };
  },
  computed: {
    ...mapState("noduleInfoStore", ["noduleInfo"]),
    ...mapState("pneumoniaInfoStore", ["pneumoniaInfo"]),
    ...mapState("fracInfoStore", ["fracInfo"]),

    tabItems: {
      get() {
        return [
          {
            title: "结节",
            key: "nodule",
            hasLesion: this.noduleInfo.hasLesion,
            component: noduleResult,
          },
          {
            title: "肺炎",
            key: "pneumonia",
            hasLesion: this.pneumoniaInfo.hasLesion,
            component: pneumoniaResult,
          },
          {
            title: "骨折",
            key: "frac",
            hasLesion: this.fracInfo.hasLesion,
            component: fractureResult,
          },
          {
            title: "钙化结节",
            key: "calcium",
            hasLesion: false,
            component: calciumScoreResult,
          },
        ]
      }
    }
  },
  methods: {
    ...mapActions("noduleInfoStore", ["ActiveNoduleState"]),
    ...mapActions("pneumoniaInfoStore", ["ActivePneumoniaState"]),
    ...mapActions("fracInfoStore", ["ActiveFracState"]),

    tab_callback(key) {
      console.log(key);
      if (key == "nodule") {
        this.ActiveNoduleState()
      } else if (key == "pneumonia") {
        this.ActivePneumoniaState()
      } else if (key = "calcium") {
        this.ActiveFracState()

      }
      this.activeKey = key;

    },
    handle_collect() {
      this.menuTopTool.collect = !this.menuTopTool.collect;
      this.$emit("cb-sc", this.menuTopTool.collect);
    },
  },
};
</script>
<style lang="less" scoped>
.menuTopBox {
  padding: 20px;

  /deep/ .cus_fgx {
    background: #979797 !important;
  }
}

.sub_tool {}
</style>
