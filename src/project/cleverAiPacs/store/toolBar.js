/**
 * toolBar 图像工具条控制权
 * description：
 * 1、通用工具
 * 2、专业部位的医学工具
 * 3、事件状态流转
 * 4、初始化状态
 * 5、单张成像组件-小工具-状态共用
 * 6、布局控制
 */
const ButtonNames = {
  Layout:"Layout",//视窗调整
  Ckcw: "ckcw", // 窗宽窗位
  Mjtyms: "mjtyms", // 密集投影
  Jbinfo: "jbinfo", // 角标信息
  AiInfo: "aiInfo", // ai 信息
  Szckx: "szckx", // 十字参考线
  Pyms: "pyms", // 平移模式
};

const suffix_active = `_on`;
const suffix_show = `_show`;


export default {
  namespaced: true,
  state: {
    slice_CT_pic_layout: "lggjst", //ct-三视图+3d,容器布局方式（ps:这个名称和icon-class对应）
    ...Object.keys(ButtonNames).reduce((acc, key) => {
      acc[`${ButtonNames[key]}${suffix_active}`] = false;
      return acc;
    }, {}),
    ...Object.keys(ButtonNames).reduce((acc, key) => {
      acc[`${ButtonNames[key]}${suffix_show}`] = false;
      return acc;
    }, {}),
    // [`${ButtonNames.Jbinfo}${suffix_name}`]: true,
    // [`${ButtonNames.Szckx}${suffix_name}`]: true,
  },
  getters: {
    getButtonActiveState: (state) => (buttonName) => {
      return state[`${buttonName}${suffix_active}`];
    },
    getAllButtonActiveStates: (state) => {
      return Object.keys(ButtonNames).reduce((acc, key) => {
        acc[`${ButtonNames[key]}${suffix_active}`] = state[`${ButtonNames[key]}${suffix_active}`];
        return acc;
      }, {});
    },
    getButtonShowState: (state) => (buttonName) => {
      return state[`${buttonName}${suffix_show}`];
    },
    getAllButtonShowStates: (state) => {
      return Object.keys(ButtonNames).reduce((acc, key) => {
        acc[`${ButtonNames[key]}${suffix_show}`] = state[`${ButtonNames[key]}${suffix_show}`];
        return acc;
      }, {});
    },
  },
  mutations: {
    // 定义一个 mutation 来改变 slice_CT_pic_layout 的值
    SET_SLICE_CT_PIC_LAYOUT(state, layout) {
      state.slice_CT_pic_layout = layout;
    },
    TOGGLE_BUTTON_ACTIVE_STATE(state, buttonName) {
      state[`${buttonName}${suffix_active}`] =
        !state[`${buttonName}${suffix_active}`];
    },
    INIT_BUTTON_ACTIVE_STATE(state, activeButtons) {
      Object.keys(ButtonNames).forEach((key) => {
        const button = ButtonNames[key];
        state[`${button}${suffix_active}`] = activeButtons.includes(button);
      });
    },
    TOGGLE_BUTTON_SHOW_STATE(state, buttonName) {
      state[`${buttonName}${suffix_show}`] =
        !state[`${buttonName}${suffix_show}`];
    },
    INIT_BUTTON_SHOW_STATE(state, activeButtons) {
      Object.keys(ButtonNames).forEach((key) => {
        const button = ButtonNames[key];
        state[`${button}${suffix_show}`] = activeButtons.includes(button);
      });
    }
  },
  actions: {},
};
