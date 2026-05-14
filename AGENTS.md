# Thyme UI — AGENTS.md

## Build
```bash
node build.js              # outputs docs/thyme@<version>.js via terser
```

## Architecture
- Pure Web Components (Custom Elements + Shadow DOM), zero dependencies
- Components in `src/components/th-xxx.js`, CSS in `src/styles/th-xxx.css`
- All components inherit `Component` base class (`src/core/Component.js`)
- `customElements.define` in `src/main.js` only — component files never register themselves
- Hook methods: `_template()`, `_init()`, `_attrChanged(name, value)`, `_cleanup()`
- `Component.$()` for `this._shadow.querySelector()`
- `_rerender()` wipes shadow DOM entirely and re-runs `_template()`/`_init()`

## Build ordering (import/export stripped, concatenation = dependency graph)
1. `src/core/utils.js` → `locale.js` → `form.js` → `http.js` → `Component.js`
2. All `src/components/th-*.js`
3. `src/main.js` (last — uses everything above)

New component/CSS files must be added to both `build.js` component loop and `main.js` imports + `customElements.define()`.

## Global access
- `self.Thyme` (not `const Thyme`) — accessible across `<script>` tags
- `Thyme.locale = 'en'|'zh'` — switches via getter/setter, backend `locale.setLang()`
- `Thyme.alert(msg, title?)` / `Thyme.confirm(msg, title?) → Promise<boolean>` — uses `th-dialog`
- `Thyme.info/warn/error/success(msg, duration?)` — uses `th-toast`, auto-repositions via `_repositionToasts()` array
- Toast `close` event drives repositioning; each `<th-toast>` is `position: fixed`, no container div

## CSS & theming
- Global `:root{--th-primary:#3730a3;--th-radius:8px;--th-font-size:14px;--th-line-height:1.5}` injected once by `main.js`
- Set `--th-primary` on any ancestor to theme all components — custom properties inherit through Shadow DOM
- Each component CSS begins with `*,*::before,*::after{box-sizing:border-box}` (Shadow DOM isolates box-sizing)
- Derived colors via `color-mix()`; no fallback in `var()` — global `:root` default cascades through shadow boundaries

## Component conventions
- Expose native-like `.value`, `.name`, `.checked`, `.type` properties for uniform form handling
- Date format: `yyyy-mm-dd` throughout
- `th-button`: default variant `"filled"` (not `tonal`); supports `size="small"`/no attr(medium)/`"large"`; `slot="icon"` with auto icon-only detection
- `locale.translate(key)` (renamed from old `.t()`); `Thyme.http.delete` (renamed from old `del()`)
