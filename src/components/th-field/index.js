import { Component } from '../../core/Component.js';
import fieldCss from './styles.css';

const TEXTAREA = 'textarea';

export class ThField extends Component {
    static get _observedAttrs() {
        return [
            'label', 'type', 'value', 'name', 'placeholder',
            'required', 'disabled', 'readonly', 'minlength', 'maxlength',
            'min', 'max', 'pattern', 'autocomplete', 'autofocus',
            'rows', 'error'
        ];
    }

    static get __css__() { return fieldCss; }

    get value() { return this._input?.value ?? ''; }
    set value(v) {
        if (this._input) {
            this._input.value = v ?? '';
        }
    }

    _template() {
        const label = this.getAttribute('label') || '';
        const isTextarea = this.getAttribute('type') === TEXTAREA;
        const tag = isTextarea ? TEXTAREA : 'input';
        const rows = isTextarea ? ` rows="${this.getAttribute('rows') || '3'}"` : '';
        const type = !isTextarea ? ` type="${this.getAttribute('type') || 'text'}"` : '';
        const cls = isTextarea ? 'th-field th-field--textarea' : 'th-field';

        return `<div class="${cls}" part="field">
            <label class="th-field__label" part="label">
                <slot name="label">${label}</slot>
            </label>
            <div class="th-field__input-wrap">
                <slot>
                    <${tag} class="th-field__input" part="input"${type}${rows}></${tag}>
                </slot>
            </div>
            <span class="th-field__error" part="error"></span>
        </div>`;
    }

    _init() {
        this._field = this.$('.th-field');
        this._errorEl = this.$('.th-field__error');
        this._input = this.$('.th-field__input');

        if (!this._input) return;

        this._syncAttrs();
        this._updateRequired();
        this._updateError();
        this._setupEvents();
    }

    _attrChanged(name, value) {
        switch (name) {
            case 'label':
                this._rerender();
                break;
            case 'type':
                this._rerender();
                break;
            case 'error':
                this._updateError();
                break;
            case 'required':
                this._updateRequired();
                this._forwardAttr(name, value);
                break;
            default:
                this._forwardAttr(name, value);
                break;
        }
    }

    _syncAttrs() {
        for (const a of ['name', 'placeholder', 'required', 'disabled', 'readonly', 'minlength', 'maxlength', 'min', 'max', 'pattern', 'autocomplete', 'autofocus', 'value']) {
            if (this.hasAttribute(a)) {
                this._forwardAttr(a, this.getAttribute(a));
            }
        }
    }

    _forwardAttr(name, value) {
        if (!this._input) return;
        if (name === 'value') {
            this._input.value = value ?? '';
        } else if (name === 'disabled' || name === 'readonly' || name === 'required') {
            if (value !== null) {
                this._input.setAttribute(name, '');
            } else {
                this._input.removeAttribute(name);
            }
        } else if (name === 'rows' && this._input.tagName.toLowerCase() === TEXTAREA) {
            if (value !== null) {
                this._input.setAttribute('rows', value);
            } else {
                this._input.removeAttribute('rows');
            }
        } else {
            if (value !== null) {
                this._input.setAttribute(name, value);
            } else {
                this._input.removeAttribute(name);
            }
        }
    }

    _updateRequired() {
        if (!this._field) return;
        this._field.classList.toggle('th-field--required', this.hasAttribute('required'));
    }

    _updateError() {
        if (!this._errorEl || !this._input) return;
        const error = this.getAttribute('error');
        if (error) {
            this._errorEl.textContent = error;
            this._errorEl.classList.add('th-field__error--visible');
            this._field?.classList.add('th-field--error');
        } else {
            this._clearError();
        }
    }

    _clearError() {
        if (!this._errorEl || !this._input) return;
        this._errorEl.textContent = '';
        this._errorEl.classList.remove('th-field__error--visible');
        this._field?.classList.remove('th-field--error');
    }

    _setupEvents() {
        this._input.addEventListener('input', () => {
            this._syncValue();
            this._checkValidity();
        });

        this._input.addEventListener('blur', () => {
            this._checkValidity();
        });

        this._input.addEventListener('invalid', (e) => {
            e.preventDefault();
            this._showError(this._input.validationMessage);
        });
    }

    _syncValue() {
        const val = this._input.value;
        if (val) {
            this.setAttribute('value', val);
        } else {
            this.removeAttribute('value');
        }
    }

    _checkValidity() {
        if (!this._input || this.hasAttribute('error')) return;
        if (this._input.checkValidity()) {
            this._clearError();
        } else if (this._input.value || this._input === document.activeElement) {
            this._showError(this._input.validationMessage);
        }
    }

    _showError(msg) {
        if (!msg || !this._errorEl || !this._field || this.hasAttribute('error')) return;
        this._errorEl.textContent = msg;
        this._errorEl.classList.add('th-field__error--visible');
        this._field.classList.add('th-field--error');
    }

    checkValidity() {
        return this._input?.checkValidity() ?? true;
    }

    reportValidity() {
        if (!this._input) return true;
        if (this._input.checkValidity()) {
            this._clearError();
            return true;
        }
        this._showError(this._input.validationMessage);
        return false;
    }

    setCustomValidity(msg) {
        if (!this._input) return;
        this._input.setCustomValidity(msg);
        if (msg) {
            this.setAttribute('error', msg);
        } else {
            this.removeAttribute('error');
        }
    }
}

if (!customElements.get('th-field')) {
    customElements.define('th-field', ThField);
}
