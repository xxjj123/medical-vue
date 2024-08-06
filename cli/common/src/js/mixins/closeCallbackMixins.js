const closeCallbackMixins = {
  data() {
    return {
      pageModuleId: '',
    };
  },
  created() {
    this.pageModuleId = this.$route.query._modulePartId_;
    window.window_closeTabCallBack = (menu) => {
      this.closeTabCallBackFn(menu);
    };
  },
  methods: {
    closeTabCallBackFn(menu) {
      if (menu.partId === this.pageModuleId) {
        if (typeof this.closeTabCallBack === 'function') {
          this.closeTabCallBack(menu);
        } else {
          Base.closeTabMenu({ id: this.pageModuleId, force: true });
        }
      }
    },
  },
  beforeDestroy() {
    window.window_closeTabCallBack = null;
  },
};

export default closeCallbackMixins;
