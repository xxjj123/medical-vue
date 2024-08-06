## 主题定义
`preset-theme`目录下的`less`文件中,应该包含如下内容:

```less
  // 预定义的主题的primary-color
  // 注意: 预定义主题必须包含一个primary-color
  // 这个变量的值可以是颜色等任意css合法的值
  @primary-color: #13c2c2;
  // 其他任意less变量.
```

在自动换肤的时候,首先会根据环境变量`VITE_PRESET_THEME`,重置主题,然后在切换到指定的主题
