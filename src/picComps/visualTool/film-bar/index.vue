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
        {{ button }}
      </button>
      <div class="background" :style="backgroundStyle"></div>
    </div>
  </div>
</template>
<script lang='javascript'>
export default {
  name: "film-bar",
  data() {
    return {
      activeIndex: 0,
      buttons: ["肺窗", "纵隔窗", "骨窗"],
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
    activate(index) {
      this.activeIndex = index;
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
