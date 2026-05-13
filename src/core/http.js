function hasHeader(headers, name) {
    if (!headers) return false;
    const key = name.toLowerCase();
    for (const k of Object.keys(headers)) {
        if (k.toLowerCase() === key) return true;
    }
    return false;
}

function serializeBody(body) {
    if (body == null || body === undefined) return null;
    if (typeof body === 'string' || body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob || body instanceof ArrayBuffer) {
        return body;
    }
    return JSON.stringify(body);
}

function getContentType(body) {
    if (body == null) return null;
    if (typeof body === 'string') return 'text/plain';
    if (body instanceof URLSearchParams) return 'application/x-www-form-urlencoded';
    if (typeof body === 'object' && !(body instanceof FormData) && !(body instanceof Blob) && !(body instanceof ArrayBuffer)) {
        return 'application/json';
    }
    return null;
}

async function parseResponse(response) {
    const ct = response.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
        return response.json();
    }
    return response.text();
}

async function request(url, options = {}) {
    const { method = 'GET', body, headers: reqHeaders, ...rest } = options;

    let finalBody = body;
    let finalHeaders = reqHeaders ? { ...reqHeaders } : {};

    if (finalBody !== undefined && finalBody !== null) {
        if (!hasHeader(finalHeaders, 'Content-Type')) {
            const ct = getContentType(finalBody);
            if (ct) finalHeaders['Content-Type'] = ct;
        }
        finalBody = serializeBody(finalBody);
    }

    const response = await fetch(url, { method, headers: finalHeaders, body: finalBody, ...rest });

    if (!response.ok) {
        let errorBody;
        try {
            errorBody = await response.text();
        } catch { }
        const err = new Error(`HTTP ${response.status}: ${response.statusText}`);
        err.status = response.status;
        if (errorBody) err.body = errorBody;
        throw err;
    }

    return parseResponse(response);
}

export const methods = {
    get: (url, options) => request(url, { ...options, method: 'GET' }),
    post: (url, body, options) => request(url, { ...options, method: 'POST', body }),
    put: (url, body, options) => request(url, { ...options, method: 'PUT', body }),
    patch: (url, body, options) => request(url, { ...options, method: 'PATCH', body }),
    delete: (url, options) => request(url, { ...options, method: 'DELETE' }),
};
