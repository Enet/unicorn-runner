export default function combineReducers (reducers) {
    return (state, action) => {
        const newState = {};
        for (let r in reducers) {
            newState[r] = reducers[r](state[r], {...action});
        }
        return newState;
    };
}
