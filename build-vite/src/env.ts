import ViteCommonConfig from '../../viteCommonConfig';
import { getEnv } from './utils';

const { title } = ViteCommonConfig.cli.html;
export function defineEnv(_mode: string) {
  const pageTitles = {};
  Object.keys(title).forEach((k) => {
    pageTitles[`import.meta.env.VITE_HTML_TITLE_${k.toUpperCase()}`] = `"${title[k]}"`;
  });
  return {
    ...pageTitles,
    // i18n 配置
    'import.meta.env.VITE_I18N_LOCALE': `"${
      getEnv('VITE_DEFAULT_LOCALE') ? getEnv('VITE_DEFAULT_LOCALE') : 'zh_CN'
    }"`,
    'import.meta.env.VITE_I18N_FALLBACK_LOCALE': `"${
      getEnv('VITE_DEFAULT_LOCALE') ? getEnv('VITE_DEFAULT_LOCALE') : 'zh_CN'
    }"`,
    // 兼容ui的全局变量配置
    'process.env.VUE_APP_VXE_TABLE_ENV': `'${getEnv('NODE_ENV')}'`,
    'process.env.VUE_APP_PUBLIC_PATH': `"${getEnv('VITE_PUBLIC_PATH')}"`,
  };
}
