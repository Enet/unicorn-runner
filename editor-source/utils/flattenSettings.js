export default function flattenSettings (settings, flatSettings={}, initialSettingName='') {
    const settingNames = Object.keys(settings);
    for (let settingName of settingNames) {
        const flatSettingName = initialSettingName + '.' + settingName;
        const setting = settings[settingName];
        if (typeof setting === 'string' ||
            typeof setting === 'number' ||
            typeof setting === 'boolean') {
            flatSettings[flatSettingName.replace(/^\./, '')] = setting;
        } else {
            flattenSettings(setting, flatSettings, flatSettingName);
        }
    }
    return flatSettings;
}
