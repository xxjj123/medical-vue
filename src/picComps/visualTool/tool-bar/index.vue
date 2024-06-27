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
    <div
      :class="[
        'boxBtn jbinfo_icon flex justify-start items-center',
        {
          on: jbinfo_on,
        },
      ]"
    >
      <div
        @click="handle_iconbtn(`jbinfo`)"
        class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: '角标信息', visible: true }"
      ></div>
    </div>

    <!-- ai信息 -->
    <div
      :class="[
        'boxBtn ainfo_icon flex justify-start items-center',
        {
          on: aiInfo_on,
        },
      ]"
    >
      <div
        @click="handle_iconbtn(`aiInfo`)"
        class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: 'Ai信息', visible: true }"
      ></div>
    </div>

    <!-- 十字参考线 -->
    <div
      :class="[
        'boxBtn xline_icon flex justify-start items-center',
        {
          on: szckx_on,
        },
      ]"
    >
      <div
        @click="handle_iconbtn(`szckx`)"
        class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: '十字参考线', visible: true }"
      ></div>
    </div>

    <!-- 密度投影模式 -->
    <div
      :class="[
        `boxBtn mdty_icon flex justify-start items-center`,
        { on: mdtyms_on },
      ]"
    >
      <div
        @click="handle_iconbtn(`mdtyms`)"
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
    <div
      :class="[
        'boxBtn py_icon flex justify-start items-center',
        {
          on: pyms_on,
        },
      ]"
    >
      <div
        @click="handle_iconbtn(`pyms`)"
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
      <div slot="content" class="boxBtn_extSelect">
        <div class="title">窗体宽位</div>
        <div class="rowWin flex items-center">
          <div class="name">窗宽</div>
          <div class="silder">
            <ta-slider :min="1" :max="4096" v-model="view_window.win_w" />
          </div>
          <div class="ipt">
            <ta-input-number
              :min="1"
              :max="4096"
              style="marginleft: 16px; width: 100px"
              amountPre="HU"
              :asAmount="true"
              :alignRight="true"
              v-model="view_window.win_w"
            />
          </div>
        </div>
        <div class="rowWin flex items-center">
          <div class="name">窗位</div>
          <div class="silder">
            <ta-slider :min="1" :max="3071" v-model="view_window.win_holder" />
          </div>
          <div class="ipt">
            <ta-input-number
              :min="1"
              :max="3071"
              style="marginleft: 16px; width: 100px"
              amountPre="HU"
              :asAmount="true"
              :alignRight="true"
              v-model="view_window.win_holder"
            />
          </div>
        </div>
      </div>
    </ta-popover>

    <ta-popover
      ref="mypop3"
      @after-leave="afterLeaveEvents"
      :visible-arrow="true"
      :offset="1"
      :appendToBody="false"
      :placement="`right`"
      class="cus_poper mdtyms_pop"
    >
      <div slot="content" class="boxBtn_extSelect">
        <div class="title">密度投影模式</div>
        <ta-radio-group
          @change="(e) => mdtyms_conf.onChange(e)"
          v-model="mdtyms_conf.value"
        >
          <ta-radio :style="mdtyms_conf.radioStyle" :value="1"
            >最大密度投影（MIP）</ta-radio
          >
          <ta-radio :style="mdtyms_conf.radioStyle" :value="2"
            >最小密度投影（MinP）</ta-radio
          >
        </ta-radio-group>
        <div class="ceng_row flex justify-around items-center">
          <div>
            <span>层数</span><span>{{ mdtyms_conf.level }}</span
            ><span>层</span>
          </div>
          <div class="silder">
            <ta-slider
              :min="mdtyms_conf.silder.min"
              :max="mdtyms_conf.silder.max"
              v-model="mdtyms_conf.silder.barValue"
            />
          </div>
          <div>
            <span>层厚</span><span>{{ mdtyms_conf.weight }}</span
            ><span>{{ mdtyms_conf.unit }}</span>
          </div>
        </div>
      </div>
    </ta-popover>
  </div>
