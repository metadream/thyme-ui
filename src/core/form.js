export function getJsonData(scope) {
    const data = {};
    const els = scope.querySelectorAll('[name]');
    for (const el of els) {
        const name = el.name || el.getAttribute('name');
        if (!name) continue;

        if (typeof el.checked === 'boolean' && !el.checked) continue;

        if (el.type === 'checkbox') {
            if (!Array.isArray(data[name])) data[name] = [];
            data[name].push(el.value ?? 'on');
        } else {
            data[name] = el.value ?? '';
        }
    }
    return data;
}

export function setJsonData(scope, data) {
    const els = scope.querySelectorAll('[name]');
    for (const el of els) {
        const name = el.name || el.getAttribute('name');
        if (!name || !(name in data)) continue;
        const val = data[name];

        if (el.type === 'radio') {
            el.checked = String(el.value) === String(val);
        } else if (el.type === 'checkbox') {
            el.checked = Array.isArray(val) ? val.includes(el.value) : String(el.value) === String(val);
        } else if (typeof el.checked === 'boolean') {
            el.checked = !!val;
        } else {
            el.value = val ?? '';
        }
    }
}
