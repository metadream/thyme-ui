import { Component } from '../core/Component.js';
import switchCss from '../styles/th-switch.css';

export class ThSwitch extends Component {
    static get _observedAttrs() {
        return ['checked', 'disabled'];
    }

    static get __css__() { return switchCss; }

    get checked() { return this.hasAttribute('checked'); }
    set checked(v) {
        if (v) this.setAttribute('checked', '');
        else this.removeAttribute('checked');
    }

    get disabled() { return this.hasAttribute('disabled'); }

    get value() { return this.checked ? (this.getAttribute('value') || 'on') : undefined; }

    _template() {
        return `<div class="th-switch${this.checked ? ' th-switch--checked' : ''}" role="switch" aria-checked="${this.checked}" tabindex="${this.disabled ? '-1' : '0'}"${this.disabled ? ' disabled' : ''}>
            <div class="th-switch__thumb"></div>
        </div>`;
    }

    _init() {
        this._switch = this.$('.th-switch');
        this._setupEvents();
    }

    _attrChanged(name, value) {
        if (name === 'checked') {
            this._updateChecked();
        }
    }

    _updateChecked() {
        if (!this._switch) return;
        this._switch.classList.toggle('th-switch--checked', this.checked);
        this._switch.setAttribute('aria-checked', String(this.checked));
    }

    _setupEvents() {
        this._switch.addEventListener('click', () => this._toggle());
        this._switch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this._toggle();
            }
        });
    }

    _toggle() {
        if (this.disabled) return;
        this.checked = !this.checked;
        this.dispatchEvent(new CustomEvent('change', {
            detail: { checked: this.checked },
            bubbles: true,
        }));
    }
}
