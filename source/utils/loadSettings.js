const transform = {
    boolean: (item) => {
        return !!item;
    },
    number: (item) => {
        item = +item;
        return isNaN(item) ? null : item;
    }
};

export default function loadSettings (defaultSettings={}, type='boolean') {
    const settings = {...defaultSettings};
    for (let s in settings) {
        let setting = settings[s];
        try {
            setting = localStorage.getItem(s);
            if (setting !== null) {
                const value = transform[type](setting);
                if (value !== null) {
                    setting = value;
                }
            }
        } catch (error) {
            console.error(error);
        }
        settings[s] = setting;
    }
    return settings;
}
