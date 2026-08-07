import { Component } from "../core/Component.js";
import dialogCss from "../styles/th-dialog.css";

export class ThDialog extends Component {
    // prettier-ignore
    static get __css__() { return dialogCss; }

    static get _observedAttrs() {
        return ["open", "title", "closable", "width"];
    }

    _template() {
        const title = this.getAttribute("title") || "";
        const open = this.hasAttribute("open");
        return `<div class="th-dialog-overlay${open ? " fade-in" : ""}" part="overlay">
            <div class="th-dialog${open ? " scale-in" : ""}" part="dialog" role="dialog">
                ${title ? `<div class="th-dialog__title" part="title">${title}</div>` : ""}
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
        this._overlay = this.$(".th-dialog-overlay");
        this._dialog = this.$(".th-dialog");
        this._footer = this.$(".th-dialog__footer");
        this._footerSlot = this.$('slot[name="footer"]');
        this._updateWidth();
        this._updateFooter();

        this._footerSlot.addEventListener("slotchange", () => {
            this._updateFooter();
        });

        this._keydownHandler = (e) => {
            if (e.key === "Escape" && this.hasAttribute("open")) {
                const closable = this.getAttribute("closable") !== "false";
                if (closable) {
                    this.close();
                }
            }
        };

        document.addEventListener("keydown", this._keydownHandler);
        this._cleanup = () => {
            document.removeEventListener("keydown", this._keydownHandler);
        };
    }

    _updateWidth() {
        const w = this.getAttribute("width");
        if (this._dialog) {
            if (w) {
                this._dialog.style.width = w + "px";
                this._dialog.style.maxWidth = w + "px";
            } else {
                this._dialog.style.width = "";
                this._dialog.style.maxWidth = "";
            }
        }
    }

    _updateFooter() {
        const nodes = this._footerSlot.assignedNodes();
        const hasButtons = nodes.some((n) => n.nodeType === 1);
        this._footer.hidden = !hasButtons;
    }

    _attrChanged(name, value) {
        switch (name) {
            case "open":
                this._updateOpenState();
                // 关闭完成（open 属性移除）时派发 close 事件，供外部监听（ESC/遮罩/close() 均会走到此处）。
                // 注意：attributeChangedCallback 移除属性时 newValue 为 null（而非 undefined）。
                if (value == null) {
                    this.dispatchEvent(new CustomEvent("close", { bubbles: true }));
                }
                break;
            case "title":
                this._rerender();
                break;
            case "width":
                this._updateWidth();
                break;
        }
    }

    _updateOpenState() {
        const overlay = this._overlay;
        const dialog = this.$(".th-dialog");
        if (!overlay || !dialog) return;

        const isOpen = this.hasAttribute("open");
        if (isOpen) {
            overlay.classList.remove("fade-out");
            dialog.classList.remove("scale-out");
            void overlay.offsetWidth;
            overlay.classList.add("fade-in");
            dialog.classList.add("scale-in");

            this._preventHandler = (e) => e.preventDefault();
            window.addEventListener("wheel", this._preventHandler, { passive: false });
            window.addEventListener("touchmove", this._preventHandler, { passive: false });
        } else {
            overlay.classList.remove("fade-in", "fade-out");
            dialog.classList.remove("scale-in", "scale-out");

            if (this._preventHandler) {
                window.removeEventListener("wheel", this._preventHandler);
                window.removeEventListener("touchmove", this._preventHandler);
                this._preventHandler = null;
            }
        }
    }

    open() {
        if (this.hasAttribute("open")) return;
        this.setAttribute("open", "");
    }

    close() {
        if (!this.hasAttribute("open")) return;
        this._animateClose();
    }

    _animateClose() {
        const overlay = this._overlay;
        const dialog = this.$(".th-dialog");
        if (!overlay || !dialog) return;

        overlay.classList.remove("fade-in");
        dialog.classList.remove("scale-in");
        void overlay.offsetWidth;
        overlay.classList.add("fade-out");
        dialog.classList.add("scale-out");

        setTimeout(() => {
            this.removeAttribute("open");
            overlay.classList.remove("fade-out");
            dialog.classList.remove("scale-out");
        }, 300);
    }
}
