export function getJsonArray(scopes) {
    scopes = typeof scopes === "string" ? document.querySelectorAll(scopes) : scopes;
    const result = [];

    for (const scope of scopes) {
        const obj = getJsonObject(scope);
        if (!obj) return null; // !important

        if (Object.keys(obj).length) {
            result.push(obj);
        }
    }
    return result;
}

export function getJsonObject(scope) {
    scope = typeof scope === "string" ? document.querySelector(scope) : scope;
    const els = scope.querySelectorAll('[name]:not([name=""])');
    const data = {};

    for (const el of els) {
        if (el.checkValidity && !el.checkValidity()) {
            el.reportValidity();
            el.focus && el.focus();
            return null;
        }

        const name = el.name || el.getAttribute("name");
        if (!name) continue;
        if (_isCheckable(el) && !el.checked) continue;

        if (el.type === "checkbox" || el.type === "select-multiple") {
            if (!Array.isArray(data[name])) data[name] = [];
            if (el.type === "select-multiple") {
                for (const opt of el.options) {
                    if (opt.selected) data[name].push(opt.value);
                }
            } else {
                data[name].push(el.value ?? 1);
            }
        } else if (el.isContentEditable) {
            data[name] = el.innerHTML.trim();
            el.innerHTML = data[name];
        } else {
            let v = el.value ?? el?.textContent ?? "";
            if (typeof v === "string" && _isInput(el)) {
                v = v.trim();
                el.value = v;
            }
            data[name] = v;
        }
    }
    return data;
}

export function setJsonObject(scope, data) {
    scope = typeof scope === "string" ? document.querySelector(scope) : scope;
    const els = scope.querySelectorAll('[name]:not([name=""])');

    for (const el of els) {
        const name = el.name || el.getAttribute("name");
        const val = data[name] ?? "";

        if (el.type === "radio") {
            el.checked = String(el.value) === String(val);
        } else if (el.type === "checkbox") {
            el.checked = Array.isArray(val) ? val.includes(el.value) : String(el.value) === String(val);
        } else if (_isCheckable(el)) {
            el.checked = !!val;
        } else {
            el.value = val ?? "";
        }
    }
}

function _isCheckable(el) {
    return (
        el.type === "checkbox" ||
        el.type === "radio" ||
        (typeof el.checked === "boolean" && !(el instanceof HTMLInputElement))
    );
}

function _isInput(el) {
    return !_isCheckable(el) && el.type !== "select-one";
}
