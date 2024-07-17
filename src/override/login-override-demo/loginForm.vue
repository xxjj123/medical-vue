<template>
  <ta-spin :spinning="spinning">
    <ta-form
      :auto-form-create="
        (form) => {
          this.form = form;
        }
      "
      layout="vertical"
      class="cus_form"
    >
      <ta-form-item
        field-decorator-id="username"
        :field-decorator-options="{
          rules: [
            { required: true, message: $t('login.userNameRequire') },
            { max: 30, message: $t('login.userNameLength') },
          ],
        }"
      >
        <ta-input
          class="cus_input"
          :placeholder="$t('login.userName')"
          @blur="checkUser"
          @pressEnter="gotoDeal($event, 'password')"
        >
          <!-- <ta-icon slot="prefix" type="user" /> -->
          <i slot="prefix" class="ico_user"></i>
        </ta-input>
      </ta-form-item>
      <ta-form-item
        field-decorator-id="password"
        :field-decorator-options="{
          rules: [{ required: true, message: $t('login.passwordRequire') }],
        }"
      >
        <ta-input
          class="cus_input"
          :placeholder="$t('login.password')"
          type="password"
          style="width: 70%"
          autocomplete="new-password"
          @pressEnter="
            gotoDeal($event, simpleCheckCodeState ? 'checkCode' : 'sbbtn')
          "
        >
          <!-- <ta-icon slot="prefix" type="lock" /> -->
          <i slot="prefix" class="ico_lock"></i>
        </ta-input>
        <ta-button
          tabindex="-1"
          type="link"
          style="width: 25%"
          @click="showModifyPasswordPane"
        >
          {{ $t("login.changePassword") }}
        </ta-button>
      </ta-form-item>
      <ta-form-item
        v-if="simpleCheckCodeState"
        field-decorator-id="checkCode"
        :field-decorator-options="{
          rules: [
            { required: true, message: $t('login.verificationCodeRequire') },
          ],
        }"
      >
        <ta-input
          ref="checkCode"
          style="width: 60%"
          :placeholder="$t('login.verificationCode')"
          @pressEnter="gotoDeal($event, 'sbbtn')"
        >
          <ta-icon slot="prefix" type="appstore" />
        </ta-input>
        <img
          style="width: 40%"
          :src="imgSrc"
          :title="$t('login.getVerificationCodeTips')"
          @click="refreshCode()"
          alt="image"
        />
      </ta-form-item>

      <!-- 新版验证码 -->
      <login_src_verify
        v-if="showClickWordCheckCode || showBlockPuzzleCheckCode"
        ref="verify"
        :captcha-type="captchaType"
        :img-size="{ width: '330px', height: '155px' }"
        @success="success"
      />
      <ta-button
        class="cus_button"
        id="sbbtn"
        type="primary"
        block
        @click="useVerify"
      >
        {{ $t("login.login") }}
      </ta-button>
      <div style="text-align: right; padding: 5px 0px">
        <a class="link-type" href="register.html">注册用户</a>
      </div>
    </ta-form>
  </ta-spin>
</template>

<script>
import {
  getStorage,
  setCookie,
  clientSystem,
  clientScreenSize,
  clientBrowser,
  getRandom,
} from "@yh/ta-utils";
import { cryptoAsymmetricFn } from "@yh/ta404-ui/es/utils/js/cryptoFn";

import { mapGetters } from "vuex";
import faceConfig from "faceConfig";

