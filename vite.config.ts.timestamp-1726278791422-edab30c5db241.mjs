var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// viteCommonConfig.ts
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url, _default, viteCommonConfig_default;
var init_viteCommonConfig = __esm({
  "viteCommonConfig.ts"() {
    "use strict";
    __vite_injected_original_import_meta_url = "file:///D:/Desktop/project/yinhai/vue/test5/demo/viteCommonConfig.ts";
    _default = {
      alias: {
        base: {
          // 框架基础的alias
          // 这里使用方法比较复杂,这是为了在Webstorm(需要2022.3)中可以通过鼠标点击import语句中的alias直接进入相应的文件
          "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url)),
          "@common": fileURLToPath(new URL("./cli/common/src", __vite_injected_original_import_meta_url)),
          // '@common': '@yh/cli-internal-common/src',
          "@projectCommon": fileURLToPath(new URL("./cli/projectCommon/src", __vite_injected_original_import_meta_url)),
          faceConfig: fileURLToPath(new URL("./faceConfig", __vite_injected_original_import_meta_url)),
          // 将第三方模块指向其对应的ES模块文件
          moment: { find: /^moment$/, replacement: "moment/src/moment" },
          less: { find: /^less$/, replacement: "less/lib/less-browser/index" },
          vue: { find: /^vue$/, replacement: "vue/dist/vue.esm.js" },
          vuex: { find: /^vuex$/, replacement: "vuex/dist/vuex.esm.js" },
          "vue-router": { find: /^vue-router$/, replacement: "vue-router/dist/vue-router.esm.js" },
          // 弃用: common 别名已弃用,请使用@common别名,留在这里只是为了兼容,后期会移除
          common: fileURLToPath(new URL("./cli/common/src", __vite_injected_original_import_meta_url))
        },
        development: {},
        production: {
          // 在生产时期将@yh/ta-utils指向utils.esm.ts
          // 这个文件只包含ESM下的import/export(具名export)
          // 可以在生产环境下使用tree-shaking将未使用的工具代码移除
          // '@yh/ta-utils': {
          //   find: /^@yh\/ta-utils$/,
          //   replacement: '@yh/cli-internal-common/src/utils.esm.ts',
          // },
        }
      },
      // 第三方资源复制到生成的dist中
      copyResources: [
        {
          from: "node_modules/@yh/ta404-ui/static/*",
          // 来源路径,相对于项目根路径的相对路径
          to: "static"
          // dist目录下的路径
        }
      ],
      // dev/preview有效, 用于在dev/preview时自动打开文件
      // 设置成false可禁用
      open: false,
      // 在这里覆盖由于主题换肤导致的样式覆盖
      includeStyles: {
        ".ant-fullcalendar-fullscreen .ant-fullcalendar-selected-day .ant-fullcalendar-value": {
          color: "#FFFFFF"
        },
        ".ant-btn-primary:hover, .ant-btn-primary:focus": {
          color: "#FFFFFF"
        },
        ".ta-tag-select .tag-select-btn:hover": {
          color: "#1B65B9"
        },
        // button 的 link 属性会被主题换肤覆盖
        ".ant-btn-link:hover, .ant-btn-link:focus": {
          "border-color": "transparent"
        },
        // 经办权限管理>新增角色的 step 样式被主题换肤覆盖
        ".ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon": {
          color: "#FFF"
        }
      },
      // 给 dev 和 prod 环境使用的 commonjs 配置
      commonjs: {
        // 同时给 dev 和 prod 环境使用的 commonjs.include 配置
        // 注意: 这里是以一个目录为基本单位,且必须是这样的写法
        // 在 dev 时期,这个配置会被移除头尾的**
        // 在 prod 时期,这个配置会原封不动的传递给 build.commonjsOptions.include
        include: ["**/node_modules/**", "**/cli/**", "**/internal/**", "**/pages/**", "**/src/**"],
        // 仅用于 prod 时期的配置,用于指定哪些文件会被 commonjs 插件处理
        extensions: [".js", "cjs", ".vue", ".jsx", ".ts", ".cts", ".tsx"]
      },
      build: {
        maxMemory: 8192,
        // 8GB
        // 是否对生成的代码进行tree-shaking优化
        // 设置这个值为false,可能可以解决一部分由于tree-shaking导致的代码丢失等问题
        // 设置为true, 可能可以提升页面性能(通过移除没有使用的代码等操作)
        treeshake: true,
        // 是否使用代码压缩,可选值: false/'terser'/'esbuild'
        // false: 禁用代码压缩
        // 'terser'/'esbuild': 使用对应的工具进行代码压缩
        minify: false,
        // 使用terser时,传递给terser的信息
        terserOptions: {
          // 具体的配置可参考: https://terser.org/docs/api-reference#minify-options
        },
        // 是否压缩css代码,可选值: false/'lightningcss'/'esbuild'
        // false: 禁用代码压缩
        // 'lightningcss'/'esbuild': 使用对应的工具进行代码压缩
        // FIXME: 目前'lightningcss'不可用,会报错
        cssMinify: "esbuild",
        // 按需加载polyfills, 此处设置的是浏览器的最低版本
        // 只需要配置现代浏览器的最低版本
        // IE兼容通过BUILD_LEGACY变量自动注入ie: '11'配置,且仅兼容IE11
        // 注意: 兼容配置仅支持生产环境,开发时不进行支持
        polyfills: {
          targets: {
            chrome: "64"
          }
        }
      },
      optimizeDeps: {
        include: [
          // 不方便或不能直接写到/build-vite/optimize/optimize.ts文件中的依赖
          // 例如某个依赖直接依赖的某个依赖需要提前优化,但这个依赖不是框架本身的依赖
          "@yh/cli-pages-index > @wcjiang/notify",
          "@yh/cli-pages-orguser > vue-cookies"
        ],
        entries: [
          // 默认情况下,会读取html配置,并将所有html文件放到此配置中,
          // 此处可以添加没有配置到html中的但是需要访问的html文件
          // 一般来说,你不需要对这个数组进行修改
        ],
        needsInterop: [
          // 当你的控制台输出类似此信息时可将依赖(文件)添加到这里
          // Mixed ESM and CJS detected in @yh/ta-utils/crossDomain, add it to optimizeDeps.needsInterop to speed up cold start
          // 它会预编译依赖
          "@yh/ta-utils/crossDomain"
        ],
        exclude: [
          // 在优化时,需要排除的一些不需要优化的依赖或虚拟模块,以避免优化期间报错
          "virtual:dynamicTheme",
          "virtual:themeDefinitions",
          "virtual:dynamicI18n",
          "virtual:historyPage",
          "virtual:darkMode",
          "virtual:elderly",
          "@itk-wasm/dicom",
          "itk-wasm",
          "itk",
          // '@kitware/vtk.js',
          "cornerstone",
          "cornerstone-core",
          "cornerstone-wado-image-loader",
          "@cornerstonejs/dicom-image-loader"
        ]
      },
      html: [
        "!/node_modules/@yh/cli-pages-login/src/login.html",
        "/src/override/login-override-demo/login.html"
        // 配置需要进行加载的html
        // 必须以/或!开头
        // 可以直接指定一个html文件的完整路径
        // 例如:
        // '/src/scopes/core/orgModules/orguser/orguser.html'
        // 推荐以这种方式进行配置
        // 在某个目录下html文件过多时,也可以提供一个glob来进行配置
        // 其中: **表示一层或多层中间目录,*表示任意文件名
        // '/src/scopes/core/**/*.html'
        // 排除某些文件
        // '!/src/corePage/**/uiredirect.html'
        // 注意1: 只有配置在这里(`html`)或`cli.modules`下或`.pnpm/pages.cjs`下的html模块可以被vite-plugin-virtual-html插件解析并加载
        // 注意2: 配置应该以/或!开头
        // 高级配置:
        // 如果你需要将html文件放置到一个特定的目录下进行访问时
        // 或
        // 项目中有多个同名的html的文件时
        // 或
        // 某个html文件在最终访问时的名称与项目中的html文件的名称不一致时
        // 此时,你可以通过传入对象来分别对每个html页面进行单独的配置
        // 例如下面的几个例子,在最终生成的时候
        // 例1: 使用路径 http://localhost:5173/demo/login1.html 访问页面
        // {
        //   path: 'demo/login1',
        //   entry: '/src/corePage/login/login.html',
        // },
        // 例2: 使用路径 http://localhost:5173/login2.html 访问页面
        // {
        //   path: 'login1',
        //   entry: '/src/corePage/login/login.html',
        // }
      ],
      cli: {
        // 注意1: 这里配置的是放置在(/src/project)目录下的模块的html文件
        // 注意2: 这里配置的模块会作为html插件的配置注入一个glob,例如: /src/project/**/demoTest.html
        // 注意3: 如果在(/src/project)目录下,有多个相同名字的html文件,那么你必须在上面的`html`配置中排除其他的文件 或 在`html`配置中分别为每个html文件指定'目录'或'别名',详细查看html配置说明
        modules: ["cleverAiPacs"],
        // 这个配置可以用来配置 html 文件相关的内容
        html: {
          // 用于定义 HTML 页面的 title
          // 你也可以在这里添加项目的HTML 文件的配置
          // 但是,注意,在 HTML 文件中使用时,必须使用: %VITE_HTML_TITLE_*%
          // 的形式来使用
          title: {
            audit: "\u5BA1\u8BA1\u7BA1\u7406",
            authority: "\u6743\u9650\u7BA1\u7406",
            demo_test: "\u793A\u4F8B\u6A21\u5757",
            function_modules: "\u529F\u80FD\u6A21\u5757",
            index: "Ta+3404\u5F00\u53D1\u5E73\u53F0",
            login: "\u767B\u5F55",
            logmg: "\u65E5\u5FD7\u7BA1\u7406",
            messagemg: "\u6D88\u606F\u5386\u53F2\u7BA1\u7406",
            orguser: "\u7EC4\u7EC7\u7BA1\u7406",
            project_demo: "\u7EC4\u4EF6\u793A\u4F8B",
            register: "\u6CE8\u518C",
            resourcemg: "\u8D44\u6E90\u7BA1\u7406",
            sysmg: "\u7CFB\u7EDF\u7BA1\u7406",
            uiredirect: "uiredirect",
            user_center: "\u4E2A\u4EBA\u4E2D\u5FC3",
            work_table_page: "\u5DE5\u4F5C\u53F0\u6A21\u5757",
            // ----新系统---- //
            clevel_ai_pacs: "\u667A\u6167\u533B\u7597\u5F71\u50CF\u7CFB\u7EDF"
          }
        },
        // 用于指定框架默认的页面的各个子模块的实现,只有在这里提供的子模块才能被覆盖
        override: {
          // 结构
          // 如果是通用的组件,那么直接放到第一级
          // 如果是某个页面的组件, 那么使用页面名字的对象,例如下面的login
          "routes-container": "@yh/cli-internal-common/src/components/routesContainer.vue",
          // 以login/src/modify-password举例:
          // 在使用时,使用h('login/src/modify-password')或h('login_src_modify-password')或在vue的template中使用<login_src_modify-password/>标签
          // 通过unplugin-vue-components的处理后
          // 将会转换为对这个对象: login.src.modify-password 的引用
          login: {
            // 各个可以覆盖的模块,直接指定其所在的路径
            // 如果使用node_modules下的实现则不需要/开头
            // 这个实现可以使用任何可渲染出页面的文件,如.vue/.js/.jsx/.ts/.tsx等
            login: "/src/override/login-override-demo/login.vue",
            // login: '@yh/cli-pages-login/src/login.vue',
            // login: '/src/override/login-override-demo/login.vue',
            // login: '/src/override/login-override-demo/login-js.js',
            // login: '/src/override/login-override-demo/login-jsx.jsx',
            src: {
              "modify-password": "@yh/cli-pages-login/src/part/modifyPassword.vue",
              "social-list": "@yh/cli-pages-login/src/part/socialList.vue",
              "login-form": "/src/override/login-override-demo/loginForm.vue",
              "sms-login-form": "@yh/cli-pages-login/src/part/smsLoginForm.vue",
              verify: "@yh/cli-pages-login/src/part/verifition/Verify.vue"
            }
          }
          // index: {
          //   'menu-horizon': '/src/override/index-override-demo/menuHorizon.vue',
          // },
        },
        // 在这里配置的页面可以使用vue-router的history路由
        historyPage: [
          // 'projectDemo'
        ],
        // 替换某些文件的内容为另一个文件
        // 注意: 这个功能可能会导致你在调试特定文件时出现混淆
        // 例如: 修改文件后确没有在页面上显示
        files: [
          // {
          // file 可以是一个文件名,也可以是一个文件的路径(可以是一部分,但是必须是连续的,例如: 有一个文件,/a/b/c/d.vue. file可以写为a/b/c/d.vue或 c/d.vue 等,但是不能是a/d.vue)
          //   file: 'page.vue',
          // newFile的写法必须是下面的这个写法,这样才能获取到newFile 的完整路径
          //   newFile: fileURLToPath(new URL('./src/Demo.vue', import.meta.url)),
          // },
        ]
      },
      // 这个配置仅用于build:mpa脚本
      // 当传入一个数组时: 仅编译数组中的页面
      // 当传入true时,将编译所有可用的页面(与pnpm build一致,但是会将各个页面的assets放到独立的assets目录中)
      // 注意: 这个功能应当仅用于少量页面的打包,如果页面过多,则会导致编译时间过长
      mpa: ["login"]
    };
    viteCommonConfig_default = _default;
  }
});

// build-vite/src/utils.ts
import { loadEnv } from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite/dist/node/index.js";
import path from "path";
import chalk from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/chalk@5.3.0/node_modules/chalk/source/index.js";
async function initEnv(mode) {
  viteAppEnv = loadEnv(
    mode === "optimize" ? "development" : mode,
    path.resolve(process.cwd(), "./.env"),
    ""
  );
  currentMode = mode;
}
function getEnv(key) {
  if (key === void 0) {
    error(chalk.bgRed("\u5728\u83B7\u53D6env\u65F6,\u5FC5\u987B\u4F20\u5165env\u7684\u540D\u5B57!"));
    return void 0;
  }
  const env = viteAppEnv[key];
  if (env === void 0) {
    if (key !== "RUN_ENV") {
      warn(
        `\u5728\`${chalk.blueBright(`.env.${currentMode}`)}\`\u6587\u4EF6\u4E2D\u6CA1\u6709\u627E\u5230\u73AF\u5883\u53D8\u91CF:${chalk.blue(
          key
        )}! \u8FD9\u4E2A\u8B66\u544A\u4E00\u822C\u60C5\u51B5\u4E0B\u53EF\u4EE5\u5FFD\u7565!`
      );
    }
  }
  return env;
}
function isEnvTrue(key) {
  return getEnv(key)?.toUpperCase() === "TRUE";
}
function getOpen() {
  let open = false;
  if (viteCommonConfig_default.open) {
    open = `${getEnv("VITE_PUBLIC_PATH")}/${viteCommonConfig_default.open}`.replaceAll(/\/\//g, "/");
  }
  return open;
}
function warn(msg) {
  console.warn(msg);
}
function error(msg) {
  console.error(msg);
}
var viteAppEnv, currentMode;
var init_utils = __esm({
  "build-vite/src/utils.ts"() {
    "use strict";
    init_viteCommonConfig();
  }
});

// build-vite/src/css.ts
import autoprefixer from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/autoprefixer@10.4.16_postcss@8.4.31/node_modules/autoprefixer/lib/autoprefixer.js";
async function css() {
  return {
    postcss: {
      plugins: [
        // @ts-expect-error 忽略这里的类型错误
        autoprefixer({
          // 配置使用 autoprefixer
          overrideBrowserslist: ["> 1%", "last 3 versions", "ie >= 11", "chrome >= 41"]
        })
      ]
    },
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        math: "always",
        additionalData: `
        @import "@yh/ta404-ui/es/style/mixins/index.less";
        @import "cli/projectCommon/src/styleCover/mixins/func.less";
        @import "internal/theme/preset-theme/global-customer-vars.less";
        @import "cli/projectCommon/src/styleCover/styleCover.less";
        `,
        modifyVars: {
          // 在less文件中提供当前项目的public-path变量
          "public-path": getEnv("VITE_PUBLIC_PATH").endsWith("/") ? getEnv("VITE_PUBLIC_PATH") : `${getEnv("VITE_PUBLIC_PATH")}/`
        }
      }
    },
    preprocessorMaxWorkers: true
  };
}
var init_css = __esm({
  "build-vite/src/css.ts"() {
    "use strict";
    init_utils();
  }
});

// build-vite/src/unplugin-resolver/cli-components.override.ts
import { kebabCase } from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.25.6_rollup@3.29.4_vue@2.7.16_patch_hash=hmgwvlvntssyhpqtiknghn5nei_/node_modules/unplugin-vue-components/dist/index.js";
import { mergeConfig } from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite/dist/node/index.js";
import { readFileSync } from "node:fs";
import glob from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/fast-glob@3.3.1/node_modules/fast-glob/out/index.js";
var modulePages, OVERRIDE_PAGES_COMPONENTS, cli_components_override_default;
var init_cli_components_override = __esm({
  "build-vite/src/unplugin-resolver/cli-components.override.ts"() {
    "use strict";
    init_viteCommonConfig();
    init_utils();
    modulePages = {};
    glob.sync([`${glob.convertPathToPattern(process.cwd())}/node_modules/@yh/**/pages.json`]).forEach((file) => {
      const content = readFileSync(file).toString();
      try {
        const jsonContent = JSON.parse(content);
        Object.assign(modulePages, jsonContent);
      } catch (e) {
        const filePath = file.replace(process.cwd(), "");
        error(`JSON\u6587\u4EF6\u8F6C\u6362\u65F6\u51FA\u73B0\u9519\u8BEF!
\u8BF7\u68C0\u67E5\u6587\u4EF6: '${filePath}'`);
        throw e;
      }
    });
    OVERRIDE_PAGES_COMPONENTS = mergeConfig(modulePages, viteCommonConfig_default.cli.override);
    cli_components_override_default = () => {
      return {
        type: "component",
        resolve(name) {
          const kbName = kebabCase(name);
          if (OVERRIDE_PAGES_COMPONENTS[kbName]) {
            return {
              from: OVERRIDE_PAGES_COMPONENTS[kbName]
            };
          }
          const paths = kbName.replace(/_/g, "/").split("/");
          if (!OVERRIDE_PAGES_COMPONENTS[paths[0]]) {
            return;
          }
          const pageResult = paths.reduce((pv, cv) => {
            if (pv === void 0 || !pv) {
              return void 0;
            }
            if (cv in pv) {
              return pv[cv];
            }
            return void 0;
          }, OVERRIDE_PAGES_COMPONENTS);
          if (pageResult === void 0) {
            return;
          }
          return {
            from: pageResult
          };
        }
      };
    };
  }
});

// multipleService.config.ts
import { POS } from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/vite-plugin-virtual-html@1.1.16_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite-plugin-virtual-html/dist/index.mjs";
var multipleServiceConfig, multipleService_config_default;
var init_multipleService_config = __esm({
  "multipleService.config.ts"() {
    "use strict";
    multipleServiceConfig = {
      // 模块名称必须与html相匹配
      // 1. 对一个具体的页面,可直接使用如下的配置进行注入,一般建议直接使用这种方式
      "login.html": '<script>window.dd = "dd";</script>',
      // 也可以通过传入一个对象来注入配置
      // 'login.html': {
      //   // pos: POS.before,
      //   // find: '</head>',
      //   replacement: '<script>window.dd = "dd";</script>',
      // },
      // 其中,pos和find是可选的,若不传入时,其默认值为
      // {pos: POS.before, find: '</head>'},
      // 2. 特殊配置,将会在所有html文件生效
      // 配置规则与具体页面的配置相同
      "*": {
        // 查找内容
        find: "</head>",
        // 在查找内容前/后替换查找内容
        pos: POS.before,
        // 要替换的内容,这个内容可以是script,也可以是其他的内容
        replacement: `
    <script>
    window.bb = "bb";
    </script>
    `
      }
    };
    multipleService_config_default = {
      multipleServiceConfig
    };
  }
});

// build-vite/mpa/pages.ts
import glob2 from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/fast-glob@3.3.1/node_modules/fast-glob/out/index.js";
import { readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";
import { normalizePath } from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite/dist/node/index.js";
import { POS as POS2 } from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/vite-plugin-virtual-html@1.1.16_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite-plugin-virtual-html/dist/index.mjs";
async function getInternalPages() {
  const yhModules = await readdir(resolve(__dirname2, "./node_modules/@yh/"));
  return yhModules.filter((m) => m.indexOf("cli-pages") >= 0).map((m) => {
    return `/node_modules/@yh/${m}/**/*.html`;
  });
}
function getHtmlName(html) {
  return html.substring(html.lastIndexOf("/") + 1, html.length).split(".")[0];
}
async function getAllPages() {
  const internalPages = await getInternalPages();
  const modulePages2 = modules.map((m) => `/src/project/**/${m}.html`);
  const allPagesConfig = [].concat(internalPages).concat(modulePages2).concat(htmlPages);
  allPagesConfig.push(IGNORE_NODE_MODULES_HTML);
  const globPattern = allPagesConfig.map((html) => {
    try {
      if ("entry" in html) {
        return void 0;
      }
    } catch {
    }
    if (html[0] === "!") {
      return `!${normalizePath(process.cwd())}${html.replace("!", "")}`;
    }
    return normalizePath(process.cwd() + html);
  }).filter((v) => v !== void 0);
  const pages = {};
  glob2.sync(globPattern).forEach((g) => {
    pages[getHtmlName(g.replace(normalizePath(process.cwd()), ""))] = g.replace(
      normalizePath(process.cwd()),
      ""
    );
  });
  allPagesConfig.forEach((html) => {
    try {
      if (!("entry" in html)) {
        return;
      }
    } catch {
      return;
    }
    pages[html.path] = html.entry;
  });
  return pages;
}
async function getInjectCode() {
  const injectVariables = {};
  Object.keys(multipleService_config_default.multipleServiceConfig).forEach((k) => {
    const v = multipleService_config_default.multipleServiceConfig[k];
    if (Object.prototype.toString.call(v) === "[object Object]") {
      injectVariables[k] = {
        pos: POS2.before,
        find: "</head>",
        ...v
      };
    } else {
      injectVariables[k] = {
        pos: POS2.before,
        find: "</head>",
        replacement: v
      };
    }
  });
  return injectVariables;
}
var __vite_injected_original_import_meta_url2, htmlPages, cli, modules, __dirname2, IGNORE_NODE_MODULES_HTML;
var init_pages = __esm({
  "build-vite/mpa/pages.ts"() {
    "use strict";
    init_multipleService_config();
    init_viteCommonConfig();
    __vite_injected_original_import_meta_url2 = "file:///D:/Desktop/project/yinhai/vue/test5/demo/build-vite/mpa/pages.ts";
    ({ html: htmlPages, cli } = viteCommonConfig_default);
    ({ modules } = cli);
    __dirname2 = resolve(dirname(fileURLToPath2(__vite_injected_original_import_meta_url2)), "../../");
    IGNORE_NODE_MODULES_HTML = "!/node_modules/**/node_modules/**/*.html";
  }
});

// build-vite/src/replace-name/index.ts
import MagicString from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/magic-string@0.30.8/node_modules/magic-string/dist/magic-string.es.mjs";
var replace_name_default;
var init_replace_name = __esm({
  "build-vite/src/replace-name/index.ts"() {
    "use strict";
    replace_name_default = () => {
      return {
        name: "@yh/vite-plugin-generate-sfc-name",
        enforce: "post",
        transform(code, id, options) {
          if (!id.endsWith(".vue") && code.indexOf("_sfc_main") >= 0) {
            const fileName = id.substring(id.lastIndexOf("/") + 1, id.length - 4);
            const msc = new MagicString(code);
            const sfcRenderIndex = /(const|var) _sfc_render/g;
            for (const matched of code.matchAll(sfcRenderIndex)) {
              const { index } = matched;
              msc.appendLeft(index, `_sfc_main.name='${fileName}';\r
`);
            }
            return {
              code: msc.toString(),
              sourcemap: msc.generateMap()
            };
          }
        }
      };
    };
  }
});

// build-vite/src/copyModulePublic.ts
import glob3 from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/fast-glob@3.3.1/node_modules/fast-glob/out/index.js";
function copyModulePublic() {
  return glob3.sync([`${glob3.convertPathToPattern(process.cwd())}/node_modules/@yh/*/public/**`]).map((file) => {
    return {
      from: file,
      to: ""
    };
  });
}
var init_copyModulePublic = __esm({
  "build-vite/src/copyModulePublic.ts"() {
    "use strict";
  }
});

// internal/replace-files/src/index.ts
import { readFile } from "node:fs/promises";
var src_default;
var init_src = __esm({
  "internal/replace-files/src/index.ts"() {
    "use strict";
    src_default = (opts) => {
      return {
        name: "@yh/vite-plugin-file-replacer",
        async load(id, options) {
          const filterOpt = opts.filter((opt) => {
            return id.indexOf(opt.file) >= 0;
          });
          if (filterOpt.length <= 0) {
            return null;
          }
          const { newFile } = filterOpt[0];
          return (await readFile(newFile)).toString();
        }
      };
    };
  }
});

// build-vite/src/plugin.ts
import * as path2 from "node:path";
import * as fs from "node:fs";
import { viteCommonjs } from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/@yh+vite-plugin-commonjs@1.0.4/node_modules/@yh/vite-plugin-commonjs/dist/index.mjs";
import VirtualHtml, { historyApiFallbackPlugin } from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/vite-plugin-virtual-html@1.1.16_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite-plugin-virtual-html/dist/index.mjs";
import vue from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/@vitejs+plugin-vue2@2.3.1_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0__vue@2.7.1_gzgtz5jxowuuafre77cj6g3hmq/node_modules/@vitejs/plugin-vue2/dist/index.mjs";
import jsx from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/@vitejs+plugin-vue2-jsx@1.1.1_rollup@3.29.4_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser_cbo3lqvyyfsqnvvuncenpbxp4e/node_modules/@vitejs/plugin-vue2-jsx/dist/index.mjs";
import Inspect from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/vite-plugin-inspect@0.8.3_rollup@3.29.4_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0_/node_modules/vite-plugin-inspect/dist/index.mjs";
import { visualizer } from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/rollup-plugin-visualizer@5.9.2_rollup@3.29.4/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { viteStaticCopy } from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/vite-plugin-static-copy@1.0.0_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0_/node_modules/vite-plugin-static-copy/dist/index.js";
import legacy from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/@vitejs+plugin-legacy@5.3.0_esbuild@0.20.2_terser@5.21.0_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0_/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import virtualModule from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/vite-plugin-virtual-modules@0.2.0/node_modules/vite-plugin-virtual-modules/dist/index.mjs";
import themePreprocessorPlugin from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/@zougt+vite-plugin-theme-preprocessor@1.4.8/node_modules/@zougt/vite-plugin-theme-preprocessor/dist/index.js";
import { uiVite } from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/@yh+vite-plugin-cli-importer@0.0.5/node_modules/@yh/vite-plugin-cli-importer/dist/index.js";
import unplugin from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.25.6_rollup@3.29.4_vue@2.7.16_patch_hash=hmgwvlvntssyhpqtiknghn5nei_/node_modules/unplugin-vue-components/dist/vite.js";
import StringReplace from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/vite-plugin-string-replace@1.1.2/node_modules/vite-plugin-string-replace/dist/index.mjs";
function resolvePresetThemePath(file) {
  return path2.resolve(__vite_injected_original_dirname, "../../internal/theme/preset-theme", file ?? "");
}
async function readPresetThemePrimaryColor() {
  const { includeStyles } = viteCommonConfig_default;
  const presetThemes = await fsp.readdir(resolvePresetThemePath());
  const multipleScopeVars = [];
  const virtualThemes = {};
  for (const theme of presetThemes) {
    if (theme.endsWith(".less")) {
      const lessCode = (await fsp.readFile(resolvePresetThemePath(theme))).toString();
      const match = lessCode.matchAll(PRIMARY_COLOR_REGEX);
      const primaryColor = match.next().value[1];
      multipleScopeVars.push({
        scopeName: `theme-${theme.replace(".less", "")}`,
        path: resolvePresetThemePath(theme),
        includeStyles
      });
      virtualThemes[theme.replace(".less", "")] = {
        "primary-color": primaryColor
      };
    }
  }
  return {
    multipleScopeVars,
    virtualThemes
  };
}
async function basePlugins(_mode, ignoreHtmlPlugin = false) {
  const { copyResources, html, cli: cli2 } = viteCommonConfig_default;
  const targets = [...copyResources, ...copyModulePublic()].map((resource) => {
    return {
      src: resource.from,
      dest: resource.to
    };
  });
  const { historyPage } = cli2;
  const historyPageInjectIntoFaceConfig = historyPage.map((hp) => {
    return `${hp}.html`;
  });
  const { multipleScopeVars, virtualThemes } = await readPresetThemePrimaryColor();
  const useLessFile = getEnv("VITE_PERF_LOAD_LESS");
  const useSingleCss = useLessFile === "single";
  const useOldModules = isEnvTrue("USE_OLD_MODULES_SUPPORT");
  const useDemandImport2 = isEnvTrue("BUILD_DEMAND_UI_IMPORT");
  const plugins = [];
  if (!ignoreHtmlPlugin) {
    const pages = await getAllPages();
    const injectVariables = await getInjectCode();
    plugins.push(
      // 自动识别项目下的所有html文件,并且排除部分不需要的文件
      VirtualHtml({
        pages,
        injectCode: injectVariables
      })
    );
  }
  plugins.push(
    ...[
      vue({}),
      jsx({
        compositionAPI: false
      }),
      unplugin({
        resolvers: [cli_components_override_default()],
        version: 2.7,
        dts: false,
        include: [/\.vue/, /\.vue\?vue/, /\.md/, /\.([tj])sx?/, /[\\/]node_modules[\\/]@yh[\\/]/],
        exclude: [/[\\/]\.git[\\/]/, /[\\/]node_modules[\\/]\.vite[\\/]/]
      }),
      uiVite({
        transform(moduleName, camelCase) {
          let uiName = "@yh/ta404-ui";
          let uiStylePostfix = ".less";
          let modules2 = `import {${moduleName}} from "@yh/ta404-ui";`;
          if (useOldModules) {
            modules2 = `import ${moduleName} from "@yh/ta404-ui/es/${camelCase}";`;
          }
          if (useLessFile === "false") {
            uiName = "@yh/cli-internal-precompiled-less";
            uiStylePostfix = ".css";
          }
          let styleImporter = "";
          if (useSingleCss) {
            styleImporter = 'import "@yh/cli-internal-precompiled-less/css/ui.css";';
          } else {
            styleImporter = `import "${uiName}/es/${camelCase}/style/index${uiStylePostfix}";`;
          }
          let result = "";
          if (useDemandImport2 && [...DEMAND_UI_IMPORT_BLACK_LIST, ...IGNORE_VUE_USE].indexOf(camelCase) < 0) {
            result = `
          const ${moduleName} = await import('@yh/ta404-ui/es/${camelCase}');
          Vue.use(${moduleName}.default);
                ${styleImporter}
                `;
          } else {
            result = `
              ${modules2}
              ${styleImporter}
              `;
            if (IGNORE_VUE_USE.indexOf(camelCase) < 0) {
              result += `
            Vue.use(${moduleName});
            `;
            }
          }
          return result;
        }
      }),
      // 复制静态文件
      viteStaticCopy({
        targets
      }),
      virtualModule({
        modules: [
          {
            // 动态换肤配置
            moduleName: "dynamicTheme",
            moduleValue: "import { initTheme, } from '@yh/cli-internal-dynamic-theme';initTheme();"
          },
          {
            moduleName: "themeDefinitions",
            moduleValue: `export default ${JSON.stringify(virtualThemes)};`
          },
          {
            // i18n配置
            moduleName: "dynamicI18n",
            moduleValue: `
          import { makeI18n, } from '@yh/cli-internal-precompiled-locales';
          export {
            makeI18n,
          }
          `
          },
          {
            moduleName: "historyPage",
            moduleValue: `
          const historyPage = ${JSON.stringify(historyPageInjectIntoFaceConfig)};
          export default historyPage;
          `
          },
          {
            moduleName: "darkMode",
            moduleValue: `
          import { updateColorWeak, } from '@yh/cli-internal-dynamic-theme';
          import { createWebStorage, } from '@yh/ta-utils';

          if(import.meta.env.VITE_ENABLE_DARK_MODE.toUpperCase() === 'TRUE'){
            import('/internal/theme/dark/dark-mode.less');
            const darkModeStorage = createWebStorage(import.meta.env.VITE_THEME_STORAGE_KEY, { isLocal: true, });
            const sv = darkModeStorage.get('dark_mode');
            updateColorWeak(sv === null ? import.meta.env.VITE_DARK_MODE.toUpperCase() === 'TRUE' : !!sv);
          }
          `
          },
          {
            // 适老化模块
            moduleName: "elderly",
            moduleValue: `
             import { useEventBus, } from '@vueuse/core';
             import Vue from 'vue';
             import { createWebStorage, } from '@yh/ta-utils';
             const elderlyEventBus = useEventBus('elderly');
             // \u521D\u59CB\u5316size
              Vue.prototype.$ELEMENT = {
                size: 'default',
              }
              Vue.observable(Vue.prototype.$ELEMENT)
              elderlyEventBus.on((e) => {
                Object.assign(Vue.prototype.$ELEMENT, {}, e);
              })
              const elderlyConfig = {
                // \u9876\u90E8\u5934\u7684\u9AD8\u5EA6
                headerHeight: '90px',
                // tabs \u7684\u9AD8\u5EA6
                tabHeight: '68x',
                // \u5DE6\u4FA7\u83DC\u5355\u7684\u5BBD\u5EA6
                leftWidth: '358px',
                // logo\u6846\u7684\u5BBD\u5EA6\uFF08\u83DC\u5355\u4E3Atop\u65F6\u6709\u6548\uFF0C\u5176\u4F59logo\u6846\u5BBD\u5EA6\u7B49\u4E8E\u5DE6\u4FA7\u83DC\u5355\u5BBD\u5EA6\uFF09
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
          `
          }
        ]
      })
    ]
  );
  let rmsv = multipleScopeVars;
  const presetTheme = `theme-${getEnv("VITE_PRESET_THEME")}`;
  if (!isEnvTrue("VITE_ONLINE_THEME_ENABLED")) {
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
          }
        ],
        // 默认取 multipleScopeVars[0].scopeName
        defaultScopeName: presetTheme,
        // 在生产模式是否抽取独立的主题css文件，extract为true以下属性有效
        extract: false
      }
    })
  );
  plugins.push(src_default(viteCommonConfig_default.cli.files));
  return plugins;
}
function devPlugins(_mode) {
  const { historyPage } = viteCommonConfig_default.cli;
  const rewrites = historyPage.map((hp) => {
    return {
      from: new RegExp(`${hp}/.*`),
      to: `${getEnv("VITE_PUBLIC_PATH")}${hp}.html`
    };
  });
  return [
    viteCommonjs({
      include: viteCommonConfig_default.commonjs.include.map(
        (k) => k.replaceAll("**", "")
      ),
      exclude: ["core-js", "@itk-wasm/dicom", "itk-wasm", "itk"]
    }),
    // 查看vite各个插件对于每个文件是如何加载/处理,对于调试代码有一定的作用
    Inspect(),
    // 页面修改为history模式
    historyApiFallbackPlugin({
      rewrites
    })
  ];
}
async function prodPlugins(_mode) {
  const result = [];
  if (isEnvTrue("BUILD_REPORT")) {
    result.push(
      visualizer({
        filename: `${getEnv("OUTPUT_DIR")}/report.html`,
        gzipSize: true
      })
    );
  }
  result.push(
    StringReplace([
      {
        fileName: "jquery.js",
        search: "v2.2.1",
        replace: ""
      },
      {
        fileName: "vue-grid-layout.common.js",
        search: "new external_commonjs_vue_commonjs2_vue_root_Vue_default.a",
        replace: "new external_commonjs_vue_commonjs2_vue_root_Vue_default.a.default"
      }
    ])
  );
  if (isEnvTrue("BUILD_INJECT_MODERN_POLYFILLS")) {
    result.push(
      legacy({
        modernPolyfills: await import("file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/core-js-compat@3.33.0/node_modules/core-js-compat/index.js").then((d) => {
          return d.default(viteCommonConfig_default.build.polyfills).list;
        }),
        renderLegacyChunks: false
      })
    );
  }
  if (isEnvTrue("BUILD_LEGACY") && !isEnvTrue("BUILD_DEMAND_UI_IMPORT")) {
    if (isEnvTrue("BUILD_INJECT_MODERN_POLYFILLS")) {
      result.pop();
    }
    const modernPolyfills = await import("file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/core-js-compat@3.33.0/node_modules/core-js-compat/index.js").then((d) => {
      return d.default(viteCommonConfig_default.build.polyfills).list;
    });
    const targetsWithIE = {
      ie: "11"
    };
    const legacyPolyfills = await import("file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/core-js-compat@3.33.0/node_modules/core-js-compat/index.js").then((d) => {
      return d.default({
        targets: targetsWithIE
      }).list;
    });
    result.push(
      legacy({
        targets: ["defaults", "IE 11"],
        additionalLegacyPolyfills: ["regenerator-runtime/runtime"],
        modernPolyfills: isEnvTrue("BUILD_INJECT_MODERN_POLYFILLS") ? modernPolyfills : [],
        polyfills: legacyPolyfills
      })
    );
  }
  if (isEnvTrue("BUILD_INSPECT_REPORT")) {
    result.push(
      Inspect({
        build: true,
        outputDir: ".vite-inspect"
      })
    );
  }
  return result;
}
async function buildPlugins(mode, ignoreHtmlPlugin = false) {
  const plugins = [];
  plugins.push(...await basePlugins(mode, ignoreHtmlPlugin));
  if (mode === "development") {
    plugins.push(...devPlugins(mode));
  }
  if (mode === "production" || mode === "preview") {
    plugins.push(...await prodPlugins(mode));
    if (isEnvTrue("BUILD_INSPECT")) {
      plugins.push(
        Inspect({
          build: true,
          outputDir: ".vite-inspect"
        })
      );
    }
  }
  plugins.push(replace_name_default());
  return plugins;
}
var __vite_injected_original_dirname, fsp, PRIMARY_COLOR_REGEX, DEMAND_UI_IMPORT_BLACK_LIST, IGNORE_VUE_USE;
var init_plugin = __esm({
  "build-vite/src/plugin.ts"() {
    "use strict";
    init_viteCommonConfig();
    init_cli_components_override();
    init_utils();
    init_pages();
    init_replace_name();
    init_copyModulePublic();
    init_src();
    __vite_injected_original_dirname = "D:\\Desktop\\project\\yinhai\\vue\\test5\\demo\\build-vite\\src";
    fsp = fs.promises;
    PRIMARY_COLOR_REGEX = /@primary-color: (.*);/g;
    DEMAND_UI_IMPORT_BLACK_LIST = ["container-mask", "message", "modal", "notification"];
    IGNORE_VUE_USE = ["driver"];
  }
});

