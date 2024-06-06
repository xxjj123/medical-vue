import { loadConfigFromFile, build, type ConfigEnv } from 'vite';
import { getAllPages } from './mpa/pages';
import ViteCommonConfig from '../viteCommonConfig';

const { config } = await loadConfigFromFile({
  mode: 'production',
  command: 'build',
  ignoreHtmlPlugin: true,
} as ConfigEnv);
config.build.emptyOutDir = false;

const htmlPages = await getAllPages();

const start = performance.now();
let filterPage = Object.keys(htmlPages);
const { mpa } = ViteCommonConfig;
if (mpa === true) {
  // do nothing
} else {
  filterPage = filterPage.filter((d) => {
    return mpa.indexOf(d) >= 0;
  });
}

for (const k of filterPage) {
  const v = htmlPages[k];
  const { plugins } = config;
  const assetsDir = `assets-${k}`;
  // eslint-disable-next-line no-await-in-loop
  const buildHtml = await import('vite-plugin-virtual-html').then((d) => {
    return d.default({
      pages: {
        [k]: v,
      },
    });
  });

  const rPlugins = [buildHtml, ...plugins];
  const cloneConfig = JSON.parse(JSON.stringify(config));
  cloneConfig.build.assetsDir = assetsDir;
  cloneConfig.plugins = rPlugins;
  cloneConfig.resolve.alias = config.resolve.alias;
  // eslint-disable-next-line no-await-in-loop
  await build({
    ...cloneConfig,
    configFile: false,
  });
}

const end = performance.now();
// eslint-disable-next-line no-console
console.log(`编译完成,总共耗时:${end - start}毫秒`);