export default {
  name: "loginForm",
  data() {
    return {
      imgSrc: null,
      captchaToken: null,
      cryptInfo: null,
      captchaType: "clickWord",
      captchaParams: null,
      spinning: false,
    };
  },
  computed: {
    ...mapGetters({
      sysState: "getSysState",
      simpleCheckCodeState: "simpleCheckCodeState",
      pddwordRSAState: "pddwordRSAState",
      showClickWordCheckCode: "clickWordCheckCodeState",
      showBlockPuzzleCheckCode: "showBlockPuzzleCheckCode",
      clickWordCheckCodeState: "clickWordCheckCodeState",
      clickBlockPuzzleCodeState: "clickBlockPuzzleCodeState",
    }),
  },
  watch: {
    simpleCheckCodeState(_now, _old) {
      this.refreshCode();
    },
    sysState(_now, _old) {
      this.captchaType = this.sysState?.checkCodeType;
    },
  },
  mounted() {
    this.captchaType = this.sysState?.checkCodeType;
    document.getElementById("username").focus();
    this.cryptInfo = getStorage("Ta$cacheCryptInfo", "Ta$cacheCryptInfo", {
      isLocal: true,
    });
    this.refreshCode();
  },
  methods: {
    success(params) {
      // params 返回的二次验证参数, 和登录参数一起回传给登录接口，方便后台进行二次验证
      this.captchaParams = params;
      this.handleSubmit();
    },
    useVerify() {
      if (this.clickWordCheckCodeState || this.clickBlockPuzzleCodeState) {
        this.form.validateFields((err, _values) => {
          if (!err) {
            this.$refs.verify.show();
          }
        });
      } else {
        this.handleSubmit();
      }
    },
    // checkUser
    checkUser(e) {
      let { value } = e.target;
      if (!value) {
        return false;
      }
      if (this.sysState?.encryptLoginId === true) {
        value = cryptoAsymmetricFn(value);
      }
      if (value) {
        Base.submit(null, {
          url: "loginRestService/checkUser",
          showPageLoading: false,
          withCredentials: true,
          data: {
            username: value,
          },
        }).then((data) => {
          // 校验成功处理次数
          this.$store.commit("setSysCfg", {
            sessionPasswordErrorNumber: data.data.sessionPasswordErrorNumber,
          });
        });
      }
    },
    refreshCode() {
      if (this.simpleCheckCodeState) {
        const data = {
          captchaType: "simple",
          ts: Date.now(), // 现在的时间戳
        };
        Base.submit(null, {
          url: "captcha/get",
          data,
        }).then((data) => {
          this.captchaToken = data.data.resultData.repData.token;
          this.imgSrc = `data:image/png;base64,${data.data.resultData.repData.originalImageBase64}`;
        });
      }
    },
    handleSubmit() {
      this.spinning = true;
      let formData = this.form.getFieldsValue();
      const systemInfo = {
        clientSystem,
        clientScreenSize,
        clientBrowser,
      };
      // 系统信息
      formData = Object.assign(formData, systemInfo);
      // 加密
      this.pddwordRSAState &&
        (formData.password = cryptoAsymmetricFn(formData.password));
      // 用户名
      if (this.sysState?.encryptLoginId === true) {
        formData.username = cryptoAsymmetricFn(formData.username);
      }

      // 针对新版本验证码进行二次校验
      if (this.clickWordCheckCodeState || this.clickBlockPuzzleCodeState) {
        formData.captchaVerification = this.captchaParams.captchaVerification;
      }

      // 简单验证码需要传captchaToken
      if (this.simpleCheckCodeState) {
        formData.captchaToken = this.captchaToken;
      }

      Base.submit(
        this.form,
        {
          url: "/login",
          data: formData,
          autoValid: true,
        },
        {
          successCallback: (data) => {
            this.spinning = false;
            if (this.showClickWordCheckCode) {
              this.$refs.verify.closeBox();
            }
            const accessToken = data.data["TA-JTOKEN"];
            const refreshToken = data.data["TA-RJTOKEN"];
            if (
              accessToken !== null &&
              accessToken !== undefined &&
              accessToken !== ""
            ) {
              setCookie(`${faceConfig.basePath}TA-JTOKEN`, accessToken, 0, "/");
            }
            if (
              refreshToken !== null &&
              accessToken !== undefined &&
              refreshToken !== ""
            ) {
              setCookie(
                `${faceConfig.basePath}TA-RJTOKEN`,
                refreshToken,
                0,
                "/"
              );
            }
            // window.location.href = 'xxx.html?_modulePartId_=xxx';
            //window.location.href = "index.html";
            // window.location.href =
            //   "cleverAiPacs.html#/manageDicom?_modulePartId_=59181f21753d49c4b6f0274ee29c203d";
            window.location.href = faceConfig.loginFormConfig.sysBaseSortUrl;
          },
          failCallback: (data) => {
            this.spinning = false;
            if (this.showClickWordCheckCode || this.showBlockPuzzleCheckCode) {
              this.$refs.verify.closeBox();
            }
            if (data.errors[0].errorCode === "418") {
              this.refreshCode();
            } else {
              document.getElementById("username").focus();
              // 修改次数
              data.data.passwordDefaultNum !== null &&
                this.$store.commit("setSysCfg", {
                  sessionPasswordErrorNumber: data.data.passwordDefaultNum,
                });
              this.refreshCode();
            }
          },
        }
      );
    },
    mockUserLogin() {
      Base.submit(
        null,
        {
          url: "/authentication/mockuser",
          // data: formData,
          autoValid: true,
        },
        {
          successCallback: (data) => {
            const accessToken = data.data["TA-JTOKEN"];
            const refreshToken = data.data["TA-RJTOKEN"];
            if (
              accessToken !== null &&
              accessToken !== undefined &&
              accessToken !== ""
            ) {
              setCookie(`${faceConfig.basePath}TA-JTOKEN`, accessToken, 0, "/");
            }
            if (
              refreshToken !== null &&
              accessToken !== undefined &&
              refreshToken !== ""
            ) {
              setCookie(
                `${faceConfig.basePath}TA-RJTOKEN`,
                refreshToken,
                0,
                "/"
              );
            }
            window.location.href = "index.html";
          },
          failCallback: (_data) => {
            //
          },
        }
      );
    },
    gotoDeal(e, nextEl) {
      const event = e || window.event;
      const el = event.target || event.srcElement;
      if (el.value) {
        document.getElementById(nextEl).focus();
      } else {
        el.focus();
      }
    },
    showModifyPasswordPane() {
      this.$emit("modifyPasswordPaneCtr");
    },
  },
};
</script>


<style lang="less" scoped>
@base_font-size: 18px;
.func__iconDef(@pic,@width:20px,@height:20px) {
  width: @width;
  height: @height;
  background-image: url(@pic);
  background-position: 0 0;
  background-repeat: no-repeat;
  background-size: cover;
}
.cus_form {
  ::v-deep.ant-btn {
    &.ant-btn-link {
      font-size: @base_font-size;
    }
  }

  .link-type {
    font-size: @base_font-size;
  }
}
.cus_input {
  &.ant-input-affix-wrapper {
    ::v-deep .ant-input {
      height: 62px !important;
      background-color: transparent;
      border-radius: 8px;
      border-color: #3b5367;
      font-size: 18px;
      color: #fff;
      &:not(:first-child) {
        padding-left: 44px !important;
      }
    }
  }

  .ico_user {
    .func__iconDef("./assets/img/user.png");
  }

  .ico_lock {
    // .func__iconDef();
    .func__iconDef("./assets/img/lock.png",20px,23px);
  }
}

.cus_button {
  height: 57px;
  font-size: 22px;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 20px;
}
</style>
