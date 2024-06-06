import {fileURLToPath, URL} from 'node:url';
import type {BuildOptions} from 'vite';

type rollupOptions = NonNullable<BuildOptions['rollupOptions']>;
type commonjsOptions = Pick<NonNullable<BuildOptions['commonjsOptions']>, 'include' | 'extensions'>;
export interface ViteCommonConfig {
  alias: {
    base: Record<string, Alias>;
    development: Record<string, Alias>;
    production: Record<string, Alias>;
  };
  copyResources: Array<{from: string; to: string}>;
  open: string | false;
  includeStyles: Record<string, Record<string, string>>;
  commonjs: commonjsOptions;
  build: {
    treeshake: rollupOptions['treeshake'];
    minify: BuildOptions['minify'];
    terserOptions: BuildOptions['terserOptions'];
    cssMinify: BuildOptions['cssMinify'];
    polyfills: {targets: Record<string, string>};
  };
  optimizeDeps: {
    include: Array<string>;
    entries: Array<string>;
    needsInterop: Array<string>;
    exclude: Array<string>;
  };
  html: Array<string | {path: string; entry: string}>;
  cli: {
    modules: Array<string>;
    override: Override;
    historyPage: Array<string>;
    html: {
      title: Record<string, string>;
    };
    files: Array<{file: string; newFile: string}>;
  };
  mpa: Array<string> | true;
}
export declare type Alias = string | {find: RegExp | string; replacement: string};

export interface Override {
  [key: string]: string | Override;
}

