import http2 from 'vite-plugin-http2-proxy';
import basicSsl from '@vitejs/plugin-basic-ssl';
import { getEnv } from './utils';
import type { UserConfig } from 'vite';

export function buildProxy() {
  const proxyName = `^${getEnv('VITE_BASE_PATH')}`;
  const proxyRegex = new RegExp(proxyName);
  // noinspection JSUnusedGlobalSymbols
  return {
    // 这里通过此proxy可以进行以下的转换
    // http://localhost:5173[/ta404/]indexRestService/getCurUserAccount
    // =>  在转换时,需要将原本的上下文替换为'',
    // http://172.20.23.18:30001/ta404/indexRestService/getCurUserAccount
    [proxyName]: {
      target:
        getEnv('RUN_ENV') === 'mock' ? 'http://localhost:36742/' : getEnv('VITE_BACKEND_PATH'),
      changeOrigin: true,
      rewrite: (path: string) => {
        // 由于VITE_BACKEND_PATH配置的路径为包含后端上下文的路径,所以此处将前端的BASE_PATH移除
        return path.replace(proxyRegex, '');
      },
      secure: false,
    },
    // 下面这个proxy配置与上面的配置效果完全一致
    // [proxyName]: getEnv('RUN_ENV') === 'mock' ? 'http://localhost:36742/' : (getEnv('VITE_BACKEND_PATH').replace('/ta404/', '')),
  };
}

export function buildPreviewProxy() {
  return buildProxy();
}

export function buildProxyForHTTP2(config: UserConfig) {
  // eslint-disable-next-line no-param-reassign
  delete config.server.proxy;
  config.plugins.push(http2(buildProxy()));
  config.plugins.push(basicSsl());
}
