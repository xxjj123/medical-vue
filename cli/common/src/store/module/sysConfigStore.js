import { createWebStorage } from '@yh/ta-utils';
/**
 * 可选的系统配置模块
 * 加密配置等信息
 * @type {{mutations: {setSysCfg(*, *): void}, namespace: boolean, state: {sysCfg: {userCheckCode: boolean, openSmsLogin: boolean, sessionPasswordErrorNumber: number, passwordRSA: boolean, passwordValidationErrorNumber: number, checkCodeType: string, openSocialLogin: boolean}}, getters: { showClickWordCheckCode: sysConfigStore.getters.showClickWordCheckCode, passwordLevel: sysConfigStore.getters.passwordLevel, getSysState: (function(*): (*|sysConfigStore.state.sysCfg|{userCheckCode, openSmsLogin, sessionPasswordErrorNumber, passwordRSA, passwordValidationErrorNumber, checkCodeType, openSocialLogin}|state.sysCfg)), simpleCheckCodeState: sysConfigStore.getters.simpleCheckCodeState,  openSmsLogin: sysConfigStore.getters.openSmsLogin, showSimpleCheckCode: sysConfigStore.getters.showSimpleCheckCode, passwordRSAState: (function(*): boolean), openSocialLogin: sysConfigStore.getters.openSocialLogin}, actions: {getSysCfg({commit: *}): void}}}
 */
const sysConfigStore = {
  namespace: true,
  state: {
    sysCfg: {
      passwordRSA: true,
      userCheckCode: false,
      checkCodeType: 'simple',
      passwordValidationErrorNumber: 2,
      sessionPasswordErrorNumber: 0,
      openSocialLogin: false,
      openSmsLogin: false,
      openMockUser: false,
      enableSystemDictProtect: false,
    },
  },
  getters: {
    getSysState: (state) => {
      return state.sysCfg;
    },
    // 登录是否显示验证码
    simpleCheckCodeState: (state) => {
      if (
        state.sysCfg.userCheckCode &&
        state.sysCfg.checkCodeType === 'simple' &&
        state.sysCfg.sessionPasswordErrorNumber >= state.sysCfg.passwordValidationErrorNumber
      ) {
        return true;
      }
      return false;
    },
    // 登录是否显示验证码
    clickWordCheckCodeState: (state) => {
      if (
        state.sysCfg.userCheckCode &&
        state.sysCfg.checkCodeType === 'clickWord' &&
        state.sysCfg.sessionPasswordErrorNumber >= state.sysCfg.passwordValidationErrorNumber
      ) {
        return true;
      }
      return false;
    },
    // 登录是否显示验证码
    clickBlockPuzzleCodeState: (state) => {
      if (
        state.sysCfg.userCheckCode &&
        state.sysCfg.checkCodeType === 'blockPuzzle' &&
        state.sysCfg.sessionPasswordErrorNumber >= state.sysCfg.passwordValidationErrorNumber
      ) {
        return true;
      }
      return false;
    },
    // 是否配置显示验证码
    showSimpleCheckCode: (state) => {
      if (state.sysCfg.userCheckCode && state.sysCfg.checkCodeType === 'simple') {
        return true;
      }
      return false;
    },
    showClickWordCheckCode: (state) => {
      if (state.sysCfg.userCheckCode && state.sysCfg.checkCodeType === 'clickWord') {
        return true;
      }
      return false;
    },
    showBlockPuzzleCheckCode: (state) => {
      if (state.sysCfg.userCheckCode && state.sysCfg.checkCodeType === 'blockPuzzle') {
        return true;
      }
      return false;
    },
    // 是否加密
    pddwordRSAState: (_state) => {
      // if (state.sysCfg.passwordRSA === true || state.sysCfg.passwordRSA === 'true') {
      //   return true
      // }
      return true;
    },
    // 是否开启social登录
    openSocialLogin: (state) => {
      if (state.sysCfg.openSocialLogin === true || state.sysCfg.openSocialLogin === 'true') {
        return true;
      }
      return false;
    },
    // 是否开启短信验证码登录
    openSmsLogin: (state) => {
      if (state.sysCfg.openSmsLogin === true || state.sysCfg.openSmsLogin === 'true') {
        return true;
      }
      return false;
    },
    // 是否开启模拟用户登录
    openMockUser: (state) => {
      if (state.sysCfg.openMockUser === true || state.sysCfg.openMockUser === 'true') {
        return true;
      }
      return false;
    },
    // 密码等级配置
    pddwordLevel: (state) => {
      if (state.sysCfg.passwordLevel > 4 || state.sysCfg.passwordLevel < 1) {
        return 3;
      } else {
        return state.sysCfg.passwordLevel;
      }
    },
    enableSystemDictProtect: (state) => {
      if (
        state.sysCfg.enableSystemDictProtect === true ||
        state.sysCfg.enableSystemDictProtect === 'true'
      ) {
        return true;
      } else {
        return false;
      }
    },
  },
  actions: {
    getSysCfg({ commit }) {
      Base.submit(
        null,
        {
          url: 'loginRestService/getConfig',
          withCredentials: true,
          method: 'GET',
        },
        {
          successCallback: (data) => {
            commit('setSysCfg', data.data.configMap || {});
            // 将配置存入sessionStorage中，便于在
            const WebStorage = createWebStorage('Ta$CacheDictConfig', { isLocal: true });
            WebStorage.set('configMap', data.data.configMap || {});
          },
        },
      );
    },
  },
  mutations: {
    setSysCfg(state, cfg) {
      state.sysCfg = { ...state.sysCfg, ...cfg };
    },
  },
};
export default sysConfigStore;