const _default: ViteCommonConfig = {
  alias: {
    base: {
      // 框架基础的alias
      // 这里使用方法比较复杂,这是为了在Webstorm(需要2022.3)中可以通过鼠标点击import语句中的alias直接进入相应的文件
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@common': fileURLToPath(new URL('./cli/common/src', import.meta.url)),
      // '@common': '@yh/cli-internal-common/src',
      '@projectCommon': fileURLToPath(new URL('./cli/projectCommon/src', import.meta.url)),
      faceConfig: fileURLToPath(new URL('./faceConfig', import.meta.url)),
      // 将第三方模块指向其对应的ES模块文件
      moment: {find: /^moment$/, replacement: 'moment/src/moment'},
      less: {find: /^less$/, replacement: 'less/lib/less-browser/index'},
      vue: {find: /^vue$/, replacement: 'vue/dist/vue.esm.js'},
      vuex: {find: /^vuex$/, replacement: 'vuex/dist/vuex.esm.js'},
      'vue-router': {find: /^vue-router$/, replacement: 'vue-router/dist/vue-router.esm.js'},
      // 弃用: common 别名已弃用,请使用@common别名,留在这里只是为了兼容,后期会移除
      common: fileURLToPath(new URL('./cli/common/src', import.meta.url)),
    },
    development: {},
    production: {
      // 在生产时期将@yh/ta-utils指向utils.esm.ts
      // 这个文件只包含ESM下的import/export(具名export)
      // 可以在生产环境下使用tree-shaking将未使用的工具代码移除
      '@yh/ta-utils': {
        find: /^@yh\/ta-utils$/,
        replacement: '@yh/cli-internal-common/src/utils.esm.ts',
      },
    },
  },
  // 第三方资源复制到生成的dist中
  copyResources: [
    {
      from: 'node_modules/@yh/ta404-ui/static/*', // 来源路径,相对于项目根路径的相对路径
      to: 'static', // dist目录下的路径
    },
  ],
  // dev/preview有效, 用于在dev/preview时自动打开文件
  // 设置成false可禁用
  open: false,
  // 在这里覆盖由于主题换肤导致的样式覆盖
  includeStyles: {
    '.ant-fullcalendar-fullscreen .ant-fullcalendar-selected-day .ant-fullcalendar-value': {
      color: '#FFFFFF',
    },
    '.ant-btn-primary:hover, .ant-btn-primary:focus': {
      color: '#FFFFFF',
    },
    '.ta-tag-select .tag-select-btn:hover': {
      color: '#1B65B9',
    },
    // button 的 link 属性会被主题换肤覆盖
    '.ant-btn-link:hover, .ant-btn-link:focus': {
      'border-color': 'transparent',
    },
    // 经办权限管理>新增角色的 step 样式被主题换肤覆盖
    '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon': {
      color: '#FFF',
    },
  },
  // 给 dev 和 prod 环境使用的 commonjs 配置
  commonjs: {
    // 同时给 dev 和 prod 环境使用的 commonjs.include 配置
    // 注意: 这里是以一个目录为基本单位,且必须是这样的写法
    // 在 dev 时期,这个配置会被移除头尾的**
    // 在 prod 时期,这个配置会原封不动的传递给 build.commonjsOptions.include
    include: ['**/node_modules/**', '**/cli/**', '**/internal/**', '**/pages/**', '**/src/**'],
    // 仅用于 prod 时期的配置,用于指定哪些文件会被 commonjs 插件处理
    extensions: ['.js', 'cjs', '.vue', '.jsx', '.ts', '.cts', '.tsx'],
  },
  build: {
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
    cssMinify: 'esbuild',
    // 按需加载polyfills, 此处设置的是浏览器的最低版本
    // 只需要配置现代浏览器的最低版本
    // IE兼容通过BUILD_LEGACY变量自动注入ie: '11'配置,且仅兼容IE11
    // 注意: 兼容配置仅支持生产环境,开发时不进行支持
    polyfills: {
      targets: {
        chrome: '64',
      },
    },
  },
  optimizeDeps: {
    include: [
      // 不方便或不能直接写到/build-vite/optimize/optimize.ts文件中的依赖
      // 例如某个依赖直接依赖的某个依赖需要提前优化,但这个依赖不是框架本身的依赖
      '@yh/cli-pages-index > @wcjiang/notify',
      '@yh/cli-pages-orguser > vue-cookies',
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
      '@yh/ta-utils/crossDomain',
    ],
    exclude: [
      // 在优化时,需要排除的一些不需要优化的依赖或虚拟模块,以避免优化期间报错
      'virtual:dynamicTheme',
      'virtual:themeDefinitions',
      'virtual:dynamicI18n',
      'virtual:historyPage',
      'virtual:darkMode',
      'virtual:elderly',
    ],
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
    modules: ['demoTest', 'clevelAiPacs'],
    // 这个配置可以用来配置 html 文件相关的内容
    html: {
      // 用于定义 HTML 页面的 title
      // 你也可以在这里添加项目的HTML 文件的配置
      // 但是,注意,在 HTML 文件中使用时,必须使用: %VITE_HTML_TITLE_*%
      // 的形式来使用
      title: {
        audit: '审计管理',
        authority: '权限管理',
        demo_test: '示例模块',
        function_modules: '功能模块',
        index: 'Ta+3404开发平台',
        login: '登录',
        logmg: '日志管理',
        messagemg: '消息历史管理',
        orguser: '组织管理',
        project_demo: '组件示例',
        register: '注册',
        resourcemg: '资源管理',
        sysmg: '系统管理',
        uiredirect: 'uiredirect',
        user_center: '个人中心',
        work_table_page: '工作台模块',
        // ----新系统---- //
        clevel_ai_pacs: '智慧医疗影像系统'

      },
    },
    // 用于指定框架默认的页面的各个子模块的实现,只有在这里提供的子模块才能被覆盖
    override: {
      // 结构
      // 如果是通用的组件,那么直接放到第一级
      // 如果是某个页面的组件, 那么使用页面名字的对象,例如下面的login
      'routes-container': '@yh/cli-internal-common/src/components/routesContainer.vue',
      // 以login/src/modify-password举例:
      // 在使用时,使用h('login/src/modify-password')或h('login_src_modify-password')或在vue的template中使用<login_src_modify-password/>标签
      // 通过unplugin-vue-components的处理后
      // 将会转换为对这个对象: login.src.modify-password 的引用
      login: {
        // 各个可以覆盖的模块,直接指定其所在的路径
        // 如果使用node_modules下的实现则不需要/开头
        // 这个实现可以使用任何可渲染出页面的文件,如.vue/.js/.jsx/.ts/.tsx等
        login: '/src/override/login-override-demo/login.vue',
        // login: '@yh/cli-pages-login/src/login.vue',
        // login: '/src/override/login-override-demo/login.vue',
        // login: '/src/override/login-override-demo/login-js.js',
        // login: '/src/override/login-override-demo/login-jsx.jsx',
        src: {
          'modify-password': '@yh/cli-pages-login/src/part/modifyPassword.vue',
          'social-list': '@yh/cli-pages-login/src/part/socialList.vue',
          'login-form': '/src/override/login-override-demo/loginForm.vue',
          'sms-login-form': '@yh/cli-pages-login/src/part/smsLoginForm.vue',
          verify: '@yh/cli-pages-login/src/part/verifition/Verify.vue',
        },
      },
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
    ],
  },
  // 这个配置仅用于build:mpa脚本
  // 当传入一个数组时: 仅编译数组中的页面
  // 当传入true时,将编译所有可用的页面(与pnpm build一致,但是会将各个页面的assets放到独立的assets目录中)
  // 注意: 这个功能应当仅用于少量页面的打包,如果页面过多,则会导致编译时间过长
  mpa: ['login'],
};

export default _default;
