const defaultState = {
    debug: true,
    inited: false,
    paused: true,
    key: 0,
    step: 0,
    score: 0,
    health: 100,
    effects: []
};

export default function (state=defaultState, action) {
    if (action.type === 'GAME_PAUSE') {
        return {
            ...state,
            paused: true
        };
    }

    if (action.type === 'GAME_RESUME') {
        return {
            ...state,
            paused: false
        };
    }

    if (action.type === 'GAME_RESET') {
        return {
            ...defaultState,
            step: state.step,
            key: state.key + 1
        };
    }

    if (action.type === 'GAME_SELECT_STEP') {
        return {
            ...state,
            step: +action.payload,
            inited: true,
            paused: false
        };
    }

    if (action.type === 'GAME_SCORE_CHANGE') {
        return {
            ...state,
            score: +action.payload
        };
    }

    if (action.type === 'GAME_HEALTH_CHANGE') {
        return {
            ...state,
            health: +action.payload
        };
    }

    if (action.type === 'GAME_EFFECT_CHANGE') {
        return {
            ...state,
            effects: action.effects
        };
    }

    return state;
}
