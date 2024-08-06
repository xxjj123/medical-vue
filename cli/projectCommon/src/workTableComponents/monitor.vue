<template>
  <div ref="chart" style="height: 255px; width: 95%; margin: 0 auto" />
</template>

<script>
import moment from 'moment';
import echarts from './chartImport';

export default {
  name: 'monitor',
  props: {
    moduleId: String,
  },
  data() {
    return {
      chart: null,
      onlineSeriesData: [],

      BASE_URL: '/logmg/loginLog/loginLogAnalysisRestService/',
      chartSetting: {
        legend: {
          top: 10,
          formatter: '时点登录人数',
        },
        tooltip: {
          formatter: (data) => {
            return `${data.seriesName}<br/>${data.name} (${data.data}人)`;
          },
        },
        yAxis: {
          axisLabel: {
            formatter: '{value}人',
          },
        },
        grid: {
          bottom: '10%',
        },
        toolbox: {
          feature: {
            magicType: { type: ['line', 'bar'] },
            saveAsImage: {},
          },
        },
      },
      chartData: {
        columns: ['日期', '时点在线人数'],
        rows: [],
      },
      timer: '',
    };
  },
  created() {
    this.timer = setInterval(this.loadData, 60000);
  },
  mounted() {
    this.chart = echarts.init(this.$refs.chart);
    this.loadData();
  },
  beforeDestroy() {
    this.chart.dispose();
    // 销毁定时器
    clearInterval(this.timer);
  },
  methods: {
    drawChart() {
      const option = {
        legend: this.chartSetting.legend,
        tooltip: this.chartSetting.tooltip,
        xAxis: {
          data: this.onlineXdata,
        },
        yAxis: this.chartSetting.yAxis,
        grid: this.chartSetting.grid,
        toolbox: this.chartSetting.toolbox,
        series: [
          {
            name: '时点在线人数',
            data: this.onlineSeriesData,
            type: 'line',
            smooth: true,
          },
        ],
      };
      this.chart.setOption(option);
    },
    loadData() {
      const timeData = {};
      this.getSysTime(timeData, (result) => {
        this.onlineDate = moment(result.data.sysdate, 'YYYY-MM-DD');
        this.onlineEndTime = moment();
        const temp = this.onlineEndTime.clone();
        this.onlineStartTime = temp.subtract('1', 'hours');
        const searchDate = this.onlineDate ? this.onlineDate.format('YYYY-MM-DD') : '';
        const onlineStartTime = this.onlineStartTime ? this.onlineStartTime.format('HH:mm') : '';
        const onlineEndTime = this.onlineEndTime ? this.onlineEndTime.format('HH:mm') : '';
        const data = {
          searchDate,
          startTime: onlineStartTime,
          endTime: onlineEndTime,
        };
        this.analysisOnlineStatInfo(data, (res) => {
          this.onlineChartData = res.data.onlineChartData;
          this.onlineXdata = this.getStatLogInfoXdata(this, 'online');
          this.onlineSeriesData = this.sortStatLogDataByHours(this, 'online');
          this.drawChart();

          const showData = [];
          // eslint-disable-next-line array-callback-return
          this.onlineXdata.map((item, index) => {
            showData.push({ 日期: item, 时点在线人数: this.onlineSeriesData[index] });
          });
          this.chartData.rows = showData;
        });
      });
    },
    getSysTime(data, callBack) {
      Base.submit(
        null,
        {
          url: `${this.BASE_URL}getSysTime`,
          data,
          _modulePartId_: this.moduleId,
          showPageLoading: false,
        },
        {
          successCallback: (res) => callBack(res),
        },
      );
    },
    analysisOnlineStatInfo(data, callBack) {
      Base.submit(
        null,
        {
          url: `${this.BASE_URL}analysisOnlineStatInfo`,
          data,
          _modulePartId_: this.moduleId,
          showPageLoading: false,
        },
        {
          successCallback: (res) => callBack(res),
        },
      );
    },
    getStatLogInfoXdata(_source, tabId) {
      let start = [];
      let end = [];
      if (tabId === 'online') {
        start = _source.onlineStartTime.format('HH:mm').split(':');
        end = _source.onlineEndTime.format('HH:mm').split(':');
      } else if (tabId === 'login') {
        start = _source.loginStartTime.format('HH:mm').split(':');
        end = _source.loginEndTime.format('HH:mm').split(':');
      }
      let start_hour = parseInt(start[0], 10);
      let start_minut = parseInt(start[1], 10);
      const end_hour = parseInt(end[0], 10);
      const end_minut = parseInt(end[1], 10);
      const rdata = [];
      do {
        rdata.push(formatXdata(start_hour, start_minut));
        if (start_hour === end_hour && start_minut === end_minut) {
          break;
        }
        if (start_minut < 59 && start_minut >= 0) {
          start_minut++;
        } else if (start_minut === 59) {
          start_hour++;
          start_minut = 0;
        } else {
          _source.$message.error('在线时点分析图表构造出错！');
          break;
        }
      } while (true);

      function formatXdata(start_hour_origin, start_minut_origin) {
        let tmp_hour = `${start_hour_origin}`;
        let tmp_minut = `${start_minut_origin}`;
        if (tmp_hour.length < 2) {
          tmp_hour = `0${tmp_hour}`;
        }
        if (tmp_minut.length < 2) {
          tmp_minut = `0${tmp_minut}`;
        }

        return `${tmp_hour}:${tmp_minut}`;
      }

      if (rdata.length <= 60) {
        if (tabId === 'online') {
          _source.onlineXInterval = 4;
        } else if (tabId === 'login') {
          _source.loginXInterval = 4;
        }
      } else if (rdata.length > 60) {
        if (tabId === 'online') {
          _source.onlineXInterval = parseInt(rdata.length / 10 - 1, 10);
        } else if (tabId === 'login') {
          _source.loginXInterval = parseInt(rdata.length / 10 - 1, 10);
        }
      }
      return rdata;
    },

    sortStatLogDataByHours(_source, tabId) {
      let data = [];
      let start = [];
      let end = [];
      if (tabId === 'online') {
        data = _source.onlineChartData;
        start = _source.onlineStartTime.format('HH:mm').split(':');
        end = _source.onlineEndTime.format('HH:mm').split(':');
      } else if (tabId === 'login') {
        data = _source.loginChartData;
        start = _source.loginStartTime.format('HH:mm').split(':');
        end = _source.loginEndTime.format('HH:mm').split(':');
      }
      let start_hour = parseInt(start[0], 10);
      let start_minut = parseInt(start[1], 10);
      const end_hour = parseInt(end[0], 10);
      const end_minut = parseInt(end[1], 10);
      const rdata = [];

      let con = 0;
      do {
        let tmp_hour = `${start_hour}`;
        let tmp_minut = `${start_minut}`;
        if (tmp_hour.length < 2) {
          tmp_hour = `0${tmp_hour}`;
        }
        if (tmp_minut.length < 2) {
          tmp_minut = `0${tmp_minut}`;
        }
        const result_time = `${tmp_hour}:${tmp_minut}`;
        for (const i in data) {
          if (result_time === data[i].type) {
            rdata.push(data[i].count);
          }
        }
        con++;
        if (rdata.length < con) {
          rdata.push(0);
        }
        if (start_hour === end_hour && start_minut === end_minut) {
          break;
        }
        if (start_minut < 59 && start_minut >= 0) {
          start_minut++;
        } else if (start_minut === 59) {
          start_hour++;
          start_minut = 0;
        } else {
          _source.$message.error('时点分析图表构造出错！');
          break;
        }
      } while (true);
      return rdata;
    },
  },
};
</script>

<style scoped></style>
