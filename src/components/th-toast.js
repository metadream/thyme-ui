import { Component } from '../core/Component.js';
import toastCss from '../styles/th-toast.css';

export class ThToast extends Component {
    static get __css__() { return toastCss; }

    static get _observedAttrs() {
        return ['type', 'duration'];
    }

    _template() {
        return `<div class="th-toast" part="toast"><slot></slot></div>`;
    }

    _init() {
        this._toast = this.$('.th-toast');
        const ms = (parseInt(this.getAttribute('duration'), 10) || 3) * 1000;

        requestAnimationFrame(() => {
            this._toast.style.transform = 'translateY(0)';
            this._toast.style.opacity = '1';
        });

        this._timeoutId = setTimeout(() => this.close(), ms);
        this._toast.addEventListener('click', () => this.close());

        this._cleanup = () => {
            clearTimeout(this._timeoutId);
        };
    }

    close() {
        if (this._closed) return;
        this._closed = true;
        clearTimeout(this._timeoutId);
        if (this._toast) {
            this._toast.style.transform = 'translateY(-100%)';
            this._toast.style.opacity = '0';
            this._toast.addEventListener('transitionend', () => this.remove(), { once: true });
        }
        this.dispatchEvent(new CustomEvent('close', { bubbles: true }));
    }
}
