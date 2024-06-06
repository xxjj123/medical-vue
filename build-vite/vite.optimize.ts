import fsp from 'fs/promises';
import path from 'path';
import type { UserConfig } from 'vite';
import { isEnvTrue } from './src/utils';
import { optimizeEntries, optimizeLibs } from './src/optimizeDeps';

import ViteCommonConfig from '../viteCommonConfig';

/**
 * 获取在@yh/cli-internal-locales中封装的语言文件
 * @returns 语言文件
 */
export async function getLocales() {
  const d = await fsp.readdir(path.resolve('./internal/locales/dist'));
  return d
    .filter((s) => {
      return s.endsWith('.mjs');
    })
    .map((s_1) => {
      return `@yh/cli-internal-precompiled-locales/dist/${s_1}`;
    });
}

declare type ViteOptimizeDeps = UserConfig['optimizeDeps'];

export async function getOptimizeConfig(_mode: string): Promise<ViteOptimizeDeps> {
  const optimizeDeps: ViteOptimizeDeps = {
    // 主要用于在 vite 进行依赖性导入分析，它会重写需要预编译且为 commonJS 的依赖
    needsInterop: ViteCommonConfig.optimizeDeps.needsInterop,
  };
  const entries: Array<string> = [];
  if (!isEnvTrue('USE_OLD_MODULES_SUPPORT')) {
    entries.push('build-vite/optimize/optimize.ts');
  }
  entries.push('build-vite/optimize/optimize-modules.ts');
  if (!isEnvTrue('VITE_ONLINE_THEME_ENABLED')) {
    entries.push('build-vite/optimize/optimize-css.ts');
  } else {
    entries.push('build-vite/optimize/optimize-less.ts');
  }

  // 需要include的预构建依赖
  optimizeDeps.include = [
    ...(await getLocales()),
    ...ViteCommonConfig.optimizeDeps.include,
    ...(await optimizeLibs()),
  ];
  // 所有入口都被加入预编译中
  optimizeDeps.entries = [
    ...(await optimizeEntries()),
    ...entries,
    ...ViteCommonConfig.optimizeDeps.entries,
  ];
  optimizeDeps.exclude = [...ViteCommonConfig.optimizeDeps.exclude, 'sw.js'];
  optimizeDeps.esbuildOptions = {
    sourcemap: true, // 'inline'
  };
  optimizeDeps.holdUntilCrawlEnd = true;
  return optimizeDeps;
}
