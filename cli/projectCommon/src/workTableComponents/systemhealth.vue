<template>
  <div style="height: 100%">
    <div class="block-statistic block-statistic-fir">
      <div class="statistic-title">今日访问异常次数</div>
      <div class="statistic-content">
        {{ systemhealth.serverExceptionNum }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'systemhealth',
  data() {
    return {
      systemhealth: {},
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      Base.submit(null, {
        url: 'domain/orguserauth/statisticAnalysisRestService/querySystemHealth',
      }).then((res) => {
        this.systemhealth = res.data.data;
      });
    },
  },
};
</script>

<style scoped>
.block-statistic {
  display: inline-block;
  width: 23%;
  text-align: center;
  border: #f5f5f5 1px solid;
  margin-right: 1%;
  margin-left: 1%;
  border-radius: 5px;
  background-color: #fafafa;
  -webkit-box-shadow: 0 2px 4px 0 hsla(0, 0%, 65.1%, 0.35);
  box-shadow: 0 2px 4px 0 hsla(0, 0%, 65.1%, 0.35);
}
.block-statistic-fir {
  margin-top: 8%;
}
.statistic-content {
  color: rgba(0, 0, 0, 0.85);
  font-family:
    -apple-system,
    BlinkMacSystemFont,
    Segoe UI,
    PingFang SC,
    Hiragino Sans GB,
    Microsoft YaHei,
    Helvetica Neue,
    Helvetica,
    Arial,
    sans-serif,
    SimSong,
    SimSun,
    EUDC,
    Apple Color Emoji,
    Segoe UI Emoji,
    Segoe UI Symbol;
  font-size: 30px;
  margin-top: 20px;
  text-align: right;
  margin-bottom: 10px;
  font-weight: 700;
  padding-right: 20px;
}
.statistic-title {
  /*color: rgba(0, 0, 0, .85);*/
  font-size: 18px;
  padding-left: 20px;
  margin-top: 10px;
  text-align: left;
  border-bottom: white 3px solid;
  padding-bottom: 5px;
}
</style>
