<template>
  <div class="   flex flex-row first:ml-25">

    <!-- <ta-button @click="UpdateWindowCenter">改窗宽</ta-button> -->
    <ta-button @click="activeNodule">结节</ta-button>
    <ta-button @click="activeFrac">骨折</ta-button>
    <ta-button @click="activePenu">肺炎</ta-button>


    <ta-button @click="getAnnotation">读取注释</ta-button>




    <ta-tooltip placement="bottomLeft">
      <template slot="title">
        <span>视窗调整</span>
      </template>
      <div v-if="btnShowStates.Layout_show" :class="layOutClass">
        <div class="pic mr-[5px] hover:cursor-pointer"></div>
        <div class="h-[18px] flex items-center hover:cursor-pointer" @click="handle_openTzg('1')" v-popover:mypop1>
          <div :class="[
            'down_arrow  transform transition duration-300',
            { 'rotate-180': rotated && current === '1' },
          ]"></div>
        </div>
        <ta-popover ref="mypop1" @after-leave="afterLeaveEvents" :visible-arrow="true" :offset="2" :appendToBody="true"
          :placement="`top`" class="cus_poper sctz_pop">
          <div slot="content" class="boxBtn_extSelect">
            <div class="group_tools flex flex-col">
              <div v-for="(it, idx) in view_window.list" :key="idx" :class="[
                `h_row    flex justify-start items-center ripple`,
                { on: it.icon == allViewData.layOut },
              ]" @click="handle_view_window_row(idx)">
                <div :class="{ [`icon ${it.icon}`]: it.icon }"></div>
                <div class="txt">{{ it.name }}</div>
              </div>
            </div>
          </div>
        </ta-popover>

      </div>
    </ta-tooltip>



    <ta-tooltip placement="bottomLeft">
      <template slot="title">
        <span>窗宽窗位</span>
      </template>
      <div v-if="btnShowStates.ckcw_show" :class="[
        'boxBtn ckcw_icon flex justify-start items-center',
        { on: btnActiveStates.ckcw_on },
      ]">
        <div @click="handle_iconbtn(`ckcw`)" class="pic mr-[5px] hover:cursor-pointer"></div>
        <div v-popover:mypop2 class="h-[18px] flex items-center hover:cursor-pointer" @click="handle_openTzg('2')">
          <div :class="[
            'down_arrow  transform transition duration-300',
            { 'rotate-180': rotated && current === '2' },
          ]"></div>
        </div>
        <!-- 窗体宽位 pop  -->
        <ta-popover ref="mypop2" @after-leave="afterLeaveEvents" :visible-arrow="true" :offset="2" :appendToBody="true"
          :placement="`top`" class="cus_poper ctkw_pop">
          <div slot="content" class="boxBtn_extSelect">
            <div class="title">窗体宽位</div>
            <div class="rowWin flex items-center">
              <div class="name">窗宽</div>
              <div class="silder">
                <ta-slider :min="view_window.win_w_min" :max="view_window.win_w_max" :value="view_window.win_w"
                  v-model="view_window.win_w" @change="view_window.winW.onSliderChange" />
              </div>
              <div class="ipt">
                <ta-input-number :min="view_window.win_w_min" :max="view_window.win_w_max"
                  style="marginleft: 16px; width: 100px" amountPre="HU" :asAmount="true" :alignRight="true"
                  :value="computedWinW" v-model="computedWinW" @change="view_window.winW.onNumberChange" />
              </div>
            </div>

            <div class="rowWin flex items-center">
              <div class="name">窗位</div>
              <div class="silder">
                <ta-slider :min="view_window.win_holder_min" :max="view_window.win_holder_max"
                  :value="view_window.win_holder" v-model="view_window.win_holder"
                  @change="view_window.winHold.onSliderChange" />
              </div>
              <div class="ipt">
                <ta-input-number :min="view_window.win_holder_min" :max="view_window.win_holder_max"
                  style="marginleft: 16px; width: 100px" amountPre="HU" :asAmount="true" :alignRight="true"
                  :value="computedWinHolder" v-model="computedWinHolder" @change="view_window.winHold.onNumberChange" />
              </div>
            </div>
          </div>
        </ta-popover>
      </div>
    </ta-tooltip>





    <ta-tooltip placement="bottomLeft">
      <template slot="title">
        <span>角标信息</span>
      </template>
      <div v-if="btnShowStates.jbinfo_show" :class="[
        'boxBtn jbinfo_icon flex justify-start items-center',
        {
          on: btnActiveStates.jbinfo_on,
        },
      ]">
        <div @click="handle_iconbtn(`jbinfo`)" class="pic mr-[5px] hover:cursor-pointer"></div>
      </div>
    </ta-tooltip>



    <ta-tooltip placement="bottomLeft">
      <template slot="title">
        <span>Ai信息</span>
      </template>
      <div v-if="btnShowStates.aiInfo_show" :class="[
        'boxBtn ainfo_icon flex justify-start items-center',
        {
          on: btnActiveStates.aiInfo_on,
        },
      ]">
        <div @click="handle_iconbtn(`aiInfo`)" class="pic mr-[5px] hover:cursor-pointer"
          v-tooltip="{ title: 'Ai信息', visible: true }"></div>
      </div>
    </ta-tooltip>




    <ta-tooltip placement="bottomLeft">
      <template slot="title">
        <span>十字参考线</span>
      </template>
      <div v-if="btnShowStates.szckx_show" :class="[
        'boxBtn xline_icon flex justify-start items-center',
        {
          on: btnActiveStates.szckx_on,
        },
      ]">
        <div @click="handle_iconbtn(`szckx`)" class="pic mr-[5px] hover:cursor-pointer"></div>
      </div>
    </ta-tooltip>


    <ta-tooltip placement="bottomLeft">
      <template slot="title">
        <span>密度投影模式</span>
      </template>
      <div v-if="btnShowStates.mjtyms_show" :class="[
        `boxBtn mdty_icon flex justify-start items-center`,
        { on: btnActiveStates.mjtyms_on },
      ]">
        <div @click="handle_iconbtn(`mjtyms`)" class="pic mr-[5px] hover:cursor-pointer"></div>
        <div v-popover:mypop3 class="h-[18px] flex items-center hover:cursor-pointer" @click="handle_openTzg('3')">
          <div :class="[
            'down_arrow  transform transition duration-300',
            { 'rotate-180': rotated && current === '3' },
          ]"></div>
        </div>
      </div>
    </ta-tooltip>



    <ta-tooltip placement="bottomLeft">
      <template slot="title">
        <span>平移模式</span>
      </template>
      <div v-if="btnShowStates.pyms_show" :class="[
        'boxBtn py_icon flex justify-start items-center',
        {
          on: btnActiveStates.pyms_on,
        },
      ]">
        <div @click="handle_iconbtn(`pyms`)" class="pic mr-[5px] hover:cursor-pointer"></div>
      </div>
    </ta-tooltip>
    <ta-tooltip placement="bottomLeft">
      <template slot="title">
        <span>放缩模式</span>
      </template>
      <div v-if="btnShowStates.zoom_show" :class="[
        'boxBtn zoom_icon flex justify-start items-center',
        {
          on: btnActiveStates.zoom_on,
        },
      ]">
        <div @click="handle_iconbtn(`zoom`)" class="pic mr-[5px] hover:cursor-pointer"></div>
      </div>
    </ta-tooltip>

    <ta-tooltip placement="bottomLeft">
      <template slot="title">
        <span>图像反相</span>
      </template>
      <div v-if="btnShowStates.invert_show" :class="[
        'boxBtn invert_icon flex justify-start items-center',
        {
          on: btnActiveStates.invert_on,
        },
      ]">
        <div @click="handle_iconbtn(`invert`)" class="pic mr-[5px] hover:cursor-pointer"></div>
      </div>
    </ta-tooltip>

    <ta-tooltip placement="bottomLeft">
      <template slot="title">
        <span>重置</span>
      </template>
      <div v-if="btnShowStates.reset_show" :class="[
        'boxBtn reset_icon flex justify-start items-center',
        {
          on: false,
        },
      ]">
        <div @click="handle_iconbtn(`reset`)" class="pic mr-[5px] hover:cursor-pointer"></div>
      </div>
    </ta-tooltip>



    <ta-tooltip placement="bottomLeft">
      <template slot="title">
        <span>靶重建</span>
      </template>
      <div v-if="btnShowStates.bcj_show" :class="[
        'boxBtn xline_icon flex justify-start items-center',
        {
          on: btnActiveStates.bcj_on,
        },
      ]">
        <div @click="handle_iconbtn(`bcj`)" class="pic mr-[5px] hover:cursor-pointer"></div>
      </div>
    </ta-tooltip>

    <ta-popover ref="mypop3" @after-leave="afterLeaveEvents" :visible-arrow="true" :offset="1" :appendToBody="false"
      :placement="`right`" class="cus_poper mjtyms_pop">
      <div slot="content" class="boxBtn_extSelect">
        <div class="title">密度投影模式</div>
        <ta-radio-group @change="(e) => mjtyms_conf.onChange(e)" v-model="mjtyms_conf.value">
          <ta-radio :style="mjtyms_conf.radioStyle" :value="1">最大密度投影（MIP）</ta-radio>
          <ta-radio :style="mjtyms_conf.radioStyle" :value="2">最小密度投影（MinP）</ta-radio>
        </ta-radio-group>
        <div class="ceng_row flex justify-around items-center">
          <div>
            <span>层数</span><span>{{ mjtyms_conf.level }}</span><span>层</span>
          </div>
          <div class="silder">
            <ta-slider :min="mjtyms_conf.silder.min" :max="mjtyms_conf.silder.max" v-model="mjtyms_conf.silder.barValue"
              @change="mjtyms_conf.silder.change" @afterChange="mjtyms_conf.silder.afterChange" />
          </div>
          <div>
            <span>层厚</span><span>{{ mjtyms_conf.weight }}</span><span>{{ mjtyms_conf.unit }}</span>
          </div>
        </div>
      </div>
    </ta-popover>
  </div>
