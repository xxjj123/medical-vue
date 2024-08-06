import * as path from 'node:path';
import * as fs from 'node:fs';
import {viteCommonjs} from '@yh/vite-plugin-commonjs';
import VirtualHtml, {historyApiFallbackPlugin} from 'vite-plugin-virtual-html';
import vue from '@vitejs/plugin-vue2';
import jsx from '@vitejs/plugin-vue2-jsx';
import Inspect from 'vite-plugin-inspect';
import {visualizer} from 'rollup-plugin-visualizer';
import {viteStaticCopy} from 'vite-plugin-static-copy';
import legacy from '@vitejs/plugin-legacy';
import virtualModule from 'vite-plugin-virtual-modules';
import viteCommonConfig from '../../viteCommonConfig';
import themePreprocessorPlugin from '@zougt/vite-plugin-theme-preprocessor';
import {uiVite} from '@yh/vite-plugin-cli-importer';
import unplugin from 'unplugin-vue-components/vite';
import cliComponentsOverride from './unplugin-resolver/cli-components.override';
import {getEnv, isEnvTrue} from './utils';
import StringReplace from 'vite-plugin-string-replace';
import {getAllPages, getInjectCode} from '../mpa/pages.js';
import ReplaceName from './replace-name';
import {copyModulePublic} from './copyModulePublic';
import FileReplace from '../../internal/replace-files/src';

const fsp = fs.promises;

const PRIMARY_COLOR_REGEX = /@primary-color: (.*);/g;

const DEMAND_UI_IMPORT_BLACK_LIST = ['container-mask', 'message', 'modal', 'notification'];
const IGNORE_VUE_USE = ['driver'];

function resolvePresetThemePath(file?: string) {
  return path.resolve(__dirname, '../../internal/theme/preset-theme', file ?? '');
}

/**
 * 读取预设主题(/src/common/dynamicTheme/preset-theme)目录下的less文件
 * 返回:
 *   multipleScopeVars: 给换肤插件用的数组,存储了less文件中的样式变量
 *   virtualThemes: 给页面显示使用的对象,存储了主题名与primary-color的对应
 */
async function readPresetThemePrimaryColor() {
  const {includeStyles} = viteCommonConfig;
  const presetThemes = await fsp.readdir(resolvePresetThemePath());
  const multipleScopeVars: Array<{
    scopeName: string;
    varsContent?: string;
    path?: string;
    includeStyles?: Record<string, Record<string, string>>;
  }> = [];
  const virtualThemes = {};
  for (const theme of presetThemes) {
    // 只处理less后缀的文件
    if (theme.endsWith('.less')) {
      // eslint-disable-next-line no-await-in-loop
      const lessCode = (await fsp.readFile(resolvePresetThemePath(theme))).toString();
      const match = lessCode.matchAll(PRIMARY_COLOR_REGEX);
      const primaryColor = match.next().value[1];
      multipleScopeVars.push({
        scopeName: `theme-${theme.replace('.less', '')}`,
        path: resolvePresetThemePath(theme),
        includeStyles,
      });
      virtualThemes[theme.replace('.less', '')] = {
        'primary-color': primaryColor,
      };
    }
  }

  return {
    multipleScopeVars,
    virtualThemes,
  };
}

/**
 * 基础插件
 * @param _mode
 * @param ignoreHtmlPlugin
 */
