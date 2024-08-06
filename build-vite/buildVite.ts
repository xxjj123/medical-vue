import type { ConfigEnv, UserConfig } from 'vite';
import { initEnv } from './src/utils';

export async function buildViteConfig({
  mode,
  command,
  ignoreHtmlPlugin,
}: ConfigEnv & { ignoreHtmlPlugin: boolean }): Promise<UserConfig> {
  let config: UserConfig = {};
  await initEnv(mode);
  if (mode === 'development') {
    // development模式同时用于dev和optimize
    config = await import('./vite.dev').then(({ init, buildDevConfig }) => {
      init();
      return buildDevConfig(mode);
    });
  } else if (mode === 'preview') {
    config = await import('./vite.preview').then(({ buildPreviewConfig }) => {
      return buildPreviewConfig(mode, command);
    });
  } else if (mode === 'production') {
    config = await import('./vite.prod').then(({ buildProdConfig }) => {
      return buildProdConfig(mode, ignoreHtmlPlugin);
    });
  } else if (mode === 'mock') {
    config = await import('./vite.mock').then(({ buildMockConfig }) => {
      return buildMockConfig(mode);
    });
  } else {
    throw new Error('没有指定一个可用的mode,请尝试通过--mode=***来指定');
  }
  return config;
}
