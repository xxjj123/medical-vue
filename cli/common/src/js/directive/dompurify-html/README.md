# v-dompurify-html

添加 v-dompurify-html指令替换v-html,用于过滤掉可能出现xss攻击的v-html内容

## 标签使用
如果是直接使用在标签中使用
```vue
<template>
  <div >
    <div v-dompurify-html="rawHtml"></div>
    <div v-dompurify-html:svg="svgContent"></div>
  </div>
</template>
<script>
  export default {
    data(){
      return {
        rawHtml: '<span style="color: red">This should not be red.</span>',
        svgContent:'<svg><rect height="50"></rect></svg>'
      }   
    }
  }
</script>
```
## js中使用
js中可直接使用dompurify插件
```javascript
import purify from 'dompurify';
const clean = purify.sanitize('<p>abc<iframe//src=jAva&Tab;script:alert(3)>def</p>'); // becomes <p>abc</p>
```

