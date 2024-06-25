<template>
  <div class="vsk-tool-bar flex flex-col">
    <!-- 视窗调整 -->
    <div class="boxBtn tzg_icon flex justify-start items-center">
      <div
        class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: '视窗调整', visible: true }"
      ></div>
      <div
        class="h-[18px] flex items-center hover:cursor-pointer"
        @click="handle_openTzg('1')"
        v-popover:mypop1
      >
        <div
          :class="[
            'down_arrow  transform transition duration-300',
            { 'rotate-180': rotated && current === '1' },
          ]"
        ></div>
      </div>
    </div>
    <!-- 窗宽窗位 -->
    <div class="boxBtn ckcw_icon flex justify-start items-center">
      <div
        class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: '窗宽窗位', visible: true }"
      ></div>
      <div
        v-popover:mypop2
        class="h-[18px] flex items-center hover:cursor-pointer"
        @click="handle_openTzg('2')"
      >
        <div
          :class="[
            'down_arrow  transform transition duration-300',
            { 'rotate-180': rotated && current === '2' },
          ]"
        ></div>
      </div>
    </div>

    <!-- 角标信息 -->
    <div class="boxBtn jbinfo_icon flex justify-start items-center">
      <div
        class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: '角标信息', visible: true }"
      ></div>
    </div>

    <!-- ai信息 -->
    <div class="boxBtn ainfo_icon flex justify-start items-center">
      <div
        class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: 'Ai信息', visible: true }"
      ></div>
    </div>

    <!-- 十字参考线 -->
    <div class="boxBtn xline_icon flex justify-start items-center">
      <div
        class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: '十字参考线', visible: true }"
      ></div>
    </div>

    <!-- 密度投影模式 -->
    <div class="boxBtn mdty_icon flex justify-start items-center">
      <div
        class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: '密度投影模式', visible: true }"
      ></div>
      <div
        v-popover:mypop3
        class="h-[18px] flex items-center hover:cursor-pointer"
        @click="handle_openTzg('3')"
      >
        <div
          :class="[
            'down_arrow  transform transition duration-300',
            { 'rotate-180': rotated && current === '3' },
          ]"
        ></div>
      </div>
    </div>

    <!-- 平移模式 -->
    <div class="boxBtn py_icon flex justify-start items-center">
      <div
        class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: '平移模式', visible: true }"
      ></div>
    </div>

    <!-- ext -->

    <ta-popover
      ref="mypop1"
      @after-leave="afterLeaveEvents"
      :visible-arrow="true"
      :offset="1"
      :appendToBody="false"
      :placement="`right`"
      class="cus_poper"
    >
      <div slot="content" class="boxBtn_extSelect">1</div>
    </ta-popover>

    <ta-popover
      ref="mypop2"
      @after-leave="afterLeaveEvents"
      :visible-arrow="true"
      :offset="1"
      :appendToBody="false"
      :placement="`right`"
      class="cus_poper"
    >
      <div slot="content" class="boxBtn_extSelect">2</div>
    </ta-popover>

    <ta-popover
      ref="mypop3"
      @after-leave="afterLeaveEvents"
      :visible-arrow="true"
      :offset="1"
      :appendToBody="false"
      :placement="`right`"
      class="cus_poper"
    >
      <div slot="content" class="boxBtn_extSelect">3</div>
    </ta-popover>
  </div>
</template>
<script lang='javascript'>
export default {
  name: "vsk-tool-bar",
  components: {},
  data() {
    return {
      rotated: false,
      current: null,
      mypop: "mypop1",
    };
  },
  methods: {
    handle_openTzg(curNo) {
      this.mypop = "mypop";
      this.rotated = !this.rotated;
      this.current = curNo;
    },
    afterLeaveEvents() {
      this.rotated = !this.rotated;
    },
  },
};
</script>
<style lang='less' scoped>
.base_icon_size() {
  width: 18px;
  height: 18px;
}
.boxBtn {
  margin-bottom: 27px;
  > .pic {
    .base_icon_size();
    .func_bgCover();
  }
  &.tzg_icon {
    > .pic {
      background-image: url(./assets/img/3d-lgt.png);
    }
  }

  &.ckcw_icon {
    > .pic {
      background-image: url(./assets/img/fanse.png);
    }
  }

  &.jbinfo_icon {
    > .pic {
      background-image: url(./assets/img/jiaobiao.png);
    }
  }

  &.ainfo_icon {
    > .pic {
      background-image: url(./assets/img/ai-fenxi.png);
    }
  }

  &.xline_icon {
    > .pic {
      background-image: url(./assets/img/ckx.png);
    }
  }

  &.mdty_icon {
    > .pic {
      background-image: url(./assets/img/md-ty.png);
    }
  }

  &.py_icon {
    > .pic {
      background-image: url(./assets/img/pingyi-mod.png);
    }
  }

  .down_arrow {
    width: 6px;
    height: 4px;
    .func_bgCover();
    background-image: url(./assets/img/down-arrow.png);
  }
}

// body {
//   .cus_poper {
//     /deep/ .el-popover {
//       &.el-popper {
//         background-color: @input-bg;
//         border-color: @input-bg;
//         &[x-placement^="right"] {
//           .popper__arrow {
//             border-bottom-color: @input-bg !important;
//             border-right-color: @input-bg !important;
//           }
//         }

//         .popper__arrow {
//           &:after {
//             border-bottom-color: @input-bg !important;
//             border-right-color: @input-bg !important;
//           }
//         }
//       }
//     }
//   }
// }

.boxBtn_extSelect {
}
</style>
