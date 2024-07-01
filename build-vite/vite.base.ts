import type {UserConfig} from 'vite';
import {css} from './src/css';
import {getEnv} from './src/utils';
import {buildPlugins} from './src/plugin';
import {buildAlias} from './src/alias';
import {defineEnv} from './src/env';
import path from 'path';

export async function buildBaseConfig(
  mode: string,
  ignoreHtmlPlugin: boolean = false,
): Promise<UserConfig> {
  // css 加载以及prefix配置文件
  const cssConfig = await css();
  return {
    // 基础路径
    base: getEnv('VITE_PUBLIC_PATH'),
    envDir: path.resolve(process.cwd(), './.env'),
    // 打包所用到的插件
    plugins: await buildPlugins(mode, ignoreHtmlPlugin),
    resolve: {
      // 别名
      alias: buildAlias(mode),
    },
    optimizeDeps: {
      exclude: ['@itk-wasm/dicom'],
    },
    // 定义全局常量替换方式。其中每项在开发环境下会被定义在全局，而在构建时被静态替换
    define: defineEnv(mode),
    // css加载配置项
    css: cssConfig,
  };
}
