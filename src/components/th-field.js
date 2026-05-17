import { Component } from "../core/Component.js";
import { locale } from "../core/locale.js";
import fieldCss from "../styles/th-field.css";

const TEXTAREA = "textarea";
// prettier-ignore
const BLOCK = new Set([
    "P", "DIV", "H1", "H2", "H3", "H4", "H5", "H6", "OL", "UL", "LI", "HR", "DL", "DT", "DD",
    "HEADER", "FOOTER", "MAIN", "TABLE", "SECTION", "ARTICLE", "ASIDE", "NAV", "FORM", "SUMMARY",
    "BLOCKQUOTE", "PRE", "FIGURE", "FIGCAPTION", "DETAILS", "ADDRESS", "FIELDSET",
]);

export class ThField extends Component {
    // prettier-ignore
    static get __css__() { return fieldCss; }

    // prettier-ignore
    static get _observedAttrs() {
        return [
            'label', 'type', 'value', 'name', 'placeholder', 'required',
            'disabled', 'readonly', 'minlength', 'maxlength', 'rows', 'max-rows',
            'min', 'max', 'pattern', 'autocomplete', 'autofocus', 'error'
        ];
    }

    get value() {
        if (!this._input) return "";
        return this._input.tagName === "DIV" ? this._input.innerText : this._input.value;
    }

    set value(v) {
        if (!this._input) return;
        if (this._input.tagName === "DIV") {
            this._input.innerText = v ?? "";
        } else {
            this._input.value = v ?? "";
        }
    }

    get name() {
        return this.getAttribute("name") || "";
    }

    get disabled() {
        return this.hasAttribute("disabled");
    }

    set disabled(v) {
        if (v) this.setAttribute("disabled", "");
        else this.removeAttribute("disabled");
    }

    get required() {
        return this.hasAttribute("required");
    }

    set required(v) {
        if (v) this.setAttribute("required", "");
        else this.removeAttribute("required");
    }

    get readonly() {
        return this.hasAttribute("readonly");
    }

    set readonly(v) {
        if (v) this.setAttribute("readonly", "");
        else this.removeAttribute("readonly");
    }

    _template() {
        const label = this.getAttribute("label") || "";
        const fieldType = this.getAttribute("type") || "text";
        const isTextarea = fieldType === TEXTAREA;
        const isDate = fieldType === "date";
        const type = !isTextarea ? ` type="${isDate ? "text" : fieldType}"` : "";
        const cls = isTextarea ? "th-field th-field--textarea" : "th-field";
        const showLabel = label || Array.from(this.children).some((c) => c.getAttribute?.("slot") === "label");

        return `<div class="${cls}" part="field">
            ${showLabel ? `<label class="th-field__label" part="label"><slot name="label">${label}</slot></label>` : ""}
            <div class="th-field__input-wrap${isDate ? " th-field__input-wrap--date" : ""}">
                ${
                    isTextarea
                        ? `<div class="th-field__input" part="input" contenteditable="plaintext-only"></div><span class="ce-placeholder">${this.getAttribute("placeholder") || ""}</span>`
                        : `<input class="th-field__input" part="input"${type}>`
                }
                <slot></slot>
                ${
                    isDate
                        ? `<button class="th-field__date-btn" part="date-btn" type="button" tabindex="-1" aria-label="${locale.translate("datepicker.aria")}">
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                </button>`
                        : ""
                }
            </div>
            <span class="th-field__error" part="error"></span>
            ${
                isDate
                    ? `<div class="th-field__calendar" part="calendar">
                <div class="th-field__cal-header">
                    <button class="th-field__cal-nav" data-action="prev-year" type="button" tabindex="-1">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 18l-6-6 6-6"/><path d="M19 18l-6-6 6-6"/></svg>
                    </button>
                    <button class="th-field__cal-nav" data-action="prev-month" type="button" tabindex="-1">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                    </button>
                    <span class="th-field__cal-title"></span>
                    <button class="th-field__cal-nav" data-action="next-month" type="button" tabindex="-1">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                    </button>
                    <button class="th-field__cal-nav" data-action="next-year" type="button" tabindex="-1">
                        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 6l6 6-6 6"/><path d="M5 6l6 6-6 6"/></svg>
                    </button>
                </div>
                <div class="th-field__cal-weekdays">
                    ${locale
                        .translate("weekday.labels")
                        .map((d) => `<span>${d}</span>`)
                        .join("")}
                </div>
                <div class="th-field__cal-grid"></div>
            </div>`
                    : ""
            }
        </div>`;
    }

