// SelectOption.ts
export interface SelectOption {
  value: string;
  label: string;
  // 您可以根据需要添加其他属性
}

//按类型分类
export const selectOptions1: SelectOption[] = [
  // ... 数据
  {value: '0', label: '按层数排序'},
  {value: '1', label: '按肺段分类'},
  {value: '2', label: '按类型分类'},
  {value: '3', label: '结构化描述'},
  {value: '4', label: '结节汇总'},
];

//NCCN
export const selectOptions2: SelectOption[] = [
  // ... 数据
  {value: '', label: '无'},
  {value: '1', label: 'NCCN'},
];
