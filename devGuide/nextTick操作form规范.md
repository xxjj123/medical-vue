## nextTick操作form规范

Vue 在更新 DOM 时是异步执行的。
只要侦听到数据变化，Vue 将开启一个队列，并缓冲在同一事件循环中发生的所有数据变更。
如果你想基于更新后的 DOM 状态来做点什么。
为了在数据变化之后等待 Vue 完成更新 DOM，可以在数据变化之后立即使用 Vue.nextTick(callback)。这样回调函数将在 DOM 更新完成后被调用。

### 写法
nextTick有两种使用方法，一种为传入一个回调函数，一种为promise的写法（这里推荐使用回调函数写法）：  
```js
// 修改数据
vm.msg = 'Hello'
// DOM 还没有更新，传入回调函数写法
Vue.nextTick(function () {
// DOM 更新了
})

// 作为一个 Promise 使用
Vue.nextTick()
.then(function () {
// DOM 更新了
})
```

### 项目中使用场景
#### 1、 form表单和draw/modal组件配合时
当modal或draw组件中存在表单组件 (ta-form) ，并且抽离为一个vue组件。此时如出现form为null或undefined时，是因为form还未注册完成，就已经要操作form导致的。
此时，您应当对使用nextTick来确保form已经注册完成，再去操作form表单。

```js

mounted()
{
  this.$nextTick(() => {
// 对form的操作要在form注册完成后
    this.form?.setFieldsValue({
      name: '我是杨xx'
    })
  })
}
```
