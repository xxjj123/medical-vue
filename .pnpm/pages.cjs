// 需要在项目中使用的框架页面
module.exports = [
  // 可以直接传入页面的名字
  // 如果模块的名称不包括@的话,此时其版本号将会选择下面两个值的任意一个
  // workspace:* : 当项目根目录的cli目录下包含这个文件夹时,将会使用workspace:* 作为模块的版本号;这个版本一般只用于框架组开发
  // latest: 当项目根目录的 cli 目录下不包含这个页面模块时,默认将会使用'page@latest`
  // 如果模块的名称包括@的话,此时的版本号将会是@后面的版本号
  // 例如, 版本号可以使用如下的几种形式
  // 'login@1.5.2', // 指定版本号
  // 'login@^1.5.2',// 带^或~的版本号

  'login',
  'register',
  'index',
  'project-demo',
  'worktable-page',
  'audit',
  'authority',
  'function-modules',
  'logmg',
  'messagemg',
  'usercenter',
  'orguser',
  'resourcemg',
  'sysmg',

  // 'uiredirect'
]