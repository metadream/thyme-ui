export const locale = {
    current: 'en',
    strings: {
        en: {
            'datepicker.aria': 'Select date',
            'weekday.labels': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        },
        zh: {
            'datepicker.aria': '选择日期',
            'weekday.labels': ['一', '二', '三', '四', '五', '六', '日'],
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
