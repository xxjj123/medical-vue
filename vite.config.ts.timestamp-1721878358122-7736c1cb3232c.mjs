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
    __vite_injected_original_import_meta_url = "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/viteCommonConfig.ts";
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
          "@kitware/vtk.js",
          "cornerstone",
          "cornerstone-core",
          "cornerstone-wado-image-loader",
          "@cornerstonejs/dicom-image-loader"
        ]
      },
      html: [
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
import { loadEnv } from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite/dist/node/index.js";
import path from "path";
import chalk from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/chalk@5.3.0/node_modules/chalk/source/index.js";
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
import autoprefixer from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/autoprefixer@10.4.16_postcss@8.4.31/node_modules/autoprefixer/lib/autoprefixer.js";
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
import { kebabCase } from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.24.7_rollup@3.29.4_vue@2.7.16_patch_hash=hmgwvlvntssyhpqtiknghn5nei_/node_modules/unplugin-vue-components/dist/index.js";
import { mergeConfig } from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite/dist/node/index.js";
import { readFileSync } from "node:fs";
import glob from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/fast-glob@3.3.1/node_modules/fast-glob/out/index.js";
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
import { POS } from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/vite-plugin-virtual-html@1.1.16_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite-plugin-virtual-html/dist/index.mjs";
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
import glob2 from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/fast-glob@3.3.1/node_modules/fast-glob/out/index.js";
import { readdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";
import { normalizePath } from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite/dist/node/index.js";
import { POS as POS2 } from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/vite-plugin-virtual-html@1.1.16_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite-plugin-virtual-html/dist/index.mjs";
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
    __vite_injected_original_import_meta_url2 = "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/build-vite/mpa/pages.ts";
    ({ html: htmlPages, cli } = viteCommonConfig_default);
    ({ modules } = cli);
    __dirname2 = resolve(dirname(fileURLToPath2(__vite_injected_original_import_meta_url2)), "../../");
    IGNORE_NODE_MODULES_HTML = "!/node_modules/**/node_modules/**/*.html";
  }
});

