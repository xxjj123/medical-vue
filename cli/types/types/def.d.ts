/// <reference types="vite/client" />
interface ImportMetaEnv {
  /**
   * 项目的上下文
   */
  readonly VITE_PUBLIC_PATH: string;
  /**
   * 后端的基础地址
   */
  readonly VITE_BASE_PATH: string;
  /**
   * 后端的真实地址
   */
  readonly VITE_BACKEND_PATH: string;
  /**
   * 是否启用在线动态预设主题换肤
   */
  readonly VITE_ONLINE_THEME_ENABLED: string;
  /**
   * 默认的预设主题
   */
  readonly VITE_PRESET_THEME: string;
  /**
   * 在storage中存储的主题的key
   */
  readonly VITE_THEME_STORAGE_KEY: string;
  /**
   * 默认的语言
   */
  readonly VITE_DEFAULT_LOCALE: string;
  /**
   * 在localStorage中存储国际化配置的key
   */
  readonly VITE_LOCALE_STORAGE_KEY: string;
  readonly VITE_I18N_FALLBACK_LOCALE: string;
  /**
   * 是否使用悼念模式
   */
  readonly VITE_ENABLE_DARK_MODE: string;
  /**
   * 悼念模式的默认值
   */
  readonly VITE_DARK_MODE: string;
  /**
   * 是否加载less文件
   */
  readonly VITE_PERF_LOAD_LESS: 'false' | 'true' | 'single';
  readonly USE_OLD_MODULES_SUPPORT: string;
  readonly BUILD_DEMAND_UI_IMPORT: string;
  /**
   * 打war包时的war包名字
   */
  readonly WAR_NAME: string;
  /**
   * 打包输出的目录
   */
  readonly OUTPUT_DIR: string;
  /**
   * 是否生成打包报告
   */
  readonly BUILD_REPORT: string;
  /**
   * 是否支持传统浏览器
   */
  readonly BUILD_LEGACY: string;
  /**
   * 是否按照viteCommongConfig.build.polyfills中的配置对现代浏览器(简单来说,即:chrome等支持ES模块的浏览器)注入polyfills
   */
  readonly BUILD_INJECT_MODERN_POLYFILLS: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.vue' {
  import Vue from 'vue';

  export default Vue;
}

declare module 'virtual:themeDefinitions' {
  const themeDefinitions: Record<string, string>;
  export default themeDefinitions;
}

declare module 'virtual:dynamicTheme' {}
declare module 'virtual:elderly' {
  const elderlyConfig: object;
  const elderlyEventBus: {
    emit: Function;
  };
  const indexElderlyConfigChange: Function;
  export { elderlyConfig, elderlyEventBus, indexElderlyConfigChange };
}

declare module 'virtual:historyPage' {
  const historyPage: Array<string>;
  export default historyPage;
}

declare module '@yh/ta404-ui/es/store' {
  export default interface TaStore {
    taUserSelect: Record<string, any>;
    tableEdit: Record<string, any>;
  }
}

declare module '@yh/ta404-ui/es/_dict' {
  const init: (Vue?: unknown, store?: unknown, options?: unknown) => undefined;
  type dict = {
    init;
  };
  export default dict;
}

declare module '@zougt/vite-plugin-theme-preprocessor/dist/browser-utils' {
  interface opts {
    scopeName: string;
    multipleScopeVars: object;
  }
  export const toggleTheme: (p: opts) => void;
  export const addClassNameToHtmlTag: (p: opts) => void;
  type _default = {
    toggleTheme;
    addClassNameToHtmlTag;
  };
  export default _default;
}
