import http2 from 'vite-plugin-http2-proxy';
import basicSsl from '@vitejs/plugin-basic-ssl';
import {getEnv} from './utils';
import type {UserConfig} from 'vite';

export function buildProxy() {
  const proxyName = `^${getEnv('VITE_BASE_PATH')}`;
  const proxyRegex = new RegExp(proxyName);
  console.log("proxyName==", proxyName);
  console.log("proxyRegex==", proxyRegex);


  // noinspection JSUnusedGlobalSymbols
  return {
    // 这里通过此proxy可以进行以下的转换
    // http://localhost:5173[/ta404/]indexRestService/getCurUserAccount
    // =>  在转换时,需要将原本的上下文替换为'',
    // http://172.20.23.18:30001/ta404/indexRestService/getCurUserAccount
    ['^/ta404/api2/']: {
      target: 'http://admin.itsea.com.cn:56808/api/',
      changeOrigin: true,
      rewrite: (path: string) => {
        console.log("path____代理api2", path);
        return path.replace(/^\/ta404\/api2\//, '')
      }
    },
    ['^/ta404/api/']: {
      // target: 'http://183.247.165.2:2480/connector/api/',
      target: 'http://192.168.1.24/connector/api/',
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/ta404\/api\//, '')
    },
    ['^/ta404/api5/']: {
      target: 'http://192.168.1.4:39600/',
      // target: 'http://192.168.1.142:39600/',//xwj
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/ta404\/api5\//, '')
    },
    ['^/ta404/api3/']: {
      target: 'https://demo.deepinsight.deepvessel.net/api/',
      changeOrigin: true,
      rewrite: (path: string) => path.replace(/^\/ta404\/api3\//, '')
    },
    ["^/ta404/api6/"]: {
      target: "http://192.168.1.4:39600/",
      // target: "http://192.168.1.142:39625/",//xwj
      changeOrigin: true,
      rewrite: (path6) => path6.replace(/^\/ta404\/api6\//, ""),
    },
    ["^/api7/"]: {
      // target: "http://localhost:8080/",
      target: "http://192.168.1.4:39600/",//xwj
      changeOrigin: true,
      rewrite: (path6) => path6.replace(/^\/api7\//, ""),
    },

    [proxyName]: {
      target:
        getEnv('RUN_ENV') === 'mock' ? 'http://localhost:36742/' : getEnv('VITE_BACKEND_PATH'),
      changeOrigin: true,
      rewrite: (path: string) => {
        // if(){}path.indexOf('/api') !== -1 && path.indexOf('/api2') !== -1
        console.log("path___默认", path);
        // const api2Regex = /\/api2/;
        // if (api2Regex.test(path)) {
        //   const newpath = path.replace(/^\/ta404/, '');
        //   console.log("newpath===", newpath);

        //   return newpath
        // } else {
        // 由于VITE_BACKEND_PATH配置的路径为包含后端上下文的路径,所以此处将前端的BASE_PATH移除
        return path.replace(proxyRegex, '');
        // };


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
