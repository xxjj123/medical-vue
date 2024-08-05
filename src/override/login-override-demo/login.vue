<template>
  <div id="app" class="body">
    <div id="index" ref="appRef">
      <header class="page_top_sider">
        <div class="mid_title">
          <span>医学影像辅助诊断系统</span>
        </div>
      </header>
      <div class="bg">
        <!-- <header> -->
        <!-- <div class="logo"> -->
        <!-- <img v-if="false" src="./img/logo.png" alt="log" /> -->
        <!-- <img v-if="false" :src="dynamicUrl_logo" alt="log" /> -->
        <!-- </div> -->
        <!-- </header> -->

        <!-- <img
          src="@yh/cli-pages-login/src/img/taimg.png"
          style="height: 60%; margin-left: 10%"
          alt="taimg"
        /> -->
        <!-- <img
      :src="dynamicUrl_taimg"
      style="height: 60%; margin-left: 10%"
      alt="taimg"
    /> -->
        <div class="login-con login_container_cus">
          <div v-if="!showSmsLogin">
            <!-- <div class="header1">
          {{ $t("login.systemLogin") }}
          <span>{{ $t("login.systemLoginTips") }}</span>
        </div> -->
            <login_src_login-form
              ref="loginForm"
              @modifyPasswordPaneCtr="modifyPasswordPaneCtr"
            />
            <div
              v-if="this.openMockUser"
              style="float: right; margin-right: 10px"
            >
              <a class="link-type" @click="mockUserLogin">模拟用户登录</a>
            </div>
          </div>
          <div v-if="showSmsLogin">
            <div class="header1">
              {{ $t("login.loginMode.SMSLogin") }}
              <span>{{ $t("login.SMSLoginTips") }}</span>
            </div>
            <login_src_sms-login-form />
          </div>
          <template v-if="this.openSocialLogin || this.openSmsLogin">
            <ta-divider orientation="left" class="other-login">
              {{ $t("login.loginMode.OtherLogin") }}
              <span>{{ $t("login.loginMode.OtherLoginTips") }}</span>
            </ta-divider>
          </template>
          <div style="text-align: left">
            <ta-button
              v-if="this.openSmsLogin"
              type="link"
              @click="showSmsLoginMethod"
            >
              {{
                showSmsLogin
                  ? $t("login.loginMode.userPwdLoginTips")
                  : $t("login.loginMode.smsLoginTips")
              }}
            </ta-button>
            <div v-if="this.openSocialLogin">
              <login_src_social-list pass-state="1" />
            </div>
          </div>
        </div>

        <ta-modal
          :title="$t('login.changePassword')"
          :visible="showModifyPasswordPane"
          :footer="null"
          :mask-closable="false"
          :destroy-on-close="true"
          width="390px"
          :body-style="{ paddingBottom: '10px' }"
          @cancel="modifyPasswordPaneCtr"
        >
          <login_src_modify-password
            :show.sync="showModifyPasswordPane"
            pass-state="1"
          />
        </ta-modal>

        <footer>
          <span>{{ $t("login.explain") }}</span>
        </footer>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import drawMixin from "./assets/js/mixins/drawMixin";

export default {
  name: "login",
  mixins: [drawMixin],
  data() {
    const logoName = "logo";
    const taImgName = "taimg";
    return {
      showModifyPasswordPane: false,
      showSocialList: true,
      showSmsLogin: false,
      // 注意,这里必须使用模板字符串,而不能将字符串通过+进行拼接
      dynamicUrl_logo: new URL(`./img/${logoName}.png`, import.meta.url).href,
      dynamicUrl_taimg: new URL(`./img/${taImgName}.png`, import.meta.url).href,
    };
  },
  computed: {
    ...mapGetters({
      openSocialLogin: "openSocialLogin",
      openSmsLogin: "openSmsLogin",
      openMockUser: "openMockUser",
    }),
  },
  watch: {
    showModifyPasswordPane(value) {
      if (value === false) {
        this.$refs.loginForm.refreshCode();
      }
    },
  },
  created() {
    this.$store.dispatch("getSysCfg");
    // console.log("dynamicUrl_logo=", this.dynamicUrl_logo);
    // console.log("dynamicUrl_taimg=", this.dynamicUrl_taimg, import.meta.url);
  },
  methods: {
    modifyPasswordPaneCtr() {
      this.showModifyPasswordPane = !this.showModifyPasswordPane;
    },
    showSmsLoginMethod() {
      this.showSmsLogin = !this.showSmsLogin;
    },
    mockUserLogin() {
      this.$refs.loginForm.mockUserLogin();
    },
  },
};
</script>

<style type="text/less" lang="less">
// 正式互联网环境要改为class属性(.isRedirect)
body {
}
</style>

<style scoped type="text/less" lang="less">
.body {
  // background: @primary-color;
  // background: black;
  height: 100%;
  background: url("./assets/img/loginBg.png") no-repeat;
  background-size: 100% 100%;
  background-position: center center;
}

header {
  padding: 50px 50px;
}

footer {
  width: 100%;
  position: fixed;
  bottom: 0px;
  text-align: center;

  span {
    width: 576px;
    height: 13px;
    font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    line-height: 90px;
    letter-spacing: 0px;
    color: #ffffff;
  }
}

.login-con {
  background: @body-background;
  border-radius: 2px;
  padding: 50px;
  width: 366px;
  box-sizing: border-box;
  position: absolute;
  right: 15%;
  top: 25%;

  .header1 {
    height: 60px;
    font-size: 24px;
    color: @text-color;

    > span {
      margin-left: 10px;
      font-size: 16px;
      color: @text-color-secondary;
    }
  }
}
.other-login {
  margin: 5px 0px;
  > span {
    font-size: @font-size-base;
    color: @text-color;
    > span {
      margin-left: 10px;
      font-size: @font-size-sm;
      color: @text-color-secondary;
    }
  }
}

.login_container_cus {
  width: 443px;
  height: 441px;
  background: transparent url(./assets/img/infoBg.png) no-repeat center center /
    cover;
  padding-top: 89px;
}

.page_top_sider {
  padding: 0;
  margin: 0;
  height: 112px;
  background: url("./assets/img/siderBar.png") no-repeat;
  // background-size: 100% 100%;
  background-position: center 76px;
  text-align: center;
  .mid_title {
    text-align: center;
    margin: 0 auto;
    padding-top: 17px;
    span {
      letter-spacing: 4px;
      text-indent: 27px;
      display: inline-block;
      font-family: "open_sanssemibold";
      background: linear-gradient(
        180deg,
        #ffffff 0%,
        #fffffffa 38%,
        #31b0b3 100%
      );
      -webkit-background-clip: text;
      color: transparent;
    }
    font-weight: 600;
    font-size: 44px;
    color: #ffffff;
    line-height: 62px;
    font-style: normal;
  }
}

#index {
  width: 1920px;
  height: 1080px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: left top;
  overflow: hidden;
  .bg {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 16px 16px 0 16px;
  }
}
</style>
