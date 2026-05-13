# 项目约定

## 技术选型
- 纯原生 JS Web Components（Custom Elements + Shadow DOM），零第三方依赖
- 构建工具：Node.js 内置模块（`fs`、`path`）+ terser（dev 依赖）
- 最终产出 `dist/thyme-ui.js`，浏览器直接 `<script>` 引入

## 目录结构
```
src/
  core/             # 基类与工具函数
    Component.js    # 组件基类（所有组件继承它）
    utils.js        # 工具函数（涟漪效果等）
  components/       # 每个组件独立目录
    th-xxx/
      index.js      # 组件实现
      styles.css    # 组件样式
build.js            # 构建脚本（CSS 内联 + import/export 剥离 + 压缩）
dist/
  thyme-ui.js       # 单文件产出
```

## 组件规范
- 所有组件以 `th-` 前缀命名，使用 `customElements.define` 注册
- 每个组件独立目录，含 `index.js` + `styles.css`
- 继承 `Component` 基类，实现 `_template()`、`_init()`、`_attrChanged()` 等钩子
- 使用 Shadow DOM 隔离样式
- 样式通过 `import xxxCss from './styles.css'` 引入（每个组件使用唯一变量名避免冲突），构建时自动内联
- `static get __css__()` 返回 css，基类 `_render()` 将其注入 `<style>`

## th-button 组件

### 支持的属性
- `variant` — `tonal`（默认）| `outlined`
- `href` — 设置后渲染为 `<a>` 标签
- `target` — 仅链接模式生效
- `loading` — boolean，显示加载动画并禁用交互
- `disabled`、`type`、`name`、`value`、`form`、`autofocus`、`rel`、`download`

### 样式
- 圆角 8px，边框 1.5px solid transparent（所有变体统一占位）
- 过渡效果：`background-color 0.2s, border-color 0.2s`
- 颜色通过 CSS 变量 `--th-primary` 控制，其余用 `color-mix()` 自动派生
- 涟漪效果使用 `utils.ripple()`

## th-field 组件

### 功能
- 包含 label + input/textarea 的完整表单字段
- 支持原生所有 input 类型，以及多行文本（`type="textarea"`）
- 支持 HTML5 约束验证 + 自定义错误信息
- 支持通过插槽放置自定义内容（如 radio、checkbox 等），替换默认输入框

### 支持的属性
- `label` — 字段标签文字，也可用 `<span slot="label">` 插槽传入富文本
- `type` — `text`（默认）| `password` | `email` | `url` | `number` | `textarea` 等
- `rows` — textarea 的行数（默认 3）
- `value` — 当前值（get/set 均可用）
- `name`、`placeholder`、`required`、`disabled`、`readonly`
- `minlength`、`maxlength`、`min`、`max`、`pattern`
- `autocomplete`、`autofocus`
- `error` — 手动设置错误信息

### 方法
- `checkValidity()` — 返回有效性布尔值
- `reportValidity()` — 检查并显示错误信息
- `setCustomValidity(msg)` — 设置/清除自定义错误

### 事件
- 所有原生 input 事件（`input`、`change`、`blur`、`focus` 等）通过 Shadow DOM 自然冒泡

### 颜色共享
- 使用与 `th-button` 相同的 `--th-primary` CSS 变量，在父元素上统一设置即可同时改变两者颜色

### 自定义内容
- 在 `<th-field>` 标签内放入任意元素，将替换默认输入框（label 和错误提示仍保留）
- 适合放置 radio、checkbox、select、color picker 等非标准输入

### 示例
```html
<!-- 基本用法 -->
<th-field label="姓名" required placeholder="请输入姓名"></th-field>
<th-field label="邮箱" type="email" value="a@b"></th-field>
<th-field label="简介" type="textarea" rows="4"></th-field>

<!-- 自定义内容 -->
<th-field label="性别">
    <label><input type="radio" name="g" value="男"> 男</label>
    <label><input type="radio" name="g" value="女"> 女</label>
</th-field>

<!-- 共享颜色 -->
<div style="--th-primary:#7c3aed">
    <th-button variant="tonal">按钮</th-button>
    <th-field label="输入框"></th-field>
</div>
```

## th-switch 组件

### 功能
- iOS 风格切换开关，滑动切换开/关状态
- 支持无障碍访问（`role="switch"` + `aria-checked` + 键盘操作）

### 支持的属性
- `checked` — boolean，开关状态
- `disabled` — boolean，禁用交互

### 事件
- `change` — 切换时触发，`event.detail.checked` 为当前状态

### 示例
```html
<th-switch checked></th-switch>
<th-switch></th-switch>
<th-switch disabled></th-switch>

<div style="--th-primary:#7c3aed">
    <th-switch checked></th-switch>
</div>
```

## 全局通用规则
- `--th-primary`、`border-radius` 是所有组件共用的 CSS 变量/BEM 惯例
- 所有单行（单行）组件的高度保持一致，为 `38px`（含 border）
  - 当前：th-button、th-field（非 textarea）、th-switch 均按此值对齐

## 构建命令
```bash
node build.js
```
构建过程：
1. 解析 CSS 的 `import`，内联为 `const` 变量
2. 剥离 `import` / `export` 语句
3. 按依赖顺序拼接（utils → Component → 组件）
4. 用 terser 压缩（变量重命名 + 死代码消除 + 注释剥离）
