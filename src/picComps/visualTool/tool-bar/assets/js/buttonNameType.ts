// 画布控制工具-通用按键
export enum ButtonNames {
  Layout="Layout", //视窗调整
  Ckcw = "ckcw", //窗宽窗位
  Mjtyms = "mjtyms", //密集投影
  Jbinfo = "jbinfo", //角标信息
  AiInfo = "aiInfo", //ai信息
  Szckx = "szckx", //十字参考线
  Pyms = "pyms", //平移模式
  Bcj = "bcj" //靶重建
}

// export enum ButtonNamesLabel {
//   Layout="视窗调整",//视窗调整
//   Ckcw="窗宽窗位", // 窗宽窗位
//   Mjtyms="密集投影", // 密集投影
//   Jbinfo="角标信息", // 角标信息
//   AiInfo="ai 信息", // ai 信息
//   Szckx="十字参考线", // 十字参考线
//   Pyms="平移模式", // 平移模式
//   Bcj ="靶重建" //靶重建
// }


export enum LayoutNames {
  LGGJ="Lggj",
  MPR="Mpr",
  AXIAL="Axial",
  CORONAL="Coronal",
  SAGITTAL= "Sagittal",
  RECON = "Recon"
}

export let suffix_name = `_on`;
export let suffix_show = `_show`;

export const toggleButtonState = (name: string, state: {[key: string]: boolean}) => {
  // debugger
  state[`${name}${suffix_name}`] = !state[`${name}${suffix_name}`];

};


// 布局类型 - 视窗
export enum LayoutIcons {
  LGGJST = 'lggjst',
  MPR = 'mpr',
  AXIAL = 'ys',
  CORONAL="Coronal",
  SAGITTAL= "Sagittal",
   RECON = "Recon"

}


