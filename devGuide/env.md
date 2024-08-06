# env文件变量说明

在阅读此文档之前请先阅读[环境变量介绍](./Vite/env.md)

**注意:**

使用时通过`import.meta.env.***`进行调用

## 基础变量
- `VITE_PUBLIC_PATH`: 前端项目的启动后的访问路径,即浏览器上下文

## 后端服务变量
- `VITE_BASE_PATH`: 后端服务器接口地址

    **注意:**

    如果配置为完整的地址(例如`http://*/*`),那么将会直接将请求发送到此路径,且可能存在跨域问题.
    如果配置为一个上下文(例如`/*`)
  - 在`dev`开发时,通过与`VITE_BACKEND_PATH`配置,将不会出现跨域问题
  - 在`build`生产环境时,请求此路径将会根据前端的部署情况进行访问,例如,部署到`http://localhost:8080/ta404` 时,请求将会访问`http://localhost:8080/*` 这个路径,此时也可能会发生跨域问题,请通过`nginx`或其他方法进行解决

- `VITE_BACKEND_PATH`: 仅在`dev`时生效,表示代理请求时的真实后端地址

## 主题变量

- `VITE_ONLINE_THEME_ENABLED`: 是否启用在线换肤
- `VITE_PRESET_THEME`: 启动后默认的预设主题名称: 
- `VITE_THEME_STORAGE_KEY`: 主题存储到`localstorage`时的键名

    **注意:** 

   - 当`VITE_PRESET_THEME`设置的主题文件没有在目录`/src/common/dynamicTheme/themeDefinitions/`下定义时,预设主题也不会生效

## 国际化变量

- `VITE_DEFAULT_LOCALE`: 默认的语言
- `VITE_LOCALE_STORAGE_KEY`: 修改语言后,在storage中存储的值的key

## 其他变量


## 提升开发期的效率的变量

- `USE_OLD_MODULES_SUPPORT`: 是否从`@yh/ta404-ui/es`中按需加载模块,默认在开发期间为`false`,可显著提升开发期浏览器的响应速度
- `VITE_PERF_LOAD_LESS`: 是否直接加载`less`文件,在`dev`开发时禁用可显著提升浏览器响应速度. 这个值在开发时默认是`false`,在生产时默认是`true`
  - 如果这个值是`false`,那么在开发时会加载来自`@yh/cli-internal-precompiled-less/es`目录下的各ui组件的预编译`css`文件
  - 如果这个值是`true`,那么在开发时会加载来自`@yh/ta404-ui/es`目录下的各ui组件的`less`文件

## 生产环境专用变量

- `WAR_NAME`: 生成的war包名称
- `OUTPUT_DIR`: 代码生成到的目录,默认为`dist`
- `BUILD_REPORT`: 是否生成打包报告文件
- `BUILD_LEGACY`: 是否启用`IE11`兼容, 设置为`true`后,会自动生成名为`*.legacy.js`的文件,这些文件将会自动包含用于`IE11`的`polyfills`以及其他兼容性代码
- `BUILD_INJECT_MODERN_POLYFILLS`: 是否为旧版本浏览器提供`polyfills`,设置为`true`后,会自动添加用于旧版本浏览器的`polyfills`

  **注意:**

- `1.5.2`起,由于更换了打包工具(`webpack`=>`vite`),所以IE现在只兼容到`11`
