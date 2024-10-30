<template>
  <div class="vsk_film_bar">
    <div class="button-group flex">
      <!-- 使用 v-for 循环遍历 buttons 数组 -->
      <button v-for="(button, index) in buttons" :key="index" :class="['button', { active: activeIndex === index }]"
        @click="activate(index)">
        {{ button.name }}
      </button>
      <div class="background" v-if="activeIndex !== null" :style="backgroundStyle"></div>
    </div>
  </div>
</template>

<script lang="javascript">
import { mapState, mapActions } from "vuex";

const buttons = [
  { name: "肺窗", tag: "lung", ww: 1500, wl: -500 },
  { name: "纵隔窗", tag: "mediastinal", ww: 300, wl: 50 },
  { name: "骨窗", tag: "bone", ww: 1500, wl: 300 },
];

export default {
  name: "film-bar",
  data() {
    return {};
  },
  computed: {
    ...mapState("mprViewStore", ["allViewData"]),
    buttons() {
      return buttons
    },
    backgroundStyle() {
      if (this.activeIndex) {
        return {
          transform: `translateX(${this.activeIndex * 100}%)`,
        };
      }

    },
    activeIndex() {
      const { colorWindow, colorLevel } = this.allViewData;
      const matchedIndex = buttons.findIndex(
        (button) => button.ww === colorWindow && button.wl === colorLevel
      );
      return matchedIndex >= 0 ? matchedIndex : null;
    },
  },
  methods: {
    ...mapActions("toolBarStore", ["UpdateColorWindow", "UpdateColorLevel"]),
    activate(index) {
      const { ww, wl } = buttons[index];
      this.UpdateColorWindow(ww);
      this.UpdateColorLevel(wl);
    },
  },
};
</script>

<style lang="less" scoped>
.button-group {
  position: relative;
  width: 224px;
  max-width: 389px;
  height: 44px;
  padding: 4px;
  background-color: #333333;
  border-radius: 8px;
}

.button {
  border: none;
  background: transparent;
  cursor: pointer;
  flex: 1;
  z-index: 2; // 确保按钮在背景之上
  transition: color 0.3s ease;
}

.background {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 72px;
  height: 36px;
  border-radius: 6px;
  background-color: @primary-color;
  transition: transform 0.3s ease, width 0.3s ease, background-color 0.3s ease;
}

.active {
  color: white;
}
</style>
