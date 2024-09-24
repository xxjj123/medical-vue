<template>
  <div class="vsk_film_bar">
    <div class="button-group flex">
      <button v-for="(button, index) in buttons" :key="index" :class="[
        'button',
        'flex-1',
        'ripple',
        { active: activeIndex === index },
      ]" @click="activate(index)">
        {{ button.name }}
      </button>
      <div class="background" v-if="activeIndex != null" :style="backgroundStyle"></div>
    </div>
  </div>
</template>
<script lang="javascript">
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

//视窗，窗宽窗位
const winCtrl = {
  lung: {
    ww: 1500,
    wl: -500,
  },
  mediastinal: {
    ww: 300,
    wl: 50,
  },
  bone: {
    ww: 1500,
    wl: 300,
  },
};

export default {
  name: "film-bar",
  data() {
    return {
      activeIndex: null,
      buttons: [
        {
          name: "肺窗",
          tag: "lung",
        },
        {
          name: "纵隔窗",
          tag: "mediastinal",
        },
        {
          name: "骨窗",
          tag: "bone",
        },
      ],
    };
  },
  created() {
    this.$nextTick(() => {
      this.activeIndex = 0
      // this.activate(this.activeIndex)
    })
  },
  computed: {
    backgroundStyle() {
      return {
        transform: `translateX(${this.activeIndex * 100}%)`,
      };
    },
    ...mapState("viewInitStore", ["noduleDiagnoseState"]),
    ...mapState("picViewStore", ["diagnoseState"])
  },
  watch: {
    noduleDiagnoseState: {
      handler(nVal, oVal) {
        let colorWindow = nVal.colorWindow
        let colorLevel = nVal.colorLevel

        if (winCtrl.lung.ww == colorWindow && winCtrl.lung.wl == colorLevel) {
          this.activate(0)
        } else if (winCtrl.mediastinal.ww == colorWindow && winCtrl.mediastinal.wl == colorLevel) {

          this.activate(1)
        } else if (winCtrl.bone.ww == colorWindow && winCtrl.bone.wl == colorLevel) {
          this.activate(2)
        } else {
          this.activeIndex = null
        }
      },
      deep: true,
      immediate: true,
    },
    diagnoseState: {
      handler(nVal, oVal) {
        let colorWindow = nVal.colorWindow
        let colorLevel = nVal.colorLevel

        if (winCtrl.lung.ww == colorWindow && winCtrl.lung.wl == colorLevel) {
          this.activate(0)
        } else if (winCtrl.mediastinal.ww == colorWindow && winCtrl.mediastinal.wl == colorLevel) {

          this.activate(1)
        } else if (winCtrl.bone.ww == colorWindow && winCtrl.bone.wl == colorLevel) {
          this.activate(2)
        } else {
          this.activeIndex = null
        }
      },
      deep: true,
      immediate: true,
    }
  },
  methods: {
    ...mapActions("viewInitStore", ["UpdateColorWindow", "UpdateColorLevel"]),
    ...mapActions("viewsStore", [
      "UpdateColorWindow_self",
      "UpdateColorLevel_self",
    ]),
    changeLevelWinTheme() {
      console.log("kaishiUpdateColorLevel");
      const { tag } = this.buttons[this.activeIndex];
      const { ww, wl } = winCtrl[tag];
      this.$emit('changeColor', ww, wl)
      // this.UpdateColorWindow(ww)
      // this.UpdateColorLevel(wl)

    },
    activate(index) {
      this.activeIndex = index;
      this.changeLevelWinTheme();
    },
  },
};
</script>
<style lang="less" scoped>
.button-group {
  position: relative;
  // min-width: 224px;
  width: 224px;
  max-width: 389px;
  height: 44px;
  padding: 4px;
  background-color: #111111;
  border-radius: 8px;
}

.button {
  border: none;
  background: transparent;
  cursor: pointer;
  min-width: 70px;
  max-width: 260px;
  z-index: 2;
  /* Ensure buttons are above the background */
}

.background {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 72px;
  height: 36px;
  border-radius: 6px;
  background-color: @primary-color;
  transition: transform 0.3s ease;
}

.active {
  color: white;
}
</style>
