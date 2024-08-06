import type { Plugin } from 'vite';
import MagicString from 'magic-string';

export default (): Plugin => {
  return {
    name: '@yh/vite-plugin-generate-sfc-name',
    enforce: 'post',
    transform(code, id, options) {
      // 只对vue结尾的文件以及文件内包含_sfc_main的文件禁行处理
      if (!id.endsWith('.vue') && code.indexOf('_sfc_main') >= 0) {
        // 获取文件名: 规则: id的最后一个/的位置+1到id的长度-4的位置
        const fileName = id.substring(id.lastIndexOf('/') + 1, id.length - 4);
        const msc = new MagicString(code);
        // 找到_sfc_render的定义位置
        const sfcRenderIndex = /(const|var) _sfc_render/g;
        for (const matched of code.matchAll(sfcRenderIndex)) {
          const { index } = matched;
          // 在_sfc_render的定义前面添加修改name的语句
          msc.appendLeft(index, `_sfc_main.name='${fileName}';\r\n`);
        }

        return {
          code: msc.toString(),
          sourcemap: msc.generateMap(),
        };
      }
    },
  };
};