async function basePlugins(_mode: string, ignoreHtmlPlugin: boolean = false) {
  const {copyResources, html, cli} = viteCommonConfig;
  const targets = [...copyResources, ...copyModulePublic()].map((resource) => {
    return {
      src: resource.from,
      dest: resource.to,
    };
  });
  const {historyPage} = cli;
  const historyPageInjectIntoFaceConfig = historyPage.map((hp) => {
    return `${hp}.html`;
  });

  const {multipleScopeVars, virtualThemes} = await readPresetThemePrimaryColor();
  const useLessFile = getEnv('VITE_PERF_LOAD_LESS');
  const useSingleCss = useLessFile === 'single';
  const useOldModules = isEnvTrue('USE_OLD_MODULES_SUPPORT');
  const useDemandImport = isEnvTrue('BUILD_DEMAND_UI_IMPORT');
  const plugins = [];
  if (!ignoreHtmlPlugin) {
    const pages = await getAllPages();
    const injectVariables = await getInjectCode();
    plugins.push(
      // 自动识别项目下的所有html文件,并且排除部分不需要的文件
      VirtualHtml({
        pages,
        injectCode: injectVariables,
      }),
    );
  }

  plugins.push(
    ...[
      vue({}),
      jsx({
        compositionAPI: false,
      }),
      unplugin({
        resolvers: [cliComponentsOverride()],
        version: 2.7,
        dts: false,
        include: [/\.vue/, /\.vue\?vue/, /\.md/, /\.([tj])sx?/, /[\\/]node_modules[\\/]@yh[\\/]/],
        exclude: [/[\\/]\.git[\\/]/, /[\\/]node_modules[\\/]\.vite[\\/]/],
      }),
      uiVite({
        transform(moduleName, camelCase) {
          let uiName = '@yh/ta404-ui';
          let uiStylePostfix = '.less';
          let modules = `import {${moduleName}} from "@yh/ta404-ui";`;
          if (useOldModules) {
            modules = `import ${moduleName} from "@yh/ta404-ui/es/${camelCase}";`;
          }

          if (useLessFile === 'false') {
            uiName = '@yh/cli-internal-precompiled-less';
            uiStylePostfix = '.css';
          }

          let styleImporter = '';

          if (useSingleCss) {
            styleImporter = 'import "@yh/cli-internal-precompiled-less/css/ui.css";';
          } else {
            styleImporter = `import "${uiName}/es/${camelCase}/style/index${uiStylePostfix}";`;
          }

          let result = '';
          if (
            useDemandImport &&
            [...DEMAND_UI_IMPORT_BLACK_LIST, ...IGNORE_VUE_USE].indexOf(camelCase) < 0
          ) {
            result = `
          const ${moduleName} = await import('@yh/ta404-ui/es/${camelCase}');
          Vue.use(${moduleName}.default);
                ${styleImporter}
                `;
          } else {
            result = `
              ${modules}
              ${styleImporter}
              `;
            if (IGNORE_VUE_USE.indexOf(camelCase) < 0) {
              result += `
            Vue.use(${moduleName});
            `;
            }
          }
          return result;
        },
      }),
      // 复制静态文件
      viteStaticCopy({
        targets,
      }),
      virtualModule({
        modules: [
          {
            // 动态换肤配置
            moduleName: 'dynamicTheme',
            moduleValue: "import { initTheme, } from '@yh/cli-internal-dynamic-theme';initTheme();",
          },
          {
            moduleName: 'themeDefinitions',
            moduleValue: `export default ${JSON.stringify(virtualThemes)};`,
          },
          {
            // i18n配置
            moduleName: 'dynamicI18n',
            moduleValue: `
          import { makeI18n, } from '@yh/cli-internal-precompiled-locales';
          export {
            makeI18n,
          }
          `,
          },
          {
            moduleName: 'historyPage',
            moduleValue: `
          const historyPage = ${JSON.stringify(historyPageInjectIntoFaceConfig)};
          export default historyPage;
          `,
          },
          {
            moduleName: 'darkMode',
            moduleValue: `
          import { updateColorWeak, } from '@yh/cli-internal-dynamic-theme';
          import { createWebStorage, } from '@yh/ta-utils';

          if(import.meta.env.VITE_ENABLE_DARK_MODE.toUpperCase() === 'TRUE'){
            import('/internal/theme/dark/dark-mode.less');
            const darkModeStorage = createWebStorage(import.meta.env.VITE_THEME_STORAGE_KEY, { isLocal: true, });
            const sv = darkModeStorage.get('dark_mode');
            updateColorWeak(sv === null ? import.meta.env.VITE_DARK_MODE.toUpperCase() === 'TRUE' : !!sv);
          }
          `,
          },
          {
            // 适老化模块
            moduleName: 'elderly',
            moduleValue: `
             import { useEventBus, } from '@vueuse/core';
             import Vue from 'vue';
             import { createWebStorage, } from '@yh/ta-utils';
             const elderlyEventBus = useEventBus('elderly');
             // 初始化size
              Vue.prototype.$ELEMENT = {
                size: 'default',
              }
              Vue.observable(Vue.prototype.$ELEMENT)
              elderlyEventBus.on((e) => {
                Object.assign(Vue.prototype.$ELEMENT, {}, e);
              })
              const elderlyConfig = {
                // 顶部头的高度
                headerHeight: '90px',
                // tabs 的高度
                tabHeight: '68x',
                // 左侧菜单的宽度
                leftWidth: '358px',
                // logo框的宽度（菜单为top时有效，其余logo框宽度等于左侧菜单宽度）
                logoWidth: '358px',
              }
              const indexElderlyConfigChange=(index_page)=>{
                  const themeStorage = createWebStorage(import.meta.env.VITE_THEME_STORAGE_KEY, { isLocal: true, })
                  const indexTheme = themeStorage.get(import.meta.env.VITE_THEME_STORAGE_KEY)
                  if(indexTheme==='elderly-oriented'){
                    index_page.$store.dispatch('setStateValue', elderlyConfig)
                  }else{
                     index_page.$store.dispatch('setStateValue',faceConfig.indexPageConfig)
                  }
              }
              export {
                elderlyConfig,
                elderlyEventBus,
                indexElderlyConfigChange,
              }
          `,
          },
        ],
      }),
    ],
  );

  let rmsv = multipleScopeVars;
  const presetTheme = `theme-${getEnv('VITE_PRESET_THEME')}`;
  if (!isEnvTrue('VITE_ONLINE_THEME_ENABLED')) {
    rmsv = rmsv.filter((it) => {
      return it.scopeName === presetTheme;
    });
  }
  plugins.push(
    themePreprocessorPlugin.default({
      less: {
        // 提供多组变量文件
        multipleScopeVars: rmsv,
        // css中不是由主题色变量生成的颜色，也让它抽取到主题css内，可以提高权重
        includeStyleWithColors: [
          {
            // color: '#ffffff',
            // 此类颜色的是否跟随主题色梯度变化，默认false
            // inGradient: true,
          },
        ],
        // 默认取 multipleScopeVars[0].scopeName
        defaultScopeName: presetTheme,
        // 在生产模式是否抽取独立的主题css文件，extract为true以下属性有效
        extract: false,
      },
    }),
  );
  plugins.push(FileReplace(viteCommonConfig.cli.files));
  return plugins;
}

