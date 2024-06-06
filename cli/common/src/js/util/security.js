const noop = () => {};

// 避免这样的查看console.log(fnAdd.toString())
// 部分功能依赖中可能会使用toString函数
// 来探测一个函数是否是native函数
// 此重写建议只在特别有需要时使用
// 否则可能导致系统功能错误
// Function.prototype.toString = noop

// 实际上系统中没有用原生的信息提示
// 避免常见的XSS漏洞的验证
// eslint-disable-next-line no-multi-assign
window.alert = window.confirm = top.alert = top.confirm = this.alert = this.confirm = noop;

// 输出显眼的警告信息
console.log(
  '%c \u5b89\u5168\u8b66\u544a\uff01',
  'font-size:50px;color:red;-webkit-text-fill-color:red;-webkit-text-stroke: 1px black;',
);
