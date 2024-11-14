<template>
  <div class="report_btn" style="width:100%">
    <ta-button class="btn_radius_8" type="primary" size="large" style="width:100%"
      @click="handle_open_report">报告</ta-button>

    <!-- <reportModal :visible.sync="reportModal_visible" :findingText="findingText" :diagnosisText="diagnosisText"
      :contentMainData="contentMainData_base"></reportModal> -->

    <reportView :visible.sync="reportModal_visible" :findingText="findingText" :diagnosisText="diagnosisText"
      :contentMainData="contentMainData_base"></reportView>
  </div>
</template>
<script lang='javascript'>
// import reportModal from "./module/report-modal.vue";

import reportView from "./reportView.vue";

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";


export default {
  name: 'reportViewBtn',
  components: {
    // reportModal
    reportView
  },
  props: {
    finding: Array,
    diagnosis: Array
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
    findingText: {
      get() {
        return this.finding.map(item => item.desc).join("\n");
      }
    },
    diagnosisText: {
      get() {
        return this.diagnosis.map(item => item.desc).join("\n");
      }
    }
    // ...mapGetters("viewReportsStore", ["get_reports_tag", "get_reports_yxsj_content", "get_reports_yxzd_content"]),
  },
  methods: {
    // ...mapMutations("viewReportsStore", ["SET_REPORTS_TAG", "SET_REPORTS_YXSJ_CONTENT", "SET_REPORTS_YXZD_CONTENT"]),
    handle_open_report() {

      console.log("this.$parent=======", this.$parent)

      console.log("get_reports_yxsj_content===@", this.finding);
      console.log("get_reports_yxzd_content===@", this.diagnosis);
      // this.contentMainData_base.yxsj_content = this.get_reports_yxsj_content;
      // this.contentMainData_base.yxzd_content = this.get_reports_yxzd_content;

      this.contentMainData_base.yxsj_content = this.finding.map(item => item.desc).join("\n");
      this.contentMainData_base.yxzd_content = this.diagnosis.map(item => item.desc).join("\n");



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