/**
 * 开发时的插件
 */
function devPlugins(_mode: string) {
  const {historyPage} = viteCommonConfig.cli;
  const rewrites = historyPage.map((hp) => {
    return {
      from: new RegExp(`${hp}/.*`),
      to: `${getEnv('VITE_PUBLIC_PATH')}${hp}.html`,
    };
  });
  return [
    viteCommonjs({
      include: (viteCommonConfig.commonjs.include as Array<string>).map((k) =>
        k.replaceAll('**', ''),
      ),
      exclude: ['core-js', '@itk-wasm/dicom', 'itk-wasm', 'itk'],
    }),
    // 查看vite各个插件对于每个文件是如何加载/处理,对于调试代码有一定的作用
    Inspect(),
    // 页面修改为history模式
    historyApiFallbackPlugin({
      rewrites,
    }),
  ];
}

/**
 * 编译生产代码时的插件
 * @param _mode
 */
async function prodPlugins(_mode: string) {
  const result = [];
  if (isEnvTrue('BUILD_REPORT')) {
    // 编译生产代码时,对于各个chunks文件包含内容进行可视化的查看,并提供拆分代码的依据
    result.push(
      visualizer({
        filename: `${getEnv('OUTPUT_DIR')}/report.html`,
        gzipSize: true,
      }),
    );
  }
  result.push(
    StringReplace([
      {
        fileName: 'jquery.js',
        search: 'v2.2.1',
        replace: '',
      },
      {
        fileName: 'vue-grid-layout.common.js',
        search: 'new external_commonjs_vue_commonjs2_vue_root_Vue_default.a',
        replace: 'new external_commonjs_vue_commonjs2_vue_root_Vue_default.a.default',
      },
    ]),
  );
  if (isEnvTrue('BUILD_INJECT_MODERN_POLYFILLS')) {
    result.push(
      legacy({
        modernPolyfills: await import('core-js-compat').then((d) => {
          return d.default(viteCommonConfig.build.polyfills).list;
        }),
        renderLegacyChunks: false,
      }),
    );
  }
  if (isEnvTrue('BUILD_LEGACY') && !isEnvTrue('BUILD_DEMAND_UI_IMPORT')) {
    if (isEnvTrue('BUILD_INJECT_MODERN_POLYFILLS')) {
      result.pop();
    }
    const modernPolyfills = await import('core-js-compat').then((d) => {
      return d.default(viteCommonConfig.build.polyfills).list;
    });
    const targetsWithIE = {
      ie: '11',
    };
    const legacyPolyfills = await import('core-js-compat').then((d) => {
      return d.default({
        targets: targetsWithIE,
      }).list;
    });
    result.push(
      legacy({
        targets: ['defaults', 'IE 11'],
        additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
        modernPolyfills: isEnvTrue('BUILD_INJECT_MODERN_POLYFILLS') ? modernPolyfills : [],
        polyfills: legacyPolyfills,
      }),
    );
  }
  if (isEnvTrue('BUILD_INSPECT_REPORT')) {
    result.push(
      Inspect({
        build: true,
        outputDir: '.vite-inspect',
      }),
    );
  }
  return result;
}

export async function buildPlugins(mode: string, ignoreHtmlPlugin: boolean = false) {
  const plugins = [];
  plugins.push(...(await basePlugins(mode, ignoreHtmlPlugin)));
  if (mode === 'development') {
    plugins.push(...devPlugins(mode));
  }
  if (mode === 'production' || mode === 'preview') {
    plugins.push(...(await prodPlugins(mode)));
    if (isEnvTrue('BUILD_INSPECT')) {
      plugins.push(
        Inspect({
          build: true,
          outputDir: '.vite-inspect',
        }),
      );
    }
  }
  plugins.push(ReplaceName());
  return plugins;
}
