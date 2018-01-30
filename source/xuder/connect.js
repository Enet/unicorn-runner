import {
    enqueueTask
} from 'tcaer/utils.js';

export default function connect (mapStateToProps, Component) {
    return class WrappedComponent extends Component {
        '@@updateComponentState' (props, children, context) {
            props = props || this.props;
            children = children || this.children;
            context = context || this.context;

            const {store} = context;
            const xuderProps = mapStateToProps(store.state);
            props = {
                ...props,
                ...xuderProps,
                dispatch: store.dispatch
            };
            super['@@updateComponentState'](props, children, context);
        }

        componentWillMount () {
            this._onStoreChange = this._onStoreChange.bind(this);
            const {store} = this.context;
            store.addListener('change', this._onStoreChange);
        }

        componentWillUnmount () {
            const {store} = this.context;
            store.removeListener('change', this._onStoreChange);
        }

        _onStoreChange () {
            enqueueTask(this['@@updateComponentState']);
            enqueueTask(this['@@renderComponentVnode']);
        }
    }
}
