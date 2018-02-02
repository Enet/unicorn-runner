const defaultState = 'menu';
const availableScreenNames = [
    'spinner', 'game', 'pause', 'loser', 'winner',
    'map', 'menu', 'settings', 'reset', 'error'
];

export default function (state=defaultState, action) {
    if (action.type === 'SCREEN_CHANGE' &&
        availableScreenNames.indexOf(action.payload) !== -1) {
        return action.payload;
    }
    return state;
}
