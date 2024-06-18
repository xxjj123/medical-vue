import historyPage from 'virtual:historyPage';
import {version} from './package.json';
import {version as uiVersion} from '@yh/ta404-ui/package.json';

const isEnvTrue = (env: string) => {
  return env.toUpperCase() === 'TRUE';
};

// 前端运行时配置
const faceConfig = {
  version,
  uiVersion,
  // 基础路径,打包发布的时候修改为后端发布服务地址
  // ** 任何时候都不要直接修改 basePath **
  // ** 而是应该修改.env/目录下对应环境的环境变量 **
  basePath: import.meta.env.VITE_BASE_PATH,
  // basePath: 'http://172.20.22.126:8083/ta404',
  // basePath: 'http://192.168.77.161:8081/ta404',
  // basePath: 'http://localhost:8081/ta404',
  // 首页数据配置
  indexPageConfig: {
    // menuType 菜单样式（leftTop, left, top, simple, workTable）
    menuType: 'leftTop',
    // 左侧菜单显示方式(sliding：侧滑, dropdown：手风琴)
    menuLeftStyle: 'dropdown',
    // 菜单是手风琴时默认是否展开2级菜单,默认不展开
    dropdownOpenMenu: false,
    // 顶部头的高度
    headerHeight: '64px',
    // tabs 的高度
    tabHeight: '40px',
    // 顶部头的颜色样式 (base:主题色,light:简洁白)
    headerTheme: 'base',
    // 左侧的颜色样式 (base:主题色,light:简洁白,dark:暗夜黑)
    leftTheme: 'base',
    // 左侧菜单的宽度
    leftWidth: '230px',
    // logo框的宽度（菜单为top时有效，其余logo框宽度等于左侧菜单宽度）
    logoWidth: '230px',
    // 首页左侧菜单收起的时候的宽度（建议不小于30px）
    leftCloseWidth: '50px',
    // 顶部菜单下方条状样式（breadcrumb：面包屑, tab：显示所有tab）
    barType: 'tab',
    // logo 文字
    logoTitle: 'Ta+3 404开发平台',
    // logo 图片名称，如logo.png （注意：请将图片放在 src/corePage/index/img 路径下）
    logoImage: 'logo.png',
    // 不显示pageTool工具箱的页面（如：['orguser.html']）
    notPageTool: ['worktable', 'roleWorktableTemplateModify'],
    //
    /** closeTabCallBackModules: 需要关闭之前使用回调的模块()
     * id: 需要关闭之前回调的模块的id(有id以id为准,没有id以url为准)
     * url:需要关闭之前回调的模块的url
     * prefix:需要关闭之前回调模块的url前缀(非必须)
     * 例如: closeTabCallBackModules:[{url:'orguser.html#/orgManagement',id:'1e706f26bc144c1da12022359c238053'}],
     * * */
    closeTabCallBackModules: [],
    /**
     * ======================================
     *   重要：由于新版工作台使用了一个布局组件，
     *        但该组件不支持IE9，所以如果需要支
     *        持IE9的话需要自己开发工作台，必须
     *        使用faceConfig.js文件中的自定义
     *        工作台页面进行替换，否则在IE9浏览
     *        器下登录进入后工作台打不开，IE其
     *        他版本(IE10、IE11)及其他浏览器
     *        没有影响
     * ======================================
     */
    // 自定义工作台页面，默认页面为workTablePage.html，文字为'工作台'。注：若自定义页面，需在功能资源管理中放开该页面的权限
    worktable: {
      name: '',
      module: 'workTablePage.html', // 模块
      part: 'page', // 路由路径
      prefix: '',
    },
    // html资源获取地址,一般情况下为本系统不需要配置
    srcPrefix: '',
  },
  // 前后端交互参数配置
  resDataConfig: {
    serviceSuccess: 'serviceSuccess', // 服务是否成功回调
    serviceSuccessRule: true, // 服务调用成功规则，设置serviceSuccess为成功时的标志，默认为boolean类型true，也可以设置数字或者字符串类型
    errors: 'errors', // 错误信息 包含错误消息
    message: 'message', // 简单错误信息,如果也有error,那么也会执行error的处理
    redirectUrl: 'redirectUrl', // 重定向地址
    submitParameter: {}, // 默认提交参数
    frontUrl: null, //  取值 null 框架默认, 单点统一平台的话需要配置成portal
    collectionUrl: 'codetable/getCode', // 获取单个码表的url
    collectionUrlList: 'codetable/getCodeBatch', // 获取码表List的url
    cryptoCfg: {
      // 加密配置
      reqDataLevel: 0, //  加密级别 faceConfig.resDataConfig.reqDataLevel的配置 < 后端配置 < submit提交参数配置
      banCrypto: false, // 最高等级加密判定 默认为false。为true时不加密，不经过包括后端在内的加密配置判断，加密配置无效。为false时通过加密配置判断是否加密
    },
    // 分页参数配置
    pageConfig: {
      pageNumber: 'pageNumber', // 分页的页面参数名称 默认pageNumber,适配hsa,配置为pageNum
      total: 'total', // 分页的总页数名称 默认total,适配hsa,配置为recordCounts
      list: 'list', // 分页返回列表名字 默认list,适配hsa ,配置为 data
      isMostCount: true, // 分页是否开启大数据模式并且，总数擦寻调为手动刷新模式，同时需将分页的simple属性设置为{most: true, simpleAsyncTotal: true}
    },
  },
  projectConfig: {
    // 项目码表scope配置指对存储在storage中的码表值添加一个scope后缀,例如SEX@project-a,SEX@project-b等,此配置需要配置到faceConfig文件中,例如:
    // collectionSign: '@project-a',
    // 是否默认包含子组织
    isQueryChildOrgData: false,
  },
  // 是否启用在线换肤/dark-mode
  enableOnlineTheme: isEnvTrue(import.meta.env.VITE_ONLINE_THEME_ENABLED),
  // 页面默认主题：用于编译时的默认主题及在线换肤时的默认值处理 默认ybblue
  defaultTheme: import.meta.env.VITE_PRESET_THEME,
  // 是否启用悼念模式
  enableDarkMode:
    isEnvTrue(import.meta.env.VITE_ONLINE_THEME_ENABLED) &&
    isEnvTrue(import.meta.env.VITE_ENABLE_DARK_MODE),
  // 是否启用关怀模式
  elderlyOriented:
    isEnvTrue(import.meta.env.VITE_ONLINE_THEME_ENABLED) &&
    isEnvTrue(import.meta.env.VITE_ELDERLY_ORIENTED),
  // 默认语言配置 简体中文zh_CN,英语en_US
  defaultLocale: import.meta.env.VITE_DEFAULT_LOCALE,
  // 路由模式: 用于兼容history模式的路由,可配置为hash或history
  routerMode: 'history',
  historyPage,
};

export default faceConfig;
