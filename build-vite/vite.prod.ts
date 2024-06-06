import type { UserConfig } from 'vite';
import { buildBaseConfig } from './vite.base';
import { getEnv, isEnvTrue } from './src/utils';
import { manualChunks } from './src/chunks';
import viteCommonConfig from '../viteCommonConfig';

export async function buildProdConfig(
  mode: string,
  ignoreHtmlPlugin: boolean = false,
): Promise<UserConfig> {
  const config: UserConfig = await buildBaseConfig(mode, ignoreHtmlPlugin);
  config.build = {
    // sourcemap默认设置为false
    sourcemap: false,
    outDir: `${getEnv('OUTPUT_DIR')}${getEnv('VITE_PUBLIC_PATH')}`,
    emptyOutDir: true,
    // 是否压缩生成的代码
    minify: viteCommonConfig.build.minify,
    cssMinify: viteCommonConfig.build.cssMinify,
  };
  if (viteCommonConfig.build.minify === 'terser') {
    config.build.terserOptions = viteCommonConfig.build.terserOptions;
  }
  config.build.commonjsOptions = {
    transformMixedEsModules: true,
    // ignoreDynamicRequires: true,
    // dynamicRequireTargets: ['image-size'],
    exclude: ['node_modules/moment/**'],
    esmExternals: true,
    // 修改需要commonjs插件处理的文件
    include: viteCommonConfig.commonjs.include,
    extensions: viteCommonConfig.commonjs.extensions,
    requireReturnsDefault: 'auto',
  };
  config.build.rollupOptions = {
    output: {
      manualChunks(id) {
        return manualChunks(id);
      },
    },
    treeshake: viteCommonConfig.build.treeshake,
  };
  const useDemandImport = isEnvTrue('BUILD_DEMAND_UI_IMPORT');
  if (useDemandImport) {
    config.build.target = ['chrome99'];
  }
  // config.css.preprocessorMaxWorkers = true;
  return config;
}
