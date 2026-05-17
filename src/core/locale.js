export const locale = {
    current: "en",
    strings: {
        en: {
            "unsupported.response": "Unsupported response type",
            "unknown.error": "Unknown error",
            "weekday.labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            "alert.ok": "OK",
            "confirm.ok": "OK",
            "confirm.cancel": "Cancel",
            "select.required": "Field is required",
            "field.required": "Field is required",
            "field.minlength": "Minimum {n} characters",
            "field.maxlength": "Maximum {n} characters",
            "field.date.format": "Invalid date format (yyyy-mm-dd)",
            "field.date.invalid": "Invalid date",
            "field.date.min": "Earliest date is {min}",
            "field.date.max": "Latest date is {max}",
        },
        zh: {
            "unsupported.response": "不支持的响应类型",
            "unknown.error": "未知错误",
            "weekday.labels": ["一", "二", "三", "四", "五", "六", "日"],
            "alert.ok": "确定",
            "confirm.ok": "确定",
            "confirm.cancel": "取消",
            "select.required": "此字段为必选项",
            "field.required": "此字段为必填项",
            "field.minlength": "最少 {n} 个字符",
            "field.maxlength": "最多 {n} 个字符",
            "field.date.format": "日期格式错误 (yyyy-mm-dd)",
            "field.date.invalid": "无效日期",
            "field.date.min": "最早日期为 {min}",
            "field.date.max": "最晚日期为 {max}",
        },
    },

    translate(key) {
        const str = this.strings[this.current]?.[key];
        return str !== undefined ? str : key;
    },

    setLang(lang) {
        if (this.strings[lang]) {
            this.current = lang;
            return true;
        }
        return false;
    },
};
