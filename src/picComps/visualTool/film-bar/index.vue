<template>
  <div class="vsk_film_bar">
    <div class="button-group flex">
      <button
        v-for="(button, index) in buttons"
        :key="index"
        :class="[
          'button',
          'flex-1',
          'ripple',
          { active: activeIndex === index },
        ]"
        @click="activate(index)"
      >
        {{ button.name }}
      </button>
      <div class="background" :style="backgroundStyle"></div>
    </div>
  </div>
</template>
<script lang='javascript'>
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
      activeIndex: 0,
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
  computed: {
    backgroundStyle() {
      return {
        transform: `translateX(${this.activeIndex * 100}%)`,
      };
    },
  },
  methods: {
    ...mapActions("viewsStore", [
      "UpdateColorWindow_self",
      "UpdateColorLevel_self",
    ]),
    changeLevelWinTheme() {
      const { tag } = this.buttons[this.activeIndex];
      const { ww, wl } = winCtrl[tag];
      this.UpdateColorWindow_self({ ww });
      this.UpdateColorLevel_self({ wl });
    },
    activate(index) {
      this.activeIndex = index;
      this.changeLevelWinTheme();
    },
  },
};
</script>
<style lang='less' scoped>
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
  z-index: 2; /* Ensure buttons are above the background */
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
