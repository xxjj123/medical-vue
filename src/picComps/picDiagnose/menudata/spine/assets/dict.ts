// SpinetureOption.ts

// 基础选项接口
export interface SelectOption  {
  value:string;
  label: string;
  order: number;
}



// `spine_dict` 的接口定义
interface SpineDict {
  mt: SelectOption ;
  pt: SelectOption ;
  tl: SelectOption ;

}

// 实例化 `spine_dict`
const spine_dict: SpineDict = {
  mt:{  value:"mt", label: "胸椎中段", order: 2 },
  pt:{  value:"pt", label: "胸椎上段", order:1 },
  tl:{  value:"tl", label: "胸椎下段", order:3 },

};

export { spine_dict };