    _init() {
        this._cleanup?.();

        this._field = this.$(".th-field");
        this._errorEl = this.$(".th-field__error");
        this._input = this.$(".th-field__input");
        if (!this._input) return;

        this._updateCEState();
        this._updateRowHeight();

        if (this.childNodes.length > 0) {
            this._consumeSlotContent();
            this._updateCEState();
        } else {
            setTimeout(() => {
                this._consumeSlotContent();
                this._updateCEState();
            }, 0);
        }

        this._syncAttrs();
        this._updateRequired();
        this._updateDisabled();
        this._updateError();
        this._setupEvents();

        this._calOpen = false;
        const dateBtn = this.$(".th-field__date-btn");
        if (dateBtn) {
            dateBtn.addEventListener("click", () => {
                if (this.hasAttribute("disabled")) return;
                this._toggleCalendar();
            });
        }

        const cal = this.$(".th-field__calendar");
        if (cal) {
            cal.addEventListener("click", (e) => {
                const navBtn = e.target.closest(".th-field__cal-nav");
                if (navBtn) this._calNavigate(navBtn.dataset.action);
            });
        }

        this._calOutsideHandler = (e) => {
            if (this._calOpen && !e.composedPath().includes(this)) {
                this._closeCalendar();
            }
        };
        this._calEscHandler = (e) => {
            if (this._calOpen && e.key === "Escape") {
                this._closeCalendar();
            }
        };

        document.addEventListener("click", this._calOutsideHandler);
        document.addEventListener("keydown", this._calEscHandler);
        this._cleanup = () => {
            document.removeEventListener("click", this._calOutsideHandler);
            document.removeEventListener("keydown", this._calEscHandler);
        };
    }

    _toggleCalendar() {
        this._calOpen ? this._closeCalendar() : this._openCalendar();
    }

    _openCalendar() {
        if (this._calOpen) return;
        if (this._input?.value) {
            const d = new Date(this._input.value + "T00:00:00");
            if (!isNaN(d.getTime())) {
                this._calYear = d.getFullYear();
                this._calMonth = d.getMonth();
            } else {
                const n = new Date();
                this._calYear = n.getFullYear();
                this._calMonth = n.getMonth();
            }
        } else {
            const n = new Date();
            this._calYear = n.getFullYear();
            this._calMonth = n.getMonth();
        }

        this._calOpen = true;
        const cal = this.$(".th-field__calendar");
        if (cal) cal.classList.add("th-field__calendar--open");
        this._updateCalTitle();
        this._renderCalendarGrid();
    }

    _closeCalendar() {
        if (!this._calOpen) return;
        this._calOpen = false;
        const cal = this.$(".th-field__calendar");
        if (cal) cal.classList.remove("th-field__calendar--open");
    }

    _calNavigate(action) {
        switch (action) {
            case "prev-year":
                this._calYear--;
                break;
            case "prev-month":
                this._calMonth--;
                if (this._calMonth < 0) {
                    this._calMonth = 11;
                    this._calYear--;
                }
                break;
            case "next-month":
                this._calMonth++;
                if (this._calMonth > 11) {
                    this._calMonth = 0;
                    this._calYear++;
                }
                break;
            case "next-year":
                this._calYear++;
                break;
        }
        this._updateCalTitle();
        this._renderCalendarGrid();
    }

    _updateCalTitle() {
        const el = this.$(".th-field__cal-title");
        if (el) el.textContent = `${this._calYear}-${String(this._calMonth + 1).padStart(2, "0")}`;
    }

    _renderCalendarGrid() {
        const grid = this.$(".th-field__cal-grid");
        if (!grid) return;

        const year = this._calYear;
        const month = this._calMonth;
        const today = new Date();
        const todayStr = this._fmtDate(today);
        const selected = this._input?.value || "";

        const firstDay = new Date(year, month, 1).getDay();
        const startOff = firstDay === 0 ? 6 : firstDay - 1;
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevDays = new Date(year, month, 0).getDate();

        grid.innerHTML = "";
        for (let i = 0; i < 42; i++) {
            let day, date;
            let other = false;
            if (i < startOff) {
                day = prevDays - startOff + 1 + i;
                date = new Date(year, month - 1, day);
                other = true;
            } else if (i >= startOff + daysInMonth) {
                day = i - startOff - daysInMonth + 1;
                date = new Date(year, month + 1, day);
                other = true;
            } else {
                day = i - startOff + 1;
                date = new Date(year, month, day);
            }

            const ds = this._fmtDate(date);
            const btn = document.createElement("button");
            btn.className = "th-field__cal-day";
            if (other) btn.classList.add("th-field__cal-day--other");
            if (ds === todayStr) btn.classList.add("th-field__cal-day--today");
            if (ds === selected) btn.classList.add("th-field__cal-day--selected");

            btn.dataset.date = ds;
            btn.textContent = day;
            btn.type = "button";
            btn.tabIndex = -1;
            btn.addEventListener("click", () => this._selectDate(ds));
            grid.appendChild(btn);
        }
    }

