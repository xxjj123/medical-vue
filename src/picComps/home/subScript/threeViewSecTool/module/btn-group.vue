<template>
  <div class="btn-group">
    <div class="btn_grp_item u-flex">
      <template v-if="btnInfoItem && Object.keys(btnInfoItem).length > 0">
        <template v-for="(btn, key) in btnInfoItem">
          <div :class="[`btn`, {selected: btn.on}]" :key="key" @click="handle_click(btn, key)">
            <div :class="['ifontyhpacs', {[`${btn.icon}`]: btn.icon && btn.icon !== ''}]">
            </div>
            <div v-if="btn.mode === 'more'">

            </div>
            <template v-if="btn.child && btn.child.length > 0">

            </template>
          </div>
        </template>
      </template>

    </div>



  </div>
</template>
<script lang='javascript'>
import {btnKey, btnInfo} from "./btn-group-assets/btn-t-info";
export default {
  name: 'btn-group',
  props: {
    TracheaName: {
      type: String,
      default: "" //lung ,heart, brain ,...
    }
  },
  computed: {
    btnInfoItem: {
      get() {
        const {TracheaName, btnInfoItemLocal} = this
        const baseOb = btnInfo[TracheaName] ? btnInfo[TracheaName] : {};
        return [
          ...baseOb,
          ...btnInfoItemLocal
        ]
      },
      set(val) {
        this.btnInfoItemLocal = val;
        // return val;
      },
    }
  },
  data() {
    return {
      btnInfoItemLocal: [],
      current: "",
      nextChildCurrent: ""
    }
  },
  methods: {
    handle_click(btn, index) {
      // this.btnInfoItem =
      const {on} = btn;
      if (on && (on === true || on === 1)) {
        this.$set(this.btnInfoItem[index], "on", false)
      } else {
        this.$set(this.btnInfoItem[index], "on", true)
      }
      this.current = index;

      console.log("btnInfoItemLocal==", this.btnInfoItemLocal);

    }
  },
}
</script>
<style lang='less' scoped>
.btn_grp_item {
  .btn {
    padding: 5px;
    border-radius: 5px;

    .ifontyhpacs {
      color: #989EA4;
    }

    &.selected {
      background: @primary-1;

      .ifontyhpacs {
        color: #fff;
      }
    }
  }
}
</style>
