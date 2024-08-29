// 画布控制工具-通用按键
export enum ButtonNames {
  Ckcw = "ckcw", //窗宽窗位
  Mdtyms = "mdtyms", //密集投影
  Jbinfo = "jbinfo", //角标信息
  AiInfo = "aiInfo", //ai信息
  Szckx = "szckx", //十字参考线
  Pyms = "pyms", //平移模式
}

export let suffix_name = `_on`;

export const toggleButtonState = (name: string, state: {[key: string]: boolean}) => {
  // debugger
  state[`${name}${suffix_name}`] = !state[`${name}${suffix_name}`];
};


// 布局类型 - 视窗
export enum LayoutIcons {
  LGGJST = 'lggjst',
  MPR = 'mpr',
  YS = 'ys'
}


