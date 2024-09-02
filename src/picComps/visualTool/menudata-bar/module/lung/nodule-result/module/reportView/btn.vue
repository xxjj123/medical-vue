<template>
  <div class="report_btn" style="width:100%">
    <ta-button class="btn_radius_8" type="primary" size="large" style="width:100%"
      @click="handle_open_report">报告</ta-button>

    <reportModal :visible.sync="reportModal_visible"></reportModal>
  </div>
</template>
<script lang='javascript'>
import reportModal from "./module/report-modal.vue";
export default {
  name: 'reportViewBtn',
  components: {
    reportModal
  },
  data() {
    return {
      reportModal_visible: false,
    }
  },
  methods: {
    handle_open_report() {
      this.reportModal_visible = true;
    }
  }
}
</script>
<style lang='less' scoped>
.btn_radius_8 {
  border-radius: 8px;
}
</style>
