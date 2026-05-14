export function delay(delayInms) {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
}

/**
 * Nano Id without '-' and '_'
 * @see https://github.com/ai/nanoid/blob/main/index.browser.js
 * @param {number} size
 */
export function nanoId(size = 24) {
    return crypto.getRandomValues(new Uint8Array(size)).reduce((id, byte) => {
        byte &= 61;
        if (byte < 36) {
            id += byte.toString(36);
        } else {
            id += (byte - 26).toString(36).toUpperCase();
        }
        return id;
    }, "");
}

/**
 * Format date with pattern string
 * @param {Date} date
 * @param {string} pattern
 * @param {Boolean} utc
 * @returns {string}
 */
export function formatDate(date, pattern, utc) {
    const get = utc ? "getUTC" : "get";
    return pattern
        .replace(/yyyy/g, date[get + "FullYear"]())
        .replace(/yy/g, ("" + date[get + "FullYear"]()).slice(-2))
        .replace(/MM/g, ("0" + (date[get + "Month"]() + 1)).slice(-2))
        .replace(/M/g, date[get + "Month"]() + 1)
        .replace(/dd/g, ("0" + date[get + "Date"]()).slice(-2))
        .replace(/d/g, date[get + "Date"]())
        .replace(/hh/g, ("0" + date[get + "Hours"]()).slice(-2))
        .replace(/h/g, date[get + "Hours"]())
        .replace(/mm/g, ("0" + date[get + "Minutes"]()).slice(-2))
        .replace(/m/g, date[get + "Minutes"]())
        .replace(/ss/g, ("0" + date[get + "Seconds"]()).slice(-2))
        .replace(/s/g, date[get + "Seconds"]())
        .replace(/SSS/g, ("00" + date[get + "Milliseconds"]()).slice(-3))
        .replace(/S/g, date[get + "Milliseconds"]());
}

/**
 * Format a number with a specified max length of decimal
 * @param {*} number
 * @param {*} digits
 * @returns
 */
export function formatDecimal(number, digits) {
    return parseFloat(number.toFixed(digits));
}

/**
 * Format a number as a thousand-separated currency
 * @param {Number} number
 */
export function formatMoney(number) {
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,");
}

/**
 * Format the number of bytes to be easily recognizable by humans
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
    if (!bytes || bytes < 1) return "0";
    const unit = ["B", "KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB"];
    const base = Math.min(unit.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
    const scale = Math.max(0, base - 2);
    return parseFloat((bytes / Math.pow(1024, base)).toFixed(scale)) + " " + unit[base];
}

/**
 * Parse format string into milliseconds
 * @param {string} s
 * @returns {number}
 */
export function parseDuration(s) {
    if (!s) return 0;
    const m = s.trim().match(/^(\d{2}):(\d{2}):(\d{2})(\.\d{1,3})?$/);
    if (!m) return 0;

    const hours = parseInt(m[1], 10);
    const minutes = parseInt(m[2], 10);
    const seconds = parseInt(m[3], 10);
    const ms = parseFloat(m[4]) || 0;

    if (hours > 59 || minutes > 59 || seconds > 59) return 0;
    return (hours * 60 + minutes) * 60 + seconds + ms;
}

/**
 * Format seconds to d h m s
 * @param seconds
 * @returns
 */
export function formatSeconds(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return (
        (d > 0 ? d + "d " : "") +
        (h > 0 ? h + "h " : "") +
        (m > 0 ? m + "m " : "") +
        (s > 0 ? s + "s" : "")
    ).trim();
}

/**
 * Base64 Encode
 * @param {string} str
 * @returns
 */
export function base64Encode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, m) => String.fromCharCode("0x" + m)));
}
