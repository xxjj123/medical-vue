import type { InjectCode } from 'vite-plugin-virtual-html';
import { POS } from 'vite-plugin-virtual-html';

const multipleServiceConfig: Record<string, Partial<InjectCode> | string> = {
  // 模块名称必须与html相匹配
  // 1. 对一个具体的页面,可直接使用如下的配置进行注入,一般建议直接使用这种方式
  'login.html': '<script>window.dd = "dd";</script>',
  // 也可以通过传入一个对象来注入配置
  // 'login.html': {
  //   // pos: POS.before,
  //   // find: '</head>',
  //   replacement: '<script>window.dd = "dd";</script>',
  // },
  // 其中,pos和find是可选的,若不传入时,其默认值为
  // {pos: POS.before, find: '</head>'},
  // 2. 特殊配置,将会在所有html文件生效
  // 配置规则与具体页面的配置相同
  '*': {
    // 查找内容
    find: '</head>',
    // 在查找内容前/后替换查找内容
    pos: POS.before,
    // 要替换的内容,这个内容可以是script,也可以是其他的内容
    replacement: `
    <script>
    window.bb = "bb";
    </script>
    `,
  },
};

export default {
  multipleServiceConfig,
};
