import loadSettings from 'utils/loadSettings.js';
import saveSettings from 'utils/saveSettings.js';

function booleanToLocale (value) {
    return value ? 'ru' : 'en';
}

function localeToBoolean (locale) {
    return locale === 'ru';
}

function isAvailableLocale (locale) {
    return locale === 'ru' || locale === 'en';
}

const defaultState = booleanToLocale(loadSettings({
    locale: localeToBoolean('ru')
}).locale);

export default function (state=defaultState, action) {
    if (action.type === 'LOCALE_CHANGE' && isAvailableLocale(action.payload)) {
        const locale = localeToBoolean(action.payload);
        return booleanToLocale(saveSettings({locale}).locale);
    }

    return state;
}
