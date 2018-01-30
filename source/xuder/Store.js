import EventEmitter from 'events';

export default class Store extends EventEmitter {
    constructor (rootReducer, initialState={}) {
        super();
        this.dispatch = this.dispatch.bind(this);
        this.state = initialState;
        this._rootReducer = rootReducer;

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

        const newState = this._rootReducer(prevState, action);
        this.state = newState;
        this.emit('change', prevState, newState);
    }
}
