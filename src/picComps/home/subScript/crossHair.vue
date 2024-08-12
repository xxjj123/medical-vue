<template>
  <div ref="container">
    <svg
      ref="svg"
      class="absolute select-none pointer-events-none w-full h-full"
    >
      <line
        :x1="0"
        :y1="height - crosshairData.crosshair_y / screenRatio"
        :x2="width"
        :y2="height - crosshairData.crosshair_y / screenRatio"
        stroke="blue"
        :stroke-width="1.5 / screenRatio"
        :stroke-dasharray="dashArray"
        vector-effect="non-scaling-stroke"
      />
      <line
        :x1="crosshairData.crosshair_x / screenRatio"
        :y1="0"
        :x2="crosshairData.crosshair_x / screenRatio"
        :y2="height"
        stroke="blue"
        :stroke-width="1.5 / screenRatio"
        :stroke-dasharray="dashArray"
        vector-effect="non-scaling-stroke"
      />

      <line
        :x1="10"
        :y1="height - 30"
        :x2="10 + crosshairData.scale_length / screenRatio"
        :y2="height - 30"
        stroke="yellow"
        :stroke-width="3 / screenRatio"
      />
    </svg>
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  props: {
    crosshairData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      height: 0,
      width: 0,
      screenRatio: 1,
      resizeObserver: null,
    };
  },
  computed: {
    dashArray() {
      return `${5 / this.screenRatio},${5 / this.screenRatio}`;
    },
    crosshair_x_value() {
      return this.crosshair_x;
    },
  },
  methods: {
    ...mapActions("viewInitStore", ["resizeViews"]),
    detectZoom() {
      let ratio = 1;
      const screen = window.screen;
      const ua = navigator.userAgent.toLowerCase();
      if (window.devicePixelRatio !== undefined) {
        ratio = window.devicePixelRatio;
      } else if (~ua.indexOf("msie")) {
        if (screen.deviceXDPI && screen.logicalXDPI) {
          ratio = screen.deviceXDPI / screen.logicalXDPI;
        }
      } else if (
        window.outerWidth !== undefined &&
        window.innerWidth !== undefined
      ) {
        ratio = window.outerWidth / window.innerWidth;
      }
      this.screenRatio = ratio;
      this.resizeViews();
    },
    updateDimensions() {
      if (this.$refs.container) {
        this.height = this.$refs.container.clientHeight;
        this.width = this.$refs.container.clientWidth;
      }
      this.detectZoom();
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.updateDimensions();
      console.log(this.crosshairData);
    });
    this.resizeObserver = new ResizeObserver(this.updateDimensions);
    if (this.$refs.container) {
      this.resizeObserver.observe(this.$refs.container);
    }
  },
  beforeDestroy() {
    if (this.resizeObserver && this.$refs.container) {
      this.resizeObserver.unobserve(this.$refs.container);
    }
  },
};
</script>
