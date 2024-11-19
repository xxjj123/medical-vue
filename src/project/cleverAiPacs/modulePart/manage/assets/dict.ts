
// 基础选项接口
export interface SelectOption  {
  value: string;
  label: string;
  order: number;
}

// `pneu _dict` 的整体接口定义
interface PneuDict  {
  lobeName: SelectOption [];
  diseaseClass: SelectOption [];
}

// 实例化 `pneu _dict`
const pneu_dict: PneuDict  = {
  lobeName: [
    { value: "lobe_left_top", label: "左肺上叶", order: 1 },
    { value: "lobe_left_bottom", label: "左肺下叶", order: 2 },
    { value: "lobe_right_top", label: "右肺上叶", order: 3 },
    { value: "lobe_right_middle", label: "右肺中叶", order: 4 },
    { value: "lobe_right_bottom", label: "右肺下叶", order: 5 },
  ],
  diseaseClass: [
    { value: "", label: "", order: 0 },
    { value: "HD", label: "蜂窝影", order: 1 },
    { value: "GGO", label: "磨玻璃影", order: 2 },
  ],
};

export { pneu_dict };
