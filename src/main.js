import { ThButton } from './components/th-button.js';
import { ThField } from './components/th-field.js';
import { ThSwitch } from './components/th-switch.js';
import { ThCheck } from './components/th-check.js';
import { ThSelect } from './components/th-select.js';
import { ThDialog } from './components/th-dialog.js';
import { ThToast } from './components/th-toast.js';
import { methods } from './core/http.js';
import { getJsonData, setJsonData } from './core/form.js';
import { locale } from './core/locale.js';

document.head.appendChild(Object.assign(document.createElement('style'), {
    textContent: ':root{--th-primary:#3730a3;--th-radius:8px;--th-font-size:14px;--th-line-height:1.5}'
}));

customElements.define('th-button', ThButton);
customElements.define('th-field', ThField);
customElements.define('th-switch', ThSwitch);
customElements.define('th-check', ThCheck);
customElements.define('th-select', ThSelect);
customElements.define('th-dialog', ThDialog);
customElements.define('th-toast', ThToast);

const _toastGap = 55;
let _toastRefs = [];

function _repositionToasts() {
    let offset = 80;
    _toastRefs.forEach(t => {
        t.style.top = offset + 'px';
        offset += _toastGap;
    });
}

self.Thyme = {
    form: { getJsonData, setJsonData },
    http: methods,
    alert(message, title) {
        const dialog = document.createElement('th-dialog');
        dialog.setAttribute('closable', 'false');
        if (title) dialog.setAttribute('title', title);
        dialog.innerHTML = `<div>${message}</div>
            <button slot="footer">${locale.translate('alert.ok')}</button>`;
        document.body.appendChild(dialog);
        dialog.open();
        const btn = dialog.querySelector('button');
        btn.addEventListener('click', () => {
            dialog.close();
            setTimeout(() => dialog.remove(), 200);
        });
    },
    confirm(message, title) {
        return new Promise(resolve => {
            const dialog = document.createElement('th-dialog');
            dialog.setAttribute('closable', 'false');
            if (title) dialog.setAttribute('title', title);
            dialog.innerHTML = `<div>${message}</div>
                <button slot="footer" class="th-cancel">${locale.translate('confirm.cancel')}</button>
                <button slot="footer" class="th-ok">${locale.translate('confirm.ok')}</button>`;
            document.body.appendChild(dialog);
            dialog.open();
            const cleanup = (result) => {
                dialog.close();
                setTimeout(() => {
                    dialog.remove();
                    resolve(result);
                }, 200);
            };
            dialog.querySelector('.th-ok').addEventListener('click', () => cleanup(true));
            dialog.querySelector('.th-cancel').addEventListener('click', () => cleanup(false));
        });
    },
};
for (const type of ['info', 'warn', 'error', 'success']) {
    self.Thyme[type] = (msg, duration) => {
        const toast = document.createElement('th-toast');
        toast.setAttribute('type', type);
        if (duration) toast.setAttribute('duration', String(duration));
        toast.textContent = msg;
        document.body.appendChild(toast);
        _toastRefs.push(toast);
        _repositionToasts();
        toast.addEventListener('close', () => {
            _toastRefs = _toastRefs.filter(t => t !== toast);
            _repositionToasts();
        });
    };
}
Object.defineProperty(self.Thyme, 'locale', {
    get() { return locale.current; },
    set(v) { locale.setLang(v); },
});
