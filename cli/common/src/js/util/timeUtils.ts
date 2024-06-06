import type { unitOfTime } from 'moment';
import type Moment from 'moment';

type moment = Moment.Moment;

/**
 * 计算两个日期之间的单位差距
 * @param start 起始moment
 * @param end 结束moment
 * @param unit 日期单位
 * @param format 格式化输出
 * @param step 步进,默认为1
 */
export function generateStartToEndArray(
  start: moment,
  end: moment,
  unit: unitOfTime.DurationConstructor,
  format: string,
  step: number = 1,
): Array<string> {
  const diff = Math.abs(start.diff(end, unit));
  const startClone = start.clone();
  const result: Array<string> = [];
  for (let i = 0; i < diff; ) {
    i += step;
    result.push(startClone.add(step, unit).format(format));
  }
  return result;
}
