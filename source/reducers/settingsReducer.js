import loadSettings from 'utils/loadSettings.js';
import saveSettings from 'utils/saveSettings.js';

const defaultState = loadSettings({
    music: true,
    sound: true,
    mirror: false
});

export default function (state=defaultState, action) {
    if (action.type === 'SETTING_CHANGE') {
        return saveSettings({
            ...state,
            [action.name]: !!action.value
        });
    }
    return state;
}
