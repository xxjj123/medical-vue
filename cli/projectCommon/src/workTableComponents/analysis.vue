<template>
  <div style="height: 100%; width: 100%; display: flex">
    <div ref="leftChart" style="flex: 1" />
    <div ref="rightChart" style="flex: 1" />
  </div>
</template>

<script>
import echarts from './chartImport';

export default {
  name: 'analysis',
  props: {
    moduleId: String,
  },
  data() {
    return {
      rightChart: null,
      leftChart: null,
    };
  },
  mounted() {
    setTimeout(() => {
      this.rightChart = echarts.init(this.$refs.rightChart);
      this.drawRightChart();

      this.leftChart = echarts.init(this.$refs.leftChart);
      this.drawLeftChart();
    }, 0);
  },
  beforeDestroy() {
    this.rightChart.dispose();
    this.leftChart.dispose();
  },
  methods: {
    drawRightChart() {
      const option = {
        tooltip: {
          trigger: 'item',
        },
        legend: {
          top: '5%',
          left: 'center',
        },
        series: [
          {
            type: 'pie',
            top: '50',
            radius: ['65%', '80%'],
            avoidLabelOverlap: false,
            label: {
              show: true,
              position: 'outside',
            },
            labelLine: {
              show: true,
            },
            data: [
              { value: 1935, name: '1/1' },
              { value: 3533, name: '1/3' },
              { value: 2608, name: '1/2' },
            ],
          },
        ],
      };
      this.rightChart.setOption(option);
    },
    drawLeftChart() {
      const option = {
        xAxis: {
          type: 'category',
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: 'line',
          },
        ],
      };
      this.leftChart.setOption(option);
    },
  },
};
</script>

<style scoped></style>
