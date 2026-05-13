import { Component } from '../core/Component.js';
import selectCss from '../styles/th-select.css';

export class ThSelect extends Component {
    static get _observedAttrs() {
        return ['label', 'value', 'placeholder', 'disabled', 'name', 'required'];
    }

    static get __css__() { return selectCss; }

    get value() { return this._selectedValue || ''; }
    set value(v) {
        if (v !== null && v !== undefined && v !== '') {
            this.setAttribute('value', v);
        } else {
            this.removeAttribute('value');
        }
    }

    get disabled() { return this.hasAttribute('disabled'); }

    get name() { return this.getAttribute('name') || ''; }

    _template() {
        const label = this.getAttribute('label') || '';
        const placeholder = this.getAttribute('placeholder') || '';
        return `<div class="th-select" part="select">
            ${label ? `<label class="th-select__label" part="label">${label}</label>` : ''}
            <div class="th-select__trigger" part="trigger" role="combobox" aria-expanded="false" aria-haspopup="listbox" tabindex="0">
                <span class="th-select__value${placeholder && !this._selectedText ? ' th-select__placeholder' : ''}" part="value">${this._selectedText || placeholder}</span>
                <svg class="th-select__arrow" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path d="M7 10l5 5 5-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
            </div>
            <div class="th-select__panel" part="panel" role="listbox">
                <div class="th-select__options"></div>
            </div>
        </div>`;
    }

    _init() {
        this._select = this.$('.th-select');
        this._valueEl = this.$('.th-select__value');
        this._trigger = this.$('.th-select__trigger');
        this._panel = this.$('.th-select__panel');
        this._optionsContainer = this.$('.th-select__options');
        this._isOpen = false;
        this._selectedValue = '';
        this._selectedText = '';

        this._setupEvents();
        this._updateDisabled();

        this._loadOptions();
    }

    _loadOptions() {
        this._buildOptions();
        this._tryFinishInit();

        if (!this.__initialized) {
            requestAnimationFrame(() => {
                this._buildOptions();
                this._tryFinishInit();
            });
        }
    }

    _tryFinishInit() {
        if (this._optionsContainer.children.length === 0) return;
        const initialValue = this.getAttribute('value');
        if (initialValue !== null) {
            this._selectValue(initialValue);
        } else {
            const selected = this.querySelector('option[selected]');
            if (selected) {
                this._selectValue(selected.value || selected.textContent);
            }
        }
        this.__initialized = true;
    }

    _attrChanged(name, value) {
        switch (name) {
            case 'value':
                if (this.__initialized) this._selectValue(value);
                break;
            case 'disabled':
                if (this.__initialized) this._updateDisabled();
                break;
            case 'label':
            case 'placeholder':
                if (this.__initialized) this._rerender();
                break;
        }
    }

    _updateDisabled() {
        if (!this._select) return;
        this._select.classList.toggle('th-select--disabled', this.disabled);
        this._trigger.setAttribute('tabindex', this.disabled ? '-1' : '0');
    }

    _buildOptions() {
        if (!this._optionsContainer) return;
        this._optionsContainer.innerHTML = '';
        const optionEls = this.querySelectorAll('option');

        optionEls.forEach((opt, i) => {
            const el = document.createElement('div');
            el.className = 'th-select__option';
            el.dataset.value = opt.value || opt.textContent;
            el.dataset.index = String(i);
            el.textContent = opt.textContent;
            this._optionsContainer.appendChild(el);
        });
    }

    _selectValue(value) {
        this._selectedValue = value || '';

        const options = this._optionsContainer.querySelectorAll('.th-select__option');
        let displayText = '';

        options.forEach(opt => {
            const isSelected = opt.dataset.value === value;
            opt.classList.toggle('th-select__option--selected', isSelected);
            if (isSelected) displayText = opt.textContent;
        });

        this._selectedText = displayText;
        this._valueEl.textContent = displayText || this.getAttribute('placeholder') || '';
        this._valueEl.classList.toggle('th-select__placeholder', !displayText);
    }

    _toggle() {
        if (this.disabled) return;
        this._isOpen ? this._close() : this._open();
    }

    _open() {
        if (this.disabled) return;
        this._isOpen = true;
        this._select.classList.add('th-select--open');
        this._trigger.setAttribute('aria-expanded', 'true');

        const options = this._optionsContainer.querySelectorAll('.th-select__option');
        options.forEach(opt => opt.classList.remove('th-select__option--highlighted'));

        const selected = this._optionsContainer.querySelector('.th-select__option--selected');
        if (selected) {
            selected.classList.add('th-select__option--highlighted');
            selected.scrollIntoView({ block: 'nearest' });
        }
    }

    _close() {
        this._isOpen = false;
        this._select.classList.remove('th-select--open');
        this._trigger.setAttribute('aria-expanded', 'false');
        this._trigger.focus();
    }

    _navigate(direction) {
        if (!this._isOpen) {
            this._open();
            return;
        }

        const options = this._optionsContainer.querySelectorAll('.th-select__option');
        if (!options.length) return;

        let idx = Array.from(options).findIndex(opt =>
            opt.classList.contains('th-select__option--highlighted')
        );

        if (idx === -1) {
            idx = Array.from(options).findIndex(opt =>
                opt.classList.contains('th-select__option--selected')
            );
            if (idx === -1) idx = -direction;
        }

        idx = Math.max(0, Math.min(options.length - 1, idx + direction));

        options.forEach(opt => opt.classList.remove('th-select__option--highlighted'));
        options[idx].classList.add('th-select__option--highlighted');
        options[idx].scrollIntoView({ block: 'nearest' });
    }

    _setupEvents() {
        this._trigger.addEventListener('click', () => this._toggle());

        this._trigger.addEventListener('keydown', (e) => {
            switch (e.key) {
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    if (this._isOpen) {
                        const highlighted = this._optionsContainer.querySelector('.th-select__option--highlighted');
                        if (highlighted) this._applyOption(highlighted);
                    } else {
                        this._open();
                    }
                    break;
                case 'Escape':
                    if (this._isOpen) this._close();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    this._navigate(1);
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    this._navigate(-1);
                    break;
            }
        });

        this._optionsContainer.addEventListener('click', (e) => {
            const opt = e.target.closest('.th-select__option');
            if (opt && !this.disabled) {
                this._applyOption(opt);
            }
        });

        document.addEventListener('click', (e) => {
            if (this._isOpen && !e.composedPath().includes(this)) {
                this._close();
            }
        });
    }

    _applyOption(opt) {
        const value = opt.dataset.value;
        this._selectValue(value);
        this.setAttribute('value', value);
        this._close();
        this.dispatchEvent(new CustomEvent('change', {
            detail: { value, text: opt.textContent },
            bubbles: true,
        }));
    }
}
