export default {
  mounted() {
    document.querySelectorAll('.vxe-table').forEach((vt) => {
      vt.trigger = this.trigger(vt);
    });
  },
  methods: {
    trigger(ele) {
      return () => {
        ele.__vue__.recalculate(true);
      };
    },
  },
  beforeDestroy() {
    document.querySelectorAll('.vxe-table').forEach((vt) => {
      vt.trigger = undefined;
    });
  },
};