</template>
<script lang="javascript">
import {
  ButtonNames,
  suffix_name,
  suffix_show,
  LayoutIcons,
} from "./assets/js/buttonNameType";

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import TaUtils from "@yh/ta-utils";
export default {
  name: "vsk-tool-bar",
  components: {},

  watch: {
    "mjtyms_conf.silder.barValue": {
      handler(nVal, oVal) {
        console.log("watch---mjtyms_conf.silder.barValue", nVal, oVal);
        console.log("Tautil----------", TaUtils);

        const { silder } = this.mjtyms_conf;
        const { barValue, multiplicand } = silder;
        if (!!nVal || nVal !== "") {
          const mValue = TaUtils.multiply(barValue, multiplicand);
          const weight_value = TaUtils.commafy(mValue, {
            digits: 1,
          });
          this.$set(this.mjtyms_conf, "weight", weight_value);

          const levelCF = TaUtils.divide(mValue, multiplicand);

          this.$set(this.mjtyms_conf, "level", levelCF);

        }
      },
      immediate: true,
    },
    "allViewData.colorWindow": {
      handler(nVal, oVal) {
        if (nVal) {
          this.view_window.win_w = nVal
        }

      },
      immediate: true

    },
    "allViewData.colorLevel": {
      handler(nVal, oVal) {
        if (nVal) {
          this.view_window.win_holder = nVal

        }
      },
      immediate: true

    },



  },
  computed: {
    // ...mapState("mprViewStore", ["allViewData"]),
    // ...mapState("spineViewStore", ["allViewData"]),
    ...mapGetters("toolBarStore", ["allViewData"]),

    ...mapState("toolBarStore", ["slice_CT_pic_layout"]),
    ...mapGetters("toolBarStore", ["getAllButtonActiveStates", "getAllButtonShowStates"]),

    btnActiveStates() {
      return this.getAllButtonActiveStates
    },
    btnShowStates() {
      return this.getAllButtonShowStates
    },
    // view-layout布局
    layOutClass() {
      const classList = ["boxBtn flex justify-start items-center"];
      classList.push(`${this.allViewData.layOut}_icon`);

      return classList;
    },

    colorWindow() {
      return this.allViewData.colorWindow
    },
    colorLevel() {
      return this.allViewData.colorLevel
    },
    computedWinW: {
      get() {
        return this.view_window.win_w;
      },
      set(value) {
        // 在这里检查值是否有效并且不是空
        if (!isNaN(value) && value !== '') {
          this.view_window.win_w = value;
        }
      }
    },
    computedWinHolder: {
      get() {
        return this.view_window.win_holder;
      },
      set(value) {
        // 在这里检查值是否有效并且不是空
        if (!isNaN(value) && value !== '') {
          this.view_window.win_holder = value;
        }
      }
    }


  },

  data() {
    return {
      mjtyms_conf: {
        onChange: (ev) => {
          console.log("onChange___mjtyms_conf", ev, this.mjtyms_conf);
          const { value } = this.mjtyms_conf;
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
            console.log("ev---change:mjtyms_conf", ev);
          },
          afterChange: (ev) => {
            console.log("ev---afterchange:mjtyms_conf", ev);
          },
        },
      },
      // -----------
      rotated: false,
      current: 1,
      mypop: "mypop1",
      view_window: {
        curInput: LayoutIcons.LGGJST,
        win_w: 1, //"1",
        win_w_min: 1,
        win_w_max: 4096,

        win_holder: 1, //"1",
        win_holder_min: -1024,
        win_holder_max: 3071,
        winW: {
          onSliderChange: (value) => {
            this.UpdateColorWindow(value)
          },
          onNumberChange: (e) => {
            const { win_w, win_w_min, win_w_max } = this.view_window
            if (typeof win_w === 'number') {
              if (win_w < win_w_max && win_w > win_w_min) {
                this.UpdateColorWindow(win_w)
              }
            }

          },
        },
        winHold: {
          onSliderChange: (value) => {
            this.UpdateColorLevel(value)

          },
          onNumberChange: (e) => {
            const { win_holder, win_holder_min, win_holder_max } = this.view_window
            if (typeof win_holder === 'number') {
              if (win_holder < win_holder_max && win_holder > win_holder_min) {
                this.UpdateColorLevel(win_holder)
              }
            }


          },
        },
        current: 0,
        list: [
          {
            name: "肋骨高级视图",
            icon: LayoutIcons.LGGJST,
          },
          {
            name: "MPR",
            icon: LayoutIcons.MPR,
          },
          {
            name: "原图",
            icon: LayoutIcons.AXIAL,
          },
        ],
      },
    };
  },

  methods: {
    ...mapActions("lungToolsStore", ["UpdateWindowCenter", "UpdateWindowWidth", "activeFrac", "activePenu", "activeNodule", "getAnnotation"]),

    ...mapMutations("toolBarStore", ["TOGGLE_BUTTON_ACTIVE_STATE", "INIT_BUTTON_ACTIVE_STATE", "INIT_BUTTON_SHOW_STATE"]),
    ...mapActions("toolBarStore", ["activeButtonState", "activeLayout", "UpdateColorWindow", "UpdateColorLevel"]),

    handle_iconbtn(name) {

      this.activeButtonState(name)
      // debugger;
      // switch (name) {
      //   case ButtonNames.Ckcw:
      //     {
      //       this.activeButtonState(ButtonNames.Ckcw)
      //     }
      //     break;
      //   case ButtonNames.Mjtyms:
      //     {
      //       this.activeButtonState(ButtonNames.Mjtyms)
      //     }
      //     break;
      //   // 其他按钮的逻辑...
      //   case ButtonNames.Jbinfo:
      //     {
      //       this.activeButtonState(ButtonNames.Jbinfo)
      //     }
      //     break;
      //   case ButtonNames.AiInfo:
      //     {
      //       this.activeButtonState(ButtonNames.AiInfo)
      //     }
      //     break;
      //   case ButtonNames.Szckx:
      //     {
      //       this.activeButtonState(ButtonNames.Szckx)
      //     }
      //     break;
      //   case ButtonNames.Pyms:
      //     {
      //       this.activeButtonState(ButtonNames.Pyms)
      //     }
      //     break;
      //   case ButtonNames.Bcj:
      //     {
      //       this.activeButtonState(ButtonNames.Bcj)
      //       // this.activeLayout(LayoutIcons.RECON);

      //     }
      //     break;
      //   case ButtonNames.Zoom:
      //     {
      //       this.activeButtonState(ButtonNames.Zoom)
      //       // this.activeLayout(LayoutIcons.RECON);

      //     }
      //     break;
      //   case ButtonNames.Invert:
      //     {
      //       this.activeButtonState(ButtonNames.Zoom)
      //       // this.activeLayout(LayoutIcons.RECON);

      //     }
      //     break;
      //   case ButtonNames.Reset:
      //     {
      //       this.activeButtonState(ButtonNames.Reset)
      //       // this.activeLayout(LayoutIcons.RECON);

      //     }
      //     break;
      //   default:
      //     break;
      // }
    },

    handle_view_window_row(idx) {
      this.view_window.current = idx;
      const { current } = this.view_window;
      const row = this.view_window.list[current];
      this.view_window.curInput = row.icon;
      this.activeLayout(row.icon);


    },
    handle_openTzg(curNo) {
      console.log(curNo)
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

.boxBtn:first-child {
  margin-left: 20px;
  /* 或者您想要的任何值 */
}

.boxBtn {
  margin-right: 10px;


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

  &.zoom_icon {
    >.pic {
      &:after {
        background-image: url(./assets/img/zoom.png);
      }
    }
  }

  &.invert_icon {
    >.pic {
      &:after {
        background-image: url(./assets/img/invert.png);
      }
    }
  }

  &.reset_icon {
    >.pic {
      &:after {
        background-image: url(./assets/img/refund.png);
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

/deep/.mjtyms_pop {
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
