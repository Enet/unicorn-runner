import loadSettings from 'utils/loadSettings.js';
import saveSettings from 'utils/saveSettings.js';

const defaultState = {
    step0: 0,
    step1: 0,
    step2: 0,
    step3: 0,
    progress: 0
};
const loadedState = loadSettings(defaultState, 'number');

export default function (state=loadedState, action) {
    if (action.type === 'STEP_RESET') {
        return saveSettings(defaultState, 'number');
    }

    if (action.type === 'STEP_COMPLETE') {
        if (!(action.step >= 0 && action.step <= 3)) {
            return state;
        }

        const deltaState = {};
        const settingName = `step${action.step}`;
        const {progress} = state;
        if (action.payload > state[settingName]) {
            deltaState[settingName] = action.payload;
        }
        if (progress === action.step) {
            deltaState.progress = progress + 1;
        }

        return saveSettings({
            ...state,
            ...deltaState
        }, 'number');
    }

    return state;
}
