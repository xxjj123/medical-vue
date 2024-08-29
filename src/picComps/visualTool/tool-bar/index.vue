<template>
  <div class="vsk-tool-bar flex flex-col">
    <!-- 视窗调整 -->
    <div :class="getClassName">
      <div class="pic mr-[5px] hover:cursor-pointer" v-tooltip="{ title: '视窗调整', visible: true }"></div>
      <div class="h-[18px] flex items-center hover:cursor-pointer" @click="handle_openTzg('1')" v-popover:mypop1>
        <div :class="[
          'down_arrow  transform transition duration-300',
          { 'rotate-180': rotated && current === '1' },
        ]"></div>
      </div>
    </div>
    <!-- 窗宽窗位 -->
    <div :class="[
      'boxBtn ckcw_icon flex justify-start items-center',
      { on: ckcw_on },
    ]">
      <div @click="handle_iconbtn(`ckcw`)" class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: '窗宽窗位', visible: true }"></div>
      <div v-popover:mypop2 class="h-[18px] flex items-center hover:cursor-pointer" @click="handle_openTzg('2')">
        <div :class="[
          'down_arrow  transform transition duration-300',
          { 'rotate-180': rotated && current === '2' },
        ]"></div>
      </div>
    </div>

    <!-- 角标信息 -->
    <div :class="[
      'boxBtn jbinfo_icon flex justify-start items-center',
      {
        on: jbinfo_on,
      },
    ]">
      <div @click="handle_iconbtn(`jbinfo`)" class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: '角标信息', visible: true }"></div>
    </div>

    <!-- ai信息 -->
    <div :class="[
      'boxBtn ainfo_icon flex justify-start items-center',
      {
        on: aiInfo_on,
      },
    ]">
      <div @click="handle_iconbtn(`aiInfo`)" class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: 'Ai信息', visible: true }"></div>
    </div>

    <!-- 十字参考线 -->
    <div :class="[
      'boxBtn xline_icon flex justify-start items-center',
      {
        on: szckx_on,
      },
    ]">
      <div @click="handle_iconbtn(`szckx`)" class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: '十字参考线', visible: true }"></div>
    </div>

    <!-- 密度投影模式 -->
    <div :class="[
      `boxBtn mdty_icon flex justify-start items-center`,
      { on: mdtyms_on },
    ]">
      <div @click="handle_iconbtn(`mdtyms`)" class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: '密度投影模式', visible: true }"></div>
      <div v-popover:mypop3 class="h-[18px] flex items-center hover:cursor-pointer" @click="handle_openTzg('3')">
        <div :class="[
          'down_arrow  transform transition duration-300',
          { 'rotate-180': rotated && current === '3' },
        ]"></div>
      </div>
    </div>

    <!-- 平移模式 -->
    <div :class="[
      'boxBtn py_icon flex justify-start items-center',
      {
        on: pyms_on,
      },
    ]">
      <div @click="handle_iconbtn(`pyms`)" class="pic mr-[5px] hover:cursor-pointer"
        v-tooltip="{ title: '平移模式', visible: true }"></div>
    </div>

    <!-- ext -->

    <!-- -->
    <ta-popover ref="mypop1" @after-leave="afterLeaveEvents" :visible-arrow="true" :offset="1" :appendToBody="false"
      :placement="`right`" class="cus_poper sctz_pop">
      <div slot="content" class="boxBtn_extSelect">
        <div class="group_tools flex flex-col">
          <div v-for="(it, idx) in view_window.list" :key="idx" :class="[
            `h_row flex justify-start items-center ripple`,
            { on: view_window.current === idx },
          ]" @click="handle_view_window_row(idx)">
            <div :class="{ [`icon ${it.icon}`]: it.icon }"></div>
            <div class="txt">{{ it.name }}</div>
          </div>
        </div>
      </div>
    </ta-popover>

    <!-- 窗体宽位 pop  -->
    <ta-popover ref="mypop2" @after-leave="afterLeaveEvents" :visible-arrow="true" :offset="1" :appendToBody="false"
      :placement="`right`" class="cus_poper ctkw_pop">
      <div slot="content" class="boxBtn_extSelect">
        <div class="title">窗体宽位</div>
        <div class="rowWin flex items-center">
          <div class="name">窗宽</div>
          <div class="silder">
            <ta-slider :min="1" :max="4096" v-model="view_window.win_w" @change="view_window.winW.onChange"
              @afterChange="view_window.winW.onAfterChange" />
          </div>
          <div class="ipt">
            <ta-input-number :min="1" :max="4096" style="marginleft: 16px; width: 100px" amountPre="HU" :asAmount="true"
              :alignRight="true" :value="view_window.win_w" v-model="view_window.win_w" />
          </div>
        </div>
        <div class="rowWin flex items-center">
          <div class="name">窗位</div>
          <div class="silder">
            <ta-slider :min="-1024" :max="3071" v-model="view_window.win_holder" @change="view_window.winHold.onChange"
              @afterChange="view_window.winHold.onAfterChange" />
          </div>
          <div class="ipt">
            <ta-input-number :min="-1024" :max="3071" style="marginleft: 16px; width: 100px" amountPre="HU"
              :asAmount="true" :alignRight="true" :value="view_window.win_holder" v-model="view_window.win_holder" />
          </div>
        </div>
      </div>
    </ta-popover>

    <ta-popover ref="mypop3" @after-leave="afterLeaveEvents" :visible-arrow="true" :offset="1" :appendToBody="false"
      :placement="`right`" class="cus_poper mdtyms_pop">
      <div slot="content" class="boxBtn_extSelect">
        <div class="title">密度投影模式</div>
        <ta-radio-group @change="(e) => mdtyms_conf.onChange(e)" v-model="mdtyms_conf.value">
          <ta-radio :style="mdtyms_conf.radioStyle" :value="1">最大密度投影（MIP）</ta-radio>
          <ta-radio :style="mdtyms_conf.radioStyle" :value="2">最小密度投影（MinP）</ta-radio>
        </ta-radio-group>
        <div class="ceng_row flex justify-around items-center">
          <div>
            <span>层数</span><span>{{ mdtyms_conf.level }}</span><span>层</span>
          </div>
          <div class="silder">
            <ta-slider :min="mdtyms_conf.silder.min" :max="mdtyms_conf.silder.max" v-model="mdtyms_conf.silder.barValue"
              @change="mdtyms_conf.silder.change" @afterChange="mdtyms_conf.silder.afterChange" />
          </div>
          <div>
            <span>层厚</span><span>{{ mdtyms_conf.weight }}</span><span>{{ mdtyms_conf.unit }}</span>
          </div>
        </div>
      </div>
    </ta-popover>
  </div>
