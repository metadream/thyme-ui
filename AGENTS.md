# Thyme UI — AGENTS.md

## Build
```bash
node build.js              # outputs docs/thyme.min.js via terser
```
Rebuild after any change in `src/` before testing.

## Package
- `npm publish --access=public` (scoped package `@metadream/thyme-ui`)

## Architecture
- Pure Web Components (Custom Elements + Shadow DOM), zero dependencies
- Components in `src/components/th-xxx.js`, CSS in `src/styles/th-xxx.css`
- All components inherit `Component` base class (`src/core/Component.js`)
- `customElements.define` in `src/main.js` only — component files never register themselves
- `self.Thyme` (not `const Thyme`) — accessible across `<script>` tags

## Component base class (`Component.js`)
```js
export class Component extends HTMLElement {
    static get observedAttributes() { return this._observedAttrs || []; }
    // ...
}
```

### Lifecycle hooks (override in subclass)

| Hook | Called when | Purpose |
|------|-------------|---------|
| `_template()` → string | Once, on first render | Return HTML for shadow DOM |
| `_init()` | After `_template()` appends to shadow DOM | Query elements, add listeners |
| `_attrChanged(name, value)` | On attribute change (after first render) | React to attribute changes |
| `_cleanup()` | On `disconnectedCallback` | Remove global listeners, timers |

### Key methods

| Method | Description |
|--------|-------------|
| `$(sel)` | `this._shadow.querySelector(sel)` |
| `_rerender()` | Wipes shadow DOM, re-runs `_template()` + `_init()` |

### Observed attributes pattern
```js
static get _observedAttrs() { return ["attr1", "attr2"]; }
```
Set `_observedAttrs` as static getter — `Component.observedAttributes` delegates to it.

### CSS loading pattern
```js
import css from "../styles/th-xxx.css";

export class ThXxx extends Component {
    static get __css__() { return css; }
}
```
The `__css__` static getter for CSS is resolved at build time via `resolveCssImports()` in `build.js`. The build embeds the CSS into the JS bundle.

## Build ordering (import/export stripped, concatenation = dependency graph)
1. `src/core/utils.js` → `locale.js` → `form.js` → `http.js` → `Component.js`
2. All `src/components/th-*.js`
3. `src/main.js` (last — uses everything above)

### Build notes
- `import * as ns from './path'` → `resolveNamespaceImports()` in `build.js` scans the target file for exports and generates `const ns = { exp1, exp2, ... }`
- `import { x } from './path'` → stripped, relies on concatenation order for resolution
- `import css from './file.css'` → `resolveCssImports()` reads the CSS file, minifies it, wraps it in a template literal (`const name = \`...\``)
- Template literals in component files are minified (whitespace collapsed) by `minifyTemplateLiterals()`
- Final output is minified by terser with `toplevel: true`

## Adding a new component

1. `src/components/th-xxx.js` — extends `Component`, defines `__css__`, `_observedAttrs`, `_template()`, `_init()`
2. `src/styles/th-xxx.css` — BEM naming, starts with `*,*::before,*::after{box-sizing:border-box}`
3. **`src/main.js`** — add `import { ThXxx } from "./components/th-xxx.js"` + `customElements.define("th-xxx", ThXxx)`
4. **`build.js`** — add filename (without `.js`) to the component loop array
5. **`README.md`** — add component table row, API section, examples

Component registration is centralized in `main.js`; component files never call `define` themselves.

## CSS conventions

### Class naming (BEM-like)
- Block: `th-button`, `th-field`, `th-check`
- Element: `th-button__content`, `th-field__input`, `th-select__option`
- Modifier: `th-button--tonal`, `th-field--error`, `th-check--checked`
- CSS custom properties: `--th-primary`, `--th-radius`, `--th-font-size`, `--th-line-height`

### Shadow DOM parts
Expose `part="name"` on key elements for consumer `::part()` styling:
```html
<div class="th-button" part="button">
```

### Every component CSS file starts with:
```css
*,*::before,*::after{box-sizing:border-box}
```
Shadow DOM isolates box-sizing from the global page.

## Component conventions
- Expose native-like `.value`, `.name`, `.checked`, `.type` properties for uniform form handling
- Every observed attribute that is commonly set via JS (`disabled`, `loading`, `required`, `readonly`, etc.) must have `get`/`set` property pair delegated to `hasAttribute`/`setAttribute`/`removeAttribute` — JS property assignment does not trigger `attributeChangedCallback`
- Date format: `yyyy-mm-dd` throughout
- `th-button`: default variant `"filled"` (not `tonal`); supports `size="small"`/no attr(medium)/`"large"`; `slot="icon"` with auto icon-only detection; renders `<a>` when `href` attribute present
- `th-field`: `<input>`/`<textarea>` is rendered **outside** `<slot>` (not as fallback content) so `this._input` is always queryable; `_consumeSlotContent()` in `_init()` handles light DOM children — (a) custom form controls hide the built-in input, (b) `type="textarea"` extracts block-aware text as initial value then clears `innerHTML`, (c) other types ignore slot content; date type renders as `type="text"` internally with `maxlength="10"` plus a built-in calendar popup; exposes `.checkValidity()`, `.reportValidity()`, `.setCustomValidity(msg)`; `_validateValue(val)` handles required, date format/validity/min/max, and minlength/maxlength; `disabled`, `readonly`, `required` have `get`/`set` pairs; `error` attribute overrides validation
- `th-check` `type="radio"`: auto-unchecks same-name siblings via `document.querySelectorAll`; `change` event detail: `{ checked, value }`; `type` getter returns `"checkbox"` or `"radio"`
- `th-select`: reads `<option>` children declaratively (not via properties); keyboard navigation (arrows, enter, escape); `change` event detail: `{ value, text }`; `get type()` returns `"select-one"` for native-like form handling
- `th-dialog`: prevents body scroll while open (wheel + touchmove capture); Escape respects `closable` attribute; `.open()` and `.close()` methods
- `th-toast`: module-level `refs[]` array for auto-stacking with 55px gap; each toast is `position: fixed` with no container div; `close()` method dispatches `close` event; auto-removes after `duration` seconds (default 3)
- `locale.translate(key)` (renamed from old `.t()`); `Thyme.http.delete` (renamed from old `del()`)
- `Thyme.form` and `Thyme.utils` use `import * as` in `main.js`, resolved by `resolveNamespaceImports()` in `build.js`
- `Thyme.form.getJsonObject(scope)`: returns `null` if any field's `checkValidity()` fails; for user-input elements (`_isInput()` — `type` is not `"radio"`/`"select-one"` and no `checked` property), values are trimmed and written back to the element; `<select multiple>` collected as array alongside checkbox logic; `setJsonObject` is unchanged

## Theming
- CSS custom properties use `@property` registration with `initial-value` in `main.js` — no global `:root` injection
- Defaults apply only when no element has set the property; user styles always win
- Set `--th-primary` on any ancestor to theme all components — custom properties inherit through Shadow DOM
- Derived colors (hover, border, focus ring, ripple) via `color-mix(in srgb, var(--th-primary) X%, ...)`
