import Sound from 'engine/Sound.js';

function play (manager, soundName, options={}) {
    new Sound({
        buffer: manager.getSound(soundName),
        ...options
    }).play();
}

const defaultState = {
    manager: null
};

export default function (state=defaultState, action) {
    if (action.type === 'SOUND_MANAGER_READY') {
        return {manager: action.payload};
    }

    const {manager} = state;
    if (!manager) {
        return state;
    }

    if (action.type === 'SETTING_CHANGE') {
        play(manager, 'MenuClick');
    }

    return state;
}
