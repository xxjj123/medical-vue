<template>
  <div class="select-none pointer-events-none text-white text-3" v-if="vdata">
    <div class="absolute top-4 left-4">
      <div class="">
        <span>WW/WL:{{ (vdata.Ww ?? "") + "/" + (vdata.Wl ?? "") }}</span>
      </div>
      <div class="">
        <span>Image:{{
          (vdata.sliceIndex ?? "") + "/" + (vdata.dimensions ?? "")
        }}</span>
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
