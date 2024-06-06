const path = require('path')
const fs = require('fs')
const pages = require('./pages.cjs')

function kebabCase(str) {
  const hyphenateRE = /([^-])([A-Z])/g
  return str
    .replace(hyphenateRE, '$1-$2')
    .replace(hyphenateRE, '$1-$2')
    .toLowerCase()
}

/**
 * 从pages.cjs文件配置中向package.json文件中添加页面模块
 * @param pkg
 */
function resolveCliPages(pkg) {
  const internalPages = {}
  // 遍历pages.cjs文件,获取需要加载的cli页面模块
  pages.forEach(p => {
    let pageName = p
    let version = ''
    pageName = kebabCase(pageName)
    // cli页面模块默认使用cli的版本号
    // 按照如下的顺序生效
    // 1. pages.cjs中明确配置的版本号
    // 2. 本地pages/*是否存在
    // 3. cli的package.json中的版本号
    if (pageName.indexOf('@') < 0) {
      // 拼接cli页面模块的路径(框架开发用)
      const pPath = path.resolve(process.cwd(), `./pages/${pageName}`)
      if (fs.existsSync(pPath)) {
        version = 'workspace: *'
      } else {
        version = 'latest'
      }
    } else {
      const ss = pageName.split('@')
      pageName = ss[0]
      version = ss[1]
    }
    // 拼接cli页面模块的名称
    const pName = `@yh/cli-pages-${pageName}`
    internalPages[pName] = version
  })
  pkg.dependencies = {
    ...internalPages,
    ...pkg.dependencies,
  }
}

function readPackage(pkg) {
  if (pkg.name === 'echarts-wordcloud') {
    pkg.dependencies = {
      ...pkg.dependencies,
      echarts: '^4.1.0',
    }
  }
  if (pkg.name === '@yh/ta404-ui-cli') {
    resolveCliPages(pkg)
    // 将@web-types/at-yh-ta404-ui-web-types的版本固定到@yh/ta404-ui的版本
    pkg.devDependencies['@web-types/at-yh-ta404-ui-web-types'] = 'npm:@yh/ta404-ui-web-types@'+pkg.dependencies['@yh/ta404-ui']
    // 将core-js-compat的版本与core-js的版本固定为一致的版本
    pkg.devDependencies['core-js-compat'] = pkg.devDependencies['core-js']
    // 为了解决在使用换肤功能时可能出现的编译器报错: less not installed
    pkg.devDependencies['copy-anything'] = '^2.0.1'
    pkg.devDependencies['parse-node-version'] = '^1.0.1'
    pkg.devDependencies['tslib'] = '^2.3.0'
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage,
  },
}
