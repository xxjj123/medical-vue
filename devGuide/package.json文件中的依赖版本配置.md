
## package.json配置解析

本文档中,约定如下内容

- `依赖`,在没有明确指明的情况下,默认指`dependencies`
- `开发依赖`,指`devDependencies`

### 灵活的使用package.json文件中的依赖版本号配置

`npm`对于依赖的版本号有以下的规定：
1. 一个包含`package.json`文件的目录，比如`"demo":"./pkgs/demo"`
1. 一个包含1的目录结构的`tgz`压缩包，比如`"demo":"./pkgs/demo.tgz"`
1. 一个可以处理为2的`URL`，比如`"demo":"http://path/demo.tgz"`
1. 一个`<name>@<version>`格式的文本，指代发布到registry的一个可以处理为3的包，项目中常用的为此方式，比如`"demo":"1.0.0"`
1. 一个`<name>@<tag>`格式的文本，指向4,比如`"demo":"BETA"`
1. 一个`<name>`格式的文本，意为`<name>@latest`,比如`"demo":"latest"`
1. 一个`git`地址，当`clone`之后，结果为1,比如`"demo":"git://path/demo.git"`
   `git` 地址格式如下
    ```
    git://github.com/user/project.git#commit-ish
    git+ssh://user@hostname:project.git#commit-ish
    git+http://user@hostname/project/blah.git#commit-ish
    git+https://user@hostname/project/blah.git#commit-ish
    commit-ish 可以是任意可成功执行git checkout的标签（tag）、commit-hash、分支名称等
    默认为master
    ```

根据此规定，我们可以灵活的配置依赖的版本或指定特定的自己修改过的第三方依赖

此处以`mini-css-extract-plugin`以及上述第二种方式进行详细阐述

1. 将`tgz`文件放到本地的`pgks`目录下
1. 修改`package.json`文件中的相关依赖版本为指向对应`tgz`的相对于`package.json`的相对路径`"mini-css-extract-plugin": "./pkgs/mini-css-extract-plugin-0.10.0.tgz"`
1. 使用`npm install`进行`install`
1. 将`pkgs`目录及下边的tgz文件以及修改后的`package.json`文件提交到仓库

**注意：**
1. `pkgs`目录名，此处仅作为示例，实际项目中，可以放到项目的任意目录下
1. 使用本地的`tgz`文件作为依赖后，只能使用`npm install`，且这个依赖必须在项目的`package.json`中直接依赖
1. 与`tgz`文件相似，也可以使用解压后的目录以及`git`仓库作为依赖
1. `tgz`文件可以使用URL形式,比如
   ```
   "mini-css-extract-plugin": "http://118.112.188.108:9071/mini-css-extract-plugin/download/mini-css-extract-plugin-0.10.0.tgz"
   ```
   
### 强制覆盖依赖版本

#### 需求

在开发过程中,我们可能会遇到这种情况,即,某个依赖A(A.1)的某个依赖B版本(B.1)存在一定问题,但是对于依赖A,我们又不能使用其更新(或更旧)的版本(A.2),此时我们需要将依赖B的版本指定为B.2,那么此时需要怎么办?我们不大可能将A.1的版本源码放到我们的项目中来.

此时就有以下几种方案进行选择

#### 解决方案1: yarn

此时,我们就需要使用`yarn`提供的[resolutions](https://classic.yarnpkg.com/en/docs/selective-version-resolutions#toc-why-would-you-want-to-do-this)解决方案.
以`mini-css-extract-plugin`举例,在`package.json`中,配置如下的内容,
```
// package.json
{
...
resolutions: {
"mini-css-extract-plugin": "^1.0.0"
}
...
}
```

#### 解决方案2: pnpm

如果你使用的是`pnpm`进行包管理,虽然它可以读取上面的`resolutions`配置并进行自动配置,但是它会将整个项目的所有相关依赖处理成我们在配置中指定的版本.

此时,我们就需要一个新的[配置](https://pnpm.io/zh/package_json#pnpmoverrides)替代`resolutions`,并将指定的包的指定的模块替换为另一个版本.还是以`mini-css-extract-plugin`举例,

```
// package.json
{
...
  "pnpm": {
    "overrides": {
      "mini-css-extract-plugin": "^1.0.0",
      "@vue/cli-service>mini-css-extract-plugin": "^1.0.0"
    },
}
...
}
```
**说明:**
- 第一种配置方式,与`resolutions`完全相同
- 第二种配置方式,只会覆盖`@vue/cli-service`的`mini-css-extract-plugin`依赖的版本


#### 解决方案3: pnpm patch

如果你使用`pnpm`,那么你还可以通过`pnpm patch`功能实现对一个第三方模块的代码修改

参考[pnpm补丁](https://blog.csdn.net/qq_45585640/article/details/128772678)
