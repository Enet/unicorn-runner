import {
    enqueueTask
} from 'tcaer/utils';
import autobind from 'tcaer/autobind';

const defaultMapStateToProps = () => ({});

export default function connect (mapStateToProps) {
    mapStateToProps = mapStateToProps || defaultMapStateToProps;
    return function (Component) {
        return class WrappedComponent extends Component {
            @autobind
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
                const {store} = this.context;
                store.addListener('change', this._onStoreChange);
                super.componentWillMount(...arguments);
            }

            componentWillUnmount () {
                const {store} = this.context;
                store.removeListener('change', this._onStoreChange);
                super.componentWillUnmount(...arguments);
            }

            @autobind
            _onStoreChange () {
                enqueueTask(this['@@updateComponentState']);
                enqueueTask(this['@@renderComponentVnode']);
            }
        }
    }
}
