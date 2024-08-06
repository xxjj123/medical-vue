import type { UserConfig } from 'vite';
import { buildProdConfig } from './vite.prod';
import { buildPreviewProxy } from './src/proxy';
// import { getOpen, } from './src/utils'
// import { getEnv, } from './src/utils'
// import { historyApiFallbackPlugin, } from 'vite-plugin-virtual-html'

export async function buildPreviewConfig(mode: string, command: string): Promise<UserConfig> {
  let config: UserConfig = {};
  if (command === 'build') {
    config = await buildProdConfig(mode);
  }
  if (command === 'serve') {
    config.plugins = [
      // 这个注释的是用于路由的historyAPI回退代码
      // 例如: 某些路由在404的时候回退到index.html
      // historyApiFallbackPlugin({
      //   rewrites: [
      //     {
      //       from: /login.html/,
      //       to: getEnv('VITE_PUBLIC_PATH') + 'login.html',
      //     },
      //     {
      //       from: /.*/,
      //       to: getEnv('VITE_PUBLIC_PATH') + 'index.html',
      //     }
      //   ],
      //   usePreview: true,
      // })
    ];
    config.preview = {
      proxy: buildPreviewProxy(),
      open: false,
      // 预览模式下的端口
      port: 5174,
    };
    config.server = {
      host: true,
    };
  }

  return config;
}
