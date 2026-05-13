import { ThButton } from './components/th-button.js';
import { ThField } from './components/th-field.js';
import { ThSwitch } from './components/th-switch.js';
import { ThCheck } from './components/th-check.js';
import { ThSelect } from './components/th-select.js';
import { ThDialog } from './components/th-dialog.js';
import { methods } from './core/http.js';
import { getJsonData, setJsonData } from './core/form.js';

customElements.define('th-button', ThButton);
customElements.define('th-field', ThField);
customElements.define('th-switch', ThSwitch);
customElements.define('th-check', ThCheck);
customElements.define('th-select', ThSelect);
customElements.define('th-dialog', ThDialog);

self.Thyme = {
    form: { getJsonData, setJsonData },
    http: methods,
};
