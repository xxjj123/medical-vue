// 引入moment的相应的locale
// import 'moment/src/locale/zh-cn'

// 且你可以在此对其进行覆盖/修改
export const overrideUiLocales = {};

export default {
  login: {
    systemLogin: '系统登录',
    systemLoginTips: 'SYSTEM LOGIN',
    userName: '用户名',
    password: '密码',
    userNameRequire: '请输入用户名！',
    userNameLength: '长度限制',
    passwordRequire: '请输入密码！',
    passwordOldRequire: '请输入原始密码！',
    changePassword: '修改密码',
    login: '立即登录',
    explain: 'Ta+3 404开发框架',
    newPassword: '新密码',
    inputNewPasswordRequire: '请输入新密码!',
    inputNewPasswordAgain: '再次输入新密码',
    passwordStrenthSimple: '请输入6位数字',
    passwordStrenth1: '请至少包含大写字母、小写字母、数字、特殊字符(除去空格)中的',
    passwordStrenth2: '种，且长度为8~20位',
    passwordDifferentTips: '两次密码不同！',
    verificationCode: '验证码',
    verificationCodeRequire: '请输入验证码！',
    getVerificationCodeTips: '点击获取验证码',
    backgroundImg: '背景图',
    dragImg: '拖动图',
    sureToChange: '向右滑动确认修改',
    loginMode: {
      SMSLogin: '短信登录',
      SMSLoginTips: 'SMS LOGINING',
      OtherLogin: '其它登录',
      OtherLoginTips: 'OTHER LOGIN',
      smsLoginTips: '短信验证码登录',
      userPwdLoginTips: '用户名密码登录',
    },
    pswdSame: '新密码不能与旧密码相同',
    pswdChangeSuccessTips: '密码修改成功！',
    ok: '确认',
    cancel: '取消',
    verify: {
      verifyTitle: '请完成安全验证',
      validationSucceeded: '验证成功',
      validationFailed: '验证失败',
      waitingVerification: '等待验证',
      pointTips: '请依次点击',
    },
  },
};
