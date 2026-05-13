import { Component } from '../../core/Component.js';
import checkCss from './styles.css';

export class ThCheck extends Component {
    static get _observedAttrs() {
        return ['type', 'checked', 'disabled', 'name', 'value'];
    }

    static get __css__() { return checkCss; }

    get checked() { return this.hasAttribute('checked'); }
    set checked(v) {
        if (v) this.setAttribute('checked', '');
        else this.removeAttribute('checked');
    }

    get disabled() { return this.hasAttribute('disabled'); }

    get type() { return this.getAttribute('type') || 'checkbox'; }

    get name() { return this.getAttribute('name') || ''; }

    get value() { return this.getAttribute('value') || ''; }

    _template() {
        const isRadio = this.type === 'radio';
        const role = isRadio ? 'radio' : 'checkbox';
        return `<div class="th-check${this.checked ? ' th-check--checked' : ''}${isRadio ? ' th-check--radio' : ''}${this.disabled ? ' th-check--disabled' : ''}" role="${role}" aria-checked="${this.checked}" tabindex="${this.disabled ? '-1' : '0'}">
            <div class="th-check__indicator"></div>
            <span class="th-check__label"><slot></slot></span>
        </div>`;
    }

    _init() {
        this._check = this.$('.th-check');
        this._setupEvents();
    }

    _attrChanged(name, value) {
        if (name === 'checked') {
            this._updateChecked();
        } else if (name === 'type') {
            this._rerender();
        } else if (name === 'disabled') {
            this._updateDisabled();
        }
    }

    _updateChecked() {
        if (!this._check) return;
        this._check.classList.toggle('th-check--checked', this.checked);
        this._check.setAttribute('aria-checked', String(this.checked));
    }

    _updateDisabled() {
        if (!this._check) return;
        this._check.classList.toggle('th-check--disabled', this.disabled);
        this._check.setAttribute('tabindex', this.disabled ? '-1' : '0');
    }

    _setupEvents() {
        this._check.addEventListener('click', () => this._toggle());
        this._check.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this._toggle();
            }
        });
    }

    _toggle() {
        if (this.disabled) return;

        if (this.type === 'radio') {
            if (this.checked) return;
            this._uncheckSiblings();
            this.checked = true;
        } else {
            this.checked = !this.checked;
        }

        this.dispatchEvent(new CustomEvent('change', {
            detail: { checked: this.checked, value: this.getAttribute('value') || '' },
            bubbles: true,
        }));
    }

    _uncheckSiblings() {
        const name = this.getAttribute('name');
        if (!name) return;
        document.querySelectorAll(`th-check[type="radio"][name="${name}"]`).forEach(el => {
            if (el !== this) el.checked = false;
        });
    }
}

if (!customElements.get('th-check')) {
    customElements.define('th-check', ThCheck);
}
