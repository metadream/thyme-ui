# Thyme UI

基于原生 Web Components 的轻量级 UI 组件库，零第三方依赖。

> [https://metadream.github.io/focal-thyme](https://metadream.github.io/focal-thyme) — 在线示例

## 特点

- **纯原生** — Custom Elements + Shadow DOM，无框架锁定
- **单文件输出** — 构建后一个 JS 文件，`<script>` 直引即可
- **样式隔离** — Shadow DOM 天然隔离，组件互不干扰
- **主题色** — `--th-primary` CSS 变量一键换色
- **国际化** — 内置 `en` / `zh` 切换

## 使用

### CDN

```html
<script src="https://unpkg.com/focal-thyme@0.1.0/docs/thyme.min.js"></script>

<th-button>按钮</th-button>
<th-button variant="tonal">辅助</th-button>
<th-button variant="outlined">边框</th-button>
<th-button variant="ghost">幽灵</th-button>
```

### 自定义主题色

全局或任意祖先元素设置：

```css
:root {
    --th-primary: #dc2626;
}
```

所有派生色（悬停、边框、涟漪等）由 `color-mix()` 自动计算。

## 组件

| 组件 | 说明 | 关键属性 |
|------|------|----------|
| `th-button` | 按钮 | `variant="filled\|tonal\|outlined\|ghost"` `size="small\|large"` `loading` `slot="icon"` |
| `th-field` | 输入框 / 日期选择 | `type="text\|email\|number\|date\|textarea"` `label` `error` |
| `th-switch` | 开关 | `checked` `disabled` |
| `th-check` | 复选框 / 单选 | `type="checkbox\|radio"` `checked` `name` `value` |
| `th-select` | 下拉选择 | `label` `value` `placeholder` `<option>` 子元素 |
| `th-dialog` | 对话框 | `title` `closable` `open()` `close()` |
| `th-toast` | 通知条 | `type="info\|warn\|error\|success"` `duration` `close()` |

## 全局 API

| API | 说明 |
|-----|------|
| `Thyme.alert(msg, title?)` | 提示框 |
| `Thyme.confirm(msg, title?) → Promise` | 确认框 |
| `Thyme.info / warn / error / success(msg, duration?)` | 通知条 |
| `Thyme.locale = 'en' \| 'zh'` | 切换语言 |
| `Thyme.form.getJsonObject(scope)` | 表单序列化 |
| `Thyme.form.getJsonArray(scopes)` | 多个表单序列化 |
| `Thyme.form.setJsonObject(scope, data)` | 填充表单 |
| `Thyme.http.get / post / put / patch / delete` | HTTP 请求 |
| `Thyme.utils.delay / nanoId / formatDate / formatMoney / ...` | 工具函数 |

## 构建

```bash
npm install        # 安装 terser
npm run build      # 输出 docs/thyme.min.js
```

## 添加新组件

1. `src/components/th-xxx.js` 编写组件（继承 `Component`）
2. `src/styles/th-xxx.css` 编写样式
3. `src/main.js` 导入 + `customElements.define`
4. `build.js` 组件列表加入新文件名

组件注册统一在 `main.js` 中完成，组件文件本身不调用 `define`。

## 兼容性

Chrome 111+ / Firefox 113+ / Safari 16.2+ / Edge 111+。

依赖 `color-mix()`，不支持 IE。

## License

MIT
