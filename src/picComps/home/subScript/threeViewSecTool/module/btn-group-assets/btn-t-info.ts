// part it
export enum btnKey {
  LUNG = "lung",
  // ... todo other part
}
//肺按钮细节代号
export enum btnLungCodes {
  REBACK = "reback",
  XZFZ = "xzfz",
  AUTOPLAY = "autoplay",
  SCREEN = "screen",
}
// 旋转子按钮组代号
export enum rotateChildBtnCodes {
  ICO_PACSSHUPING = "ico_pacsshuping",
  ICO_PACSSHUIPINGFANZHUAN = "ico_pacsshuipingfanzhuan",
  ICO_PACSCHUIZHIFANZHUAN = "ico_pacschuizhifanzhuan",
}

/**
 * 默认包含 btn on <-> off 选中未选中切换效果，
 * 切换素材默认根据当前defaultIconIdx的元素进行样式切换，
 * 只有开启toggle配置才进入不同元素顺序切换
 *
 * on: true / 1 代表选中状态
 */
export const btnInfo = {
  lung: [
    {
      code: "reback",
      altName: "反向",
      icon: "ico_pacsshurushuchumokuai",
      on: false
    },
    {
      code: "xzfz",
      altName: "旋转翻转",
      icon: "ico_pacsshuping",
      defaultIconIdx: "0",
      mode: "more", // more 开启 select 控件 ,other 也不会选中
      moreClickOn: true,
      dropdownIconDown: true, //false : 切换up
      child: [
        {
          altName: "旋转90度",
          icon: "ico_pacsshuping",
          on: false
        },
        {
          altName: "水平镜像翻转",
          icon: "ico_pacsshuipingfanzhuan",
        },
        {
          altName: "垂直镜像翻转",
          icon: "ico_pacschuizhifanzhuan",
        },
      ]
    },
    {
      code: "autoplay",
      altName: "自动播放",
      icon: "ico_pacsbofang",
      defaultIconIdx: "0",
      mode: "other",
      toggle: "2",// 2 对标 child 长度，代表根据这个数组下标顺序切换，直至切换到指定长度下标，循环切换
      child: [
        {
          altName: "开播",
          icon: "ico_pacsbofang"
        },
        {
          altName: "暂停",
          icon: "ico_pacszanting-"
        }
      ]
    },
    {
      code: "screen",
      altName: "全屏",
      icon: "ico_pacsquanping",
      defaultIconIdx: "0",
      toggle: "2",
      mode: "other",
      child: [
        {
          altName: "全屏",
          icon: "ico_pacsquanping",
        },
        {
          altName: "退出全屏",
          icon: "ico_pacstuichuquanping"
        }
      ]
    }
  ]
}
