import { ThButton } from "./components/th-button.js";
import { ThCheck } from "./components/th-check.js";
import { ThDialog } from "./components/th-dialog.js";
import { ThField } from "./components/th-field.js";
import { ThSelect } from "./components/th-select.js";
import { ThSwitch } from "./components/th-switch.js";
import { ThToast } from "./components/th-toast.js";
import { locale } from "./core/locale.js";
import { methods } from "./core/http.js";
import { getJsonData, setJsonData } from "./core/form.js";
import * as utils from "./core/utils.js";

document.head.appendChild(
    Object.assign(document.createElement("style"), {
        textContent: ":root{--th-primary:#3730a3;--th-radius:8px;--th-font-size:14px;--th-line-height:1.5}",
    }),
);

customElements.define("th-button", ThButton);
customElements.define("th-check", ThCheck);
customElements.define("th-dialog", ThDialog);
customElements.define("th-field", ThField);
customElements.define("th-select", ThSelect);
customElements.define("th-switch", ThSwitch);
customElements.define("th-toast", ThToast);

self.Thyme = {
    form: { getJsonData, setJsonData },
    http: methods,
    utils,
    alert(message, title) {
        const dialog = document.createElement("th-dialog");
        dialog.setAttribute("closable", "false");
        if (title) dialog.setAttribute("title", title);
        dialog.innerHTML = `<div>${message}</div>
            <button slot="footer">${locale.translate("alert.ok")}</button>`;
        document.body.appendChild(dialog);
        dialog.open();
        const btn = dialog.querySelector("button");
        btn.addEventListener("click", () => {
            dialog.close();
            setTimeout(() => dialog.remove(), 200);
        });
    },
    confirm(message, title) {
        return new Promise((resolve) => {
            const dialog = document.createElement("th-dialog");
            dialog.setAttribute("closable", "false");
            if (title) dialog.setAttribute("title", title);
            dialog.innerHTML = `<div>${message}</div>
                <button slot="footer" class="th-cancel">${locale.translate("confirm.cancel")}</button>
                <button slot="footer" class="th-ok">${locale.translate("confirm.ok")}</button>`;
            document.body.appendChild(dialog);
            dialog.open();
            const cleanup = (result) => {
                dialog.close();
                setTimeout(() => {
                    dialog.remove();
                    resolve(result);
                }, 200);
            };
            dialog.querySelector(".th-ok").addEventListener("click", () => cleanup(true));
            dialog.querySelector(".th-cancel").addEventListener("click", () => cleanup(false));
        });
    },
};

for (const type of ["info", "warn", "error", "success"]) {
    self.Thyme[type] = (msg, duration) => {
        const toast = document.createElement("th-toast");
        toast.setAttribute("type", type);
        if (duration) toast.setAttribute("duration", String(duration));
        toast.textContent = msg;
        document.body.appendChild(toast);
    };
}

Object.defineProperty(self.Thyme, "locale", {
    get() {
        return locale.current;
    },
    set(v) {
        locale.setLang(v);
    },
});
