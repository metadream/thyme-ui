# Thyme UI

A lightweight UI component library built with native Web Components (Custom Elements + Shadow DOM), zero third-party dependencies.

> [https://metadream.github.io/thyme-ui](https://metadream.github.io/thyme-ui) — live demo

## Installation

### CDN (recommended)

```html
<script src="https://unpkg.com/@metadream/thyme-ui"></script>
```

This single script registers all components and exposes the `Thyme` global API.

### Build from source

```bash
npm install        # installs terser
npm run build      # outputs docs/thyme.min.js
```

---

## Components

All components follow these conventions:
- Native-like `.value`, `.name`, `.checked`, `.type` properties for uniform form handling
- Date format: `yyyy-mm-dd` throughout
- Attributes are reactive — changes after render are reflected automatically

---

### `<th-button>`

A button with four visual variants, loading state, ripple effect, and optional link mode.

#### Attributes

| Attribute  | Type      | Default    | Description |
|------------|-----------|------------|-------------|
| `variant`  | string    | `"filled"` | One of: `filled`, `tonal`, `outlined`, `ghost` |
| `size`     | string    | —          | `"small"`, `"large"`, or omit for medium |
| `disabled` | boolean   | —          | Disables the button |
| `loading`  | boolean   | —          | Shows spinner, disables interaction |
| `href`     | string    | —          | When set, renders an `<a>` instead of `<button>` |
| `target`   | string    | —          | Link target (only when `href` is set) |
| `rel`      | string    | —          | Link rel (only when `href` is set) |
| `download` | string    | —          | Link download (only when `href` is set) |
| `type`     | string    | —          | Button type attribute (`"submit"`, `"reset"`, `"button"`) |
| `name`     | string    | —          | Button name |
| `value`    | string    | —          | Button value |
| `form`     | string    | —          | Associated form ID |
| `autofocus`| boolean   | —          | Auto-focus on mount |

#### Slots

| Slot    | Description |
|---------|-------------|
| default | Button label text |
| `"icon"`| Icon element. When only icon is present (no text), the button renders as a square icon-only button |

#### CSS Shadow Parts

| Part      | Element |
|-----------|---------|
| `button`  | The inner `<button>` or `<a>` |
| `content` | `<span>` wrapping the slots |
| `loader`  | Loading spinner `<span>` |

#### Examples

```html
<th-button>Filled</th-button>
<th-button variant="tonal">Tonal</th-button>
<th-button variant="outlined">Outlined</th-button>
<th-button variant="ghost">Ghost</th-button>

<th-button size="small">Small</th-button>
<th-button size="large">Large</th-button>

<th-button loading>Saving...</th-button>
<th-button disabled>Disabled</th-button>

<!-- Link mode -->
<th-button href="https://example.com" target="_blank">Link</th-button>

<!-- Icon-only -->
<th-button><svg slot="icon">...</svg></th-button>
```

---

### `<th-field>`

A form field with label, input/textarea/date picker, built-in validation, and error display.

#### Attributes

| Attribute      | Type      | Default   | Description |
|----------------|-----------|-----------|-------------|
| `label`        | string    | —         | Field label text |
| `type`         | string    | `"text"`  | One of: `text`, `email`, `number`, `date`, `textarea` |
| `value`        | string    | —         | Current input value |
| `name`         | string    | —         | Field name for form serialization |
| `placeholder`  | string    | —         | Placeholder text |
| `required`     | boolean   | —         | Marks as required (shows `*` in label) |
| `disabled`     | boolean   | —         | Disables the input |
| `readonly`     | boolean   | —         | Makes input read-only |
| `minlength`    | number    | —         | Minimum text length |
| `maxlength`    | number    | —         | Maximum text length |
| `rows`         | number    | `3`       | Textarea row count (only when `type="textarea"`) |
| `fill`         | boolean   | —         | Fixed height mode (only when `type="textarea"`): fills the parent container height and scrolls internally when content overflows. Without it the textarea auto-expands with no scrollbar |
| `min`          | string    | —         | Minimum value (for `number`/`date` types) |
| `max`          | string    | —         | Maximum value (for `number`/`date` types) |
| `pattern`      | string    | —         | Regex pattern for validation |
| `autocomplete` | string    | —         | Autocomplete hint |
| `autofocus`    | boolean   | —         | Auto-focus on mount |
| `error`        | string    | —         | Sets an error message (overrides validation). Remove attr to clear |

**Note:** When `type="date"`, the built-in input is `type="text"` with `maxlength="10"` (for `yyyy-mm-dd` format) and a custom calendar popup. Validation checks the date format, real date existence, and optional `min`/`max` constraints.

#### Properties

| Property | Type    | Get/Set | Description |
|----------|---------|---------|-------------|
| `.value` | string  | get/set | Current input value |
| `.name`  | string  | get     | Field name attribute |
| `.disabled` | boolean | get/set | Whether the field is disabled |
| `.readonly` | boolean | get/set | Whether the field is read-only |
| `.required` | boolean | get/set | Whether the field is required |

#### Methods

| Method                        | Returns  | Description |
|-------------------------------|----------|-------------|
| `.checkValidity()`            | boolean  | Returns whether the input passes validation |
| `.reportValidity()`           | boolean  | Checks validity and shows error message if invalid |
| `.setCustomValidity(msg)`     | void     | Sets a custom validation error. Pass empty string to clear |
| `.focus()`                    | void     | Focuses the inner input/textarea |

#### Events (native, delegated from inner `<input>`/`<textarea>`)

| Event    | Description |
|----------|-------------|
| `input`  | Fires on every value change (bubbles) |
| `change` | Fires when value is committed (bubbles) |
| `invalid`| Fires when validation fails |

#### Slots

| Slot     | Description |
|----------|-------------|
| default  | Replaces the built-in `<input>`/`<textarea>` with a custom element (the custom element must have `.value` and support the expected attributes). When `type="textarea"`, light DOM text content is consumed as the initial value |
| `"label"`| Replaces the label text |

#### CSS Shadow Parts

| Part        | Element |
|-------------|---------|
| `field`     | Outer container |
| `label`     | `<label>` element |
| `input`     | The `<input>` or `<textarea>` |
| `error`     | Error tooltip `<span>` |
| `date-btn`  | Calendar toggle button (only when `type="date"`) |
| `calendar`  | Date picker popup (only when `type="date"`) |

#### Examples

```html
<!-- Text input -->
<th-field label="Name" name="username" placeholder="Enter your name"></th-field>

<!-- Email with validation -->
<th-field label="Email" type="email" name="email" required></th-field>

<!-- Number -->
<th-field label="Age" type="number" name="age" min="0" max="150"></th-field>

<!-- Date picker -->
<th-field label="Date" type="date" name="date"></th-field>

<!-- Textarea with slot content consumed as initial value -->
<th-field label="Bio" type="textarea" name="bio" rows="5">
  <p>Existing content</p>
</th-field>

<!-- Pre-filled value -->
<th-field label="City" value="Shanghai"></th-field>

<!-- With error -->
<th-field label="Password" type="password" error="Too short"></th-field>

<!-- Disabled -->
<th-field label="Readonly" value="Immutable" disabled></th-field>

<!-- Using slot for label -->
<th-field name="email">
    <span slot="label">Email Address</span>
</th-field>
```

---

### `<th-check>`

Checkbox or radio button with custom styling.

#### Attributes

| Attribute  | Type      | Default      | Description |
|------------|-----------|--------------|-------------|
| `type`     | string    | `"checkbox"` | Either `"checkbox"` or `"radio"` |
| `checked`  | boolean   | —            | Whether the element is checked |
| `disabled` | boolean   | —            | Disables interaction |
| `name`     | string    | —            | Group name (radio buttons with same name auto-uncheck each other) |
| `value`    | string    | —            | Value submitted with form |

#### Properties

| Property   | Type    | Get/Set | Description |
|------------|---------|---------|-------------|
| `.checked` | boolean | get/set | Checked state |
| `.disabled`| boolean | get     | Disabled state |
| `.type`    | string  | get     | `"checkbox"` or `"radio"` |
| `.name`    | string  | get     | Name attribute |
| `.value`   | string  | get     | Value attribute |

#### Events

| Event    | Detail                          | Description |
|----------|---------------------------------|-------------|
| `change` | `{ checked: boolean, value: string }` | Fires on toggle (bubbles) |

#### Slots

| Slot    | Description |
|---------|-------------|
| default | Label text displayed next to the indicator |

#### Examples

```html
<th-check checked>Remember me</th-check>
<th-check type="radio" name="gender" value="male">Male</th-check>
<th-check type="radio" name="gender" value="female">Female</th-check>
<th-check disabled>Disabled</th-check>

<!-- Programmatic -->
<script>
    const cb = document.querySelector('th-check');
    cb.checked = true;
    cb.addEventListener('change', (e) => console.log(e.detail));
</script>
```

---

### `<th-switch>`

A toggle switch.

#### Attributes

| Attribute  | Type      | Description |
|------------|-----------|-------------|
| `checked`  | boolean   | Toggle state |
| `disabled` | boolean   | Disables interaction |
| `value`    | string    | Value returned when checked |

#### Properties

| Property   | Type          | Get/Set | Description |
|------------|---------------|---------|-------------|
| `.checked` | boolean       | get/set | Toggle state |
| `.disabled`| boolean       | get     | Disabled state |
| `.value`   | string\|number | get     | Returns attribute `value` or `1` when checked, `undefined` when unchecked |

#### Events

| Event    | Detail                    | Description |
|----------|---------------------------|-------------|
| `change` | `{ checked: boolean }`    | Fires on toggle (bubbles) |

#### Examples

```html
<th-switch checked>Notifications</th-switch>
<th-switch disabled>Unavailable</th-switch>
```

---

### `<th-select>`

A custom select dropdown built from `<option>` children.

#### Attributes

| Attribute     | Type      | Description |
|---------------|-----------|-------------|
| `label`       | string    | Label text shown to the left |
| `value`       | string    | Currently selected value |
| `placeholder` | string    | Placeholder text when no option is selected |
| `disabled`    | boolean   | Disables the select |
| `name`        | string    | Field name for form serialization |
| `required`    | boolean   | Marks as required |

#### Properties

| Property   | Type    | Get/Set | Description |
|------------|---------|---------|-------------|
| `.value`   | string  | get/set | Currently selected value |
| `.disabled`| boolean | get/set | Disabled state |
| `.name`    | string  | get     | Name attribute |
| `.checkValidity()` | boolean | — | Returns whether validation passes |
| `.reportValidity()`| boolean | — | Checks validity and shows error if invalid |
| `.focus()` | void | — | Focuses the trigger element |

#### Events

| Event    | Detail                          | Description |
|----------|---------------------------------|-------------|
| `change` | `{ value: string, text: string }` | Fires when an option is selected (bubbles) |

#### Children

Uses standard `<option>` elements:

```html
<option value="cn">China</option>
<option value="us" selected>United States</option>
```

The `selected` attribute on an `<option>` sets the initial value.

#### CSS Shadow Parts

| Part      | Element |
|-----------|---------|
| `select`  | Outer container |
| `label`   | `<label>` element |
| `trigger` | Clickable trigger bar |
| `value`   | Value display `<span>` |
| `panel`   | Dropdown panel |
| `error`   | Error message `<span>` |

#### Keyboard navigation

| Key            | Action |
|----------------|--------|
| Enter / Space  | Open dropdown, or confirm highlighted option |
| Escape         | Close dropdown |
| ArrowDown      | Highlight next option (opens if closed) |
| ArrowUp        | Highlight previous option (opens if closed) |

#### Examples

```html
<th-select label="Country" name="country">
    <option value="cn">China</option>
    <option value="us" selected>United States</option>
    <option value="jp">Japan</option>
</th-select>

<!-- With placeholder -->
<th-select label="City" placeholder="Select a city...">
    <option value="shanghai">Shanghai</option>
    <option value="beijing">Beijing</option>
</th-select>

<!-- Programmatic -->
<script>
    const sel = document.querySelector('th-select');
    sel.value = 'jp';
    console.log(sel.value); // 'jp'
    sel.addEventListener('change', (e) => console.log(e.detail));
</script>
```

---

### `<th-dialog>`

A modal dialog with overlay, title, body, and footer slot.

#### Attributes

| Attribute  | Type      | Default | Description |
|------------|-----------|---------|-------------|
| `open`     | boolean   | —       | Whether the dialog is visible |
| `title`    | string    | —       | Dialog title text |
| `closable` | boolean   | `true`  | Whether Escape key can close the dialog |
| `width`    | number    | —       | Fixed dialog width in pixels (overrides CSS default) |

#### Methods

| Method   | Description |
|----------|-------------|
| `.open()`  | Opens the dialog (sets `open` attribute) |
| `.close()` | Closes the dialog with animation (removes `open` attribute) |

#### Slots

| Slot      | Description |
|-----------|-------------|
| default   | Dialog body content |
| `"footer"`| Footer buttons. When empty, the footer is hidden. Buttons are styled automatically |

#### CSS Shadow Parts

| Part      | Element |
|-----------|---------|
| `overlay` | Fixed full-screen overlay |
| `dialog`  | Dialog panel |
| `title`   | Title bar |
| `body`    | Body content area |
| `footer`  | Footer area |

#### Behavior

- Body scroll is prevented while open (wheel + touchmove)
- Escape key closes the dialog (unless `closable="false"`)
- Clicking the overlay does NOT close the dialog

#### Examples

```html
<th-dialog id="myDialog" title="Confirm">
    <p>Are you sure?</p>
    <button slot="footer">OK</button>
    <button slot="footer">Cancel</button>
</th-dialog>

<script>
    document.querySelector('#myDialog').open();
</script>
```

---

### `<th-toast>`

A fixed-position toast notification. Auto-removes after a duration. Only one toast is shown at a time — a new toast replaces the current one.

#### Attributes

| Attribute  | Type    | Default | Description |
|------------|---------|---------|-------------|
| `type`     | string  | `"info"`| One of: `info`, `warn`, `error`, `success` |
| `duration` | number  | `8`     | Display duration in seconds |

#### Methods

| Method   | Description |
|----------|-------------|
| `.close()` | Closes the toast immediately and dispatches a `close` event |

#### Events

| Event   | Detail | Description |
|---------|--------|-------------|
| `close` | —      | Dispatched when the toast is closed (bubbles) |

#### Slots

| Slot    | Description |
|---------|-------------|
| default | Toast message text |

#### CSS Shadow Parts

| Part   | Element |
|--------|---------|
| `toast`| The toast `<div>` |

#### Styling

| Type      | Background        | Text   |
|-----------|-------------------|--------|
| `info`    | Dark gray (80%)   | White  |
| `warn`    | Yellow (80%)      | Dark   |
| `error`   | Red (80%)         | White  |
| `success` | Green (80%)       | White  |

#### Examples

```html
<th-toast type="success">Saved successfully!</th-toast>
<th-toast type="error" duration="5">Connection failed</th-toast>
```

---

## Global API (`self.Thyme`)

After the script loads, `Thyme` is available globally.

### Dialogs

```js
Thyme.alert('Hello World');
Thyme.alert('File deleted', 'Warning');

// Returns Promise<boolean>
const ok = await Thyme.confirm('Delete this item?');
if (ok) { /* proceed */ }
```

### Toast notifications

```js
Thyme.info('Loading...');
Thyme.success('Done!', 2);           // 2 seconds
Thyme.warn('Low disk space', 5);     // 5 seconds
Thyme.error('Something broke', 10);  // 10 seconds
```

### Locale / i18n

```js
Thyme.locale = 'zh';  // switch to Chinese
Thyme.locale = 'en';  // switch to English
```

### Form utilities

```js
// Serialize a form scope to an object.
// Returns null if ANY field fails checkValidity() — the first
// invalid field receives focus and shows its error message.
const data = Thyme.form.getJsonObject('#my-form');
// or pass an element:
const data = Thyme.form.getJsonObject(document.querySelector('#my-form'));

// Serialize multiple form scopes to an array.
// Returns null if ANY scope's validation fails.
const all = Thyme.form.getJsonArray('.form-scope');
// or pass a NodeList:
const all = Thyme.form.getJsonArray(document.querySelectorAll('.form-scope'));

// Populate a form from an object
Thyme.form.setJsonObject('#my-form', { username: 'admin', age: 25 });

// Typical submit guard:
const data = Thyme.form.getJsonObject('#my-form');
if (data === null) return;  // validation failed, already focused
await fetch('/api/submit', { method: 'POST', body: JSON.stringify(data) });
```

**Rules** for serialization (`getJsonObject` / `getJsonArray`):
- Only elements with a `name` attribute are included
- Unchecked checkboxes / radio buttons / switches are skipped
- Checkboxes with the same `name` or `<select multiple>` are collected into an array
- `contentEditable` elements use trimmed `innerHTML`
- User-input elements (native `<input>`/`<textarea>`, `<th-field>`) have their value trimmed and written back to the element
- Selection elements (`<select>`, `<th-select>`, `<th-check>`, `<th-switch>`, radio buttons) are stored as-is
- On any `checkValidity()` failure, `getJsonObject` returns `null` immediately — the first invalid field is focused and shows its error

`setJsonObject` populates elements by matching `[name]` attributes. Handles all the same element types including `<select multiple>`, checkbox arrays, radio groups, and contentEditable.

### HTTP client

`Thyme.http` wraps `fetch()` with JSON handling, response type detection, and error reporting.

#### Methods

```js
const data   = await Thyme.http.get(url, opts?)
const data   = await Thyme.http.post(url, data?, opts?)
const data   = await Thyme.http.put(url, data?, opts?)
const data   = await Thyme.http.patch(url, data?, opts?)
const data   = await Thyme.http.delete(url, opts?)
```

#### Parameters

| Param  | Type     | Description |
|--------|----------|-------------|
| `url`  | string   | Request URL |
| `data` | any      | Request body. Plain objects/arrays are JSON-stringified automatically. `FormData`, `Blob`, `ArrayBuffer` sent as-is. Omit for `GET`/`DELETE` |
| `opts` | object   | Additional [fetch options](https://developer.mozilla.org/en-US/docs/Web/API/fetch) merged into the request (`signal`, `credentials`, custom `headers`, etc.) |

#### Examples

```js
// GET
const users = await Thyme.http.get('/api/users');

// POST with JSON body
const user = await Thyme.http.post('/api/users', { name: 'Alice' });

// PUT
await Thyme.http.put('/api/users/1', { name: 'Bob' });

// PATCH
await Thyme.http.patch('/api/users/1', { name: 'Bob' });

// DELETE
await Thyme.http.delete('/api/users/1');
```

#### Custom fetch options

Pass native `fetch()` options through the third argument:

```js
// Abort request
const controller = new AbortController();
Thyme.http.get('/api/search', { signal: controller.signal });
controller.abort();

// Custom headers (merged with defaults)
Thyme.http.post('/api/data', { foo: 1 }, {
    headers: { Authorization: 'Bearer xxx' }
});

// FormData (not JSON-stringified)
const form = new FormData();
form.append('file', file);
await Thyme.http.post('/api/upload', form);
```

#### Response types

The response body is parsed automatically based on `Content-Type`:

| Content-Type              | Parsed as      |
|---------------------------|----------------|
| `text/*`                  | `response.text()` |
| `application/json`        | `response.json()` |
| Everything else           | `response.blob()` |

Non-OK status codes (4xx/5xx) throw an `Error` with the parsed server message.

#### Error handling

```js
try {
    await Thyme.http.get('/api/data');
} catch (e) {
    console.error(e.message); // server error message or "Unknown error"
}
```

Errors are also passed to `Thyme.error()` automatically.

### Utility functions

```js
Thyme.utils.delay(1000);                // Promise that resolves after 1s

Thyme.utils.nanoId();                   // Random 24-char ID (0-9a-zA-Z)
Thyme.utils.nanoId(8);                  // Random 8-char ID

Thyme.utils.formatDate(new Date(), 'yyyy-MM-dd');              // "2026-05-15"
Thyme.utils.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');     // "2026-05-15 14:30:00"
Thyme.utils.formatDate(new Date(), 'MM/dd/yyyy', true);        // "05/15/2026" in UTC

Thyme.utils.formatDecimal(3.14159, 2);  // 3.14
Thyme.utils.formatMoney(1234567.89);    // "1,234,567.89"
Thyme.utils.formatBytes(1048576);       // "1 MiB"

Thyme.utils.parseDuration('01:30:00');  // 5400 (seconds)
Thyme.utils.formatSeconds(3661);        // "1h 1m 1s"

Thyme.utils.base64Encode('hello');      // "aGVsbG8="
```

---

## Theming

Set these CSS custom properties on any ancestor element — they inherit through Shadow DOM:

```css
:root {
    --th-primary: #3730a3;    /* Primary color, default: indigo-800 */
    --th-radius: 8px;         /* Border radius, default: 8px */
    --th-font-size: 14px;     /* Base font size */
    --th-line-height: 1.5;    /* Base line height */
}
```

All derived colors (hover, ripple, border, focus ring) are computed automatically from `--th-primary` via `color-mix()` — no additional variables needed.

### Styling via `::part()`

Each component exposes CSS shadow parts for granular styling:

```css
th-button::part(button) {
    font-weight: 700;
}
th-field::part(input) {
    font-family: monospace;
}
th-dialog::part(dialog) {
    max-width: 500px;
}
```

---

## Browser Support

Chrome 111+ / Firefox 128+ / Safari 16.2+ / Edge 111+.

Requires `@property` CSS at-rule and `color-mix()`. IE is not supported.

---

## Architecture (for contributors)

See [AGENTS.md](./AGENTS.md) for build process, file conventions, and internal architecture details.
