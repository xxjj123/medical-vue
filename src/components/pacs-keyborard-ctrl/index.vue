<template>
  <ta-modal
    v-model="modalVisible"
    class="custom_modal_box"
    title="常用快捷键"
    @on-ok="handleOk"
    width="calc(1158 / 1920 * 100vw)"
    height="calc(900 / 1080 * 100vh - 100px)"
  >
    <template slot="footer">
      <div class="flex justify-between">
        <div>
          <ta-button :ghost="true"> 恢复默认</ta-button>
        </div>
        <div>
          <ta-button key="back" @click="handleCancel">取消</ta-button>
          <ta-button
            key="submit"
            type="primary"
            :loading="loading"
            @click="handleOk"
          >
            确定
          </ta-button>
        </div>
      </div>
    </template>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
    <p>Some contents...</p>
  </ta-modal>
</template>

<script>
export default {
  name: "YourComponentName", // 填写你的组件名字
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      modalVisible: false,
    };
  },
  watch: {
    visible(value) {
      this.modalVisible = value;
    },
    modalVisible(value) {
      console.log("wwww-", value);
      this.$emit("update:visible", value);
    },
  },
  methods: {
    showModal() {
      this.modalVisible = true;
    },
    handleOk(e) {
      this.loading = true;
      // setTimeout(() => {
      this.modalVisible = false;
      this.loading = false;
      this.$emit("update:visible", false); // 触发自定义事件，通知外部visible的变化
      // }, 3000);
    },
    handleCancel(e) {
      this.modalVisible = false;
      this.$emit("update:visible", false); // 触发自定义事件，通知外部visible的变化
    },
  },
  beforeDestroy() {
    console.log("beforeDestroy:::this.modalVisible==", this.modalVisible);
  },
};
</script>

<style lang="less" scoped>
</style>
