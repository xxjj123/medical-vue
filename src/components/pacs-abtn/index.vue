<template>
  <a
    :aria-disabled="isDisabled && !exclude ? true : false"
    :class="[
      'pacs-abtn alink',
      {
        ['line-through pointer-events-none opacity-50 cursor-not-allowed']:
          isDisabled && !exclude,
      },
    ]"
    href="javascript:void(0)"
    @click="handleClick"
  >
    <slot>
      {{ name }}
    </slot>
  </a>
</template>
<script lang="jsx">
export default {
  name: "pacs-abtn",
  props: {
    name: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: () => false,
    },
    /**
     * 排除本体
     */
    exclude: {
      type: Boolean,
      default: () => false,
    },
  },
  computed: {
    isDisabled: {
      get() {
        return this.disabled;
      },
      set(val) {
        this.$emit("update:disabled", val);
        return val;
      },
    },
  },
  data() {
    return {};
  },
  methods: {
    handleClick() {
      if (this.exclude) {
        if (!this.isDisabled) {
          this.isDisabled = !this.isDisabled;
        } else {
          this.$message.success(`分析中-请勿重复点击，稍后返回~`);
        }
      }
      // console.log("handleClick==",this.isDisabled);
      this.$emit("click");
    },
  },
};
</script>
<style lang="less" scoped></style>
