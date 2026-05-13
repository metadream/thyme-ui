import { Component } from '../../core/Component.js';
import dialogCss from './styles.css';

export class ThDialog extends Component {
    static get _observedAttrs() {
        return ['open', 'title', 'closable'];
    }

    static get __css__() { return dialogCss; }

    _template() {
        const title = this.getAttribute('title') || '';
        const open = this.hasAttribute('open');
        return `<div class="th-dialog-overlay${open ? ' th-dialog-overlay--open' : ''}" part="overlay">
            <div class="th-dialog" part="dialog" role="dialog" aria-modal="${open}">
                ${title ? `<div class="th-dialog__title" part="title">${title}</div>` : ''}
                <div class="th-dialog__body" part="body">
                    <slot></slot>
                </div>
                <div class="th-dialog__footer" part="footer">
                    <slot name="footer"></slot>
                </div>
            </div>
        </div>`;
    }

    _init() {
        this._overlay = this.$('.th-dialog-overlay');
        this._footer = this.$('.th-dialog__footer');
        this._footerSlot = this.$('slot[name="footer"]');

        this._footerSlot.addEventListener('slotchange', () => {
            this._updateFooter();
        });
        this._updateFooter();

        this._keydownHandler = (e) => {
            if (e.key === 'Escape' && this.hasAttribute('open')) {
                const closable = this.getAttribute('closable') !== 'false';
                if (closable) {
                    this.close();
                }
            }
        };
        document.addEventListener('keydown', this._keydownHandler);

        this._cleanup = () => {
            document.removeEventListener('keydown', this._keydownHandler);
        };
    }

    _updateFooter() {
        const nodes = this._footerSlot.assignedNodes();
        const hasButtons = nodes.some(n => n.nodeType === 1);
        this._footer.hidden = !hasButtons;
    }

    _attrChanged(name, value) {
        switch (name) {
            case 'open':
                this._updateOpenState();
                break;
            case 'title':
                this._rerender();
                break;
        }
    }

    _updateOpenState() {
        if (!this._overlay) return;
        const isOpen = this.hasAttribute('open');
        this._overlay.classList.toggle('th-dialog-overlay--open', isOpen);
        const dialog = this.$('.th-dialog');
        if (dialog) {
            dialog.setAttribute('aria-modal', String(isOpen));
        }
    }

    open() {
        this.setAttribute('open', '');
    }

    close() {
        this.removeAttribute('open');
    }
}

if (!customElements.get('th-dialog')) {
    customElements.define('th-dialog', ThDialog);
}
