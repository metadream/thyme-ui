# Thyme UI

A lightweight UI component library built with native Web Components, zero dependencies.

> [https://metadream.github.io/thyme-ui](https://metadream.github.io/thyme-ui) — live demo

## Features

- **Pure native** — Custom Elements + Shadow DOM, no framework lock-in
- **Single-file output** — One JS file after build, drop in via `<script>` tag
- **Style isolation** — Shadow DOM scopes styles, no interference between components
- **Theme color** — `--th-primary` CSS variable for one-click color switching
- **i18n** — Built-in `en` / `zh` toggle

## Usage

### CDN

```html
<script src="https://unpkg.com/@metadream/thyme-ui"></script>

<th-button>Button</th-button>
<th-button variant="tonal">Tonal</th-button>
<th-button variant="outlined">Outlined</th-button>
<th-button variant="ghost">Ghost</th-button>
```

### Custom theme color

Set on `:root` or any ancestor element:

```css
:root {
    --th-primary: #dc2626;
}
```

All derived colors (hover, border, ripple, etc.) are computed automatically via `color-mix()`.

## Components

| Component | Description | Key attributes |
|-----------|-------------|----------------|
| `th-button` | Button | `variant="filled\|tonal\|outlined\|ghost"` `size="small\|large"` `loading` `slot="icon"` |
| `th-field` | Input / Date picker | `type="text\|email\|number\|date\|textarea"` `label` `error` |
| `th-switch` | Switch | `checked` `disabled` |
| `th-check` | Checkbox / Radio | `type="checkbox\|radio"` `checked` `name` `value` |
| `th-select` | Select dropdown | `label` `value` `placeholder` `<option>` children |
| `th-dialog` | Dialog | `title` `closable` `open()` `close()` |
| `th-toast` | Toast notification | `type="info\|warn\|error\|success"` `duration` `close()` |

## Global API

| API | Description |
|-----|-------------|
| `Thyme.alert(msg, title?)` | Alert dialog |
| `Thyme.confirm(msg, title?) → Promise` | Confirm dialog |
| `Thyme.info / warn / error / success(msg, duration?)` | Toast notification |
| `Thyme.locale = 'en' \| 'zh'` | Toggle language |
| `Thyme.form.getJsonObject(scope)` | Serialize form to object |
| `Thyme.form.getJsonArray(scopes)` | Serialize multiple forms |
| `Thyme.form.setJsonObject(scope, data)` | Populate form from object |
| `Thyme.http.get / post / put / patch / delete` | HTTP client |
| `Thyme.utils.delay / nanoId / formatDate / formatMoney / ...` | Utility functions |

## Build

```bash
npm install        # installs terser
npm run build      # outputs docs/thyme.min.js
```

## Adding a new component

1. `src/components/th-xxx.js` — implement component (extend `Component`)
2. `src/styles/th-xxx.css` — write styles
3. `src/main.js` — import + `customElements.define`
4. `build.js` — add filename to component list

Component registration is centralized in `main.js`; component files never call `define` themselves.

## Browser support

Chrome 111+ / Firefox 113+ / Safari 16.2+ / Edge 111+.

Requires `color-mix()`. IE is not supported.

## License

MIT
