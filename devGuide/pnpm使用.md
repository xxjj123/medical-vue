## pnpm 使用说明

在1.5.2中,我们使用默认推荐使用pnpm进行依赖管理,这可以有效降低磁盘使用以及避免幽灵依赖.

### 基本命令

`pnpm`的命令与`npm`基本一致

其与`npm`和`yarn`的对比如下

| 命令 | pnpm | npm | yarn |
| --- | --- | --- | --- |
| 安装项目的所有依赖 | pnpm install | npm install | yarn [install] |
| 添加dependencies | pnpm add * | npm install * | yarn add * |
| 添加devDependencies | pnpm add * -D | npm install * -D | yarn add * -D |
| 移除不需要的依赖(已安装的依赖旧版本或不再需要的依赖) | pnpm prune | npm prune | -(yarn install会自动进行prune) |
| 运行脚本 | pnpm run * | npm run * | yarn * |
| 全局install | pnpm add * -g | npm install * -g | yarn global add * |

### 幽灵依赖

所谓幽灵依赖,是指没有在`package.json`中明确声明的依赖,在使用时(使用`npm`和`yarn`)实际上是可以使用的.

这会导致项目的依赖版本管理混乱.这在`1.5.2`之前的CLI框架中是比较常见的,但是在`1.5.2`以及之后,我们对这些依赖进行了梳理.目前是不再存在幽灵依赖.

但是,如果你在项目中使用了一个幽灵依赖时,那么在启动或者运行时可能会报错.

### pnpm的monorepo说明

- `1.5.2`使用了`monorepo`将部分功能作为依赖进行引入,所以在项目根目录`install`依赖时需要加一个`-w`参数,即:`pnpm install * -w`

### 配置说明

#### resolution-mode

此配置是默认配置到`.npmrc`文件中的一个配置,其默认值为`lowest-direct`,表示在`install`过程中,会忽略语义化版本号的配置,而直接`install`其版本

例如:

在`package.json`中定义了一个依赖的版本`a^4.0.0`,如果当前a的最新的版本号为`4.3.2`,此时会直接下载`4.0.0`版本

通过这个配置,可以让整个项目组不会出现由于使用了不同的第三方依赖版本而导致的问题(例如,某些问题仅在第三方依赖的更新版本中出现)

也可以让CI/CD环境(需提前对CI/CD环境启用`corepack`)下安装的依赖与开发期一致