</template>
<script lang="javascript">
import {
  ButtonNames,
  toggleButtonState,
  suffix_name,
  LayoutIcons,
} from "./assets/js/buttonNameType";
import * as dicom from "@itk-wasm/dicom";
let btnStateGrp = {
  [`${ButtonNames.Ckcw}${suffix_name}`]: false,
  [`${ButtonNames.Mdtyms}${suffix_name}`]: false,
  [`${ButtonNames.Jbinfo}${suffix_name}`]: false,
  [`${ButtonNames.AiInfo}${suffix_name}`]: false,
  [`${ButtonNames.Szckx}${suffix_name}`]: false,
  [`${ButtonNames.Pyms}${suffix_name}`]: false,
};

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import TaUtils from "@yh/ta-utils";
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
    "view_window.win_w": {
      handler(nVal, oVal) {
        console.log(nVal)
        if (nVal) {
          this.UpdateColorWindow(nVal)
          this.SET_NODULE_DIAGNOSE_DATA({
            key: "colorWindow",
            value: nVal
          })
        }
      },
      immediate: true

    },
    "view_window.win_holder": {
      handler(nVal, oVal) {
        console.log(nVal)
        if (nVal) {
          this.UpdateColorLevel(nVal)
          this.SET_NODULE_DIAGNOSE_DATA({
            key: "colorLevel",
            value: nVal
          })
        }
      },
      immediate: true

    },

  },
  computed: {
    ...mapState("toolBarStore", ["slice_CT_pic_layout"]),
    ...mapState("viewInitStore", ["noduleDiagnoseState"]),
    // view-layout布局
    getClassName() {
      const classList = ["boxBtn flex justify-start items-center"];
      if (this.view_window?.curInput === LayoutIcons.LGGJST) {
        classList.push(`${LayoutIcons.LGGJST}_icon`);
      }
      if (this.view_window?.curInput === LayoutIcons.MPR) {
        classList.push(`${LayoutIcons.MPR}_icon`);
      }
      if (this.view_window?.curInput === LayoutIcons.YS) {
        classList.push(`${LayoutIcons.YS}_icon`);
      }
      return classList;
    },
  },
  created() {
    console.log("===this.ckcw_on==", this.ckcw_on, ButtonNames.Ckcw);
    console.log("dicomdicomdicomdicomdicomdicomdicom", dicom);

  },
  data() {
    return {
      mdtyms_conf: {
        onChange: (ev) => {
          console.log("onChange___mdtyms_conf", ev, this.mdtyms_conf);
          const { value } = this.mdtyms_conf;
          let mode = "max";
          if (value === 1) {
            mode = "min";
          } else if (value === 2) {
            mode = "max";
          }
          this.ChangeSlabMode(mode);
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
          change: (ev) => {
            console.log("ev---change:mdtyms_conf", ev);
          },
          afterChange: (ev) => {
            console.log("ev---afterchange:mdtyms_conf", ev);
          },
        },
      },
      ...btnStateGrp,
      // -----------
      rotated: false,
      current: null,
      mypop: "mypop1",
      view_window: {
        curInput: LayoutIcons.LGGJST,
        win_w: 1, //"1",
        win_holder: 1, //"1",
        winW: {
          onChange: (value) => {
            // console.log("onChange:", value);
            // this.$set(this.view_window, "win_w", value);
          },
          onAfterChange: (value) => {
            // this.UpdateColorWindow(value)
            // console.log("onChange1:", value, this.view_window);
            // this.$set(this.view_window, "win_w", value);
            // // 灰度
            // this.UpdateColorWindow_self({ ww: value });
            // this.$forceUpdate();
          },
        },
        winHold: {
          onChange: (value) => {
            // console.log("onChange:", value);
            // this.$set(this.view_window, "win_holder", value);
          },
          onAfterChange: (value) => {
            // // 亮度
            // console.log("onChange1:", value);
            // this.UpdateColorLevel(value)

            // this.$set(this.view_window, "win_holder", value);
            // this.UpdateColorLevel_self({ wl: value });
            // this.$forceUpdate();
          },
        },
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
  created() {
    this.$nextTick(() => {
      requestAnimationFrame(() => {
        this.view_window.win_w = 1500
        this.view_window.win_holder = -500
      })

    })

  },
  methods: {
    ...mapMutations("viewInitStore", ["SET_NODULE_DIAGNOSE_DATA"]),
    ...mapActions("viewInitStore", ["UpdateColorWindow", "UpdateColorLevel", "ChangePan"]),
    ...mapMutations("toolBarStore", ["SET_SLICE_CT_PIC_LAYOUT", "TOGGLE_BUTTON_STATE"]),
    ...mapActions("toolsStore", [
      "toggleUpdateCrossHair",
      "toggleUpdateStartPan",
      "ChangeSlabMode",
    ]),
    ...mapActions("viewsStore", [
      "UpdateColorWindow_self",
      "UpdateColorLevel_self",
    ]),
    handle_iconbtn(name) {
      // debugger;
      switch (name) {
        case ButtonNames.Ckcw:
          {
            this.TOGGLE_BUTTON_STATE(ButtonNames.Ckcw)
            toggleButtonState(ButtonNames.Ckcw, this);
            console.log("this[ButtonNames.Ckcw]____", ButtonNames.Ckcw, this[`${ButtonNames.Ckcw}_on`]);
          }
          break;
        case ButtonNames.Mdtyms:
          {
            this.TOGGLE_BUTTON_STATE(ButtonNames.Mdtyms)
            toggleButtonState(ButtonNames.Mdtyms, this);
            // 密度投影
            console.log();
          }
          break;
        // 其他按钮的逻辑...
        case ButtonNames.Jbinfo:
          {
            this.TOGGLE_BUTTON_STATE(ButtonNames.Jbinfo)
            toggleButtonState(ButtonNames.Jbinfo, this);
          }
          break;
        case ButtonNames.AiInfo:
          {
            this.TOGGLE_BUTTON_STATE(ButtonNames.AiInfo)
            toggleButtonState(ButtonNames.AiInfo, this);
          }
          break;
        case ButtonNames.Szckx:
          {
            this.TOGGLE_BUTTON_STATE(ButtonNames.Szckx)
            toggleButtonState(ButtonNames.Szckx, this);
            // 十字参考线
            this.toggleUpdateCrossHair(!!this.szckx_on);
            console.log("// 十字参考线=", !!this.szckx_on);
          }
          break;
        case ButtonNames.Pyms:
          {
            this.TOGGLE_BUTTON_STATE(ButtonNames.Pyms)
            toggleButtonState(ButtonNames.Pyms, this);
            this.ChangePan();
            // this.toggleUpdateStartPan(!!this.pyms_on);
            console.log("// 平移模式=", !!this.pyms_on);
          }
          break;
        default:
          break;
      }
    },
    handle_view_window_row(idx) {
      this.view_window.current = idx;
      const { current } = this.view_window;
      const row = this.view_window.list[current];
      this.view_window.curInput = row.icon;
      console.log("row.icon==", row.icon);

      this.SET_SLICE_CT_PIC_LAYOUT(row.icon);
    },
    handle_openTzg(curNo) {
      this.mypop = "mypop";
      this.rotated = !this.rotated;
      this.current = curNo;
    },
    afterLeaveEvents() {
      this.rotated = !this.rotated;
    },
    changeColor(ww, wl) {
      this.view_window.win_w = ww
      this.view_window.win_holder = wl

    }
  },
};
</script>
<style lang="less" scoped>
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

  >.pic {
    padding: 5px;
    border-radius: 5px;

    &:after {
      content: "";
      display: block;
      .base_icon_size();
      .func_bgCover();
    }
  }

  &.lggjst_icon {
    >.pic {
      &:after {
        .lggjst();
      }
    }
  }

  &.mpr_icon {
    >.pic {
      &:after {
        .mpr();
      }
    }
  }

  &.ys_icon {
    >.pic {
      &:after {
        .ys();
      }
    }
  }

  &.ckcw_icon {
    >.pic {
      &:after {
        background-image: url(./assets/img/fanse.png);
      }
    }
  }

  &.jbinfo_icon {
    >.pic {
      &:after {
        background-image: url(./assets/img/jiaobiao.png);
      }
    }
  }

  &.ainfo_icon {
    >.pic {
      &:after {
        background-image: url(./assets/img/ai-fenxi.png);
      }
    }
  }

  &.xline_icon {
    >.pic {
      &:after {
        background-image: url(./assets/img/ckx.png);
      }
    }
  }

  &.mdty_icon {
    >.pic {
      &:after {
        background-image: url(./assets/img/md-ty.png);
      }
    }
  }

  &.py_icon {
    >.pic {
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

.boxBtn_extSelect {}

/deep/.sctz_pop {
  >div {
    padding: 5px 10px;
  }
}

/* func-----------start-----------视窗切换按钮 */
.lggjst() {
  & {
    background-image: url(./assets/img/lgt-ts.png);
  }
}

.mpr() {
  & {
    background-image: url(./assets/img/3d-lgt.png);
  }
}

.ys() {
  & {
    background-image: url(./assets/img/targetPic.png);
  }
}

/* func-----------end-----------视窗切换按钮 */

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
        // background-image: url(./assets/img/lgt-ts.png);
        .lggjst();
      }

      &.mpr {
        // background-image: url(./assets/img/3d-lgt.png);
        .mpr();
      }

      &.ys {
        // background-image: url(./assets/img/targetPic.png);
        .ys();
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

  >div {
    &:first-child {
      width: 78px;
    }

    &:nth-child(2) {}

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
