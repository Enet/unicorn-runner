import Sound from 'engine/Sound.js';
import loadSettings from 'utils/loadSettings.js';

function play (manager, soundName, options={}) {
    new Sound({
        buffer: manager.getSound(soundName),
        ...options
    }).play();
}

const defaultState = {
    manager: null,
    sound: loadSettings({sound: true}).sound
};

export default function (state=defaultState, action) {
    if (action.type === 'SOUND_MANAGER_READY') {
        return {
            ...state,
            manager: action.payload
        };
    }

    if (action.type === 'SETTING_CHANGE' && action.name === 'sound') {
        state = {
            ...state,
            sound: !!action.value
        };
    }

    const {manager} = state;
    if (!manager || !state.sound) {
        return state;
    }

    if (action.type === 'SOUND_HOVER') {
        play(manager, 'MenuHover', {amplitude: 0.25});
    }

    if (action.type === 'SOUND_CLICK') {
        play(manager, 'MenuClick');
    }

    if (action.type === 'SETTING_CHANGE') {
        play(manager, 'MenuClick');
    }

    if (action.type === 'SCREEN_CHANGE') {
        play(manager, 'MenuTransition', {amplitude: 0.25});
    }

    return state;
}
