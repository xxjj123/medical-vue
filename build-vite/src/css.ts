import autoprefixer from 'autoprefixer';
import type {CSSOptions} from 'vite';
import {getEnv} from './utils';

export async function css(): Promise<CSSOptions> {
  // @ts-expect-error 忽略这个类型错误
  return {
    postcss: {
      plugins: [
        // @ts-expect-error 忽略这里的类型错误
        autoprefixer({
          // 配置使用 autoprefixer
          overrideBrowserslist: ['> 1%', 'last 3 versions', 'ie >= 11', 'chrome >= 41'],
        }),
      ],
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        math: 'always',
        additionalData: `
        @import "@yh/ta404-ui/es/style/mixins/index.less";
        @import "cli/projectCommon/src/styleCover/mixins/func.less";
        @import "internal/theme/preset-theme/global-customer-vars.less";
        `,
        modifyVars: {
          // 在less文件中提供当前项目的public-path变量
          'public-path': getEnv('VITE_PUBLIC_PATH').endsWith('/')
            ? getEnv('VITE_PUBLIC_PATH')
            : `${getEnv('VITE_PUBLIC_PATH')}/`,
        },
      },
    },
    preprocessorMaxWorkers: true,
  };
}
