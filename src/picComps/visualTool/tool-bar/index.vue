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
    <div
      :class="[
        'boxBtn ckcw_icon flex justify-start items-center',
        { on: ckcw_on },
      ]"
    >
      <div
        @click="handle_iconbtn(`ckcw`)"
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

    <!-- -->
    <ta-popover
      ref="mypop1"
      @after-leave="afterLeaveEvents"
      :visible-arrow="true"
      :offset="1"
      :appendToBody="false"
      :placement="`right`"
      class="cus_poper sctz_pop"
    >
      <div slot="content" class="boxBtn_extSelect">
        <div class="group_tools flex flex-col">
          <div
            v-for="(it, idx) in view_window.list"
            :key="idx"
            :class="[
              `h_row flex justify-start items-center ripple`,
              { on: view_window.current === idx },
            ]"
            @click="handle_view_window_row(idx)"
          >
            <div :class="{ [`icon ${it.icon}`]: it.icon }"></div>
            <div class="txt">{{ it.name }}</div>
          </div>
        </div>
      </div>
    </ta-popover>

    <!-- 窗体宽位 pop  -->
    <ta-popover
      ref="mypop2"
      @after-leave="afterLeaveEvents"
      :visible-arrow="true"
      :offset="1"
      :appendToBody="false"
      :placement="`right`"
      class="cus_poper ctkw_pop"
    >
      <div slot="content" class="boxBtn_extSelect"></div>
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
      // ------------
      ckcw_on: false,
      // -----------
      rotated: false,
      current: null,
      mypop: "mypop1",
      view_window: {
        current: 0,
        list: [
          {
            name: "肋骨高级视图",
            icon: "lggjst",
          },
          {
            name: "MPR",
            icon: "mpr",
          },
          {
            name: "原图",
            icon: "ys",
          },
        ],
      },
    };
  },
  methods: {
    handle_iconbtn(name) {
      if (name === "ckcw") {
        this.ckcw_on = !this.ckcw_on;
      }
    },
    handle_view_window_row(idx) {
      this.view_window.current = idx;
    },
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
  &.on {
    .pic {
      .background-opacity(@primary-color, 0.5);
    }
  }
  > .pic {
    padding: 5px;
    border-radius: 5px;
    &:after {
      content: "";
      display: block;
      .base_icon_size();
      .func_bgCover();
    }
  }
  &.tzg_icon {
    > .pic {
      &:after {
        background-image: url(./assets/img/3d-lgt.png);
      }
    }
  }

  &.ckcw_icon {
    > .pic {
      &:after {
        background-image: url(./assets/img/fanse.png);
      }
    }
  }

  &.jbinfo_icon {
    > .pic {
      &:after {
        background-image: url(./assets/img/jiaobiao.png);
      }
    }
  }

  &.ainfo_icon {
    > .pic {
      &:after {
        background-image: url(./assets/img/ai-fenxi.png);
      }
    }
  }

  &.xline_icon {
    > .pic {
      &:after {
        background-image: url(./assets/img/ckx.png);
      }
    }
  }

  &.mdty_icon {
    > .pic {
      &:after {
        background-image: url(./assets/img/md-ty.png);
      }
    }
  }

  &.py_icon {
    > .pic {
      &:after {
        background-image: url(./assets/img/pingyi-mod.png);
      }
    }
  }

  .down_arrow {
    width: 6px;
    height: 4px;
    .func_bgCover();
    background-image: url(./assets/img/down-arrow.png);
  }
}

.boxBtn_extSelect {
}
/deep/.sctz_pop {
  > div {
    padding: 5px 10px;
  }
}
.group_tools {
  .h_row {
    padding: 4px 5px;
    cursor: pointer;
    &.on {
      .background-opacity(@primary-color, 0.5);
      border-radius: 2px;
    }
    .icon {
      .func_bgCover();
      margin-right: 10px;
      width: 15px;
      height: 14px;
      &.lggjst {
        background-image: url(./assets/img/lgt-ts.png);
      }
      &.mpr {
        background-image: url(./assets/img/3d-lgt.png);
      }
      &.ys {
        background-image: url(./assets/img/targetPic.png);
      }
    }

    .txt {
      font-size: 14px;
    }
  }
}
</style>
