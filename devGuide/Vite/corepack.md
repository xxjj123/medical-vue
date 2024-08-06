## corepack

`corepack`是一个`node.js`提供并包含在`node.js`中的管理包管理器的管理器

### 功能
- 包管理器`yarn`/`pnpm`不需要自行安装
- 提供在`package.json`中通过配置固定包管理器及版本

### 安装
安装`node.js@16.9.0`或更高版本

### 升级

执行命令`npm install corepack -g`或`npm install corepack --location=global`

### 启用

执行命令`corepack enable`以启用`corepack`

执行命令`corepack --all`以将全部的包管理器(最新版本)下载到本地
或
在`package.json`中配置`"packageManager": "pnpm@8.5.1"`即可.

包管理器名称及版本参照`https://www.npmjs.com/` 官网

**问题处理:**
1. 如果第一次执行`corepack --all`命令时,长时间无法完成,那么可以通过配置`COREPACK_NPM_REGISTRY`变量(这个变量在`corepack@0.15.1`加入,所以在安装`node`之后升级一次`corepack`)指定国内的npm镜像站点
    - 在`linux`或`mac`的终端中执行`export COREPACK_NPM_REGISTRY="https://repo.huaweicloud.com/repository/npm/"` 或将其写入`.zshrc`之类的配置文件中
    - 在使用`Windows`时,将`COREPACK_NPM_REGISTRY="https://repo.huaweicloud.com/repository/npm/"` 配置到系统变量或用户变量中,如何配置请参考[Windows环境变量配置](https://jingyan.baidu.com/article/90bc8fc84b05b3b753640cdc.html)
