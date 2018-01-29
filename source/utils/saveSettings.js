export default function saveSettings (settings) {
    try {
        for (let s in settings) {
            localStorage.setItem(s, settings[s] ? '1' : '');
        }
    } catch (error) {
        console.error(error);
    }
    return settings;
}
