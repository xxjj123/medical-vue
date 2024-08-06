# vite优化

`vite`在开发期可以使用`esbuild`对依赖进行优化,实现对`commonjs`的兼容


## 应该在什么时候使用?

- 如果你使用了第三方依赖,且这个依赖没有提供`esm`格式的编译,那么你应该将他加入到优化中
- 如果你的项目在启动后,在开发过程中会出现页面反复刷新,且控制台出现类似`New dependencies found`的输出时

## 如何配置

- 将依赖在`/build-vite/optimize/optimize.ts`中进行引入;**注意:** 你只需要在这个文件中将其引入,而不需要进行使用
- 将`New dependencies found`输出的依赖配置到`/build-vite/optimize/optimize.ts`中;**注意:** 此时配置的依赖必须与控制台输出的依赖完全一致
