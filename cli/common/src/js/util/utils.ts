/**
 * 将字符串形式的正则表达式转换为RegExp对象
 *
 * @param reg 形如: '/aaa/'或'/aaa/g'
 */
export function transformToRegex(reg: string): RegExp {
  const regStr = reg;
  let regex = regStr;
  let flag = '';
  // 如果是已/开头,则需要进行处理
  if (regStr.indexOf('/') === 0) {
    regex = regStr.substring(1, regStr.lastIndexOf('/'));
    flag = regStr.substring(regStr.lastIndexOf('/') + 1);
  }
  return new RegExp(regex, flag);
}
