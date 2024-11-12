<template>
  <div class="report_btn" style="width:100%">
    <ta-button class="btn_radius_8" type="primary" size="large" style="width:100%"
      @click="handle_open_report">报告</ta-button>

    <reportModal :visible.sync="reportModal_visible" :contentMainData="contentMainData_base"></reportModal>
  </div>
</template>
<script lang='javascript'>
import reportModal from "./module/report-modal.vue";
import {mapState, mapMutations, mapActions, mapGetters} from "vuex";


export default {
  name: 'reportViewBtn',
  components: {
    reportModal
  },
  data() {
    return {
      reportModal_visible: false,
      contentMainData_base: {
        yxsj_content: "",
        yxzd_content: "",
      },
    }
  },
  computed: {
    ...mapGetters("viewReportsStore", ["get_reports_tag", "get_reports_yxsj_content", "get_reports_yxzd_content"]),
  },
  methods: {
    ...mapMutations("viewReportsStore", ["SET_REPORTS_TAG", "SET_REPORTS_YXSJ_CONTENT", "SET_REPORTS_YXZD_CONTENT"]),
    handle_open_report() {

      console.log("this.$parent=======", this.$parent)

      console.log("get_reports_yxsj_content===@", this.get_reports_yxsj_content);
      console.log("get_reports_yxzd_content===@", this.get_reports_yxzd_content);
      this.contentMainData_base.yxsj_content = this.get_reports_yxsj_content;
      this.contentMainData_base.yxzd_content = this.get_reports_yxzd_content;



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
