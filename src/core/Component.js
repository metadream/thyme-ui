export class Component extends HTMLElement {
    static get observedAttributes() {
        return this._observedAttrs || [];
    }

    constructor() {
        super();
        this._shadow = this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        if (!this.__rendered) {
            this.__rendered = true;
            this._render();
        }
    }

    disconnectedCallback() {
        this._cleanup?.();
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue && this.__rendered) {
            this._attrChanged?.(name, newValue, oldValue);
        }
    }

    _render() {
        const Ctor = this.constructor;
        if (Ctor.__css__) {
            const style = document.createElement("style");
            style.textContent = Ctor.__css__;
            this._shadow.appendChild(style);
        }

        const html = this._template();
        if (html) {
            const temp = document.createElement("template");
            temp.innerHTML = html;
            this._shadow.appendChild(temp.content.cloneNode(true));
        }

        this._init?.();
    }

    _rerender() {
        this._shadow.innerHTML = "";
        this.__rendered = false;
        if (this.isConnected) {
            this.connectedCallback();
        }
    }

    $(sel) {
        return this._shadow.querySelector(sel);
    }
}
