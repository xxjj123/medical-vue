// SelectOption.ts
export interface SelectOption {
  value: number | string;
  label: string;
  order: number;
}

export interface LesionOrderOption extends SelectOption {
  sortKey?: string;
  reverse?: boolean;
}

interface OperateDict {
  lesionOrderType: LesionOrderOption[];
  riskFilter: SelectOption[];
  typeFilter: SelectOption[];
  majorAxisSelectFilter: SelectOption[];
  findingOrderType: SelectOption[];
  diagnosisType: SelectOption[];
}

const operate_dict: OperateDict = {
  lesionOrderType: [
    { value: 1, label: "IM", sortKey: "im", reverse: false, order: 1 },
    { value: 2, label: "肺段", sortKey: "lobeSegment.order", reverse: false, order: 2 },
    { value: 3, label: "长径", sortKey: "ellipsoidAxisMajor", reverse: true, order: 3 },
    { value: 4, label: "体积", sortKey: "volume", reverse: true, order: 4 },
    { value: 5, label: "风险", sortKey: "riskCode.order", reverse: true, order: 5 },
    { value: 6, label: "类型", sortKey: "type.order", reverse: false, order: 6 },
  ],
  riskFilter: [
    { value: 1, label: "低危", order: 1 },
    { value: 2, label: "中危", order: 2 },
    { value: 3, label: "高危", order: 3 },
  ],
  typeFilter: [
    { value: "Mass", label: "肿块", order: 1 },
    { value: "Mixed", label: "混合性", order: 2 },
    { value: "GCN", label: "磨玻璃性", order: 3 },
    { value: "Solid", label: "实性", order: 4 },
    { value: "Calcified", label: "钙化", order: 5 },
  ],
  majorAxisSelectFilter: [
    { value: 1, label: "0-3mm", order: 1 },
    { value: 2, label: "3-5mm", order: 2 },
    { value: 3, label: "5-8mm", order: 3 },
    { value: 4, label: ">8mm", order: 4 },
  ],
  findingOrderType: [
    { value: 1, label: "层数", order: 1 },
    { value: 2, label: "肺段", order: 2 },
    { value: 3, label: "类型", order: 3 },
    { value: 4, label: "结构化描述", order: 4 },
    { value: 5, label: "结节汇总", order: 5 },
  ],
  diagnosisType: [
    { value: 1, label: "无", order: 1 },
    { value: 2, label: "NCCN", order: 2 },
  ],
};


// 包含颜色属性的风险选项接口
export interface RiskOption extends SelectOption {
  color: string;
}

// 包含 `lobe` 属性的叶段选项接口
export interface LobeSegmentOption extends SelectOption {
  lobe: string;
}

// `nodule_dict` 的整体接口定义
interface NoduleDict {
  riskCode: RiskOption[];
  type: SelectOption[];
  lobe: SelectOption[];
  lobeSegment: LobeSegmentOption[];
}

// 实例化 `nodule_dict` 对象
const nodule_dict: NoduleDict = {
  riskCode: [
    { value: 1, label: "低危", color: "green", order: 1 },
    { value: 2, label: "中危", color: "yellow", order: 2 },
    { value: 3, label: "高危", color: "red", order: 3 },
  ],
  type: [
    { value: "Mass", label: "肿块", order: 1 },
    { value: "Mixed", label: "混合性结节", order: 2 },
    { value: "GCN", label: "磨玻璃性结节", order: 3 },
    { value: "Solid", label: "实性结节", order: 4 },
    { value: "Calcified", label: "钙化结节", order: 5 },
  ],
  lobe: [
    { value: "lobe_left_top", label: "左肺上叶", order: 1 },
    { value: "lobe_left_bottom", label: "左肺下叶", order: 2 },
    { value: "lobe_right_top", label: "右肺上叶", order: 3 },
    { value: "lobe_right_middle", label: "右肺中叶", order: 4 },
    { value: "lobe_right_bottom", label: "右肺下叶", order: 5 },
  ],
  lobeSegment: [
    { value: 14, label: "尖后段", lobe: "lobe_left_top", order: 1 },
    { value: 13, label: "前段", lobe: "lobe_left_top", order: 2 },
    { value: 11, label: "上舌段", lobe: "lobe_left_top", order: 3 },
    { value: 12, label: "下舌段", lobe: "lobe_left_top", order: 4 },
    { value: 18, label: "背段", lobe: "lobe_left_bottom", order: 5 },
    { value: 15, label: "内前基底段", lobe: "lobe_left_bottom", order: 6 },
    { value: 17, label: "外基底段", lobe: "lobe_left_bottom", order: 7 },
    { value: 16, label: "后基底段", lobe: "lobe_left_bottom", order: 8 },
    { value: 3, label: "尖段", lobe: "lobe_right_top", order: 9 },
    { value: 2, label: "后段", lobe: "lobe_right_top", order: 10 },
    { value: 1, label: "前段", lobe: "lobe_right_top", order: 11 },
    { value: 5, label: "外侧段", lobe: "lobe_right_middle", order: 12 },
    { value: 4, label: "内侧段", lobe: "lobe_right_middle", order: 13 },
    { value: 10, label: "背段", lobe: "lobe_right_bottom", order: 14 },
    { value: 6, label: "内基底段", lobe: "lobe_right_bottom", order: 15 },
    { value: 7, label: "前基底段", lobe: "lobe_right_bottom", order: 16 },
    { value: 9, label: "外基底段", lobe: "lobe_right_bottom", order: 17 },
    { value: 8, label: "后基底段", lobe: "lobe_right_bottom", order: 18 },
  ],
};



export { operate_dict,nodule_dict };
