export const locale = {
    current: 'en',
    strings: {
        en: {
            'datepicker.aria': 'Select date',
            'weekday.labels': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            'alert.ok': 'OK',
            'confirm.ok': 'OK',
            'confirm.cancel': 'Cancel',
        },
        zh: {
            'datepicker.aria': '选择日期',
            'weekday.labels': ['一', '二', '三', '四', '五', '六', '日'],
            'alert.ok': '确定',
            'confirm.ok': '确定',
            'confirm.cancel': '取消',
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
