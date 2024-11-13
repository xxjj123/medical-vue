// FractureOption.ts

// 基础选项接口
export interface SelectOption  {
  value: string;
  label: string;
  order: number;
}

// 包含 `ribNums` 属性的 `RibSideOption` 接口
export interface RibSideOption extends  SelectOption {
  ribNums: number[];
}

// `frac_dict` 的接口定义
interface FractureDict {
  ribType: SelectOption [];
  fracClass: SelectOption [];
  ribSide: RibSideOption[];
}

// 实例化 `frac_dict`
const frac_dict: FractureDict = {
  ribType: [
    { value: "front", label: "前段", order: 1 },
    { value: "middle", label: "腋段", order:2 },
    { value: "back", label: "后段", order:3 },
  ],
  fracClass: [
    { value: "old", label: "陈旧性骨折", order: 1 },
    { value: "buckle", label: "骨皮质扭曲", order: 2 },
    { value: "displaced", label: "错位性骨折", order: 3 },
    { value: "nodisplaced", label: "非错位性骨折", order: 4 },
  ],
  ribSide: [
    { value: "L", label: "左侧", ribNums: Array.from({ length: 12 }, (_, i) => i + 1),order: 1  },
    { value: "R", label: "右侧", ribNums: Array.from({ length: 12 }, (_, i) => i + 1) ,order: 2 },
  ],
};

export { frac_dict };
