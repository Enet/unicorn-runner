import loadSettings from 'utils/loadSettings.js';
import saveSettings from 'utils/saveSettings.js';

const defaultState = {
    sound: true,
    music: true,
    mirror: false
};
const loadedState = loadSettings(defaultState);

export default function (state=loadedState, action) {
    if (action.type === 'SETTING_CHANGE') {
        return saveSettings({
            ...state,
            [action.name]: !!action.value
        });
    }
    return state;
}