</template>
<script lang='javascript'>
import {
  ButtonNames,
  toggleButtonState,
  suffix_name,
} from "./assets/js/buttonNameType";
let btnStateGrp = {
  [`${ButtonNames.Ckcw}${suffix_name}`]: false,
  [`${ButtonNames.Mdtyms}${suffix_name}`]: false,
  [`${ButtonNames.Jbinfo}${suffix_name}`]: false,
  [`${ButtonNames.AiInfo}${suffix_name}`]: false,
  [`${ButtonNames.Szckx}${suffix_name}`]: false,
  [`${ButtonNames.Pyms}${suffix_name}`]: false,
};
export default {
  name: "vsk-tool-bar",
  components: {},
  watch: {
    "mdtyms_conf.silder.barValue": {
      handler(nVal, oVal) {
        console.log("watch---mdtyms_conf.silder.barValue", nVal, oVal);
        console.log("Tautil----------", TaUtils);

        const { silder } = this.mdtyms_conf;
        const { barValue, multiplicand } = silder;
        if (!!nVal || nVal !== "") {
          const mValue = TaUtils.multiply(barValue, multiplicand);
          const weight_value = TaUtils.commafy(mValue, {
            digits: 1,
          });
          this.$set(this.mdtyms_conf, "weight", weight_value);

          const levelCF = TaUtils.divide(mValue, multiplicand);

          this.$set(this.mdtyms_conf, "level", levelCF);

          console.log("this.mdtyms_conf==", this.mdtyms_conf);
        }
      },
      immediate: true,
    },
  },
  created() {
    console.log("===this.ckcw_on==", this.ckcw_on, ButtonNames.Ckcw);
  },
  data() {
    return {
      mdtyms_conf: {
        onChange: (ev) => {
          console.log("onChange____", ev);
        },
        value: 1,
        radioStyle: {
          display: "block",
          height: "30px",
          lineHeight: "30px",
        },
        level: 2,
        weight: 2.5,
        unit: "mm",
        silder: {
          multiplicand: 1.25,
          min: 2,
          max: 128,
          barValue: 20,
        },
      },
      // ------------
      // ckcw_on: false,
      // mdtyms_on: false,
      ...btnStateGrp,
      // -----------
      rotated: false,
      current: null,
      mypop: "mypop1",
      view_window: {
        win_w: "1",
        win_holder: "1",
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
      // debugger;
      switch (name) {
        case ButtonNames.Ckcw:
          {
            toggleButtonState(ButtonNames.Ckcw, this);
          }
          break;
        case ButtonNames.Mdtyms:
          {
            toggleButtonState(ButtonNames.Mdtyms, this);
          }
          break;
        // 其他按钮的逻辑...
        case ButtonNames.Jbinfo:
          {
            toggleButtonState(ButtonNames.Jbinfo, this);
          }
          break;
        case ButtonNames.AiInfo:
          {
            toggleButtonState(ButtonNames.AiInfo, this);
          }
          break;
        case ButtonNames.Szckx:
          {
            toggleButtonState(ButtonNames.Szckx, this);
          }
          break;
        case ButtonNames.Pyms:
          {
            toggleButtonState(ButtonNames.Pyms, this);
          }
          break;
        default:
          break;
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

/deep/.ctkw_pop {
  .title {
    font-size: 16px;
  }
}

.rowWin {
  .name {
    margin-right: 10px;
  }
  .silder {
    width: 133px;
    margin-right: 5px;
  }
}

/deep/.mdtyms_pop {
  .title {
    font-size: 16px;
  }
}

.ceng_row {
  font-size: 15px;
  > div {
    &:first-child {
      width: 78px;
    }
    &:nth-child(2) {
    }
    &:nth-child(3) {
      width: 120px;
    }
  }
  span {
    margin-right: 2px;
  }
  .silder {
    width: 133px;
    margin-right: 5px;
  }
}
</style>
