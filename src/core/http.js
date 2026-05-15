import { locale } from "./locale.js";

async function request(method, url, data, opts) {
    const defaultHeaders = {};
    if (!(data instanceof FormData)) {
        defaultHeaders["content-type"] = "application/json; charset=utf-8";
    }
    const options = {
        method,
        headers: defaultHeaders,
        body: data instanceof FormData ? data : JSON.stringify(data),
    };
    Object.assign(options, opts, {
        headers: { ...defaultHeaders, ...opts?.headers },
    });

    try {
        const response = await fetch(url, options);
        const contentType = response.headers.get("content-type");
        let result = null;

        if (!contentType || /^text\//.test(contentType)) {
            result = await response.text();
        } else if (contentType.includes("application/json")) {
            result = await response.json();
        } else {
            result = await response.blob();
        }
        if (!response.ok) {
            throw new Error(result.message);
        }
        return result;
    } catch (e) {
        Thyme.error(e.message || locale.translate("unknown.error"));
        throw e;
    }
}

export const methods = {
    get: (url, opts) => request("GET", url, undefined, opts),
    post: (url, data, opts) => request("POST", url, data, opts),
    put: (url, data, opts) => request("PUT", url, data, opts),
    patch: (url, data, opts) => request("PATCH", url, data, opts),
    delete: (url, opts) => request("DELETE", url, undefined, opts),
};
