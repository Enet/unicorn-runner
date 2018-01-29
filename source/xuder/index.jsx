import EventEmitter from 'events';
import Tcaer from 'tcaer';

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

export {Store};

export function connect (mapStateToProps, Component) {
    return class WrappedComponent extends Tcaer.Component {
        render () {
            const {store} = this.context;
            const xuderProps = mapStateToProps(store.state);
            return <Component
                {...xuderProps}
                dispatch={store.dispatch}
                {...this.props}>
                {this.props.children}
            </Component>
        }

        componentWillMount () {
            const {store} = this.context;
            store.addListener('change', this.forceUpdate);
        }

        componentWillUnmount () {
            const {store} = this.context;
            store.removeListener('change', this.forceUpdate);
        }
    }
}

export function combineReducers (reducers) {
    return (state, action) => {
        const newState = {};
        for (let r in reducers) {
            newState[r] = reducers[r](state[r], {...action});
        }
        return newState;
    };
}
