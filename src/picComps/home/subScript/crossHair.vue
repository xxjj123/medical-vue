<template>
  <div v-show="szckxButtonState" ref="container">
    {{ crosshairData.displayX }}
    <svg ref="svg" class="absolute select-none pointer-events-none w-full h-full">
      <line :x1="0" :y1="height - crosshairData.displayY / screenRatio" :x2="width"
        :y2="height - crosshairData.displayY / screenRatio" stroke="#2cf66c" :stroke-width="1.5 / screenRatio"
        :stroke-dasharray="dashArray" vector-effect="non-scaling-stroke" />
      <line :x1="crosshairData.displayX / screenRatio" :y1="0" :x2="crosshairData.displayX / screenRatio" :y2="height"
        stroke="#2cf66c" :stroke-width="1.5 / screenRatio" :stroke-dasharray="dashArray"
        vector-effect="non-scaling-stroke" />

      <!-- <line :x1="0" :y1="height - crosshairData.crosshair_y / screenRatio" :x2="width"
        :y2="height - crosshairData.crosshair_y / screenRatio" stroke="#2cf66c" :stroke-width="1.5 / screenRatio"
        :stroke-dasharray="dashArray" vector-effect="non-scaling-stroke" />
      <line :x1="crosshairData.displayX / screenRatio" :y1="0" :x2="crosshairData.displayX / screenRatio"
        :y2="height" stroke="#2cf66c" :stroke-width="1.5 / screenRatio" :stroke-dasharray="dashArray"
        vector-effect="non-scaling-stroke" /> -->


    </svg>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import {
  ButtonNames, suffix_name

} from "@/picComps/visualTool/tool-bar/assets/js/buttonNameType";
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
    ...mapState("toolBarStore", {
      szckxButtonState: state => state[`${ButtonNames.Szckx}${suffix_name}`],

    }),
    dashArray() {
      return `${5 / this.screenRatio},${5 / this.screenRatio}`;
    },
    crosshair_x_value() {
      return this.crosshair_x;
    },
  },
  methods: {
    ...mapActions("mprToolsStore", ["resizeSliceViews"]),
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
      // this.resizeSliceViews();
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
