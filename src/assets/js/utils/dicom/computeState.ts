export enum CalculationStatus {
  Waiting = 1,
  Calculating = 2,
  Success = 3,
  Failed = 4,
  Cancelled = 5,
  Exception = 6
}

export const calculationStatusDictionary: {[key: number]: string} = {
  [CalculationStatus.Waiting]: "等待计算",
  [CalculationStatus.Calculating]: "计算中",
  [CalculationStatus.Success]: "计算成功",
  [CalculationStatus.Failed]: "计算失败",
  [CalculationStatus.Cancelled]: "计算取消",
  [CalculationStatus.Exception]: "计算异常"
};

/**
 *
 * @param status
 * @returns
 */
export function isCalculationStatusValid(status: number): boolean {
  return Object.values(CalculationStatus).includes(status);
}
