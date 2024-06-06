<template>
  <div class="User">
    <ta-border-layout
      :show-border="false"
      :layout="{ left: '130px', right: '400px' }"
      :left-cfg="{ ...config, layoutConStyle: { ...config.layoutConStyle, display: 'table' } }"
      :right-cfg="config"
      :center-cfg="{
        ...config,
        layoutConStyle: {
          ...config.layoutConStyle,
          display: 'table',
          'border-right': '1px solid rgb(218,218,218)',
        },
      }"
    >
      <div slot="left" class="left">
        <ta-avatar :size="72" icon="user" />
      </div>
      <div class="main">
        <div class="greeting">{{ greeting }}，{{ userName }}，祝你开心每一天！</div>
        <div class="info">Tips: Today is also a day full of hope, come on!</div>
      </div>
      <div slot="right" class="right">
        <div class="timeDiv">
          <span class="time">{{ time }}</span>
        </div>
        <div class="dateDiv">
          <span class="date"
            >{{ dayOfWeek }} <br />
            {{ date }}</span
          >
        </div>
      </div>
    </ta-border-layout>
  </div>
</template>

<script>
export default {
  name: 'user',
  props: {
    moduleId: String,
  },
  data() {
    const arrWeek = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    return {
      config: { showBorder: false, layoutConStyle: { overflow: 'hidden' } },
      arrWeek,
      greeting: '',
      userName: '',
      date: '',
      time: '',
      dayOfWeek: '',
      timer: '',
    };
  },
  created() {
    // 定时器间隔太短的话可能能耗比较高
    this.userName = top.indexTool.getUserInfo().userName;
    this.timer = setInterval(this.refresh, 60000);
    // 销毁定时器
    this.$once('hook:beforeDestroy', () => {
      clearInterval(this.timer);
    });
  },
  mounted() {
    this.refresh();
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();
    if (hour < 12) {
      this.greeting = minute % 2 === 0 ? '早上好' : '早安';
    }
    if (hour < 19 && hour >= 12) {
      this.greeting = '下午好';
    }
    if (hour <= 23 && hour >= 19) {
      this.greeting = '晚上好';
    }
  },
  methods: {
    refresh() {
      let date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      let sMonth, sDay, sHour, sMiniute;
      if (month < 10) {
        sMonth = `0${month}`;
      } else {
        sMonth = month;
      }
      if (day < 10) {
        sDay = `0${day}`;
      } else {
        sDay = day;
      }
      if (hour < 10) {
        sHour = `0${hour}`;
      } else {
        sHour = hour;
      }
      if (minute < 10) {
        sMiniute = `0${minute}`;
      } else {
        sMiniute = minute;
      }
      this.date = `${year}年${sMonth}月${sDay}日`;
      this.time = `${sHour} : ${sMiniute}`;
      this.dayOfWeek = this.arrWeek[date.getDay()];
    },
  },
};
</script>

<style lang="less" scoped type="text/less ">
@keyframes fade-in {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.User {
  height: 100%;

  .header {
    line-height: 38px;
    font-weight: 700;
    font-size: @font-size-lg;
  }

  .left {
    display: table-cell;
    vertical-align: middle;
  }

  .main {
    display: table-cell;
    vertical-align: middle;

    .greeting {
      font-size: 20px;
      font-weight: 500;
      line-height: 28px;
      margin-top: 10px;
    }

    .info {
      margin-top: 15px;
      line-height: 22px;
      color: rgba(0, 0, 0, 0.45);
    }
  }

  .right {
    width: 100%;
    height: 100%;

    .timeDiv {
      width: 50%;
      height: 100%;
      float: left;
      font-size: 44px;
      display: table;

      .time {
        display: table-cell;
        vertical-align: middle;
        text-align: center;
        animation: fade-in 2s linear infinite;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
    }

    .dateDiv {
      width: 50%;
      height: 100%;
      float: left;
      display: table;

      .date {
        display: table-cell;
        vertical-align: middle;
        font-size: 20px;
      }
    }
  }
}
</style>
