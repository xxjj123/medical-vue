<template>
  <div class="btn-group">
    <div class="btn_grp_item flex items-center">
      <template v-if="btnInfoItem && Object.keys(btnInfoItem).length > 0">
        <template v-for="(btn, key) in btnInfoItem">
          <div
            :class="[`btn flex`, { selected: btn.code == 'autoplay' ? currentViewAutopalyState : btn.on && btn.mode !== 'more' && btn.mode !== 'other' }, { ripple: btn.mode === 'more' || btn.mode === 'other' }]"
            :key="`${key}_a`" @click.stop="handle_click(btn, key)">
            <div :class="['ifontyhpacs', { [`${btn.icon}`]: btn.icon && btn.icon !== '' }]">
            </div>


          </div>
          <div class="more_wrap flex items-center" :key="`${key}_b`">
            <!-- <template v-if="btn.mode === 'more'">
              <div class="moreBtn flex" @click.stop="handle_click_more(btn, key)">
                <div v-if="btn.moreClickOn" class="ifontyhpacs ico_pacsshangjiantou1">
                </div>
                <div v-else class="ifontyhpacs ico_pacsxiajiantou"></div>
              </div>
            </template> -->
            <template v-if="btn.child && btn.child.length > 0">
              <template v-if="btn.moreClickOn">
                <ta-dropdown :placement="'topCenter'" :getPopupContainer="setPopupContainer" :trigger="['click']"
                  class="flex justify-start items-center mr-[10px]">
                  <a href="javascript:;" style="color:#fff;">
                    <ta-icon type="down" v-if="btn.dropdownIconDown" />
                    <ta-icon type="up" v-else />
                  </a>
                  <ta-menu slot="overlay" @click="(e) => handleMenuClick_noduleList(e, { btn, key })">
                    <ta-menu-item v-for="(item, index) in btn.child" :key="`${index}_${item.altName}`">
                      <div class="flex">
                        <div :class="['ifontyhpacs', { [`${item.icon}`]: item.icon && item.icon !== '' }, 'pr-[10px]']">

                        </div>
                        <div>{{ item.altName }}</div>
                      </div>
                    </ta-menu-item>
                  </ta-menu>
                </ta-dropdown>
              </template>
            </template>
          </div>
        </template>
      </template>

    </div>



  </div>
</template>
<script lang='javascript'>
import { btnKey, btnLungCodes, rotateChildBtnCodes, autoPlayCodes, btnInfo } from "./btn-group-assets/btn-t-info";

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";


import {
  LayoutIcons,
} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";

