
---   
# Git提交规范

## 简介

采用主流的 `Angular commit message` 规范，利用相关的插件，规范化 `commit message` ，且可以自动根据 `commit message` 生成 CHANGELOG.md。

### 提交信息的作用

1. 提供更多的历史信息，方便快速浏览。
2. 可以过滤某些 commit (比如文档改动)，便于快速查找信息。
3. 可以直接从 commit 生成 CHANGELOG.md。

### 提交信息的格式及示例

使用 `git commit` 命令可以提交多行信息，提交信息包括三个大部分：`header`、`body` 和 `footer`。

具体格式如下：

```
<type>(module:可选): <subject> //冒号后边有空格
// 空一行
<body>
// 空一行
<footer>
```

添加新功能示例：

```
feat(button): 添加xxx管理模块

添加xxx管理模块，具体包括.....
```

修复BUG示例：

```
fix(button): 修复xxxxBUG

修复由xxxx引起的BUG.....(具体描述), fixed #xxxxxx
```

### Header——必须

`header` 包括以下两个字段：

`type` 用于说明提交信息的类别，只允许使用以下10个标识。

1. `feat`:  新功能
2. `fix`:  修复BUG
3. `improvement`:  对当前功能的改进
4. `docs`:  仅仅文档修改
5. `style`:  不影响代码的改变，例如：空格、格式
6. `refactor`:  重构，既不修复错误也不添加功能的代码更改
7. `pref`:  提高性能的代码更改
8. `build`:  影响生成系统或外部依赖项的更改（示例范围：gulp、broccoli、npm）
9. `chore`:  不修改src或测试文件的其他更改
10. `revert`:  还原以前的提交

`subject` 是 commit 目的的简短描述，不超过50个字符。

Header示例：

```
feat(button): 添加xxx管理模块

fix(button): 修复xxxxBUG，fixed #xxxxxxx

docs(button): 修改/添加xxxx文档
```

### Body——非必须

Body 部分是对本次提交的详细描述，应该说明代码变动的动机，以及与以前行为的对比，可以分成多行，华为云上有 Task 和 Bug 的功能，在 \<subject\> 或者 \<body\> 中可以添加 `fixed #xxxxxxx` ，用以将本次提交指向某个Task或者Bug。

Body示例：

```
具体详细的描述....

在描述中还可以使用无序列表，如下
- 修改1
- 修改2
- fixed #xxxxxxx
```

### Footer——非必须

只有在出现**不兼容变动**的情况下才写Footer。

如果当前代码与上一个版本不兼容，则 Footer 部分以`BREAKING CHANGE`开头，后面是对变动的描述、以及变动理由和迁移方法。

```
BREAKING CHANGE: 隔离作用域绑定定义已更改。

  要迁移代码，请遵循以下示例：

  之前:

  scope: {
    myAttr: 'attribute',
  }

  之后:

  scope: {
    myAttr: '@',
  }

  删除的“inject”通常对指令没有用处，因此不应该有代码使用它。
```

### Revert——特殊*

还有一种特殊情况，如果本次提交用于撤销以前的提交，则必须以 `revert:` 开头，后面跟着被撤销的提交信息的 Header。

```
revert: feat(button): 添加xxxxx功能

This reverts commit 667ecc1654a317a13331b17617d973392f415f02.
```

Body部分的格式是**固定的**，必须写成 `This reverts commit hash.` ，其中的 `hash` 是被撤销 commit 的 SHA 标识符。