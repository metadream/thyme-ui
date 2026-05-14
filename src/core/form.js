export function getJsonArray(scopes) {
    scopes = typeof scopes === "string" ? document.querySelectorAll(scopes) : scopes;
    const result = [];
    for (const scope of scopes) {
        const obj = getJsonObject(scope);
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
        const name = el.name || el.getAttribute("name");
        if (!name) continue;
        if (typeof el.checked === "boolean" && !el.checked) continue;

        if (el.type === "checkbox") {
            if (!Array.isArray(data[name])) data[name] = [];
            data[name].push(el.value ?? 1);
        } else if (el.isContentEditable) {
            data[name] = el.innerHTML.trim();
        } else {
            data[name] = el.value ?? el?.textContent ?? "";
        }
    }
    return data;
}

export function setJsonObject(scope, data) {
    scope = typeof scope === "string" ? document.querySelector(scope) : scope;
    const els = scope.querySelectorAll('[name]:not([name=""])');

    for (const el of els) {
        const name = el.name || el.getAttribute("name");
        if (!name || !(name in data)) continue;

        const val = data[name];
        if (el.type === "radio") {
            el.checked = String(el.value) === String(val);
        } else if (el.type === "checkbox") {
            el.checked = Array.isArray(val) ? val.includes(el.value) : String(el.value) === String(val);
        } else if (typeof el.checked === "boolean") {
            el.checked = !!val;
        } else {
            el.value = val ?? "";
        }
    }
}
