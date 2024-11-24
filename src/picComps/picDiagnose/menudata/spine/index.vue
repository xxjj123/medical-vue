<template>
  <div class="vsk_menudata-bar h-full w-full flex flex-col">
    <!-- 面板顶部操作小按钮 start-->
    <div class="menuTopBox flex justify-between p-5">
      <div class="sub_title">--</div>
      <div class="sub_tool flex items-center">
        <div class="flex hover:cursor-pointer justify-start items-center">
          <div class="icon ico_shouchang flex items-center">
            <ta-icon v-if="menuTopTool.collect === true" :style="starOn_style" type="star" theme="filled" />
            <ta-icon v-else type="star" />
          </div>
          <div class="txt ml-2">收藏数据</div>
        </div>
        <div>
          <ta-divider type="vertical" class="mx-2" />
        </div>
        <div class="flex hover:cursor-pointer items-center">
          <div class="icon ico_reset flex items-center">
            <ta-icon type="undo" />
          </div>
          <div class="txt ml-2">重置结果</div>
        </div>
      </div>
    </div>

    <div class="wrappbox flex flex-col justify-between">
      <div class="content_main">
        <div class="angle">

          {{ boneInfo.angle }}
          <div class="mt-2  py-3 w-full">
            <div class="h-[30px] lh-[30px]">Cobb角：{{ boneInfo.angle?.pt.angles }}°</div>
            <div class="h-[30px] lh-[30px]">顶锥离中线距离：{{ boneInfo.dist }}</div>
            <div class="h-[30px] lh-[30px]">锁骨倾斜角：{{ boneInfo.horangle }}°</div>
          </div>
        </div>

        <!-- {{ boneInfo.keypnts }} -->
        {{ boneInfo.beginpnt1 }}
        {{ boneInfo.beginpnt2 }}
        {{ boneInfo.endpnt1 }}
        {{ boneInfo.endpnt2 }}


        <div class="analytic_semantic_description ">
          <textBoard :bookItems="findingItems.list" :title="findingItems.title">
          </textBoard>
        </div>

        <div class="analytic_semantic_description">
          <textBoard :bookItems="diagnosisItems.list" :title="diagnosisItems.title">
          </textBoard>
        </div>

      </div>
      <div class="btn_cxt">
        <div class="report_item_bar flex">
          <reportView />

        </div>
      </div>
    </div>




  </div>
</template>

<script lang="javascript">
import textBoard from "@/picComps/visualTool/menudata-bar/module/lung/common/textBoard/index.vue";
import reportView from "@/picComps/visualTool/menudata-bar/module/lung/common/reportView/index.vue"

export default {
  name: "menudata-bar",
  components: { textBoard, reportView },
  props: {
    boneInfo: Object,
  },
  computed: {

    findingItems: {
      get() {
        return {
          title: "影像所见",
          list: []
        }

      }
    },
    diagnosisItems: {
      get() {
        return {
          title: "影像诊断",
          list: []
        }

      }

    }
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
  methods: {},
};
</script>

<style lang="less" scoped>
.wrappbox {
  position: relative;
  height: 100%;
  padding: 0 20px;
  display: flex;
  overflow-y: auto;
  flex-direction: column;

  .content_main {
    flex: 1;
    /* 占据剩余高度 */

    .angle {
      height: 300px;
    }

    overflow-y: auto;
  }

  .btn_cxt {
    position: relative;
    /* 不再需要 absolute */
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;

    /* 修正错别的justify-items */
    .report_item_bar {
      width: 100%;
    }
  }
}
</style>
