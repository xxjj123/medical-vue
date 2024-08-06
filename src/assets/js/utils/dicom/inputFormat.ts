// 默认正则表达式
const DEFAULT_AGE_REGEX = /^(0\d{1,3}|1\d{0,2})Y$/;

/**
 * 序列化年龄字符串
 * @param options 包含数据源、正则表达式、占位符、单位显示和语言的对象
 * @returns 序列化后的年龄字符串或者占位符
 */
export function serializeAge(options: {
  dataSource: string;
  regex?: RegExp;
  placeholder?: string;
  unit?: boolean;
  language?: 'zh' | 'eng';
}): string {
  const {
    dataSource,
    regex = DEFAULT_AGE_REGEX,
    placeholder = '/',
    unit = false,
    language = 'zh',
  } = options;

  // 检查数据源是否为空
  if (!dataSource) {
    return placeholder;
  }

  // 使用提供的正则表达式或默认正则表达式进行匹配
  const match = dataSource.match(regex);

  // 如果匹配成功，则提取年龄部分
  if (match) {
    const age = match[1].replace(/^0+/, '');

    // 根据语言和单位参数决定返回的字符串
    if (unit) {
      return language === 'zh' ? `${age}岁` : `${age}Y`;
    } else {
      return age;
    }
  } else {
    return placeholder;
  }
}
