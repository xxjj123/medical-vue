export enum ButtonNames {
  Ckcw = "ckcw",
  Mdtyms = "mdtyms",
  Jbinfo = "jbinfo",
  AiInfo = "aiInfo",
  Szckx = "szckx",
  Pyms = "pyms",
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