// build-vite/src/replace-name/index.ts
import MagicString from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/magic-string@0.30.8/node_modules/magic-string/dist/magic-string.es.mjs";
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
import glob3 from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/fast-glob@3.3.1/node_modules/fast-glob/out/index.js";
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
import { viteCommonjs } from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/@yh+vite-plugin-commonjs@1.0.4/node_modules/@yh/vite-plugin-commonjs/dist/index.mjs";
import VirtualHtml, { historyApiFallbackPlugin } from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/vite-plugin-virtual-html@1.1.16_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite-plugin-virtual-html/dist/index.mjs";
import vue from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/@vitejs+plugin-vue2@2.3.1_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0__vue@2.7.1_gzgtz5jxowuuafre77cj6g3hmq/node_modules/@vitejs/plugin-vue2/dist/index.mjs";
import jsx from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/@vitejs+plugin-vue2-jsx@1.1.1_rollup@3.29.4_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser_cbo3lqvyyfsqnvvuncenpbxp4e/node_modules/@vitejs/plugin-vue2-jsx/dist/index.mjs";
import Inspect from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/vite-plugin-inspect@0.8.3_rollup@3.29.4_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0_/node_modules/vite-plugin-inspect/dist/index.mjs";
import { visualizer } from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/rollup-plugin-visualizer@5.9.2_rollup@3.29.4/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { viteStaticCopy } from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/vite-plugin-static-copy@1.0.0_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0_/node_modules/vite-plugin-static-copy/dist/index.js";
import legacy from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/@vitejs+plugin-legacy@5.3.0_esbuild@0.20.2_terser@5.21.0_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0_/node_modules/@vitejs/plugin-legacy/dist/index.mjs";
import virtualModule from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/vite-plugin-virtual-modules@0.2.0/node_modules/vite-plugin-virtual-modules/dist/index.mjs";
import themePreprocessorPlugin from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/@zougt+vite-plugin-theme-preprocessor@1.4.8/node_modules/@zougt/vite-plugin-theme-preprocessor/dist/index.js";
import { uiVite } from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/@yh+vite-plugin-cli-importer@0.0.5/node_modules/@yh/vite-plugin-cli-importer/dist/index.js";
import unplugin from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.24.7_rollup@3.29.4_vue@2.7.16_patch_hash=hmgwvlvntssyhpqtiknghn5nei_/node_modules/unplugin-vue-components/dist/vite.js";
import StringReplace from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/vite-plugin-string-replace@1.1.2/node_modules/vite-plugin-string-replace/dist/index.mjs";
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
        modernPolyfills: await import("file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/core-js-compat@3.33.0/node_modules/core-js-compat/index.js").then((d) => {
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
    const modernPolyfills = await import("file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/core-js-compat@3.33.0/node_modules/core-js-compat/index.js").then((d) => {
      return d.default(viteCommonConfig_default.build.polyfills).list;
    });
    const targetsWithIE = {
      ie: "11"
    };
    const legacyPolyfills = await import("file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/core-js-compat@3.33.0/node_modules/core-js-compat/index.js").then((d) => {
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
    __vite_injected_original_dirname = "D:\\ai-\u533B\u5B66\u5F71\u50CF\u9879\u76EE\\\u4EE3\u7801\\testCode\\ta404ui-152-ct\\demo\\build-vite\\src";
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
import http2 from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/vite-plugin-http2-proxy@0.4.1_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0_/node_modules/vite-plugin-http2-proxy/index.mjs";
import basicSsl from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/@vitejs+plugin-basic-ssl@1.1.0_vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0_/node_modules/@vitejs/plugin-basic-ssl/dist/index.mjs";
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
      changeOrigin: true,
      rewrite: (path5) => path5.replace(/^\/ta404\/api5\//, "")
    },
    ["^/ta404/api3/"]: {
      target: "https://demo.deepinsight.deepvessel.net/api/",
      changeOrigin: true,
      rewrite: (path5) => path5.replace(/^\/ta404\/api3\//, "")
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
import { defineConfig } from "file:///D:/ai-%E5%8C%BB%E5%AD%A6%E5%BD%B1%E5%83%8F%E9%A1%B9%E7%9B%AE/%E4%BB%A3%E7%A0%81/testCode/ta404ui-152-ct/demo/node_modules/.pnpm/vite@5.2.10_@types+node@18.18.0_less@4.2.0_terser@5.21.0/node_modules/vite/dist/node/index.js";

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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZUNvbW1vbkNvbmZpZy50cyIsICJidWlsZC12aXRlL3NyYy91dGlscy50cyIsICJidWlsZC12aXRlL3NyYy9jc3MudHMiLCAiYnVpbGQtdml0ZS9zcmMvdW5wbHVnaW4tcmVzb2x2ZXIvY2xpLWNvbXBvbmVudHMub3ZlcnJpZGUudHMiLCAibXVsdGlwbGVTZXJ2aWNlLmNvbmZpZy50cyIsICJidWlsZC12aXRlL21wYS9wYWdlcy50cyIsICJidWlsZC12aXRlL3NyYy9yZXBsYWNlLW5hbWUvaW5kZXgudHMiLCAiYnVpbGQtdml0ZS9zcmMvY29weU1vZHVsZVB1YmxpYy50cyIsICJpbnRlcm5hbC9yZXBsYWNlLWZpbGVzL3NyYy9pbmRleC50cyIsICJidWlsZC12aXRlL3NyYy9wbHVnaW4udHMiLCAiYnVpbGQtdml0ZS9zcmMvYWxpYXMudHMiLCAiYnVpbGQtdml0ZS9zcmMvZW52LnRzIiwgImJ1aWxkLXZpdGUvdml0ZS5iYXNlLnRzIiwgImJ1aWxkLXZpdGUvc3JjL3Byb3h5LnRzIiwgImJ1aWxkLXZpdGUvc3JjL29wdGltaXplRGVwcy50cyIsICJidWlsZC12aXRlL3ZpdGUub3B0aW1pemUudHMiLCAiYnVpbGQtdml0ZS92aXRlLmRldi50cyIsICJidWlsZC12aXRlL3NyYy9jaHVua3MudHMiLCAiYnVpbGQtdml0ZS92aXRlLnByb2QudHMiLCAiYnVpbGQtdml0ZS92aXRlLnByZXZpZXcudHMiLCAiYnVpbGQtdml0ZS92aXRlLm1vY2sudHMiLCAidml0ZS5jb25maWcudHMiLCAiYnVpbGQtdml0ZS9idWlsZFZpdGUudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1xcXFx2aXRlQ29tbW9uQ29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9haS0lRTUlOEMlQkIlRTUlQUQlQTYlRTUlQkQlQjElRTUlODMlOEYlRTklQTElQjklRTclOUIlQUUvJUU0JUJCJUEzJUU3JUEwJTgxL3Rlc3RDb2RlL3RhNDA0dWktMTUyLWN0L2RlbW8vdml0ZUNvbW1vbkNvbmZpZy50c1wiO2ltcG9ydCB7ZmlsZVVSTFRvUGF0aCwgVVJMfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQgdHlwZSB7QnVpbGRPcHRpb25zfSBmcm9tICd2aXRlJztcblxudHlwZSByb2xsdXBPcHRpb25zID0gTm9uTnVsbGFibGU8QnVpbGRPcHRpb25zWydyb2xsdXBPcHRpb25zJ10+O1xudHlwZSBjb21tb25qc09wdGlvbnMgPSBQaWNrPE5vbk51bGxhYmxlPEJ1aWxkT3B0aW9uc1snY29tbW9uanNPcHRpb25zJ10+LCAnaW5jbHVkZScgfCAnZXh0ZW5zaW9ucyc+O1xuZXhwb3J0IGludGVyZmFjZSBWaXRlQ29tbW9uQ29uZmlnIHtcbiAgYWxpYXM6IHtcbiAgICBiYXNlOiBSZWNvcmQ8c3RyaW5nLCBBbGlhcz47XG4gICAgZGV2ZWxvcG1lbnQ6IFJlY29yZDxzdHJpbmcsIEFsaWFzPjtcbiAgICBwcm9kdWN0aW9uOiBSZWNvcmQ8c3RyaW5nLCBBbGlhcz47XG4gIH07XG4gIGNvcHlSZXNvdXJjZXM6IEFycmF5PHtmcm9tOiBzdHJpbmc7IHRvOiBzdHJpbmd9PjtcbiAgb3Blbjogc3RyaW5nIHwgZmFsc2U7XG4gIGluY2x1ZGVTdHlsZXM6IFJlY29yZDxzdHJpbmcsIFJlY29yZDxzdHJpbmcsIHN0cmluZz4+O1xuICBjb21tb25qczogY29tbW9uanNPcHRpb25zO1xuICBidWlsZDoge1xuICAgIHRyZWVzaGFrZTogcm9sbHVwT3B0aW9uc1sndHJlZXNoYWtlJ107XG4gICAgbWluaWZ5OiBCdWlsZE9wdGlvbnNbJ21pbmlmeSddO1xuICAgIHRlcnNlck9wdGlvbnM6IEJ1aWxkT3B0aW9uc1sndGVyc2VyT3B0aW9ucyddO1xuICAgIGNzc01pbmlmeTogQnVpbGRPcHRpb25zWydjc3NNaW5pZnknXTtcbiAgICBwb2x5ZmlsbHM6IHt0YXJnZXRzOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+fTtcbiAgfTtcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogQXJyYXk8c3RyaW5nPjtcbiAgICBlbnRyaWVzOiBBcnJheTxzdHJpbmc+O1xuICAgIG5lZWRzSW50ZXJvcDogQXJyYXk8c3RyaW5nPjtcbiAgICBleGNsdWRlOiBBcnJheTxzdHJpbmc+O1xuICB9O1xuICBodG1sOiBBcnJheTxzdHJpbmcgfCB7cGF0aDogc3RyaW5nOyBlbnRyeTogc3RyaW5nfT47XG4gIGNsaToge1xuICAgIG1vZHVsZXM6IEFycmF5PHN0cmluZz47XG4gICAgb3ZlcnJpZGU6IE92ZXJyaWRlO1xuICAgIGhpc3RvcnlQYWdlOiBBcnJheTxzdHJpbmc+O1xuICAgIGh0bWw6IHtcbiAgICAgIHRpdGxlOiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xuICAgIH07XG4gICAgZmlsZXM6IEFycmF5PHtmaWxlOiBzdHJpbmc7IG5ld0ZpbGU6IHN0cmluZ30+O1xuICB9O1xuICBtcGE6IEFycmF5PHN0cmluZz4gfCB0cnVlO1xufVxuZXhwb3J0IGRlY2xhcmUgdHlwZSBBbGlhcyA9IHN0cmluZyB8IHtmaW5kOiBSZWdFeHAgfCBzdHJpbmc7IHJlcGxhY2VtZW50OiBzdHJpbmd9O1xuXG5leHBvcnQgaW50ZXJmYWNlIE92ZXJyaWRlIHtcbiAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgT3ZlcnJpZGU7XG59XG5cbmNvbnN0IF9kZWZhdWx0OiBWaXRlQ29tbW9uQ29uZmlnID0ge1xuICBhbGlhczoge1xuICAgIGJhc2U6IHtcbiAgICAgIC8vIFx1Njg0Nlx1NjdCNlx1NTdGQVx1Nzg0MFx1NzY4NGFsaWFzXG4gICAgICAvLyBcdThGRDlcdTkxQ0NcdTRGN0ZcdTc1MjhcdTY1QjlcdTZDRDVcdTZCRDRcdThGODNcdTU5MERcdTY3NDIsXHU4RkQ5XHU2NjJGXHU0RTNBXHU0RTg2XHU1NzI4V2Vic3Rvcm0oXHU5NzAwXHU4OTgxMjAyMi4zKVx1NEUyRFx1NTNFRlx1NEVFNVx1OTAxQVx1OEZDN1x1OUYyMFx1NjgwN1x1NzBCOVx1NTFGQmltcG9ydFx1OEJFRFx1NTNFNVx1NEUyRFx1NzY4NGFsaWFzXHU3NkY0XHU2M0E1XHU4RkRCXHU1MTY1XHU3NkY4XHU1RTk0XHU3Njg0XHU2NTg3XHU0RUY2XG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgICdAY29tbW9uJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL2NsaS9jb21tb24vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAvLyAnQGNvbW1vbic6ICdAeWgvY2xpLWludGVybmFsLWNvbW1vbi9zcmMnLFxuICAgICAgJ0Bwcm9qZWN0Q29tbW9uJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL2NsaS9wcm9qZWN0Q29tbW9uL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxuICAgICAgZmFjZUNvbmZpZzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL2ZhY2VDb25maWcnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICAgIC8vIFx1NUMwNlx1N0IyQ1x1NEUwOVx1NjVCOVx1NkEyMVx1NTc1N1x1NjMwN1x1NTQxMVx1NTE3Nlx1NUJGOVx1NUU5NFx1NzY4NEVTXHU2QTIxXHU1NzU3XHU2NTg3XHU0RUY2XG4gICAgICBtb21lbnQ6IHtmaW5kOiAvXm1vbWVudCQvLCByZXBsYWNlbWVudDogJ21vbWVudC9zcmMvbW9tZW50J30sXG4gICAgICBsZXNzOiB7ZmluZDogL15sZXNzJC8sIHJlcGxhY2VtZW50OiAnbGVzcy9saWIvbGVzcy1icm93c2VyL2luZGV4J30sXG4gICAgICB2dWU6IHtmaW5kOiAvXnZ1ZSQvLCByZXBsYWNlbWVudDogJ3Z1ZS9kaXN0L3Z1ZS5lc20uanMnfSxcbiAgICAgIHZ1ZXg6IHtmaW5kOiAvXnZ1ZXgkLywgcmVwbGFjZW1lbnQ6ICd2dWV4L2Rpc3QvdnVleC5lc20uanMnfSxcbiAgICAgICd2dWUtcm91dGVyJzoge2ZpbmQ6IC9ednVlLXJvdXRlciQvLCByZXBsYWNlbWVudDogJ3Z1ZS1yb3V0ZXIvZGlzdC92dWUtcm91dGVyLmVzbS5qcyd9LFxuICAgICAgLy8gXHU1RjAzXHU3NTI4OiBjb21tb24gXHU1MjJCXHU1NDBEXHU1REYyXHU1RjAzXHU3NTI4LFx1OEJGN1x1NEY3Rlx1NzUyOEBjb21tb25cdTUyMkJcdTU0MEQsXHU3NTU5XHU1NzI4XHU4RkQ5XHU5MUNDXHU1M0VBXHU2NjJGXHU0RTNBXHU0RTg2XHU1MTdDXHU1QkI5LFx1NTQwRVx1NjcxRlx1NEYxQVx1NzlGQlx1OTY2NFxuICAgICAgY29tbW9uOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vY2xpL2NvbW1vbi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcbiAgICB9LFxuICAgIGRldmVsb3BtZW50OiB7fSxcbiAgICBwcm9kdWN0aW9uOiB7XG4gICAgICAvLyBcdTU3MjhcdTc1MUZcdTRFQTdcdTY1RjZcdTY3MUZcdTVDMDZAeWgvdGEtdXRpbHNcdTYzMDdcdTU0MTF1dGlscy5lc20udHNcbiAgICAgIC8vIFx1OEZEOVx1NEUyQVx1NjU4N1x1NEVGNlx1NTNFQVx1NTMwNVx1NTQyQkVTTVx1NEUwQlx1NzY4NGltcG9ydC9leHBvcnQoXHU1MTc3XHU1NDBEZXhwb3J0KVxuICAgICAgLy8gXHU1M0VGXHU0RUU1XHU1NzI4XHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU0RTBCXHU0RjdGXHU3NTI4dHJlZS1zaGFraW5nXHU1QzA2XHU2NzJBXHU0RjdGXHU3NTI4XHU3Njg0XHU1REU1XHU1MTc3XHU0RUUzXHU3ODAxXHU3OUZCXHU5NjY0XG4gICAgICAvLyAnQHloL3RhLXV0aWxzJzoge1xuICAgICAgLy8gICBmaW5kOiAvXkB5aFxcL3RhLXV0aWxzJC8sXG4gICAgICAvLyAgIHJlcGxhY2VtZW50OiAnQHloL2NsaS1pbnRlcm5hbC1jb21tb24vc3JjL3V0aWxzLmVzbS50cycsXG4gICAgICAvLyB9LFxuICAgIH0sXG4gIH0sXG4gIC8vIFx1N0IyQ1x1NEUwOVx1NjVCOVx1OEQ0NFx1NkU5MFx1NTkwRFx1NTIzNlx1NTIzMFx1NzUxRlx1NjIxMFx1NzY4NGRpc3RcdTRFMkRcbiAgY29weVJlc291cmNlczogW1xuICAgIHtcbiAgICAgIGZyb206ICdub2RlX21vZHVsZXMvQHloL3RhNDA0LXVpL3N0YXRpYy8qJywgLy8gXHU2NzY1XHU2RTkwXHU4REVGXHU1Rjg0LFx1NzZGOFx1NUJGOVx1NEU4RVx1OTg3OVx1NzZFRVx1NjgzOVx1OERFRlx1NUY4NFx1NzY4NFx1NzZGOFx1NUJGOVx1OERFRlx1NUY4NFxuICAgICAgdG86ICdzdGF0aWMnLCAvLyBkaXN0XHU3NkVFXHU1RjU1XHU0RTBCXHU3Njg0XHU4REVGXHU1Rjg0XG4gICAgfSxcbiAgXSxcbiAgLy8gZGV2L3ByZXZpZXdcdTY3MDlcdTY1NDgsIFx1NzUyOFx1NEU4RVx1NTcyOGRldi9wcmV2aWV3XHU2NUY2XHU4MUVBXHU1MkE4XHU2MjUzXHU1RjAwXHU2NTg3XHU0RUY2XG4gIC8vIFx1OEJCRVx1N0Y2RVx1NjIxMGZhbHNlXHU1M0VGXHU3OTgxXHU3NTI4XG4gIG9wZW46IGZhbHNlLFxuICAvLyBcdTU3MjhcdThGRDlcdTkxQ0NcdTg5ODZcdTc2RDZcdTc1MzFcdTRFOEVcdTRFM0JcdTk4OThcdTYzNjJcdTgwQTRcdTVCRkNcdTgxRjRcdTc2ODRcdTY4MzdcdTVGMEZcdTg5ODZcdTc2RDZcbiAgaW5jbHVkZVN0eWxlczoge1xuICAgICcuYW50LWZ1bGxjYWxlbmRhci1mdWxsc2NyZWVuIC5hbnQtZnVsbGNhbGVuZGFyLXNlbGVjdGVkLWRheSAuYW50LWZ1bGxjYWxlbmRhci12YWx1ZSc6IHtcbiAgICAgIGNvbG9yOiAnI0ZGRkZGRicsXG4gICAgfSxcbiAgICAnLmFudC1idG4tcHJpbWFyeTpob3ZlciwgLmFudC1idG4tcHJpbWFyeTpmb2N1cyc6IHtcbiAgICAgIGNvbG9yOiAnI0ZGRkZGRicsXG4gICAgfSxcbiAgICAnLnRhLXRhZy1zZWxlY3QgLnRhZy1zZWxlY3QtYnRuOmhvdmVyJzoge1xuICAgICAgY29sb3I6ICcjMUI2NUI5JyxcbiAgICB9LFxuICAgIC8vIGJ1dHRvbiBcdTc2ODQgbGluayBcdTVDNUVcdTYwMjdcdTRGMUFcdTg4QUJcdTRFM0JcdTk4OThcdTYzNjJcdTgwQTRcdTg5ODZcdTc2RDZcbiAgICAnLmFudC1idG4tbGluazpob3ZlciwgLmFudC1idG4tbGluazpmb2N1cyc6IHtcbiAgICAgICdib3JkZXItY29sb3InOiAndHJhbnNwYXJlbnQnLFxuICAgIH0sXG4gICAgLy8gXHU3RUNGXHU1MjlFXHU2NzQzXHU5NjUwXHU3QkExXHU3NDA2Plx1NjVCMFx1NTg5RVx1ODlEMlx1ODI3Mlx1NzY4NCBzdGVwIFx1NjgzN1x1NUYwRlx1ODhBQlx1NEUzQlx1OTg5OFx1NjM2Mlx1ODBBNFx1ODk4Nlx1NzZENlxuICAgICcuYW50LXN0ZXBzLWl0ZW0tcHJvY2VzcyAuYW50LXN0ZXBzLWl0ZW0taWNvbiA+IC5hbnQtc3RlcHMtaWNvbic6IHtcbiAgICAgIGNvbG9yOiAnI0ZGRicsXG4gICAgfSxcbiAgfSxcbiAgLy8gXHU3RUQ5IGRldiBcdTU0OEMgcHJvZCBcdTczQUZcdTU4ODNcdTRGN0ZcdTc1MjhcdTc2ODQgY29tbW9uanMgXHU5MTREXHU3RjZFXG4gIGNvbW1vbmpzOiB7XG4gICAgLy8gXHU1NDBDXHU2NUY2XHU3RUQ5IGRldiBcdTU0OEMgcHJvZCBcdTczQUZcdTU4ODNcdTRGN0ZcdTc1MjhcdTc2ODQgY29tbW9uanMuaW5jbHVkZSBcdTkxNERcdTdGNkVcbiAgICAvLyBcdTZDRThcdTYxMEY6IFx1OEZEOVx1OTFDQ1x1NjYyRlx1NEVFNVx1NEUwMFx1NEUyQVx1NzZFRVx1NUY1NVx1NEUzQVx1NTdGQVx1NjcyQ1x1NTM1NVx1NEY0RCxcdTRFMTRcdTVGQzVcdTk4N0JcdTY2MkZcdThGRDlcdTY4MzdcdTc2ODRcdTUxOTlcdTZDRDVcbiAgICAvLyBcdTU3MjggZGV2IFx1NjVGNlx1NjcxRixcdThGRDlcdTRFMkFcdTkxNERcdTdGNkVcdTRGMUFcdTg4QUJcdTc5RkJcdTk2NjRcdTU5MzRcdTVDM0VcdTc2ODQqKlxuICAgIC8vIFx1NTcyOCBwcm9kIFx1NjVGNlx1NjcxRixcdThGRDlcdTRFMkFcdTkxNERcdTdGNkVcdTRGMUFcdTUzOUZcdTVDMDFcdTRFMERcdTUyQThcdTc2ODRcdTRGMjBcdTkwMTJcdTdFRDkgYnVpbGQuY29tbW9uanNPcHRpb25zLmluY2x1ZGVcbiAgICBpbmNsdWRlOiBbJyoqL25vZGVfbW9kdWxlcy8qKicsICcqKi9jbGkvKionLCAnKiovaW50ZXJuYWwvKionLCAnKiovcGFnZXMvKionLCAnKiovc3JjLyoqJ10sXG4gICAgLy8gXHU0RUM1XHU3NTI4XHU0RThFIHByb2QgXHU2NUY2XHU2NzFGXHU3Njg0XHU5MTREXHU3RjZFLFx1NzUyOFx1NEU4RVx1NjMwN1x1NUI5QVx1NTRFQVx1NEU5Qlx1NjU4N1x1NEVGNlx1NEYxQVx1ODhBQiBjb21tb25qcyBcdTYzRDJcdTRFRjZcdTU5MDRcdTc0MDZcbiAgICBleHRlbnNpb25zOiBbJy5qcycsICdjanMnLCAnLnZ1ZScsICcuanN4JywgJy50cycsICcuY3RzJywgJy50c3gnXSxcbiAgfSxcbiAgYnVpbGQ6IHtcbiAgICBtYXhNZW1vcnk6IDgxOTIsIC8vIDhHQlxuICAgIC8vIFx1NjYyRlx1NTQyNlx1NUJGOVx1NzUxRlx1NjIxMFx1NzY4NFx1NEVFM1x1NzgwMVx1OEZEQlx1ODg0Q3RyZWUtc2hha2luZ1x1NEYxOFx1NTMxNlxuICAgIC8vIFx1OEJCRVx1N0Y2RVx1OEZEOVx1NEUyQVx1NTAzQ1x1NEUzQWZhbHNlLFx1NTNFRlx1ODBGRFx1NTNFRlx1NEVFNVx1ODlFM1x1NTFCM1x1NEUwMFx1OTBFOFx1NTIwNlx1NzUzMVx1NEU4RXRyZWUtc2hha2luZ1x1NUJGQ1x1ODFGNFx1NzY4NFx1NEVFM1x1NzgwMVx1NEUyMlx1NTkzMVx1N0I0OVx1OTVFRVx1OTg5OFxuICAgIC8vIFx1OEJCRVx1N0Y2RVx1NEUzQXRydWUsIFx1NTNFRlx1ODBGRFx1NTNFRlx1NEVFNVx1NjNEMFx1NTM0N1x1OTg3NVx1OTc2Mlx1NjAyN1x1ODBGRChcdTkwMUFcdThGQzdcdTc5RkJcdTk2NjRcdTZDQTFcdTY3MDlcdTRGN0ZcdTc1MjhcdTc2ODRcdTRFRTNcdTc4MDFcdTdCNDlcdTY0Q0RcdTRGNUMpXG4gICAgdHJlZXNoYWtlOiB0cnVlLFxuICAgIC8vIFx1NjYyRlx1NTQyNlx1NEY3Rlx1NzUyOFx1NEVFM1x1NzgwMVx1NTM4Qlx1N0YyOSxcdTUzRUZcdTkwMDlcdTUwM0M6IGZhbHNlLyd0ZXJzZXInLydlc2J1aWxkJ1xuICAgIC8vIGZhbHNlOiBcdTc5ODFcdTc1MjhcdTRFRTNcdTc4MDFcdTUzOEJcdTdGMjlcbiAgICAvLyAndGVyc2VyJy8nZXNidWlsZCc6IFx1NEY3Rlx1NzUyOFx1NUJGOVx1NUU5NFx1NzY4NFx1NURFNVx1NTE3N1x1OEZEQlx1ODg0Q1x1NEVFM1x1NzgwMVx1NTM4Qlx1N0YyOVxuICAgIG1pbmlmeTogZmFsc2UsXG4gICAgLy8gXHU0RjdGXHU3NTI4dGVyc2VyXHU2NUY2LFx1NEYyMFx1OTAxMlx1N0VEOXRlcnNlclx1NzY4NFx1NEZFMVx1NjA2RlxuICAgIHRlcnNlck9wdGlvbnM6IHtcbiAgICAgIC8vIFx1NTE3N1x1NEY1M1x1NzY4NFx1OTE0RFx1N0Y2RVx1NTNFRlx1NTNDMlx1ODAwMzogaHR0cHM6Ly90ZXJzZXIub3JnL2RvY3MvYXBpLXJlZmVyZW5jZSNtaW5pZnktb3B0aW9uc1xuICAgIH0sXG4gICAgLy8gXHU2NjJGXHU1NDI2XHU1MzhCXHU3RjI5Y3NzXHU0RUUzXHU3ODAxLFx1NTNFRlx1OTAwOVx1NTAzQzogZmFsc2UvJ2xpZ2h0bmluZ2NzcycvJ2VzYnVpbGQnXG4gICAgLy8gZmFsc2U6IFx1Nzk4MVx1NzUyOFx1NEVFM1x1NzgwMVx1NTM4Qlx1N0YyOVxuICAgIC8vICdsaWdodG5pbmdjc3MnLydlc2J1aWxkJzogXHU0RjdGXHU3NTI4XHU1QkY5XHU1RTk0XHU3Njg0XHU1REU1XHU1MTc3XHU4RkRCXHU4ODRDXHU0RUUzXHU3ODAxXHU1MzhCXHU3RjI5XG4gICAgLy8gRklYTUU6IFx1NzZFRVx1NTI0RCdsaWdodG5pbmdjc3MnXHU0RTBEXHU1M0VGXHU3NTI4LFx1NEYxQVx1NjJBNVx1OTUxOVxuICAgIGNzc01pbmlmeTogJ2VzYnVpbGQnLFxuICAgIC8vIFx1NjMwOVx1OTcwMFx1NTJBMFx1OEY3RHBvbHlmaWxscywgXHU2QjY0XHU1OTA0XHU4QkJFXHU3RjZFXHU3Njg0XHU2NjJGXHU2RDRGXHU4OUM4XHU1NjY4XHU3Njg0XHU2NzAwXHU0RjRFXHU3MjQ4XHU2NzJDXG4gICAgLy8gXHU1M0VBXHU5NzAwXHU4OTgxXHU5MTREXHU3RjZFXHU3M0IwXHU0RUUzXHU2RDRGXHU4OUM4XHU1NjY4XHU3Njg0XHU2NzAwXHU0RjRFXHU3MjQ4XHU2NzJDXG4gICAgLy8gSUVcdTUxN0NcdTVCQjlcdTkwMUFcdThGQzdCVUlMRF9MRUdBQ1lcdTUzRDhcdTkxQ0ZcdTgxRUFcdTUyQThcdTZDRThcdTUxNjVpZTogJzExJ1x1OTE0RFx1N0Y2RSxcdTRFMTRcdTRFQzVcdTUxN0NcdTVCQjlJRTExXG4gICAgLy8gXHU2Q0U4XHU2MTBGOiBcdTUxN0NcdTVCQjlcdTkxNERcdTdGNkVcdTRFQzVcdTY1MkZcdTYzMDFcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODMsXHU1RjAwXHU1M0QxXHU2NUY2XHU0RTBEXHU4RkRCXHU4ODRDXHU2NTJGXHU2MzAxXG4gICAgcG9seWZpbGxzOiB7XG4gICAgICB0YXJnZXRzOiB7XG4gICAgICAgIGNocm9tZTogJzY0JyxcbiAgICAgIH0sXG4gICAgfSxcbiAgfSxcbiAgb3B0aW1pemVEZXBzOiB7XG4gICAgaW5jbHVkZTogW1xuICAgICAgLy8gXHU0RTBEXHU2NUI5XHU0RkJGXHU2MjE2XHU0RTBEXHU4MEZEXHU3NkY0XHU2M0E1XHU1MTk5XHU1MjMwL2J1aWxkLXZpdGUvb3B0aW1pemUvb3B0aW1pemUudHNcdTY1ODdcdTRFRjZcdTRFMkRcdTc2ODRcdTRGOURcdThENTZcbiAgICAgIC8vIFx1NEY4Qlx1NTk4Mlx1NjdEMFx1NEUyQVx1NEY5RFx1OEQ1Nlx1NzZGNFx1NjNBNVx1NEY5RFx1OEQ1Nlx1NzY4NFx1NjdEMFx1NEUyQVx1NEY5RFx1OEQ1Nlx1OTcwMFx1ODk4MVx1NjNEMFx1NTI0RFx1NEYxOFx1NTMxNixcdTRGNDZcdThGRDlcdTRFMkFcdTRGOURcdThENTZcdTRFMERcdTY2MkZcdTY4NDZcdTY3QjZcdTY3MkNcdThFQUJcdTc2ODRcdTRGOURcdThENTZcbiAgICAgICdAeWgvY2xpLXBhZ2VzLWluZGV4ID4gQHdjamlhbmcvbm90aWZ5JyxcbiAgICAgICdAeWgvY2xpLXBhZ2VzLW9yZ3VzZXIgPiB2dWUtY29va2llcycsXG4gICAgXSxcbiAgICBlbnRyaWVzOiBbXG4gICAgICAvLyBcdTlFRDhcdThCQTRcdTYwQzVcdTUxQjVcdTRFMEIsXHU0RjFBXHU4QkZCXHU1M0Q2aHRtbFx1OTE0RFx1N0Y2RSxcdTVFNzZcdTVDMDZcdTYyNDBcdTY3MDlodG1sXHU2NTg3XHU0RUY2XHU2NTNFXHU1MjMwXHU2QjY0XHU5MTREXHU3RjZFXHU0RTJELFxuICAgICAgLy8gXHU2QjY0XHU1OTA0XHU1M0VGXHU0RUU1XHU2REZCXHU1MkEwXHU2Q0ExXHU2NzA5XHU5MTREXHU3RjZFXHU1MjMwaHRtbFx1NEUyRFx1NzY4NFx1NEY0Nlx1NjYyRlx1OTcwMFx1ODk4MVx1OEJCRlx1OTVFRVx1NzY4NGh0bWxcdTY1ODdcdTRFRjZcbiAgICAgIC8vIFx1NEUwMFx1ODIyQ1x1Njc2NVx1OEJGNCxcdTRGNjBcdTRFMERcdTk3MDBcdTg5ODFcdTVCRjlcdThGRDlcdTRFMkFcdTY1NzBcdTdFQzRcdThGREJcdTg4NENcdTRGRUVcdTY1MzlcbiAgICBdLFxuICAgIG5lZWRzSW50ZXJvcDogW1xuICAgICAgLy8gXHU1RjUzXHU0RjYwXHU3Njg0XHU2M0E3XHU1MjM2XHU1M0YwXHU4RjkzXHU1MUZBXHU3QzdCXHU0RjNDXHU2QjY0XHU0RkUxXHU2MDZGXHU2NUY2XHU1M0VGXHU1QzA2XHU0RjlEXHU4RDU2KFx1NjU4N1x1NEVGNilcdTZERkJcdTUyQTBcdTUyMzBcdThGRDlcdTkxQ0NcbiAgICAgIC8vIE1peGVkIEVTTSBhbmQgQ0pTIGRldGVjdGVkIGluIEB5aC90YS11dGlscy9jcm9zc0RvbWFpbiwgYWRkIGl0IHRvIG9wdGltaXplRGVwcy5uZWVkc0ludGVyb3AgdG8gc3BlZWQgdXAgY29sZCBzdGFydFxuICAgICAgLy8gXHU1QjgzXHU0RjFBXHU5ODg0XHU3RjE2XHU4QkQxXHU0RjlEXHU4RDU2XG4gICAgICAnQHloL3RhLXV0aWxzL2Nyb3NzRG9tYWluJyxcbiAgICBdLFxuICAgIGV4Y2x1ZGU6IFtcbiAgICAgIC8vIFx1NTcyOFx1NEYxOFx1NTMxNlx1NjVGNixcdTk3MDBcdTg5ODFcdTYzOTJcdTk2NjRcdTc2ODRcdTRFMDBcdTRFOUJcdTRFMERcdTk3MDBcdTg5ODFcdTRGMThcdTUzMTZcdTc2ODRcdTRGOURcdThENTZcdTYyMTZcdTg2NUFcdTYyREZcdTZBMjFcdTU3NTcsXHU0RUU1XHU5MDdGXHU1MTREXHU0RjE4XHU1MzE2XHU2NzFGXHU5NUY0XHU2MkE1XHU5NTE5XG4gICAgICAndmlydHVhbDpkeW5hbWljVGhlbWUnLFxuICAgICAgJ3ZpcnR1YWw6dGhlbWVEZWZpbml0aW9ucycsXG4gICAgICAndmlydHVhbDpkeW5hbWljSTE4bicsXG4gICAgICAndmlydHVhbDpoaXN0b3J5UGFnZScsXG4gICAgICAndmlydHVhbDpkYXJrTW9kZScsXG4gICAgICAndmlydHVhbDplbGRlcmx5JyxcbiAgICAgICdAaXRrLXdhc20vZGljb20nLFxuICAgICAgJ2l0ay13YXNtJyxcbiAgICAgICdpdGsnLFxuICAgICAgJ0BraXR3YXJlL3Z0ay5qcycsXG4gICAgICAnY29ybmVyc3RvbmUnLFxuICAgICAgJ2Nvcm5lcnN0b25lLWNvcmUnLFxuICAgICAgJ2Nvcm5lcnN0b25lLXdhZG8taW1hZ2UtbG9hZGVyJyxcbiAgICAgICdAY29ybmVyc3RvbmVqcy9kaWNvbS1pbWFnZS1sb2FkZXInXG4gICAgXSxcbiAgfSxcbiAgaHRtbDogW1xuICAgIC8vIFx1OTE0RFx1N0Y2RVx1OTcwMFx1ODk4MVx1OEZEQlx1ODg0Q1x1NTJBMFx1OEY3RFx1NzY4NGh0bWxcbiAgICAvLyBcdTVGQzVcdTk4N0JcdTRFRTUvXHU2MjE2IVx1NUYwMFx1NTkzNFxuICAgIC8vIFx1NTNFRlx1NEVFNVx1NzZGNFx1NjNBNVx1NjMwN1x1NUI5QVx1NEUwMFx1NEUyQWh0bWxcdTY1ODdcdTRFRjZcdTc2ODRcdTVCOENcdTY1NzRcdThERUZcdTVGODRcbiAgICAvLyBcdTRGOEJcdTU5ODI6XG4gICAgLy8gJy9zcmMvc2NvcGVzL2NvcmUvb3JnTW9kdWxlcy9vcmd1c2VyL29yZ3VzZXIuaHRtbCdcbiAgICAvLyBcdTYzQThcdTgzNTBcdTRFRTVcdThGRDlcdTc5Q0RcdTY1QjlcdTVGMEZcdThGREJcdTg4NENcdTkxNERcdTdGNkVcbiAgICAvLyBcdTU3MjhcdTY3RDBcdTRFMkFcdTc2RUVcdTVGNTVcdTRFMEJodG1sXHU2NTg3XHU0RUY2XHU4RkM3XHU1OTFBXHU2NUY2LFx1NEU1Rlx1NTNFRlx1NEVFNVx1NjNEMFx1NEY5Qlx1NEUwMFx1NEUyQWdsb2JcdTY3NjVcdThGREJcdTg4NENcdTkxNERcdTdGNkVcbiAgICAvLyBcdTUxNzZcdTRFMkQ6ICoqXHU4ODY4XHU3OTNBXHU0RTAwXHU1QzQyXHU2MjE2XHU1OTFBXHU1QzQyXHU0RTJEXHU5NUY0XHU3NkVFXHU1RjU1LCpcdTg4NjhcdTc5M0FcdTRFRkJcdTYxMEZcdTY1ODdcdTRFRjZcdTU0MERcbiAgICAvLyAnL3NyYy9zY29wZXMvY29yZS8qKi8qLmh0bWwnXG4gICAgLy8gXHU2MzkyXHU5NjY0XHU2N0QwXHU0RTlCXHU2NTg3XHU0RUY2XG4gICAgLy8gJyEvc3JjL2NvcmVQYWdlLyoqL3VpcmVkaXJlY3QuaHRtbCdcbiAgICAvLyBcdTZDRThcdTYxMEYxOiBcdTUzRUFcdTY3MDlcdTkxNERcdTdGNkVcdTU3MjhcdThGRDlcdTkxQ0MoYGh0bWxgKVx1NjIxNmBjbGkubW9kdWxlc2BcdTRFMEJcdTYyMTZgLnBucG0vcGFnZXMuY2pzYFx1NEUwQlx1NzY4NGh0bWxcdTZBMjFcdTU3NTdcdTUzRUZcdTRFRTVcdTg4QUJ2aXRlLXBsdWdpbi12aXJ0dWFsLWh0bWxcdTYzRDJcdTRFRjZcdTg5RTNcdTY3OTBcdTVFNzZcdTUyQTBcdThGN0RcbiAgICAvLyBcdTZDRThcdTYxMEYyOiBcdTkxNERcdTdGNkVcdTVFOTRcdThCRTVcdTRFRTUvXHU2MjE2IVx1NUYwMFx1NTkzNFxuICAgIC8vIFx1OUFEOFx1N0VBN1x1OTE0RFx1N0Y2RTpcbiAgICAvLyBcdTU5ODJcdTY3OUNcdTRGNjBcdTk3MDBcdTg5ODFcdTVDMDZodG1sXHU2NTg3XHU0RUY2XHU2NTNFXHU3RjZFXHU1MjMwXHU0RTAwXHU0RTJBXHU3Mjc5XHU1QjlBXHU3Njg0XHU3NkVFXHU1RjU1XHU0RTBCXHU4RkRCXHU4ODRDXHU4QkJGXHU5NUVFXHU2NUY2XG4gICAgLy8gXHU2MjE2XG4gICAgLy8gXHU5ODc5XHU3NkVFXHU0RTJEXHU2NzA5XHU1OTFBXHU0RTJBXHU1NDBDXHU1NDBEXHU3Njg0aHRtbFx1NzY4NFx1NjU4N1x1NEVGNlx1NjVGNlxuICAgIC8vIFx1NjIxNlxuICAgIC8vIFx1NjdEMFx1NEUyQWh0bWxcdTY1ODdcdTRFRjZcdTU3MjhcdTY3MDBcdTdFQzhcdThCQkZcdTk1RUVcdTY1RjZcdTc2ODRcdTU0MERcdTc5RjBcdTRFMEVcdTk4NzlcdTc2RUVcdTRFMkRcdTc2ODRodG1sXHU2NTg3XHU0RUY2XHU3Njg0XHU1NDBEXHU3OUYwXHU0RTBEXHU0RTAwXHU4MUY0XHU2NUY2XG4gICAgLy8gXHU2QjY0XHU2NUY2LFx1NEY2MFx1NTNFRlx1NEVFNVx1OTAxQVx1OEZDN1x1NEYyMFx1NTE2NVx1NUJGOVx1OEM2MVx1Njc2NVx1NTIwNlx1NTIyQlx1NUJGOVx1NkJDRlx1NEUyQWh0bWxcdTk4NzVcdTk3NjJcdThGREJcdTg4NENcdTUzNTVcdTcyRUNcdTc2ODRcdTkxNERcdTdGNkVcbiAgICAvLyBcdTRGOEJcdTU5ODJcdTRFMEJcdTk3NjJcdTc2ODRcdTUxRTBcdTRFMkFcdTRGOEJcdTVCNTAsXHU1NzI4XHU2NzAwXHU3RUM4XHU3NTFGXHU2MjEwXHU3Njg0XHU2NUY2XHU1MDE5XG4gICAgLy8gXHU0RjhCMTogXHU0RjdGXHU3NTI4XHU4REVGXHU1Rjg0IGh0dHA6Ly9sb2NhbGhvc3Q6NTE3My9kZW1vL2xvZ2luMS5odG1sIFx1OEJCRlx1OTVFRVx1OTg3NVx1OTc2MlxuICAgIC8vIHtcbiAgICAvLyAgIHBhdGg6ICdkZW1vL2xvZ2luMScsXG4gICAgLy8gICBlbnRyeTogJy9zcmMvY29yZVBhZ2UvbG9naW4vbG9naW4uaHRtbCcsXG4gICAgLy8gfSxcbiAgICAvLyBcdTRGOEIyOiBcdTRGN0ZcdTc1MjhcdThERUZcdTVGODQgaHR0cDovL2xvY2FsaG9zdDo1MTczL2xvZ2luMi5odG1sIFx1OEJCRlx1OTVFRVx1OTg3NVx1OTc2MlxuICAgIC8vIHtcbiAgICAvLyAgIHBhdGg6ICdsb2dpbjEnLFxuICAgIC8vICAgZW50cnk6ICcvc3JjL2NvcmVQYWdlL2xvZ2luL2xvZ2luLmh0bWwnLFxuICAgIC8vIH1cbiAgXSxcbiAgY2xpOiB7XG4gICAgLy8gXHU2Q0U4XHU2MTBGMTogXHU4RkQ5XHU5MUNDXHU5MTREXHU3RjZFXHU3Njg0XHU2NjJGXHU2NTNFXHU3RjZFXHU1NzI4KC9zcmMvcHJvamVjdClcdTc2RUVcdTVGNTVcdTRFMEJcdTc2ODRcdTZBMjFcdTU3NTdcdTc2ODRodG1sXHU2NTg3XHU0RUY2XG4gICAgLy8gXHU2Q0U4XHU2MTBGMjogXHU4RkQ5XHU5MUNDXHU5MTREXHU3RjZFXHU3Njg0XHU2QTIxXHU1NzU3XHU0RjFBXHU0RjVDXHU0RTNBaHRtbFx1NjNEMlx1NEVGNlx1NzY4NFx1OTE0RFx1N0Y2RVx1NkNFOFx1NTE2NVx1NEUwMFx1NEUyQWdsb2IsXHU0RjhCXHU1OTgyOiAvc3JjL3Byb2plY3QvKiovZGVtb1Rlc3QuaHRtbFxuICAgIC8vIFx1NkNFOFx1NjEwRjM6IFx1NTk4Mlx1Njc5Q1x1NTcyOCgvc3JjL3Byb2plY3QpXHU3NkVFXHU1RjU1XHU0RTBCLFx1NjcwOVx1NTkxQVx1NEUyQVx1NzZGOFx1NTQwQ1x1NTQwRFx1NUI1N1x1NzY4NGh0bWxcdTY1ODdcdTRFRjYsXHU5MEEzXHU0RTQ4XHU0RjYwXHU1RkM1XHU5ODdCXHU1NzI4XHU0RTBBXHU5NzYyXHU3Njg0YGh0bWxgXHU5MTREXHU3RjZFXHU0RTJEXHU2MzkyXHU5NjY0XHU1MTc2XHU0RUQ2XHU3Njg0XHU2NTg3XHU0RUY2IFx1NjIxNiBcdTU3MjhgaHRtbGBcdTkxNERcdTdGNkVcdTRFMkRcdTUyMDZcdTUyMkJcdTRFM0FcdTZCQ0ZcdTRFMkFodG1sXHU2NTg3XHU0RUY2XHU2MzA3XHU1QjlBJ1x1NzZFRVx1NUY1NSdcdTYyMTYnXHU1MjJCXHU1NDBEJyxcdThCRTZcdTdFQzZcdTY3RTVcdTc3MEJodG1sXHU5MTREXHU3RjZFXHU4QkY0XHU2NjBFXG4gICAgbW9kdWxlczogWydjbGV2ZXJBaVBhY3MnXSxcbiAgICAvLyBcdThGRDlcdTRFMkFcdTkxNERcdTdGNkVcdTUzRUZcdTRFRTVcdTc1MjhcdTY3NjVcdTkxNERcdTdGNkUgaHRtbCBcdTY1ODdcdTRFRjZcdTc2RjhcdTUxNzNcdTc2ODRcdTUxODVcdTVCQjlcbiAgICBodG1sOiB7XG4gICAgICAvLyBcdTc1MjhcdTRFOEVcdTVCOUFcdTRFNDkgSFRNTCBcdTk4NzVcdTk3NjJcdTc2ODQgdGl0bGVcbiAgICAgIC8vIFx1NEY2MFx1NEU1Rlx1NTNFRlx1NEVFNVx1NTcyOFx1OEZEOVx1OTFDQ1x1NkRGQlx1NTJBMFx1OTg3OVx1NzZFRVx1NzY4NEhUTUwgXHU2NTg3XHU0RUY2XHU3Njg0XHU5MTREXHU3RjZFXG4gICAgICAvLyBcdTRGNDZcdTY2MkYsXHU2Q0U4XHU2MTBGLFx1NTcyOCBIVE1MIFx1NjU4N1x1NEVGNlx1NEUyRFx1NEY3Rlx1NzUyOFx1NjVGNixcdTVGQzVcdTk4N0JcdTRGN0ZcdTc1Mjg6ICVWSVRFX0hUTUxfVElUTEVfKiVcbiAgICAgIC8vIFx1NzY4NFx1NUY2Mlx1NUYwRlx1Njc2NVx1NEY3Rlx1NzUyOFxuICAgICAgdGl0bGU6IHtcbiAgICAgICAgYXVkaXQ6ICdcdTVCQTFcdThCQTFcdTdCQTFcdTc0MDYnLFxuICAgICAgICBhdXRob3JpdHk6ICdcdTY3NDNcdTk2NTBcdTdCQTFcdTc0MDYnLFxuICAgICAgICBkZW1vX3Rlc3Q6ICdcdTc5M0FcdTRGOEJcdTZBMjFcdTU3NTcnLFxuICAgICAgICBmdW5jdGlvbl9tb2R1bGVzOiAnXHU1MjlGXHU4MEZEXHU2QTIxXHU1NzU3JyxcbiAgICAgICAgaW5kZXg6ICdUYSszNDA0XHU1RjAwXHU1M0QxXHU1RTczXHU1M0YwJyxcbiAgICAgICAgbG9naW46ICdcdTc2N0JcdTVGNTUnLFxuICAgICAgICBsb2dtZzogJ1x1NjVFNVx1NUZEN1x1N0JBMVx1NzQwNicsXG4gICAgICAgIG1lc3NhZ2VtZzogJ1x1NkQ4OFx1NjA2Rlx1NTM4Nlx1NTNGMlx1N0JBMVx1NzQwNicsXG4gICAgICAgIG9yZ3VzZXI6ICdcdTdFQzRcdTdFQzdcdTdCQTFcdTc0MDYnLFxuICAgICAgICBwcm9qZWN0X2RlbW86ICdcdTdFQzRcdTRFRjZcdTc5M0FcdTRGOEInLFxuICAgICAgICByZWdpc3RlcjogJ1x1NkNFOFx1NTE4QycsXG4gICAgICAgIHJlc291cmNlbWc6ICdcdThENDRcdTZFOTBcdTdCQTFcdTc0MDYnLFxuICAgICAgICBzeXNtZzogJ1x1N0NGQlx1N0VERlx1N0JBMVx1NzQwNicsXG4gICAgICAgIHVpcmVkaXJlY3Q6ICd1aXJlZGlyZWN0JyxcbiAgICAgICAgdXNlcl9jZW50ZXI6ICdcdTRFMkFcdTRFQkFcdTRFMkRcdTVGQzMnLFxuICAgICAgICB3b3JrX3RhYmxlX3BhZ2U6ICdcdTVERTVcdTRGNUNcdTUzRjBcdTZBMjFcdTU3NTcnLFxuICAgICAgICAvLyAtLS0tXHU2NUIwXHU3Q0ZCXHU3RURGLS0tLSAvL1xuICAgICAgICBjbGV2ZWxfYWlfcGFjczogJ1x1NjY3QVx1NjE2N1x1NTMzQlx1NzU5N1x1NUY3MVx1NTBDRlx1N0NGQlx1N0VERidcblxuICAgICAgfSxcbiAgICB9LFxuICAgIC8vIFx1NzUyOFx1NEU4RVx1NjMwN1x1NUI5QVx1Njg0Nlx1NjdCNlx1OUVEOFx1OEJBNFx1NzY4NFx1OTg3NVx1OTc2Mlx1NzY4NFx1NTQwNFx1NEUyQVx1NUI1MFx1NkEyMVx1NTc1N1x1NzY4NFx1NUI5RVx1NzNCMCxcdTUzRUFcdTY3MDlcdTU3MjhcdThGRDlcdTkxQ0NcdTYzRDBcdTRGOUJcdTc2ODRcdTVCNTBcdTZBMjFcdTU3NTdcdTYyNERcdTgwRkRcdTg4QUJcdTg5ODZcdTc2RDZcbiAgICBvdmVycmlkZToge1xuICAgICAgLy8gXHU3RUQzXHU2Nzg0XG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTY2MkZcdTkwMUFcdTc1MjhcdTc2ODRcdTdFQzRcdTRFRjYsXHU5MEEzXHU0RTQ4XHU3NkY0XHU2M0E1XHU2NTNFXHU1MjMwXHU3QjJDXHU0RTAwXHU3RUE3XG4gICAgICAvLyBcdTU5ODJcdTY3OUNcdTY2MkZcdTY3RDBcdTRFMkFcdTk4NzVcdTk3NjJcdTc2ODRcdTdFQzRcdTRFRjYsIFx1OTBBM1x1NEU0OFx1NEY3Rlx1NzUyOFx1OTg3NVx1OTc2Mlx1NTQwRFx1NUI1N1x1NzY4NFx1NUJGOVx1OEM2MSxcdTRGOEJcdTU5ODJcdTRFMEJcdTk3NjJcdTc2ODRsb2dpblxuICAgICAgJ3JvdXRlcy1jb250YWluZXInOiAnQHloL2NsaS1pbnRlcm5hbC1jb21tb24vc3JjL2NvbXBvbmVudHMvcm91dGVzQ29udGFpbmVyLnZ1ZScsXG4gICAgICAvLyBcdTRFRTVsb2dpbi9zcmMvbW9kaWZ5LXBhc3N3b3JkXHU0RTNFXHU0RjhCOlxuICAgICAgLy8gXHU1NzI4XHU0RjdGXHU3NTI4XHU2NUY2LFx1NEY3Rlx1NzUyOGgoJ2xvZ2luL3NyYy9tb2RpZnktcGFzc3dvcmQnKVx1NjIxNmgoJ2xvZ2luX3NyY19tb2RpZnktcGFzc3dvcmQnKVx1NjIxNlx1NTcyOHZ1ZVx1NzY4NHRlbXBsYXRlXHU0RTJEXHU0RjdGXHU3NTI4PGxvZ2luX3NyY19tb2RpZnktcGFzc3dvcmQvPlx1NjgwN1x1N0I3RVxuICAgICAgLy8gXHU5MDFBXHU4RkM3dW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcdTc2ODRcdTU5MDRcdTc0MDZcdTU0MEVcbiAgICAgIC8vIFx1NUMwNlx1NEYxQVx1OEY2Q1x1NjM2Mlx1NEUzQVx1NUJGOVx1OEZEOVx1NEUyQVx1NUJGOVx1OEM2MTogbG9naW4uc3JjLm1vZGlmeS1wYXNzd29yZCBcdTc2ODRcdTVGMTVcdTc1MjhcbiAgICAgIGxvZ2luOiB7XG4gICAgICAgIC8vIFx1NTQwNFx1NEUyQVx1NTNFRlx1NEVFNVx1ODk4Nlx1NzZENlx1NzY4NFx1NkEyMVx1NTc1NyxcdTc2RjRcdTYzQTVcdTYzMDdcdTVCOUFcdTUxNzZcdTYyNDBcdTU3MjhcdTc2ODRcdThERUZcdTVGODRcbiAgICAgICAgLy8gXHU1OTgyXHU2NzlDXHU0RjdGXHU3NTI4bm9kZV9tb2R1bGVzXHU0RTBCXHU3Njg0XHU1QjlFXHU3M0IwXHU1MjE5XHU0RTBEXHU5NzAwXHU4OTgxL1x1NUYwMFx1NTkzNFxuICAgICAgICAvLyBcdThGRDlcdTRFMkFcdTVCOUVcdTczQjBcdTUzRUZcdTRFRTVcdTRGN0ZcdTc1MjhcdTRFRkJcdTRGNTVcdTUzRUZcdTZFMzJcdTY3RDNcdTUxRkFcdTk4NzVcdTk3NjJcdTc2ODRcdTY1ODdcdTRFRjYsXHU1OTgyLnZ1ZS8uanMvLmpzeC8udHMvLnRzeFx1N0I0OVxuICAgICAgICBsb2dpbjogJy9zcmMvb3ZlcnJpZGUvbG9naW4tb3ZlcnJpZGUtZGVtby9sb2dpbi52dWUnLFxuICAgICAgICAvLyBsb2dpbjogJ0B5aC9jbGktcGFnZXMtbG9naW4vc3JjL2xvZ2luLnZ1ZScsXG4gICAgICAgIC8vIGxvZ2luOiAnL3NyYy9vdmVycmlkZS9sb2dpbi1vdmVycmlkZS1kZW1vL2xvZ2luLnZ1ZScsXG4gICAgICAgIC8vIGxvZ2luOiAnL3NyYy9vdmVycmlkZS9sb2dpbi1vdmVycmlkZS1kZW1vL2xvZ2luLWpzLmpzJyxcbiAgICAgICAgLy8gbG9naW46ICcvc3JjL292ZXJyaWRlL2xvZ2luLW92ZXJyaWRlLWRlbW8vbG9naW4tanN4LmpzeCcsXG4gICAgICAgIHNyYzoge1xuICAgICAgICAgICdtb2RpZnktcGFzc3dvcmQnOiAnQHloL2NsaS1wYWdlcy1sb2dpbi9zcmMvcGFydC9tb2RpZnlQYXNzd29yZC52dWUnLFxuICAgICAgICAgICdzb2NpYWwtbGlzdCc6ICdAeWgvY2xpLXBhZ2VzLWxvZ2luL3NyYy9wYXJ0L3NvY2lhbExpc3QudnVlJyxcbiAgICAgICAgICAnbG9naW4tZm9ybSc6ICcvc3JjL292ZXJyaWRlL2xvZ2luLW92ZXJyaWRlLWRlbW8vbG9naW5Gb3JtLnZ1ZScsXG4gICAgICAgICAgJ3Ntcy1sb2dpbi1mb3JtJzogJ0B5aC9jbGktcGFnZXMtbG9naW4vc3JjL3BhcnQvc21zTG9naW5Gb3JtLnZ1ZScsXG4gICAgICAgICAgdmVyaWZ5OiAnQHloL2NsaS1wYWdlcy1sb2dpbi9zcmMvcGFydC92ZXJpZml0aW9uL1ZlcmlmeS52dWUnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICAgIC8vIGluZGV4OiB7XG4gICAgICAvLyAgICdtZW51LWhvcml6b24nOiAnL3NyYy9vdmVycmlkZS9pbmRleC1vdmVycmlkZS1kZW1vL21lbnVIb3Jpem9uLnZ1ZScsXG4gICAgICAvLyB9LFxuICAgIH0sXG4gICAgLy8gXHU1NzI4XHU4RkQ5XHU5MUNDXHU5MTREXHU3RjZFXHU3Njg0XHU5ODc1XHU5NzYyXHU1M0VGXHU0RUU1XHU0RjdGXHU3NTI4dnVlLXJvdXRlclx1NzY4NGhpc3RvcnlcdThERUZcdTc1MzFcbiAgICBoaXN0b3J5UGFnZTogW1xuICAgICAgLy8gJ3Byb2plY3REZW1vJ1xuICAgIF0sXG4gICAgLy8gXHU2NkZGXHU2MzYyXHU2N0QwXHU0RTlCXHU2NTg3XHU0RUY2XHU3Njg0XHU1MTg1XHU1QkI5XHU0RTNBXHU1M0U2XHU0RTAwXHU0RTJBXHU2NTg3XHU0RUY2XG4gICAgLy8gXHU2Q0U4XHU2MTBGOiBcdThGRDlcdTRFMkFcdTUyOUZcdTgwRkRcdTUzRUZcdTgwRkRcdTRGMUFcdTVCRkNcdTgxRjRcdTRGNjBcdTU3MjhcdThDMDNcdThCRDVcdTcyNzlcdTVCOUFcdTY1ODdcdTRFRjZcdTY1RjZcdTUxRkFcdTczQjBcdTZERjdcdTZEQzZcbiAgICAvLyBcdTRGOEJcdTU5ODI6IFx1NEZFRVx1NjUzOVx1NjU4N1x1NEVGNlx1NTQwRVx1Nzg2RVx1NkNBMVx1NjcwOVx1NTcyOFx1OTg3NVx1OTc2Mlx1NEUwQVx1NjYzRVx1NzkzQVxuICAgIGZpbGVzOiBbXG4gICAgICAvLyB7XG4gICAgICAvLyBmaWxlIFx1NTNFRlx1NEVFNVx1NjYyRlx1NEUwMFx1NEUyQVx1NjU4N1x1NEVGNlx1NTQwRCxcdTRFNUZcdTUzRUZcdTRFRTVcdTY2MkZcdTRFMDBcdTRFMkFcdTY1ODdcdTRFRjZcdTc2ODRcdThERUZcdTVGODQoXHU1M0VGXHU0RUU1XHU2NjJGXHU0RTAwXHU5MEU4XHU1MjA2LFx1NEY0Nlx1NjYyRlx1NUZDNVx1OTg3Qlx1NjYyRlx1OEZERVx1N0VFRFx1NzY4NCxcdTRGOEJcdTU5ODI6IFx1NjcwOVx1NEUwMFx1NEUyQVx1NjU4N1x1NEVGNiwvYS9iL2MvZC52dWUuIGZpbGVcdTUzRUZcdTRFRTVcdTUxOTlcdTRFM0FhL2IvYy9kLnZ1ZVx1NjIxNiBjL2QudnVlIFx1N0I0OSxcdTRGNDZcdTY2MkZcdTRFMERcdTgwRkRcdTY2MkZhL2QudnVlKVxuICAgICAgLy8gICBmaWxlOiAncGFnZS52dWUnLFxuICAgICAgLy8gbmV3RmlsZVx1NzY4NFx1NTE5OVx1NkNENVx1NUZDNVx1OTg3Qlx1NjYyRlx1NEUwQlx1OTc2Mlx1NzY4NFx1OEZEOVx1NEUyQVx1NTE5OVx1NkNENSxcdThGRDlcdTY4MzdcdTYyNERcdTgwRkRcdTgzQjdcdTUzRDZcdTUyMzBuZXdGaWxlIFx1NzY4NFx1NUI4Q1x1NjU3NFx1OERFRlx1NUY4NFxuICAgICAgLy8gICBuZXdGaWxlOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjL0RlbW8udnVlJywgaW1wb3J0Lm1ldGEudXJsKSksXG4gICAgICAvLyB9LFxuICAgIF0sXG4gIH0sXG4gIC8vIFx1OEZEOVx1NEUyQVx1OTE0RFx1N0Y2RVx1NEVDNVx1NzUyOFx1NEU4RWJ1aWxkOm1wYVx1ODExQVx1NjcyQ1xuICAvLyBcdTVGNTNcdTRGMjBcdTUxNjVcdTRFMDBcdTRFMkFcdTY1NzBcdTdFQzRcdTY1RjY6IFx1NEVDNVx1N0YxNlx1OEJEMVx1NjU3MFx1N0VDNFx1NEUyRFx1NzY4NFx1OTg3NVx1OTc2MlxuICAvLyBcdTVGNTNcdTRGMjBcdTUxNjV0cnVlXHU2NUY2LFx1NUMwNlx1N0YxNlx1OEJEMVx1NjI0MFx1NjcwOVx1NTNFRlx1NzUyOFx1NzY4NFx1OTg3NVx1OTc2MihcdTRFMEVwbnBtIGJ1aWxkXHU0RTAwXHU4MUY0LFx1NEY0Nlx1NjYyRlx1NEYxQVx1NUMwNlx1NTQwNFx1NEUyQVx1OTg3NVx1OTc2Mlx1NzY4NGFzc2V0c1x1NjUzRVx1NTIzMFx1NzJFQ1x1N0FDQlx1NzY4NGFzc2V0c1x1NzZFRVx1NUY1NVx1NEUyRClcbiAgLy8gXHU2Q0U4XHU2MTBGOiBcdThGRDlcdTRFMkFcdTUyOUZcdTgwRkRcdTVFOTRcdTVGNTNcdTRFQzVcdTc1MjhcdTRFOEVcdTVDMTFcdTkxQ0ZcdTk4NzVcdTk3NjJcdTc2ODRcdTYyNTNcdTUzMDUsXHU1OTgyXHU2NzlDXHU5ODc1XHU5NzYyXHU4RkM3XHU1OTFBLFx1NTIxOVx1NEYxQVx1NUJGQ1x1ODFGNFx1N0YxNlx1OEJEMVx1NjVGNlx1OTVGNFx1OEZDN1x1OTU3RlxuICBtcGE6IFsnbG9naW4nXSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IF9kZWZhdWx0O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHNyY1xcXFx1dGlscy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovYWktJUU1JThDJUJCJUU1JUFEJUE2JUU1JUJEJUIxJUU1JTgzJThGJUU5JUExJUI5JUU3JTlCJUFFLyVFNCVCQiVBMyVFNyVBMCU4MS90ZXN0Q29kZS90YTQwNHVpLTE1Mi1jdC9kZW1vL2J1aWxkLXZpdGUvc3JjL3V0aWxzLnRzXCI7aW1wb3J0IHsgbG9hZEVudiB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHZpdGVDb21tb25Db25maWcgZnJvbSAnLi4vLi4vdml0ZUNvbW1vbkNvbmZpZyc7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBjaGFsayBmcm9tICdjaGFsayc7XG5cbmxldCB2aXRlQXBwRW52OiBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+O1xubGV0IGN1cnJlbnRNb2RlOiBzdHJpbmc7XG5cbi8qKlxuICogXHU1MjFEXHU1OUNCXHU1MzE2dml0ZUFwcEVudlxuICogQHBhcmFtIG1vZGVcbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluaXRFbnYobW9kZTogc3RyaW5nKSB7XG4gIHZpdGVBcHBFbnYgPSBsb2FkRW52KFxuICAgIG1vZGUgPT09ICdvcHRpbWl6ZScgPyAnZGV2ZWxvcG1lbnQnIDogbW9kZSxcbiAgICBwYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSwgJy4vLmVudicpLFxuICAgICcnLFxuICApO1xuICBjdXJyZW50TW9kZSA9IG1vZGU7XG59XG5cbi8qKlxuICogXHU4M0I3XHU1M0Q2XHU2MzA3XHU1QjlBXHU1NDBEXHU3OUYwXHU3Njg0ZW52XG4gKiBAcGFyYW0ga2V5XG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RW52KGtleTogc3RyaW5nKTogc3RyaW5nIHtcbiAgaWYgKGtleSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZXJyb3IoY2hhbGsuYmdSZWQoJ1x1NTcyOFx1ODNCN1x1NTNENmVudlx1NjVGNixcdTVGQzVcdTk4N0JcdTRGMjBcdTUxNjVlbnZcdTc2ODRcdTU0MERcdTVCNTchJykpO1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgY29uc3QgZW52ID0gdml0ZUFwcEVudltrZXldO1xuICBpZiAoZW52ID09PSB1bmRlZmluZWQpIHtcbiAgICBpZiAoa2V5ICE9PSAnUlVOX0VOVicpIHtcbiAgICAgIHdhcm4oXG4gICAgICAgIGBcdTU3MjhcXGAke2NoYWxrLmJsdWVCcmlnaHQoYC5lbnYuJHtjdXJyZW50TW9kZX1gKX1cXGBcdTY1ODdcdTRFRjZcdTRFMkRcdTZDQTFcdTY3MDlcdTYyN0VcdTUyMzBcdTczQUZcdTU4ODNcdTUzRDhcdTkxQ0Y6JHtjaGFsay5ibHVlKFxuICAgICAgICAgIGtleSxcbiAgICAgICAgKX0hIFx1OEZEOVx1NEUyQVx1OEI2Nlx1NTQ0QVx1NEUwMFx1ODIyQ1x1NjBDNVx1NTFCNVx1NEUwQlx1NTNFRlx1NEVFNVx1NUZGRFx1NzU2NSFgLFxuICAgICAgKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGVudjtcbn1cblxuLyoqXG4gKiBcdTUyMjRcdTY1QURcdTRFMDBcdTRFMkFlbnZcdTY2MkZcdTU0MjZcdTY2MkZ0cnVlXG4gKiBAcGFyYW0ga2V5XG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgZnVuY3Rpb24gaXNFbnZUcnVlKGtleTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBnZXRFbnYoa2V5KT8udG9VcHBlckNhc2UoKSA9PT0gJ1RSVUUnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0T3BlbigpIHtcbiAgLy8gXHU5MTREXHU3RjZFXHU1NDJGXHU1MkE4XHU5RUQ4XHU4QkE0XHU3Njg0XHU5ODc1XHU5NzYyXG4gIGxldCBvcGVuOiBib29sZWFuIHwgc3RyaW5nID0gZmFsc2U7XG4gIGlmICh2aXRlQ29tbW9uQ29uZmlnLm9wZW4pIHtcbiAgICBvcGVuID0gYCR7Z2V0RW52KCdWSVRFX1BVQkxJQ19QQVRIJyl9LyR7dml0ZUNvbW1vbkNvbmZpZy5vcGVufWAucmVwbGFjZUFsbCgvXFwvXFwvL2csICcvJyk7XG4gIH1cbiAgcmV0dXJuIG9wZW47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBsb2cobXNnOiBzdHJpbmcpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgY29uc29sZS5sb2cobXNnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdhcm4obXNnOiBzdHJpbmcpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWNvbnNvbGVcbiAgY29uc29sZS53YXJuKG1zZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlcnJvcihtc2c6IHN0cmluZykge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tY29uc29sZVxuICBjb25zb2xlLmVycm9yKG1zZyk7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHNyY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXFxcXGNzcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovYWktJUU1JThDJUJCJUU1JUFEJUE2JUU1JUJEJUIxJUU1JTgzJThGJUU5JUExJUI5JUU3JTlCJUFFLyVFNCVCQiVBMyVFNyVBMCU4MS90ZXN0Q29kZS90YTQwNHVpLTE1Mi1jdC9kZW1vL2J1aWxkLXZpdGUvc3JjL2Nzcy50c1wiO2ltcG9ydCBhdXRvcHJlZml4ZXIgZnJvbSAnYXV0b3ByZWZpeGVyJztcbmltcG9ydCB0eXBlIHtDU1NPcHRpb25zfSBmcm9tICd2aXRlJztcbmltcG9ydCB7Z2V0RW52fSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNzcygpOiBQcm9taXNlPENTU09wdGlvbnM+IHtcbiAgLy8gQHRzLWV4cGVjdC1lcnJvciBcdTVGRkRcdTc1NjVcdThGRDlcdTRFMkFcdTdDN0JcdTU3OEJcdTk1MTlcdThCRUZcbiAgcmV0dXJuIHtcbiAgICBwb3N0Y3NzOiB7XG4gICAgICBwbHVnaW5zOiBbXG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3IgXHU1RkZEXHU3NTY1XHU4RkQ5XHU5MUNDXHU3Njg0XHU3QzdCXHU1NzhCXHU5NTE5XHU4QkVGXG4gICAgICAgIGF1dG9wcmVmaXhlcih7XG4gICAgICAgICAgLy8gXHU5MTREXHU3RjZFXHU0RjdGXHU3NTI4IGF1dG9wcmVmaXhlclxuICAgICAgICAgIG92ZXJyaWRlQnJvd3NlcnNsaXN0OiBbJz4gMSUnLCAnbGFzdCAzIHZlcnNpb25zJywgJ2llID49IDExJywgJ2Nocm9tZSA+PSA0MSddLFxuICAgICAgICB9KSxcbiAgICAgIF0sXG4gICAgfSxcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBsZXNzOiB7XG4gICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICBtYXRoOiAnYWx3YXlzJyxcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBcbiAgICAgICAgQGltcG9ydCBcIkB5aC90YTQwNC11aS9lcy9zdHlsZS9taXhpbnMvaW5kZXgubGVzc1wiO1xuICAgICAgICBAaW1wb3J0IFwiY2xpL3Byb2plY3RDb21tb24vc3JjL3N0eWxlQ292ZXIvbWl4aW5zL2Z1bmMubGVzc1wiO1xuICAgICAgICBAaW1wb3J0IFwiaW50ZXJuYWwvdGhlbWUvcHJlc2V0LXRoZW1lL2dsb2JhbC1jdXN0b21lci12YXJzLmxlc3NcIjtcbiAgICAgICAgYCxcbiAgICAgICAgbW9kaWZ5VmFyczoge1xuICAgICAgICAgIC8vIFx1NTcyOGxlc3NcdTY1ODdcdTRFRjZcdTRFMkRcdTYzRDBcdTRGOUJcdTVGNTNcdTUyNERcdTk4NzlcdTc2RUVcdTc2ODRwdWJsaWMtcGF0aFx1NTNEOFx1OTFDRlxuICAgICAgICAgICdwdWJsaWMtcGF0aCc6IGdldEVudignVklURV9QVUJMSUNfUEFUSCcpLmVuZHNXaXRoKCcvJylcbiAgICAgICAgICAgID8gZ2V0RW52KCdWSVRFX1BVQkxJQ19QQVRIJylcbiAgICAgICAgICAgIDogYCR7Z2V0RW52KCdWSVRFX1BVQkxJQ19QQVRIJyl9L2AsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgcHJlcHJvY2Vzc29yTWF4V29ya2VyczogdHJ1ZSxcbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXFxcXHVucGx1Z2luLXJlc29sdmVyXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcXFxcdW5wbHVnaW4tcmVzb2x2ZXJcXFxcY2xpLWNvbXBvbmVudHMub3ZlcnJpZGUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2FpLSVFNSU4QyVCQiVFNSVBRCVBNiVFNSVCRCVCMSVFNSU4MyU4RiVFOSVBMSVCOSVFNyU5QiVBRS8lRTQlQkIlQTMlRTclQTAlODEvdGVzdENvZGUvdGE0MDR1aS0xNTItY3QvZGVtby9idWlsZC12aXRlL3NyYy91bnBsdWdpbi1yZXNvbHZlci9jbGktY29tcG9uZW50cy5vdmVycmlkZS50c1wiO2ltcG9ydCB7IHR5cGUgQ29tcG9uZW50UmVzb2x2ZXIsIGtlYmFiQ2FzZSB9IGZyb20gJ3VucGx1Z2luLXZ1ZS1jb21wb25lbnRzJztcbmltcG9ydCB7IG1lcmdlQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgY2xpT3ZlcnJpZGUgZnJvbSAnLi4vLi4vLi4vdml0ZUNvbW1vbkNvbmZpZyc7XG5cbmltcG9ydCB7IHJlYWRGaWxlU3luYyB9IGZyb20gJ25vZGU6ZnMnO1xuaW1wb3J0IGdsb2IgZnJvbSAnZmFzdC1nbG9iJztcbmltcG9ydCB7IGVycm9yIH0gZnJvbSAnLi4vdXRpbHMnO1xuXG5jb25zdCBtb2R1bGVQYWdlcyA9IHt9O1xuXG5nbG9iXG4gIC5zeW5jKFtgJHtnbG9iLmNvbnZlcnRQYXRoVG9QYXR0ZXJuKHByb2Nlc3MuY3dkKCkpfS9ub2RlX21vZHVsZXMvQHloLyoqL3BhZ2VzLmpzb25gXSlcbiAgLmZvckVhY2goKGZpbGUpID0+IHtcbiAgICBjb25zdCBjb250ZW50ID0gcmVhZEZpbGVTeW5jKGZpbGUpLnRvU3RyaW5nKCk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGpzb25Db250ZW50ID0gSlNPTi5wYXJzZShjb250ZW50KTtcbiAgICAgIE9iamVjdC5hc3NpZ24obW9kdWxlUGFnZXMsIGpzb25Db250ZW50KTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zdCBmaWxlUGF0aCA9IGZpbGUucmVwbGFjZShwcm9jZXNzLmN3ZCgpLCAnJyk7XG4gICAgICBlcnJvcihgSlNPTlx1NjU4N1x1NEVGNlx1OEY2Q1x1NjM2Mlx1NjVGNlx1NTFGQVx1NzNCMFx1OTUxOVx1OEJFRiFcXG5cdThCRjdcdTY4QzBcdTY3RTVcdTY1ODdcdTRFRjY6ICcke2ZpbGVQYXRofSdgKTtcbiAgICAgIHRocm93IGU7XG4gICAgfVxuICB9KTtcblxuY29uc3QgT1ZFUlJJREVfUEFHRVNfQ09NUE9ORU5UUyA9IG1lcmdlQ29uZmlnKG1vZHVsZVBhZ2VzLCBjbGlPdmVycmlkZS5jbGkub3ZlcnJpZGUpO1xuXG4vKipcbiAqIFx1OEZEOVx1NEUyQVx1NjNEMlx1NEVGNlx1NzUyOFx1NEU4RVx1ODlFM1x1Njc5MGh0bWxcdTY4MDdcdTdCN0VcdTVFNzZcdTVDMDZcdTdCMjZcdTU0MDhcdTg5QzRcdTUyMTkoXHU4OUM0XHU1MjE5XHU5MTREXHU3RjZFXHU1NzI4T1ZFUlJJREVfUEFHRVNfQ09NUE9ORU5UU1x1NEUyRClcdTc2ODRcdTY4MDdcdTdCN0VcdTVCRjlcdTVFOTRcdTc2ODRcdTdFQzRcdTRFRjZcdThGRDRcdTU2REVcbiAqIFx1NjcwMFx1N0VDOFx1NkUzMlx1NjdEM1x1NzY4NFx1N0VDNFx1NEVGNlx1NEUzQVx1OEZEOVx1NEUyQVx1NjVCOVx1NkNENVx1OEZENFx1NTZERVx1NzY4NFx1N0VDNFx1NEVGNlxuICogXHU1OTgyXHU2NzlDXHU4RkQ0XHU1NkRFXHU0RTNBdW5kZWZpbmVkLFx1NTIxOVx1NEUwRFx1OEZEQlx1ODg0Q1x1NEVGQlx1NEY1NVx1NTkwNFx1NzQwNlxuICovXG5leHBvcnQgZGVmYXVsdCAoKTogQ29tcG9uZW50UmVzb2x2ZXIgPT4ge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdjb21wb25lbnQnLFxuICAgIHJlc29sdmUobmFtZSkge1xuICAgICAgY29uc3Qga2JOYW1lID0ga2ViYWJDYXNlKG5hbWUpO1xuICAgICAgaWYgKE9WRVJSSURFX1BBR0VTX0NPTVBPTkVOVFNba2JOYW1lXSkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGZyb206IE9WRVJSSURFX1BBR0VTX0NPTVBPTkVOVFNba2JOYW1lXSxcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IHBhdGhzID0ga2JOYW1lLnJlcGxhY2UoL18vZywgJy8nKS5zcGxpdCgnLycpO1xuICAgICAgaWYgKCFPVkVSUklERV9QQUdFU19DT01QT05FTlRTW3BhdGhzWzBdXSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBwYWdlUmVzdWx0ID0gcGF0aHMucmVkdWNlKChwdiwgY3YpID0+IHtcbiAgICAgICAgaWYgKHB2ID09PSB1bmRlZmluZWQgfHwgIXB2KSB7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY3YgaW4gcHYpIHtcbiAgICAgICAgICByZXR1cm4gcHZbY3ZdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9LCBPVkVSUklERV9QQUdFU19DT01QT05FTlRTKTtcbiAgICAgIGlmIChwYWdlUmVzdWx0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZnJvbTogcGFnZVJlc3VsdCxcbiAgICAgIH07XG4gICAgfSxcbiAgfTtcbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXG11bHRpcGxlU2VydmljZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2FpLSVFNSU4QyVCQiVFNSVBRCVBNiVFNSVCRCVCMSVFNSU4MyU4RiVFOSVBMSVCOSVFNyU5QiVBRS8lRTQlQkIlQTMlRTclQTAlODEvdGVzdENvZGUvdGE0MDR1aS0xNTItY3QvZGVtby9tdWx0aXBsZVNlcnZpY2UuY29uZmlnLnRzXCI7aW1wb3J0IHR5cGUgeyBJbmplY3RDb2RlIH0gZnJvbSAndml0ZS1wbHVnaW4tdmlydHVhbC1odG1sJztcbmltcG9ydCB7IFBPUyB9IGZyb20gJ3ZpdGUtcGx1Z2luLXZpcnR1YWwtaHRtbCc7XG5cbmNvbnN0IG11bHRpcGxlU2VydmljZUNvbmZpZzogUmVjb3JkPHN0cmluZywgUGFydGlhbDxJbmplY3RDb2RlPiB8IHN0cmluZz4gPSB7XG4gIC8vIFx1NkEyMVx1NTc1N1x1NTQwRFx1NzlGMFx1NUZDNVx1OTg3Qlx1NEUwRWh0bWxcdTc2RjhcdTUzMzlcdTkxNERcbiAgLy8gMS4gXHU1QkY5XHU0RTAwXHU0RTJBXHU1MTc3XHU0RjUzXHU3Njg0XHU5ODc1XHU5NzYyLFx1NTNFRlx1NzZGNFx1NjNBNVx1NEY3Rlx1NzUyOFx1NTk4Mlx1NEUwQlx1NzY4NFx1OTE0RFx1N0Y2RVx1OEZEQlx1ODg0Q1x1NkNFOFx1NTE2NSxcdTRFMDBcdTgyMkNcdTVFRkFcdThCQUVcdTc2RjRcdTYzQTVcdTRGN0ZcdTc1MjhcdThGRDlcdTc5Q0RcdTY1QjlcdTVGMEZcbiAgJ2xvZ2luLmh0bWwnOiAnPHNjcmlwdD53aW5kb3cuZGQgPSBcImRkXCI7PC9zY3JpcHQ+JyxcbiAgLy8gXHU0RTVGXHU1M0VGXHU0RUU1XHU5MDFBXHU4RkM3XHU0RjIwXHU1MTY1XHU0RTAwXHU0RTJBXHU1QkY5XHU4QzYxXHU2NzY1XHU2Q0U4XHU1MTY1XHU5MTREXHU3RjZFXG4gIC8vICdsb2dpbi5odG1sJzoge1xuICAvLyAgIC8vIHBvczogUE9TLmJlZm9yZSxcbiAgLy8gICAvLyBmaW5kOiAnPC9oZWFkPicsXG4gIC8vICAgcmVwbGFjZW1lbnQ6ICc8c2NyaXB0PndpbmRvdy5kZCA9IFwiZGRcIjs8L3NjcmlwdD4nLFxuICAvLyB9LFxuICAvLyBcdTUxNzZcdTRFMkQscG9zXHU1NDhDZmluZFx1NjYyRlx1NTNFRlx1OTAwOVx1NzY4NCxcdTgyRTVcdTRFMERcdTRGMjBcdTUxNjVcdTY1RjYsXHU1MTc2XHU5RUQ4XHU4QkE0XHU1MDNDXHU0RTNBXG4gIC8vIHtwb3M6IFBPUy5iZWZvcmUsIGZpbmQ6ICc8L2hlYWQ+J30sXG4gIC8vIDIuIFx1NzI3OVx1NkI4QVx1OTE0RFx1N0Y2RSxcdTVDMDZcdTRGMUFcdTU3MjhcdTYyNDBcdTY3MDlodG1sXHU2NTg3XHU0RUY2XHU3NTFGXHU2NTQ4XG4gIC8vIFx1OTE0RFx1N0Y2RVx1ODlDNFx1NTIxOVx1NEUwRVx1NTE3N1x1NEY1M1x1OTg3NVx1OTc2Mlx1NzY4NFx1OTE0RFx1N0Y2RVx1NzZGOFx1NTQwQ1xuICAnKic6IHtcbiAgICAvLyBcdTY3RTVcdTYyN0VcdTUxODVcdTVCQjlcbiAgICBmaW5kOiAnPC9oZWFkPicsXG4gICAgLy8gXHU1NzI4XHU2N0U1XHU2MjdFXHU1MTg1XHU1QkI5XHU1MjREL1x1NTQwRVx1NjZGRlx1NjM2Mlx1NjdFNVx1NjI3RVx1NTE4NVx1NUJCOVxuICAgIHBvczogUE9TLmJlZm9yZSxcbiAgICAvLyBcdTg5ODFcdTY2RkZcdTYzNjJcdTc2ODRcdTUxODVcdTVCQjksXHU4RkQ5XHU0RTJBXHU1MTg1XHU1QkI5XHU1M0VGXHU0RUU1XHU2NjJGc2NyaXB0LFx1NEU1Rlx1NTNFRlx1NEVFNVx1NjYyRlx1NTE3Nlx1NEVENlx1NzY4NFx1NTE4NVx1NUJCOVxuICAgIHJlcGxhY2VtZW50OiBgXG4gICAgPHNjcmlwdD5cbiAgICB3aW5kb3cuYmIgPSBcImJiXCI7XG4gICAgPC9zY3JpcHQ+XG4gICAgYCxcbiAgfSxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgbXVsdGlwbGVTZXJ2aWNlQ29uZmlnLFxufTtcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcbXBhXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxtcGFcXFxccGFnZXMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2FpLSVFNSU4QyVCQiVFNSVBRCVBNiVFNSVCRCVCMSVFNSU4MyU4RiVFOSVBMSVCOSVFNyU5QiVBRS8lRTQlQkIlQTMlRTclQTAlODEvdGVzdENvZGUvdGE0MDR1aS0xNTItY3QvZGVtby9idWlsZC12aXRlL21wYS9wYWdlcy50c1wiO2ltcG9ydCBnbG9iIGZyb20gJ2Zhc3QtZ2xvYic7XG5pbXBvcnQgeyByZWFkZGlyIH0gZnJvbSAnbm9kZTpmcy9wcm9taXNlcyc7XG5pbXBvcnQgeyBkaXJuYW1lLCByZXNvbHZlIH0gZnJvbSAnbm9kZTpwYXRoJztcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCc7XG5pbXBvcnQgeyBub3JtYWxpemVQYXRoIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBQT1MgfSBmcm9tICd2aXRlLXBsdWdpbi12aXJ0dWFsLWh0bWwnO1xuaW1wb3J0IHBhZ2VTZXJ2aWNlIGZyb20gJy4uLy4uL211bHRpcGxlU2VydmljZS5jb25maWcnO1xuaW1wb3J0IFZpdGVDb21tb25Db25maWcgZnJvbSAnLi4vLi4vdml0ZUNvbW1vbkNvbmZpZyc7XG5cbmNvbnN0IHsgaHRtbDogaHRtbFBhZ2VzLCBjbGkgfSA9IFZpdGVDb21tb25Db25maWc7XG5jb25zdCB7IG1vZHVsZXMgfSA9IGNsaTtcblxuZXhwb3J0IGNvbnN0IF9fZGlybmFtZSA9IHJlc29sdmUoZGlybmFtZShmaWxlVVJMVG9QYXRoKGltcG9ydC5tZXRhLnVybCkpLCAnLi4vLi4vJyk7XG5cbmV4cG9ydCBjb25zdCBJR05PUkVfTk9ERV9NT0RVTEVTX0hUTUwgPSAnIS9ub2RlX21vZHVsZXMvKiovbm9kZV9tb2R1bGVzLyoqLyouaHRtbCc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRJbnRlcm5hbFBhZ2VzKCkge1xuICBjb25zdCB5aE1vZHVsZXMgPSBhd2FpdCByZWFkZGlyKHJlc29sdmUoX19kaXJuYW1lLCAnLi9ub2RlX21vZHVsZXMvQHloLycpKTtcbiAgcmV0dXJuIHloTW9kdWxlc1xuICAgIC5maWx0ZXIoKG0pID0+IG0uaW5kZXhPZignY2xpLXBhZ2VzJykgPj0gMClcbiAgICAubWFwKChtKSA9PiB7XG4gICAgICByZXR1cm4gYC9ub2RlX21vZHVsZXMvQHloLyR7bX0vKiovKi5odG1sYDtcbiAgICB9KTtcbn1cblxuLyoqXG4gKiBcdTgzQjdcdTUzRDZcdTY1ODdcdTRFRjZcdTU0MERcdTc5RjBcbiAqIEByZXR1cm4ge3N0cmluZ30gXHU2NTg3XHU0RUY2XHU1NDBEXHU3OUYwXG4gKiBAcGFyYW0ge3N0cmluZ30gaHRtbCBcdTRFMDBcdTRFMkFodG1sXHU2NTg3XHU0RUY2XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRIdG1sTmFtZShodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gaHRtbC5zdWJzdHJpbmcoaHRtbC5sYXN0SW5kZXhPZignLycpICsgMSwgaHRtbC5sZW5ndGgpLnNwbGl0KCcuJylbMF07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBbGxQYWdlcygpIHtcbiAgLy8gXHU4M0I3XHU1M0Q2L25vZGVfbW9kdWxlcy9AeWgvY2xpLXBhZ2VzLSoqLyoqLyouaHRtbFxuICBjb25zdCBpbnRlcm5hbFBhZ2VzID0gYXdhaXQgZ2V0SW50ZXJuYWxQYWdlcygpO1xuICAvLyBcdTgzQjdcdTUzRDZcdTY1M0VcdTU3Mjgvc3JjL3Byb2plY3QvXHU0RTBCXHU3Njg0aHRtbFx1NjU4N1x1NEVGNlxuICBjb25zdCBtb2R1bGVQYWdlcyA9IG1vZHVsZXMubWFwKChtKSA9PiBgL3NyYy9wcm9qZWN0LyoqLyR7bX0uaHRtbGApO1xuICBjb25zdCBhbGxQYWdlc0NvbmZpZyA9IFtdLmNvbmNhdChpbnRlcm5hbFBhZ2VzKS5jb25jYXQobW9kdWxlUGFnZXMpLmNvbmNhdChodG1sUGFnZXMpO1xuICBhbGxQYWdlc0NvbmZpZy5wdXNoKElHTk9SRV9OT0RFX01PRFVMRVNfSFRNTCk7XG4gIC8vIFx1NzUxRlx1NjIxMFx1NEY3Rlx1NzUyOGdsb2JcdTY3NjVcdTgzQjdcdTUzRDZcdTc2ODRodG1sXHU2NTg3XHU0RUY2XG4gIGNvbnN0IGdsb2JQYXR0ZXJuID0gYWxsUGFnZXNDb25maWdcbiAgICAubWFwKChodG1sKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoJ2VudHJ5JyBpbiBodG1sKSB7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCB7XG4gICAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICAgIH1cbiAgICAgIC8vIFx1NUMwNlx1OTE0RFx1N0Y2RVx1NzY4NFx1OERFRlx1NUY4NFx1NTkwNFx1NzQwNlx1NjIxMFx1N0VERFx1NUJGOVx1OERFRlx1NUY4NFxuICAgICAgaWYgKGh0bWxbMF0gPT09ICchJykge1xuICAgICAgICByZXR1cm4gYCEke25vcm1hbGl6ZVBhdGgocHJvY2Vzcy5jd2QoKSl9JHtodG1sLnJlcGxhY2UoJyEnLCAnJyl9YDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBub3JtYWxpemVQYXRoKHByb2Nlc3MuY3dkKCkgKyBodG1sKTtcbiAgICB9KVxuICAgIC5maWx0ZXIoKHYpID0+IHYgIT09IHVuZGVmaW5lZCk7XG4gIGNvbnN0IHBhZ2VzID0ge307XG4gIC8vIFx1NjI2N1x1ODg0Q2dsb2JcdTgzQjdcdTUzRDZcdTYyNDBcdTY3MDlcdTkxNERcdTdGNkVcdTc2ODRodG1sXHU2NTg3XHU0RUY2XG4gIGdsb2Iuc3luYyhnbG9iUGF0dGVybikuZm9yRWFjaCgoZykgPT4ge1xuICAgIHBhZ2VzW2dldEh0bWxOYW1lKGcucmVwbGFjZShub3JtYWxpemVQYXRoKHByb2Nlc3MuY3dkKCkpLCAnJykpXSA9IGcucmVwbGFjZShcbiAgICAgIG5vcm1hbGl6ZVBhdGgocHJvY2Vzcy5jd2QoKSksXG4gICAgICAnJyxcbiAgICApO1xuICB9KTtcbiAgLy8gXHU1QzA2YWxsUGFnZXNDb25maWdcdTRFMkRcdTc2ODRcdTVCRjlcdThDNjFcdThGNkNcdTYzNjJcdTRFM0F2aXRlLXBsdWdpbi12aXJ0dWFsLWh0bWxcdTUzRUZcdThCQzZcdTUyMkJcdTc2ODRcdTkxNERcdTdGNkVcbiAgYWxsUGFnZXNDb25maWcuZm9yRWFjaCgoaHRtbCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBpZiAoISgnZW50cnknIGluIGh0bWwpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9IGNhdGNoIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcGFnZXNbaHRtbC5wYXRoXSA9IGh0bWwuZW50cnk7XG4gIH0pO1xuICByZXR1cm4gcGFnZXM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRJbmplY3RDb2RlKCkge1xuICBjb25zdCBpbmplY3RWYXJpYWJsZXMgPSB7fTtcbiAgT2JqZWN0LmtleXMocGFnZVNlcnZpY2UubXVsdGlwbGVTZXJ2aWNlQ29uZmlnKS5mb3JFYWNoKChrKSA9PiB7XG4gICAgY29uc3QgdiA9IHBhZ2VTZXJ2aWNlLm11bHRpcGxlU2VydmljZUNvbmZpZ1trXTtcbiAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHYpID09PSAnW29iamVjdCBPYmplY3RdJykge1xuICAgICAgaW5qZWN0VmFyaWFibGVzW2tdID0ge1xuICAgICAgICBwb3M6IFBPUy5iZWZvcmUsXG4gICAgICAgIGZpbmQ6ICc8L2hlYWQ+JyxcbiAgICAgICAgLi4uKHYgYXMgb2JqZWN0KSxcbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIGluamVjdFZhcmlhYmxlc1trXSA9IHtcbiAgICAgICAgcG9zOiBQT1MuYmVmb3JlLFxuICAgICAgICBmaW5kOiAnPC9oZWFkPicsXG4gICAgICAgIHJlcGxhY2VtZW50OiB2LFxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gaW5qZWN0VmFyaWFibGVzO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcXFxccmVwbGFjZS1uYW1lXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcXFxccmVwbGFjZS1uYW1lXFxcXGluZGV4LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9haS0lRTUlOEMlQkIlRTUlQUQlQTYlRTUlQkQlQjElRTUlODMlOEYlRTklQTElQjklRTclOUIlQUUvJUU0JUJCJUEzJUU3JUEwJTgxL3Rlc3RDb2RlL3RhNDA0dWktMTUyLWN0L2RlbW8vYnVpbGQtdml0ZS9zcmMvcmVwbGFjZS1uYW1lL2luZGV4LnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJztcbmltcG9ydCBNYWdpY1N0cmluZyBmcm9tICdtYWdpYy1zdHJpbmcnO1xuXG5leHBvcnQgZGVmYXVsdCAoKTogUGx1Z2luID0+IHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAnQHloL3ZpdGUtcGx1Z2luLWdlbmVyYXRlLXNmYy1uYW1lJyxcbiAgICBlbmZvcmNlOiAncG9zdCcsXG4gICAgdHJhbnNmb3JtKGNvZGUsIGlkLCBvcHRpb25zKSB7XG4gICAgICAvLyBcdTUzRUFcdTVCRjl2dWVcdTdFRDNcdTVDM0VcdTc2ODRcdTY1ODdcdTRFRjZcdTRFRTVcdTUzQ0FcdTY1ODdcdTRFRjZcdTUxODVcdTUzMDVcdTU0MkJfc2ZjX21haW5cdTc2ODRcdTY1ODdcdTRFRjZcdTc5ODFcdTg4NENcdTU5MDRcdTc0MDZcbiAgICAgIGlmICghaWQuZW5kc1dpdGgoJy52dWUnKSAmJiBjb2RlLmluZGV4T2YoJ19zZmNfbWFpbicpID49IDApIHtcbiAgICAgICAgLy8gXHU4M0I3XHU1M0Q2XHU2NTg3XHU0RUY2XHU1NDBEOiBcdTg5QzRcdTUyMTk6IGlkXHU3Njg0XHU2NzAwXHU1NDBFXHU0RTAwXHU0RTJBL1x1NzY4NFx1NEY0RFx1N0Y2RSsxXHU1MjMwaWRcdTc2ODRcdTk1N0ZcdTVFQTYtNFx1NzY4NFx1NEY0RFx1N0Y2RVxuICAgICAgICBjb25zdCBmaWxlTmFtZSA9IGlkLnN1YnN0cmluZyhpZC5sYXN0SW5kZXhPZignLycpICsgMSwgaWQubGVuZ3RoIC0gNCk7XG4gICAgICAgIGNvbnN0IG1zYyA9IG5ldyBNYWdpY1N0cmluZyhjb2RlKTtcbiAgICAgICAgLy8gXHU2MjdFXHU1MjMwX3NmY19yZW5kZXJcdTc2ODRcdTVCOUFcdTRFNDlcdTRGNERcdTdGNkVcbiAgICAgICAgY29uc3Qgc2ZjUmVuZGVySW5kZXggPSAvKGNvbnN0fHZhcikgX3NmY19yZW5kZXIvZztcbiAgICAgICAgZm9yIChjb25zdCBtYXRjaGVkIG9mIGNvZGUubWF0Y2hBbGwoc2ZjUmVuZGVySW5kZXgpKSB7XG4gICAgICAgICAgY29uc3QgeyBpbmRleCB9ID0gbWF0Y2hlZDtcbiAgICAgICAgICAvLyBcdTU3Mjhfc2ZjX3JlbmRlclx1NzY4NFx1NUI5QVx1NEU0OVx1NTI0RFx1OTc2Mlx1NkRGQlx1NTJBMFx1NEZFRVx1NjUzOW5hbWVcdTc2ODRcdThCRURcdTUzRTVcbiAgICAgICAgICBtc2MuYXBwZW5kTGVmdChpbmRleCwgYF9zZmNfbWFpbi5uYW1lPScke2ZpbGVOYW1lfSc7XFxyXFxuYCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIGNvZGU6IG1zYy50b1N0cmluZygpLFxuICAgICAgICAgIHNvdXJjZW1hcDogbXNjLmdlbmVyYXRlTWFwKCksXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSxcbiAgfTtcbn07XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHNyY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXFxcXGNvcHlNb2R1bGVQdWJsaWMudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2FpLSVFNSU4QyVCQiVFNSVBRCVBNiVFNSVCRCVCMSVFNSU4MyU4RiVFOSVBMSVCOSVFNyU5QiVBRS8lRTQlQkIlQTMlRTclQTAlODEvdGVzdENvZGUvdGE0MDR1aS0xNTItY3QvZGVtby9idWlsZC12aXRlL3NyYy9jb3B5TW9kdWxlUHVibGljLnRzXCI7aW1wb3J0IGdsb2IgZnJvbSAnZmFzdC1nbG9iJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlNb2R1bGVQdWJsaWMoKSB7XG4gIHJldHVybiBnbG9iXG4gICAgLnN5bmMoW2Ake2dsb2IuY29udmVydFBhdGhUb1BhdHRlcm4ocHJvY2Vzcy5jd2QoKSl9L25vZGVfbW9kdWxlcy9AeWgvKi9wdWJsaWMvKipgXSlcbiAgICAubWFwKChmaWxlKSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBmcm9tOiBmaWxlLFxuICAgICAgICB0bzogJycsXG4gICAgICB9O1xuICAgIH0pO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcaW50ZXJuYWxcXFxccmVwbGFjZS1maWxlc1xcXFxzcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1xcXFxpbnRlcm5hbFxcXFxyZXBsYWNlLWZpbGVzXFxcXHNyY1xcXFxpbmRleC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovYWktJUU1JThDJUJCJUU1JUFEJUE2JUU1JUJEJUIxJUU1JTgzJThGJUU5JUExJUI5JUU3JTlCJUFFLyVFNCVCQiVBMyVFNyVBMCU4MS90ZXN0Q29kZS90YTQwNHVpLTE1Mi1jdC9kZW1vL2ludGVybmFsL3JlcGxhY2UtZmlsZXMvc3JjL2luZGV4LnRzXCI7aW1wb3J0IHR5cGUgeyBQbHVnaW4gfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IHJlYWRGaWxlIH0gZnJvbSAnbm9kZTpmcy9wcm9taXNlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgRmlsZVJlcGxhY2VPcHRpb25zIHtcbiAgZmlsZTogc3RyaW5nO1xuICBuZXdGaWxlOiBzdHJpbmc7XG59XG5leHBvcnQgZGVmYXVsdCAob3B0czogQXJyYXk8RmlsZVJlcGxhY2VPcHRpb25zPik6IFBsdWdpbiA9PiB7XG4gIHJldHVybiB7XG4gICAgbmFtZTogJ0B5aC92aXRlLXBsdWdpbi1maWxlLXJlcGxhY2VyJyxcbiAgICBhc3luYyBsb2FkKGlkLCBvcHRpb25zKSB7XG4gICAgICBjb25zdCBmaWx0ZXJPcHQgPSBvcHRzLmZpbHRlcigob3B0KSA9PiB7XG4gICAgICAgIHJldHVybiBpZC5pbmRleE9mKG9wdC5maWxlKSA+PSAwO1xuICAgICAgfSk7XG4gICAgICBpZiAoZmlsdGVyT3B0Lmxlbmd0aCA8PSAwKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgY29uc3QgeyBuZXdGaWxlIH0gPSBmaWx0ZXJPcHRbMF07XG4gICAgICByZXR1cm4gKGF3YWl0IHJlYWRGaWxlKG5ld0ZpbGUpKS50b1N0cmluZygpO1xuICAgIH0sXG4gIH07XG59O1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHNyY1xcXFxwbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2FpLSVFNSU4QyVCQiVFNSVBRCVBNiVFNSVCRCVCMSVFNSU4MyU4RiVFOSVBMSVCOSVFNyU5QiVBRS8lRTQlQkIlQTMlRTclQTAlODEvdGVzdENvZGUvdGE0MDR1aS0xNTItY3QvZGVtby9idWlsZC12aXRlL3NyYy9wbHVnaW4udHNcIjtpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ25vZGU6cGF0aCc7XG5pbXBvcnQgKiBhcyBmcyBmcm9tICdub2RlOmZzJztcbmltcG9ydCB7dml0ZUNvbW1vbmpzfSBmcm9tICdAeWgvdml0ZS1wbHVnaW4tY29tbW9uanMnO1xuaW1wb3J0IFZpcnR1YWxIdG1sLCB7aGlzdG9yeUFwaUZhbGxiYWNrUGx1Z2lufSBmcm9tICd2aXRlLXBsdWdpbi12aXJ0dWFsLWh0bWwnO1xuaW1wb3J0IHZ1ZSBmcm9tICdAdml0ZWpzL3BsdWdpbi12dWUyJztcbmltcG9ydCBqc3ggZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlMi1qc3gnO1xuaW1wb3J0IEluc3BlY3QgZnJvbSAndml0ZS1wbHVnaW4taW5zcGVjdCc7XG5pbXBvcnQge3Zpc3VhbGl6ZXJ9IGZyb20gJ3JvbGx1cC1wbHVnaW4tdmlzdWFsaXplcic7XG5pbXBvcnQge3ZpdGVTdGF0aWNDb3B5fSBmcm9tICd2aXRlLXBsdWdpbi1zdGF0aWMtY29weSc7XG5pbXBvcnQgbGVnYWN5IGZyb20gJ0B2aXRlanMvcGx1Z2luLWxlZ2FjeSc7XG5pbXBvcnQgdmlydHVhbE1vZHVsZSBmcm9tICd2aXRlLXBsdWdpbi12aXJ0dWFsLW1vZHVsZXMnO1xuaW1wb3J0IHZpdGVDb21tb25Db25maWcgZnJvbSAnLi4vLi4vdml0ZUNvbW1vbkNvbmZpZyc7XG5pbXBvcnQgdGhlbWVQcmVwcm9jZXNzb3JQbHVnaW4gZnJvbSAnQHpvdWd0L3ZpdGUtcGx1Z2luLXRoZW1lLXByZXByb2Nlc3Nvcic7XG5pbXBvcnQge3VpVml0ZX0gZnJvbSAnQHloL3ZpdGUtcGx1Z2luLWNsaS1pbXBvcnRlcic7XG5pbXBvcnQgdW5wbHVnaW4gZnJvbSAndW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvdml0ZSc7XG5pbXBvcnQgY2xpQ29tcG9uZW50c092ZXJyaWRlIGZyb20gJy4vdW5wbHVnaW4tcmVzb2x2ZXIvY2xpLWNvbXBvbmVudHMub3ZlcnJpZGUnO1xuaW1wb3J0IHtnZXRFbnYsIGlzRW52VHJ1ZX0gZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgU3RyaW5nUmVwbGFjZSBmcm9tICd2aXRlLXBsdWdpbi1zdHJpbmctcmVwbGFjZSc7XG5pbXBvcnQge2dldEFsbFBhZ2VzLCBnZXRJbmplY3RDb2RlfSBmcm9tICcuLi9tcGEvcGFnZXMuanMnO1xuaW1wb3J0IFJlcGxhY2VOYW1lIGZyb20gJy4vcmVwbGFjZS1uYW1lJztcbmltcG9ydCB7Y29weU1vZHVsZVB1YmxpY30gZnJvbSAnLi9jb3B5TW9kdWxlUHVibGljJztcbmltcG9ydCBGaWxlUmVwbGFjZSBmcm9tICcuLi8uLi9pbnRlcm5hbC9yZXBsYWNlLWZpbGVzL3NyYyc7XG5cbmNvbnN0IGZzcCA9IGZzLnByb21pc2VzO1xuXG5jb25zdCBQUklNQVJZX0NPTE9SX1JFR0VYID0gL0BwcmltYXJ5LWNvbG9yOiAoLiopOy9nO1xuXG5jb25zdCBERU1BTkRfVUlfSU1QT1JUX0JMQUNLX0xJU1QgPSBbJ2NvbnRhaW5lci1tYXNrJywgJ21lc3NhZ2UnLCAnbW9kYWwnLCAnbm90aWZpY2F0aW9uJ107XG5jb25zdCBJR05PUkVfVlVFX1VTRSA9IFsnZHJpdmVyJ107XG5cbmZ1bmN0aW9uIHJlc29sdmVQcmVzZXRUaGVtZVBhdGgoZmlsZT86IHN0cmluZykge1xuICByZXR1cm4gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uLy4uL2ludGVybmFsL3RoZW1lL3ByZXNldC10aGVtZScsIGZpbGUgPz8gJycpO1xufVxuXG4vKipcbiAqIFx1OEJGQlx1NTNENlx1OTg4NFx1OEJCRVx1NEUzQlx1OTg5OCgvc3JjL2NvbW1vbi9keW5hbWljVGhlbWUvcHJlc2V0LXRoZW1lKVx1NzZFRVx1NUY1NVx1NEUwQlx1NzY4NGxlc3NcdTY1ODdcdTRFRjZcbiAqIFx1OEZENFx1NTZERTpcbiAqICAgbXVsdGlwbGVTY29wZVZhcnM6IFx1N0VEOVx1NjM2Mlx1ODBBNFx1NjNEMlx1NEVGNlx1NzUyOFx1NzY4NFx1NjU3MFx1N0VDNCxcdTVCNThcdTUwQThcdTRFODZsZXNzXHU2NTg3XHU0RUY2XHU0RTJEXHU3Njg0XHU2ODM3XHU1RjBGXHU1M0Q4XHU5MUNGXG4gKiAgIHZpcnR1YWxUaGVtZXM6IFx1N0VEOVx1OTg3NVx1OTc2Mlx1NjYzRVx1NzkzQVx1NEY3Rlx1NzUyOFx1NzY4NFx1NUJGOVx1OEM2MSxcdTVCNThcdTUwQThcdTRFODZcdTRFM0JcdTk4OThcdTU0MERcdTRFMEVwcmltYXJ5LWNvbG9yXHU3Njg0XHU1QkY5XHU1RTk0XG4gKi9cbmFzeW5jIGZ1bmN0aW9uIHJlYWRQcmVzZXRUaGVtZVByaW1hcnlDb2xvcigpIHtcbiAgY29uc3Qge2luY2x1ZGVTdHlsZXN9ID0gdml0ZUNvbW1vbkNvbmZpZztcbiAgY29uc3QgcHJlc2V0VGhlbWVzID0gYXdhaXQgZnNwLnJlYWRkaXIocmVzb2x2ZVByZXNldFRoZW1lUGF0aCgpKTtcbiAgY29uc3QgbXVsdGlwbGVTY29wZVZhcnM6IEFycmF5PHtcbiAgICBzY29wZU5hbWU6IHN0cmluZztcbiAgICB2YXJzQ29udGVudD86IHN0cmluZztcbiAgICBwYXRoPzogc3RyaW5nO1xuICAgIGluY2x1ZGVTdHlsZXM/OiBSZWNvcmQ8c3RyaW5nLCBSZWNvcmQ8c3RyaW5nLCBzdHJpbmc+PjtcbiAgfT4gPSBbXTtcbiAgY29uc3QgdmlydHVhbFRoZW1lcyA9IHt9O1xuICBmb3IgKGNvbnN0IHRoZW1lIG9mIHByZXNldFRoZW1lcykge1xuICAgIC8vIFx1NTNFQVx1NTkwNFx1NzQwNmxlc3NcdTU0MEVcdTdGMDBcdTc2ODRcdTY1ODdcdTRFRjZcbiAgICBpZiAodGhlbWUuZW5kc1dpdGgoJy5sZXNzJykpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1hd2FpdC1pbi1sb29wXG4gICAgICBjb25zdCBsZXNzQ29kZSA9IChhd2FpdCBmc3AucmVhZEZpbGUocmVzb2x2ZVByZXNldFRoZW1lUGF0aCh0aGVtZSkpKS50b1N0cmluZygpO1xuICAgICAgY29uc3QgbWF0Y2ggPSBsZXNzQ29kZS5tYXRjaEFsbChQUklNQVJZX0NPTE9SX1JFR0VYKTtcbiAgICAgIGNvbnN0IHByaW1hcnlDb2xvciA9IG1hdGNoLm5leHQoKS52YWx1ZVsxXTtcbiAgICAgIG11bHRpcGxlU2NvcGVWYXJzLnB1c2goe1xuICAgICAgICBzY29wZU5hbWU6IGB0aGVtZS0ke3RoZW1lLnJlcGxhY2UoJy5sZXNzJywgJycpfWAsXG4gICAgICAgIHBhdGg6IHJlc29sdmVQcmVzZXRUaGVtZVBhdGgodGhlbWUpLFxuICAgICAgICBpbmNsdWRlU3R5bGVzLFxuICAgICAgfSk7XG4gICAgICB2aXJ0dWFsVGhlbWVzW3RoZW1lLnJlcGxhY2UoJy5sZXNzJywgJycpXSA9IHtcbiAgICAgICAgJ3ByaW1hcnktY29sb3InOiBwcmltYXJ5Q29sb3IsXG4gICAgICB9O1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbXVsdGlwbGVTY29wZVZhcnMsXG4gICAgdmlydHVhbFRoZW1lcyxcbiAgfTtcbn1cblxuLyoqXG4gKiBcdTU3RkFcdTc4NDBcdTYzRDJcdTRFRjZcbiAqIEBwYXJhbSBfbW9kZVxuICogQHBhcmFtIGlnbm9yZUh0bWxQbHVnaW5cbiAqL1xuYXN5bmMgZnVuY3Rpb24gYmFzZVBsdWdpbnMoX21vZGU6IHN0cmluZywgaWdub3JlSHRtbFBsdWdpbjogYm9vbGVhbiA9IGZhbHNlKSB7XG4gIGNvbnN0IHtjb3B5UmVzb3VyY2VzLCBodG1sLCBjbGl9ID0gdml0ZUNvbW1vbkNvbmZpZztcbiAgY29uc3QgdGFyZ2V0cyA9IFsuLi5jb3B5UmVzb3VyY2VzLCAuLi5jb3B5TW9kdWxlUHVibGljKCldLm1hcCgocmVzb3VyY2UpID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgc3JjOiByZXNvdXJjZS5mcm9tLFxuICAgICAgZGVzdDogcmVzb3VyY2UudG8sXG4gICAgfTtcbiAgfSk7XG4gIGNvbnN0IHtoaXN0b3J5UGFnZX0gPSBjbGk7XG4gIGNvbnN0IGhpc3RvcnlQYWdlSW5qZWN0SW50b0ZhY2VDb25maWcgPSBoaXN0b3J5UGFnZS5tYXAoKGhwKSA9PiB7XG4gICAgcmV0dXJuIGAke2hwfS5odG1sYDtcbiAgfSk7XG5cbiAgY29uc3Qge211bHRpcGxlU2NvcGVWYXJzLCB2aXJ0dWFsVGhlbWVzfSA9IGF3YWl0IHJlYWRQcmVzZXRUaGVtZVByaW1hcnlDb2xvcigpO1xuICBjb25zdCB1c2VMZXNzRmlsZSA9IGdldEVudignVklURV9QRVJGX0xPQURfTEVTUycpO1xuICBjb25zdCB1c2VTaW5nbGVDc3MgPSB1c2VMZXNzRmlsZSA9PT0gJ3NpbmdsZSc7XG4gIGNvbnN0IHVzZU9sZE1vZHVsZXMgPSBpc0VudlRydWUoJ1VTRV9PTERfTU9EVUxFU19TVVBQT1JUJyk7XG4gIGNvbnN0IHVzZURlbWFuZEltcG9ydCA9IGlzRW52VHJ1ZSgnQlVJTERfREVNQU5EX1VJX0lNUE9SVCcpO1xuICBjb25zdCBwbHVnaW5zID0gW107XG4gIGlmICghaWdub3JlSHRtbFBsdWdpbikge1xuICAgIGNvbnN0IHBhZ2VzID0gYXdhaXQgZ2V0QWxsUGFnZXMoKTtcbiAgICBjb25zdCBpbmplY3RWYXJpYWJsZXMgPSBhd2FpdCBnZXRJbmplY3RDb2RlKCk7XG4gICAgcGx1Z2lucy5wdXNoKFxuICAgICAgLy8gXHU4MUVBXHU1MkE4XHU4QkM2XHU1MjJCXHU5ODc5XHU3NkVFXHU0RTBCXHU3Njg0XHU2MjQwXHU2NzA5aHRtbFx1NjU4N1x1NEVGNixcdTVFNzZcdTRFMTRcdTYzOTJcdTk2NjRcdTkwRThcdTUyMDZcdTRFMERcdTk3MDBcdTg5ODFcdTc2ODRcdTY1ODdcdTRFRjZcbiAgICAgIFZpcnR1YWxIdG1sKHtcbiAgICAgICAgcGFnZXMsXG4gICAgICAgIGluamVjdENvZGU6IGluamVjdFZhcmlhYmxlcyxcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cblxuICBwbHVnaW5zLnB1c2goXG4gICAgLi4uW1xuICAgICAgdnVlKHt9KSxcbiAgICAgIGpzeCh7XG4gICAgICAgIGNvbXBvc2l0aW9uQVBJOiBmYWxzZSxcbiAgICAgIH0pLFxuICAgICAgdW5wbHVnaW4oe1xuICAgICAgICByZXNvbHZlcnM6IFtjbGlDb21wb25lbnRzT3ZlcnJpZGUoKV0sXG4gICAgICAgIHZlcnNpb246IDIuNyxcbiAgICAgICAgZHRzOiBmYWxzZSxcbiAgICAgICAgaW5jbHVkZTogWy9cXC52dWUvLCAvXFwudnVlXFw/dnVlLywgL1xcLm1kLywgL1xcLihbdGpdKXN4Py8sIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXUB5aFtcXFxcL10vXSxcbiAgICAgICAgZXhjbHVkZTogWy9bXFxcXC9dXFwuZ2l0W1xcXFwvXS8sIC9bXFxcXC9dbm9kZV9tb2R1bGVzW1xcXFwvXVxcLnZpdGVbXFxcXC9dL10sXG4gICAgICB9KSxcbiAgICAgIHVpVml0ZSh7XG4gICAgICAgIHRyYW5zZm9ybShtb2R1bGVOYW1lLCBjYW1lbENhc2UpIHtcbiAgICAgICAgICBsZXQgdWlOYW1lID0gJ0B5aC90YTQwNC11aSc7XG4gICAgICAgICAgbGV0IHVpU3R5bGVQb3N0Zml4ID0gJy5sZXNzJztcbiAgICAgICAgICBsZXQgbW9kdWxlcyA9IGBpbXBvcnQgeyR7bW9kdWxlTmFtZX19IGZyb20gXCJAeWgvdGE0MDQtdWlcIjtgO1xuICAgICAgICAgIGlmICh1c2VPbGRNb2R1bGVzKSB7XG4gICAgICAgICAgICBtb2R1bGVzID0gYGltcG9ydCAke21vZHVsZU5hbWV9IGZyb20gXCJAeWgvdGE0MDQtdWkvZXMvJHtjYW1lbENhc2V9XCI7YDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAodXNlTGVzc0ZpbGUgPT09ICdmYWxzZScpIHtcbiAgICAgICAgICAgIHVpTmFtZSA9ICdAeWgvY2xpLWludGVybmFsLXByZWNvbXBpbGVkLWxlc3MnO1xuICAgICAgICAgICAgdWlTdHlsZVBvc3RmaXggPSAnLmNzcyc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IHN0eWxlSW1wb3J0ZXIgPSAnJztcblxuICAgICAgICAgIGlmICh1c2VTaW5nbGVDc3MpIHtcbiAgICAgICAgICAgIHN0eWxlSW1wb3J0ZXIgPSAnaW1wb3J0IFwiQHloL2NsaS1pbnRlcm5hbC1wcmVjb21waWxlZC1sZXNzL2Nzcy91aS5jc3NcIjsnO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdHlsZUltcG9ydGVyID0gYGltcG9ydCBcIiR7dWlOYW1lfS9lcy8ke2NhbWVsQ2FzZX0vc3R5bGUvaW5kZXgke3VpU3R5bGVQb3N0Zml4fVwiO2A7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGV0IHJlc3VsdCA9ICcnO1xuICAgICAgICAgIGlmIChcbiAgICAgICAgICAgIHVzZURlbWFuZEltcG9ydCAmJlxuICAgICAgICAgICAgWy4uLkRFTUFORF9VSV9JTVBPUlRfQkxBQ0tfTElTVCwgLi4uSUdOT1JFX1ZVRV9VU0VdLmluZGV4T2YoY2FtZWxDYXNlKSA8IDBcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIHJlc3VsdCA9IGBcbiAgICAgICAgICBjb25zdCAke21vZHVsZU5hbWV9ID0gYXdhaXQgaW1wb3J0KCdAeWgvdGE0MDQtdWkvZXMvJHtjYW1lbENhc2V9Jyk7XG4gICAgICAgICAgVnVlLnVzZSgke21vZHVsZU5hbWV9LmRlZmF1bHQpO1xuICAgICAgICAgICAgICAgICR7c3R5bGVJbXBvcnRlcn1cbiAgICAgICAgICAgICAgICBgO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQgPSBgXG4gICAgICAgICAgICAgICR7bW9kdWxlc31cbiAgICAgICAgICAgICAgJHtzdHlsZUltcG9ydGVyfVxuICAgICAgICAgICAgICBgO1xuICAgICAgICAgICAgaWYgKElHTk9SRV9WVUVfVVNFLmluZGV4T2YoY2FtZWxDYXNlKSA8IDApIHtcbiAgICAgICAgICAgICAgcmVzdWx0ICs9IGBcbiAgICAgICAgICAgIFZ1ZS51c2UoJHttb2R1bGVOYW1lfSk7XG4gICAgICAgICAgICBgO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9LFxuICAgICAgfSksXG4gICAgICAvLyBcdTU5MERcdTUyMzZcdTk3NTlcdTYwMDFcdTY1ODdcdTRFRjZcbiAgICAgIHZpdGVTdGF0aWNDb3B5KHtcbiAgICAgICAgdGFyZ2V0cyxcbiAgICAgIH0pLFxuICAgICAgdmlydHVhbE1vZHVsZSh7XG4gICAgICAgIG1vZHVsZXM6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBcdTUyQThcdTYwMDFcdTYzNjJcdTgwQTRcdTkxNERcdTdGNkVcbiAgICAgICAgICAgIG1vZHVsZU5hbWU6ICdkeW5hbWljVGhlbWUnLFxuICAgICAgICAgICAgbW9kdWxlVmFsdWU6IFwiaW1wb3J0IHsgaW5pdFRoZW1lLCB9IGZyb20gJ0B5aC9jbGktaW50ZXJuYWwtZHluYW1pYy10aGVtZSc7aW5pdFRoZW1lKCk7XCIsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBtb2R1bGVOYW1lOiAndGhlbWVEZWZpbml0aW9ucycsXG4gICAgICAgICAgICBtb2R1bGVWYWx1ZTogYGV4cG9ydCBkZWZhdWx0ICR7SlNPTi5zdHJpbmdpZnkodmlydHVhbFRoZW1lcyl9O2AsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICAvLyBpMThuXHU5MTREXHU3RjZFXG4gICAgICAgICAgICBtb2R1bGVOYW1lOiAnZHluYW1pY0kxOG4nLFxuICAgICAgICAgICAgbW9kdWxlVmFsdWU6IGBcbiAgICAgICAgICBpbXBvcnQgeyBtYWtlSTE4biwgfSBmcm9tICdAeWgvY2xpLWludGVybmFsLXByZWNvbXBpbGVkLWxvY2FsZXMnO1xuICAgICAgICAgIGV4cG9ydCB7XG4gICAgICAgICAgICBtYWtlSTE4bixcbiAgICAgICAgICB9XG4gICAgICAgICAgYCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1vZHVsZU5hbWU6ICdoaXN0b3J5UGFnZScsXG4gICAgICAgICAgICBtb2R1bGVWYWx1ZTogYFxuICAgICAgICAgIGNvbnN0IGhpc3RvcnlQYWdlID0gJHtKU09OLnN0cmluZ2lmeShoaXN0b3J5UGFnZUluamVjdEludG9GYWNlQ29uZmlnKX07XG4gICAgICAgICAgZXhwb3J0IGRlZmF1bHQgaGlzdG9yeVBhZ2U7XG4gICAgICAgICAgYCxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIG1vZHVsZU5hbWU6ICdkYXJrTW9kZScsXG4gICAgICAgICAgICBtb2R1bGVWYWx1ZTogYFxuICAgICAgICAgIGltcG9ydCB7IHVwZGF0ZUNvbG9yV2VhaywgfSBmcm9tICdAeWgvY2xpLWludGVybmFsLWR5bmFtaWMtdGhlbWUnO1xuICAgICAgICAgIGltcG9ydCB7IGNyZWF0ZVdlYlN0b3JhZ2UsIH0gZnJvbSAnQHloL3RhLXV0aWxzJztcblxuICAgICAgICAgIGlmKGltcG9ydC5tZXRhLmVudi5WSVRFX0VOQUJMRV9EQVJLX01PREUudG9VcHBlckNhc2UoKSA9PT0gJ1RSVUUnKXtcbiAgICAgICAgICAgIGltcG9ydCgnL2ludGVybmFsL3RoZW1lL2RhcmsvZGFyay1tb2RlLmxlc3MnKTtcbiAgICAgICAgICAgIGNvbnN0IGRhcmtNb2RlU3RvcmFnZSA9IGNyZWF0ZVdlYlN0b3JhZ2UoaW1wb3J0Lm1ldGEuZW52LlZJVEVfVEhFTUVfU1RPUkFHRV9LRVksIHsgaXNMb2NhbDogdHJ1ZSwgfSk7XG4gICAgICAgICAgICBjb25zdCBzdiA9IGRhcmtNb2RlU3RvcmFnZS5nZXQoJ2RhcmtfbW9kZScpO1xuICAgICAgICAgICAgdXBkYXRlQ29sb3JXZWFrKHN2ID09PSBudWxsID8gaW1wb3J0Lm1ldGEuZW52LlZJVEVfREFSS19NT0RFLnRvVXBwZXJDYXNlKCkgPT09ICdUUlVFJyA6ICEhc3YpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBgLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgLy8gXHU5MDAyXHU4MDAxXHU1MzE2XHU2QTIxXHU1NzU3XG4gICAgICAgICAgICBtb2R1bGVOYW1lOiAnZWxkZXJseScsXG4gICAgICAgICAgICBtb2R1bGVWYWx1ZTogYFxuICAgICAgICAgICAgIGltcG9ydCB7IHVzZUV2ZW50QnVzLCB9IGZyb20gJ0B2dWV1c2UvY29yZSc7XG4gICAgICAgICAgICAgaW1wb3J0IFZ1ZSBmcm9tICd2dWUnO1xuICAgICAgICAgICAgIGltcG9ydCB7IGNyZWF0ZVdlYlN0b3JhZ2UsIH0gZnJvbSAnQHloL3RhLXV0aWxzJztcbiAgICAgICAgICAgICBjb25zdCBlbGRlcmx5RXZlbnRCdXMgPSB1c2VFdmVudEJ1cygnZWxkZXJseScpO1xuICAgICAgICAgICAgIC8vIFx1NTIxRFx1NTlDQlx1NTMxNnNpemVcbiAgICAgICAgICAgICAgVnVlLnByb3RvdHlwZS4kRUxFTUVOVCA9IHtcbiAgICAgICAgICAgICAgICBzaXplOiAnZGVmYXVsdCcsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgVnVlLm9ic2VydmFibGUoVnVlLnByb3RvdHlwZS4kRUxFTUVOVClcbiAgICAgICAgICAgICAgZWxkZXJseUV2ZW50QnVzLm9uKChlKSA9PiB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmFzc2lnbihWdWUucHJvdG90eXBlLiRFTEVNRU5ULCB7fSwgZSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIGNvbnN0IGVsZGVybHlDb25maWcgPSB7XG4gICAgICAgICAgICAgICAgLy8gXHU5ODc2XHU5MEU4XHU1OTM0XHU3Njg0XHU5QUQ4XHU1RUE2XG4gICAgICAgICAgICAgICAgaGVhZGVySGVpZ2h0OiAnOTBweCcsXG4gICAgICAgICAgICAgICAgLy8gdGFicyBcdTc2ODRcdTlBRDhcdTVFQTZcbiAgICAgICAgICAgICAgICB0YWJIZWlnaHQ6ICc2OHgnLFxuICAgICAgICAgICAgICAgIC8vIFx1NURFNlx1NEZBN1x1ODNEQ1x1NTM1NVx1NzY4NFx1NUJCRFx1NUVBNlxuICAgICAgICAgICAgICAgIGxlZnRXaWR0aDogJzM1OHB4JyxcbiAgICAgICAgICAgICAgICAvLyBsb2dvXHU2ODQ2XHU3Njg0XHU1QkJEXHU1RUE2XHVGRjA4XHU4M0RDXHU1MzU1XHU0RTNBdG9wXHU2NUY2XHU2NzA5XHU2NTQ4XHVGRjBDXHU1MTc2XHU0RjU5bG9nb1x1Njg0Nlx1NUJCRFx1NUVBNlx1N0I0OVx1NEU4RVx1NURFNlx1NEZBN1x1ODNEQ1x1NTM1NVx1NUJCRFx1NUVBNlx1RkYwOVxuICAgICAgICAgICAgICAgIGxvZ29XaWR0aDogJzM1OHB4JyxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBjb25zdCBpbmRleEVsZGVybHlDb25maWdDaGFuZ2U9KGluZGV4X3BhZ2UpPT57XG4gICAgICAgICAgICAgICAgICBjb25zdCB0aGVtZVN0b3JhZ2UgPSBjcmVhdGVXZWJTdG9yYWdlKGltcG9ydC5tZXRhLmVudi5WSVRFX1RIRU1FX1NUT1JBR0VfS0VZLCB7IGlzTG9jYWw6IHRydWUsIH0pXG4gICAgICAgICAgICAgICAgICBjb25zdCBpbmRleFRoZW1lID0gdGhlbWVTdG9yYWdlLmdldChpbXBvcnQubWV0YS5lbnYuVklURV9USEVNRV9TVE9SQUdFX0tFWSlcbiAgICAgICAgICAgICAgICAgIGlmKGluZGV4VGhlbWU9PT0nZWxkZXJseS1vcmllbnRlZCcpe1xuICAgICAgICAgICAgICAgICAgICBpbmRleF9wYWdlLiRzdG9yZS5kaXNwYXRjaCgnc2V0U3RhdGVWYWx1ZScsIGVsZGVybHlDb25maWcpXG4gICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgIGluZGV4X3BhZ2UuJHN0b3JlLmRpc3BhdGNoKCdzZXRTdGF0ZVZhbHVlJyxmYWNlQ29uZmlnLmluZGV4UGFnZUNvbmZpZylcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBleHBvcnQge1xuICAgICAgICAgICAgICAgIGVsZGVybHlDb25maWcsXG4gICAgICAgICAgICAgICAgZWxkZXJseUV2ZW50QnVzLFxuICAgICAgICAgICAgICAgIGluZGV4RWxkZXJseUNvbmZpZ0NoYW5nZSxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgIGAsXG4gICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICAgIH0pLFxuICAgIF0sXG4gICk7XG5cbiAgbGV0IHJtc3YgPSBtdWx0aXBsZVNjb3BlVmFycztcbiAgY29uc3QgcHJlc2V0VGhlbWUgPSBgdGhlbWUtJHtnZXRFbnYoJ1ZJVEVfUFJFU0VUX1RIRU1FJyl9YDtcbiAgaWYgKCFpc0VudlRydWUoJ1ZJVEVfT05MSU5FX1RIRU1FX0VOQUJMRUQnKSkge1xuICAgIHJtc3YgPSBybXN2LmZpbHRlcigoaXQpID0+IHtcbiAgICAgIHJldHVybiBpdC5zY29wZU5hbWUgPT09IHByZXNldFRoZW1lO1xuICAgIH0pO1xuICB9XG4gIHBsdWdpbnMucHVzaChcbiAgICB0aGVtZVByZXByb2Nlc3NvclBsdWdpbi5kZWZhdWx0KHtcbiAgICAgIGxlc3M6IHtcbiAgICAgICAgLy8gXHU2M0QwXHU0RjlCXHU1OTFBXHU3RUM0XHU1M0Q4XHU5MUNGXHU2NTg3XHU0RUY2XG4gICAgICAgIG11bHRpcGxlU2NvcGVWYXJzOiBybXN2LFxuICAgICAgICAvLyBjc3NcdTRFMkRcdTRFMERcdTY2MkZcdTc1MzFcdTRFM0JcdTk4OThcdTgyNzJcdTUzRDhcdTkxQ0ZcdTc1MUZcdTYyMTBcdTc2ODRcdTk4OUNcdTgyNzJcdUZGMENcdTRFNUZcdThCQTlcdTVCODNcdTYyQkRcdTUzRDZcdTUyMzBcdTRFM0JcdTk4OThjc3NcdTUxODVcdUZGMENcdTUzRUZcdTRFRTVcdTYzRDBcdTlBRDhcdTY3NDNcdTkxQ0RcbiAgICAgICAgaW5jbHVkZVN0eWxlV2l0aENvbG9yczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIC8vIGNvbG9yOiAnI2ZmZmZmZicsXG4gICAgICAgICAgICAvLyBcdTZCNjRcdTdDN0JcdTk4OUNcdTgyNzJcdTc2ODRcdTY2MkZcdTU0MjZcdThEREZcdTk2OEZcdTRFM0JcdTk4OThcdTgyNzJcdTY4QUZcdTVFQTZcdTUzRDhcdTUzMTZcdUZGMENcdTlFRDhcdThCQTRmYWxzZVxuICAgICAgICAgICAgLy8gaW5HcmFkaWVudDogdHJ1ZSxcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgICAvLyBcdTlFRDhcdThCQTRcdTUzRDYgbXVsdGlwbGVTY29wZVZhcnNbMF0uc2NvcGVOYW1lXG4gICAgICAgIGRlZmF1bHRTY29wZU5hbWU6IHByZXNldFRoZW1lLFxuICAgICAgICAvLyBcdTU3MjhcdTc1MUZcdTRFQTdcdTZBMjFcdTVGMEZcdTY2MkZcdTU0MjZcdTYyQkRcdTUzRDZcdTcyRUNcdTdBQ0JcdTc2ODRcdTRFM0JcdTk4OThjc3NcdTY1ODdcdTRFRjZcdUZGMENleHRyYWN0XHU0RTNBdHJ1ZVx1NEVFNVx1NEUwQlx1NUM1RVx1NjAyN1x1NjcwOVx1NjU0OFxuICAgICAgICBleHRyYWN0OiBmYWxzZSxcbiAgICAgIH0sXG4gICAgfSksXG4gICk7XG4gIHBsdWdpbnMucHVzaChGaWxlUmVwbGFjZSh2aXRlQ29tbW9uQ29uZmlnLmNsaS5maWxlcykpO1xuICByZXR1cm4gcGx1Z2lucztcbn1cblxuLyoqXG4gKiBcdTVGMDBcdTUzRDFcdTY1RjZcdTc2ODRcdTYzRDJcdTRFRjZcbiAqL1xuZnVuY3Rpb24gZGV2UGx1Z2lucyhfbW9kZTogc3RyaW5nKSB7XG4gIGNvbnN0IHtoaXN0b3J5UGFnZX0gPSB2aXRlQ29tbW9uQ29uZmlnLmNsaTtcbiAgY29uc3QgcmV3cml0ZXMgPSBoaXN0b3J5UGFnZS5tYXAoKGhwKSA9PiB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGZyb206IG5ldyBSZWdFeHAoYCR7aHB9Ly4qYCksXG4gICAgICB0bzogYCR7Z2V0RW52KCdWSVRFX1BVQkxJQ19QQVRIJyl9JHtocH0uaHRtbGAsXG4gICAgfTtcbiAgfSk7XG4gIHJldHVybiBbXG4gICAgdml0ZUNvbW1vbmpzKHtcbiAgICAgIGluY2x1ZGU6ICh2aXRlQ29tbW9uQ29uZmlnLmNvbW1vbmpzLmluY2x1ZGUgYXMgQXJyYXk8c3RyaW5nPikubWFwKChrKSA9PlxuICAgICAgICBrLnJlcGxhY2VBbGwoJyoqJywgJycpLFxuICAgICAgKSxcbiAgICAgIGV4Y2x1ZGU6IFsnY29yZS1qcycsICdAaXRrLXdhc20vZGljb20nLCAnaXRrLXdhc20nLCAnaXRrJ10sXG4gICAgfSksXG4gICAgLy8gXHU2N0U1XHU3NzBCdml0ZVx1NTQwNFx1NEUyQVx1NjNEMlx1NEVGNlx1NUJGOVx1NEU4RVx1NkJDRlx1NEUyQVx1NjU4N1x1NEVGNlx1NjYyRlx1NTk4Mlx1NEY1NVx1NTJBMFx1OEY3RC9cdTU5MDRcdTc0MDYsXHU1QkY5XHU0RThFXHU4QzAzXHU4QkQ1XHU0RUUzXHU3ODAxXHU2NzA5XHU0RTAwXHU1QjlBXHU3Njg0XHU0RjVDXHU3NTI4XG4gICAgSW5zcGVjdCgpLFxuICAgIC8vIFx1OTg3NVx1OTc2Mlx1NEZFRVx1NjUzOVx1NEUzQWhpc3RvcnlcdTZBMjFcdTVGMEZcbiAgICBoaXN0b3J5QXBpRmFsbGJhY2tQbHVnaW4oe1xuICAgICAgcmV3cml0ZXMsXG4gICAgfSksXG4gIF07XG59XG5cbi8qKlxuICogXHU3RjE2XHU4QkQxXHU3NTFGXHU0RUE3XHU0RUUzXHU3ODAxXHU2NUY2XHU3Njg0XHU2M0QyXHU0RUY2XG4gKiBAcGFyYW0gX21vZGVcbiAqL1xuYXN5bmMgZnVuY3Rpb24gcHJvZFBsdWdpbnMoX21vZGU6IHN0cmluZykge1xuICBjb25zdCByZXN1bHQgPSBbXTtcbiAgaWYgKGlzRW52VHJ1ZSgnQlVJTERfUkVQT1JUJykpIHtcbiAgICAvLyBcdTdGMTZcdThCRDFcdTc1MUZcdTRFQTdcdTRFRTNcdTc4MDFcdTY1RjYsXHU1QkY5XHU0RThFXHU1NDA0XHU0RTJBY2h1bmtzXHU2NTg3XHU0RUY2XHU1MzA1XHU1NDJCXHU1MTg1XHU1QkI5XHU4RkRCXHU4ODRDXHU1M0VGXHU4OUM2XHU1MzE2XHU3Njg0XHU2N0U1XHU3NzBCLFx1NUU3Nlx1NjNEMFx1NEY5Qlx1NjJDNlx1NTIwNlx1NEVFM1x1NzgwMVx1NzY4NFx1NEY5RFx1NjM2RVxuICAgIHJlc3VsdC5wdXNoKFxuICAgICAgdmlzdWFsaXplcih7XG4gICAgICAgIGZpbGVuYW1lOiBgJHtnZXRFbnYoJ09VVFBVVF9ESVInKX0vcmVwb3J0Lmh0bWxgLFxuICAgICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgIH0pLFxuICAgICk7XG4gIH1cbiAgcmVzdWx0LnB1c2goXG4gICAgU3RyaW5nUmVwbGFjZShbXG4gICAgICB7XG4gICAgICAgIGZpbGVOYW1lOiAnanF1ZXJ5LmpzJyxcbiAgICAgICAgc2VhcmNoOiAndjIuMi4xJyxcbiAgICAgICAgcmVwbGFjZTogJycsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBmaWxlTmFtZTogJ3Z1ZS1ncmlkLWxheW91dC5jb21tb24uanMnLFxuICAgICAgICBzZWFyY2g6ICduZXcgZXh0ZXJuYWxfY29tbW9uanNfdnVlX2NvbW1vbmpzMl92dWVfcm9vdF9WdWVfZGVmYXVsdC5hJyxcbiAgICAgICAgcmVwbGFjZTogJ25ldyBleHRlcm5hbF9jb21tb25qc192dWVfY29tbW9uanMyX3Z1ZV9yb290X1Z1ZV9kZWZhdWx0LmEuZGVmYXVsdCcsXG4gICAgICB9LFxuICAgIF0pLFxuICApO1xuICBpZiAoaXNFbnZUcnVlKCdCVUlMRF9JTkpFQ1RfTU9ERVJOX1BPTFlGSUxMUycpKSB7XG4gICAgcmVzdWx0LnB1c2goXG4gICAgICBsZWdhY3koe1xuICAgICAgICBtb2Rlcm5Qb2x5ZmlsbHM6IGF3YWl0IGltcG9ydCgnY29yZS1qcy1jb21wYXQnKS50aGVuKChkKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGQuZGVmYXVsdCh2aXRlQ29tbW9uQ29uZmlnLmJ1aWxkLnBvbHlmaWxscykubGlzdDtcbiAgICAgICAgfSksXG4gICAgICAgIHJlbmRlckxlZ2FjeUNodW5rczogZmFsc2UsXG4gICAgICB9KSxcbiAgICApO1xuICB9XG4gIGlmIChpc0VudlRydWUoJ0JVSUxEX0xFR0FDWScpICYmICFpc0VudlRydWUoJ0JVSUxEX0RFTUFORF9VSV9JTVBPUlQnKSkge1xuICAgIGlmIChpc0VudlRydWUoJ0JVSUxEX0lOSkVDVF9NT0RFUk5fUE9MWUZJTExTJykpIHtcbiAgICAgIHJlc3VsdC5wb3AoKTtcbiAgICB9XG4gICAgY29uc3QgbW9kZXJuUG9seWZpbGxzID0gYXdhaXQgaW1wb3J0KCdjb3JlLWpzLWNvbXBhdCcpLnRoZW4oKGQpID0+IHtcbiAgICAgIHJldHVybiBkLmRlZmF1bHQodml0ZUNvbW1vbkNvbmZpZy5idWlsZC5wb2x5ZmlsbHMpLmxpc3Q7XG4gICAgfSk7XG4gICAgY29uc3QgdGFyZ2V0c1dpdGhJRSA9IHtcbiAgICAgIGllOiAnMTEnLFxuICAgIH07XG4gICAgY29uc3QgbGVnYWN5UG9seWZpbGxzID0gYXdhaXQgaW1wb3J0KCdjb3JlLWpzLWNvbXBhdCcpLnRoZW4oKGQpID0+IHtcbiAgICAgIHJldHVybiBkLmRlZmF1bHQoe1xuICAgICAgICB0YXJnZXRzOiB0YXJnZXRzV2l0aElFLFxuICAgICAgfSkubGlzdDtcbiAgICB9KTtcbiAgICByZXN1bHQucHVzaChcbiAgICAgIGxlZ2FjeSh7XG4gICAgICAgIHRhcmdldHM6IFsnZGVmYXVsdHMnLCAnSUUgMTEnXSxcbiAgICAgICAgYWRkaXRpb25hbExlZ2FjeVBvbHlmaWxsczogWydyZWdlbmVyYXRvci1ydW50aW1lL3J1bnRpbWUnXSxcbiAgICAgICAgbW9kZXJuUG9seWZpbGxzOiBpc0VudlRydWUoJ0JVSUxEX0lOSkVDVF9NT0RFUk5fUE9MWUZJTExTJykgPyBtb2Rlcm5Qb2x5ZmlsbHMgOiBbXSxcbiAgICAgICAgcG9seWZpbGxzOiBsZWdhY3lQb2x5ZmlsbHMsXG4gICAgICB9KSxcbiAgICApO1xuICB9XG4gIGlmIChpc0VudlRydWUoJ0JVSUxEX0lOU1BFQ1RfUkVQT1JUJykpIHtcbiAgICByZXN1bHQucHVzaChcbiAgICAgIEluc3BlY3Qoe1xuICAgICAgICBidWlsZDogdHJ1ZSxcbiAgICAgICAgb3V0cHV0RGlyOiAnLnZpdGUtaW5zcGVjdCcsXG4gICAgICB9KSxcbiAgICApO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWlsZFBsdWdpbnMobW9kZTogc3RyaW5nLCBpZ25vcmVIdG1sUGx1Z2luOiBib29sZWFuID0gZmFsc2UpIHtcbiAgY29uc3QgcGx1Z2lucyA9IFtdO1xuICBwbHVnaW5zLnB1c2goLi4uKGF3YWl0IGJhc2VQbHVnaW5zKG1vZGUsIGlnbm9yZUh0bWxQbHVnaW4pKSk7XG4gIGlmIChtb2RlID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgcGx1Z2lucy5wdXNoKC4uLmRldlBsdWdpbnMobW9kZSkpO1xuICB9XG4gIGlmIChtb2RlID09PSAncHJvZHVjdGlvbicgfHwgbW9kZSA9PT0gJ3ByZXZpZXcnKSB7XG4gICAgcGx1Z2lucy5wdXNoKC4uLihhd2FpdCBwcm9kUGx1Z2lucyhtb2RlKSkpO1xuICAgIGlmIChpc0VudlRydWUoJ0JVSUxEX0lOU1BFQ1QnKSkge1xuICAgICAgcGx1Z2lucy5wdXNoKFxuICAgICAgICBJbnNwZWN0KHtcbiAgICAgICAgICBidWlsZDogdHJ1ZSxcbiAgICAgICAgICBvdXRwdXREaXI6ICcudml0ZS1pbnNwZWN0JyxcbiAgICAgICAgfSksXG4gICAgICApO1xuICAgIH1cbiAgfVxuICBwbHVnaW5zLnB1c2goUmVwbGFjZU5hbWUoKSk7XG4gIHJldHVybiBwbHVnaW5zO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHNyY1xcXFxhbGlhcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovYWktJUU1JThDJUJCJUU1JUFEJUE2JUU1JUJEJUIxJUU1JTgzJThGJUU5JUExJUI5JUU3JTlCJUFFLyVFNCVCQiVBMyVFNyVBMCU4MS90ZXN0Q29kZS90YTQwNHVpLTE1Mi1jdC9kZW1vL2J1aWxkLXZpdGUvc3JjL2FsaWFzLnRzXCI7aW1wb3J0IHZpdGVDb21tb25Db25maWcgZnJvbSAnLi4vLi4vdml0ZUNvbW1vbkNvbmZpZyc7XG5cbmNvbnN0IHsgYWxpYXMgfSA9IHZpdGVDb21tb25Db25maWc7XG5cbmV4cG9ydCBmdW5jdGlvbiBidWlsZEFsaWFzKG1vZGU6IHN0cmluZykge1xuICBjb25zdCByQWxpYXMgPSB7XG4gICAgLi4uYWxpYXMuYmFzZSxcbiAgICAuLi5hbGlhc1ttb2RlXSxcbiAgfTtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHJBbGlhcykubWFwKChrZXkpID0+IHtcbiAgICBjb25zdCB2ID0gckFsaWFzW2tleV07XG4gICAgaWYgKHYucmVwbGFjZW1lbnQpIHtcbiAgICAgIHJldHVybiB2O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBmaW5kOiBrZXksXG4gICAgICAgIHJlcGxhY2VtZW50OiB2LFxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHNyY1xcXFxlbnYudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2FpLSVFNSU4QyVCQiVFNSVBRCVBNiVFNSVCRCVCMSVFNSU4MyU4RiVFOSVBMSVCOSVFNyU5QiVBRS8lRTQlQkIlQTMlRTclQTAlODEvdGVzdENvZGUvdGE0MDR1aS0xNTItY3QvZGVtby9idWlsZC12aXRlL3NyYy9lbnYudHNcIjtpbXBvcnQgVml0ZUNvbW1vbkNvbmZpZyBmcm9tICcuLi8uLi92aXRlQ29tbW9uQ29uZmlnJztcbmltcG9ydCB7IGdldEVudiB9IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCB7IHRpdGxlIH0gPSBWaXRlQ29tbW9uQ29uZmlnLmNsaS5odG1sO1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmluZUVudihfbW9kZTogc3RyaW5nKSB7XG4gIGNvbnN0IHBhZ2VUaXRsZXMgPSB7fTtcbiAgT2JqZWN0LmtleXModGl0bGUpLmZvckVhY2goKGspID0+IHtcbiAgICBwYWdlVGl0bGVzW2BpbXBvcnQubWV0YS5lbnYuVklURV9IVE1MX1RJVExFXyR7ay50b1VwcGVyQ2FzZSgpfWBdID0gYFwiJHt0aXRsZVtrXX1cImA7XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIC4uLnBhZ2VUaXRsZXMsXG4gICAgLy8gaTE4biBcdTkxNERcdTdGNkVcbiAgICAnaW1wb3J0Lm1ldGEuZW52LlZJVEVfSTE4Tl9MT0NBTEUnOiBgXCIke1xuICAgICAgZ2V0RW52KCdWSVRFX0RFRkFVTFRfTE9DQUxFJykgPyBnZXRFbnYoJ1ZJVEVfREVGQVVMVF9MT0NBTEUnKSA6ICd6aF9DTidcbiAgICB9XCJgLFxuICAgICdpbXBvcnQubWV0YS5lbnYuVklURV9JMThOX0ZBTExCQUNLX0xPQ0FMRSc6IGBcIiR7XG4gICAgICBnZXRFbnYoJ1ZJVEVfREVGQVVMVF9MT0NBTEUnKSA/IGdldEVudignVklURV9ERUZBVUxUX0xPQ0FMRScpIDogJ3poX0NOJ1xuICAgIH1cImAsXG4gICAgLy8gXHU1MTdDXHU1QkI5dWlcdTc2ODRcdTUxNjhcdTVDNDBcdTUzRDhcdTkxQ0ZcdTkxNERcdTdGNkVcbiAgICAncHJvY2Vzcy5lbnYuVlVFX0FQUF9WWEVfVEFCTEVfRU5WJzogYCcke2dldEVudignTk9ERV9FTlYnKX0nYCxcbiAgICAncHJvY2Vzcy5lbnYuVlVFX0FQUF9QVUJMSUNfUEFUSCc6IGBcIiR7Z2V0RW52KCdWSVRFX1BVQkxJQ19QQVRIJyl9XCJgLFxuICB9O1xufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcdml0ZS5iYXNlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9haS0lRTUlOEMlQkIlRTUlQUQlQTYlRTUlQkQlQjElRTUlODMlOEYlRTklQTElQjklRTclOUIlQUUvJUU0JUJCJUEzJUU3JUEwJTgxL3Rlc3RDb2RlL3RhNDA0dWktMTUyLWN0L2RlbW8vYnVpbGQtdml0ZS92aXRlLmJhc2UudHNcIjtpbXBvcnQgdHlwZSB7VXNlckNvbmZpZ30gZnJvbSAndml0ZSc7XG5pbXBvcnQge2Nzc30gZnJvbSAnLi9zcmMvY3NzJztcbmltcG9ydCB7Z2V0RW52fSBmcm9tICcuL3NyYy91dGlscyc7XG5pbXBvcnQge2J1aWxkUGx1Z2luc30gZnJvbSAnLi9zcmMvcGx1Z2luJztcbmltcG9ydCB7YnVpbGRBbGlhc30gZnJvbSAnLi9zcmMvYWxpYXMnO1xuaW1wb3J0IHtkZWZpbmVFbnZ9IGZyb20gJy4vc3JjL2Vudic7XG5pbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1aWxkQmFzZUNvbmZpZyhcbiAgbW9kZTogc3RyaW5nLFxuICBpZ25vcmVIdG1sUGx1Z2luOiBib29sZWFuID0gZmFsc2UsXG4pOiBQcm9taXNlPFVzZXJDb25maWc+IHtcbiAgLy8gY3NzIFx1NTJBMFx1OEY3RFx1NEVFNVx1NTNDQXByZWZpeFx1OTE0RFx1N0Y2RVx1NjU4N1x1NEVGNlxuICBjb25zdCBjc3NDb25maWcgPSBhd2FpdCBjc3MoKTtcbiAgcmV0dXJuIHtcbiAgICAvLyBcdTU3RkFcdTc4NDBcdThERUZcdTVGODRcbiAgICBiYXNlOiBnZXRFbnYoJ1ZJVEVfUFVCTElDX1BBVEgnKSxcbiAgICBlbnZEaXI6IHBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCAnLi8uZW52JyksXG4gICAgLy8gXHU2MjUzXHU1MzA1XHU2MjQwXHU3NTI4XHU1MjMwXHU3Njg0XHU2M0QyXHU0RUY2XG4gICAgcGx1Z2luczogYXdhaXQgYnVpbGRQbHVnaW5zKG1vZGUsIGlnbm9yZUh0bWxQbHVnaW4pLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIC8vIFx1NTIyQlx1NTQwRFxuICAgICAgYWxpYXM6IGJ1aWxkQWxpYXMobW9kZSksXG4gICAgfSxcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGV4Y2x1ZGU6IFsnQGl0ay13YXNtL2RpY29tJ10sXG4gICAgfSxcbiAgICAvLyBcdTVCOUFcdTRFNDlcdTUxNjhcdTVDNDBcdTVFMzhcdTkxQ0ZcdTY2RkZcdTYzNjJcdTY1QjlcdTVGMEZcdTMwMDJcdTUxNzZcdTRFMkRcdTZCQ0ZcdTk4NzlcdTU3MjhcdTVGMDBcdTUzRDFcdTczQUZcdTU4ODNcdTRFMEJcdTRGMUFcdTg4QUJcdTVCOUFcdTRFNDlcdTU3MjhcdTUxNjhcdTVDNDBcdUZGMENcdTgwMENcdTU3MjhcdTY3ODRcdTVFRkFcdTY1RjZcdTg4QUJcdTk3NTlcdTYwMDFcdTY2RkZcdTYzNjJcbiAgICBkZWZpbmU6IGRlZmluZUVudihtb2RlKSxcbiAgICAvLyBjc3NcdTUyQTBcdThGN0RcdTkxNERcdTdGNkVcdTk4NzlcbiAgICBjc3M6IGNzc0NvbmZpZyxcbiAgfTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcXFxccHJveHkudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2FpLSVFNSU4QyVCQiVFNSVBRCVBNiVFNSVCRCVCMSVFNSU4MyU4RiVFOSVBMSVCOSVFNyU5QiVBRS8lRTQlQkIlQTMlRTclQTAlODEvdGVzdENvZGUvdGE0MDR1aS0xNTItY3QvZGVtby9idWlsZC12aXRlL3NyYy9wcm94eS50c1wiO2ltcG9ydCBodHRwMiBmcm9tICd2aXRlLXBsdWdpbi1odHRwMi1wcm94eSc7XG5pbXBvcnQgYmFzaWNTc2wgZnJvbSAnQHZpdGVqcy9wbHVnaW4tYmFzaWMtc3NsJztcbmltcG9ydCB7Z2V0RW52fSBmcm9tICcuL3V0aWxzJztcbmltcG9ydCB0eXBlIHtVc2VyQ29uZmlnfSBmcm9tICd2aXRlJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUHJveHkoKSB7XG4gIGNvbnN0IHByb3h5TmFtZSA9IGBeJHtnZXRFbnYoJ1ZJVEVfQkFTRV9QQVRIJyl9YDtcbiAgY29uc3QgcHJveHlSZWdleCA9IG5ldyBSZWdFeHAocHJveHlOYW1lKTtcbiAgY29uc29sZS5sb2coXCJwcm94eU5hbWU9PVwiLCBwcm94eU5hbWUpO1xuICBjb25zb2xlLmxvZyhcInByb3h5UmVnZXg9PVwiLCBwcm94eVJlZ2V4KTtcblxuXG4gIC8vIG5vaW5zcGVjdGlvbiBKU1VudXNlZEdsb2JhbFN5bWJvbHNcbiAgcmV0dXJuIHtcbiAgICAvLyBcdThGRDlcdTkxQ0NcdTkwMUFcdThGQzdcdTZCNjRwcm94eVx1NTNFRlx1NEVFNVx1OEZEQlx1ODg0Q1x1NEVFNVx1NEUwQlx1NzY4NFx1OEY2Q1x1NjM2MlxuICAgIC8vIGh0dHA6Ly9sb2NhbGhvc3Q6NTE3M1svdGE0MDQvXWluZGV4UmVzdFNlcnZpY2UvZ2V0Q3VyVXNlckFjY291bnRcbiAgICAvLyA9PiAgXHU1NzI4XHU4RjZDXHU2MzYyXHU2NUY2LFx1OTcwMFx1ODk4MVx1NUMwNlx1NTM5Rlx1NjcyQ1x1NzY4NFx1NEUwQVx1NEUwQlx1NjU4N1x1NjZGRlx1NjM2Mlx1NEUzQScnLFxuICAgIC8vIGh0dHA6Ly8xNzIuMjAuMjMuMTg6MzAwMDEvdGE0MDQvaW5kZXhSZXN0U2VydmljZS9nZXRDdXJVc2VyQWNjb3VudFxuICAgIFsnXi90YTQwNC9hcGkyLyddOiB7XG4gICAgICB0YXJnZXQ6ICdodHRwOi8vYWRtaW4uaXRzZWEuY29tLmNuOjU2ODA4L2FwaS8nLFxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgcmV3cml0ZTogKHBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhcInBhdGhfX19fXHU0RUUzXHU3NDA2YXBpMlwiLCBwYXRoKTtcbiAgICAgICAgcmV0dXJuIHBhdGgucmVwbGFjZSgvXlxcL3RhNDA0XFwvYXBpMlxcLy8sICcnKVxuICAgICAgfVxuICAgIH0sXG4gICAgWydeL3RhNDA0L2FwaS8nXToge1xuICAgICAgLy8gdGFyZ2V0OiAnaHR0cDovLzE4My4yNDcuMTY1LjI6MjQ4MC9jb25uZWN0b3IvYXBpLycsXG4gICAgICB0YXJnZXQ6ICdodHRwOi8vMTkyLjE2OC4xLjI0L2Nvbm5lY3Rvci9hcGkvJyxcbiAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgIHJld3JpdGU6IChwYXRoOiBzdHJpbmcpID0+IHBhdGgucmVwbGFjZSgvXlxcL3RhNDA0XFwvYXBpXFwvLywgJycpXG4gICAgfSxcbiAgICBbJ14vdGE0MDQvYXBpNS8nXToge1xuICAgICAgdGFyZ2V0OiAnaHR0cDovLzE5Mi4xNjguMS40OjM5NjAwLycsXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICByZXdyaXRlOiAocGF0aDogc3RyaW5nKSA9PiBwYXRoLnJlcGxhY2UoL15cXC90YTQwNFxcL2FwaTVcXC8vLCAnJylcbiAgICB9LFxuICAgIFsnXi90YTQwNC9hcGkzLyddOiB7XG4gICAgICB0YXJnZXQ6ICdodHRwczovL2RlbW8uZGVlcGluc2lnaHQuZGVlcHZlc3NlbC5uZXQvYXBpLycsXG4gICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICByZXdyaXRlOiAocGF0aDogc3RyaW5nKSA9PiBwYXRoLnJlcGxhY2UoL15cXC90YTQwNFxcL2FwaTNcXC8vLCAnJylcbiAgICB9LFxuICAgIFtwcm94eU5hbWVdOiB7XG4gICAgICB0YXJnZXQ6XG4gICAgICAgIGdldEVudignUlVOX0VOVicpID09PSAnbW9jaycgPyAnaHR0cDovL2xvY2FsaG9zdDozNjc0Mi8nIDogZ2V0RW52KCdWSVRFX0JBQ0tFTkRfUEFUSCcpLFxuICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgcmV3cml0ZTogKHBhdGg6IHN0cmluZykgPT4ge1xuICAgICAgICAvLyBpZigpe31wYXRoLmluZGV4T2YoJy9hcGknKSAhPT0gLTEgJiYgcGF0aC5pbmRleE9mKCcvYXBpMicpICE9PSAtMVxuICAgICAgICBjb25zb2xlLmxvZyhcInBhdGhfX19cdTlFRDhcdThCQTRcIiwgcGF0aCk7XG4gICAgICAgIC8vIGNvbnN0IGFwaTJSZWdleCA9IC9cXC9hcGkyLztcbiAgICAgICAgLy8gaWYgKGFwaTJSZWdleC50ZXN0KHBhdGgpKSB7XG4gICAgICAgIC8vICAgY29uc3QgbmV3cGF0aCA9IHBhdGgucmVwbGFjZSgvXlxcL3RhNDA0LywgJycpO1xuICAgICAgICAvLyAgIGNvbnNvbGUubG9nKFwibmV3cGF0aD09PVwiLCBuZXdwYXRoKTtcblxuICAgICAgICAvLyAgIHJldHVybiBuZXdwYXRoXG4gICAgICAgIC8vIH0gZWxzZSB7XG4gICAgICAgIC8vIFx1NzUzMVx1NEU4RVZJVEVfQkFDS0VORF9QQVRIXHU5MTREXHU3RjZFXHU3Njg0XHU4REVGXHU1Rjg0XHU0RTNBXHU1MzA1XHU1NDJCXHU1NDBFXHU3QUVGXHU0RTBBXHU0RTBCXHU2NTg3XHU3Njg0XHU4REVGXHU1Rjg0LFx1NjI0MFx1NEVFNVx1NkI2NFx1NTkwNFx1NUMwNlx1NTI0RFx1N0FFRlx1NzY4NEJBU0VfUEFUSFx1NzlGQlx1OTY2NFxuICAgICAgICByZXR1cm4gcGF0aC5yZXBsYWNlKHByb3h5UmVnZXgsICcnKTtcbiAgICAgICAgLy8gfTtcblxuXG4gICAgICB9LFxuICAgICAgc2VjdXJlOiBmYWxzZSxcbiAgICB9LFxuICAgIC8vIFx1NEUwQlx1OTc2Mlx1OEZEOVx1NEUyQXByb3h5XHU5MTREXHU3RjZFXHU0RTBFXHU0RTBBXHU5NzYyXHU3Njg0XHU5MTREXHU3RjZFXHU2NTQ4XHU2NzlDXHU1QjhDXHU1MTY4XHU0RTAwXHU4MUY0XG4gICAgLy8gW3Byb3h5TmFtZV06IGdldEVudignUlVOX0VOVicpID09PSAnbW9jaycgPyAnaHR0cDovL2xvY2FsaG9zdDozNjc0Mi8nIDogKGdldEVudignVklURV9CQUNLRU5EX1BBVEgnKS5yZXBsYWNlKCcvdGE0MDQvJywgJycpKSxcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkUHJldmlld1Byb3h5KCkge1xuICByZXR1cm4gYnVpbGRQcm94eSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRQcm94eUZvckhUVFAyKGNvbmZpZzogVXNlckNvbmZpZykge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcGFyYW0tcmVhc3NpZ25cbiAgZGVsZXRlIGNvbmZpZy5zZXJ2ZXIucHJveHk7XG4gIGNvbmZpZy5wbHVnaW5zLnB1c2goaHR0cDIoYnVpbGRQcm94eSgpKSk7XG4gIGNvbmZpZy5wbHVnaW5zLnB1c2goYmFzaWNTc2woKSk7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHNyY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXFxcXG9wdGltaXplRGVwcy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovYWktJUU1JThDJUJCJUU1JUFEJUE2JUU1JUJEJUIxJUU1JTgzJThGJUU5JUExJUI5JUU3JTlCJUFFLyVFNCVCQiVBMyVFNyVBMCU4MS90ZXN0Q29kZS90YTQwNHVpLTE1Mi1jdC9kZW1vL2J1aWxkLXZpdGUvc3JjL29wdGltaXplRGVwcy50c1wiO2ltcG9ydCB7IGdldEFsbFBhZ2VzIH0gZnJvbSAnLi4vbXBhL3BhZ2VzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIG9wdGltaXplRW50cmllc0Jhc2UoKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gIGNvbnN0IHBhZ2VzID0gYXdhaXQgZ2V0QWxsUGFnZXMoKTtcbiAgcmV0dXJuIE9iamVjdC52YWx1ZXMocGFnZXMpLm1hcCgoaykgPT4gKGsgYXMgc3RyaW5nKS5yZXBsYWNlKCcvJywgJycpKTtcbn1cblxuLyoqXG4gKiBcdTVDMDZcdTUzMDVcdTU0MkJub2RlX21vZHVsZXNcdTRFMEJcdTc2ODRodG1sXHU2QTIxXHU1NzU3XHU3Njg0XHU1NDBEXHU3OUYwXHU4M0I3XHU1M0Q2XHU1MjMwXHU1RTc2XHU4RkQ0XHU1NkRFXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvcHRpbWl6ZUxpYnMoKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gIHJldHVybiAoYXdhaXQgb3B0aW1pemVFbnRyaWVzQmFzZSgpKVxuICAgIC5maWx0ZXIoKGspID0+IChrIGFzIHN0cmluZykuaW5kZXhPZignbm9kZV9tb2R1bGVzJykgPj0gMClcbiAgICAubWFwKChsaWIpID0+IHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFycyxAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdW51c2VkLXZhcnNcbiAgICAgIGNvbnN0IFtfaSwgc2NvcGUsIG5hbWVdID0gbGliLnNwbGl0KCcvJyk7XG4gICAgICByZXR1cm4gYCR7c2NvcGV9LyR7bmFtZX1gO1xuICAgIH0pO1xufVxuXG4vKipcbiAqIFx1NUMwNlx1NEUwRFx1NTcyOG5vZGVfbW9kdWxlc1x1NEUwQlx1NzY4NGh0bWxcdTY1ODdcdTRFRjZcdTUyQTBcdTUxNjVcdTUyMzBlbnRyaWVzXHU0RTJEXG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBvcHRpbWl6ZUVudHJpZXMoKTogUHJvbWlzZTxBcnJheTxzdHJpbmc+PiB7XG4gIHJldHVybiAoYXdhaXQgb3B0aW1pemVFbnRyaWVzQmFzZSgpKS5maWx0ZXIoKGspID0+IChrIGFzIHN0cmluZykuaW5kZXhPZignbm9kZV9tb2R1bGVzJykgPCAwKTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHZpdGUub3B0aW1pemUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L2FpLSVFNSU4QyVCQiVFNSVBRCVBNiVFNSVCRCVCMSVFNSU4MyU4RiVFOSVBMSVCOSVFNyU5QiVBRS8lRTQlQkIlQTMlRTclQTAlODEvdGVzdENvZGUvdGE0MDR1aS0xNTItY3QvZGVtby9idWlsZC12aXRlL3ZpdGUub3B0aW1pemUudHNcIjtpbXBvcnQgZnNwIGZyb20gJ2ZzL3Byb21pc2VzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IHR5cGUgeyBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBpc0VudlRydWUgfSBmcm9tICcuL3NyYy91dGlscyc7XG5pbXBvcnQgeyBvcHRpbWl6ZUVudHJpZXMsIG9wdGltaXplTGlicyB9IGZyb20gJy4vc3JjL29wdGltaXplRGVwcyc7XG5cbmltcG9ydCBWaXRlQ29tbW9uQ29uZmlnIGZyb20gJy4uL3ZpdGVDb21tb25Db25maWcnO1xuXG4vKipcbiAqIFx1ODNCN1x1NTNENlx1NTcyOEB5aC9jbGktaW50ZXJuYWwtbG9jYWxlc1x1NEUyRFx1NUMwMVx1ODhDNVx1NzY4NFx1OEJFRFx1OEEwMFx1NjU4N1x1NEVGNlxuICogQHJldHVybnMgXHU4QkVEXHU4QTAwXHU2NTg3XHU0RUY2XG4gKi9cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRMb2NhbGVzKCkge1xuICBjb25zdCBkID0gYXdhaXQgZnNwLnJlYWRkaXIocGF0aC5yZXNvbHZlKCcuL2ludGVybmFsL2xvY2FsZXMvZGlzdCcpKTtcbiAgcmV0dXJuIGRcbiAgICAuZmlsdGVyKChzKSA9PiB7XG4gICAgICByZXR1cm4gcy5lbmRzV2l0aCgnLm1qcycpO1xuICAgIH0pXG4gICAgLm1hcCgoc18xKSA9PiB7XG4gICAgICByZXR1cm4gYEB5aC9jbGktaW50ZXJuYWwtcHJlY29tcGlsZWQtbG9jYWxlcy9kaXN0LyR7c18xfWA7XG4gICAgfSk7XG59XG5cbmRlY2xhcmUgdHlwZSBWaXRlT3B0aW1pemVEZXBzID0gVXNlckNvbmZpZ1snb3B0aW1pemVEZXBzJ107XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRPcHRpbWl6ZUNvbmZpZyhfbW9kZTogc3RyaW5nKTogUHJvbWlzZTxWaXRlT3B0aW1pemVEZXBzPiB7XG4gIGNvbnN0IG9wdGltaXplRGVwczogVml0ZU9wdGltaXplRGVwcyA9IHtcbiAgICAvLyBcdTRFM0JcdTg5ODFcdTc1MjhcdTRFOEVcdTU3Mjggdml0ZSBcdThGREJcdTg4NENcdTRGOURcdThENTZcdTYwMjdcdTVCRkNcdTUxNjVcdTUyMDZcdTY3OTBcdUZGMENcdTVCODNcdTRGMUFcdTkxQ0RcdTUxOTlcdTk3MDBcdTg5ODFcdTk4ODRcdTdGMTZcdThCRDFcdTRFMTRcdTRFM0EgY29tbW9uSlMgXHU3Njg0XHU0RjlEXHU4RDU2XG4gICAgbmVlZHNJbnRlcm9wOiBWaXRlQ29tbW9uQ29uZmlnLm9wdGltaXplRGVwcy5uZWVkc0ludGVyb3AsXG4gIH07XG4gIGNvbnN0IGVudHJpZXM6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgaWYgKCFpc0VudlRydWUoJ1VTRV9PTERfTU9EVUxFU19TVVBQT1JUJykpIHtcbiAgICBlbnRyaWVzLnB1c2goJ2J1aWxkLXZpdGUvb3B0aW1pemUvb3B0aW1pemUudHMnKTtcbiAgfVxuICBlbnRyaWVzLnB1c2goJ2J1aWxkLXZpdGUvb3B0aW1pemUvb3B0aW1pemUtbW9kdWxlcy50cycpO1xuICBpZiAoIWlzRW52VHJ1ZSgnVklURV9PTkxJTkVfVEhFTUVfRU5BQkxFRCcpKSB7XG4gICAgZW50cmllcy5wdXNoKCdidWlsZC12aXRlL29wdGltaXplL29wdGltaXplLWNzcy50cycpO1xuICB9IGVsc2Uge1xuICAgIGVudHJpZXMucHVzaCgnYnVpbGQtdml0ZS9vcHRpbWl6ZS9vcHRpbWl6ZS1sZXNzLnRzJyk7XG4gIH1cblxuICAvLyBcdTk3MDBcdTg5ODFpbmNsdWRlXHU3Njg0XHU5ODg0XHU2Nzg0XHU1RUZBXHU0RjlEXHU4RDU2XG4gIG9wdGltaXplRGVwcy5pbmNsdWRlID0gW1xuICAgIC4uLihhd2FpdCBnZXRMb2NhbGVzKCkpLFxuICAgIC4uLlZpdGVDb21tb25Db25maWcub3B0aW1pemVEZXBzLmluY2x1ZGUsXG4gICAgLi4uKGF3YWl0IG9wdGltaXplTGlicygpKSxcbiAgXTtcbiAgLy8gXHU2MjQwXHU2NzA5XHU1MTY1XHU1M0UzXHU5MEZEXHU4OEFCXHU1MkEwXHU1MTY1XHU5ODg0XHU3RjE2XHU4QkQxXHU0RTJEXG4gIG9wdGltaXplRGVwcy5lbnRyaWVzID0gW1xuICAgIC4uLihhd2FpdCBvcHRpbWl6ZUVudHJpZXMoKSksXG4gICAgLi4uZW50cmllcyxcbiAgICAuLi5WaXRlQ29tbW9uQ29uZmlnLm9wdGltaXplRGVwcy5lbnRyaWVzLFxuICBdO1xuICBvcHRpbWl6ZURlcHMuZXhjbHVkZSA9IFsuLi5WaXRlQ29tbW9uQ29uZmlnLm9wdGltaXplRGVwcy5leGNsdWRlLCAnc3cuanMnXTtcbiAgb3B0aW1pemVEZXBzLmVzYnVpbGRPcHRpb25zID0ge1xuICAgIHNvdXJjZW1hcDogdHJ1ZSwgLy8gJ2lubGluZSdcbiAgfTtcbiAgb3B0aW1pemVEZXBzLmhvbGRVbnRpbENyYXdsRW5kID0gdHJ1ZTtcbiAgcmV0dXJuIG9wdGltaXplRGVwcztcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHZpdGUuZGV2LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9haS0lRTUlOEMlQkIlRTUlQUQlQTYlRTUlQkQlQjElRTUlODMlOEYlRTklQTElQjklRTclOUIlQUUvJUU0JUJCJUEzJUU3JUEwJTgxL3Rlc3RDb2RlL3RhNDA0dWktMTUyLWN0L2RlbW8vYnVpbGQtdml0ZS92aXRlLmRldi50c1wiO2ltcG9ydCB0eXBlIHsgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgYnVpbGRCYXNlQ29uZmlnIH0gZnJvbSAnLi92aXRlLmJhc2UnO1xuaW1wb3J0IHsgYnVpbGRQcm94eSwgYnVpbGRQcm94eUZvckhUVFAyIH0gZnJvbSAnLi9zcmMvcHJveHknO1xuaW1wb3J0IHsgZXJyb3IsIGdldE9wZW4sIGlzRW52VHJ1ZSwgd2FybiB9IGZyb20gJy4vc3JjL3V0aWxzJztcbmltcG9ydCB7IGdldE9wdGltaXplQ29uZmlnIH0gZnJvbSAnLi92aXRlLm9wdGltaXplJztcbmltcG9ydCB7IGdldEFsbFBhZ2VzIH0gZnJvbSAnLi9tcGEvcGFnZXMnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVpbGREZXZDb25maWcobW9kZTogc3RyaW5nKTogUHJvbWlzZTxVc2VyQ29uZmlnPiB7XG4gIGNvbnN0IGNvbmZpZzogVXNlckNvbmZpZyA9IGF3YWl0IGJ1aWxkQmFzZUNvbmZpZyhtb2RlKTtcblxuICBjb25maWcuc2VydmVyID0ge1xuICAgIC8vIFx1NjMwN1x1NUI5QVx1NjcwRFx1NTJBMVx1NTY2OFx1NUU5NFx1OEJFNVx1NzZEMVx1NTQyQ1x1NTRFQVx1NEUyQSBJUCBcdTU3MzBcdTU3NDBcdTMwMDIgXHU1OTgyXHU2NzlDXHU1QzA2XHU2QjY0XHU4QkJFXHU3RjZFXHU0RTNBIDAuMC4wLjAgXHU1QzA2XHU3NkQxXHU1NDJDXHU2MjQwXHU2NzA5XHU1NzMwXHU1NzQwXHVGRjBDXHU1MzA1XHU2MkVDXHU1QzQwXHU1N0RGXHU3RjUxXHU1NDhDXHU1MTZDXHU3RjUxXHU1NzMwXHU1NzQwXHUzMDAyXG4gICAgLy8gdHJ1ZVx1NUMzMVx1NjYyRmxvY2FsaG9zdCtcdTRGNjBcdTY3MkNcdTU3MzBcdTYyNDBcdTY3MDlcdTdGNTFcdTUzNjFcdTc2ODRpcFxuICAgIGhvc3Q6IGZhbHNlLFxuICAgIC8vIFx1NEUzQVx1NUYwMFx1NTNEMVx1NjcwRFx1NTJBMVx1NTY2OFx1OTE0RFx1N0Y2RVx1ODFFQVx1NUI5QVx1NEU0OVx1NEVFM1x1NzQwNlx1ODlDNFx1NTIxOVx1MzAwMlxuICAgIHByb3h5OiBidWlsZFByb3h5KCksXG4gICAgLy8gXHU1RjAwXHU1M0QxXHU2NUY2XHU2RDRGXHU4OUM4XHU1NjY4XHU5RUQ4XHU4QkE0XHU2MjUzXHU1RjAwXHU3Njg0XHU4REVGXHU1Rjg0XG4gICAgb3BlbjogZ2V0T3BlbigpLFxuICAgIC8vIFx1NEYyMFx1OTAxMlx1N0VEOSBjaG9raWRhciBcdTc2ODRcdTY1ODdcdTRFRjZcdTdDRkJcdTdFREZcdTc2RDFcdTU0MkNcdTU2NjhcdTkwMDlcdTk4NzlcdTMwMDJcbiAgICB3YXRjaDoge1xuICAgICAgdXNlRnNFdmVudHM6IGZhbHNlLFxuICAgICAgLy8gXHU1OTgyXHU2NzlDXHU1NzI4XHU1NDJGXHU1MkE4XHU2NUY2XHU5MDQ3XHU1MjMwXHU1M0NEXHU1OTBEXHU5MUNEXHU1NDJGZGV2LXNlcnZlclx1NzY4NFx1OTVFRVx1OTg5OCxcdTUyMTlcdTY1M0VcdTVGMDBcdTRFMEJcdTk3NjJcdTc2ODRcdTZDRThcdTkxQ0FcbiAgICAgIC8vIGlnbm9yZWQ6IFtcbiAgICAgIC8vICAgJyoqL3ZpdGVDb21tb25Db25maWcudHMnLFxuICAgICAgLy8gICAnKiovbXVsdGlwbGVTZXJ2aWNlLmNvbmZpZy50cycsXG4gICAgICAvLyAgICcqKi92aXRlLmNvbmZpZy50cycsXG4gICAgICAvLyAgICcqKi8uZW52LionLFxuICAgICAgLy8gICAnKiovYnVpbGQtdml0ZS8qKi8qLnRzJyxcbiAgICAgIC8vICAgJyoqLy5pZGVhLyoqJyxcbiAgICAgIC8vICAgJyoqLy52c2NvZGUvKionXG4gICAgICAvLyBdLFxuICAgIH0sXG4gIH07XG4gIC8vIFx1OTE0RFx1N0Y2RVx1OTg4NFx1N0YxNlx1OEJEMVx1NTE4NVx1NUJCOVxuICBjb25maWcub3B0aW1pemVEZXBzID0gYXdhaXQgZ2V0T3B0aW1pemVDb25maWcobW9kZSk7XG4gIGlmIChpc0VudlRydWUoJ1VTRV9IVFRQMicpKSB7XG4gICAgYnVpbGRQcm94eUZvckhUVFAyKGNvbmZpZyk7XG4gIH1cbiAgLy8gXHU3NTFGXHU2MjEwXHU5NzAwXHU4OTgxd2FybXVwXHU3Njg0XHU5ODc1XHU5NzYyXG4gIGNvbnN0IGh0bWxFbnRyeSA9IGF3YWl0IGdldEFsbFBhZ2VzKCk7XG4gIGNvbnN0IHdhcm11cEh0bWw6IHN0cmluZ1tdID0gT2JqZWN0LmtleXMoaHRtbEVudHJ5KVxuICAgIC5tYXAoKGspID0+IHtcbiAgICAgIGNvbnN0IHYgPSBodG1sRW50cnlba107XG4gICAgICBpZiAodi5jb25zdHJ1Y3RvciAhPT0gU3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgICAgLy8gXHU4REVGXHU1Rjg0XHU1RkM1XHU5ODdCXHU0RUU1Llx1NUYwMFx1NTkzNFxuICAgICAgcmV0dXJuIGAuJHt2IGFzIHN0cmluZ31gO1xuICAgIH0pXG4gICAgLmZpbHRlcigodikgPT4gdiAhPT0gbnVsbCk7XG4gIGNvbmZpZy5zZXJ2ZXIud2FybXVwID0ge1xuICAgIGNsaWVudEZpbGVzOiBbLi4ud2FybXVwSHRtbF0sXG4gIH07XG4gIC8vIGNvbmZpZy5vcHRpbWl6ZURlcHMuaG9sZFVudGlsQ3Jhd2xFbmQgPSB0cnVlO1xuICByZXR1cm4gY29uZmlnO1xufVxuXG4vLyBcdTU0MkZcdTUyQThcdTRFRUFcdTVGMEZcbmV4cG9ydCBmdW5jdGlvbiBpbml0KCkge1xuICBlcnJvcihcbiAgICBbXG4gICAgICAnODg4ODg4ICBkYiAgICAgICAgICBkUDg4ICAgZFBZYiAgICAgZFA4OCcsXG4gICAgICAnICA4OCAgIGRQWWIgICAgICAgIGRQIDg4ICBkUCAgIFliICBkUCA4OCcsXG4gICAgICAnICA4OCAgZFBfX1liICAgICAgZDg4ODg4OCBZYiAgIGRQIGQ4ODg4ODgnLFxuICAgICAgJyAgODggZFAgICAgWWIgICAgICAgICA4OCAgIFlib2RQICAgICAgODgnLFxuICAgIF0uam9pbignXFxuJyksXG4gICk7XG4gIHdhcm4oXG4gICAgW1xuICAgICAgJycsXG4gICAgICAnICAgICAgICAgICAgICAgICAgIF9vb09vb18nLFxuICAgICAgJyAgICAgICAgICAgICAgICAgIG84ODg4ODg4bycsXG4gICAgICAnICAgICAgICAgICAgICAgICAgODhcIiAuIFwiODgnLFxuICAgICAgJyAgICAgICAgICAgICAgICAgICh8IC1fLSB8KScsXG4gICAgICAnICAgICAgICAgICAgICAgICAgT1xcXFwgID0gIC9PJyxcbiAgICAgIFwiICAgICAgICAgICAgICAgX19fXy9gLS0tJ1xcXFxfX19fXCIsXG4gICAgICBcIiAgICAgICAgICAgICAuJyAgXFxcXFxcXFx8ICAgICB8Ly8gIGAuXCIsXG4gICAgICAnICAgICAgICAgICAgLyAgXFxcXFxcXFx8fHwgIDogIHx8fC8vICBcXFxcJyxcbiAgICAgICcgICAgICAgICAgIC8gIF98fHx8fCBcdTUzNEQgfHx8fHwtICBcXFxcJyxcbiAgICAgICcgICAgICAgICAgIHwgICB8IFxcXFxcXFxcXFxcXCAgLSAgLy8vIHwgICB8JyxcbiAgICAgIFwiICAgICAgICAgICB8IFxcXFxffCAgJydcXFxcLS0tLycnICB8ICAgfFwiLFxuICAgICAgJyAgICAgICAgICAgXFxcXCAgLi1cXFxcX18gIGAtYCAgX19fLy0uIC8nLFxuICAgICAgXCIgICAgICAgICBfX19gLiAuJyAgLy0tLi0tXFxcXCAgYC4gLiBfX1wiLFxuICAgICAgJyAgICAgIC5cIlwiIFxcJzwgIGAuX19fXFxcXF88fD5fL19fXy5cXCcgID5cXCdcIlwiLicsXG4gICAgICAnICAgICB8IHwgOiAgYC0gXFxcXGAuO2BcXFxcIF8gL2A7LmAvIC0gYCA6IHwgfCcsXG4gICAgICAnICAgICBcXFxcICBcXFxcIGAtLiAgIFxcXFxfIF9fXFxcXCAvX18gXy8gICAuLWAgLyAgLycsXG4gICAgICBcIj09PT09PWAtLl9fX19gLS5fX19cXFxcX19fX18vX19fLi1gX19fXy4tJz09PT09PVwiLFxuICAgICAgXCIgICAgICAgICAgICAgICAgICAgYD0tLS09J1wiLFxuICAgICAgJ15eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXl5eXicsXG4gICAgICAnICAgICAgICAgXHU0RjVCXHU3OTU2XHU0RkREXHU0RjUxICAgICAgIFx1NkMzOFx1NjVFMEJVRycsXG4gICAgXS5qb2luKCdcXG4nKSxcbiAgKTtcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcc3JjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVxcXFxzcmNcXFxcY2h1bmtzLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9haS0lRTUlOEMlQkIlRTUlQUQlQTYlRTUlQkQlQjElRTUlODMlOEYlRTklQTElQjklRTclOUIlQUUvJUU0JUJCJUEzJUU3JUEwJTgxL3Rlc3RDb2RlL3RhNDA0dWktMTUyLWN0L2RlbW8vYnVpbGQtdml0ZS9zcmMvY2h1bmtzLnRzXCI7aW1wb3J0IHsgaXNFbnZUcnVlIH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IHVzZURlbWFuZEltcG9ydCA9IGlzRW52VHJ1ZSgnQlVJTERfREVNQU5EX1VJX0lNUE9SVCcpO1xuZXhwb3J0IGZ1bmN0aW9uIG1hbnVhbENodW5rcyhpZDogc3RyaW5nKSB7XG4gIGlmIChpZC5pbmNsdWRlcygnZmFjZUNvbmZpZycpKSB7XG4gICAgcmV0dXJuICcxLmNodW5rLWZhY2VDb25maWcnO1xuICB9XG4gIGlmIChpZC5pbmNsdWRlcygnc3R5bGVDb3Zlci5sZXNzJykpIHtcbiAgICByZXR1cm4gJzJfY2h1bmstc3R5bGVDb3Zlcic7XG4gIH1cbiAgaWYgKHVzZURlbWFuZEltcG9ydCkge1xuICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3Z1ZScpKSB7XG4gICAgICByZXR1cm4gJ2NodW5rLXZ1ZWpzJztcbiAgICB9XG4gICAgaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvQHloL3RhLXV0aWxzJykpIHtcbiAgICAgIHJldHVybiAnY2h1bmstdGEtdXRpbHMnO1xuICAgIH1cbiAgICBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9AeWgvdGE0MDQtdWknKSkge1xuICAgICAgcmV0dXJuICdjaHVuay10YTQwNC11aSc7XG4gICAgfVxuICB9XG4gIC8vIGlmIChpZC5pbmNsdWRlcygnQHloL3RhLXV0aWxzJykpIHtcbiAgLy8gICByZXR1cm4gJ2NodW5rLXV0aWxzJ1xuICAvLyB9XG4gIC8vIGlmIChpZC5pbmNsdWRlcygnQHloL3RhNDA0LXVpJykpIHtcbiAgLy8gICByZXR1cm4gJ2NodW5rLXVpJ1xuICAvLyB9XG4gIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL21vbWVudCcpKSB7XG4gIC8vICAgcmV0dXJuICd2ZW5kb3ItbW9tZW50J1xuICAvLyB9XG5cbiAgLy8gaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvQHloL3RhLXV0aWxzJykpIHtcbiAgLy8gICByZXR1cm4gJ3loLXV0aWxzLW1vZHVsZXMnXG4gIC8vIH1cblxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy92dWV4JykpIHtcbiAgLy8gICByZXR1cm4gJ3ZlbmRvci12dWV4J1xuICAvLyB9XG5cbiAgLy8gaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvdnVlLXJvdXRlcicpKSB7XG4gIC8vICAgcmV0dXJuICd2ZW5kb3ItdnVlLXJvdXRlcidcbiAgLy8gfVxuXG4gIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3Z1ZS8nKSkge1xuICAvLyAgIHJldHVybiAndmVuZG9yLXZ1ZSdcbiAgLy8gfVxuXG4gIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL0B5aC9pY29ucy1zdmcnKSkge1xuICAvLyAgIHJldHVybiAneWgtb3RoZXItbW9kdWxlcydcbiAgLy8gfVxuXG4gIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL0B5aC90YTQwNC11aS9lcy9iaWctdGFibGUnKSkge1xuICAvLyAgIHJldHVybiAneWgtNDA0LXVpLWJpZy10YWJsZS1tb2R1bGVzJ1xuICAvLyB9XG5cbiAgLy8gaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvQHloL3RhNDA0LXVpJykpIHtcbiAgLy8gICByZXR1cm4gJ3loLTQwNC11aS1tb2R1bGVzJ1xuICAvLyB9XG5cbiAgLy8gaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvbGVzcycpKSB7XG4gIC8vICAgcmV0dXJuICd2ZW5kb3ItbGVzcydcbiAgLy8gfVxuXG4gIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL2NyeXB0by1qcycpKSB7XG4gIC8vICAgcmV0dXJuICd2ZW5kb3ItY3J5cHRvLWpzJ1xuICAvLyB9XG5cbiAgLy8gaWYgKGlkLmluY2x1ZGVzKCdub2RlX21vZHVsZXMvd2FuZ2VkaXRvcicpKSB7XG4gIC8vICAgcmV0dXJuICd2ZW5kb3Itd2FuZy1lZGl0b3InXG4gIC8vIH1cblxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9qcXVlcnknKSkge1xuICAvLyAgIHJldHVybiAndmVuZG9yLWpxdWVyeSdcbiAgLy8gfVxuXG4gIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL2ludGVyYWN0anMnKSkge1xuICAvLyAgIHJldHVybiAndmVuZG9yLWludGVyYWN0anMnXG4gIC8vIH1cblxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ25vZGVfbW9kdWxlcy9qc3JzYXNpZ24nKSkge1xuICAvLyAgIHJldHVybiAndmVuZG9yLWpzcnNhc2lnbidcbiAgLy8gfVxuXG4gIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzL3BseXInKSkge1xuICAvLyAgIHJldHVybiAndmVuZG9yLXBseXInXG4gIC8vIH1cblxuICAvLyBpZiAoaWQuaW5jbHVkZXMoJ2NvbXBvbmVudHMvNDA0LXVpJykpIHtcbiAgLy8gICByZXR1cm4gJ3ZlbmRvci10YTQwNC11aSdcbiAgLy8gfVxuXG4gIC8vIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcbiAgLy8gICByZXR1cm4gJ3ZlbmRvcidcbiAgLy8gfVxufVxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcdml0ZS5wcm9kLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9haS0lRTUlOEMlQkIlRTUlQUQlQTYlRTUlQkQlQjElRTUlODMlOEYlRTklQTElQjklRTclOUIlQUUvJUU0JUJCJUEzJUU3JUEwJTgxL3Rlc3RDb2RlL3RhNDA0dWktMTUyLWN0L2RlbW8vYnVpbGQtdml0ZS92aXRlLnByb2QudHNcIjtpbXBvcnQgdHlwZSB7IFVzZXJDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB7IGJ1aWxkQmFzZUNvbmZpZyB9IGZyb20gJy4vdml0ZS5iYXNlJztcbmltcG9ydCB7IGdldEVudiwgaXNFbnZUcnVlIH0gZnJvbSAnLi9zcmMvdXRpbHMnO1xuaW1wb3J0IHsgbWFudWFsQ2h1bmtzIH0gZnJvbSAnLi9zcmMvY2h1bmtzJztcbmltcG9ydCB2aXRlQ29tbW9uQ29uZmlnIGZyb20gJy4uL3ZpdGVDb21tb25Db25maWcnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVpbGRQcm9kQ29uZmlnKFxuICBtb2RlOiBzdHJpbmcsXG4gIGlnbm9yZUh0bWxQbHVnaW46IGJvb2xlYW4gPSBmYWxzZSxcbik6IFByb21pc2U8VXNlckNvbmZpZz4ge1xuICBjb25zdCBjb25maWc6IFVzZXJDb25maWcgPSBhd2FpdCBidWlsZEJhc2VDb25maWcobW9kZSwgaWdub3JlSHRtbFBsdWdpbik7XG4gIGNvbmZpZy5idWlsZCA9IHtcbiAgICAvLyBzb3VyY2VtYXBcdTlFRDhcdThCQTRcdThCQkVcdTdGNkVcdTRFM0FmYWxzZVxuICAgIHNvdXJjZW1hcDogZmFsc2UsXG4gICAgb3V0RGlyOiBgJHtnZXRFbnYoJ09VVFBVVF9ESVInKX0ke2dldEVudignVklURV9QVUJMSUNfUEFUSCcpfWAsXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXG4gICAgLy8gXHU2NjJGXHU1NDI2XHU1MzhCXHU3RjI5XHU3NTFGXHU2MjEwXHU3Njg0XHU0RUUzXHU3ODAxXG4gICAgbWluaWZ5OiB2aXRlQ29tbW9uQ29uZmlnLmJ1aWxkLm1pbmlmeSxcbiAgICBjc3NNaW5pZnk6IHZpdGVDb21tb25Db25maWcuYnVpbGQuY3NzTWluaWZ5LFxuICB9O1xuICBpZiAodml0ZUNvbW1vbkNvbmZpZy5idWlsZC5taW5pZnkgPT09ICd0ZXJzZXInKSB7XG4gICAgY29uZmlnLmJ1aWxkLnRlcnNlck9wdGlvbnMgPSB2aXRlQ29tbW9uQ29uZmlnLmJ1aWxkLnRlcnNlck9wdGlvbnM7XG4gIH1cbiAgY29uZmlnLmJ1aWxkLmNvbW1vbmpzT3B0aW9ucyA9IHtcbiAgICB0cmFuc2Zvcm1NaXhlZEVzTW9kdWxlczogdHJ1ZSxcbiAgICAvLyBpZ25vcmVEeW5hbWljUmVxdWlyZXM6IHRydWUsXG4gICAgLy8gZHluYW1pY1JlcXVpcmVUYXJnZXRzOiBbJ2ltYWdlLXNpemUnXSxcbiAgICBleGNsdWRlOiBbJ25vZGVfbW9kdWxlcy9tb21lbnQvKionXSxcbiAgICBlc21FeHRlcm5hbHM6IHRydWUsXG4gICAgLy8gXHU0RkVFXHU2NTM5XHU5NzAwXHU4OTgxY29tbW9uanNcdTYzRDJcdTRFRjZcdTU5MDRcdTc0MDZcdTc2ODRcdTY1ODdcdTRFRjZcbiAgICBpbmNsdWRlOiB2aXRlQ29tbW9uQ29uZmlnLmNvbW1vbmpzLmluY2x1ZGUsXG4gICAgZXh0ZW5zaW9uczogdml0ZUNvbW1vbkNvbmZpZy5jb21tb25qcy5leHRlbnNpb25zLFxuICAgIHJlcXVpcmVSZXR1cm5zRGVmYXVsdDogJ2F1dG8nLFxuICB9O1xuICBjb25maWcuYnVpbGQucm9sbHVwT3B0aW9ucyA9IHtcbiAgICBvdXRwdXQ6IHtcbiAgICAgIG1hbnVhbENodW5rcyhpZCkge1xuICAgICAgICByZXR1cm4gbWFudWFsQ2h1bmtzKGlkKTtcbiAgICAgIH0sXG4gICAgfSxcbiAgICB0cmVlc2hha2U6IHZpdGVDb21tb25Db25maWcuYnVpbGQudHJlZXNoYWtlLFxuICB9O1xuICBjb25zdCB1c2VEZW1hbmRJbXBvcnQgPSBpc0VudlRydWUoJ0JVSUxEX0RFTUFORF9VSV9JTVBPUlQnKTtcbiAgaWYgKHVzZURlbWFuZEltcG9ydCkge1xuICAgIGNvbmZpZy5idWlsZC50YXJnZXQgPSBbJ2Nocm9tZTk5J107XG4gIH1cbiAgLy8gY29uZmlnLmNzcy5wcmVwcm9jZXNzb3JNYXhXb3JrZXJzID0gdHJ1ZTtcbiAgcmV0dXJuIGNvbmZpZztcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHZpdGUucHJldmlldy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovYWktJUU1JThDJUJCJUU1JUFEJUE2JUU1JUJEJUIxJUU1JTgzJThGJUU5JUExJUI5JUU3JTlCJUFFLyVFNCVCQiVBMyVFNyVBMCU4MS90ZXN0Q29kZS90YTQwNHVpLTE1Mi1jdC9kZW1vL2J1aWxkLXZpdGUvdml0ZS5wcmV2aWV3LnRzXCI7aW1wb3J0IHR5cGUgeyBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBidWlsZFByb2RDb25maWcgfSBmcm9tICcuL3ZpdGUucHJvZCc7XG5pbXBvcnQgeyBidWlsZFByZXZpZXdQcm94eSB9IGZyb20gJy4vc3JjL3Byb3h5Jztcbi8vIGltcG9ydCB7IGdldE9wZW4sIH0gZnJvbSAnLi9zcmMvdXRpbHMnXG4vLyBpbXBvcnQgeyBnZXRFbnYsIH0gZnJvbSAnLi9zcmMvdXRpbHMnXG4vLyBpbXBvcnQgeyBoaXN0b3J5QXBpRmFsbGJhY2tQbHVnaW4sIH0gZnJvbSAndml0ZS1wbHVnaW4tdmlydHVhbC1odG1sJ1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gYnVpbGRQcmV2aWV3Q29uZmlnKG1vZGU6IHN0cmluZywgY29tbWFuZDogc3RyaW5nKTogUHJvbWlzZTxVc2VyQ29uZmlnPiB7XG4gIGxldCBjb25maWc6IFVzZXJDb25maWcgPSB7fTtcbiAgaWYgKGNvbW1hbmQgPT09ICdidWlsZCcpIHtcbiAgICBjb25maWcgPSBhd2FpdCBidWlsZFByb2RDb25maWcobW9kZSk7XG4gIH1cbiAgaWYgKGNvbW1hbmQgPT09ICdzZXJ2ZScpIHtcbiAgICBjb25maWcucGx1Z2lucyA9IFtcbiAgICAgIC8vIFx1OEZEOVx1NEUyQVx1NkNFOFx1OTFDQVx1NzY4NFx1NjYyRlx1NzUyOFx1NEU4RVx1OERFRlx1NzUzMVx1NzY4NGhpc3RvcnlBUElcdTU2REVcdTkwMDBcdTRFRTNcdTc4MDFcbiAgICAgIC8vIFx1NEY4Qlx1NTk4MjogXHU2N0QwXHU0RTlCXHU4REVGXHU3NTMxXHU1NzI4NDA0XHU3Njg0XHU2NUY2XHU1MDE5XHU1NkRFXHU5MDAwXHU1MjMwaW5kZXguaHRtbFxuICAgICAgLy8gaGlzdG9yeUFwaUZhbGxiYWNrUGx1Z2luKHtcbiAgICAgIC8vICAgcmV3cml0ZXM6IFtcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBmcm9tOiAvbG9naW4uaHRtbC8sXG4gICAgICAvLyAgICAgICB0bzogZ2V0RW52KCdWSVRFX1BVQkxJQ19QQVRIJykgKyAnbG9naW4uaHRtbCcsXG4gICAgICAvLyAgICAgfSxcbiAgICAgIC8vICAgICB7XG4gICAgICAvLyAgICAgICBmcm9tOiAvLiovLFxuICAgICAgLy8gICAgICAgdG86IGdldEVudignVklURV9QVUJMSUNfUEFUSCcpICsgJ2luZGV4Lmh0bWwnLFxuICAgICAgLy8gICAgIH1cbiAgICAgIC8vICAgXSxcbiAgICAgIC8vICAgdXNlUHJldmlldzogdHJ1ZSxcbiAgICAgIC8vIH0pXG4gICAgXTtcbiAgICBjb25maWcucHJldmlldyA9IHtcbiAgICAgIHByb3h5OiBidWlsZFByZXZpZXdQcm94eSgpLFxuICAgICAgb3BlbjogZmFsc2UsXG4gICAgICAvLyBcdTk4ODRcdTg5QzhcdTZBMjFcdTVGMEZcdTRFMEJcdTc2ODRcdTdBRUZcdTUzRTNcbiAgICAgIHBvcnQ6IDUxNzQsXG4gICAgfTtcbiAgICBjb25maWcuc2VydmVyID0ge1xuICAgICAgaG9zdDogdHJ1ZSxcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGNvbmZpZztcbn1cbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1xcXFxidWlsZC12aXRlXFxcXHZpdGUubW9jay50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovYWktJUU1JThDJUJCJUU1JUFEJUE2JUU1JUJEJUIxJUU1JTgzJThGJUU5JUExJUI5JUU3JTlCJUFFLyVFNCVCQiVBMyVFNyVBMCU4MS90ZXN0Q29kZS90YTQwNHVpLTE1Mi1jdC9kZW1vL2J1aWxkLXZpdGUvdml0ZS5tb2NrLnRzXCI7aW1wb3J0IHR5cGUgeyBVc2VyQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBidWlsZEJhc2VDb25maWcgfSBmcm9tICcuL3ZpdGUuYmFzZSc7XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBidWlsZE1vY2tDb25maWcobW9kZTogc3RyaW5nKTogUHJvbWlzZTxVc2VyQ29uZmlnPiB7XG4gIHJldHVybiBhd2FpdCBidWlsZEJhc2VDb25maWcobW9kZSk7XG59XG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXGFpLVx1NTMzQlx1NUI2Nlx1NUY3MVx1NTBDRlx1OTg3OVx1NzZFRVxcXFxcdTRFRTNcdTc4MDFcXFxcdGVzdENvZGVcXFxcdGE0MDR1aS0xNTItY3RcXFxcZGVtb1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9haS0lRTUlOEMlQkIlRTUlQUQlQTYlRTUlQkQlQjElRTUlODMlOEYlRTklQTElQjklRTclOUIlQUUvJUU0JUJCJUEzJUU3JUEwJTgxL3Rlc3RDb2RlL3RhNDA0dWktMTUyLWN0L2RlbW8vdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyB0eXBlIENvbmZpZ0VudiwgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XG5pbXBvcnQgeyBidWlsZFZpdGVDb25maWcgfSBmcm9tICcuL2J1aWxkLXZpdGUvYnVpbGRWaXRlJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKGFzeW5jIChlbnY6IENvbmZpZ0VudiAmIHsgaWdub3JlSHRtbFBsdWdpbjogYm9vbGVhbiB9KSA9PiB7XG4gIHJldHVybiBidWlsZFZpdGVDb25maWcoZW52KTtcbn0pO1xuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxhaS1cdTUzM0JcdTVCNjZcdTVGNzFcdTUwQ0ZcdTk4NzlcdTc2RUVcXFxcXHU0RUUzXHU3ODAxXFxcXHRlc3RDb2RlXFxcXHRhNDA0dWktMTUyLWN0XFxcXGRlbW9cXFxcYnVpbGQtdml0ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcYWktXHU1MzNCXHU1QjY2XHU1RjcxXHU1MENGXHU5ODc5XHU3NkVFXFxcXFx1NEVFM1x1NzgwMVxcXFx0ZXN0Q29kZVxcXFx0YTQwNHVpLTE1Mi1jdFxcXFxkZW1vXFxcXGJ1aWxkLXZpdGVcXFxcYnVpbGRWaXRlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9haS0lRTUlOEMlQkIlRTUlQUQlQTYlRTUlQkQlQjElRTUlODMlOEYlRTklQTElQjklRTclOUIlQUUvJUU0JUJCJUEzJUU3JUEwJTgxL3Rlc3RDb2RlL3RhNDA0dWktMTUyLWN0L2RlbW8vYnVpbGQtdml0ZS9idWlsZFZpdGUudHNcIjtpbXBvcnQgdHlwZSB7IENvbmZpZ0VudiwgVXNlckNvbmZpZyB9IGZyb20gJ3ZpdGUnO1xuaW1wb3J0IHsgaW5pdEVudiB9IGZyb20gJy4vc3JjL3V0aWxzJztcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGJ1aWxkVml0ZUNvbmZpZyh7XG4gIG1vZGUsXG4gIGNvbW1hbmQsXG4gIGlnbm9yZUh0bWxQbHVnaW4sXG59OiBDb25maWdFbnYgJiB7IGlnbm9yZUh0bWxQbHVnaW46IGJvb2xlYW4gfSk6IFByb21pc2U8VXNlckNvbmZpZz4ge1xuICBsZXQgY29uZmlnOiBVc2VyQ29uZmlnID0ge307XG4gIGF3YWl0IGluaXRFbnYobW9kZSk7XG4gIGlmIChtb2RlID09PSAnZGV2ZWxvcG1lbnQnKSB7XG4gICAgLy8gZGV2ZWxvcG1lbnRcdTZBMjFcdTVGMEZcdTU0MENcdTY1RjZcdTc1MjhcdTRFOEVkZXZcdTU0OENvcHRpbWl6ZVxuICAgIGNvbmZpZyA9IGF3YWl0IGltcG9ydCgnLi92aXRlLmRldicpLnRoZW4oKHsgaW5pdCwgYnVpbGREZXZDb25maWcgfSkgPT4ge1xuICAgICAgaW5pdCgpO1xuICAgICAgcmV0dXJuIGJ1aWxkRGV2Q29uZmlnKG1vZGUpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKG1vZGUgPT09ICdwcmV2aWV3Jykge1xuICAgIGNvbmZpZyA9IGF3YWl0IGltcG9ydCgnLi92aXRlLnByZXZpZXcnKS50aGVuKCh7IGJ1aWxkUHJldmlld0NvbmZpZyB9KSA9PiB7XG4gICAgICByZXR1cm4gYnVpbGRQcmV2aWV3Q29uZmlnKG1vZGUsIGNvbW1hbmQpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKG1vZGUgPT09ICdwcm9kdWN0aW9uJykge1xuICAgIGNvbmZpZyA9IGF3YWl0IGltcG9ydCgnLi92aXRlLnByb2QnKS50aGVuKCh7IGJ1aWxkUHJvZENvbmZpZyB9KSA9PiB7XG4gICAgICByZXR1cm4gYnVpbGRQcm9kQ29uZmlnKG1vZGUsIGlnbm9yZUh0bWxQbHVnaW4pO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKG1vZGUgPT09ICdtb2NrJykge1xuICAgIGNvbmZpZyA9IGF3YWl0IGltcG9ydCgnLi92aXRlLm1vY2snKS50aGVuKCh7IGJ1aWxkTW9ja0NvbmZpZyB9KSA9PiB7XG4gICAgICByZXR1cm4gYnVpbGRNb2NrQ29uZmlnKG1vZGUpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignXHU2Q0ExXHU2NzA5XHU2MzA3XHU1QjlBXHU0RTAwXHU0RTJBXHU1M0VGXHU3NTI4XHU3Njg0bW9kZSxcdThCRjdcdTVDMURcdThCRDVcdTkwMUFcdThGQzctLW1vZGU9KioqXHU2NzY1XHU2MzA3XHU1QjlBJyk7XG4gIH1cbiAgcmV0dXJuIGNvbmZpZztc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QkFBZ0I7QUFBQSxFQUNwQztBQUFBLEVBQ0E7QUFBQSxFQUNBO0FBQ0YsR0FBbUU7QUFDakUsTUFBSSxTQUFxQixDQUFDO0FBQzFCLFFBQU0sUUFBUSxJQUFJO0FBQ2xCLE1BQUksU0FBUyxlQUFlO0FBRTFCLGFBQVMsTUFBTSxrRUFBcUIsS0FBSyxDQUFDLEVBQUUsTUFBQUMsT0FBTSxnQkFBQUMsZ0JBQWUsTUFBTTtBQUNyRSxNQUFBRCxNQUFLO0FBQ0wsYUFBT0MsZ0JBQWUsSUFBSTtBQUFBLElBQzVCLENBQUM7QUFBQSxFQUNILFdBQVcsU0FBUyxXQUFXO0FBQzdCLGFBQVMsTUFBTSwwRUFBeUIsS0FBSyxDQUFDLEVBQUUsb0JBQUFDLG9CQUFtQixNQUFNO0FBQ3ZFLGFBQU9BLG9CQUFtQixNQUFNLE9BQU87QUFBQSxJQUN6QyxDQUFDO0FBQUEsRUFDSCxXQUFXLFNBQVMsY0FBYztBQUNoQyxhQUFTLE1BQU0sb0VBQXNCLEtBQUssQ0FBQyxFQUFFLGlCQUFBQyxpQkFBZ0IsTUFBTTtBQUNqRSxhQUFPQSxpQkFBZ0IsTUFBTSxnQkFBZ0I7QUFBQSxJQUMvQyxDQUFDO0FBQUEsRUFDSCxXQUFXLFNBQVMsUUFBUTtBQUMxQixhQUFTLE1BQU0sb0VBQXNCLEtBQUssQ0FBQyxFQUFFLGlCQUFBQyxpQkFBZ0IsTUFBTTtBQUNqRSxhQUFPQSxpQkFBZ0IsSUFBSTtBQUFBLElBQzdCLENBQUM7QUFBQSxFQUNILE9BQU87QUFDTCxVQUFNLElBQUksTUFBTSx1SEFBa0M7QUFBQSxFQUNwRDtBQUNBLFNBQU87QUFDVDs7O0FEN0JBLElBQU8sc0JBQVEsYUFBYSxPQUFPLFFBQW1EO0FBQ3BGLFNBQU8sZ0JBQWdCLEdBQUc7QUFDNUIsQ0FBQzsiLAogICJuYW1lcyI6IFsiZ2xvYiIsICJmaWxlVVJMVG9QYXRoIiwgIlBPUyIsICJfX2Rpcm5hbWUiLCAibW9kdWxlUGFnZXMiLCAiX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCIsICJnbG9iIiwgInBhdGgiLCAiY2xpIiwgInVzZURlbWFuZEltcG9ydCIsICJtb2R1bGVzIiwgInBhdGgiLCAicGF0aCIsICJmc3AiLCAicGF0aCIsICJ1c2VEZW1hbmRJbXBvcnQiLCAiaW5pdCIsICJidWlsZERldkNvbmZpZyIsICJidWlsZFByZXZpZXdDb25maWciLCAiYnVpbGRQcm9kQ29uZmlnIiwgImJ1aWxkTW9ja0NvbmZpZyJdCn0K
