import { Component } from "../core/Component.js";
import switchCss from "../styles/th-switch.css";

export class ThSwitch extends Component {
    // prettier-ignore
    static get __css__() { return switchCss; }

    static get _observedAttrs() {
        return ["checked", "disabled"];
    }

    get checked() {
        return this.hasAttribute("checked");
    }

    set checked(v) {
        if (v) this.setAttribute("checked", "");
        else this.removeAttribute("checked");
    }

    get disabled() {
        return this.hasAttribute("disabled");
    }

    set disabled(v) {
        if (v) this.setAttribute("disabled", "");
        else this.removeAttribute("disabled");
    }

    get value() {
        return this.checked ? this.getAttribute("value") || 1 : undefined;
    }

    _template() {
        return `<div class="th-switch${this.checked ? " th-switch--checked" : ""}" role="switch" tabindex="${this.disabled ? "-1" : "0"}"${this.disabled ? " disabled" : ""}>
            <div class="th-switch__thumb"></div>
        </div>`;
    }

    _init() {
        this._switch = this.$(".th-switch");
        this._setupEvents();
    }

    _attrChanged(name, value) {
        if (name === "checked") {
            this._updateChecked();
        }
    }

    _updateChecked() {
        if (!this._switch) return;
        this._switch.classList.toggle("th-switch--checked", this.checked);
    }

    _setupEvents() {
        this._switch.addEventListener("click", () => this._toggle());
        this._switch.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                this._toggle();
            }
        });
    }

    _toggle() {
        if (this.disabled) return;
        this.checked = !this.checked;
        this.dispatchEvent(
            new CustomEvent("change", {
                detail: { checked: this.checked },
                bubbles: true,
            }),
        );
    }
}