// build-vite/src/alias.ts
function buildAlias(mode) {
  const rAlias = {
    ...alias.base,
    ...alias[mode]
  };
  return Object.keys(rAlias).map((key) => {
    const v = rAlias[key];
    if (v.replacement) {
      return v;
    } else {
      return {
        find: key,
        replacement: v
      };
    }
  });
}
var alias;
var init_alias = __esm({
  "build-vite/src/alias.ts"() {
    "use strict";
    init_viteCommonConfig();
    ({ alias } = viteCommonConfig_default);
  }
});

// build-vite/src/env.ts
function defineEnv(_mode) {
  const pageTitles = {};
  Object.keys(title).forEach((k) => {
    pageTitles[`import.meta.env.VITE_HTML_TITLE_${k.toUpperCase()}`] = `"${title[k]}"`;
  });
  return {
    ...pageTitles,
    // i18n 配置
    "import.meta.env.VITE_I18N_LOCALE": `"${getEnv("VITE_DEFAULT_LOCALE") ? getEnv("VITE_DEFAULT_LOCALE") : "zh_CN"}"`,
    "import.meta.env.VITE_I18N_FALLBACK_LOCALE": `"${getEnv("VITE_DEFAULT_LOCALE") ? getEnv("VITE_DEFAULT_LOCALE") : "zh_CN"}"`,
    // 兼容ui的全局变量配置
    "process.env.VUE_APP_VXE_TABLE_ENV": `'${getEnv("NODE_ENV")}'`,
    "process.env.VUE_APP_PUBLIC_PATH": `"${getEnv("VITE_PUBLIC_PATH")}"`
  };
}
var title;
var init_env = __esm({
  "build-vite/src/env.ts"() {
    "use strict";
    init_viteCommonConfig();
    init_utils();
    ({ title } = viteCommonConfig_default.cli.html);
  }
});

// build-vite/vite.base.ts
import path3 from "path";
async function buildBaseConfig(mode, ignoreHtmlPlugin = false) {
  const cssConfig = await css();
  return {
    // 基础路径
    base: getEnv("VITE_PUBLIC_PATH"),
    envDir: path3.resolve(process.cwd(), "./.env"),
    // 打包所用到的插件
    plugins: await buildPlugins(mode, ignoreHtmlPlugin),
    resolve: {
      // 别名
      alias: buildAlias(mode)
    },
    optimizeDeps: {
      exclude: ["@itk-wasm/dicom"]
    },
    // 定义全局常量替换方式。其中每项在开发环境下会被定义在全局，而在构建时被静态替换
    define: defineEnv(mode),
    // css加载配置项
    css: cssConfig
  };
}
var init_vite_base = __esm({
  "build-vite/vite.base.ts"() {
    "use strict";
    init_css();
    init_utils();
    init_plugin();
    init_alias();
    init_env();
  }
});