export default {
  name: 'btn-group',
  props: {
    TracheaName: {
      type: String,
      default: "" //lung ,heart, brain ,...
    },
    viewType: {
      type: [String, Number],
    },
  },

  computed: {
    btnInfoItem: {
      get() {
        const { TracheaName, btnInfoItemLocal } = this
        return [
          ...btnInfoItemLocal
        ]
      },
      set(val) {
        console.log("val----", val);
        console.log("this.btnInfoItemLocal;____", this.btnInfoItemLocal)
      },
    },
    ...mapState("mprViewStore", ["allViewData"]),
    ...mapState("toolBarStore", ["slice_CT_pic_layout"]),

    ...mapState("viewInitStore", ["autoPlayStates"]),
    ...mapGetters("viewInitStore", ["viewAutopalyState"]),

    localSlice_CT_pic_layout: {
      get() {
        return this.slice_CT_pic_layout; // 从 Vuex 状态获取值
      },
      set(value) {
        console.log("set___localSlice_CT_pic_layout", value);

        // this.setSlice_CT_pic_layout(value); // 调用 mutation 更新 Vuex 状态
      },
    },

    currentViewAutopalyState: {
      get() {
        if (this.autoPlayStates[this.viewType]) {
          return this.autoPlayStates[this.viewType].isAutoPlay;
        }

        // if (this.viewType == 0) {
        //   return this.autoPlayStates[this.viewType].isPlay;
        //   console.log("currentViewAutopalyState", this.autoPlayStates[this.viewType])
        // }
        // if (this.viewType) {
        //   return  return this.autoPlayStates[this.viewType].isPlay;
        // }
        // 从 Vuex 状态获取值
      },

    },
    currentViewpalyState: {
      get() {
        if (this.autoPlayStates[this.viewType]) {
          return this.autoPlayStates[this.viewType].isPlay;
        }

        // if (this.viewType == 0) {
        //   return this.autoPlayStates[this.viewType].isPlay;
        //   console.log("currentViewAutopalyState", this.autoPlayStates[this.viewType])
        // }
        // if (this.viewType) {
        //   return  return this.autoPlayStates[this.viewType].isPlay;
        // }
        // 从 Vuex 状态获取值
      },

    }
  },
  watch: {
    btnInfoItem: {
      handler(nVal, oVal) {
        // console.log("watch____btnInfoItem", nVal, oVal);
        // console.log("this.btnInfoItemLocal--waaww", this.btnInfoItemLocal);

      },
      immediate: true,
      deep: true,
    },
    localSlice_CT_pic_layout: {
      handler(nVal, oVal) {
        const that = this;

        // console.log("localSlice_CT_pic_layout___btngroup-nVal, oVal", nVal, oVal);

        switch (nVal) {
          case LayoutIcons.LGGJST:
            this.layout = "1";
            break;
          case LayoutIcons.MPR:
            this.layout = "2";
            break;
          case LayoutIcons.AXIAL:
            this.layout = "3";
            break;
          case LayoutIcons.CORONAL:
            this.layout = "4";
            break;
          case LayoutIcons.SAGITTAL:
            this.layout = "5";
            break;
          default:
            return void 0;
        }

      },
      immediate: true
    },
    currentViewAutopalyState: {
      handler(nVal, oVal) {
        // if (nVal) {
        //   this.$set(this.btnInfoItem[2], "icon", autoPlayCodes.ICO_PACSBOFANG);
        // } else {
        //   this.$set(this.btnInfoItem[2], "icon", autoPlayCodes.ICO_PACSZANTING);
        // }

      }
    }

  },
  data() {
    return {
      btnInfoItemLocal: [],
      current: "",
      nextChildCurrent: "",
      layout: 1,
      i: 0,
    }
  },
  created() {
    // this.btnInfoItemLocal = btnInfo[this.TracheaName]
    this.btnInfoItemLocal = JSON.parse(JSON.stringify(btnInfo[this.TracheaName]));
    console.log("created:btnInfoItemLocal==>>>", this.btnInfoItemLocal);

  },
  methods: {
    ...mapActions("mprToolsStore", ["ReverseWindow", "RotateCamera", "FlipHorizontal", "FlipVertical"]),
    ...mapActions("toolBarStore", ["AutoPlay"]),




    ...mapMutations("toolBarStore", ["SET_SLICE_CT_PIC_LAYOUT"]),
    ...mapActions("toolBarStore", ["activeZoom", "activeButtonState"]),


    // ...mapMutations("viewInitStore", ["CLEAR_AUTO_PLAY_TIMER"]),

    // ...mapActions("viewInitStore", ["ReverseWindow", "RotateCamera", "AutoPlay", "FlipHorizontal", "FlipVertical"]),
    handle_click_more(btn, index) {
      console.log("this.btnInfoItem==start", btn, index);

      this.$set(this.btnInfoItem[index], "moreClickOn", !btn.moreClickOn)


      // console.log("this.btnInfoItem==", this.btnInfoItem);


    },
    handleMenuClick_noduleList(e, item) {
      // console.log("handleMenuClick_noduleList", e, item);
      let { btn, key: index } = item;

      let { keyPath } = e;

      let dropValues = keyPath[0].split("_")

      console.log("dropValues=", dropValues);

      let dropCode = dropValues[0];


      console.log("btn", btn);
      const { child } = btn;


      if (child) {
        const selectIcon = child[dropCode]?.icon;
        console.log("selectIcon_", selectIcon);

        this.$set(this.btnInfoItem[index], "icon", selectIcon)
      }



    },
    setPopupContainer(trigger) {
      return trigger.parentElement;
    },
    handle_click(btn, index) {
      console.log("btnInfoItemLocal==start", btn, index);

      this.$set(this.btnInfoItem[index], "on", !btn.on)
      this.current = index;

      console.log("viewType==handle_click=", this.viewType);

      const { code } = btn;

      switch (code) {
        case btnLungCodes.REBACK: {
          this.ReverseWindow(this.viewType)
        }
          break;
        case btnLungCodes.XZFZ: {

          console.log("btn.icon==", btn.icon);


          if (btn.icon === rotateChildBtnCodes.ICO_PACSSHUPING) {
            this.RotateCamera(this.viewType)
          } else if (btn.icon === rotateChildBtnCodes.ICO_PACSSHUIPINGFANZHUAN) {
            this.FlipHorizontal(this.viewType)
          } else if (btn.icon === rotateChildBtnCodes.ICO_PACSCHUIZHIFANZHUAN) {
            this.FlipVertical(this.viewType)
          }
        }
          break;
        case btnLungCodes.AUTOPLAY: {
          console.log("btnLungCodes.AUTOPLAY", btnLungCodes.AUTOPLAY);

          const { icon, toggle, child } = btn;

          // // 如果toggle小于child数组长度，确保游标不超过toggle
          // if (toggle < child.length) {
          //   btn.cursor = (btn.cursor + 1) % toggle;
          // } else {
          //   // 如果toggle大于等于child数组长度，允许游标遍历整个数组
          //   btn.cursor = (btn.cursor + 1) % child.length;
          // }

          // // 更新当前图标为child数组中对应游标位置的图标
          // this.$set(btn, "icon", child[btn.cursor].icon);




          switch (icon) {
            case autoPlayCodes.ICO_PACSBOFANG: {
              // console.log("icon----------start", icon, autoPlayCodes.ICO_PACSBOFANG);
              console.log("this.viewType", this.viewType)
              this.AutoPlay({
                viewIndex: this.viewType
              })
              // this.$set(this.btnInfoItem[index], "icon", autoPlayCodes.ICO_PACSZANTING);
            }
              break;
            case autoPlayCodes.ICO_PACSZANTING: {
              this.CLEAR_AUTO_PLAY_TIMER(this.viewType)
              this.$set(this.btnInfoItem[index], "icon", autoPlayCodes.ICO_PACSBOFANG);
              // console.log("icon----------stop", icon, autoPlayCodes.ICO_PACSZANTING);
            }
              break;
          }




        }
          break;
        case btnLungCodes.SCREEN: {
          console.log(this.viewType)
          this.activeZoom(this.viewType)

          //     console.log("this.slice_CT_pic_layout==SCREEN", this.slice_CT_pic_layout, "layout", this.layout);
          //     if (this.layout == 3 || this.layout == 4 || this.layout == 5) {
          //       console.log("this.layout_bak=", this.layout_bak);

          //       // this.SET_SLICE_CT_PIC_LAYOUT(this.layout_bak || LayoutIcons.LGGJST);
          //       this.SET_SLICE_CT_PIC_LAYOUT(this.layout_bak || LayoutIcons.LGGJST);

          //     } else if (this.layout == 1) {
          //       if (this.viewType == "2") {
          //         this.layout_bak = LayoutIcons.LGGJST;



          //         console.log("this.layout_bak=", this.layout_bak);
          //         this.SET_SLICE_CT_PIC_LAYOUT(LayoutIcons.AXIAL);
          //       } else if (this.viewType == "1") {
          //         this.layout_bak = LayoutIcons.LGGJST;
          //         console.log("this.layout_bak=", this.layout_bak);
          //         this.SET_SLICE_CT_PIC_LAYOUT(LayoutIcons.CORONAL);
          //       } else if (this.viewType == "0") {
          //         this.layout_bak = LayoutIcons.LGGJST;
          //         console.log("this.layout_bak=", this.layout_bak);
          //         this.SET_SLICE_CT_PIC_LAYOUT(LayoutIcons.SAGITTAL);
          //       }
          //     } else if (this.layout == 2) {
          //       this.layout_bak = LayoutIcons.MPR;

          //       if (this.viewType == "2") {
          //         this.layout_bak = LayoutIcons.LGGJST;
          //         console.log("this.layout_bak=", this.layout_bak);
          //         this.SET_SLICE_CT_PIC_LAYOUT(LayoutIcons.AXIAL);
          //       } else if (this.viewType == "1") {
          //         this.layout_bak = LayoutIcons.LGGJST;
          //         console.log("this.layout_bak=", this.layout_bak);
          //         this.SET_SLICE_CT_PIC_LAYOUT(LayoutIcons.CORONAL);
          //       } else if (this.viewType == "0") {
          //         this.layout_bak = LayoutIcons.LGGJST;
          //         console.log("this.layout_bak=", this.layout_bak);
          //         this.SET_SLICE_CT_PIC_LAYOUT(LayoutIcons.SAGITTAL);
          //       }
          //     }
        }
          break;
        default:
          return void 0;

      }





      // console.log("btnInfoItemLocal==", this.btnInfoItemLocal);

    }
  },
}
</script>
<style lang='less' scoped>
.btn-group {
  position: absolute;
  right: 10px;
  bottom: 10px;
}

.btn_grp_item {
  .btn {
    padding: 5px;
    border-radius: 5px;

    .ifontyhpacs {
      color: #989EA4;
    }

    &.selected {
      background: @primary-color;

      .ifontyhpacs {
        color: #fff;
      }
    }
  }
}
</style>
