const transform = {
    boolean: (value) => {
        return value ? '1' : '';
    },
    number: (value) => {
        value = +value;
        return isNaN(value) ? 0 : value;
    }
};

export default function saveSettings (settings, type='boolean') {
    try {
        for (let s in settings) {
            localStorage.setItem(s, transform[type](settings[s]));
        }
    } catch (error) {
        // eslint-disable-next-line
        console.error(error);
    }
    return settings;
}
