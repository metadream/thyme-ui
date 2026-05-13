# Thyme UI

基于原生 Web Components 的轻量级 UI 组件库，零第三方依赖。

## 特点

- **纯原生** — 使用 Web Components 标准（Custom Elements + Shadow DOM），无任何第三方依赖
- **单文件输出** — 构建后生成一个 JS 文件，浏览器直接 `<script>` 引入即可使用
- **样式隔离** — Shadow DOM 天然隔离样式，外部不影响内部
- **可定制主题** — 通过 CSS 自定义属性 `--th-primary` 一键换色
- **易扩展** — 继承基础 `Component` 类即可添加新组件

## 目录结构

```
src/
├── core/
│   ├── Component.js      # 组件基类
│   └── utils.js           # 工具函数（涟漪效果等）
├── components/
│   └── th-button/         # 每个组件独立目录
│       ├── index.js       # 组件实现
│       └── styles.css     # 组件样式
├── build.js               # 构建脚本
└── dist/
    └── thyme@<version>.js  # 构建产物（单文件）
```

## 使用

### 快速开始

```html
<script src="path/to/thyme@0.1.0.js"></script>

<th-button variant="tonal">按钮</th-button>
<th-button variant="outlined">边框按钮</th-button>
```

### th-button 组件

#### 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `variant` | `tonal` / `outlined` | `tonal` | 按钮样式变体 |
| `href` | URL | — | 设置后渲染为 `<a>` 标签 |
| `target` | `_blank` / `_self` 等 | — | 仅当 `href` 存在时生效 |
| `loading` | boolean | — | 显示加载动画，同时禁用交互 |
| `disabled` | boolean | — | 禁用按钮 |
| `type` | `button` / `submit` / `reset` | — | 仅按钮模式生效 |
| `name` / `value` | string | — | 表单字段名/值 |
| `autofocus` | boolean | — | 自动聚焦 |
| `form` | string | — | 关联表单 ID |
| `rel` / `download` | string | — | 仅链接模式生效 |

#### 变体

- **tonal**（默认）：浅色填充背景 + 主色文字
- **outlined**：透明背景 + 主色边框 + 主色文字

```html
<th-button variant="tonal">填充按钮</th-button>
<th-button variant="outlined">边框按钮</th-button>
```

#### 链接模式

当设置 `href` 属性时，自动渲染为 `<a>` 标签，支持原生链接行为（右键打开、新标签页等）。

```html
<th-button href="https://example.com" target="_blank">打开链接</th-button>
```

#### 加载状态

```html
<th-button loading>加载中...</th-button>
```

通过 JavaScript 动态控制：

```js
btn.setAttribute('loading', '');
btn.removeAttribute('loading');
```

#### 涟漪效果

点击按钮时产生从点击位置扩散的涟漪动画，加载状态下自动禁用。

#### 自定义主题色

通过 CSS 变量 `--th-primary` 一键更改主色：

```css
/* 全局修改 */
:root {
    --th-primary: #dc2626;
}

/* 或单个按钮修改 */
th-button.custom-red {
    --th-primary: #dc2626;
}

/* 或内联样式 */
<th-button style="--th-primary: #15803d">绿色按钮</th-button>
```

所有派生颜色（悬停、激活、边框、涟漪等）均由 `color-mix()` 自动计算，无需额外设置。

#### 事件

事件通过 Shadow DOM 自然冒泡，使用标准 `addEventListener`：

```js
document.querySelector('th-button').addEventListener('click', () => {
    console.log('按钮点击');
});
```

#### 完整示例

```html
<!-- 基础填充按钮 -->
<th-button>默认按钮</th-button>

<!-- 边框按钮 -->
<th-button variant="outlined">边框按钮</th-button>

<!-- 禁用状态 -->
<th-button disabled>禁用按钮</th-button>

<!-- 加载状态 -->
<th-button loading>加载中</th-button>

<!-- 链接模式 -->
<th-button href="https://example.com" target="_blank">链接</th-button>

<!-- 自定义颜色 -->
<th-button style="--th-primary: #7c3aed">紫色按钮</th-button>

<!-- 带图标 -->
<th-button>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
    箭头按钮
</th-button>
```

## 开发

### 构建

```bash
node build.js
```

输出到 `dist/thyme@<version>.js`。

### 添加新组件

1. 在 `src/components/` 下创建 `th-组件名/` 目录
2. 编写 `styles.css`（组件样式）
3. 编写 `index.js`，继承 `Component` 基类：

```js
import { Component } from '../../core/Component.js';
import css from './styles.css';

export class ThXxx extends Component {
    static get _observedAttrs() { return ['attr1', 'attr2']; }

    _template() {
        return `<div class="th-xxx">...</div>`;
    }

    _init() {
        // 初始化逻辑
    }
}

ThXxx.__css__ = css;

if (!customElements.get('th-xxx')) {
    customElements.define('th-xxx', ThXxx);
}
```

4. 将组件名加入 `build.js` 的组件列表
5. 执行 `node build.js`

## 兼容性

- Chrome 111+
- Firefox 113+
- Safari 16.2+
- Edge 111+

依赖 `color-mix()` CSS 函数，不支持 IE。
