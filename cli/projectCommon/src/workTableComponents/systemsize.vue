<template>
  <div>
    <div class="block-statistic block-statistic-fir">
      <div class="statistic-title">组织机构数量</div>
      <div class="statistic-content">
        {{ systemsize.orgNum }}
      </div>
    </div>
    <div class="block-statistic block-statistic-fir">
      <div class="statistic-title">经办管理账号数量</div>
      <div class="statistic-content">
        {{ systemsize.jbglNum }}
      </div>
    </div>
    <div class="block-statistic block-statistic-fir">
      <div class="statistic-title">自然人账号数量</div>
      <div class="statistic-content">
        {{ systemsize.zrrNum }}
      </div>
    </div>
    <div class="block-statistic block-statistic-fir">
      <div class="statistic-title">普通角色数量</div>
      <div class="statistic-content">
        {{ systemsize.pulicRoleNum }}
      </div>
    </div>
    <div class="block-statistic block-statistic-sec">
      <div class="statistic-title">代理角色数量</div>
      <div class="statistic-content">
        {{ systemsize.agentRoleNum }}
      </div>
    </div>
    <div class="block-statistic block-statistic-sec">
      <div class="statistic-title">管理角色数量</div>
      <div class="statistic-content">
        {{ systemsize.adminRoleNum }}
      </div>
    </div>
    <div class="block-statistic block-statistic-sec">
      <div class="statistic-title">受控资源项数量</div>
      <div class="statistic-content">
        {{ systemsize.controlResourceNum }}
      </div>
    </div>
    <div class="block-statistic block-statistic-sec">
      <div class="statistic-title">不受控资源项数量</div>
      <div class="statistic-content">
        {{ systemsize.noControlResourceNum }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'systemsize',
  data() {
    return {
      systemsize: {},
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    loadData() {
      Base.submit(null, {
        url: 'domain/orguserauth/statisticAnalysisRestService/querySystemSize',
      }).then((res) => {
        this.systemsize = res.data.data;
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
.block-statistic-sec {
  margin-top: 50px;
}
.block-statistic-fir {
  margin-top: 30px;
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
  font-weight: 700;
  margin-bottom: 10px;
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
.item .content {
  background-color: #f5f5f5 !important;
}
.vue-grid-item {
  background-color: #f5f5f5 !important;
}
</style>
