export default function expandSettings (flatSettings) {
    const settings = {};
    for (let flatSettingName in flatSettings) {
        let localSettings = settings;
        const propertyNames = flatSettingName.split('.');
        for (let p = 0, pl = propertyNames.length; p < pl; p++) {
            const propertyName = propertyNames[p];
            if (p === pl - 1) {
                localSettings[propertyName] = flatSettings[flatSettingName];
            } else {
                if (!localSettings[propertyName]) {
                    localSettings[propertyName] = isNaN(+propertyName) ? {} : [];
                }
                localSettings = localSettings[propertyName];
            }
        }
    }
    return settings;
}
