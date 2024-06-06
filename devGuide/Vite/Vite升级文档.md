
## Vite 升级文档

### 与webpack对比

1. `dev-server`启动速度极快,但是由于此时还没有对依赖进行编译,所以,第一次进入页面会比较慢
2. `dev`时,对于每个文件都是进行单独的请求,所以,此时在控制台中会发现,相比`webpack`的`dev`启动,一个页面请求的文件数量都显著提升
3. `build`会自动进行`tree-shaking`,理论上,打包产物会比`webpack`更小且在没有配置`minify`时,生成的代码会更易读,便于生产环境上的调试
4. 

### 修改内容

1. 除了`['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']`以外的所有文件引入都需要添加后缀名
   ```
   // 旧代码
   import App from './app'
   // 新代码
   import App from './app.vue'
   ```
2. 如果,在`vue`文件的`script`中使用了`jsx`的语法,那么这个`script`标签需要添加`lang='jsx'`来声明将这个`script`标签中的内容通过`jsx`来进行编译
3. 环境变量命名/使用方式变更: 项目中使用到的`process.env.VUE_APP*`统一修改为`import.meta.env.VITE*`,如果你自己有设置环境变量,那么需要将其名字修改为`VITE_`开头,或者在`build/env.ts`中,按照示例的格式进行注入
   ```
   // 旧代码
   process.env.VUE_APP_PUBLIC_PATH
   // 新代码
   import.meta.env.VITE_PUBLIC_PATH
   ```
4. `webpackCommonConfig.js`文件现在更新为`viteCommonConfig.ts`,内容也有一定的变化
5. 不再需要配置`docModule`/`coreModules`/`projectModules`,现在通过`vite-plugin-virtual-html`插件会自动将项目中的所有`html`文件引入,配置参考`viteCommonConfig.ts`文件中的`html`配置,配置到`html`中的字符串都会被视作一个`glob`进行解析
6. 所有`html`文件,都需要在`body`中添加一段`script`来指向当前目录的入口文件,形式如下:
   ```
   // 必须以/开始,同时需要添加type='module'
    <script src="/src/project/demoTest/demoTest.js" type="module"></script>
   ```
7. 项目中所有的静态资源引用都应该按照新的方式进行操作(详情见`静态资源引用.md`)
8. 使用了`require.context`的项目代码,需要使用`import.meta.glob`进行替换,替换方式如下
   ```
   // 旧代码
   require.context('./', true, '*.vue')
   // 新代码
   import.meta.glob('./**/*.vue', {eager: true}) // 参数为fast-glob的pattern,**代表递归子目录
   // 或 使用异步方式
   import.meta.glob('./**/*.vue') // 此处没有传入eager参数,表示获取到的是一个Promise对象
   ```
   **注意:**
   1. 新的引入方式在编译后的代码中,结构如下
   ```
   // import.meta.glob('./**/*.vue', {eager: true})
   import * as __glob__0_0 from './a.vue'
   import * as __glob__0_1 from './b/b.vue'
   const modules = {
   './a.vue': __glob__0_0,
   './b/b.vue': __glob__0_1
   }
   // import.meta.glob('./**/*.vue')
   const modules = {
     './a.vue': () => import('./a.vue'),
     './b/b.vue': () => import('./b/b.vue'),
   }
   ```

   2. 由于新的引入方式返回的是满足规则的ES模块对象,所以使用方法也与`require.context`有所不同,可以直接通过`Object.keys(obj)`进行操作
9. 项目中所有通过`require`引入的内容,都需要使用`import`来引入
    ``` javascript
    // 旧代码
    const a = require('a')
    // 新代码
    let a
    import('a').then(m=>{a=m.default})
    // 如果你的项目不需要兼容IE及chrome<88(其他兼容情况查看网址: https://caniuse.com/?search=top%20level%20await),那么你可以选择使用 top-level await
    const a = (await import('a')).default
    ```
10. 如果你有使用第三方依赖,那么你需要确认你使用的依赖是否提供了`ES`模块,如果有提供,那么你需要在`alias`配置中将其指向相应的`ES`模块.如果没有提供,那么你可能需要将这个依赖放到项目中,然后改写其模块形式,将其改写为`ES`模块. 参考示例: `/build-vite/plugins/mockjs`

11. 现在,按需加载不再使用`babel`插件,而是使用自实现的vite插件.详细配置可查看`/build-vite/plugin.ts`中的`128`行,uiVite插件的使用.

12. 
