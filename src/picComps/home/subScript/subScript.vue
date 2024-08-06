<template>
  <div class="select-none pointer-events-none text-white text-3" v-if="vdata">
    <div class="absolute top-4 left-4">
      <div class="">
        <span>WW/WL:{{ (vdata.Ww ?? "") + "/" + (vdata.Wl ?? "") }}</span>
      </div>
      <div class="">
        <span
          >Image:{{
            (vdata.sliceIndex ?? "") + "/" + (vdata.dimensions ?? "")
          }}</span
        >
      </div>
      <div class="">
        <span>Thickness:{{ vdata.thickness ?? "" }}</span>
      </div>
    </div>
    <div class="absolute bottom-4 left-4">
      <div class=""><span>kVp:</span></div>
      <div class="">
        <span>HU:{{ vdata.hu ?? "" }}</span>
      </div>
      <div class="">
        <span>Spacing:{{ vdata.thickness ?? "" }}</span>
      </div>
      <div class="">
        <span>Dimension:{{ vdata.dimensions ?? "" }}</span>
      </div>
    </div>

    <!-- <svg
      ref="svg"
      class="absolute select-none pointer-events-none w-full h-full"
    >
      <line
        :x1="vdata.crosshair_x + 'px'"
        :y1="0 + 'px'"
        :x2="vdata.crosshair_x + 'px'"
        :y2="440 + 'px'"
        stroke="blue"
        stroke-width="2"
        stroke-dasharray="5,5"
      />
      <line
        :x1="0 + 'px'"
        :y1="660 - vdata.crosshair_y + 'px'"
        :x2="660 + 'px'"
        :y2="660 - vdata.crosshair_y + 'px'"
        stroke="red"
        stroke-width="2"
        stroke-dasharray="5,5"
      />
    </svg> -->
  </div>
</template>

<script lang="javascript">
// const { vdata } = defineProps(['vdata'])
export default {
  name: "subScript",
  props: {
    value: {
      type: [Object, String],
      default: "",
    },
  },
  computed: {
    vdata: {
      get() {
        return this.value;
      },
      set(nVal) {
        this.$emit("input", nVal);
      },
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped></style>