    _fmtDate(d) {
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }

    _selectDate(ds) {
        if (this._input) {
            this._input.value = ds;
            this._syncValue();
            this._input.dispatchEvent(new Event("input", { bubbles: true }));
            this._input.dispatchEvent(new Event("change", { bubbles: true }));
        }
        this._closeCalendar();
    }

    _consumeSlotContent() {
        if (!this.isConnected || this.childNodes.length === 0) return;

        const hasCustomInput = Array.from(this.children).some(
            (n) => ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(n.tagName) || n.tagName.startsWith("TH-"),
        );
        if (hasCustomInput) {
            this._input.style.display = "none";
            return;
        }

        if (this.getAttribute("type") === TEXTAREA) {
            let text = "";
            for (const n of this.childNodes) {
                if (n.nodeType === Node.ELEMENT_NODE) {
                    text += (n.textContent || "").trim();
                    if (BLOCK.has(n.tagName)) text += "\n";
                } else if (n.nodeType === Node.TEXT_NODE && n.textContent.trim()) {
                    text += n.textContent.trim();
                }
            }
            text = text.replace(/\n{3,}/g, "\n\n").trim();
            if (text) this._input.innerText = text;
        }
        this.innerHTML = "";
    }

    _attrChanged(name, value) {
        switch (name) {
            case "label":
                this._rerender();
                break;
            case "type":
                if (this._calOpen) this._closeCalendar();
                this._rerender();
                break;
            case "error":
                this._updateError();
                break;
            case "required":
                this._updateRequired();
                this._forwardAttr(name, value);
                break;
            case "disabled":
                this._updateDisabled();
                this._forwardAttr(name, value);
                break;
            default:
                this._forwardAttr(name, value);
                break;
        }
    }

    _syncAttrs() {
        // prettier-ignore
        for (const a of [
            "name", "placeholder", "required", "disabled", "readonly", "autofocus",
            "minlength", "maxlength", "min", "max", "pattern", "autocomplete", "value",
        ]) {
            if (this.hasAttribute(a)) {
                this._forwardAttr(a, this.getAttribute(a));
            }
        }
    }

    _forwardAttr(name, value) {
        if (!this._input) return;
        if (this._input.tagName === "DIV") {
            if (name === "value") {
                const text = value ?? "";
                if (this._input.innerText !== text) this._input.innerText = text;
            } else if (name === "disabled") {
                this._input.contentEditable = value === null ? "true" : "false";
                if (value !== null) this._input.setAttribute("disabled", "");
                else this._input.removeAttribute("disabled");
            } else if (name === "readonly") {
                this._input.contentEditable = value === null ? "true" : "false";
            } else if (name === "rows" || name === "max-rows") {
                if (this.isConnected) this._updateRowHeight();
            } else {
                if (value !== null) this._input.setAttribute(name, value);
                else this._input.removeAttribute(name);
            }
        } else {
            if (name === "value") {
                this._input.value = value ?? "";
            } else if (name === "disabled" || name === "readonly" || name === "required") {
                if (value !== null) this._input.setAttribute(name, "");
                else this._input.removeAttribute(name);
            } else if (name === "rows" && this._input.tagName.toLowerCase() === TEXTAREA) {
                if (value !== null) this._input.setAttribute("rows", value);
                else this._input.removeAttribute("rows");
            } else {
                if (value !== null) this._input.setAttribute(name, value);
                else this._input.removeAttribute(name);
            }
        }
    }

    _updateRequired() {
        if (!this._field) return;
        this._field.classList.toggle("th-field--required", this.hasAttribute("required"));
    }

    _updateDisabled() {
        if (!this._field) return;
        this._field.classList.toggle("th-field--disabled", this.hasAttribute("disabled"));
    }

    _updateError() {
        if (!this._errorEl || !this._input) return;
        const error = this.getAttribute("error");
        if (error) {
            this._errorEl.textContent = error;
            this._errorEl.classList.add("th-field__error--visible");
            this._field?.classList.add("th-field--error");
        } else {
            this._clearError();
        }
    }

    _clearError() {
        if (!this._errorEl || !this._input) return;
        this._errorEl.textContent = "";
        this._errorEl.classList.remove("th-field__error--visible");
        this._field?.classList.remove("th-field--error");
    }

