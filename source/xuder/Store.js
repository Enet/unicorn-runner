import EventEmitter from 'events';
import autobind from 'tcaer/autobind';

export default class Store extends EventEmitter {
    constructor (rootReducer, initialState={}) {
        super();
        this.state = initialState;
        this._rootReducer = rootReducer;

        this.setMaxListeners(100);
        this.dispatch({
            type: '@@xuder/INIT'
        });
    }

    @autobind
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
