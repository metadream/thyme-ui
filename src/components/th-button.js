import { Component } from "../core/Component.js";
import btnCss from "../styles/th-button.css";

function ripple(container, event) {
    const el = document.createElement("span");
    el.className = "th-ripple";
    el.setAttribute("aria-hidden", "true");

    let cx = event.clientX,
        cy = event.clientY;
    if (event.touches) {
        cx = event.touches[0].clientX;
        cy = event.touches[0].clientY;
    }

    const rect = container.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = cx - rect.left - size / 2;
    const y = cy - rect.top - size / 2;

    el.style.width = el.style.height = size + "px";
    el.style.left = x + "px";
    el.style.top = y + "px";
    container.appendChild(el);
    el.addEventListener("animationend", () => el.remove());
}

export class ThButton extends Component {
    // prettier-ignore
    static get __css__() { return btnCss; }

    // prettier-ignore
    static get _observedAttrs() {
        return [
            "variant", "size", "href", "target", "loading", "disabled",
            "type", "name", "value", "form", "autofocus", "rel", "download",
        ];
    }

    _template() {
        const isLink = this.hasAttribute("href");
        const tag = isLink ? "a" : "button";
        const variant = this.getAttribute("variant") || "filled";

        return `<${tag} class="th-button th-button--${variant}" part="button">
            <span class="th-button__content" part="content">
                <slot name="icon"></slot>
                <slot></slot>
            </span>
            <span class="th-button__loader" part="loader">
                <svg class="th-button__spinner" viewBox="0 0 24 24" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="3" stroke-dasharray="31.4 31.4" stroke-linecap="round"/>
                </svg>
            </span>
        </${tag}>`;
    }

    _init() {
        this._button = this.$(".th-button");
        this._loader = this.$(".th-button__loader");
        this._iconSlot = this.$('slot[name="icon"]');
        this._labelSlot = this.$("slot:not([name])");

        this._syncAttrs();
        this._updateLoading();
        this._setupRipple();
        this._setupEvents();
        this._updateSlots();
        this._iconSlot.addEventListener("slotchange", () => this._updateSlots());
        this._labelSlot.addEventListener("slotchange", () => this._updateSlots());
    }

    _attrChanged(name, value) {
        switch (name) {
            case "variant":
                this._updateVariant(value);
                break;
            case "href":
                this._rerender();
                break;
            case "loading":
                this._updateLoading();
                break;
            case "disabled":
                this._syncDisabled();
                break;
            case "size":
                break;
            default:
                this._forwardAttr(name, value);
                break;
        }
    }

    _updateSlots() {
        const hasIcon = this._iconSlot.assignedNodes().length > 0;
        const hasText = this._labelSlot.assignedNodes().length > 0;
        this._iconSlot.style.display = hasIcon ? "" : "none";
        this._labelSlot.style.display = hasText ? "" : "none";
        this._button.classList.toggle("th-button--icon-only", hasIcon && !hasText);
    }

    _syncAttrs() {
        // prettier-ignore
        for (const a of [
            "disabled", "type", "name", "value", "form",
            "autofocus", "href", "target", "rel", "download",
        ]) {
            if (this.hasAttribute(a)) {
                this._forwardAttr(a, this.getAttribute(a));
            }
        }
    }

    _forwardAttr(name, value) {
        if (!this._button) return;
        const tag = this._button.tagName.toLowerCase();

        if (tag === "a") {
            if (name === "disabled") {
                this._button.setAttribute("aria-disabled", value !== null ? "true" : "false");
                return;
            }
            if (["type", "name", "value", "form", "autofocus"].includes(name)) return;
        }

        if (tag === "button") {
            if (["href", "target", "rel", "download"].includes(name)) return;
        }

        if (value !== null) {
            this._button.setAttribute(name, value);
        } else {
            this._button.removeAttribute(name);
        }
    }

    _syncDisabled() {
        if (!this._button) return;
        if (this._button.tagName === "A") {
            this._button.setAttribute("aria-disabled", this.hasAttribute("disabled") ? "true" : "false");
        } else if (this.hasAttribute("disabled") || this.hasAttribute("loading")) {
            this._button.setAttribute("disabled", "");
        } else {
            this._button.removeAttribute("disabled");
        }
    }

    _updateVariant(value) {
        if (!this._button) return;
        this._button.classList.remove("th-button--filled", "th-button--tonal", "th-button--outlined");
        this._button.classList.add(`th-button--${value || "filled"}`);
    }

    _updateLoading() {
        if (!this._button || !this._loader) return;
        const loading = this.hasAttribute("loading");
        this._button.classList.toggle("th-button--loading", loading);
        this._syncDisabled();
    }

    _setupRipple() {
        this._button.addEventListener("click", (e) => {
            if (this.hasAttribute("loading")) return;
            ripple(this._button, e);
        });
    }

    _setupEvents() {
        this._button.addEventListener("click", (e) => {
            if (this.hasAttribute("loading")) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            if (this._button.tagName === "A" && !this.hasAttribute("href")) {
                e.preventDefault();
            }
        });
    }
}