    _setupEvents() {
        this._input.addEventListener("input", () => {
            this._syncValue();
            this._checkValidity();
        });

        this._input.addEventListener("blur", () => {
            this._checkValidity();
        });

        this._input.addEventListener("invalid", (e) => {
            e.preventDefault();
            this._showError(this._input.validationMessage);
        });
    }

    _syncValue() {
        const val = this._input.tagName === "DIV" ? this._input.innerText : this._input.value;
        if (val !== this.getAttribute("value")) {
            if (val) this.setAttribute("value", val);
            else this.removeAttribute("value");
        }
        this._updateCEState();
    }

    _updateCEState() {
        if (this._input?.tagName !== "DIV" || !this._field) return;
        this._field.classList.toggle("ce--empty", !this._input.textContent.length);
    }

    _updateRowHeight() {
        if (this._input?.tagName !== "DIV") return;
        const style = getComputedStyle(this._input);
        const lh = parseFloat(style.lineHeight) || 21;
        const pt = parseFloat(style.paddingTop) || 12;
        const pb = parseFloat(style.paddingBottom) || 12;

        const rows = parseInt(this.getAttribute("rows")) || 3;
        this._input.style.minHeight = rows * lh + pt + pb + "px";

        const maxRows = this.hasAttribute("max-rows") ? parseInt(this.getAttribute("max-rows")) : 0;
        if (maxRows) {
            this._input.style.maxHeight = maxRows * lh + pt + pb + "px";
        } else {
            this._input.style.maxHeight = "";
        }
    }

    _checkValidity() {
        if (!this._input || this.hasAttribute("error")) return;
        const isCE = this._input.tagName === "DIV";
        const val = isCE ? this._input.innerText : this._input.value;
        let msg = this._validateValue(val);
        if (!msg && !isCE && !this._input.checkValidity()) {
            msg = this._input.validationMessage;
        }
        if (msg) {
            if (val || this._input === document.activeElement) {
                this._showError(msg);
            }
        } else {
            this._clearError();
        }
    }

    _validateValue(val) {
        if (this.hasAttribute("required") && !val.trim()) return locale.translate("field.required");
        if (this.getAttribute("type") === "date" && val) {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(val)) return locale.translate("field.date.format");
            const [y, m, d] = val.split("-").map(Number);
            const dt = new Date(y, m - 1, d);
            if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return locale.translate("field.date.invalid");
            const min = this.getAttribute("min");
            if (min) {
                const [minY, minM, minD] = min.split("-").map(Number);
                if (dt < new Date(minY, minM - 1, minD)) return locale.translate("field.date.min").replace("{min}", min);
            }
            const max = this.getAttribute("max");
            if (max) {
                const [maxY, maxM, maxD] = max.split("-").map(Number);
                if (dt > new Date(maxY, maxM - 1, maxD)) return locale.translate("field.date.max").replace("{max}", max);
            }
            return "";
        }
        const minLen = this.hasAttribute("minlength") ? parseInt(this.getAttribute("minlength")) : 0;
        if (minLen && val.length < minLen) return locale.translate("field.minlength").replace("{n}", minLen);
        const maxLen = this.hasAttribute("maxlength") ? parseInt(this.getAttribute("maxlength")) : 0;
        if (maxLen && val.length > maxLen) return locale.translate("field.maxlength").replace("{n}", maxLen);
        return "";
    }

    _showError(msg) {
        if (!msg || !this._errorEl || !this._field || this.hasAttribute("error")) return;
        this._errorEl.textContent = msg;
        this._errorEl.classList.add("th-field__error--visible");
        this._field.classList.add("th-field--error");
    }

    focus() {
        this._input?.focus();
    }

    checkValidity() {
        if (!this._input) return true;
        const isCE = this._input.tagName === "DIV";
        const val = isCE ? this._input.innerText : this._input.value;
        if (this._validateValue(val)) return false;
        if (!isCE && !this._input.checkValidity()) return false;
        return true;
    }

    reportValidity() {
        if (!this._input) return true;
        const isCE = this._input.tagName === "DIV";
        const val = isCE ? this._input.innerText : this._input.value;
        const msg = this._validateValue(val);
        if (msg) {
            this._showError(msg);
            return false;
        }
        if (!isCE && !this._input.checkValidity()) {
            this._showError(this._input.validationMessage);
            return false;
        }
        this._clearError();
        return true;
    }

    setCustomValidity(msg) {
        if (!this._input) return;
        if (this._input.tagName === "DIV") {
            if (msg) this.setAttribute("error", msg);
            else this.removeAttribute("error");
        } else {
            this._input.setCustomValidity(msg);
            if (msg) this.setAttribute("error", msg);
            else this.removeAttribute("error");
        }
    }
}
