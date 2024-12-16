<template>
  <div class="absolute left-0 top-0 " :class="[
    'dicom-tags',
  ]">
    <template>
      <div ref="container" class="item_row flex h-full">
        <!-- {{ data.displayX }}
        {{ data.displayY }} -->
        <!-- {{ height - data.displayY }} -->
        <svg ref="svg" class=" select-none pointer-events-none w-full h-full">
          <line :x1="0" :y1="data.displayY" :x2="width" :y2="data.displayY" stroke="#2cf66c" :stroke-width="1.5"
            :stroke-dasharray="dashArray" vector-effect="non-scaling-stroke" />
          <line :x1="data.displayX" :y1="0" :x2="data.displayX" :y2="height" stroke="#2cf66c" :stroke-width="1.5"
            :stroke-dasharray="dashArray" vector-effect="non-scaling-stroke" />



        </svg>
      </div>

    </template>


  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'dicom-tags',
  props: {
    data: {
      type: Object,
      required: true
    },
    sheetStyle: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    // dashArray() {
    //   return `${5 / this.screenRatio},${5 / this.screenRatio}`;
    // },


  },

  data() {
    return {
      height: 0,
      width: 0,
      dashArray: 5,
      screenRatio: 1,
    }
  },
  methods: {
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
}
</script>

<style lang='less' scoped>
.dicom-tags {
  box-sizing: border-box;
  user-select: none;
  pointer-events: none;
  width: 100%;
  height: 100%;
}

.leftTop {
  left: 0;
  top: 0;
}


.item_row {
  box-sizing: border-box;
  font-size: 12px;
  font-weight: 100;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-shadow: rgb(0, 0, 0) 1px 1px 0px;
  margin-bottom: 1px;
  color: #2cf66c;
}

.ruleLine {
  line-height: 1;

  .label {
    padding-right: 10px;
    font-size: 13px;

    span {
      margin-right: 2px;
    }
  }

  .val {
    i {
      display: block;
      width: 16px;
      position: relative;
      border-bottom: 1px solid hsla(150, 84%, 70%, 0.986);

      &:before,
      &:after {
        content: "";
        display: inline-block;
        width: 1px;
        height: 3px;
        background: hsla(150, 84%, 70%, 0.986);
        position: absolute;
      }

      &:before {
        left: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }

      &:after {
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
      }
    }
  }
}

.KVP_block {
  bottom: 57px;
}

.Hu_block {
  bottom: 43px;
}

.spac_block {
  bottom: 28px;
}

.dimension_block {
  bottom: 10px;
}
</style>
