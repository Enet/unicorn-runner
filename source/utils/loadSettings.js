export default function loadSettings (defaultSettings={}) {
    const settings = defaultSettings;
    for (let s in settings) {
        let setting = settings[s];
        try {
            setting = localStorage.getItem(s);
            setting = setting === null ? setting : !!setting;
        } catch (error) {
            console.error(error);
        }
        settings[s] = setting;
    }
    return settings;
}
