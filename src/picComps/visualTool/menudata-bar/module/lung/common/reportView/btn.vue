<template>
  <div class="report_btn" style="width:100%">
    <ta-button class="btn_radius_8" type="primary" size="large" style="width:100%"
      @click="handle_open_report">报告</ta-button>

    <!-- <reportModal :visible.sync="reportModal_visible" :findingText="findingText" :diagnosisText="diagnosisText"
      :contentMainData="contentMainData_base"></reportModal> -->

    <reportView :reportData="reportData" :visible="reportModal_visible"></reportView>
  </div>
</template>
<script lang='javascript'>
// import reportModal from "./module/report-modal.vue";

import reportView from "./index.vue";

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";


export default {
  name: 'reportViewBtn',
  components: {
    // reportModal
    reportView
  },
  props: {
    finding: Array,
    diagnosis: Array,
    reportData: Object
  },
  data() {
    return {
      reportModal_visible: false,

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
      this.$emit("saveResult")


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
