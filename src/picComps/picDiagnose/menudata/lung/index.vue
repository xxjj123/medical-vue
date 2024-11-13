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
    <!-- 面板顶部操作小按钮 end-->
    <!-- <div class="border-2 border-blue-500 w-full h-full flex flex-col p-4"> -->
    <div class=" w-full h-full flex flex-col p-4">
      <div>
        <div class="txt">角度</div>
        <div class="mt-2 p-3 flex flex-wrap ">
          <div>Cobb角：25°</div>
          <div>顶锥离中线距离：15°</div>
          <div>锁骨倾斜角：5°</div>
        </div>
      </div>



      <!-- <div class="analytic_semantic_description">
        <anaSemanticDesBlock :des-code="'yxsj'" :bookItems.sync="anaSecDesConf.bookItems" :selection.sync="selection"
          :blockMode="anaSecDesConf.mode" :selectVal.sync="filmIpt_curItem" :title="anaSecDesConf.title"
          :current.sync="selectedNoduleId">
          <filmInputState slot="searchBar" v-model="filmIpt_curItem" :typec="`dropdown`" :selectCurIdx="`0`"
            :optionNum="`1`" @cb-click="handle_filmIptClick_yxsj"></filmInputState>
        </anaSemanticDesBlock>
      </div>

      <div class="analytic_semantic_description">
        <anaSemanticDesBlock :des-code="'yxzd'" :bookItems.sync="anaSecDesConf_1.bookItems"
          :selectVal="filmIpt_curItem_1" :blockMode="anaSecDesConf_1.mode" :title="anaSecDesConf_1.title"
          :selection.sync="selection">
          <filmInputState slot="searchBar" v-model="filmIpt_curItem_1" :typec="`dropdown`" :selectCurIdx="`0`"
            :optionNum="`2`" @cb-click="handle_filmIptClick_yxzd"></filmInputState>
        </anaSemanticDesBlock>
      </div> -->
    </div>
  </div>
</template>

<script lang="javascript">
import anaSemanticDesBlock from "@/picComps/visualTool/menudata-bar/module/lung/common/ana-semantic-des-block/index.vue";


export default {
  name: "menudata-bar",
  components: {},
  computed: {},
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
