## import和 require

### 区别

import 是 ESModules 定义的引入方式
require 是 commonjs 定义的引入方式
- require： 1.运行时加载（同步加载，性能低）
- import： 1.编译时加载（异步加载，性能高）

### 在框架中使用

一般来说,在`1.5.1`和之前版本的 CLI 框架中,我们建议使用的都是静态引入(import)

但是,对于`require`的按需引入来说,没有强制的约定.

在`1.5.2`版本中使用了`vite`,由于`vite`不再默认对`require`进行支持,虽然我们通过插件在`dev`和`prod`时期对`commonjs`进行了一定程度的支持

但是,** 这个支持可能会存在一定的不确定性(例如某些文件不会被插件支持) **

此时,我们需要对代码进行改造,以使用`import`来替代`require`

例如,我们考虑如下的两段代码

```javascript
// 代码 1
const demo = require('demo1')
console.log(demo1)

// 代码 2
if (__condition__){
  const demo1 = require('demo2')
  console.log(demo2)
}
```

他们都是使用的`require`语句引入的`demo`模块
只是,一个是静态的引入,一个是条件引入

从引入方式来说,我们都可以将其修改为静态的`import`,如下代码

```javascript
// 代码 1

import demo1 from 'demo1'
// const demo1 = require('demo1')
console.log(demo1)

// 代码 2
import demo2 from 'demo2'
if (__condition__){
// const demo2 = require('demo2')
console.log(demo2)
}
```

但是,此时存在一个问题,即: 我们的`demo2`模块没有完全按照原有的方案进行`按需加载`

此时,我们可以使用`动态 import`来实现与旧代码相似的代码,如下所示:

```javascript
// 代码 2
// import demo2 from 'demo2'
if (__condition__){
  import('demo2').then(demo2=>{
    console.log(demo2)
  })
// const demo2 = require('demo2')
// console.log(demo2)
}
```
或
```javascript
// 代码 2
// import demo2 from 'demo2'
if (__condition__){
  const demo2 = await import('demo2')
// const demo2 = require('demo2')
  console.log(demo2)
```

### 说明
1. 同步(静态)引入  
   静态`import`语句**必须**在文件的顶部
   `require`语句可以在文件的任意位置(即: 可以实现按需引入)
```javascript
// 旧代码
const demo = require('demo')
// 新代码
import demo from 'demo'
```

2. 异步(按需)引入  
   动态的`import`语句返回的是一个`Promise`值,你可以给他传递一个 `then`函数并在函数中执行后续的操作,也可以通过`async-await`来实现类似同步的操作