// build-vite/src/proxy.ts
import http2 from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/vite-plugin-http2-proxy@0.4.1_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0_/node_modules/vite-plugin-http2-proxy/index.mjs";
import basicSsl from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/@vitejs+plugin-basic-ssl@1.1.0_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0_/node_modules/@vitejs/plugin-basic-ssl/dist/index.mjs";
function buildProxy() {
  const proxyName = `^${getEnv("VITE_BASE_PATH")}`;
  const proxyRegex = new RegExp(proxyName);
  console.log("proxyName==", proxyName);
  console.log("proxyRegex==", proxyRegex);
  return {
    // 这里通过此proxy可以进行以下的转换
    // http://localhost:5173[/ta404/]indexRestService/getCurUserAccount
    // =>  在转换时,需要将原本的上下文替换为'',
    // http://172.20.23.18:30001/ta404/indexRestService/getCurUserAccount
    ["^/ta404/api2/"]: {
      target: "http://admin.itsea.com.cn:56808/api/",
      changeOrigin: true,
      rewrite: (path5) => {
        console.log("path____\u4EE3\u7406api2", path5);
        return path5.replace(/^\/ta404\/api2\//, "");
      }
    },
    ["^/ta404/api/"]: {
      // target: 'http://183.247.165.2:2480/connector/api/',
      target: "http://192.168.1.24/connector/api/",
      changeOrigin: true,
      rewrite: (path5) => path5.replace(/^\/ta404\/api\//, "")
    },
    ["^/ta404/api5/"]: {
      target: "http://192.168.1.4:39600/",
      // target: 'http://192.168.1.142:39600/',//xwj
      changeOrigin: true,
      rewrite: (path5) => path5.replace(/^\/ta404\/api5\//, "")
    },
    ["^/ta404/api3/"]: {
      target: "https://demo.deepinsight.deepvessel.net/api/",
      changeOrigin: true,
      rewrite: (path5) => path5.replace(/^\/ta404\/api3\//, "")
    },
    ["^/ta404/api6/"]: {
      target: "http://192.168.1.4:39600/",
      // target: "http://192.168.1.142:39625/",//xwj
      changeOrigin: true,
      rewrite: (path6) => path6.replace(/^\/ta404\/api6\//, "")
    },
    ["^/api7/"]: {
      // target: "http://localhost:8080/",
      target: "http://192.168.1.4:39600/",
      //xwj
      changeOrigin: true,
      rewrite: (path6) => path6.replace(/^\/api7\//, "")
    },
    [proxyName]: {
      target: getEnv("RUN_ENV") === "mock" ? "http://localhost:36742/" : getEnv("VITE_BACKEND_PATH"),
      changeOrigin: true,
      rewrite: (path5) => {
        console.log("path___\u9ED8\u8BA4", path5);
        return path5.replace(proxyRegex, "");
      },
      secure: false
    }
    // 下面这个proxy配置与上面的配置效果完全一致
    // [proxyName]: getEnv('RUN_ENV') === 'mock' ? 'http://localhost:36742/' : (getEnv('VITE_BACKEND_PATH').replace('/ta404/', '')),
  };
}
function buildPreviewProxy() {
  return buildProxy();
}
function buildProxyForHTTP2(config) {
  delete config.server.proxy;
  config.plugins.push(http2(buildProxy()));
  config.plugins.push(basicSsl());
}
var init_proxy = __esm({
  "build-vite/src/proxy.ts"() {
    "use strict";
    init_utils();
  }
});

// build-vite/src/optimizeDeps.ts
async function optimizeEntriesBase() {
  const pages = await getAllPages();
  return Object.values(pages).map((k) => k.replace("/", ""));
}
async function optimizeLibs() {
  return (await optimizeEntriesBase()).filter((k) => k.indexOf("node_modules") >= 0).map((lib) => {
    const [_i, scope, name] = lib.split("/");
    return `${scope}/${name}`;
  });
}
async function optimizeEntries() {
  return (await optimizeEntriesBase()).filter((k) => k.indexOf("node_modules") < 0);
}
var init_optimizeDeps = __esm({
  "build-vite/src/optimizeDeps.ts"() {
    "use strict";
    init_pages();
  }
});

// build-vite/vite.optimize.ts
import fsp2 from "fs/promises";
import path4 from "path";
async function getLocales() {
  const d = await fsp2.readdir(path4.resolve("./internal/locales/dist"));
  return d.filter((s) => {
    return s.endsWith(".mjs");
  }).map((s_1) => {
    return `@yh/cli-internal-precompiled-locales/dist/${s_1}`;
  });
}
async function getOptimizeConfig(_mode) {
  const optimizeDeps = {
    // 主要用于在 vite 进行依赖性导入分析，它会重写需要预编译且为 commonJS 的依赖
    needsInterop: viteCommonConfig_default.optimizeDeps.needsInterop
  };
  const entries = [];
  if (!isEnvTrue("USE_OLD_MODULES_SUPPORT")) {
    entries.push("build-vite/optimize/optimize.ts");
  }
  entries.push("build-vite/optimize/optimize-modules.ts");
  if (!isEnvTrue("VITE_ONLINE_THEME_ENABLED")) {
    entries.push("build-vite/optimize/optimize-css.ts");
  } else {
    entries.push("build-vite/optimize/optimize-less.ts");
  }
  optimizeDeps.include = [
    ...await getLocales(),
    ...viteCommonConfig_default.optimizeDeps.include,
    ...await optimizeLibs()
  ];
  optimizeDeps.entries = [
    ...await optimizeEntries(),
    ...entries,
    ...viteCommonConfig_default.optimizeDeps.entries
  ];
  optimizeDeps.exclude = [...viteCommonConfig_default.optimizeDeps.exclude, "sw.js"];
  optimizeDeps.esbuildOptions = {
    sourcemap: true
    // 'inline'
  };
  optimizeDeps.holdUntilCrawlEnd = true;
  return optimizeDeps;
}
var init_vite_optimize = __esm({
  "build-vite/vite.optimize.ts"() {
    "use strict";
    init_utils();
    init_optimizeDeps();
    init_viteCommonConfig();
  }
});

// build-vite/vite.dev.ts
var vite_dev_exports = {};
__export(vite_dev_exports, {
  buildDevConfig: () => buildDevConfig,
  init: () => init
});
async function buildDevConfig(mode) {
  const config = await buildBaseConfig(mode);
  config.server = {
    // 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 将监听所有地址，包括局域网和公网地址。
    // true就是localhost+你本地所有网卡的ip
    host: false,
    // 为开发服务器配置自定义代理规则。
    proxy: buildProxy(),
    // 开发时浏览器默认打开的路径
    open: getOpen(),
    // 传递给 chokidar 的文件系统监听器选项。
    watch: {
      useFsEvents: false
      // 如果在启动时遇到反复重启dev-server的问题,则放开下面的注释
      // ignored: [
      //   '**/viteCommonConfig.ts',
      //   '**/multipleService.config.ts',
      //   '**/vite.config.ts',
      //   '**/.env.*',
      //   '**/build-vite/**/*.ts',
      //   '**/.idea/**',
      //   '**/.vscode/**'
      // ],
    }
  };
  config.optimizeDeps = await getOptimizeConfig(mode);
  if (isEnvTrue("USE_HTTP2")) {
    buildProxyForHTTP2(config);
  }
  const htmlEntry = await getAllPages();
  const warmupHtml = Object.keys(htmlEntry).map((k) => {
    const v = htmlEntry[k];
    if (v.constructor !== String) {
      return null;
    }
    return `.${v}`;
  }).filter((v) => v !== null);
  config.server.warmup = {
    clientFiles: [...warmupHtml]
  };
  return config;
}
function init() {
  error(
    [
      "888888  db          dP88   dPYb     dP88",
      "  88   dPYb        dP 88  dP   Yb  dP 88",
      "  88  dP__Yb      d888888 Yb   dP d888888",
      "  88 dP    Yb         88   YbodP      88"
    ].join("\n")
  );
  warn(
    [
      "",
      "                   _ooOoo_",
      "                  o8888888o",
      '                  88" . "88',
      "                  (| -_- |)",
      "                  O\\  =  /O",
      "               ____/`---'\\____",
      "             .'  \\\\|     |//  `.",
      "            /  \\\\|||  :  |||//  \\",
      "           /  _||||| \u534D |||||-  \\",
      "           |   | \\\\\\  -  /// |   |",
      "           | \\_|  ''\\---/''  |   |",
      "           \\  .-\\__  `-`  ___/-. /",
      "         ___`. .'  /--.--\\  `. . __",
      `      ."" '<  \`.___\\_<|>_/___.'  >'"".`,
      "     | | :  `- \\`.;`\\ _ /`;.`/ - ` : | |",
      "     \\  \\ `-.   \\_ __\\ /__ _/   .-` /  /",
      "======`-.____`-.___\\_____/___.-`____.-'======",
      "                   `=---='",
      "^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^",
      "         \u4F5B\u7956\u4FDD\u4F51       \u6C38\u65E0BUG"
    ].join("\n")
  );
}
var init_vite_dev = __esm({
  "build-vite/vite.dev.ts"() {
    "use strict";
    init_vite_base();
    init_proxy();
    init_utils();
    init_vite_optimize();
    init_pages();
  }
});

// build-vite/src/chunks.ts
function manualChunks(id) {
  if (id.includes("faceConfig")) {
    return "1.chunk-faceConfig";
  }
  if (id.includes("styleCover.less")) {
    return "2_chunk-styleCover";
  }
  if (useDemandImport) {
    if (id.includes("node_modules/vue")) {
      return "chunk-vuejs";
    }
    if (id.includes("node_modules/@yh/ta-utils")) {
      return "chunk-ta-utils";
    }
    if (id.includes("node_modules/@yh/ta404-ui")) {
      return "chunk-ta404-ui";
    }
  }
}
var useDemandImport;
var init_chunks = __esm({
  "build-vite/src/chunks.ts"() {
    "use strict";
    init_utils();
    useDemandImport = isEnvTrue("BUILD_DEMAND_UI_IMPORT");
  }
});

// build-vite/vite.prod.ts
var vite_prod_exports = {};
__export(vite_prod_exports, {
  buildProdConfig: () => buildProdConfig
});
async function buildProdConfig(mode, ignoreHtmlPlugin = false) {
  const config = await buildBaseConfig(mode, ignoreHtmlPlugin);
  config.build = {
    // sourcemap默认设置为false
    sourcemap: false,
    outDir: `${getEnv("OUTPUT_DIR")}${getEnv("VITE_PUBLIC_PATH")}`,
    emptyOutDir: true,
    // 是否压缩生成的代码
    minify: viteCommonConfig_default.build.minify,
    cssMinify: viteCommonConfig_default.build.cssMinify
  };
  if (viteCommonConfig_default.build.minify === "terser") {
    config.build.terserOptions = viteCommonConfig_default.build.terserOptions;
  }
  config.build.commonjsOptions = {
    transformMixedEsModules: true,
    // ignoreDynamicRequires: true,
    // dynamicRequireTargets: ['image-size'],
    exclude: ["node_modules/moment/**"],
    esmExternals: true,
    // 修改需要commonjs插件处理的文件
    include: viteCommonConfig_default.commonjs.include,
    extensions: viteCommonConfig_default.commonjs.extensions,
    requireReturnsDefault: "auto"
  };
  config.build.rollupOptions = {
    output: {
      manualChunks(id) {
        return manualChunks(id);
      }
    },
    treeshake: viteCommonConfig_default.build.treeshake
  };
  const useDemandImport2 = isEnvTrue("BUILD_DEMAND_UI_IMPORT");
  if (useDemandImport2) {
    config.build.target = ["chrome99"];
  }
  return config;
}
var init_vite_prod = __esm({
  "build-vite/vite.prod.ts"() {
    "use strict";
    init_vite_base();
    init_utils();
    init_chunks();
    init_viteCommonConfig();
  }
});

// build-vite/vite.preview.ts
var vite_preview_exports = {};
__export(vite_preview_exports, {
  buildPreviewConfig: () => buildPreviewConfig
});
async function buildPreviewConfig(mode, command) {
  let config = {};
  if (command === "build") {
    config = await buildProdConfig(mode);
  }
  if (command === "serve") {
    config.plugins = [
      // 这个注释的是用于路由的historyAPI回退代码
      // 例如: 某些路由在404的时候回退到index.html
      // historyApiFallbackPlugin({
      //   rewrites: [
      //     {
      //       from: /login.html/,
      //       to: getEnv('VITE_PUBLIC_PATH') + 'login.html',
      //     },
      //     {
      //       from: /.*/,
      //       to: getEnv('VITE_PUBLIC_PATH') + 'index.html',
      //     }
      //   ],
      //   usePreview: true,
      // })
    ];
    config.preview = {
      proxy: buildPreviewProxy(),
      open: false,
      // 预览模式下的端口
      port: 5174
    };
    config.server = {
      host: true
    };
  }
  return config;
}
var init_vite_preview = __esm({
  "build-vite/vite.preview.ts"() {
    "use strict";
    init_vite_prod();
    init_proxy();
  }
});

// build-vite/vite.mock.ts
var vite_mock_exports = {};
__export(vite_mock_exports, {
  buildMockConfig: () => buildMockConfig
});
async function buildMockConfig(mode) {
  return await buildBaseConfig(mode);
}
var init_vite_mock = __esm({
  "build-vite/vite.mock.ts"() {
    "use strict";
    init_vite_base();
  }
});

// vite.config.ts
import { defineConfig } from "file:///D:/Desktop/project/yinhai/vue/test5/demo/node_modules/.pnpm/vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite/dist/node/index.js";

// build-vite/buildVite.ts
init_utils();
async function buildViteConfig({
  mode,
  command,
  ignoreHtmlPlugin
}) {
  let config = {};
  await initEnv(mode);
  if (mode === "development") {
    config = await Promise.resolve().then(() => (init_vite_dev(), vite_dev_exports)).then(({ init: init2, buildDevConfig: buildDevConfig2 }) => {
      init2();
      return buildDevConfig2(mode);
    });
  } else if (mode === "preview") {
    config = await Promise.resolve().then(() => (init_vite_preview(), vite_preview_exports)).then(({ buildPreviewConfig: buildPreviewConfig2 }) => {
      return buildPreviewConfig2(mode, command);
    });
  } else if (mode === "production") {
    config = await Promise.resolve().then(() => (init_vite_prod(), vite_prod_exports)).then(({ buildProdConfig: buildProdConfig2 }) => {
      return buildProdConfig2(mode, ignoreHtmlPlugin);
    });
  } else if (mode === "mock") {
    config = await Promise.resolve().then(() => (init_vite_mock(), vite_mock_exports)).then(({ buildMockConfig: buildMockConfig2 }) => {
      return buildMockConfig2(mode);
    });
  } else {
    throw new Error("\u6CA1\u6709\u6307\u5B9A\u4E00\u4E2A\u53EF\u7528\u7684mode,\u8BF7\u5C1D\u8BD5\u901A\u8FC7--mode=***\u6765\u6307\u5B9A");
  }
  return config;
}

// vite.config.ts
var vite_config_default = defineConfig(async (env) => {
  return buildViteConfig(env);
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZUNvbW1vbkNvbmZpZy50cyIsICJidWlsZC12aXRlL3NyYy91dGlscy50cyIsICJidWlsZC12aXRlL3NyYy9jc3MudHMiLCAiYnVpbGQtdml0ZS9zcmMvdW5wbHVnaW4tcmVzb2x2ZXIvY2xpLWNvbXBvbmVudHMub3ZlcnJpZGUudHMiLCAibXVsdGlwbGVTZXJ2aWNlLmNvbmZpZy50cyIsICJidWlsZC12aXRlL21wYS9wYWdlcy50cyIsICJidWlsZC12aXRlL3NyYy9yZXBsYWNlLW5hbWUvaW5kZXgudHMiLCAiYnVpbGQtdml0ZS9zcmMvY29weU1vZHVsZVB1YmxpYy50cyIsICJpbnRlcm5hbC9yZXBsYWNlLWZpbGVzL3NyYy9pbmRleC50cyIsICJidWlsZC12aXRlL3NyYy9wbHVnaW4udHMiLCAiYnVpbGQtdml0ZS9zcmMvYWxpYXMudHMiLCAiYnVpbGQtdml0ZS9zcmMvZW52LnRzIiwgImJ1aWxkLXZpdGUvdml0ZS5iYXNlLnRzIiwgImJ1aWxkLXZpdGUvc3JjL3Byb3h5LnRzIiwgImJ1aWxkLXZpdGUvc3JjL29wdGltaXplRGVwcy50cyIsICJidWlsZC12aXRlL3ZpdGUub3B0aW1pemUudHMiLCAiYnVpbGQtdml0ZS92aXRlLmRldi50cyIsICJidWlsZC12aXRlL3NyYy9jaHVua3MudHMiLCAiYnVpbGQtdml0ZS92aXRlLnByb2QudHMiLCAiYnVpbGQtdml0ZS92aXRlLnByZXZpZXcudHMiLCAiYnVpbGQtdml0ZS92aXRlLm1vY2sudHMiLCAidml0ZS5jb25maWcudHMiLCAiYnVpbGQtdml0ZS9idWlsZFZpdGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXHZpdGVDb21tb25Db25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0Rlc2t0b3AvcHJvamVjdC95aW5oYWkvdnVlL3Rlc3Q1L2RlbW8vdml0ZUNvbW1vbkNvbmZpZy50c1wiO2ltcG9ydCB7ZmlsZVVSTFRvUGF0aCwgVVJMfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQgdHlwZSB7QnVpbGRPcHRpb25zfSBmcm9tICd2aXRlJztcblxudHlwZSByb2xsdXBPcHRpb25zID0gTm9uTnVsbGFibGU8QnVpbGRPcHRpb25zWydyb2xsdXBPcHRpb25zJ10+O1xudHlwZSBjb21tb25qc09wdGlvbnMgPSBQaWNrPE5vbk51bGxhYmxlPEJ1aWxkT3B0aW9uc1snY29tbW9uanNPcHRpb25zJ10+LCAnaW5jbHVkZScgfCAnZXh0ZW5zaW9ucyc+O1xuZXhwb3J0IGludGVyZmFjZSBWaXRlQ29tbW9uQ29uZmlnIHtcbiAgYWxpYXM6IHtcbiAgICBiYXNlOiBSZWNvcmQ8c3RyaW5nLCBBbGlhcz47XG4gICAgZGV2ZWxvcG1lbnQ6IFJlY29yZDxzdHJpbmcsIEFsaWFzPjtcbiAgICBwcm9kdWN0aW9uOiBSZWNvcmQ8c3RyaW5nLCBBbGlhcz47XG4gIH07XG4gIGNvcHlSZXNvdXJjZXM6IEFycmF5PHtmcm9tOiBzdHJpbmc7IHRvOiBzdHJpbmd9PjtcbiAgb3Blbjogc3RyaW5nIHwgZmFsc2U7XG4gIGluY2x1ZGVTdHlsZXM6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+O1xuICBjb21tb25qczogY29tbW9uanNPcHRpb25zO1xuICBidWlsZDoge1xuICAgIHRyZWVzaGFrZTogcm9sbHVwT3B0aW9uc1sndHJlZXNoYWtlJ107XG4gICAgbWluaWZ5OiBCdWlsZE9wdGlvbnNbJ21pbmlmeSddO1xuICAgIHRlcnNlck9wdGlvbnM6IEJ1aWxkT3B0aW9uc1sndGVyc2VyT3B0aW9ucyddO1xuICAgIGNzc01pbmlmeTogQnVpbGRPcHRpb25zWydjc3NNaW5pZnknXTtcbiAgICBwb2x5ZmlsbHM6IHt0YXJnZXRzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fTtcbiAgfTtcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogQXJyYXk8c3RyaW5nPjtcbiAgICBlbnRyaWVzOiBBcnJheTxzdHJpbmc+O1xuICAgIG5lZWRzSW50ZXJvcDogQXJyYXk8c3RyaW5nPjtcbiAgICBleGNsdWRlOiBBcnJheTxzdHJpbmc+O1xuICB9O1xuICBodG1sOiBBcnJheTxzdHJpbmcgfCB7cGF0aDogc3RyaW5nOyBlbnRyeTogc3RyaW5nfT47XG4gIGNsaToge1xuICAgIG1vZHVsZXM6IEFycmF5PHN0cmluZz47XG4gICAgb3ZlcnJpZGU6IE92ZXJyaWRlO1xuICAgIGhpc3RvcnlQYWdlOiBBcnJheTxzdHJpbmc+O1xuICAgIGh0bWw6IHtcbiAgICAgIHRpdGxlOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIH07XG4gICAgZmlsZXM6IEFycmF5PHtmaWxlOiBzdHJpbmc7IG5ld0ZpbGU6IHN0cmluZ30+O1xuICB9O1xuICBtcGE6IEFycmF5PHN0cmluZz4gfCB0cnVlO1xufVxuZXhwb3J0IGRlY2xhcmUgdHlwZSBBbGlhcyA9IHN0cmluZyB8IHtmaW5kOiBSZWdFeHAgfCBzdHJpbmc7IHJlcGxhY2VtZW50OiBzdHJpbmd9O1xuXG5leHBvcnQgaW50ZXJmYWNlIE92ZXJyaWRlIHtcbiAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgT3ZlcnJpZGU7XG59XG5cbmNvbnN0IF9kZWZhdWx0OiBWaXRlQ29tbW9uQ29uZmlnID0ge1xuICBhbGlhczoge1xuICAgIGJhc2U6IHtcbiAgICAgIC8vIFx1Njg0Nlx1NjdCNlx1NTdGQVx1Nzg0MFx1NzY4NGFsaWFzXG4gICAgICAvLyBcdThGRDlcdTkxQ0NcdTRGN0ZcdTc1MjhcdTY1QjlcdTZDRDVcdTZCRDRcdThGODNcdTU5MERcdTY3NDIsXHU4RkQ5XHU2NjJGXHU0RTNBXHU0RTg2XHU1NzI4V2Vic3Rvcm0oXHU5NzAwXHU4OTgxMjAyMi4zKVx1NEUyRFx1NTNFRlx1NEVFNVx1OTAxQVx1OEZDN1x1OUYyMFx1NjgwN1x1NzBCOVx1NTFGQmltcG9ydFx1OEJFRFx1NTNFNVx1NEUyRFx1NzY4NGFsaWFzXHU3NkY0XHU2M0E1XHU4RkRCXHU1MTY1XHU3NkY4XHU1RTk0XHU3Njg0XHU2NTg3XHU0RUY2XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICdAY29tbW9uJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL2NsaS9jb21tb24vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAvLyAnQGNvbW1vbic6ICdAeWgvY2xpLWludGVybmFsLWNvbW1vbi9zcmMnLFxuICAgICAgJ0Bwcm9qZWN0Q29tbW9uJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL2NsaS9wcm9qZWN0Q29tbW9uL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgZmFjZUNvbmZpZzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL2ZhY2VDb25maWcnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgIC8vIFx1NUMwNlx1N0IyQ1x1NEUwOVx1NjVCOVx1NkEyMVx1NTc1N1x1NjMwN1x1NTQxMVx1NTE3Nlx1NUJGOVx1NUU5NFx1NzY4NEVTXHU2QTIxXHU1NzU3XHU2NTg3XHU0RUY2XG4gICAgICBtb21lbnQ6IHtmaW5kOiAvXm1vbWVudCQvLCByZXBsYWNlbWVudDogJ21vbWVudC9zcmMvbW9tZW50J30sXG4gICAgICBsZXNzOiB7ZmluZDogL15sZXNzJC8sIHJlcGxhY2VtZW50OiAnbGVzcy9saWIvbGVzcy1icm93c2VyL2luZGV4J30sXG4gICAgICB2dWU6IHtmaW5kOiAvXnZ1ZSQvLCByZXBsYWNlbWVudDogJ3Z1ZS9kaXN0L3Z1ZS5lc20uanMnfSxcbiAgICAgIHZ1ZXg6IHtmaW5kOiAvXnZ1ZXgkLywgcmVwbGFjZW1lbnQ6ICd2dWV4L2Rpc3QvdnVleC5lc20uanMnfSxcbiAgICAgICd2dWUtcm91dGVyJzoge2ZpbmQ6IC9ednVlLXJvdXRlciQvLCByZXBsYWNlbWVudDogJ3Z1ZS1yb3V0ZXIvZGlzdC92dWUtcm91dGVyLmVzbS5qcyd9LFxuICAgICAgLy8gXHU1RjAzXHU3NTI4OiBjb21tb24gXHU1MjJCXHU1NDBEXHU1REYyXHU1RjAzXHU3NTI4LFx1OEJGN1x1NEY3Rlx1NzUyOEBjb21tb25cdTUyMkJcdTU0MEQsXHU3NTU5XHU1NzI4XHU4RkQ5XHU5MUNDXHU1M0VBXHU2NjJGXHU0RTNBXHU0RTg2XHU1MTdDXHU1QkI5LFx1NTQwRVx1NjcxRlx1NEYxQVx1NzlGQlx1OTY2NFxuICAgICAgY29tbW9uOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vY2xpL2NvbW1vbi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICB9LFxuICAgIGRldmVsb3BtZW50OiB7fSxcbiAgICBwcm9kdWN0aW9uOiB7XG4gICAgICAvLyBcdTU3MjhcdTc1MUZcdTRFQTdcdTY1RjZcdTY3MUZcdTVDMDZAeWgvdGEtdXRpbHNcdTYzMDdcdTU0MTF1dGlscy5lc20udHNcbiAgICAgIC8vIFx1OEZEOVx1NEUyQVx1NjU4N1x1NEVGNlx1NTNFQVx1NTMwNVx1NTQyQkVTTVx1NEUwQlx1NzY4NGltcG9ydC9leHBvcnQoXHU1MTc3XHU1NDBEZXhwb3J0KVxuICAgICAgLy8gXHU1M0VGXHU0RUU1XHU1NzI4XHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU0RTBCXHU0RjdGXHU3NTI4dHJlZS1zaGFraW5nXHU1QzA2XHU2NzJBXHU0RjdGXHU3NTI4XHU3Njg0XHU1REU1XHU1MTc3XHU0RUUzXHU3ODAxXHU3OUZCXHU5NjY0XG4gICAgICAvLyAnQHloL3RhLXV0aWxzJzoge1xuICAgICAgLy8gICBmaW5kOiAvXkB5aFxcL3RhLXV0aWxzJC8sXG4gICAgICAvLyAgIHJlcGxhY2VtZW50OiAnQHloL2NsaS1pbnRlcm5hbC1jb21tb24vc3JjL3V0aWxzLmVzbS50cycsXG4gICAgICAvLyB9LFxuICAgIH0sXG4gIH0sXG4gIC8vIFx1N0IyQ1x1NEUwOVx1NjVCOVx1OEQ0NFx1NkU5MFx1NTkwRFx1NTIzNlx1NTIzMFx1NzUxRlx1NjIxMFx1NzY4NGRpc3RcdTRFMkRcbiAgY29weVJlc291cmNlczogW1xuICAgIHtcbiAgICAgIGZyb206ICdub2RlX21vZHVsZXMvQHloL3RhNDA0LXVpL3N0YXRpYy8qJywgLy8gXHU2NzY1XHU2RTkwXHU4REVGXHU1Rjg0LFx1NzZGOFx1NUJGOVx1NEU4RVx1OTg3OVx1NzZFRVx1NjgzOVx1OERFRlx1NUY4NFx1NzY4NFx1NzZGOFx1NUJGOVx1OERFRlx1NUY4NFxuICAgICAgdG86ICdzdGF0aWMnLCAvLyBkaXN0XHU3NkVFXHU1RjU1XHU0RTBCXHU3Njg0XHU4REVGXHU1Rjg0XG4gICAgfSxcbiAgXSxcbiAgLy8gZGV2L3ByZXZpZXdcdTY3MDlcdTY1NDgsIFx1NzUyOFx1NEU4RVx1NTcyOGRldi9wcmV2aWV3XHU2NUY2XHU4MUVBXHU1MkE4XHU2MjUzXHU1RjAwXHU2NTg3XHU0RUY2XG4gIC8vIFx1OEJCRVx1N0Y2RVx1NjIxMGZhbHNlXHU1M0VGXHU3OTgxXHU3NTI4XG4gIG9wZW46IGZhbHNlLFxuICAvLyBcdTU3MjhcdThGRDlcdTkxQ0NcdTg5ODZcdTc2RDZcdTc1MzFcdTRFOEVcdTRFM0JcdTk4OThcdTYzNjJcdTgwQTRcdTVCRkNcdTgxRjRcdTc2ODRcdTY4MzdcdTVGMEZcdTg5ODZcdTc2RDZcbiAgaW5jbHVkZVN0eWxlczoge1xuICAgICcuYW50LWZ1bGxjYWxlbmRhci1mdWxsc2NyZWVuIC5hbnQtZnVsbGNhbGVuZGFyLXNlbGVjdGVkLWRheSAuYW50LWZ1bGxjYWxlbmRhci12YWx1ZSc6IHtcbiAgICAgIGNvbG9yOiAnI0ZGRkZGRicsXG4gICAgfSxcbiAgICAnLmFudC1idG4tcHJpbWFyeTpob3ZlciwgLmFudC1idG4tcHJpbWFyeTpmb2N1cyc6IHtcbiAgICAgIGNvbG9yOiAnI0ZGRkZGRicsXG4gICAgfSxcbiAgICAnLnRhLXRhZy1zZWxlY3QgLnRhZy1zZWxlY3QtYnRuOmhvdmVyJzoge1xuICAgICAgY29sb3I6ICcjMUI2NUI5JyxcbiAgICB9LFxuICAgIC8vIGJ1dHRvbiBcdTc2ODQgbGluayBcdTVDNUVcdTYwMjdcdTRGMUFcdTg4QUJcdTRFM0JcdTk4OThcdTYzNjJcdTgwQTRcdTg5ODZcdTc2RDZcbiAgICAnLmFudC1idG4tbGluazpob3ZlciwgLmFudC1idG4tbGluazpmb2N1cyc6IHtcbiAgICAgICdib3JkZXItY29sb3InOiAndHJhbnNwYXJlbnQnLFxuICAgIH0sXG4gICAgLy8gXHU3RUNGXHU1MjlFXHU2NzQzXHU5NjUwXHU3QkExXHU3NDA2Plx1NjVCMFx1NTg5RVx1ODlEMlx1ODI3Mlx1NzY4NCBzdGVwIFx1NjgzN1x1NUYwRlx1ODhBQlx1NEUzQlx1OTg5OFx1NjM2Mlx1ODBBNFx1ODk4Nlx1NzZENlxuICAgICcuYW50LXN0ZXBzLWl0ZW0tcHJvY2VzcyAuYW50LXN0ZXBzLWl0ZW0taWNvbiA+IC5hbnQtc3RlcHMtaWNvbic6IHtcbiAgICAgIGNvbG9yOiAnI0ZGRicsXG4gICAgfSxcbiAgfSxcbiAgLy8gXHU3RUQ5IGRldiBcdTU0OEMgcHJvZCBcdTczQUZcdTU4ODNcdTRGN0ZcdTc1MjhcdTc2ODQgY29tbW9uanMgXHU5MTREXHU3RjZFXG4gIGNvbW1vbmpzOiB7XG4gICAgLy8gXHU1NDBDXHU2NUY2XHU3RUQ5IGRldiBcdTU0OEMgcHJvZCBcdTczQUZcdTU4ODNcdTRGN0ZcdTc1MjhcdTc2ODQgY29tbW9uanMuaW5jbHVkZSBcdTkxNERcdTdGNkVcbiAgICAvLyBcdTZDRThcdTYxMEY6IFx1OEZEOVx1OTFDQ1x1NjYyRlx1NEVFNVx1NEUwMFx1NEUyQVx1NzZFRVx1NUY1NVx1NEUzQVx1NTdGQVx1NjcyQ1x1NTM1NVx1NEY0RCxcdTRFMTRcdTVGQzVcdTk4N0JcdTY2MkZcdThGRDlcdTY4MzdcdTc2ODRcdTUxOTlcdTZDRDVcbiAgICAvLyBcdTU3MjggZGV2IFx1NjVGNlx1NjcxRixcdThGRDlcdTRFMkFcdTkxNERcdTdGNkVcdTRGMUFcdTg4QUJcdTc5RkJcdTk2NjRcdTU5MzRcdTVDM0VcdTc2ODQqKlxuICAgIC8vIFx1NTcyOCBwcm9kIFx1NjVGNlx1NjcxRixcdThGRDlcdTRFMkFcdTkxNERcdTdGNkVcdTRGMUFcdTUzOUZcdTVDMDFcdTRFMERcdTUyQThcdTc2ODRcdTRGMjBcdTkwMTJcdTdFRDkgYnVpbGQuY29tbW9uanNPcHRpb25zLmluY2x1ZGVcbiAgICBpbmNsdWRlOiBbJyoqL25vZGVfbW9kdWxlcy8qKicsICcqKi9jbGkvKionLCAnKiovaW50ZXJuYWwvKionLCAnKiovcGFnZXMvKionLCAnKiovc3JjLyoqJ10sXG4gICAgLy8gXHU0RUM1XHU3NTI4XHU0RThFIHByb2QgXHU2NUY2XHU2NzFGXHU3Njg0XHU5MTREXHU3RjZFLFx1NzUyOFx1NEU4RVx1NjMwN1x1NUI5QVx1NTRFQVx1NEU5Qlx1NjU4N1x1NEVGNlx1NEYxQVx1ODhBQiBjb21tb25qcyBcdTYzRDJcdTRFRjZcdTU5MDRcdTc0MDZcbiAgICBleHRlbnNpb25zOiBbJy5qcycsICdjanMnLCAnLnZ1ZScsICcuanN4JywgJy50cycsICcuY3RzJywgJy50c3gnXSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBtYXhNZW1vcnk6IDgxOTIsIC8vIDhHQlxuICAgIC8vIFx1NjYyRlx1NTQyNlx1NUJGOVx1NzUxRlx1NjIxMFx1NzY4NFx1NEVFM1x1NzgwMVx1OEZEQlx1ODg0Q3RyZWUtc2hha2luZ1x1NEYxOFx1NTMxNlxuICAgIC8vIFx1OEJCRVx1N0Y2RVx1OEZEOVx1NEUyQVx1NTAzQ1x1NEUzQWZhbHNlLFx1NTNFRlx1ODBGRFx1NTNFRlx1NEVFNVx1ODlFM1x1NTFCM1x1NEUwMFx1OTBFOFx1NTIwNlx1NzUzMVx1NEU4RXRyZWUtc2hha2luZ1x1NUJGQ1x1ODFGNFx1NzY4NFx1NEVFM1x1NzgwMVx1NEUyMlx1NTkzMVx1N0I0OVx1OTVFRVx1OTg5OFxuICAgIC8vIFx1OEJCRVx1N0Y2RVx1NEUzQXRydWUsIFx1NTNFRlx1ODBGRFx1NTNFRlx1NEVFNVx1NjNEMFx1NTM0N1x1OTg3NVx1OTc2Mlx1NjAyN1x1ODBGRChcdTkwMUFcdThGQzdcdTc5RkJcdTk2NjRcdTZDQTFcdTY3MDlcdTRGN0ZcdTc1MjhcdTc2ODRcdTRFRTNcdTc4MDFcdTdCNDlcdTY0Q0RcdTRGNUMpXG4gICAgdHJlZXNoYWtlOiB0cnVlLFxuICAgIC8vIFx1NjYyRlx1NTQyNlx1NEY3Rlx1NzUyOFx1NEVFM1x1NzgwMVx1NTM4Qlx1N0YyOSxcdTUzRUZcdTkwMDlcdTUwM0M6IGZhbHNlLyd0ZXJzZXInLydlc2J1aWxkJ1xuICAgIC8vIGZhbHNlOiBcdTc5ODFcdTc1MjhcdTRFRTNcdTc4MDFcdTUzOEJcdTdGMjlcbiAgICAvLyAndGVyc2VyJy8nZXNidWlsZCc6IFx1NEY3Rlx1NzUyOFx1NUJGOVx1NUU5NFx1NzY4NFx1NURFNVx1NTE3N1x1OEZEQlx1ODg0Q1x1NEVFM1x1NzgwMVx1NTM4Qlx1N0YyOVxuICAgIG1pbmlmeTogZmFsc2UsXG4gICAgLy8gXHU0RjdGXHU3NTI4dGVyc2VyXHU2NUY2LFx1NEYyMFx1OTAxMlx1N0VEOXRlcnNlclx1NzY4NFx1NEZFMVx1NjA2RlxuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIC8vIFx1NTE3N1x1NEY1M1x1NzY4NFx1OTE0RFx1N0Y2RVx1NTNFRlx1NTNDMlx1ODAwMzogaHR0cHM6Ly90ZXJzZXIub3JnL2RvY3MvYXBpLXJlZmVyZW5jZSNtaW5pZnktb3B0aW9uc1xuICAgIH0sXG4gICAgLy8gXHU2NjJGXHU1NDI2XHU1MzhCXHU3RjI5Y3NzXHU0RUUzXHU3ODAxLFx1NTNFRlx1OTAwOVx1NTAzQzogZmFsc2UvJ2xpZ2h0bmluZ2NzcycvJ2VzYnVpbGQnXG4gICAgLy8gZmFsc2U6IFx1Nzk4MVx1NzUyOFx1NEVFM1x1NzgwMVx1NTM4Qlx1N0YyOVxuICAgIC8vICdsaWdodG5pbmdjc3MnLydlc2J1aWxkJzogXHU0RjdGXHU3NTI4XHU1QkY5XHU1RTk0XHU3Njg0XHU1REU1XHU1MTc3XHU4RkRCXHU4ODRDXHU0RUUzXHU3ODAxXHU1MzhCXHU3RjI5XG4gICAgLy8gRklYTUU6IFx1NzZFRVx1NTI0RCdsaWdodG5pbmdjc3MnXHU0RTBEXHU1M0VGXHU3NTI4LFx1NEYxQVx1NjJBNVx1OTUxOVxuICAgIGNzc01pbmlmeTogJ2VzYnVpbGQnLFxuICAgIC8vIFx1NjMwOVx1OTcwMFx1NTJBMFx1OEY3RHBvbHlmaWxscywgXHU2QjY0XHU1OTA0XHU4QkJFXHU3RjZFXHU3Njg0XHU2NjJGXHU2RDRGXHU4OUM4XHU1NjY4XHU3Njg0XHU2NzAwXHU0RjRFXHU3MjQ4XHU2NzJDXG4gICAgLy8gXHU1M0VBXHU5NzAwXHU4OTgxXHU5MTREXHU3RjZFXHU3M0IwXHU0RUUzXHU2RDRGXHU4OUM4XHU1NjY4XHU3Njg0XHU2NzAwXHU0RjRFXHU3MjQ4XHU2NzJDXG4gICAgLy8gSUVcdTUxN0NcdTVCQjlcdTkwMUFcdThGQzdCVUlMRF9MRUdBQ1lcdTUzRDhcdTkxQ0ZcdTgxRUFcdTUyQThcdTZDRThcdTUxNjVpZTogJzExJ1x1OTE0RFx1N0Y2RSxcdTRFMTRcdTRFQzVcdTUxN0NcdTVCQjlJRTExXG4gICAgLy8gXHU2Q0U4XHU2MTBGOiBcdTUxN0NcdTVCQjlcdTkxNERcdTdGNkVcdTRFQzVcdTY1MkZcdTYzMDFcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODMsXHU1RjAwXHU1M0QxXHU2NUY2XHU0RTBEXHU4RkRCXHU4ODRDXHU2NTJGXHU2MzAxXG4gICAgcG9seWZpbGxzOiB7XG4gICAgICB0YXJnZXRzOiB7XG4gICAgICAgIGNocm9tZTogJzY0JyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgLy8gXHU0RTBEXHU2NUI5XHU0RkJGXHU2MjE2XHU0RTBEXHU4MEZEXHU3NkY0XHU2M0E1XHU1MTk5XHU1MjMwL2J1aWxkLXZpdGUvb3B0aW1pemUvb3B0aW1pemUudHNcdTY1ODdcdTRFRjZcdTRFMkRcdTc2ODRcdTRGOURcdThENTZcbiAgICAgIC8vIFx1NEY4Qlx1NTk4Mlx1NjdEMFx1NEUyQVx1NEY5RFx1OEQ1Nlx1NzZGNFx1NjNBNVx1NEY5RFx1OEQ1Nlx1NzY4NFx1NjdEMFx1NEUyQVx1NEY5RFx1OEQ1Nlx1OTcwMFx1ODk4MVx1NjNEMFx1NTI0RFx1NEYxOFx1NTMxNixcdTRGNDZcdThGRDlcdTRFMkFcdTRGOURcdThENTZcdTRFMERcdTY2MkZcdTY4NDZcdTY3QjZcdTY3MkNcdThFQUJcdTc2ODRcdTRGOURcdThENTZcbiAgICAgICdAeWgvY2xpLXBhZ2VzLWluZGV4ID4gQHdjamlhbmcvbm90aWZ5JyxcbiAgICAgICdAeWgvY2xpLXBhZ2VzLW9yZ3VzZXIgPiB2dWUtY29va2llcycsXG4gICAgXSxcbiAgICBlbnRyaWVzOiBbXG4gICAgICAvLyBcdTlFRDhcdThCQTRcdTYwQzVcdTUxQjVcdTRFMEIsXHU0RjFBXHU4QkZCXHU1M0Q2aHRtbFx1OTE0RFx1N0Y2RSxcdTVFNzZcdTVDMDZcdTYyNDBcdTY3MDlodG1sXHU2NTg3XHU0RUY2XHU2NTNFXHU1MjMwXHU2QjY0XHU5MTREXHU3RjZFXHU0RTJELFxuICAgICAgLy8gXHU2QjY0XHU1OTA0XHU1M0VGXHU0RUU1XHU2REZCXHU1MkEwXHU2Q0ExXHU2NzA5XHU5MTREXHU3RjZFXHU1MjMwaHRtbFx1NEUyRFx1NzY4NFx1NEY0Nlx1NjYyRlx1OTcwMFx1ODk4MVx1OEJCRlx1OTVFRVx1NzY4NGh0bWxcdTY1ODdcdTRFRjZcbiAgICAgIC8vIFx1NEUwMFx1ODIyQ1x1Njc2NVx1OEJGNCxcdTRGNjBcdTRFMERcdTk3MDBcdTg5ODFcdTVCRjlcdThGRDlcdTRFMkFcdTY1NzBcdTdFQzRcdThGREJcdTg4NENcdTRGRUVcdTY1MzlcbiAgICBdLFxuICAgIG5lZWRzSW50ZXJvcDogW1xuICAgICAgLy8gXHU1RjUzXHU0RjYwXHU3Njg0XHU2M0E3XHU1MjM2XHU1M0YwXHU4RjkzXHU1MUZBXHU3QzdCXHU0RjNDXHU2QjY0XHU0RkUxXHU2MDZGXHU2NUY2XHU1M0VGXHU1QzA2XHU0RjlEXHU4RDU2KFx1NjU4N1x1NEVGNilcdTZERkJcdTUyQTBcdTUyMzBcdThGRDlcdTkxQ0NcbiAgICAgIC8vIE1peGVkIEVTTSBhbmQgQ0pTIGRldGVjdGVkIGluIEB5aC90YS11dGlscy9jcm9zc0RvbWFpbiwgYWRkIGl0IHRvIG9wdGltaXplRGVwcy5uZWVkc0ludGVyb3AgdG8gc3BlZWQgdXAgY29sZCBzdGFydFxuICAgICAgLy8gXHU1QjgzXHU0RjFBXHU5ODg0XHU3RjE2XHU4QkQxXHU0RjlEXHU4RDU2XG4gICAgICAnQHloL3RhLXV0aWxzL2Nyb3NzRG9tYWluJyxcbiAgICBdLFxuICAgIGV4Y2x1ZGU6IFtcbiAgICAgIC8vIFx1NTcyOFx1NEYxOFx1NTMxNlx1NjVGNixcdTk3MDBcdTg5ODFcdTYzOTJcdTk2NjRcdTc2ODRcdTRFMDBcdTRFOUJcdTRFMERcdTk3MDBcdTg5ODFcdTRGMThcdTUzMTZcdTc2ODRcdTRGOURcdThENTZcdTYyMTZcdTg2NUFcdTYyREZcdTZBMjFcdTU3NTcsXHU0RUU1XHU5MDdGXHU1MTREXHU0RjE4XHU1MzE2XHU2NzFGXHU5NUY0XHU2MkE1XHU5NTE5XG4gICAgICAndmlydHVhbDpkeW5hbWljVGhlbWUnLFxuICAgICAgJ3ZpcnR1YWw6dGhlbWVEZWZpbml0aW9ucycsXG4gICAgICAndmlydHVhbDpkeW5hbWljSTE4bicsXG4gICAgICAndmlydHVhbDpoaXN0b3J5UGFnZScsXG4gICAgICAndmlydHVhbDpkYXJrTW9kZScsXG4gICAgICAndmlydHVhbDplbGRlcmx5JyxcbiAgICAgICdAaXRrLXdhc20vZGljb20nLFxuICAgICAgJ2l0ay13YXNtJyxcbiAgICAgICdpdGsnLFxuICAgICAgLy8gJ0BraXR3YXJlL3Z0ay5qcycsXG4gICAgICAnY29ybmVyc3RvbmUnLFxuICAgICAgJ2Nvcm5lcnN0b25lLWNvcmUnLFxuICAgICAgJ2Nvcm5lcnN0b25lLXdhZG8taW1hZ2UtbG9hZGVyJyxcbiAgICAgICdAY29ybmVyc3RvbmVqcy9kaWNvbS1pbWFnZS1sb2FkZXInXG4gICAgXSxcbiAgfSxcbiAgaHRtbDogW1xuICAgICchL25vZGVfbW9kdWxlcy9AeWgvY2xpLXBhZ2VzLWxvZ2luL3NyYy9sb2dpbi5odG1sJyxcbiAgICAnL3NyYy9vdmVycmlkZS9sb2dpbi1vdmVycmlkZS1kZW1vL2xvZ2luLmh0bWwnLFxuICAgIC8vIFx1OTE0RFx1N0Y2RVx1OTcwMFx1ODk4MVx1OEZEQlx1ODg0Q1x1NTJBMFx1OEY3RFx1NzY4NGh0bWxcbiAgICAvLyBcdTVGQzVcdTk4N0JcdTRFRTUvXHU2MjE2IVx1NUYwMFx1NTkzNFxuICAgIC8vIFx1NTNFRlx1NEVFNVx1NzZGNFx1NjNBNVx1NjMwN1x1NUI5QVx1NEUwMFx1NEUyQWh0bWxcdTY1ODdcdTRFRjZcdTc2ODRcdTVCOENcdTY1NzRcdThERUZcdTVGODRcbiAgICAvLyBcdTRGOEJcdTU5ODI6XG4gICAgLy8gJy9zcmMvc2NvcGVzL2NvcmUvb3JnTW9kdWxlcy9vcmd1c2VyL29yZ3VzZXIuaHRtbCdcbiAgICAvLyBcdTYzQThcdTgzNTBcdTRFRTVcdThGRDlcdTc5Q0RcdTY1QjlcdTVGMEZcdThGREJcdTg4NENcdTkxNERcdTdGNkVcbiAgICAvLyBcdTU3MjhcdTY3RDBcdTRFMkFcdTc2RUVcdTVGNTVcdTRFMEJodG1sXHU2NTg3XHU0RUY2XHU4RkM3XHU1OTFBXHU2NUY2LFx1NEU1Rlx1NTNFRlx1NEVFNVx1NjNEMFx1NEY5Qlx1NEUwMFx1NEUyQWdsb2JcdTY3NjVcdThGREJcdTg4NENcdTkxNERcdTdGNkVcbiAgICAvLyBcdTUxNzZcdTRFMkQ6ICoqXHU4ODY4XHU3OTNBXHU0RTAwXHU1QzQyXHU2MjE2XHU1OTFBXHU1QzQyXHU0RTJEXHU5NUY0XHU3NkVFXHU1RjU1LCpcdTg4NjhcdTc5M0FcdTRFRkJcdTYxMEZcdTY1ODdcdTRFRjZcdTU0MERcbiAgICAvLyAnL3NyYy9zY29wZXMvY29yZS8qKi8qLmh0bWwnXG4gICAgLy8gXHU2MzkyXHU5NjY0XHU2N0QwXHU0RTlCXHU2NTg3XHU0RUY2XG4gICAgLy8gJyEvc3JjL2NvcmVQYWdlLyoqL3VpcmVkaXJlY3QuaHRtbCdcbiAgICAvLyBcdTZDRThcdTYxMEYxOiBcdTUzRUFcdTY3MDlcdTkxNERcdTdGNkVcdTU3MjhcdThGRDlcdTkxQ0MoYGh0bWxgKVx1NjIxNmBjbGkubW9kdWxlc2BcdTRFMEJcdTYyMTZgLnBucG0vcGFnZXMuY2pzYFx1NEUwQlx1NzY4NGh0bWxcdTZBMjFcdTU3NTdcdTUzRUZcdTRFRTVcdTg4QUJ2aXRlLXBsdWdpbi12aXJ0dWFsLWh0bWxcdTYzRDJcdTRFRjZcdTg5RTNcdTY3OTBcdTVFNzZcdTUyQTBcdThGN0RcbiAgICAvLyBcdTZDRThcdTYxMEYyOiBcdTkxNERcdTdGNkVcdTVFOTRcdThCRTVcdTRFRTUvXHU2MjE2IVx1NUYwMFx1NTkzNFxuICAgIC8vIFx1OUFEOFx1N0VBN1x1OTE0RFx1N0Y2RTpcbiAgICAvLyBcdTU5ODJcdTY3OUNcdTRGNjBcdTk3MDBcdTg5ODFcdTVDMDZodG1sXHU2NTg3XHU0RUY2XHU2NTNFXHU3RjZFXHU1MjMwXHU0RTAwXHU0RTJBXHU3Mjc5XHU1QjlBXHU3Njg0XHU3NkVFXHU1RjU1XHU0RTBCXHU4RkRCXHU4ODRDXHU4QkJGXHU5NUVFXHU2NUY2XG4gICAgLy8gXHU2MjE2XG4gICAgLy8gXHU5ODc5XHU3NkVFXHU0RTJEXHU2NzA5XHU1OTFBXHU0RTJBXHU1NDBDXHU1NDBEXHU3Njg0aHRtbFx1NzY4NFx1NjU4N1x1NEVGNlx1NjVGNlxuICAgIC8vIFx1NjIxNlxuICAgIC8vIFx1NjdEMFx1NEUyQWh0bWxcdTY1ODdcdTRFRjZcdTU3MjhcdTY3MDBcdTdFQzhcdThCQkZcdTk1RUVcdTY1RjZcdTc2ODRcdTU0MERcdTc5RjBcdTRFMEVcdTk4NzlcdTc2RUVcdTRFMkRcdTc2ODRodG1sXHU2NTg3XHU0RUY2XHU3Njg0XHU1NDBEXHU3OUYwXHU0RTBEXHU0RTAwXHU4MUY0XHU2NUY2XG4gICAgLy8gXHU2QjY0XHU2NUY2LFx1NEY2MFx1NTNFRlx1NEVFNVx1OTAxQVx1OEZDN1x1NEYyMFx1NTE2NVx1NUJGOVx1OEM2MVx1Njc2NVx1NTIwNlx1NTIyQlx1NUJGOVx1NkJDRlx1NEUyQWh0bWxcdTk4NzVcdTk3NjJcdThGREJcdTg4NENcdTUzNTVcdTcyRUNcdTc2ODRcdTkxNERcdTdGNkVcbiAgICAvLyBcdTRGOEJcdTU5ODJcdTRFMEJcdTk3NjJcdTc2ODRcdTUxRTBcdTRFMkFcdTRGOEJcdTVCNTAsXHU1NzI4XHU2NzAwXHU3RUM4XHU3NTFGXHU2MjEwXHU3Njg0XHU2NUY2XHU1MDE5XG4gICAgLy8gXHU0RjhCMTogXHU0RjdGXHU3NTI4XHU4REVGXHU1Rjg0IGh0dHA6Ly9sb2NhbGhvc3Q6NTE3My9kZW1vL2xvZ2luMS5odG1sIFx1OEJCRlx1OTVFRVx1OTg3NVx1OTc2MlxuICAgIC8vIHtcbiAgICAvLyAgIHBhdGg6ICdkZW1vL2xvZ2luMScsXG4gICAgLy8gICBlbnRyeTogJy9zcmMvY29yZVBhZ2UvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgLy8gfSxcbiAgICAvLyBcdTRGOEIyOiBcdTRGN0ZcdTc1MjhcdThERUZcdTVGODQgaHR0cDovL2xvY2FsaG9zdDo1MTczL2xvZ2luMi5odG1sIFx1OEJCRlx1OTVFRVx1OTg3NVx1OTc2MlxuICAgIC8vIHtcbiAgICAvLyAgIHBhdGg6ICdsb2dpbjEnLFxuICAgIC8vICAgZW50cnk6ICcvc3JjL2NvcmVQYWdlL2xvZ2luL2xvZ2luLmh0bWwnLFxuICAgIC8vIH1cbiAgXSxcbiAgY2xpOiB7XG4gICAgLy8gXHU2Q0U4XHU2MTBGMTogXHU4RkQ5XHU5MUNDXHU5MTREXHU3RjZFXHU3Njg0XHU2NjJGXHU2NTNFXHU3RjZFXHU1NzI4KC9zcmMvcHJvamVjdClcdTc2RUVcdTVGNTVcdTRFMEJcdTc2ODRcdTZBMjFcdTU3NTdcdTc2ODRodG1sXHU2NTg3XHU0RUY2XG4gICAgLy8gXHU2Q0U4XHU2MTBGMjogXHU4RkQ5XHU5MUNDXHU5MTREXHU3RjZFXHU3Njg0XHU2QTIxXHU1NzU3XHU0RjFBXHU0RjVDXHU0RTNBaHRtbFx1NjNEMlx1NEVGNlx1NzY4NFx1OTE0RFx1N0Y2RVx1NkNFOFx1NTE2NVx1NEUwMFx1NEUyQWdsb2IsXHU0RjhCXHU1OTgyOiAvc3JjL3Byb2plY3QvKiovZGVtb1Rlc3QuaHRtbFxuICAgIC8vIFx1NkNFOFx1NjEwRjM6IFx1NTk4Mlx1Njc5Q1x1NTcyOCgvc3JjL3Byb2plY3QpXHU3NkVFXHU1RjU1XHU0RTBCLFx1NjcwOVx1NTkxQVx1NEUyQVx1NzZGOFx1NTQwQ1x1NTQwRFx1NUI1N1x1NzY4NGh0bWxcdTY1ODdcdTRFRjYsXHU5MEEzXHU0RTQ4XHU0RjYwXHU1RkM1XHU5ODdCXHU1NzI4XHU0RTBBXHU5NzYyXHU3Njg0YGh0bWxgXHU5MTREXHU3RjZFXHU0RTJEXHU2MzkyXHU5NjY0XHU1MTc2XHU0RUQ2XHU3Njg0XHU2NTg3XHU0RUY2IFx1NjIxNiBcdTU3MjhgaHRtbGBcdTkxNERcdTdGNkVcdTRFMkRcdTUyMDZcdTUyMkJcdTRFM0FcdTZCQ0ZcdTRFMkFodG1sXHU2NTg3XHU0RUY2XHU2MzA3XHU1QjlBJ1x1NzZFRVx1NUY1NSdcdTYyMTYnXHU1MjJCXHU1NDBEJyxcdThCRTZcdTdFQzZcdTY3RTVcdTc3MEJodG1sXHU5MTREXHU3RjZFXHU4QkY0XHU2NjBFXG4gICAgbW9kdWxlczogWydjbGV2ZXJBaVBhY3MnXSxcbiAgICAvLyBcdThGRDlcdTRFMkFcdTkxNERcdTdGNkVcdTUzRUZcdTRFRTVcdTc1MjhcdTY3NjVcdTkxNERcdTdGNkUgaHRtbCBcdTY1ODdcdTRFRjZcdTc2RjhcdTUxNzNcdTc2ODRcdTUxODVcdTVCQjlcbiAgICBodG1sOiB7XG4gICAgICAvLyBcdTc1MjhcdTRFOEVcdTVCOUFcdTRFNDkgSFRNTCBcdTk4NzVcdTk3NjJcdTc2ODQgdGl0bGVcbiAgICAgIC8vIFx1NEY2MFx1NEU1Rlx1NTNFRlx1NEVFNVx1NTcyOFx1OEZEOVx1OTFDQ1x1NkRGQlx1NTJBMFx1OTg3OVx1NzZFRVx1NzY4NEhUTUwgXHU2NTg3XHU0RUY2XHU3Njg0XHU5MTREXHU3RjZFXG4gICAgICAvLyBcdTRGNDZcdTY2MkYsXHU2Q0U4XHU2MTBGLFx1NTcyOCBIVE1MIFx1NjU4N1x1NEVGNlx1NEUyRFx1NEY3Rlx1NzUyOFx1NjVGNixcdTVGQzVcdTk4N0JcdTRGN0ZcdTc1Mjg6ICVWSVRFX0hUTUxfVElUTEVfKiVcbiAgICAgIC8vIFx1NzY4NFx1NUY2Mlx1NUYwRlx1Njc2NVx1NEY3Rlx1NzUyOFxuICAgICAgdGl0bGU6IHtcbiAgICAgICAgYXVkaXQ6ICdcdTVCQTFcdThCQTFcdTdCQTFcdTc0MDYnLFxuICAgICAgICBhdXRob3JpdHk6ICdcdTY3NDNcdTk2NTBcdTdCQTFcdTc0MDYnLFxuICAgICAgICBkZW1vX3Rlc3Q6ICdcdTc5M0FcdTRGOEJcdTZBMjFcdTU3NTcnLFxuICAgICAgICBmdW5jdGlvbl9tb2R1bGVzOiAnXHU1MjlGXHU4MEZEXHU2QTIxXHU1NzU3JyxcbiAgICAgICAgaW5kZXg6ICdUYSszNDA0XHU1RjAwXHU1M0QxXHU1RTczXHU1M0YwJyxcbiAgICAgICAgbG9naW46ICdcdTc2N0JcdTVGNTUnLFxuICAgICAgICBsb2dtZzogJ1x1NjVFNVx1NUZEN1x1N0JBMVx1NzQwNicsXG4gICAgICAgIG1lc3NhZ2VtZzogJ1x1NkQ4OFx1NjA2Rlx1NTM4Nlx1NTNGMlx1N0JBMVx1NzQwNicsXG4gICAgICAgIG9yZ3VzZXI6ICdcdTdFQzRcdTdFQzdcdTdCQTFcdTc0MDYnLFxuICAgICAgICBwcm9qZWN0X2RlbW86ICdcdTdFQzRcdTRFRjZcdTc5M0FcdTRGOEInLFxuICAgICAgICByZWdpc3RlcjogJ1x1NkNFOFx1NTE4QycsXG4gICAgICAgIHJlc291cmNlbWc6ICdcdThENDRcdTZFOTBcdTdCQTFcdTc0MDYnLFxuICAgICAgICBzeXNtZzogJ1x1N0NGQlx1N0VERlx1N0JBMVx1NzQwNicsXG4gICAgICAgIHVpcmVkaXJlY3Q6ICd1aXJlZGlyZWN0JyxcbiAgICAgICAgdXNlcl9jZW50ZXI6ICdcdTRFMkFcdTRFQkFcdTRFMkRcdTVGQzMnLFxuICAgICAgICB3b3JrX3RhYmxlX3BhZ2U6ICdcdTVERTVcdTRGNUNcdTUzRjBcdTZBMjFcdTU3NTcnLFxuICAgICAgICAvLyAtLS0tXHU2NUIwXHU3Q0ZCXHU3RURGLS0tLSAvL1xuICAgICAgICBjbGV2ZWxfYWlfcGFjczogJ1x1NjY3QVx1NjE2N1x1NTMzQlx1NzU5N1x1NUY3MVx1NTBDRlx1N0NGQlx1N0VERidcblxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIFx1NzUyOFx1NEU4RVx1NjMwN1x1NUI5QVx1Njg0Nlx1NjdCNlx1OUVEOFx1OEJBNFx1NzY4NFx1OTg3NVx1OTc2Mlx1NzY4NFx1NTQwNFx1NEUyQVx1NUI1MFx1NkEyMVx1NTc1N1x1NzY4NFx1NUI5RVx1NzNCMCxcdTUzRUFcdTY3MDlcdTU3MjhcdThGRDlcdTkxQ0NcdTYzRDBcdTRGOUJcdTc2ODRcdTVCNTBcdTZBMjFcdTU3NTdcdTYyNERcdTgwRkRcdTg4QUJcdTg5ODZcdTc2RDZcbiAgICBvdmVycmlkZToge1xuICAgICAgLy8gXHU3RUQzXHU2Nzg0XG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTY2MkZcdTkwMUFcdTc1MjhcdTc2ODRcdTdFQzRcdTRFRjYsXHU5MEEzXHU0RTQ4XHU3NkY0XHU2M0E1XHU2NTNFXHU1MjMwXHU3QjJDXHU0RTAwXHU3RUE3XG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTY2MkZcdTY3RDBcdTRFMkFcdTk4NzVcdTk3NjJcdTc2ODRcdTdFQzRcdTRFRjYsIFx1OTBBM1x1NEU0OFx1NEY3Rlx1NzUyOFx1OTg3NVx1OTc2Mlx1NTQwRFx1NUI1N1x1NzY4NFx1NUJGOVx1OEM2MSxcdTRGOEJcdTU5ODJcdTRFMEJcdTk3NjJcdTc2ODRsb2dpblxuICAgICAgJ3JvdXRlcy1jb250YWluZXInOiAnQHloL2NsaS1pbnRlcm5hbC1jb21tb24vc3JjL2NvbXBvbmVudHMvcm91dGVzQ29udGFpbmVyLnZ1ZScsXG4gICAgICAvLyBcdTRFRTVsb2dpbi9zcmMvbW9kaWZ5LXBhc3N3b3JkXHU0RTNFXHU0RjhCOlxuICAgICAgLy8gXHU1NzI4XHU0RjdGXHU3NTI4XHU2NUY2LFx1NEY3Rlx1NzUyOGgoJ2xvZ2luL3NyYy9tb2RpZnktcGFzc3dvcmQnKVx1NjIxNmgoJ2xvZ2luX3NyY19tb2RpZnktcGFzc3dvcmQnKVx1NjIxNlx1NTcyOHZ1ZVx1NzY4NHRlbXBsYXRlXHU0RTJEXHU0RjdGXHU3NTI4PGxvZ2luX3NyY19tb2RpZnktcGFzc3dvcmQvPlx1NjgwN1x1N0I3RVxuICAgICAgLy8gXHU5MDFBXHU4RkM3dW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcdTc2ODRcdTU5MDRcdTc0MDZcdTU0MEVcbiAgICAgIC8vIFx1NUMwNlx1NEYxQVx1OEY2Q1x1NjM2Mlx1NEUzQVx1NUJGOVx1OEZEOVx1NEUyQVx1NUJGOVx1OEM2MTogbG9naW4uc3JjLm1vZGlmeS1wYXNzd29yZCBcdTc2ODRcdTVGMTVcdTc1MjhcbiAgICAgIGxvZ2luOiB7XG4gICAgICAgIC8vIFx1NTQwNFx1NEUyQVx1NTNFRlx1NEVFNVx1ODk4Nlx1NzZENlx1NzY4NFx1NkEyMVx1NTc1NyxcdTc2RjRcdTYzQTVcdTYzMDdcdTVCOUFcdTUxNzZcdTYyNDBcdTU3MjhcdTc2ODRcdThERUZcdTVGODRcbiAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU0RjdGXHU3NTI4bm9kZV9tb2R1bGVzXHU0RTBCXHU3Njg0XHU1QjlFXHU3M0IwXHU1MjE5XHU0RTBEXHU5NzAwXHU4OTgxL1x1NUYwMFx1NTkzNFxuICAgICAgICAvLyBcdThGRDlcdTRFMkFcdTVCOUVcdTczQjBcdTUzRUZcdTRFRTVcdTRGN0ZcdTc1MjhcdTRFRkJcdTRGNTVcdTUzRUZcdTZFMzJcdTY3RDNcdTUxRkFcdTk4NzVcdTk3NjJcdTc2ODRcdTY1ODdcdTRFRjYsXHU1OTgyLnZ1ZS8uanMvLmpzeC8udHMvLnRzeFx1N0I0OVxuICAgICAgICBsb2dpbjogJy9zcmMvb3ZlcnJpZGUvbG9naW4tb3ZlcnJpZGUtZGVtby9sb2dpbi52dWUnLFxuICAgICAgICAvLyBsb2dpbjogJ0B5aC9jbGktcGFnZXMtbG9naW4vc3JjL2xvZ2luLnZ1ZScsXG4gICAgICAgIC8vIGxvZ2luOiAnL3NyYy9vdmVycmlkZS9sb2dpbi1vdmVycmlkZS1kZW1vL2xvZ2luLnZ1ZScsXG4gICAgICAgIC8vIGxvZ2luOiAnL3NyYy9vdmVycmlkZS9sb2dpbi1vdmVycmlkZS1kZW1vL2xvZ2luLWpzLmpzJyxcbiAgICAgICAgLy8gbG9naW46ICcvc3JjL292ZXJyaWRlL2xvZ2luLW92ZXJyaWRlLWRlbW8vbG9naW4tanN4LmpzeCcsXG4gICAgICAgIHNyYzoge1xuICAgICAgICAgICdtb2RpZnktcGFzc3dvcmQnOiAnQHloL2NsaS1wYWdlcy1sb2dpbi9zcmMvcGFydC9tb2RpZnlQYXNzd29yZC52dWUnLFxuICAgICAgICAgICdzb2NpYWwtbGlzdCc6ICdAeWgvY2xpLXBhZ2VzLWxvZ2luL3NyYy9wYXJ0L3NvY2lhbExpc3QudnVlJyxcbiAgICAgICAgICAnbG9naW4tZm9ybSc6ICcvc3JjL292ZXJyaWRlL2xvZ2luLW92ZXJyaWRlLWRlbW8vbG9naW5Gb3JtLnZ1ZScsXG4gICAgICAgICAgJ3Ntcy1sb2dpbi1mb3JtJzogJ0B5aC9jbGktcGFnZXMtbG9naW4vc3JjL3BhcnQvc21zTG9naW5Gb3JtLnZ1ZScsXG4gICAgICAgICAgdmVyaWZ5OiAnQHloL2NsaS1wYWdlcy1sb2dpbi9zcmMvcGFydC92ZXJpZml0aW9uL1ZlcmlmeS52dWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIC8vIGluZGV4OiB7XG4gICAgICAvLyAgICdtZW51LWhvcml6b24nOiAnL3NyYy9vdmVycmlkZS9pbmRleC1vdmVycmlkZS1kZW1vL21lbnVIb3Jpem9uLnZ1ZScsXG4gICAgICAvLyB9LFxuICAgIH0sXG4gICAgLy8gXHU1NzI4XHU4RkQ5XHU5MUNDXHU5MTREXHU3RjZFXHU3Njg0XHU5ODc1XHU5NzYyXHU1M0VGXHU0RUU1XHU0RjdGXHU3NTI4dnVlLXJvdXRlclx1NzY4NGhpc3RvcnlcdThERUZcdTc1MzFcbiAgICBoaXN0b3J5UGFnZTogW1xuICAgICAgLy8gJ3Byb2plY3REZW1vJ1xuICAgIF0sXG4gICAgLy8gXHU2NkZGXHU2MzYyXHU2N0QwXHU0RTlCXHU2NTg3XHU0RUY2XHU3Njg0XHU1MTg1XHU1QkI5XHU0RTNBXHU1M0U2XHU0RTAwXHU0RTJBXHU2NTg3XHU0RUY2XG4gICAgLy8gXHU2Q0U4XHU2MTBGOiBcdThGRDlcdTRFMkFcdTUyOUZcdTgwRkRcdTUzRUZcdTgwRkRcdTRGMUFcdTVCRkNcdTgxRjRcdTRGNjBcdTU3MjhcdThDMDNcdThCRDVcdTcyNzlcdTVCOUFcdTY1ODdcdTRFRjZcdTY1RjZcdTUxRkFcdTczQjBcdTZERjdcdTZEQzZcbiAgICAvLyBcdTRGOEJcdTU5ODI6IFx1NEZFRVx1NjUzOVx1NjU4N1x1NEVGNlx1NTQwRVx1Nzg2RVx1NkNBMVx1NjcwOVx1NTcyOFx1OTg3NVx1OTc2Mlx1NEUwQVx1NjYzRVx1NzkzQVxuICAgIGZpbGVzOiBbXG4gICAgICAvLyB7XG4gICAgICAvLyBmaWxlIFx1NTNFRlx1NEVFNVx1NjYyRlx1NEUwMFx1NEUyQVx1NjU4N1x1NEVGNlx1NTQwRCxcdTRFNUZcdTUzRUZcdTRFRTVcdTY2MkZcdTRFMDBcdTRFMkFcdTY1ODdcdTRFRjZcdTc2ODRcdThERUZcdTVGODQoXHU1M0VGXHU0RUU1XHU2NjJGXHU0RTAwXHU5MEU4XHU1MjA2LFx1NEY0Nlx1NjYyRlx1NUZDNVx1OTg3Qlx1NjYyRlx1OEZERVx1N0VFRFx1NzY4NCxcdTRGOEJcdTU5ODI6IFx1NjcwOVx1NEUwMFx1NEUyQVx1NjU4N1x1NEVGNiwvYS9iL2MvZC52dWUuIGZpbGVcdTUzRUZcdTRFRTVcdTUxOTlcdTRFM0FhL2IvYy9kLnZ1ZVx1NjIxNiBjL2QudnVlIFx1N0I0OSxcdTRGNDZcdTY2MkZcdTRFMERcdTgwRkRcdTY2MkZhL2QudnVlKVxuICAgICAgLy8gICBmaWxlOiAncGFnZS52dWUnLFxuICAgICAgLy8gbmV3RmlsZVx1NzY4NFx1NTE5OVx1NkNENVx1NUZDNVx1OTg3Qlx1NjYyRlx1NEUwQlx1OTc2Mlx1NzY4NFx1OEZEOVx1NEUyQVx1NTE5OVx1NkNENSxcdThGRDlcdTY4MzdcdTYyNERcdTgwRkRcdTgzQjdcdTUzRDZcdTUyMzBuZXdGaWxlIFx1NzY4NFx1NUI4Q1x1NjU3NFx1OERFRlx1NUY4NFxuICAgICAgLy8gICBuZXdGaWxlOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL0RlbW8udnVlJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAvLyB9LFxuICAgIF0sXG4gIH0sXG4gIC8vIFx1OEZEOVx1NEUyQVx1OTE0RFx1N0Y2RVx1NEVDNVx1NzUyOFx1NEU4RWJ1aWxkOm1wYVx1ODExQVx1NjcyQ1xuICAvLyBcdTVGNTNcdTRGMjBcdTUxNjVcdTRFMDBcdTRFMkFcdTY1NzBcdTdFQzRcdTY1RjY6IFx1NEVDNVx1N0YxNlx1OEJEMVx1NjU3MFx1N0VDNFx1NEUyRFx1NzY4NFx1OTg3NVx1OTc2MlxuICAvLyBcdTVGNTNcdTRGMjBcdTUxNjV0cnVlXHU2NUY2LFx1NUMwNlx1N0YxNlx1OEJEMVx1NjI0MFx1NjcwOVx1NTNFRlx1NzUyOFx1NzY4NFx1OTg3NVx1OTc2MihcdTRFMEVwbnBtIGJ1aWxkXHU0RTAwXHU4MUY0LFx1NEY0Nlx1NjYyRlx1NEYxQVx1NUMwNlx1NTQwNFx1NEUyQVx1OTg3NVx1OTc2Mlx1NzY4NGFzc2V0c1x1NjUzRVx1NTIzMFx1NzJFQ1x1N0FDQlx1NzY4NGFzc2V0c1x1NzZFRVx1NUY1NVx1NEUyRClcbiAgLy8gXHU2Q0U4XHU2MTBGOiBcdThGRDlcdTRFMkFcdTUyOUZcdTgwRkRcdTVFOTRcdTVGNTNcdTRFQzVcdTc1MjhcdTRFOEVcdTVDMTFcdTkxQ0ZcdTk4NzVcdTk3NjJcdTc2ODRcdTYyNTNcdTUzMDUsXHU1OTgyXHU2NzlDXHU5ODc1XHU5NzYyXHU4RkM3XHU1OTFBLFx1NTIxOVx1NEYxQVx1NUJGQ1x1ODFGNFx1N0YxNlx1OEJEMVx1NjVGNlx1OTVGNFx1OEZDN1x1OTU3RlxuICBtcGE6IFsnbG9naW4nXSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IF9kZWZhdWx0O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXFxcXHV0aWxzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL2J1aWxkLXZpdGUvc3JjL3V0aWxzLnRzXCI7aW1wb3J0IHsgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZpdGVDb21tb25Db25maWcgZnJvbSAnLi4vLi4vdml0ZUNvbW1vbkNvbmZpZyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5cbmxldCB2aXRlQXBwRW52OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xubGV0IGN1cnJlbnRNb2RlOiBzdHJpbmc7XG5cbi8qKlxuICogXHU1MjFEXHU1OUNCXHU1MzE2dml0ZUFwcEVudlxuICogQHBhcmFtIG1vZGVcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRFbnYobW9kZTogc3RyaW5nKSB7XG4gIHZpdGVBcHBFbnYgPSBsb2FkRW52KFxuICAgIG1vZGUgPT09ICdvcHRpbWl6ZScgPyAnZGV2ZWxvcG1lbnQnIDogbW9kZSxcbiAgICBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJy4vLmVudicpLFxuICAgICcnLFxuICApO1xuICBjdXJyZW50TW9kZSA9IG1vZGU7XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU2MzA3XHU1QjlBXHU1NDBEXHU3OUYwXHU3Njg0ZW52XG4gKiBAcGFyYW0ga2V5XG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW52KGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZXJyb3IoY2hhbGsuYmdSZWQoJ1x1NTcyOFx1ODNCN1x1NTNENmVudlx1NjVGNixcdTVGQzVcdTk4N0JcdTRGMjBcdTUxNjVlbnZcdTc2ODRcdTU0MERcdTVCNTchJykpO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgY29uc3QgZW52ID0gdml0ZUFwcEVudltrZXldO1xuICBpZiAoZW52ID09PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoa2V5ICE9PSAnUlVOX0VOVicpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgIGBcdTU3MjhcXGAke2NoYWxrLmJsdWVCcmlnaHQoYC5lbnYuJHtjdXJyZW50TW9kZX1gKX1cXGBcdTY1ODdcdTRFRjZcdTRFMkRcdTZDQTFcdTY3MDlcdTYyN0VcdTUyMzBcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0Y6JHtjaGFsay5ibHVlKFxuICAgICAgICAgIGtleSxcbiAgICAgICAgKX0hIFx1OEZEOVx1NEUyQVx1OEI2Nlx1NTQ0QVx1NEUwMFx1ODIyQ1x1NjBDNVx1NTFCNVx1NEUwQlx1NTNFRlx1NEVFNVx1NUZGRFx1NzU2NSFgLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVudjtcbn1cblxuLyoqXG4gKiBcdTUyMjRcdTY1QURcdTRFMDBcdTRFMkFlbnZcdTY2MkZcdTU0MjZcdTY2MkZ0cnVlXG4gKiBAcGFyYW0ga2V5XG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNFbnZUcnVlKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBnZXRFbnYoa2V5KT8udG9VcHBlckNhc2UoKSA9PT0gJ1RSVUUnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3BlbigpIHtcbiAgLy8gXHU5MTREXHU3RjZFXHU1NDJGXHU1MkE4XHU5RUQ4XHU4QkE0XHU3Njg0XHU5ODc1XHU5NzYyXG4gIGxldCBvcGVuOiBib29sZWFuIHwgc3RyaW5nID0gZmFsc2U7XG4gIGlmICh2aXRlQ29tbW9uQ29uZmlnLm9wZW4pIHtcbiAgICBvcGVuID0gYCR7Z2V0RW52KCdWSVRFX1BVQkxJQ19QQVRIJyl9LyR7dml0ZUNvbW1vbkNvbmZpZy5vcGVufWAucmVwbGFjZUFsbCgvXFwvXFwvL2csICcvJyk7XG4gIH1cbiAgcmV0dXJuIG9wZW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2cobXNnOiBzdHJpbmcpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgY29uc29sZS5sb2cobXNnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhcm4obXNnOiBzdHJpbmcpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgY29uc29sZS53YXJuKG1zZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlcnJvcihtc2c6IHN0cmluZykge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICBjb25zb2xlLmVycm9yKG1zZyk7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcXFxcY3NzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL2J1aWxkLXZpdGUvc3JjL2Nzcy50c1wiO2ltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcbmltcG9ydCB0eXBlIHtDU1NPcHRpb25zfSBmcm9tICd2aXRlJztcbmltcG9ydCB7Z2V0RW52fSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNzcygpOiBQcm9taXNlPENTU09wdGlvbnM+IHtcbiAgLy8gQHRzLWV4cGVjdC1lcnJvciBcdTVGRkRcdTc1NjVcdThGRDlcdTRFMkFcdTdDN0JcdTU3OEJcdTk1MTlcdThCRUZcbiAgcmV0dXJuIHtcbiAgICBwb3N0Y3NzOiB7XG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgXHU1RkZEXHU3NTY1XHU4RkQ5XHU5MUNDXHU3Njg0XHU3QzdCXHU1NzhCXHU5NTE5XHU4QkVGXG4gICAgICAgIGF1dG9wcmVmaXhlcih7XG4gICAgICAgICAgLy8gXHU5MTREXHU3RjZFXHU0RjdGXHU3NTI4IGF1dG9wcmVmaXhlclxuICAgICAgICAgIG92ZXJyaWRlQnJvd3NlcnNsaXN0OiBbJz4gMSUnLCAnbGFzdCAzIHZlcnNpb25zJywgJ2llID49IDExJywgJ2Nocm9tZSA+PSA0MSddLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBsZXNzOiB7XG4gICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICBtYXRoOiAnYWx3YXlzJyxcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcbiAgICAgICAgQGltcG9ydCBcIkB5aC90YTQwNC11aS9lcy9zdHlsZS9taXhpbnMvaW5kZXgubGVzc1wiO1xuICAgICAgICBAaW1wb3J0IFwiY2xpL3Byb2plY3RDb21tb24vc3JjL3N0eWxlQ292ZXIvbWl4aW5zL2Z1bmMubGVzc1wiO1xuICAgICAgICBAaW1wb3J0IFwiaW50ZXJuYWwvdGhlbWUvcHJlc2V0LXRoZW1lL2dsb2JhbC1jdXN0b21lci12YXJzLmxlc3NcIjtcbiAgICAgICAgQGltcG9ydCBcImNsaS9wcm9qZWN0Q29tbW9uL3NyYy9zdHlsZUNvdmVyL3N0eWxlQ292ZXIubGVzc1wiO1xuICAgICAgICBgLFxuICAgICAgICBtb2RpZnlWYXJzOiB7XG4gICAgICAgICAgLy8gXHU1NzI4bGVzc1x1NjU4N1x1NEVGNlx1NEUyRFx1NjNEMFx1NEY5Qlx1NUY1M1x1NTI0RFx1OTg3OVx1NzZFRVx1NzY4NHB1YmxpYy1wYXRoXHU1M0Q4XHU5MUNGXG4gICAgICAgICAgJ3B1YmxpYy1wYXRoJzogZ2V0RW52KCdWSVRFX1BVQkxJQ19QQVRIJykuZW5kc1dpdGgoJy8nKVxuICAgICAgICAgICAgPyBnZXRFbnYoJ1ZJVEVfUFVCTElDX1BBVEgnKVxuICAgICAgICAgICAgOiBgJHtnZXRFbnYoJ1ZJVEVfUFVCTElDX1BBVEgnKX0vYCxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBwcmVwcm9jZXNzb3JNYXhXb3JrZXJzOiB0cnVlLFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXFxcXHVucGx1Z2luLXJlc29sdmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXFxcXHVucGx1Z2luLXJlc29sdmVyXFxcXGNsaS1jb21wb25lbnRzLm92ZXJyaWRlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL2J1aWxkLXZpdGUvc3JjL3VucGx1Z2luLXJlc29sdmVyL2NsaS1jb21wb25lbnRzLm92ZXJyaWRlLnRzXCI7aW1wb3J0IHsgdHlwZSBDb21wb25lbnRSZXNvbHZlciwga2ViYWJDYXNlIH0gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMnO1xuaW1wb3J0IHsgbWVyZ2VDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCBjbGlPdmVycmlkZSBmcm9tICcuLi8uLi8uLi92aXRlQ29tbW9uQ29uZmlnJztcblxuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSAnbm9kZTpmcyc7XG5pbXBvcnQgZ2xvYiBmcm9tICdmYXN0LWdsb2InO1xuaW1wb3J0IHsgZXJyb3IgfSBmcm9tICcuLi91dGlscyc7XG5cbmNvbnN0IG1vZHVsZVBhZ2VzID0ge307XG5cbmdsb2JcbiAgLnN5bmMoW2Ake2dsb2IuY29udmVydFBhdGhUb1BhdHRlcm4ocHJvY2Vzcy5jd2QoKSl9L25vZGVfbW9kdWxlcy9AeWgvKiovcGFnZXMuanNvbmBdKVxuICAuZm9yRWFjaCgoZmlsZSkgPT4ge1xuICAgIGNvbnN0IGNvbnRlbnQgPSByZWFkRmlsZVN5bmMoZmlsZSkudG9TdHJpbmcoKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QganNvbkNvbnRlbnQgPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xuICAgICAgT2JqZWN0LmFzc2lnbihtb2R1bGVQYWdlcywganNvbkNvbnRlbnQpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnN0IGZpbGVQYXRoID0gZmlsZS5yZXBsYWNlKHByb2Nlc3MuY3dkKCksICcnKTtcbiAgICAgIGVycm9yKGBKU09OXHU2NTg3XHU0RUY2XHU4RjZDXHU2MzYyXHU2NUY2XHU1MUZBXHU3M0IwXHU5NTE5XHU4QkVGIVxcblx1OEJGN1x1NjhDMFx1NjdFNVx1NjU4N1x1NEVGNjogJyR7ZmlsZVBhdGh9J2ApO1xuICAgICAgdGhyb3cgZTtcbiAgICB9XG4gIH0pO1xuXG5jb25zdCBPVkVSUklERV9QQUdFU19DT01QT05FTlRTID0gbWVyZ2VDb25maWcobW9kdWxlUGFnZXMsIGNsaU92ZXJyaWRlLmNsaS5vdmVycmlkZSk7XG5cbi8qKlxuICogXHU4RkQ5XHU0RTJBXHU2M0QyXHU0RUY2XHU3NTI4XHU0RThFXHU4OUUzXHU2NzkwaHRtbFx1NjgwN1x1N0I3RVx1NUU3Nlx1NUMwNlx1N0IyNlx1NTQwOFx1ODlDNFx1NTIxOShcdTg5QzRcdTUyMTlcdTkxNERcdTdGNkVcdTU3MjhPVkVSUklERV9QQUdFU19DT01QT05FTlRTXHU0RTJEKVx1NzY4NFx1NjgwN1x1N0I3RVx1NUJGOVx1NUU5NFx1NzY4NFx1N0VDNFx1NEVGNlx1OEZENFx1NTZERVxuICogXHU2NzAwXHU3RUM4XHU2RTMyXHU2N0QzXHU3Njg0XHU3RUM0XHU0RUY2XHU0RTNBXHU4RkQ5XHU0RTJBXHU2NUI5XHU2Q0Q1XHU4RkQ0XHU1NkRFXHU3Njg0XHU3RUM0XHU0RUY2XG4gKiBcdTU5ODJcdTY3OUNcdThGRDRcdTU2REVcdTRFM0F1bmRlZmluZWQsXHU1MjE5XHU0RTBEXHU4RkRCXHU4ODRDXHU0RUZCXHU0RjU1XHU1OTA0XHU3NDA2XG4gKi9cbmV4cG9ydCBkZWZhdWx0ICgpOiBDb21wb25lbnRSZXNvbHZlciA9PiB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ2NvbXBvbmVudCcsXG4gICAgcmVzb2x2ZShuYW1lKSB7XG4gICAgICBjb25zdCBrYk5hbWUgPSBrZWJhYkNhc2UobmFtZSk7XG4gICAgICBpZiAoT1ZFUlJJREVfUEFHRVNfQ09NUE9ORU5UU1trYk5hbWVdKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgZnJvbTogT1ZFUlJJREVfUEFHRVNfQ09NUE9ORU5UU1trYk5hbWVdLFxuICAgICAgICB9O1xuICAgICAgfVxuICAgICAgY29uc3QgcGF0aHMgPSBrYk5hbWUucmVwbGFjZSgvXy9nLCAnLycpLnNwbGl0KCcvJyk7XG4gICAgICBpZiAoIU9WRVJSSURFX1BBR0VTX0NPTVBPTkVOVFNbcGF0aHNbMF1dKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBhZ2VSZXN1bHQgPSBwYXRocy5yZWR1Y2UoKHB2LCBjdikgPT4ge1xuICAgICAgICBpZiAocHYgPT09IHVuZGVmaW5lZCB8fCAhcHYpIHtcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjdiBpbiBwdikge1xuICAgICAgICAgIHJldHVybiBwdltjdl07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0sIE9WRVJSSURFX1BBR0VTX0NPTVBPTkVOVFMpO1xuICAgICAgaWYgKHBhZ2VSZXN1bHQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4ge1xuICAgICAgICBmcm9tOiBwYWdlUmVzdWx0LFxuICAgICAgfTtcbiAgICB9LFxuICB9O1xufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcRGVza3RvcFxcXFxwcm9qZWN0XFxcXHlpbmhhaVxcXFx2dWVcXFxcdGVzdDVcXFxcZGVtb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRGVza3RvcFxcXFxwcm9qZWN0XFxcXHlpbmhhaVxcXFx2dWVcXFxcdGVzdDVcXFxcZGVtb1xcXFxtdWx0aXBsZVNlcnZpY2UuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL211bHRpcGxlU2VydmljZS5jb25maWcudHNcIjtpbXBvcnQgdHlwZSB7IEluamVjdENvZGUgfSBmcm9tICd2aXRlLXBsdWdpbi12aXJ0dWFsLWh0bWwnO1xuaW1wb3J0IHsgUE9TIH0gZnJvbSAndml0ZS1wbHVnaW4tdmlydHVhbC1odG1sJztcblxuY29uc3QgbXVsdGlwbGVTZXJ2aWNlQ29uZmlnOiBSZWNvcmQ8c3RyaW5nLCBQYXJ0aWFsPEluamVjdENvZGU+IHwgc3RyaW5nPiA9IHtcbiAgLy8gXHU2QTIxXHU1NzU3XHU1NDBEXHU3OUYwXHU1RkM1XHU5ODdCXHU0RTBFaHRtbFx1NzZGOFx1NTMzOVx1OTE0RFxuICAvLyAxLiBcdTVCRjlcdTRFMDBcdTRFMkFcdTUxNzdcdTRGNTNcdTc2ODRcdTk4NzVcdTk3NjIsXHU1M0VGXHU3NkY0XHU2M0E1XHU0RjdGXHU3NTI4XHU1OTgyXHU0RTBCXHU3Njg0XHU5MTREXHU3RjZFXHU4RkRCXHU4ODRDXHU2Q0U4XHU1MTY1LFx1NEUwMFx1ODIyQ1x1NUVGQVx1OEJBRVx1NzZGNFx1NjNBNVx1NEY3Rlx1NzUyOFx1OEZEOVx1NzlDRFx1NjVCOVx1NUYwRlxuICAnbG9naW4uaHRtbCc6ICc8c2NyaXB0PndpbmRvdy5kZCA9IFwiZGRcIjs8L3NjcmlwdD4nLFxuICAvLyBcdTRFNUZcdTUzRUZcdTRFRTVcdTkwMUFcdThGQzdcdTRGMjBcdTUxNjVcdTRFMDBcdTRFMkFcdTVCRjlcdThDNjFcdTY3NjVcdTZDRThcdTUxNjVcdTkxNERcdTdGNkVcbiAgLy8gJ2xvZ2luLmh0bWwnOiB7XG4gIC8vICAgLy8gcG9zOiBQT1MuYmVmb3JlLFxuICAvLyAgIC8vIGZpbmQ6ICc8L2hlYWQ+JyxcbiAgLy8gICByZXBsYWNlbWVudDogJzxzY3JpcHQ+d2luZG93LmRkID0gXCJkZFwiOzwvc2NyaXB0PicsXG4gIC8vIH0sXG4gIC8vIFx1NTE3Nlx1NEUyRCxwb3NcdTU0OENmaW5kXHU2NjJGXHU1M0VGXHU5MDA5XHU3Njg0LFx1ODJFNVx1NEUwRFx1NEYyMFx1NTE2NVx1NjVGNixcdTUxNzZcdTlFRDhcdThCQTRcdTUwM0NcdTRFM0FcbiAgLy8ge3BvczogUE9TLmJlZm9yZSwgZmluZDogJzwvaGVhZD4nfSxcbiAgLy8gMi4gXHU3Mjc5XHU2QjhBXHU5MTREXHU3RjZFLFx1NUMwNlx1NEYxQVx1NTcyOFx1NjI0MFx1NjcwOWh0bWxcdTY1ODdcdTRFRjZcdTc1MUZcdTY1NDhcbiAgLy8gXHU5MTREXHU3RjZFXHU4OUM0XHU1MjE5XHU0RTBFXHU1MTc3XHU0RjUzXHU5ODc1XHU5NzYyXHU3Njg0XHU5MTREXHU3RjZFXHU3NkY4XHU1NDBDXG4gICcqJzoge1xuICAgIC8vIFx1NjdFNVx1NjI3RVx1NTE4NVx1NUJCOVxuICAgIGZpbmQ6ICc8L2hlYWQ+JyxcbiAgICAvLyBcdTU3MjhcdTY3RTVcdTYyN0VcdTUxODVcdTVCQjlcdTUyNEQvXHU1NDBFXHU2NkZGXHU2MzYyXHU2N0U1XHU2MjdFXHU1MTg1XHU1QkI5XG4gICAgcG9zOiBQT1MuYmVmb3JlLFxuICAgIC8vIFx1ODk4MVx1NjZGRlx1NjM2Mlx1NzY4NFx1NTE4NVx1NUJCOSxcdThGRDlcdTRFMkFcdTUxODVcdTVCQjlcdTUzRUZcdTRFRTVcdTY2MkZzY3JpcHQsXHU0RTVGXHU1M0VGXHU0RUU1XHU2NjJGXHU1MTc2XHU0RUQ2XHU3Njg0XHU1MTg1XHU1QkI5XG4gICAgcmVwbGFjZW1lbnQ6IGBcbiAgICA8c2NyaXB0PlxuICAgIHdpbmRvdy5iYiA9IFwiYmJcIjtcbiAgICA8L3NjcmlwdD5cbiAgICBgLFxuICB9LFxufTtcblxuZXhwb3J0IGRlZmF1bHQge1xuICBtdWx0aXBsZVNlcnZpY2VDb25maWcsXG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcbXBhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcbXBhXFxcXHBhZ2VzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL2J1aWxkLXZpdGUvbXBhL3BhZ2VzLnRzXCI7aW1wb3J0IGdsb2IgZnJvbSAnZmFzdC1nbG9iJztcbmltcG9ydCB7IHJlYWRkaXIgfSBmcm9tICdub2RlOmZzL3Byb21pc2VzJztcbmltcG9ydCB7IGRpcm5hbWUsIHJlc29sdmUgfSBmcm9tICdub2RlOnBhdGgnO1xuaW1wb3J0IHsgZmlsZVVSTFRvUGF0aCB9IGZyb20gJ25vZGU6dXJsJztcbmltcG9ydCB7IG5vcm1hbGl6ZVBhdGggfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IFBPUyB9IGZyb20gJ3ZpdGUtcGx1Z2luLXZpcnR1YWwtaHRtbCc7XG5pbXBvcnQgcGFnZVNlcnZpY2UgZnJvbSAnLi4vLi4vbXVsdGlwbGVTZXJ2aWNlLmNvbmZpZyc7XG5pbXBvcnQgVml0ZUNvbW1vbkNvbmZpZyBmcm9tICcuLi8uLi92aXRlQ29tbW9uQ29uZmlnJztcblxuY29uc3QgeyBodG1sOiBodG1sUGFnZXMsIGNsaSB9ID0gVml0ZUNvbW1vbkNvbmZpZztcbmNvbnN0IHsgbW9kdWxlcyB9ID0gY2xpO1xuXG5leHBvcnQgY29uc3QgX19kaXJuYW1lID0gcmVzb2x2ZShkaXJuYW1lKGZpbGVVUkxUb1BhdGgoaW1wb3J0Lm1ldGEudXJsKSksICcuLi8uLi8nKTtcblxuZXhwb3J0IGNvbnN0IElHTk9SRV9OT0RFX01PRFVMRVNfSFRNTCA9ICchL25vZGVfbW9kdWxlcy8qKi9ub2RlX21vZHVsZXMvKiovKi5odG1sJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEludGVybmFsUGFnZXMoKSB7XG4gIGNvbnN0IHloTW9kdWxlcyA9IGF3YWl0IHJlYWRkaXIocmVzb2x2ZShfX2Rpcm5hbWUsICcuL25vZGVfbW9kdWxlcy9AeWgvJykpO1xuICByZXR1cm4geWhNb2R1bGVzXG4gICAgLmZpbHRlcigobSkgPT4gbS5pbmRleE9mKCdjbGktcGFnZXMnKSA+PSAwKVxuICAgIC5tYXAoKG0pID0+IHtcbiAgICAgIHJldHVybiBgL25vZGVfbW9kdWxlcy9AeWgvJHttfS8qKi8qLmh0bWxgO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NjU4N1x1NEVGNlx1NTQwRFx1NzlGMFxuICogQHJldHVybiB7c3RyaW5nfSBcdTY1ODdcdTRFRjZcdTU0MERcdTc5RjBcbiAqIEBwYXJhbSB7c3RyaW5nfSBodG1sIFx1NEUwMFx1NEUyQWh0bWxcdTY1ODdcdTRFRjZcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEh0bWxOYW1lKGh0bWw6IHN0cmluZyk6IHN0cmluZyB7XG4gIHJldHVybiBodG1sLnN1YnN0cmluZyhodG1sLmxhc3RJbmRleE9mKCcvJykgKyAxLCBodG1sLmxlbmd0aCkuc3BsaXQoJy4nKVswXTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEFsbFBhZ2VzKCkge1xuICAvLyBcdTgzQjdcdTUzRDYvbm9kZV9tb2R1bGVzL0B5aC9jbGktcGFnZXMtKiovKiovKi5odG1sXG4gIGNvbnN0IGludGVybmFsUGFnZXMgPSBhd2FpdCBnZXRJbnRlcm5hbFBhZ2VzKCk7XG4gIC8vIFx1ODNCN1x1NTNENlx1NjUzRVx1NTcyOC9zcmMvcHJvamVjdC9cdTRFMEJcdTc2ODRodG1sXHU2NTg3XHU0RUY2XG4gIGNvbnN0IG1vZHVsZVBhZ2VzID0gbW9kdWxlcy5tYXAoKG0pID0+IGAvc3JjL3Byb2plY3QvKiovJHttfS5odG1sYCk7XG4gIGNvbnN0IGFsbFBhZ2VzQ29uZmlnID0gW10uY29uY2F0KGludGVybmFsUGFnZXMpLmNvbmNhdChtb2R1bGVQYWdlcykuY29uY2F0KGh0bWxQYWdlcyk7XG4gIGFsbFBhZ2VzQ29uZmlnLnB1c2goSUdOT1JFX05PREVfTU9EVUxFU19IVE1MKTtcbiAgLy8gXHU3NTFGXHU2MjEwXHU0RjdGXHU3NTI4Z2xvYlx1Njc2NVx1ODNCN1x1NTNENlx1NzY4NGh0bWxcdTY1ODdcdTRFRjZcbiAgY29uc3QgZ2xvYlBhdHRlcm4gPSBhbGxQYWdlc0NvbmZpZ1xuICAgIC5tYXAoKGh0bWwpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICgnZW50cnknIGluIGh0bWwpIHtcbiAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIHtcbiAgICAgICAgLy8gZG8gbm90aGluZ1xuICAgICAgfVxuICAgICAgLy8gXHU1QzA2XHU5MTREXHU3RjZFXHU3Njg0XHU4REVGXHU1Rjg0XHU1OTA0XHU3NDA2XHU2MjEwXHU3RUREXHU1QkY5XHU4REVGXHU1Rjg0XG4gICAgICBpZiAoaHRtbFswXSA9PT0gJyEnKSB7XG4gICAgICAgIHJldHVybiBgISR7bm9ybWFsaXplUGF0aChwcm9jZXNzLmN3ZCgpKX0ke2h0bWwucmVwbGFjZSgnIScsICcnKX1gO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5vcm1hbGl6ZVBhdGgocHJvY2Vzcy5jd2QoKSArIGh0bWwpO1xuICAgIH0pXG4gICAgLmZpbHRlcigodikgPT4gdiAhPT0gdW5kZWZpbmVkKTtcbiAgY29uc3QgcGFnZXMgPSB7fTtcbiAgLy8gXHU2MjY3XHU4ODRDZ2xvYlx1ODNCN1x1NTNENlx1NjI0MFx1NjcwOVx1OTE0RFx1N0Y2RVx1NzY4NGh0bWxcdTY1ODdcdTRFRjZcbiAgZ2xvYi5zeW5jKGdsb2JQYXR0ZXJuKS5mb3JFYWNoKChnKSA9PiB7XG4gICAgcGFnZXNbZ2V0SHRtbE5hbWUoZy5yZXBsYWNlKG5vcm1hbGl6ZVBhdGgocHJvY2Vzcy5jd2QoKSksICcnKSldID0gZy5yZXBsYWNlKFxuICAgICAgbm9ybWFsaXplUGF0aChwcm9jZXNzLmN3ZCgpKSxcbiAgICAgICcnLFxuICAgICk7XG4gIH0pO1xuICAvLyBcdTVDMDZhbGxQYWdlc0NvbmZpZ1x1NEUyRFx1NzY4NFx1NUJGOVx1OEM2MVx1OEY2Q1x1NjM2Mlx1NEUzQXZpdGUtcGx1Z2luLXZpcnR1YWwtaHRtbFx1NTNFRlx1OEJDNlx1NTIyQlx1NzY4NFx1OTE0RFx1N0Y2RVxuICBhbGxQYWdlc0NvbmZpZy5mb3JFYWNoKChodG1sKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICghKCdlbnRyeScgaW4gaHRtbCkpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH0gY2F0Y2gge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBwYWdlc1todG1sLnBhdGhdID0gaHRtbC5lbnRyeTtcbiAgfSk7XG4gIHJldHVybiBwYWdlcztcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEluamVjdENvZGUoKSB7XG4gIGNvbnN0IGluamVjdFZhcmlhYmxlcyA9IHt9O1xuICBPYmplY3Qua2V5cyhwYWdlU2VydmljZS5tdWx0aXBsZVNlcnZpY2VDb25maWcpLmZvckVhY2goKGspID0+IHtcbiAgICBjb25zdCB2ID0gcGFnZVNlcnZpY2UubXVsdGlwbGVTZXJ2aWNlQ29uZmlnW2tdO1xuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodikgPT09ICdbb2JqZWN0IE9iamVjdF0nKSB7XG4gICAgICBpbmplY3RWYXJpYWJsZXNba10gPSB7XG4gICAgICAgIHBvczogUE9TLmJlZm9yZSxcbiAgICAgICAgZmluZDogJzwvaGVhZD4nLFxuICAgICAgICAuLi4odiBhcyBvYmplY3QpLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5qZWN0VmFyaWFibGVzW2tdID0ge1xuICAgICAgICBwb3M6IFBPUy5iZWZvcmUsXG4gICAgICAgIGZpbmQ6ICc8L2hlYWQ+JyxcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHYsXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBpbmplY3RWYXJpYWJsZXM7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcXFxccmVwbGFjZS1uYW1lXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXFxcXHJlcGxhY2UtbmFtZVxcXFxpbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRGVza3RvcC9wcm9qZWN0L3lpbmhhaS92dWUvdGVzdDUvZGVtby9idWlsZC12aXRlL3NyYy9yZXBsYWNlLW5hbWUvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IE1hZ2ljU3RyaW5nIGZyb20gJ21hZ2ljLXN0cmluZyc7XG5cbmV4cG9ydCBkZWZhdWx0ICgpOiBQbHVnaW4gPT4ge1xuICByZXR1cm4ge1xuICAgIG5hbWU6ICdAeWgvdml0ZS1wbHVnaW4tZ2VuZXJhdGUtc2ZjLW5hbWUnLFxuICAgIGVuZm9yY2U6ICdwb3N0JyxcbiAgICB0cmFuc2Zvcm0oY29kZSwgaWQsIG9wdGlvbnMpIHtcbiAgICAgIC8vIFx1NTNFQVx1NUJGOXZ1ZVx1N0VEM1x1NUMzRVx1NzY4NFx1NjU4N1x1NEVGNlx1NEVFNVx1NTNDQVx1NjU4N1x1NEVGNlx1NTE4NVx1NTMwNVx1NTQyQl9zZmNfbWFpblx1NzY4NFx1NjU4N1x1NEVGNlx1Nzk4MVx1ODg0Q1x1NTkwNFx1NzQwNlxuICAgICAgaWYgKCFpZC5lbmRzV2l0aCgnLnZ1ZScpICYmIGNvZGUuaW5kZXhPZignX3NmY19tYWluJykgPj0gMCkge1xuICAgICAgICAvLyBcdTgzQjdcdTUzRDZcdTY1ODdcdTRFRjZcdTU0MEQ6IFx1ODlDNFx1NTIxOTogaWRcdTc2ODRcdTY3MDBcdTU0MEVcdTRFMDBcdTRFMkEvXHU3Njg0XHU0RjREXHU3RjZFKzFcdTUyMzBpZFx1NzY4NFx1OTU3Rlx1NUVBNi00XHU3Njg0XHU0RjREXHU3RjZFXG4gICAgICAgIGNvbnN0IGZpbGVOYW1lID0gaWQuc3Vic3RyaW5nKGlkLmxhc3RJbmRleE9mKCcvJykgKyAxLCBpZC5sZW5ndGggLSA0KTtcbiAgICAgICAgY29uc3QgbXNjID0gbmV3IE1hZ2ljU3RyaW5nKGNvZGUpO1xuICAgICAgICAvLyBcdTYyN0VcdTUyMzBfc2ZjX3JlbmRlclx1NzY4NFx1NUI5QVx1NEU0OVx1NEY0RFx1N0Y2RVxuICAgICAgICBjb25zdCBzZmNSZW5kZXJJbmRleCA9IC8oY29uc3R8dmFyKSBfc2ZjX3JlbmRlci9nO1xuICAgICAgICBmb3IgKGNvbnN0IG1hdGNoZWQgb2YgY29kZS5tYXRjaEFsbChzZmNSZW5kZXJJbmRleCkpIHtcbiAgICAgICAgICBjb25zdCB7IGluZGV4IH0gPSBtYXRjaGVkO1xuICAgICAgICAgIC8vIFx1NTcyOF9zZmNfcmVuZGVyXHU3Njg0XHU1QjlBXHU0RTQ5XHU1MjREXHU5NzYyXHU2REZCXHU1MkEwXHU0RkVFXHU2NTM5bmFtZVx1NzY4NFx1OEJFRFx1NTNFNVxuICAgICAgICAgIG1zYy5hcHBlbmRMZWZ0KGluZGV4LCBgX3NmY19tYWluLm5hbWU9JyR7ZmlsZU5hbWV9JztcXHJcXG5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgY29kZTogbXNjLnRvU3RyaW5nKCksXG4gICAgICAgICAgc291cmNlbWFwOiBtc2MuZ2VuZXJhdGVNYXAoKSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LFxuICB9O1xufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcRGVza3RvcFxcXFxwcm9qZWN0XFxcXHlpbmhhaVxcXFx2dWVcXFxcdGVzdDVcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHNyY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRGVza3RvcFxcXFxwcm9qZWN0XFxcXHlpbmhhaVxcXFx2dWVcXFxcdGVzdDVcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHNyY1xcXFxjb3B5TW9kdWxlUHVibGljLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL2J1aWxkLXZpdGUvc3JjL2NvcHlNb2R1bGVQdWJsaWMudHNcIjtpbXBvcnQgZ2xvYiBmcm9tICdmYXN0LWdsb2InO1xuXG5leHBvcnQgZnVuY3Rpb24gY29weU1vZHVsZVB1YmxpYygpIHtcbiAgcmV0dXJuIGdsb2JcbiAgICAuc3luYyhbYCR7Z2xvYi5jb252ZXJ0UGF0aFRvUGF0dGVybihwcm9jZXNzLmN3ZCgpKX0vbm9kZV9tb2R1bGVzL0B5aC8qL3B1YmxpYy8qKmBdKVxuICAgIC5tYXAoKGZpbGUpID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZyb206IGZpbGUsXG4gICAgICAgIHRvOiAnJyxcbiAgICAgIH07XG4gICAgfSk7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcaW50ZXJuYWxcXFxccmVwbGFjZS1maWxlc1xcXFxzcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcaW50ZXJuYWxcXFxccmVwbGFjZS1maWxlc1xcXFxzcmNcXFxcaW5kZXgudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0Rlc2t0b3AvcHJvamVjdC95aW5oYWkvdnVlL3Rlc3Q1L2RlbW8vaW50ZXJuYWwvcmVwbGFjZS1maWxlcy9zcmMvaW5kZXgudHNcIjtpbXBvcnQgdHlwZSB7IFBsdWdpbiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgcmVhZEZpbGUgfSBmcm9tICdub2RlOmZzL3Byb21pc2VzJztcblxuZXhwb3J0IGludGVyZmFjZSBGaWxlUmVwbGFjZU9wdGlvbnMge1xuICBmaWxlOiBzdHJpbmc7XG4gIG5ld0ZpbGU6IHN0cmluZztcbn1cbmV4cG9ydCBkZWZhdWx0IChvcHRzOiBBcnJheTxGaWxlUmVwbGFjZU9wdGlvbnM+KTogUGx1Z2luID0+IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnQHloL3ZpdGUtcGx1Z2luLWZpbGUtcmVwbGFjZXInLFxuICAgIGFzeW5jIGxvYWQoaWQsIG9wdGlvbnMpIHtcbiAgICAgIGNvbnN0IGZpbHRlck9wdCA9IG9wdHMuZmlsdGVyKChvcHQpID0+IHtcbiAgICAgICAgcmV0dXJuIGlkLmluZGV4T2Yob3B0LmZpbGUpID49IDA7XG4gICAgICB9KTtcbiAgICAgIGlmIChmaWx0ZXJPcHQubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgICBjb25zdCB7IG5ld0ZpbGUgfSA9IGZpbHRlck9wdFswXTtcbiAgICAgIHJldHVybiAoYXdhaXQgcmVhZEZpbGUobmV3RmlsZSkpLnRvU3RyaW5nKCk7XG4gICAgfSxcbiAgfTtcbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcXFxccGx1Z2luLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL2J1aWxkLXZpdGUvc3JjL3BsdWdpbi50c1wiO2ltcG9ydCAqIGFzIHBhdGggZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCAqIGFzIGZzIGZyb20gJ25vZGU6ZnMnO1xuaW1wb3J0IHt2aXRlQ29tbW9uanN9IGZyb20gJ0B5aC92aXRlLXBsdWdpbi1jb21tb25qcyc7XG5pbXBvcnQgVmlydHVhbEh0bWwsIHtoaXN0b3J5QXBpRmFsbGJhY2tQbHVnaW59IGZyb20gJ3ZpdGUtcGx1Z2luLXZpcnR1YWwtaHRtbCc7XG5pbXBvcnQgdnVlIGZyb20gJ0B2aXRlanMvcGx1Z2luLXZ1ZTInO1xuaW1wb3J0IGpzeCBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUyLWpzeCc7XG5pbXBvcnQgSW5zcGVjdCBmcm9tICd2aXRlLXBsdWdpbi1pbnNwZWN0JztcbmltcG9ydCB7dmlzdWFsaXplcn0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJztcbmltcG9ydCB7dml0ZVN0YXRpY0NvcHl9IGZyb20gJ3ZpdGUtcGx1Z2luLXN0YXRpYy1jb3B5JztcbmltcG9ydCBsZWdhY3kgZnJvbSAnQHZpdGVqcy9wbHVnaW4tbGVnYWN5JztcbmltcG9ydCB2aXJ0dWFsTW9kdWxlIGZyb20gJ3ZpdGUtcGx1Z2luLXZpcnR1YWwtbW9kdWxlcyc7XG5pbXBvcnQgdml0ZUNvbW1vbkNvbmZpZyBmcm9tICcuLi8uLi92aXRlQ29tbW9uQ29uZmlnJztcbmltcG9ydCB0aGVtZVByZXByb2Nlc3NvclBsdWdpbiBmcm9tICdAem91Z3Qvdml0ZS1wbHVnaW4tdGhlbWUtcHJlcHJvY2Vzc29yJztcbmltcG9ydCB7dWlWaXRlfSBmcm9tICdAeWgvdml0ZS1wbHVnaW4tY2xpLWltcG9ydGVyJztcbmltcG9ydCB1bnBsdWdpbiBmcm9tICd1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlJztcbmltcG9ydCBjbGlDb21wb25lbnRzT3ZlcnJpZGUgZnJvbSAnLi91bnBsdWdpbi1yZXNvbHZlci9jbGktY29tcG9uZW50cy5vdmVycmlkZSc7XG5pbXBvcnQge2dldEVudiwgaXNFbnZUcnVlfSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCBTdHJpbmdSZXBsYWNlIGZyb20gJ3ZpdGUtcGx1Z2luLXN0cmluZy1yZXBsYWNlJztcbmltcG9ydCB7Z2V0QWxsUGFnZXMsIGdldEluamVjdENvZGV9IGZyb20gJy4uL21wYS9wYWdlcy5qcyc7XG5pbXBvcnQgUmVwbGFjZU5hbWUgZnJvbSAnLi9yZXBsYWNlLW5hbWUnO1xuaW1wb3J0IHtjb3B5TW9kdWxlUHVibGljfSBmcm9tICcuL2NvcHlNb2R1bGVQdWJsaWMnO1xuaW1wb3J0IEZpbGVSZXBsYWNlIGZyb20gJy4uLy4uL2ludGVybmFsL3JlcGxhY2UtZmlsZXMvc3JjJztcblxuY29uc3QgZnNwID0gZnMucHJvbWlzZXM7XG5cbmNvbnN0IFBSSU1BUllfQ09MT1JfUkVHRVggPSAvQHByaW1hcnktY29sb3I6ICguKik7L2c7XG5cbmNvbnN0IERFTUFORF9VSV9JTVBPUlRfQkxBQ0tfTElTVCA9IFsnY29udGFpbmVyLW1hc2snLCAnbWVzc2FnZScsICdtb2RhbCcsICdub3RpZmljYXRpb24nXTtcbmNvbnN0IElHTk9SRV9WVUVfVVNFID0gWydkcml2ZXInXTtcblxuZnVuY3Rpb24gcmVzb2x2ZVByZXNldFRoZW1lUGF0aChmaWxlPzogc3RyaW5nKSB7XG4gIHJldHVybiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4vLi4vaW50ZXJuYWwvdGhlbWUvcHJlc2V0LXRoZW1lJywgZmlsZSA/PyAnJyk7XG59XG5cbi8qKlxuICogXHU4QkZCXHU1M0Q2XHU5ODg0XHU4QkJFXHU0RTNCXHU5ODk4KC9zcmMvY29tbW9uL2R5bmFtaWNUaGVtZS9wcmVzZXQtdGhlbWUpXHU3NkVFXHU1RjU1XHU0RTBCXHU3Njg0bGVzc1x1NjU4N1x1NEVGNlxuICogXHU4RkQ0XHU1NkRFOlxuICogICBtdWx0aXBsZVNjb3BlVmFyczogXHU3RUQ5XHU2MzYyXHU4MEE0XHU2M0QyXHU0RUY2XHU3NTI4XHU3Njg0XHU2NTcwXHU3RUM0LFx1NUI1OFx1NTBBOFx1NEU4Nmxlc3NcdTY1ODdcdTRFRjZcdTRFMkRcdTc2ODRcdTY4MzdcdTVGMEZcdTUzRDhcdTkxQ0ZcbiAqICAgdmlydHVhbFRoZW1lczogXHU3RUQ5XHU5ODc1XHU5NzYyXHU2NjNFXHU3OTNBXHU0RjdGXHU3NTI4XHU3Njg0XHU1QkY5XHU4QzYxLFx1NUI1OFx1NTBBOFx1NEU4Nlx1NEUzQlx1OTg5OFx1NTQwRFx1NEUwRXByaW1hcnktY29sb3JcdTc2ODRcdTVCRjlcdTVFOTRcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcmVhZFByZXNldFRoZW1lUHJpbWFyeUNvbG9yKCkge1xuICBjb25zdCB7aW5jbHVkZVN0eWxlc30gPSB2aXRlQ29tbW9uQ29uZmlnO1xuICBjb25zdCBwcmVzZXRUaGVtZXMgPSBhd2FpdCBmc3AucmVhZGRpcihyZXNvbHZlUHJlc2V0VGhlbWVQYXRoKCkpO1xuICBjb25zdCBtdWx0aXBsZVNjb3BlVmFyczogQXJyYXk8e1xuICAgIHNjb3BlTmFtZTogc3RyaW5nO1xuICAgIHZhcnNDb250ZW50Pzogc3RyaW5nO1xuICAgIHBhdGg/OiBzdHJpbmc7XG4gICAgaW5jbHVkZVN0eWxlcz86IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+O1xuICB9PiA9IFtdO1xuICBjb25zdCB2aXJ0dWFsVGhlbWVzID0ge307XG4gIGZvciAoY29uc3QgdGhlbWUgb2YgcHJlc2V0VGhlbWVzKSB7XG4gICAgLy8gXHU1M0VBXHU1OTA0XHU3NDA2bGVzc1x1NTQwRVx1N0YwMFx1NzY4NFx1NjU4N1x1NEVGNlxuICAgIGlmICh0aGVtZS5lbmRzV2l0aCgnLmxlc3MnKSkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWF3YWl0LWluLWxvb3BcbiAgICAgIGNvbnN0IGxlc3NDb2RlID0gKGF3YWl0IGZzcC5yZWFkRmlsZShyZXNvbHZlUHJlc2V0VGhlbWVQYXRoKHRoZW1lKSkpLnRvU3RyaW5nKCk7XG4gICAgICBjb25zdCBtYXRjaCA9IGxlc3NDb2RlLm1hdGNoQWxsKFBSSU1BUllfQ09MT1JfUkVHRVgpO1xuICAgICAgY29uc3QgcHJpbWFyeUNvbG9yID0gbWF0Y2gubmV4dCgpLnZhbHVlWzFdO1xuICAgICAgbXVsdGlwbGVTY29wZVZhcnMucHVzaCh7XG4gICAgICAgIHNjb3BlTmFtZTogYHRoZW1lLSR7dGhlbWUucmVwbGFjZSgnLmxlc3MnLCAnJyl9YCxcbiAgICAgICAgcGF0aDogcmVzb2x2ZVByZXNldFRoZW1lUGF0aCh0aGVtZSksXG4gICAgICAgIGluY2x1ZGVTdHlsZXMsXG4gICAgICB9KTtcbiAgICAgIHZpcnR1YWxUaGVtZXNbdGhlbWUucmVwbGFjZSgnLmxlc3MnLCAnJyldID0ge1xuICAgICAgICAncHJpbWFyeS1jb2xvcic6IHByaW1hcnlDb2xvcixcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBtdWx0aXBsZVNjb3BlVmFycyxcbiAgICB2aXJ0dWFsVGhlbWVzLFxuICB9O1xufVxuXG4vKipcbiAqIFx1NTdGQVx1Nzg0MFx1NjNEMlx1NEVGNlxuICogQHBhcmFtIF9tb2RlXG4gKiBAcGFyYW0gaWdub3JlSHRtbFBsdWdpblxuICovXG5hc3luYyBmdW5jdGlvbiBiYXNlUGx1Z2lucyhfbW9kZTogc3RyaW5nLCBpZ25vcmVIdG1sUGx1Z2luOiBib29sZWFuID0gZmFsc2UpIHtcbiAgY29uc3Qge2NvcHlSZXNvdXJjZXMsIGh0bWwsIGNsaX0gPSB2aXRlQ29tbW9uQ29uZmlnO1xuICBjb25zdCB0YXJnZXRzID0gWy4uLmNvcHlSZXNvdXJjZXMsIC4uLmNvcHlNb2R1bGVQdWJsaWMoKV0ubWFwKChyZXNvdXJjZSkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBzcmM6IHJlc291cmNlLmZyb20sXG4gICAgICBkZXN0OiByZXNvdXJjZS50byxcbiAgICB9O1xuICB9KTtcbiAgY29uc3Qge2hpc3RvcnlQYWdlfSA9IGNsaTtcbiAgY29uc3QgaGlzdG9yeVBhZ2VJbmplY3RJbnRvRmFjZUNvbmZpZyA9IGhpc3RvcnlQYWdlLm1hcCgoaHApID0+IHtcbiAgICByZXR1cm4gYCR7aHB9Lmh0bWxgO1xuICB9KTtcblxuICBjb25zdCB7bXVsdGlwbGVTY29wZVZhcnMsIHZpcnR1YWxUaGVtZXN9ID0gYXdhaXQgcmVhZFByZXNldFRoZW1lUHJpbWFyeUNvbG9yKCk7XG4gIGNvbnN0IHVzZUxlc3NGaWxlID0gZ2V0RW52KCdWSVRFX1BFUkZfTE9BRF9MRVNTJyk7XG4gIGNvbnN0IHVzZVNpbmdsZUNzcyA9IHVzZUxlc3NGaWxlID09PSAnc2luZ2xlJztcbiAgY29uc3QgdXNlT2xkTW9kdWxlcyA9IGlzRW52VHJ1ZSgnVVNFX09MRF9NT0RVTEVTX1NVUFBPUlQnKTtcbiAgY29uc3QgdXNlRGVtYW5kSW1wb3J0ID0gaXNFbnZUcnVlKCdCVUlMRF9ERU1BTkRfVUlfSU1QT1JUJyk7XG4gIGNvbnN0IHBsdWdpbnMgPSBbXTtcbiAgaWYgKCFpZ25vcmVIdG1sUGx1Z2luKSB7XG4gICAgY29uc3QgcGFnZXMgPSBhd2FpdCBnZXRBbGxQYWdlcygpO1xuICAgIGNvbnN0IGluamVjdFZhcmlhYmxlcyA9IGF3YWl0IGdldEluamVjdENvZGUoKTtcbiAgICBwbHVnaW5zLnB1c2goXG4gICAgICAvLyBcdTgxRUFcdTUyQThcdThCQzZcdTUyMkJcdTk4NzlcdTc2RUVcdTRFMEJcdTc2ODRcdTYyNDBcdTY3MDlodG1sXHU2NTg3XHU0RUY2LFx1NUU3Nlx1NEUxNFx1NjM5Mlx1OTY2NFx1OTBFOFx1NTIwNlx1NEUwRFx1OTcwMFx1ODk4MVx1NzY4NFx1NjU4N1x1NEVGNlxuICAgICAgVmlydHVhbEh0bWwoe1xuICAgICAgICBwYWdlcyxcbiAgICAgICAgaW5qZWN0Q29kZTogaW5qZWN0VmFyaWFibGVzLFxuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIHBsdWdpbnMucHVzaChcbiAgICAuLi5bXG4gICAgICB2dWUoe30pLFxuICAgICAganN4KHtcbiAgICAgICAgY29tcG9zaXRpb25BUEk6IGZhbHNlLFxuICAgICAgfSksXG4gICAgICB1bnBsdWdpbih7XG4gICAgICAgIHJlc29sdmVyczogW2NsaUNvbXBvbmVudHNPdmVycmlkZSgpXSxcbiAgICAgICAgdmVyc2lvbjogMi43LFxuICAgICAgICBkdHM6IGZhbHNlLFxuICAgICAgICBpbmNsdWRlOiBbL1xcLnZ1ZS8sIC9cXC52dWVcXD92dWUvLCAvXFwubWQvLCAvXFwuKFt0al0pc3g/LywgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dQHloW1xcXFwvXS9dLFxuICAgICAgICBleGNsdWRlOiBbL1tcXFxcL11cXC5naXRbXFxcXC9dLywgL1tcXFxcL11ub2RlX21vZHVsZXNbXFxcXC9dXFwudml0ZVtcXFxcL10vXSxcbiAgICAgIH0pLFxuICAgICAgdWlWaXRlKHtcbiAgICAgICAgdHJhbnNmb3JtKG1vZHVsZU5hbWUsIGNhbWVsQ2FzZSkge1xuICAgICAgICAgIGxldCB1aU5hbWUgPSAnQHloL3RhNDA0LXVpJztcbiAgICAgICAgICBsZXQgdWlTdHlsZVBvc3RmaXggPSAnLmxlc3MnO1xuICAgICAgICAgIGxldCBtb2R1bGVzID0gYGltcG9ydCB7JHttb2R1bGVOYW1lfX0gZnJvbSBcIkB5aC90YTQwNC11aVwiO2A7XG4gICAgICAgICAgaWYgKHVzZU9sZE1vZHVsZXMpIHtcbiAgICAgICAgICAgIG1vZHVsZXMgPSBgaW1wb3J0ICR7bW9kdWxlTmFtZX0gZnJvbSBcIkB5aC90YTQwNC11aS9lcy8ke2NhbWVsQ2FzZX1cIjtgO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICh1c2VMZXNzRmlsZSA9PT0gJ2ZhbHNlJykge1xuICAgICAgICAgICAgdWlOYW1lID0gJ0B5aC9jbGktaW50ZXJuYWwtcHJlY29tcGlsZWQtbGVzcyc7XG4gICAgICAgICAgICB1aVN0eWxlUG9zdGZpeCA9ICcuY3NzJztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgc3R5bGVJbXBvcnRlciA9ICcnO1xuXG4gICAgICAgICAgaWYgKHVzZVNpbmdsZUNzcykge1xuICAgICAgICAgICAgc3R5bGVJbXBvcnRlciA9ICdpbXBvcnQgXCJAeWgvY2xpLWludGVybmFsLXByZWNvbXBpbGVkLWxlc3MvY3NzL3VpLmNzc1wiOyc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHN0eWxlSW1wb3J0ZXIgPSBgaW1wb3J0IFwiJHt1aU5hbWV9L2VzLyR7Y2FtZWxDYXNlfS9zdHlsZS9pbmRleCR7dWlTdHlsZVBvc3RmaXh9XCI7YDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBsZXQgcmVzdWx0ID0gJyc7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdXNlRGVtYW5kSW1wb3J0ICYmXG4gICAgICAgICAgICBbLi4uREVNQU5EX1VJX0lNUE9SVF9CTEFDS19MSVNULCAuLi5JR05PUkVfVlVFX1VTRV0uaW5kZXhPZihjYW1lbENhc2UpIDwgMFxuICAgICAgICAgICkge1xuICAgICAgICAgICAgcmVzdWx0ID0gYFxuICAgICAgICAgIGNvbnN0ICR7bW9kdWxlTmFtZX0gPSBhd2FpdCBpbXBvcnQoJ0B5aC90YTQwNC11aS9lcy8ke2NhbWVsQ2FzZX0nKTtcbiAgICAgICAgICBWdWUudXNlKCR7bW9kdWxlTmFtZX0uZGVmYXVsdCk7XG4gICAgICAgICAgICAgICAgJHtzdHlsZUltcG9ydGVyfVxuICAgICAgICAgICAgICAgIGA7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGBcbiAgICAgICAgICAgICAgJHttb2R1bGVzfVxuICAgICAgICAgICAgICAke3N0eWxlSW1wb3J0ZXJ9XG4gICAgICAgICAgICAgIGA7XG4gICAgICAgICAgICBpZiAoSUdOT1JFX1ZVRV9VU0UuaW5kZXhPZihjYW1lbENhc2UpIDwgMCkge1xuICAgICAgICAgICAgICByZXN1bHQgKz0gYFxuICAgICAgICAgICAgVnVlLnVzZSgke21vZHVsZU5hbWV9KTtcbiAgICAgICAgICAgIGA7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH0sXG4gICAgICB9KSxcbiAgICAgIC8vIFx1NTkwRFx1NTIzNlx1OTc1OVx1NjAwMVx1NjU4N1x1NEVGNlxuICAgICAgdml0ZVN0YXRpY0NvcHkoe1xuICAgICAgICB0YXJnZXRzLFxuICAgICAgfSksXG4gICAgICB2aXJ0dWFsTW9kdWxlKHtcbiAgICAgICAgbW9kdWxlczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIFx1NTJBOFx1NjAwMVx1NjM2Mlx1ODBBNFx1OTE0RFx1N0Y2RVxuICAgICAgICAgICAgbW9kdWxlTmFtZTogJ2R5bmFtaWNUaGVtZScsXG4gICAgICAgICAgICBtb2R1bGVWYWx1ZTogXCJpbXBvcnQgeyBpbml0VGhlbWUsIH0gZnJvbSAnQHloL2NsaS1pbnRlcm5hbC1keW5hbWljLXRoZW1lJztpbml0VGhlbWUoKTtcIixcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1vZHVsZU5hbWU6ICd0aGVtZURlZmluaXRpb25zJyxcbiAgICAgICAgICAgIG1vZHVsZVZhbHVlOiBgZXhwb3J0IGRlZmF1bHQgJHtKU09OLnN0cmluZ2lmeSh2aXJ0dWFsVGhlbWVzKX07YCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIGkxOG5cdTkxNERcdTdGNkVcbiAgICAgICAgICAgIG1vZHVsZU5hbWU6ICdkeW5hbWljSTE4bicsXG4gICAgICAgICAgICBtb2R1bGVWYWx1ZTogYFxuICAgICAgICAgIGltcG9ydCB7IG1ha2VJMThuLCB9IGZyb20gJ0B5aC9jbGktaW50ZXJuYWwtcHJlY29tcGlsZWQtbG9jYWxlcyc7XG4gICAgICAgICAgZXhwb3J0IHtcbiAgICAgICAgICAgIG1ha2VJMThuLFxuICAgICAgICAgIH1cbiAgICAgICAgICBgLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbW9kdWxlTmFtZTogJ2hpc3RvcnlQYWdlJyxcbiAgICAgICAgICAgIG1vZHVsZVZhbHVlOiBgXG4gICAgICAgICAgY29uc3QgaGlzdG9yeVBhZ2UgPSAke0pTT04uc3RyaW5naWZ5KGhpc3RvcnlQYWdlSW5qZWN0SW50b0ZhY2VDb25maWcpfTtcbiAgICAgICAgICBleHBvcnQgZGVmYXVsdCBoaXN0b3J5UGFnZTtcbiAgICAgICAgICBgLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgbW9kdWxlTmFtZTogJ2RhcmtNb2RlJyxcbiAgICAgICAgICAgIG1vZHVsZVZhbHVlOiBgXG4gICAgICAgICAgaW1wb3J0IHsgdXBkYXRlQ29sb3JXZWFrLCB9IGZyb20gJ0B5aC9jbGktaW50ZXJuYWwtZHluYW1pYy10aGVtZSc7XG4gICAgICAgICAgaW1wb3J0IHsgY3JlYXRlV2ViU3RvcmFnZSwgfSBmcm9tICdAeWgvdGEtdXRpbHMnO1xuXG4gICAgICAgICAgaWYoaW1wb3J0Lm1ldGEuZW52LlZJVEVfRU5BQkxFX0RBUktfTU9ERS50b1VwcGVyQ2FzZSgpID09PSAnVFJVRScpe1xuICAgICAgICAgICAgaW1wb3J0KCcvaW50ZXJuYWwvdGhlbWUvZGFyay9kYXJrLW1vZGUubGVzcycpO1xuICAgICAgICAgICAgY29uc3QgZGFya01vZGVTdG9yYWdlID0gY3JlYXRlV2ViU3RvcmFnZShpbXBvcnQubWV0YS5lbnYuVklURV9USEVNRV9TVE9SQUdFX0tFWSwgeyBpc0xvY2FsOiB0cnVlLCB9KTtcbiAgICAgICAgICAgIGNvbnN0IHN2ID0gZGFya01vZGVTdG9yYWdlLmdldCgnZGFya19tb2RlJyk7XG4gICAgICAgICAgICB1cGRhdGVDb2xvcldlYWsoc3YgPT09IG51bGwgPyBpbXBvcnQubWV0YS5lbnYuVklURV9EQVJLX01PREUudG9VcHBlckNhc2UoKSA9PT0gJ1RSVUUnIDogISFzdik7XG4gICAgICAgICAgfVxuICAgICAgICAgIGAsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBcdTkwMDJcdTgwMDFcdTUzMTZcdTZBMjFcdTU3NTdcbiAgICAgICAgICAgIG1vZHVsZU5hbWU6ICdlbGRlcmx5JyxcbiAgICAgICAgICAgIG1vZHVsZVZhbHVlOiBgXG4gICAgICAgICAgICAgaW1wb3J0IHsgdXNlRXZlbnRCdXMsIH0gZnJvbSAnQHZ1ZXVzZS9jb3JlJztcbiAgICAgICAgICAgICBpbXBvcnQgVnVlIGZyb20gJ3Z1ZSc7XG4gICAgICAgICAgICAgaW1wb3J0IHsgY3JlYXRlV2ViU3RvcmFnZSwgfSBmcm9tICdAeWgvdGEtdXRpbHMnO1xuICAgICAgICAgICAgIGNvbnN0IGVsZGVybHlFdmVudEJ1cyA9IHVzZUV2ZW50QnVzKCdlbGRlcmx5Jyk7XG4gICAgICAgICAgICAgLy8gXHU1MjFEXHU1OUNCXHU1MzE2c2l6ZVxuICAgICAgICAgICAgICBWdWUucHJvdG90eXBlLiRFTEVNRU5UID0ge1xuICAgICAgICAgICAgICAgIHNpemU6ICdkZWZhdWx0JyxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBWdWUub2JzZXJ2YWJsZShWdWUucHJvdG90eXBlLiRFTEVNRU5UKVxuICAgICAgICAgICAgICBlbGRlcmx5RXZlbnRCdXMub24oKGUpID0+IHtcbiAgICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKFZ1ZS5wcm90b3R5cGUuJEVMRU1FTlQsIHt9LCBlKTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgY29uc3QgZWxkZXJseUNvbmZpZyA9IHtcbiAgICAgICAgICAgICAgICAvLyBcdTk4NzZcdTkwRThcdTU5MzRcdTc2ODRcdTlBRDhcdTVFQTZcbiAgICAgICAgICAgICAgICBoZWFkZXJIZWlnaHQ6ICc5MHB4JyxcbiAgICAgICAgICAgICAgICAvLyB0YWJzIFx1NzY4NFx1OUFEOFx1NUVBNlxuICAgICAgICAgICAgICAgIHRhYkhlaWdodDogJzY4eCcsXG4gICAgICAgICAgICAgICAgLy8gXHU1REU2XHU0RkE3XHU4M0RDXHU1MzU1XHU3Njg0XHU1QkJEXHU1RUE2XG4gICAgICAgICAgICAgICAgbGVmdFdpZHRoOiAnMzU4cHgnLFxuICAgICAgICAgICAgICAgIC8vIGxvZ29cdTY4NDZcdTc2ODRcdTVCQkRcdTVFQTZcdUZGMDhcdTgzRENcdTUzNTVcdTRFM0F0b3BcdTY1RjZcdTY3MDlcdTY1NDhcdUZGMENcdTUxNzZcdTRGNTlsb2dvXHU2ODQ2XHU1QkJEXHU1RUE2XHU3QjQ5XHU0RThFXHU1REU2XHU0RkE3XHU4M0RDXHU1MzU1XHU1QkJEXHU1RUE2XHVGRjA5XG4gICAgICAgICAgICAgICAgbG9nb1dpZHRoOiAnMzU4cHgnLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGNvbnN0IGluZGV4RWxkZXJseUNvbmZpZ0NoYW5nZT0oaW5kZXhfcGFnZSk9PntcbiAgICAgICAgICAgICAgICAgIGNvbnN0IHRoZW1lU3RvcmFnZSA9IGNyZWF0ZVdlYlN0b3JhZ2UoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVEhFTUVfU1RPUkFHRV9LRVksIHsgaXNMb2NhbDogdHJ1ZSwgfSlcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGluZGV4VGhlbWUgPSB0aGVtZVN0b3JhZ2UuZ2V0KGltcG9ydC5tZXRhLmVudi5WSVRFX1RIRU1FX1NUT1JBR0VfS0VZKVxuICAgICAgICAgICAgICAgICAgaWYoaW5kZXhUaGVtZT09PSdlbGRlcmx5LW9yaWVudGVkJyl7XG4gICAgICAgICAgICAgICAgICAgIGluZGV4X3BhZ2UuJHN0b3JlLmRpc3BhdGNoKCdzZXRTdGF0ZVZhbHVlJywgZWxkZXJseUNvbmZpZylcbiAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgaW5kZXhfcGFnZS4kc3RvcmUuZGlzcGF0Y2goJ3NldFN0YXRlVmFsdWUnLGZhY2VDb25maWcuaW5kZXhQYWdlQ29uZmlnKVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGV4cG9ydCB7XG4gICAgICAgICAgICAgICAgZWxkZXJseUNvbmZpZyxcbiAgICAgICAgICAgICAgICBlbGRlcmx5RXZlbnRCdXMsXG4gICAgICAgICAgICAgICAgaW5kZXhFbGRlcmx5Q29uZmlnQ2hhbmdlLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgYCxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfSksXG4gICAgXSxcbiAgKTtcblxuICBsZXQgcm1zdiA9IG11bHRpcGxlU2NvcGVWYXJzO1xuICBjb25zdCBwcmVzZXRUaGVtZSA9IGB0aGVtZS0ke2dldEVudignVklURV9QUkVTRVRfVEhFTUUnKX1gO1xuICBpZiAoIWlzRW52VHJ1ZSgnVklURV9PTkxJTkVfVEhFTUVfRU5BQkxFRCcpKSB7XG4gICAgcm1zdiA9IHJtc3YuZmlsdGVyKChpdCkgPT4ge1xuICAgICAgcmV0dXJuIGl0LnNjb3BlTmFtZSA9PT0gcHJlc2V0VGhlbWU7XG4gICAgfSk7XG4gIH1cbiAgcGx1Z2lucy5wdXNoKFxuICAgIHRoZW1lUHJlcHJvY2Vzc29yUGx1Z2luLmRlZmF1bHQoe1xuICAgICAgbGVzczoge1xuICAgICAgICAvLyBcdTYzRDBcdTRGOUJcdTU5MUFcdTdFQzRcdTUzRDhcdTkxQ0ZcdTY1ODdcdTRFRjZcbiAgICAgICAgbXVsdGlwbGVTY29wZVZhcnM6IHJtc3YsXG4gICAgICAgIC8vIGNzc1x1NEUyRFx1NEUwRFx1NjYyRlx1NzUzMVx1NEUzQlx1OTg5OFx1ODI3Mlx1NTNEOFx1OTFDRlx1NzUxRlx1NjIxMFx1NzY4NFx1OTg5Q1x1ODI3Mlx1RkYwQ1x1NEU1Rlx1OEJBOVx1NUI4M1x1NjJCRFx1NTNENlx1NTIzMFx1NEUzQlx1OTg5OGNzc1x1NTE4NVx1RkYwQ1x1NTNFRlx1NEVFNVx1NjNEMFx1OUFEOFx1Njc0M1x1OTFDRFxuICAgICAgICBpbmNsdWRlU3R5bGVXaXRoQ29sb3JzOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gY29sb3I6ICcjZmZmZmZmJyxcbiAgICAgICAgICAgIC8vIFx1NkI2NFx1N0M3Qlx1OTg5Q1x1ODI3Mlx1NzY4NFx1NjYyRlx1NTQyNlx1OERERlx1OTY4Rlx1NEUzQlx1OTg5OFx1ODI3Mlx1NjhBRlx1NUVBNlx1NTNEOFx1NTMxNlx1RkYwQ1x1OUVEOFx1OEJBNGZhbHNlXG4gICAgICAgICAgICAvLyBpbkdyYWRpZW50OiB0cnVlLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIC8vIFx1OUVEOFx1OEJBNFx1NTNENiBtdWx0aXBsZVNjb3BlVmFyc1swXS5zY29wZU5hbWVcbiAgICAgICAgZGVmYXVsdFNjb3BlTmFtZTogcHJlc2V0VGhlbWUsXG4gICAgICAgIC8vIFx1NTcyOFx1NzUxRlx1NEVBN1x1NkEyMVx1NUYwRlx1NjYyRlx1NTQyNlx1NjJCRFx1NTNENlx1NzJFQ1x1N0FDQlx1NzY4NFx1NEUzQlx1OTg5OGNzc1x1NjU4N1x1NEVGNlx1RkYwQ2V4dHJhY3RcdTRFM0F0cnVlXHU0RUU1XHU0RTBCXHU1QzVFXHU2MDI3XHU2NzA5XHU2NTQ4XG4gICAgICAgIGV4dHJhY3Q6IGZhbHNlLFxuICAgICAgfSxcbiAgICB9KSxcbiAgKTtcbiAgcGx1Z2lucy5wdXNoKEZpbGVSZXBsYWNlKHZpdGVDb21tb25Db25maWcuY2xpLmZpbGVzKSk7XG4gIHJldHVybiBwbHVnaW5zO1xufVxuXG4vKipcbiAqIFx1NUYwMFx1NTNEMVx1NjVGNlx1NzY4NFx1NjNEMlx1NEVGNlxuICovXG5mdW5jdGlvbiBkZXZQbHVnaW5zKF9tb2RlOiBzdHJpbmcpIHtcbiAgY29uc3Qge2hpc3RvcnlQYWdlfSA9IHZpdGVDb21tb25Db25maWcuY2xpO1xuICBjb25zdCByZXdyaXRlcyA9IGhpc3RvcnlQYWdlLm1hcCgoaHApID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgZnJvbTogbmV3IFJlZ0V4cChgJHtocH0vLipgKSxcbiAgICAgIHRvOiBgJHtnZXRFbnYoJ1ZJVEVfUFVCTElDX1BBVEgnKX0ke2hwfS5odG1sYCxcbiAgICB9O1xuICB9KTtcbiAgcmV0dXJuIFtcbiAgICB2aXRlQ29tbW9uanMoe1xuICAgICAgaW5jbHVkZTogKHZpdGVDb21tb25Db25maWcuY29tbW9uanMuaW5jbHVkZSBhcyBBcnJheTxzdHJpbmc+KS5tYXAoKGspID0+XG4gICAgICAgIGsucmVwbGFjZUFsbCgnKionLCAnJyksXG4gICAgICApLFxuICAgICAgZXhjbHVkZTogWydjb3JlLWpzJywgJ0BpdGstd2FzbS9kaWNvbScsICdpdGstd2FzbScsICdpdGsnXSxcbiAgICB9KSxcbiAgICAvLyBcdTY3RTVcdTc3MEJ2aXRlXHU1NDA0XHU0RTJBXHU2M0QyXHU0RUY2XHU1QkY5XHU0RThFXHU2QkNGXHU0RTJBXHU2NTg3XHU0RUY2XHU2NjJGXHU1OTgyXHU0RjU1XHU1MkEwXHU4RjdEL1x1NTkwNFx1NzQwNixcdTVCRjlcdTRFOEVcdThDMDNcdThCRDVcdTRFRTNcdTc4MDFcdTY3MDlcdTRFMDBcdTVCOUFcdTc2ODRcdTRGNUNcdTc1MjhcbiAgICBJbnNwZWN0KCksXG4gICAgLy8gXHU5ODc1XHU5NzYyXHU0RkVFXHU2NTM5XHU0RTNBaGlzdG9yeVx1NkEyMVx1NUYwRlxuICAgIGhpc3RvcnlBcGlGYWxsYmFja1BsdWdpbih7XG4gICAgICByZXdyaXRlcyxcbiAgICB9KSxcbiAgXTtcbn1cblxuLyoqXG4gKiBcdTdGMTZcdThCRDFcdTc1MUZcdTRFQTdcdTRFRTNcdTc4MDFcdTY1RjZcdTc2ODRcdTYzRDJcdTRFRjZcbiAqIEBwYXJhbSBfbW9kZVxuICovXG5hc3luYyBmdW5jdGlvbiBwcm9kUGx1Z2lucyhfbW9kZTogc3RyaW5nKSB7XG4gIGNvbnN0IHJlc3VsdCA9IFtdO1xuICBpZiAoaXNFbnZUcnVlKCdCVUlMRF9SRVBPUlQnKSkge1xuICAgIC8vIFx1N0YxNlx1OEJEMVx1NzUxRlx1NEVBN1x1NEVFM1x1NzgwMVx1NjVGNixcdTVCRjlcdTRFOEVcdTU0MDRcdTRFMkFjaHVua3NcdTY1ODdcdTRFRjZcdTUzMDVcdTU0MkJcdTUxODVcdTVCQjlcdThGREJcdTg4NENcdTUzRUZcdTg5QzZcdTUzMTZcdTc2ODRcdTY3RTVcdTc3MEIsXHU1RTc2XHU2M0QwXHU0RjlCXHU2MkM2XHU1MjA2XHU0RUUzXHU3ODAxXHU3Njg0XHU0RjlEXHU2MzZFXG4gICAgcmVzdWx0LnB1c2goXG4gICAgICB2aXN1YWxpemVyKHtcbiAgICAgICAgZmlsZW5hbWU6IGAke2dldEVudignT1VUUFVUX0RJUicpfS9yZXBvcnQuaHRtbGAsXG4gICAgICAgIGd6aXBTaXplOiB0cnVlLFxuICAgICAgfSksXG4gICAgKTtcbiAgfVxuICByZXN1bHQucHVzaChcbiAgICBTdHJpbmdSZXBsYWNlKFtcbiAgICAgIHtcbiAgICAgICAgZmlsZU5hbWU6ICdqcXVlcnkuanMnLFxuICAgICAgICBzZWFyY2g6ICd2Mi4yLjEnLFxuICAgICAgICByZXBsYWNlOiAnJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGZpbGVOYW1lOiAndnVlLWdyaWQtbGF5b3V0LmNvbW1vbi5qcycsXG4gICAgICAgIHNlYXJjaDogJ25ldyBleHRlcm5hbF9jb21tb25qc192dWVfY29tbW9uanMyX3Z1ZV9yb290X1Z1ZV9kZWZhdWx0LmEnLFxuICAgICAgICByZXBsYWNlOiAnbmV3IGV4dGVybmFsX2NvbW1vbmpzX3Z1ZV9jb21tb25qczJfdnVlX3Jvb3RfVnVlX2RlZmF1bHQuYS5kZWZhdWx0JyxcbiAgICAgIH0sXG4gICAgXSksXG4gICk7XG4gIGlmIChpc0VudlRydWUoJ0JVSUxEX0lOSkVDVF9NT0RFUk5fUE9MWUZJTExTJykpIHtcbiAgICByZXN1bHQucHVzaChcbiAgICAgIGxlZ2FjeSh7XG4gICAgICAgIG1vZGVyblBvbHlmaWxsczogYXdhaXQgaW1wb3J0KCdjb3JlLWpzLWNvbXBhdCcpLnRoZW4oKGQpID0+IHtcbiAgICAgICAgICByZXR1cm4gZC5kZWZhdWx0KHZpdGVDb21tb25Db25maWcuYnVpbGQucG9seWZpbGxzKS5saXN0O1xuICAgICAgICB9KSxcbiAgICAgICAgcmVuZGVyTGVnYWN5Q2h1bmtzOiBmYWxzZSxcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cbiAgaWYgKGlzRW52VHJ1ZSgnQlVJTERfTEVHQUNZJykgJiYgIWlzRW52VHJ1ZSgnQlVJTERfREVNQU5EX1VJX0lNUE9SVCcpKSB7XG4gICAgaWYgKGlzRW52VHJ1ZSgnQlVJTERfSU5KRUNUX01PREVSTl9QT0xZRklMTFMnKSkge1xuICAgICAgcmVzdWx0LnBvcCgpO1xuICAgIH1cbiAgICBjb25zdCBtb2Rlcm5Qb2x5ZmlsbHMgPSBhd2FpdCBpbXBvcnQoJ2NvcmUtanMtY29tcGF0JykudGhlbigoZCkgPT4ge1xuICAgICAgcmV0dXJuIGQuZGVmYXVsdCh2aXRlQ29tbW9uQ29uZmlnLmJ1aWxkLnBvbHlmaWxscykubGlzdDtcbiAgICB9KTtcbiAgICBjb25zdCB0YXJnZXRzV2l0aElFID0ge1xuICAgICAgaWU6ICcxMScsXG4gICAgfTtcbiAgICBjb25zdCBsZWdhY3lQb2x5ZmlsbHMgPSBhd2FpdCBpbXBvcnQoJ2NvcmUtanMtY29tcGF0JykudGhlbigoZCkgPT4ge1xuICAgICAgcmV0dXJuIGQuZGVmYXVsdCh7XG4gICAgICAgIHRhcmdldHM6IHRhcmdldHNXaXRoSUUsXG4gICAgICB9KS5saXN0O1xuICAgIH0pO1xuICAgIHJlc3VsdC5wdXNoKFxuICAgICAgbGVnYWN5KHtcbiAgICAgICAgdGFyZ2V0czogWydkZWZhdWx0cycsICdJRSAxMSddLFxuICAgICAgICBhZGRpdGlvbmFsTGVnYWN5UG9seWZpbGxzOiBbJ3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZSddLFxuICAgICAgICBtb2Rlcm5Qb2x5ZmlsbHM6IGlzRW52VHJ1ZSgnQlVJTERfSU5KRUNUX01PREVSTl9QT0xZRklMTFMnKSA/IG1vZGVyblBvbHlmaWxscyA6IFtdLFxuICAgICAgICBwb2x5ZmlsbHM6IGxlZ2FjeVBvbHlmaWxscyxcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cbiAgaWYgKGlzRW52VHJ1ZSgnQlVJTERfSU5TUEVDVF9SRVBPUlQnKSkge1xuICAgIHJlc3VsdC5wdXNoKFxuICAgICAgSW5zcGVjdCh7XG4gICAgICAgIGJ1aWxkOiB0cnVlLFxuICAgICAgICBvdXRwdXREaXI6ICcudml0ZS1pbnNwZWN0JyxcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1aWxkUGx1Z2lucyhtb2RlOiBzdHJpbmcsIGlnbm9yZUh0bWxQbHVnaW46IGJvb2xlYW4gPSBmYWxzZSkge1xuICBjb25zdCBwbHVnaW5zID0gW107XG4gIHBsdWdpbnMucHVzaCguLi4oYXdhaXQgYmFzZVBsdWdpbnMobW9kZSwgaWdub3JlSHRtbFBsdWdpbikpKTtcbiAgaWYgKG1vZGUgPT09ICdkZXZlbG9wbWVudCcpIHtcbiAgICBwbHVnaW5zLnB1c2goLi4uZGV2UGx1Z2lucyhtb2RlKSk7XG4gIH1cbiAgaWYgKG1vZGUgPT09ICdwcm9kdWN0aW9uJyB8fCBtb2RlID09PSAncHJldmlldycpIHtcbiAgICBwbHVnaW5zLnB1c2goLi4uKGF3YWl0IHByb2RQbHVnaW5zKG1vZGUpKSk7XG4gICAgaWYgKGlzRW52VHJ1ZSgnQlVJTERfSU5TUEVDVCcpKSB7XG4gICAgICBwbHVnaW5zLnB1c2goXG4gICAgICAgIEluc3BlY3Qoe1xuICAgICAgICAgIGJ1aWxkOiB0cnVlLFxuICAgICAgICAgIG91dHB1dERpcjogJy52aXRlLWluc3BlY3QnLFxuICAgICAgICB9KSxcbiAgICAgICk7XG4gICAgfVxuICB9XG4gIHBsdWdpbnMucHVzaChSZXBsYWNlTmFtZSgpKTtcbiAgcmV0dXJuIHBsdWdpbnM7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcXFxcYWxpYXMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0Rlc2t0b3AvcHJvamVjdC95aW5oYWkvdnVlL3Rlc3Q1L2RlbW8vYnVpbGQtdml0ZS9zcmMvYWxpYXMudHNcIjtpbXBvcnQgdml0ZUNvbW1vbkNvbmZpZyBmcm9tICcuLi8uLi92aXRlQ29tbW9uQ29uZmlnJztcblxuY29uc3QgeyBhbGlhcyB9ID0gdml0ZUNvbW1vbkNvbmZpZztcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQWxpYXMobW9kZTogc3RyaW5nKSB7XG4gIGNvbnN0IHJBbGlhcyA9IHtcbiAgICAuLi5hbGlhcy5iYXNlLFxuICAgIC4uLmFsaWFzW21vZGVdLFxuICB9O1xuICByZXR1cm4gT2JqZWN0LmtleXMockFsaWFzKS5tYXAoKGtleSkgPT4ge1xuICAgIGNvbnN0IHYgPSByQWxpYXNba2V5XTtcbiAgICBpZiAodi5yZXBsYWNlbWVudCkge1xuICAgICAgcmV0dXJuIHY7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGZpbmQ6IGtleSxcbiAgICAgICAgcmVwbGFjZW1lbnQ6IHYsXG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcXFxcZW52LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL2J1aWxkLXZpdGUvc3JjL2Vudi50c1wiO2ltcG9ydCBWaXRlQ29tbW9uQ29uZmlnIGZyb20gJy4uLy4uL3ZpdGVDb21tb25Db25maWcnO1xuaW1wb3J0IHsgZ2V0RW52IH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IHsgdGl0bGUgfSA9IFZpdGVDb21tb25Db25maWcuY2xpLmh0bWw7XG5leHBvcnQgZnVuY3Rpb24gZGVmaW5lRW52KF9tb2RlOiBzdHJpbmcpIHtcbiAgY29uc3QgcGFnZVRpdGxlcyA9IHt9O1xuICBPYmplY3Qua2V5cyh0aXRsZSkuZm9yRWFjaCgoaykgPT4ge1xuICAgIHBhZ2VUaXRsZXNbYGltcG9ydC5tZXRhLmVudi5WSVRFX0hUTUxfVElUTEVfJHtrLnRvVXBwZXJDYXNlKCl9YF0gPSBgXCIke3RpdGxlW2tdfVwiYDtcbiAgfSk7XG4gIHJldHVybiB7XG4gICAgLi4ucGFnZVRpdGxlcyxcbiAgICAvLyBpMThuIFx1OTE0RFx1N0Y2RVxuICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9JMThOX0xPQ0FMRSc6IGBcIiR7XG4gICAgICBnZXRFbnYoJ1ZJVEVfREVGQVVMVF9MT0NBTEUnKSA/IGdldEVudignVklURV9ERUZBVUxUX0xPQ0FMRScpIDogJ3poX0NOJ1xuICAgIH1cImAsXG4gICAgJ2ltcG9ydC5tZXRhLmVudi5WSVRFX0kxOE5fRkFMTEJBQ0tfTE9DQUxFJzogYFwiJHtcbiAgICAgIGdldEVudignVklURV9ERUZBVUxUX0xPQ0FMRScpID8gZ2V0RW52KCdWSVRFX0RFRkFVTFRfTE9DQUxFJykgOiAnemhfQ04nXG4gICAgfVwiYCxcbiAgICAvLyBcdTUxN0NcdTVCQjl1aVx1NzY4NFx1NTE2OFx1NUM0MFx1NTNEOFx1OTFDRlx1OTE0RFx1N0Y2RVxuICAgICdwcm9jZXNzLmVudi5WVUVfQVBQX1ZYRV9UQUJMRV9FTlYnOiBgJyR7Z2V0RW52KCdOT0RFX0VOVicpfSdgLFxuICAgICdwcm9jZXNzLmVudi5WVUVfQVBQX1BVQkxJQ19QQVRIJzogYFwiJHtnZXRFbnYoJ1ZJVEVfUFVCTElDX1BBVEgnKX1cImAsXG4gIH07XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRGVza3RvcFxcXFxwcm9qZWN0XFxcXHlpbmhhaVxcXFx2dWVcXFxcdGVzdDVcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHZpdGUuYmFzZS50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRGVza3RvcC9wcm9qZWN0L3lpbmhhaS92dWUvdGVzdDUvZGVtby9idWlsZC12aXRlL3ZpdGUuYmFzZS50c1wiO2ltcG9ydCB0eXBlIHtVc2VyQ29uZmlnfSBmcm9tICd2aXRlJztcbmltcG9ydCB7Y3NzfSBmcm9tICcuL3NyYy9jc3MnO1xuaW1wb3J0IHtnZXRFbnZ9IGZyb20gJy4vc3JjL3V0aWxzJztcbmltcG9ydCB7YnVpbGRQbHVnaW5zfSBmcm9tICcuL3NyYy9wbHVnaW4nO1xuaW1wb3J0IHtidWlsZEFsaWFzfSBmcm9tICcuL3NyYy9hbGlhcyc7XG5pbXBvcnQge2RlZmluZUVudn0gZnJvbSAnLi9zcmMvZW52JztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVpbGRCYXNlQ29uZmlnKFxuICBtb2RlOiBzdHJpbmcsXG4gIGlnbm9yZUh0bWxQbHVnaW46IGJvb2xlYW4gPSBmYWxzZSxcbik6IFByb21pc2U8VXNlckNvbmZpZz4ge1xuICAvLyBjc3MgXHU1MkEwXHU4RjdEXHU0RUU1XHU1M0NBcHJlZml4XHU5MTREXHU3RjZFXHU2NTg3XHU0RUY2XG4gIGNvbnN0IGNzc0NvbmZpZyA9IGF3YWl0IGNzcygpO1xuICByZXR1cm4ge1xuICAgIC8vIFx1NTdGQVx1Nzg0MFx1OERFRlx1NUY4NFxuICAgIGJhc2U6IGdldEVudignVklURV9QVUJMSUNfUEFUSCcpLFxuICAgIGVudkRpcjogcGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksICcuLy5lbnYnKSxcbiAgICAvLyBcdTYyNTNcdTUzMDVcdTYyNDBcdTc1MjhcdTUyMzBcdTc2ODRcdTYzRDJcdTRFRjZcbiAgICBwbHVnaW5zOiBhd2FpdCBidWlsZFBsdWdpbnMobW9kZSwgaWdub3JlSHRtbFBsdWdpbiksXG4gICAgcmVzb2x2ZToge1xuICAgICAgLy8gXHU1MjJCXHU1NDBEXG4gICAgICBhbGlhczogYnVpbGRBbGlhcyhtb2RlKSxcbiAgICB9LFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgZXhjbHVkZTogWydAaXRrLXdhc20vZGljb20nXSxcbiAgICB9LFxuICAgIC8vIFx1NUI5QVx1NEU0OVx1NTE2OFx1NUM0MFx1NUUzOFx1OTFDRlx1NjZGRlx1NjM2Mlx1NjVCOVx1NUYwRlx1MzAwMlx1NTE3Nlx1NEUyRFx1NkJDRlx1OTg3OVx1NTcyOFx1NUYwMFx1NTNEMVx1NzNBRlx1NTg4M1x1NEUwQlx1NEYxQVx1ODhBQlx1NUI5QVx1NEU0OVx1NTcyOFx1NTE2OFx1NUM0MFx1RkYwQ1x1ODAwQ1x1NTcyOFx1Njc4NFx1NUVGQVx1NjVGNlx1ODhBQlx1OTc1OVx1NjAwMVx1NjZGRlx1NjM2MlxuICAgIGRlZmluZTogZGVmaW5lRW52KG1vZGUpLFxuICAgIC8vIGNzc1x1NTJBMFx1OEY3RFx1OTE0RFx1N0Y2RVx1OTg3OVxuICAgIGNzczogY3NzQ29uZmlnLFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXFxcXHByb3h5LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL2J1aWxkLXZpdGUvc3JjL3Byb3h5LnRzXCI7aW1wb3J0IGh0dHAyIGZyb20gJ3ZpdGUtcGx1Z2luLWh0dHAyLXByb3h5JztcclxuaW1wb3J0IGJhc2ljU3NsIGZyb20gJ0B2aXRlanMvcGx1Z2luLWJhc2ljLXNzbCc7XHJcbmltcG9ydCB7Z2V0RW52fSBmcm9tICcuL3V0aWxzJztcclxuaW1wb3J0IHR5cGUge1VzZXJDb25maWd9IGZyb20gJ3ZpdGUnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUHJveHkoKSB7XHJcbiAgY29uc3QgcHJveHlOYW1lID0gYF4ke2dldEVudignVklURV9CQVNFX1BBVEgnKX1gO1xyXG4gIGNvbnN0IHByb3h5UmVnZXggPSBuZXcgUmVnRXhwKHByb3h5TmFtZSk7XHJcbiAgY29uc29sZS5sb2coXCJwcm94eU5hbWU9PVwiLCBwcm94eU5hbWUpO1xyXG4gIGNvbnNvbGUubG9nKFwicHJveHlSZWdleD09XCIsIHByb3h5UmVnZXgpO1xyXG5cclxuXHJcbiAgLy8gbm9pbnNwZWN0aW9uIEpTVW51c2VkR2xvYmFsU3ltYm9sc1xyXG4gIHJldHVybiB7XHJcbiAgICAvLyBcdThGRDlcdTkxQ0NcdTkwMUFcdThGQzdcdTZCNjRwcm94eVx1NTNFRlx1NEVFNVx1OEZEQlx1ODg0Q1x1NEVFNVx1NEUwQlx1NzY4NFx1OEY2Q1x1NjM2MlxyXG4gICAgLy8gaHR0cDovL2xvY2FsaG9zdDo1MTczWy90YTQwNC9daW5kZXhSZXN0U2VydmljZS9nZXRDdXJVc2VyQWNjb3VudFxyXG4gICAgLy8gPT4gIFx1NTcyOFx1OEY2Q1x1NjM2Mlx1NjVGNixcdTk3MDBcdTg5ODFcdTVDMDZcdTUzOUZcdTY3MkNcdTc2ODRcdTRFMEFcdTRFMEJcdTY1ODdcdTY2RkZcdTYzNjJcdTRFM0EnJyxcclxuICAgIC8vIGh0dHA6Ly8xNzIuMjAuMjMuMTg6MzAwMDEvdGE0MDQvaW5kZXhSZXN0U2VydmljZS9nZXRDdXJVc2VyQWNjb3VudFxyXG4gICAgWydeL3RhNDA0L2FwaTIvJ106IHtcclxuICAgICAgdGFyZ2V0OiAnaHR0cDovL2FkbWluLml0c2VhLmNvbS5jbjo1NjgwOC9hcGkvJyxcclxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICByZXdyaXRlOiAocGF0aDogc3RyaW5nKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJwYXRoX19fX1x1NEVFM1x1NzQwNmFwaTJcIiwgcGF0aCk7XHJcbiAgICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXlxcL3RhNDA0XFwvYXBpMlxcLy8sICcnKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgWydeL3RhNDA0L2FwaS8nXToge1xyXG4gICAgICAvLyB0YXJnZXQ6ICdodHRwOi8vMTgzLjI0Ny4xNjUuMjoyNDgwL2Nvbm5lY3Rvci9hcGkvJyxcclxuICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMS4yNC9jb25uZWN0b3IvYXBpLycsXHJcbiAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcclxuICAgICAgcmV3cml0ZTogKHBhdGg6IHN0cmluZykgPT4gcGF0aC5yZXBsYWNlKC9eXFwvdGE0MDRcXC9hcGlcXC8vLCAnJylcclxuICAgIH0sXHJcbiAgICBbJ14vdGE0MDQvYXBpNS8nXToge1xyXG4gICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xLjQ6Mzk2MDAvJyxcclxuICAgICAgLy8gdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMS4xNDI6Mzk2MDAvJywvL3h3alxyXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIHJld3JpdGU6IChwYXRoOiBzdHJpbmcpID0+IHBhdGgucmVwbGFjZSgvXlxcL3RhNDA0XFwvYXBpNVxcLy8sICcnKVxyXG4gICAgfSxcclxuICAgIFsnXi90YTQwNC9hcGkzLyddOiB7XHJcbiAgICAgIHRhcmdldDogJ2h0dHBzOi8vZGVtby5kZWVwaW5zaWdodC5kZWVwdmVzc2VsLm5ldC9hcGkvJyxcclxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICByZXdyaXRlOiAocGF0aDogc3RyaW5nKSA9PiBwYXRoLnJlcGxhY2UoL15cXC90YTQwNFxcL2FwaTNcXC8vLCAnJylcclxuICAgIH0sXHJcbiAgICBbXCJeL3RhNDA0L2FwaTYvXCJdOiB7XHJcbiAgICAgIHRhcmdldDogXCJodHRwOi8vMTkyLjE2OC4xLjQ6Mzk2MDAvXCIsXHJcbiAgICAgIC8vIHRhcmdldDogXCJodHRwOi8vMTkyLjE2OC4xLjE0MjozOTYyNS9cIiwvL3h3alxyXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIHJld3JpdGU6IChwYXRoNikgPT4gcGF0aDYucmVwbGFjZSgvXlxcL3RhNDA0XFwvYXBpNlxcLy8sIFwiXCIpLFxyXG4gICAgfSxcclxuICAgIFtcIl4vYXBpNy9cIl06IHtcclxuICAgICAgLy8gdGFyZ2V0OiBcImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9cIixcclxuICAgICAgdGFyZ2V0OiBcImh0dHA6Ly8xOTIuMTY4LjEuNDozOTYwMC9cIiwvL3h3alxyXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIHJld3JpdGU6IChwYXRoNikgPT4gcGF0aDYucmVwbGFjZSgvXlxcL2FwaTdcXC8vLCBcIlwiKSxcclxuICAgIH0sXHJcblxyXG4gICAgW3Byb3h5TmFtZV06IHtcclxuICAgICAgdGFyZ2V0OlxyXG4gICAgICAgIGdldEVudignUlVOX0VOVicpID09PSAnbW9jaycgPyAnaHR0cDovL2xvY2FsaG9zdDozNjc0Mi8nIDogZ2V0RW52KCdWSVRFX0JBQ0tFTkRfUEFUSCcpLFxyXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXHJcbiAgICAgIHJld3JpdGU6IChwYXRoOiBzdHJpbmcpID0+IHtcclxuICAgICAgICAvLyBpZigpe31wYXRoLmluZGV4T2YoJy9hcGknKSAhPT0gLTEgJiYgcGF0aC5pbmRleE9mKCcvYXBpMicpICE9PSAtMVxyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicGF0aF9fX1x1OUVEOFx1OEJBNFwiLCBwYXRoKTtcclxuICAgICAgICAvLyBjb25zdCBhcGkyUmVnZXggPSAvXFwvYXBpMi87XHJcbiAgICAgICAgLy8gaWYgKGFwaTJSZWdleC50ZXN0KHBhdGgpKSB7XHJcbiAgICAgICAgLy8gICBjb25zdCBuZXdwYXRoID0gcGF0aC5yZXBsYWNlKC9eXFwvdGE0MDQvLCAnJyk7XHJcbiAgICAgICAgLy8gICBjb25zb2xlLmxvZyhcIm5ld3BhdGg9PT1cIiwgbmV3cGF0aCk7XHJcblxyXG4gICAgICAgIC8vICAgcmV0dXJuIG5ld3BhdGhcclxuICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgIC8vIFx1NzUzMVx1NEU4RVZJVEVfQkFDS0VORF9QQVRIXHU5MTREXHU3RjZFXHU3Njg0XHU4REVGXHU1Rjg0XHU0RTNBXHU1MzA1XHU1NDJCXHU1NDBFXHU3QUVGXHU0RTBBXHU0RTBCXHU2NTg3XHU3Njg0XHU4REVGXHU1Rjg0LFx1NjI0MFx1NEVFNVx1NkI2NFx1NTkwNFx1NUMwNlx1NTI0RFx1N0FFRlx1NzY4NEJBU0VfUEFUSFx1NzlGQlx1OTY2NFxyXG4gICAgICAgIHJldHVybiBwYXRoLnJlcGxhY2UocHJveHlSZWdleCwgJycpO1xyXG4gICAgICAgIC8vIH07XHJcblxyXG5cclxuICAgICAgfSxcclxuICAgICAgc2VjdXJlOiBmYWxzZSxcclxuICAgIH0sXHJcbiAgICAvLyBcdTRFMEJcdTk3NjJcdThGRDlcdTRFMkFwcm94eVx1OTE0RFx1N0Y2RVx1NEUwRVx1NEUwQVx1OTc2Mlx1NzY4NFx1OTE0RFx1N0Y2RVx1NjU0OFx1Njc5Q1x1NUI4Q1x1NTE2OFx1NEUwMFx1ODFGNFxyXG4gICAgLy8gW3Byb3h5TmFtZV06IGdldEVudignUlVOX0VOVicpID09PSAnbW9jaycgPyAnaHR0cDovL2xvY2FsaG9zdDozNjc0Mi8nIDogKGdldEVudignVklURV9CQUNLRU5EX1BBVEgnKS5yZXBsYWNlKCcvdGE0MDQvJywgJycpKSxcclxuICB9O1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRQcmV2aWV3UHJveHkoKSB7XHJcbiAgcmV0dXJuIGJ1aWxkUHJveHkoKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUHJveHlGb3JIVFRQMihjb25maWc6IFVzZXJDb25maWcpIHtcclxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cclxuICBkZWxldGUgY29uZmlnLnNlcnZlci5wcm94eTtcclxuICBjb25maWcucGx1Z2lucy5wdXNoKGh0dHAyKGJ1aWxkUHJveHkoKSkpO1xyXG4gIGNvbmZpZy5wbHVnaW5zLnB1c2goYmFzaWNTc2woKSk7XHJcbn1cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXFxcXG9wdGltaXplRGVwcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRGVza3RvcC9wcm9qZWN0L3lpbmhhaS92dWUvdGVzdDUvZGVtby9idWlsZC12aXRlL3NyYy9vcHRpbWl6ZURlcHMudHNcIjtpbXBvcnQgeyBnZXRBbGxQYWdlcyB9IGZyb20gJy4uL21wYS9wYWdlcyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvcHRpbWl6ZUVudHJpZXNCYXNlKCk6IFByb21pc2U8QXJyYXk8c3RyaW5nPj4ge1xuICBjb25zdCBwYWdlcyA9IGF3YWl0IGdldEFsbFBhZ2VzKCk7XG4gIHJldHVybiBPYmplY3QudmFsdWVzKHBhZ2VzKS5tYXAoKGspID0+IChrIGFzIHN0cmluZykucmVwbGFjZSgnLycsICcnKSk7XG59XG5cbi8qKlxuICogXHU1QzA2XHU1MzA1XHU1NDJCbm9kZV9tb2R1bGVzXHU0RTBCXHU3Njg0aHRtbFx1NkEyMVx1NTc1N1x1NzY4NFx1NTQwRFx1NzlGMFx1ODNCN1x1NTNENlx1NTIzMFx1NUU3Nlx1OEZENFx1NTZERVxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb3B0aW1pemVMaWJzKCk6IFByb21pc2U8QXJyYXk8c3RyaW5nPj4ge1xuICByZXR1cm4gKGF3YWl0IG9wdGltaXplRW50cmllc0Jhc2UoKSlcbiAgICAuZmlsdGVyKChrKSA9PiAoayBhcyBzdHJpbmcpLmluZGV4T2YoJ25vZGVfbW9kdWxlcycpID49IDApXG4gICAgLm1hcCgobGliKSA9PiB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnMsQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG4gICAgICBjb25zdCBbX2ksIHNjb3BlLCBuYW1lXSA9IGxpYi5zcGxpdCgnLycpO1xuICAgICAgcmV0dXJuIGAke3Njb3BlfS8ke25hbWV9YDtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBcdTVDMDZcdTRFMERcdTU3Mjhub2RlX21vZHVsZXNcdTRFMEJcdTc2ODRodG1sXHU2NTg3XHU0RUY2XHU1MkEwXHU1MTY1XHU1MjMwZW50cmllc1x1NEUyRFxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gb3B0aW1pemVFbnRyaWVzKCk6IFByb21pc2U8QXJyYXk8c3RyaW5nPj4ge1xuICByZXR1cm4gKGF3YWl0IG9wdGltaXplRW50cmllc0Jhc2UoKSkuZmlsdGVyKChrKSA9PiAoayBhcyBzdHJpbmcpLmluZGV4T2YoJ25vZGVfbW9kdWxlcycpIDwgMCk7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRGVza3RvcFxcXFxwcm9qZWN0XFxcXHlpbmhhaVxcXFx2dWVcXFxcdGVzdDVcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHZpdGUub3B0aW1pemUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0Rlc2t0b3AvcHJvamVjdC95aW5oYWkvdnVlL3Rlc3Q1L2RlbW8vYnVpbGQtdml0ZS92aXRlLm9wdGltaXplLnRzXCI7aW1wb3J0IGZzcCBmcm9tICdmcy9wcm9taXNlcyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB0eXBlIHsgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgaXNFbnZUcnVlIH0gZnJvbSAnLi9zcmMvdXRpbHMnO1xuaW1wb3J0IHsgb3B0aW1pemVFbnRyaWVzLCBvcHRpbWl6ZUxpYnMgfSBmcm9tICcuL3NyYy9vcHRpbWl6ZURlcHMnO1xuXG5pbXBvcnQgVml0ZUNvbW1vbkNvbmZpZyBmcm9tICcuLi92aXRlQ29tbW9uQ29uZmlnJztcblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTU3MjhAeWgvY2xpLWludGVybmFsLWxvY2FsZXNcdTRFMkRcdTVDMDFcdTg4QzVcdTc2ODRcdThCRURcdThBMDBcdTY1ODdcdTRFRjZcbiAqIEByZXR1cm5zIFx1OEJFRFx1OEEwMFx1NjU4N1x1NEVGNlxuICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0TG9jYWxlcygpIHtcbiAgY29uc3QgZCA9IGF3YWl0IGZzcC5yZWFkZGlyKHBhdGgucmVzb2x2ZSgnLi9pbnRlcm5hbC9sb2NhbGVzL2Rpc3QnKSk7XG4gIHJldHVybiBkXG4gICAgLmZpbHRlcigocykgPT4ge1xuICAgICAgcmV0dXJuIHMuZW5kc1dpdGgoJy5tanMnKTtcbiAgICB9KVxuICAgIC5tYXAoKHNfMSkgPT4ge1xuICAgICAgcmV0dXJuIGBAeWgvY2xpLWludGVybmFsLXByZWNvbXBpbGVkLWxvY2FsZXMvZGlzdC8ke3NfMX1gO1xuICAgIH0pO1xufVxuXG5kZWNsYXJlIHR5cGUgVml0ZU9wdGltaXplRGVwcyA9IFVzZXJDb25maWdbJ29wdGltaXplRGVwcyddO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0T3B0aW1pemVDb25maWcoX21vZGU6IHN0cmluZyk6IFByb21pc2U8Vml0ZU9wdGltaXplRGVwcz4ge1xuICBjb25zdCBvcHRpbWl6ZURlcHM6IFZpdGVPcHRpbWl6ZURlcHMgPSB7XG4gICAgLy8gXHU0RTNCXHU4OTgxXHU3NTI4XHU0RThFXHU1NzI4IHZpdGUgXHU4RkRCXHU4ODRDXHU0RjlEXHU4RDU2XHU2MDI3XHU1QkZDXHU1MTY1XHU1MjA2XHU2NzkwXHVGRjBDXHU1QjgzXHU0RjFBXHU5MUNEXHU1MTk5XHU5NzAwXHU4OTgxXHU5ODg0XHU3RjE2XHU4QkQxXHU0RTE0XHU0RTNBIGNvbW1vbkpTIFx1NzY4NFx1NEY5RFx1OEQ1NlxuICAgIG5lZWRzSW50ZXJvcDogVml0ZUNvbW1vbkNvbmZpZy5vcHRpbWl6ZURlcHMubmVlZHNJbnRlcm9wLFxuICB9O1xuICBjb25zdCBlbnRyaWVzOiBBcnJheTxzdHJpbmc+ID0gW107XG4gIGlmICghaXNFbnZUcnVlKCdVU0VfT0xEX01PRFVMRVNfU1VQUE9SVCcpKSB7XG4gICAgZW50cmllcy5wdXNoKCdidWlsZC12aXRlL29wdGltaXplL29wdGltaXplLnRzJyk7XG4gIH1cbiAgZW50cmllcy5wdXNoKCdidWlsZC12aXRlL29wdGltaXplL29wdGltaXplLW1vZHVsZXMudHMnKTtcbiAgaWYgKCFpc0VudlRydWUoJ1ZJVEVfT05MSU5FX1RIRU1FX0VOQUJMRUQnKSkge1xuICAgIGVudHJpZXMucHVzaCgnYnVpbGQtdml0ZS9vcHRpbWl6ZS9vcHRpbWl6ZS1jc3MudHMnKTtcbiAgfSBlbHNlIHtcbiAgICBlbnRyaWVzLnB1c2goJ2J1aWxkLXZpdGUvb3B0aW1pemUvb3B0aW1pemUtbGVzcy50cycpO1xuICB9XG5cbiAgLy8gXHU5NzAwXHU4OTgxaW5jbHVkZVx1NzY4NFx1OTg4NFx1Njc4NFx1NUVGQVx1NEY5RFx1OEQ1NlxuICBvcHRpbWl6ZURlcHMuaW5jbHVkZSA9IFtcbiAgICAuLi4oYXdhaXQgZ2V0TG9jYWxlcygpKSxcbiAgICAuLi5WaXRlQ29tbW9uQ29uZmlnLm9wdGltaXplRGVwcy5pbmNsdWRlLFxuICAgIC4uLihhd2FpdCBvcHRpbWl6ZUxpYnMoKSksXG4gIF07XG4gIC8vIFx1NjI0MFx1NjcwOVx1NTE2NVx1NTNFM1x1OTBGRFx1ODhBQlx1NTJBMFx1NTE2NVx1OTg4NFx1N0YxNlx1OEJEMVx1NEUyRFxuICBvcHRpbWl6ZURlcHMuZW50cmllcyA9IFtcbiAgICAuLi4oYXdhaXQgb3B0aW1pemVFbnRyaWVzKCkpLFxuICAgIC4uLmVudHJpZXMsXG4gICAgLi4uVml0ZUNvbW1vbkNvbmZpZy5vcHRpbWl6ZURlcHMuZW50cmllcyxcbiAgXTtcbiAgb3B0aW1pemVEZXBzLmV4Y2x1ZGUgPSBbLi4uVml0ZUNvbW1vbkNvbmZpZy5vcHRpbWl6ZURlcHMuZXhjbHVkZSwgJ3N3LmpzJ107XG4gIG9wdGltaXplRGVwcy5lc2J1aWxkT3B0aW9ucyA9IHtcbiAgICBzb3VyY2VtYXA6IHRydWUsIC8vICdpbmxpbmUnXG4gIH07XG4gIG9wdGltaXplRGVwcy5ob2xkVW50aWxDcmF3bEVuZCA9IHRydWU7XG4gIHJldHVybiBvcHRpbWl6ZURlcHM7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRGVza3RvcFxcXFxwcm9qZWN0XFxcXHlpbmhhaVxcXFx2dWVcXFxcdGVzdDVcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHZpdGUuZGV2LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL2J1aWxkLXZpdGUvdml0ZS5kZXYudHNcIjtpbXBvcnQgdHlwZSB7IFVzZXJDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGJ1aWxkQmFzZUNvbmZpZyB9IGZyb20gJy4vdml0ZS5iYXNlJztcbmltcG9ydCB7IGJ1aWxkUHJveHksIGJ1aWxkUHJveHlGb3JIVFRQMiB9IGZyb20gJy4vc3JjL3Byb3h5JztcbmltcG9ydCB7IGVycm9yLCBnZXRPcGVuLCBpc0VudlRydWUsIHdhcm4gfSBmcm9tICcuL3NyYy91dGlscyc7XG5pbXBvcnQgeyBnZXRPcHRpbWl6ZUNvbmZpZyB9IGZyb20gJy4vdml0ZS5vcHRpbWl6ZSc7XG5pbXBvcnQgeyBnZXRBbGxQYWdlcyB9IGZyb20gJy4vbXBhL3BhZ2VzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1aWxkRGV2Q29uZmlnKG1vZGU6IHN0cmluZyk6IFByb21pc2U8VXNlckNvbmZpZz4ge1xuICBjb25zdCBjb25maWc6IFVzZXJDb25maWcgPSBhd2FpdCBidWlsZEJhc2VDb25maWcobW9kZSk7XG5cbiAgY29uZmlnLnNlcnZlciA9IHtcbiAgICAvLyBcdTYzMDdcdTVCOUFcdTY3MERcdTUyQTFcdTU2NjhcdTVFOTRcdThCRTVcdTc2RDFcdTU0MkNcdTU0RUFcdTRFMkEgSVAgXHU1NzMwXHU1NzQwXHUzMDAyIFx1NTk4Mlx1Njc5Q1x1NUMwNlx1NkI2NFx1OEJCRVx1N0Y2RVx1NEUzQSAwLjAuMC4wIFx1NUMwNlx1NzZEMVx1NTQyQ1x1NjI0MFx1NjcwOVx1NTczMFx1NTc0MFx1RkYwQ1x1NTMwNVx1NjJFQ1x1NUM0MFx1NTdERlx1N0Y1MVx1NTQ4Q1x1NTE2Q1x1N0Y1MVx1NTczMFx1NTc0MFx1MzAwMlxuICAgIC8vIHRydWVcdTVDMzFcdTY2MkZsb2NhbGhvc3QrXHU0RjYwXHU2NzJDXHU1NzMwXHU2MjQwXHU2NzA5XHU3RjUxXHU1MzYxXHU3Njg0aXBcbiAgICBob3N0OiBmYWxzZSxcbiAgICAvLyBcdTRFM0FcdTVGMDBcdTUzRDFcdTY3MERcdTUyQTFcdTU2NjhcdTkxNERcdTdGNkVcdTgxRUFcdTVCOUFcdTRFNDlcdTRFRTNcdTc0MDZcdTg5QzRcdTUyMTlcdTMwMDJcbiAgICBwcm94eTogYnVpbGRQcm94eSgpLFxuICAgIC8vIFx1NUYwMFx1NTNEMVx1NjVGNlx1NkQ0Rlx1ODlDOFx1NTY2OFx1OUVEOFx1OEJBNFx1NjI1M1x1NUYwMFx1NzY4NFx1OERFRlx1NUY4NFxuICAgIG9wZW46IGdldE9wZW4oKSxcbiAgICAvLyBcdTRGMjBcdTkwMTJcdTdFRDkgY2hva2lkYXIgXHU3Njg0XHU2NTg3XHU0RUY2XHU3Q0ZCXHU3RURGXHU3NkQxXHU1NDJDXHU1NjY4XHU5MDA5XHU5ODc5XHUzMDAyXG4gICAgd2F0Y2g6IHtcbiAgICAgIHVzZUZzRXZlbnRzOiBmYWxzZSxcbiAgICAgIC8vIFx1NTk4Mlx1Njc5Q1x1NTcyOFx1NTQyRlx1NTJBOFx1NjVGNlx1OTA0N1x1NTIzMFx1NTNDRFx1NTkwRFx1OTFDRFx1NTQyRmRldi1zZXJ2ZXJcdTc2ODRcdTk1RUVcdTk4OTgsXHU1MjE5XHU2NTNFXHU1RjAwXHU0RTBCXHU5NzYyXHU3Njg0XHU2Q0U4XHU5MUNBXG4gICAgICAvLyBpZ25vcmVkOiBbXG4gICAgICAvLyAgICcqKi92aXRlQ29tbW9uQ29uZmlnLnRzJyxcbiAgICAgIC8vICAgJyoqL211bHRpcGxlU2VydmljZS5jb25maWcudHMnLFxuICAgICAgLy8gICAnKiovdml0ZS5jb25maWcudHMnLFxuICAgICAgLy8gICAnKiovLmVudi4qJyxcbiAgICAgIC8vICAgJyoqL2J1aWxkLXZpdGUvKiovKi50cycsXG4gICAgICAvLyAgICcqKi8uaWRlYS8qKicsXG4gICAgICAvLyAgICcqKi8udnNjb2RlLyoqJ1xuICAgICAgLy8gXSxcbiAgICB9LFxuICB9O1xuICAvLyBcdTkxNERcdTdGNkVcdTk4ODRcdTdGMTZcdThCRDFcdTUxODVcdTVCQjlcbiAgY29uZmlnLm9wdGltaXplRGVwcyA9IGF3YWl0IGdldE9wdGltaXplQ29uZmlnKG1vZGUpO1xuICBpZiAoaXNFbnZUcnVlKCdVU0VfSFRUUDInKSkge1xuICAgIGJ1aWxkUHJveHlGb3JIVFRQMihjb25maWcpO1xuICB9XG4gIC8vIFx1NzUxRlx1NjIxMFx1OTcwMFx1ODk4MXdhcm11cFx1NzY4NFx1OTg3NVx1OTc2MlxuICBjb25zdCBodG1sRW50cnkgPSBhd2FpdCBnZXRBbGxQYWdlcygpO1xuICBjb25zdCB3YXJtdXBIdG1sOiBzdHJpbmdbXSA9IE9iamVjdC5rZXlzKGh0bWxFbnRyeSlcbiAgICAubWFwKChrKSA9PiB7XG4gICAgICBjb25zdCB2ID0gaHRtbEVudHJ5W2tdO1xuICAgICAgaWYgKHYuY29uc3RydWN0b3IgIT09IFN0cmluZykge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICAgIC8vIFx1OERFRlx1NUY4NFx1NUZDNVx1OTg3Qlx1NEVFNS5cdTVGMDBcdTU5MzRcbiAgICAgIHJldHVybiBgLiR7diBhcyBzdHJpbmd9YDtcbiAgICB9KVxuICAgIC5maWx0ZXIoKHYpID0+IHYgIT09IG51bGwpO1xuICBjb25maWcuc2VydmVyLndhcm11cCA9IHtcbiAgICBjbGllbnRGaWxlczogWy4uLndhcm11cEh0bWxdLFxuICB9O1xuICAvLyBjb25maWcub3B0aW1pemVEZXBzLmhvbGRVbnRpbENyYXdsRW5kID0gdHJ1ZTtcbiAgcmV0dXJuIGNvbmZpZztcbn1cblxuLy8gXHU1NDJGXHU1MkE4XHU0RUVBXHU1RjBGXG5leHBvcnQgZnVuY3Rpb24gaW5pdCgpIHtcbiAgZXJyb3IoXG4gICAgW1xuICAgICAgJzg4ODg4OCAgZGIgICAgICAgICAgZFA4OCAgIGRQWWIgICAgIGRQODgnLFxuICAgICAgJyAgODggICBkUFliICAgICAgICBkUCA4OCAgZFAgICBZYiAgZFAgODgnLFxuICAgICAgJyAgODggIGRQX19ZYiAgICAgIGQ4ODg4ODggWWIgICBkUCBkODg4ODg4JyxcbiAgICAgICcgIDg4IGRQICAgIFliICAgICAgICAgODggICBZYm9kUCAgICAgIDg4JyxcbiAgICBdLmpvaW4oJ1xcbicpLFxuICApO1xuICB3YXJuKFxuICAgIFtcbiAgICAgICcnLFxuICAgICAgJyAgICAgICAgICAgICAgICAgICBfb29Pb29fJyxcbiAgICAgICcgICAgICAgICAgICAgICAgICBvODg4ODg4OG8nLFxuICAgICAgJyAgICAgICAgICAgICAgICAgIDg4XCIgLiBcIjg4JyxcbiAgICAgICcgICAgICAgICAgICAgICAgICAofCAtXy0gfCknLFxuICAgICAgJyAgICAgICAgICAgICAgICAgIE9cXFxcICA9ICAvTycsXG4gICAgICBcIiAgICAgICAgICAgICAgIF9fX18vYC0tLSdcXFxcX19fX1wiLFxuICAgICAgXCIgICAgICAgICAgICAgLicgIFxcXFxcXFxcfCAgICAgfC8vICBgLlwiLFxuICAgICAgJyAgICAgICAgICAgIC8gIFxcXFxcXFxcfHx8ICA6ICB8fHwvLyAgXFxcXCcsXG4gICAgICAnICAgICAgICAgICAvICBffHx8fHwgXHU1MzREIHx8fHx8LSAgXFxcXCcsXG4gICAgICAnICAgICAgICAgICB8ICAgfCBcXFxcXFxcXFxcXFwgIC0gIC8vLyB8ICAgfCcsXG4gICAgICBcIiAgICAgICAgICAgfCBcXFxcX3wgICcnXFxcXC0tLS8nJyAgfCAgIHxcIixcbiAgICAgICcgICAgICAgICAgIFxcXFwgIC4tXFxcXF9fICBgLWAgIF9fXy8tLiAvJyxcbiAgICAgIFwiICAgICAgICAgX19fYC4gLicgIC8tLS4tLVxcXFwgIGAuIC4gX19cIixcbiAgICAgICcgICAgICAuXCJcIiBcXCc8ICBgLl9fX1xcXFxfPHw+Xy9fX18uXFwnICA+XFwnXCJcIi4nLFxuICAgICAgJyAgICAgfCB8IDogIGAtIFxcXFxgLjtgXFxcXCBfIC9gOy5gLyAtIGAgOiB8IHwnLFxuICAgICAgJyAgICAgXFxcXCAgXFxcXCBgLS4gICBcXFxcXyBfX1xcXFwgL19fIF8vICAgLi1gIC8gIC8nLFxuICAgICAgXCI9PT09PT1gLS5fX19fYC0uX19fXFxcXF9fX19fL19fXy4tYF9fX18uLSc9PT09PT1cIixcbiAgICAgIFwiICAgICAgICAgICAgICAgICAgIGA9LS0tPSdcIixcbiAgICAgICdeXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl4nLFxuICAgICAgJyAgICAgICAgIFx1NEY1Qlx1Nzk1Nlx1NEZERFx1NEY1MSAgICAgICBcdTZDMzhcdTY1RTBCVUcnLFxuICAgIF0uam9pbignXFxuJyksXG4gICk7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcXFxcY2h1bmtzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL2J1aWxkLXZpdGUvc3JjL2NodW5rcy50c1wiO2ltcG9ydCB7IGlzRW52VHJ1ZSB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCB1c2VEZW1hbmRJbXBvcnQgPSBpc0VudlRydWUoJ0JVSUxEX0RFTUFORF9VSV9JTVBPUlQnKTtcbmV4cG9ydCBmdW5jdGlvbiBtYW51YWxDaHVua3MoaWQ6IHN0cmluZykge1xuICBpZiAoaWQuaW5jbHVkZXMoJ2ZhY2VDb25maWcnKSkge1xuICAgIHJldHVybiAnMS5jaHVuay1mYWNlQ29uZmlnJztcbiAgfVxuICBpZiAoaWQuaW5jbHVkZXMoJ3N0eWxlQ292ZXIubGVzcycpKSB7XG4gICAgcmV0dXJuICcyX2NodW5rLXN0eWxlQ292ZXInO1xuICB9XG4gIGlmICh1c2VEZW1hbmRJbXBvcnQpIHtcbiAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy92dWUnKSkge1xuICAgICAgcmV0dXJuICdjaHVuay12dWVqcyc7XG4gICAgfVxuICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL0B5aC90YS11dGlscycpKSB7XG4gICAgICByZXR1cm4gJ2NodW5rLXRhLXV0aWxzJztcbiAgICB9XG4gICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvQHloL3RhNDA0LXVpJykpIHtcbiAgICAgIHJldHVybiAnY2h1bmstdGE0MDQtdWknO1xuICAgIH1cbiAgfVxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ0B5aC90YS11dGlscycpKSB7XG4gIC8vICAgcmV0dXJuICdjaHVuay11dGlscydcbiAgLy8gfVxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ0B5aC90YTQwNC11aScpKSB7XG4gIC8vICAgcmV0dXJuICdjaHVuay11aSdcbiAgLy8gfVxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9tb21lbnQnKSkge1xuICAvLyAgIHJldHVybiAndmVuZG9yLW1vbWVudCdcbiAgLy8gfVxuXG4gIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL0B5aC90YS11dGlscycpKSB7XG4gIC8vICAgcmV0dXJuICd5aC11dGlscy1tb2R1bGVzJ1xuICAvLyB9XG5cbiAgLy8gaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvdnVleCcpKSB7XG4gIC8vICAgcmV0dXJuICd2ZW5kb3ItdnVleCdcbiAgLy8gfVxuXG4gIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3Z1ZS1yb3V0ZXInKSkge1xuICAvLyAgIHJldHVybiAndmVuZG9yLXZ1ZS1yb3V0ZXInXG4gIC8vIH1cblxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy92dWUvJykpIHtcbiAgLy8gICByZXR1cm4gJ3ZlbmRvci12dWUnXG4gIC8vIH1cblxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9AeWgvaWNvbnMtc3ZnJykpIHtcbiAgLy8gICByZXR1cm4gJ3loLW90aGVyLW1vZHVsZXMnXG4gIC8vIH1cblxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9AeWgvdGE0MDQtdWkvZXMvYmlnLXRhYmxlJykpIHtcbiAgLy8gICByZXR1cm4gJ3loLTQwNC11aS1iaWctdGFibGUtbW9kdWxlcydcbiAgLy8gfVxuXG4gIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL0B5aC90YTQwNC11aScpKSB7XG4gIC8vICAgcmV0dXJuICd5aC00MDQtdWktbW9kdWxlcydcbiAgLy8gfVxuXG4gIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL2xlc3MnKSkge1xuICAvLyAgIHJldHVybiAndmVuZG9yLWxlc3MnXG4gIC8vIH1cblxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9jcnlwdG8tanMnKSkge1xuICAvLyAgIHJldHVybiAndmVuZG9yLWNyeXB0by1qcydcbiAgLy8gfVxuXG4gIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3dhbmdlZGl0b3InKSkge1xuICAvLyAgIHJldHVybiAndmVuZG9yLXdhbmctZWRpdG9yJ1xuICAvLyB9XG5cbiAgLy8gaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvanF1ZXJ5JykpIHtcbiAgLy8gICByZXR1cm4gJ3ZlbmRvci1qcXVlcnknXG4gIC8vIH1cblxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9pbnRlcmFjdGpzJykpIHtcbiAgLy8gICByZXR1cm4gJ3ZlbmRvci1pbnRlcmFjdGpzJ1xuICAvLyB9XG5cbiAgLy8gaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvanNyc2FzaWduJykpIHtcbiAgLy8gICByZXR1cm4gJ3ZlbmRvci1qc3JzYXNpZ24nXG4gIC8vIH1cblxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9wbHlyJykpIHtcbiAgLy8gICByZXR1cm4gJ3ZlbmRvci1wbHlyJ1xuICAvLyB9XG5cbiAgLy8gaWYgKGlkLmluY2x1ZGVzKCdjb21wb25lbnRzLzQwNC11aScpKSB7XG4gIC8vICAgcmV0dXJuICd2ZW5kb3ItdGE0MDQtdWknXG4gIC8vIH1cblxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcycpKSB7XG4gIC8vICAgcmV0dXJuICd2ZW5kb3InXG4gIC8vIH1cbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcRGVza3RvcFxcXFxwcm9qZWN0XFxcXHlpbmhhaVxcXFx2dWVcXFxcdGVzdDVcXFxcZGVtb1xcXFxidWlsZC12aXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcdml0ZS5wcm9kLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL2J1aWxkLXZpdGUvdml0ZS5wcm9kLnRzXCI7aW1wb3J0IHR5cGUgeyBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBidWlsZEJhc2VDb25maWcgfSBmcm9tICcuL3ZpdGUuYmFzZSc7XG5pbXBvcnQgeyBnZXRFbnYsIGlzRW52VHJ1ZSB9IGZyb20gJy4vc3JjL3V0aWxzJztcbmltcG9ydCB7IG1hbnVhbENodW5rcyB9IGZyb20gJy4vc3JjL2NodW5rcyc7XG5pbXBvcnQgdml0ZUNvbW1vbkNvbmZpZyBmcm9tICcuLi92aXRlQ29tbW9uQ29uZmlnJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1aWxkUHJvZENvbmZpZyhcbiAgbW9kZTogc3RyaW5nLFxuICBpZ25vcmVIdG1sUGx1Z2luOiBib29sZWFuID0gZmFsc2UsXG4pOiBQcm9taXNlPFVzZXJDb25maWc+IHtcbiAgY29uc3QgY29uZmlnOiBVc2VyQ29uZmlnID0gYXdhaXQgYnVpbGRCYXNlQ29uZmlnKG1vZGUsIGlnbm9yZUh0bWxQbHVnaW4pO1xuICBjb25maWcuYnVpbGQgPSB7XG4gICAgLy8gc291cmNlbWFwXHU5RUQ4XHU4QkE0XHU4QkJFXHU3RjZFXHU0RTNBZmFsc2VcbiAgICBzb3VyY2VtYXA6IGZhbHNlLFxuICAgIG91dERpcjogYCR7Z2V0RW52KCdPVVRQVVRfRElSJyl9JHtnZXRFbnYoJ1ZJVEVfUFVCTElDX1BBVEgnKX1gLFxuICAgIGVtcHR5T3V0RGlyOiB0cnVlLFxuICAgIC8vIFx1NjYyRlx1NTQyNlx1NTM4Qlx1N0YyOVx1NzUxRlx1NjIxMFx1NzY4NFx1NEVFM1x1NzgwMVxuICAgIG1pbmlmeTogdml0ZUNvbW1vbkNvbmZpZy5idWlsZC5taW5pZnksXG4gICAgY3NzTWluaWZ5OiB2aXRlQ29tbW9uQ29uZmlnLmJ1aWxkLmNzc01pbmlmeSxcbiAgfTtcbiAgaWYgKHZpdGVDb21tb25Db25maWcuYnVpbGQubWluaWZ5ID09PSAndGVyc2VyJykge1xuICAgIGNvbmZpZy5idWlsZC50ZXJzZXJPcHRpb25zID0gdml0ZUNvbW1vbkNvbmZpZy5idWlsZC50ZXJzZXJPcHRpb25zO1xuICB9XG4gIGNvbmZpZy5idWlsZC5jb21tb25qc09wdGlvbnMgPSB7XG4gICAgdHJhbnNmb3JtTWl4ZWRFc01vZHVsZXM6IHRydWUsXG4gICAgLy8gaWdub3JlRHluYW1pY1JlcXVpcmVzOiB0cnVlLFxuICAgIC8vIGR5bmFtaWNSZXF1aXJlVGFyZ2V0czogWydpbWFnZS1zaXplJ10sXG4gICAgZXhjbHVkZTogWydub2RlX21vZHVsZXMvbW9tZW50LyoqJ10sXG4gICAgZXNtRXh0ZXJuYWxzOiB0cnVlLFxuICAgIC8vIFx1NEZFRVx1NjUzOVx1OTcwMFx1ODk4MWNvbW1vbmpzXHU2M0QyXHU0RUY2XHU1OTA0XHU3NDA2XHU3Njg0XHU2NTg3XHU0RUY2XG4gICAgaW5jbHVkZTogdml0ZUNvbW1vbkNvbmZpZy5jb21tb25qcy5pbmNsdWRlLFxuICAgIGV4dGVuc2lvbnM6IHZpdGVDb21tb25Db25maWcuY29tbW9uanMuZXh0ZW5zaW9ucyxcbiAgICByZXF1aXJlUmV0dXJuc0RlZmF1bHQ6ICdhdXRvJyxcbiAgfTtcbiAgY29uZmlnLmJ1aWxkLnJvbGx1cE9wdGlvbnMgPSB7XG4gICAgb3V0cHV0OiB7XG4gICAgICBtYW51YWxDaHVua3MoaWQpIHtcbiAgICAgICAgcmV0dXJuIG1hbnVhbENodW5rcyhpZCk7XG4gICAgICB9LFxuICAgIH0sXG4gICAgdHJlZXNoYWtlOiB2aXRlQ29tbW9uQ29uZmlnLmJ1aWxkLnRyZWVzaGFrZSxcbiAgfTtcbiAgY29uc3QgdXNlRGVtYW5kSW1wb3J0ID0gaXNFbnZUcnVlKCdCVUlMRF9ERU1BTkRfVUlfSU1QT1JUJyk7XG4gIGlmICh1c2VEZW1hbmRJbXBvcnQpIHtcbiAgICBjb25maWcuYnVpbGQudGFyZ2V0ID0gWydjaHJvbWU5OSddO1xuICB9XG4gIC8vIGNvbmZpZy5jc3MucHJlcHJvY2Vzc29yTWF4V29ya2VycyA9IHRydWU7XG4gIHJldHVybiBjb25maWc7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRGVza3RvcFxcXFxwcm9qZWN0XFxcXHlpbmhhaVxcXFx2dWVcXFxcdGVzdDVcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHZpdGUucHJldmlldy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRGVza3RvcC9wcm9qZWN0L3lpbmhhaS92dWUvdGVzdDUvZGVtby9idWlsZC12aXRlL3ZpdGUucHJldmlldy50c1wiO2ltcG9ydCB0eXBlIHsgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgYnVpbGRQcm9kQ29uZmlnIH0gZnJvbSAnLi92aXRlLnByb2QnO1xuaW1wb3J0IHsgYnVpbGRQcmV2aWV3UHJveHkgfSBmcm9tICcuL3NyYy9wcm94eSc7XG4vLyBpbXBvcnQgeyBnZXRPcGVuLCB9IGZyb20gJy4vc3JjL3V0aWxzJ1xuLy8gaW1wb3J0IHsgZ2V0RW52LCB9IGZyb20gJy4vc3JjL3V0aWxzJ1xuLy8gaW1wb3J0IHsgaGlzdG9yeUFwaUZhbGxiYWNrUGx1Z2luLCB9IGZyb20gJ3ZpdGUtcGx1Z2luLXZpcnR1YWwtaHRtbCdcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1aWxkUHJldmlld0NvbmZpZyhtb2RlOiBzdHJpbmcsIGNvbW1hbmQ6IHN0cmluZyk6IFByb21pc2U8VXNlckNvbmZpZz4ge1xuICBsZXQgY29uZmlnOiBVc2VyQ29uZmlnID0ge307XG4gIGlmIChjb21tYW5kID09PSAnYnVpbGQnKSB7XG4gICAgY29uZmlnID0gYXdhaXQgYnVpbGRQcm9kQ29uZmlnKG1vZGUpO1xuICB9XG4gIGlmIChjb21tYW5kID09PSAnc2VydmUnKSB7XG4gICAgY29uZmlnLnBsdWdpbnMgPSBbXG4gICAgICAvLyBcdThGRDlcdTRFMkFcdTZDRThcdTkxQ0FcdTc2ODRcdTY2MkZcdTc1MjhcdTRFOEVcdThERUZcdTc1MzFcdTc2ODRoaXN0b3J5QVBJXHU1NkRFXHU5MDAwXHU0RUUzXHU3ODAxXG4gICAgICAvLyBcdTRGOEJcdTU5ODI6IFx1NjdEMFx1NEU5Qlx1OERFRlx1NzUzMVx1NTcyODQwNFx1NzY4NFx1NjVGNlx1NTAxOVx1NTZERVx1OTAwMFx1NTIzMGluZGV4Lmh0bWxcbiAgICAgIC8vIGhpc3RvcnlBcGlGYWxsYmFja1BsdWdpbih7XG4gICAgICAvLyAgIHJld3JpdGVzOiBbXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgZnJvbTogL2xvZ2luLmh0bWwvLFxuICAgICAgLy8gICAgICAgdG86IGdldEVudignVklURV9QVUJMSUNfUEFUSCcpICsgJ2xvZ2luLmh0bWwnLFxuICAgICAgLy8gICAgIH0sXG4gICAgICAvLyAgICAge1xuICAgICAgLy8gICAgICAgZnJvbTogLy4qLyxcbiAgICAgIC8vICAgICAgIHRvOiBnZXRFbnYoJ1ZJVEVfUFVCTElDX1BBVEgnKSArICdpbmRleC5odG1sJyxcbiAgICAgIC8vICAgICB9XG4gICAgICAvLyAgIF0sXG4gICAgICAvLyAgIHVzZVByZXZpZXc6IHRydWUsXG4gICAgICAvLyB9KVxuICAgIF07XG4gICAgY29uZmlnLnByZXZpZXcgPSB7XG4gICAgICBwcm94eTogYnVpbGRQcmV2aWV3UHJveHkoKSxcbiAgICAgIG9wZW46IGZhbHNlLFxuICAgICAgLy8gXHU5ODg0XHU4OUM4XHU2QTIxXHU1RjBGXHU0RTBCXHU3Njg0XHU3QUVGXHU1M0UzXG4gICAgICBwb3J0OiA1MTc0LFxuICAgIH07XG4gICAgY29uZmlnLnNlcnZlciA9IHtcbiAgICAgIGhvc3Q6IHRydWUsXG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBjb25maWc7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXERlc2t0b3BcXFxccHJvamVjdFxcXFx5aW5oYWlcXFxcdnVlXFxcXHRlc3Q1XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcRGVza3RvcFxcXFxwcm9qZWN0XFxcXHlpbmhhaVxcXFx2dWVcXFxcdGVzdDVcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHZpdGUubW9jay50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRGVza3RvcC9wcm9qZWN0L3lpbmhhaS92dWUvdGVzdDUvZGVtby9idWlsZC12aXRlL3ZpdGUubW9jay50c1wiO2ltcG9ydCB0eXBlIHsgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgYnVpbGRCYXNlQ29uZmlnIH0gZnJvbSAnLi92aXRlLmJhc2UnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVpbGRNb2NrQ29uZmlnKG1vZGU6IHN0cmluZyk6IFByb21pc2U8VXNlckNvbmZpZz4ge1xuICByZXR1cm4gYXdhaXQgYnVpbGRCYXNlQ29uZmlnKG1vZGUpO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgdHlwZSBDb25maWdFbnYsIGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgYnVpbGRWaXRlQ29uZmlnIH0gZnJvbSAnLi9idWlsZC12aXRlL2J1aWxkVml0ZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyhhc3luYyAoZW52OiBDb25maWdFbnYgJiB7IGlnbm9yZUh0bWxQbHVnaW46IGJvb2xlYW4gfSkgPT4ge1xuICByZXR1cm4gYnVpbGRWaXRlQ29uZmlnKGVudik7XG59KTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcRGVza3RvcFxcXFxwcm9qZWN0XFxcXHlpbmhhaVxcXFx2dWVcXFxcdGVzdDVcXFxcZGVtb1xcXFxidWlsZC12aXRlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxEZXNrdG9wXFxcXHByb2plY3RcXFxceWluaGFpXFxcXHZ1ZVxcXFx0ZXN0NVxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcYnVpbGRWaXRlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9EZXNrdG9wL3Byb2plY3QveWluaGFpL3Z1ZS90ZXN0NS9kZW1vL2J1aWxkLXZpdGUvYnVpbGRWaXRlLnRzXCI7aW1wb3J0IHR5cGUgeyBDb25maWdFbnYsIFVzZXJDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGluaXRFbnYgfSBmcm9tICcuL3NyYy91dGlscyc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWlsZFZpdGVDb25maWcoe1xuICBtb2RlLFxuICBjb21tYW5kLFxuICBpZ25vcmVIdG1sUGx1Z2luLFxufTogQ29uZmlnRW52ICYgeyBpZ25vcmVIdG1sUGx1Z2luOiBib29sZWFuIH0pOiBQcm9taXNlPFVzZXJDb25maWc+IHtcbiAgbGV0IGNvbmZpZzogVXNlckNvbmZpZyA9IHt9O1xuICBhd2FpdCBpbml0RW52KG1vZGUpO1xuICBpZiAobW9kZSA9PT0gJ2RldmVsb3BtZW50Jykge1xuICAgIC8vIGRldmVsb3BtZW50XHU2QTIxXHU1RjBGXHU1NDBDXHU2NUY2XHU3NTI4XHU0RThFZGV2XHU1NDhDb3B0aW1pemVcbiAgICBjb25maWcgPSBhd2FpdCBpbXBvcnQoJy4vdml0ZS5kZXYnKS50aGVuKCh7IGluaXQsIGJ1aWxkRGV2Q29uZmlnIH0pID0+IHtcbiAgICAgIGluaXQoKTtcbiAgICAgIHJldHVybiBidWlsZERldkNvbmZpZyhtb2RlKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChtb2RlID09PSAncHJldmlldycpIHtcbiAgICBjb25maWcgPSBhd2FpdCBpbXBvcnQoJy4vdml0ZS5wcmV2aWV3JykudGhlbigoeyBidWlsZFByZXZpZXdDb25maWcgfSkgPT4ge1xuICAgICAgcmV0dXJuIGJ1aWxkUHJldmlld0NvbmZpZyhtb2RlLCBjb21tYW5kKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChtb2RlID09PSAncHJvZHVjdGlvbicpIHtcbiAgICBjb25maWcgPSBhd2FpdCBpbXBvcnQoJy4vdml0ZS5wcm9kJykudGhlbigoeyBidWlsZFByb2RDb25maWcgfSkgPT4ge1xuICAgICAgcmV0dXJuIGJ1aWxkUHJvZENvbmZpZyhtb2RlLCBpZ25vcmVIdG1sUGx1Z2luKTtcbiAgICB9KTtcbiAgfSBlbHNlIGlmIChtb2RlID09PSAnbW9jaycpIHtcbiAgICBjb25maWcgPSBhd2FpdCBpbXBvcnQoJy4vdml0ZS5tb2NrJykudGhlbigoeyBidWlsZE1vY2tDb25maWcgfSkgPT4ge1xuICAgICAgcmV0dXJuIGJ1aWxkTW9ja0NvbmZpZyhtb2RlKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1x1NkNBMVx1NjcwOVx1NjMwN1x1NUI5QVx1NEUwMFx1NEUyQVx1NTNFRlx1NzUyOFx1NzY4NG1vZGUsXHU4QkY3XHU1QzFEXHU4QkQ1XHU5MDFBXHU4RkM3LS1tb2RlPSoqKlx1Njc2NVx1NjMwN1x1NUI5QScpO1xuICB9XG4gIHJldHVybiBjb25maWc7XG59XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7OztBQUFrVSxTQUFRLGVBQWUsV0FBVTtBQUFuVyxJQUFnTiwwQ0E4QzFNLFVBaVFDO0FBL1NQO0FBQUE7QUFBQTtBQUEwTSxJQUFNLDJDQUEyQztBQThDM1AsSUFBTSxXQUE2QjtBQUFBLE1BQ2pDLE9BQU87QUFBQSxRQUNMLE1BQU07QUFBQTtBQUFBO0FBQUEsVUFHSixLQUFLLGNBQWMsSUFBSSxJQUFJLFNBQVMsd0NBQWUsQ0FBQztBQUFBLFVBQ3BELFdBQVcsY0FBYyxJQUFJLElBQUksb0JBQW9CLHdDQUFlLENBQUM7QUFBQTtBQUFBLFVBRXJFLGtCQUFrQixjQUFjLElBQUksSUFBSSwyQkFBMkIsd0NBQWUsQ0FBQztBQUFBLFVBQ25GLFlBQVksY0FBYyxJQUFJLElBQUksZ0JBQWdCLHdDQUFlLENBQUM7QUFBQTtBQUFBLFVBRWxFLFFBQVEsRUFBQyxNQUFNLFlBQVksYUFBYSxvQkFBbUI7QUFBQSxVQUMzRCxNQUFNLEVBQUMsTUFBTSxVQUFVLGFBQWEsOEJBQTZCO0FBQUEsVUFDakUsS0FBSyxFQUFDLE1BQU0sU0FBUyxhQUFhLHNCQUFxQjtBQUFBLFVBQ3ZELE1BQU0sRUFBQyxNQUFNLFVBQVUsYUFBYSx3QkFBdUI7QUFBQSxVQUMzRCxjQUFjLEVBQUMsTUFBTSxnQkFBZ0IsYUFBYSxvQ0FBbUM7QUFBQTtBQUFBLFVBRXJGLFFBQVEsY0FBYyxJQUFJLElBQUksb0JBQW9CLHdDQUFlLENBQUM7QUFBQSxRQUNwRTtBQUFBLFFBQ0EsYUFBYSxDQUFDO0FBQUEsUUFDZCxZQUFZO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxRQVFaO0FBQUEsTUFDRjtBQUFBO0FBQUEsTUFFQSxlQUFl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QVMsUUFBUTtBQUMxQixhQUFTLE1BQU0sb0VBQXNCLEtBQUssQ0FBQyxFQUFFLGlCQUFBQyxpQkFBZ0IsTUFBTTtBQUNqRSxhQUFPQSxpQkFBZ0IsSUFBSTtBQUFBLElBQzdCLENBQUM7QUFBQSxFQUNILE9BQU87QUFDTCxVQUFNLElBQUksTUFBTSx1SEFBa0M7QUFBQSxFQUNwRDtBQUNBLFNBQU87QUFDVDs7O0FEN0JBLElBQU8sc0JBQVEsYUFBYSxPQUFPLFFBQW1EO0FBQ3BGLFNBQU8sZ0JBQWdCLEdBQUc7QUFDNUIsQ0FBQzsiLAogICJuYW1lcyI6IFsiZ2xvYiIsICJmaWxlVVJMVG9QYXRoIiwgIlBPUyIsICJfX2Rpcm5hbWUiLCAibW9kdWxlUGFnZXMiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCIsICJnbG9iIiwgInBhdGgiLCAiY2xpIiwgInVzZURlbWFuZEltcG9ydCIsICJtb2R1bGVzIiwgInBhdGgiLCAicGF0aCIsICJmc3AiLCAicGF0aCIsICJ1c2VEZW1hbmRJbXBvcnQiLCAiaW5pdCIsICJidWlsZERldkNvbmZpZyIsICJidWlsZFByZXZpZXdDb25maWciLCAiYnVpbGRQcm9kQ29uZmlnIiwgImJ1aWxkTW9ja0NvbmZpZyJdCn0K
