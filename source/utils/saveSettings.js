const transform = {
    boolean: (value) => {
        return value ? '1' : '';
    },
    number: (value) => {
        return +value || 0;
    }
};

export default function saveSettings (settings, type='boolean') {
    try {
        for (let s in settings) {
            localStorage.setItem(s, transform[type](settings[s]));
        }
    } catch (error) {
        console.error(error);
    }
    return settings;
}
