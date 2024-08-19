<template>
  <div class="btn-group">
    <div class="btn_grp_item flex items-center">
      <template v-if="btnInfoItem && Object.keys(btnInfoItem).length > 0">
        <template v-for="(btn, key) in btnInfoItem">
          <div
            :class="[`btn flex`, {selected: btn.on && btn.mode !== 'more' && btn.mode !== 'other'}, {ripple: btn.mode === 'more' || btn.mode === 'other'}]"
            :key="`${key}_a`" @click.stop="handle_click(btn, key)">
            <div :class="['ifontyhpacs', {[`${btn.icon}`]: btn.icon && btn.icon !== ''}]">
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
                  <ta-menu slot="overlay" @click="(e) => handleMenuClick_noduleList(e, {btn, key})">
                    <ta-menu-item v-for="(item, index) in btn.child" :key="`${index}_${item.altName}`">
                      <div class="flex">
                        <div :class="['ifontyhpacs', {[`${item.icon}`]: item.icon && item.icon !== ''}, 'pr-[10px]']">
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
import {btnKey, btnLungCodes, rotateChildBtnCodes, btnInfo} from "./btn-group-assets/btn-t-info";

import {mapState, mapMutations, mapActions, mapGetters} from "vuex";


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
        const {TracheaName, btnInfoItemLocal} = this
        return [
          ...btnInfoItemLocal
        ]
      },
      set(val) {
        console.log("val----", val);
        console.log("this.btnInfoItemLocal;____", this.btnInfoItemLocal)
      },
    }
  },
  watch: {
    btnInfoItem: {
      handler(nVal, oVal) {
        console.log("watch____btnInfoItem", nVal, oVal);
        console.log("this.btnInfoItemLocal--waaww", this.btnInfoItemLocal);

      },
      immediate: true,
      deep: true,
    }
  },
  data() {
    return {
      btnInfoItemLocal: [],
      current: "",
      nextChildCurrent: ""
    }
  },
  created() {
    this.btnInfoItemLocal = btnInfo[this.TracheaName]
    console.log("created:btnInfoItemLocal==>>>", this.btnInfoItemLocal);

  },
  methods: {
    ...mapActions("viewInitStore", ["ReverseWindow", "RotateCamera", "AutoPlay", "FlipHorizontal", "FlipVertical"]),
    handle_click_more(btn, index) {
      console.log("this.btnInfoItem==start", btn, index);

      this.$set(this.btnInfoItem[index], "moreClickOn", !btn.moreClickOn)


      console.log("this.btnInfoItem==", this.btnInfoItem);


    },
    handleMenuClick_noduleList(e, item) {
      console.log("handleMenuClick_noduleList", e, item);
      let {btn, key: index} = item;

      let {keyPath} = e;

      let dropValues = keyPath[0].split("_")

      console.log("dropValues=", dropValues);

      let dropCode = dropValues[0];


      console.log("btn", btn);
      const {child} = btn;


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

      const {code} = btn;

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
          this.AutoPlay({
            viewType: this.viewType,
            time: 1000
          })
        }
          break;
        case btnLungCodes.SCREEN: {

        }
          break;
        default:
          return void 0;

      }





      console.log("btnInfoItemLocal==", this.btnInfoItemLocal);

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
