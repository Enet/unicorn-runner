import EventEmitter from 'events';

export default class Store extends EventEmitter {
    constructor (rootReducer, initialState={}) {
        super();
        this.dispatch = this.dispatch.bind(this);

        this._rootReducer = rootReducer;
        this.state = initialState;
        this.dispatch({
            type: '@@xuder/INIT'
        });
    }

    dispatch (action) {
        const prevState = this.state;
        if (typeof action === 'function') {
            action(() => prevState, this.dispatch);
            return;
        }

        const newState = this._rootReducer(this.state, action);
        this.state = newState;
        this.emit('change', prevState, newState);
    }
}
