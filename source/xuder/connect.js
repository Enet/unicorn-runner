export default function connect (mapStateToProps, Component) {
    return class WrappedComponent extends Component {
        update (props, children, context) {
            const {store} = context;
            const xuderProps = mapStateToProps(store.state);
            props = {
                ...props,
                ...xuderProps,
                dispatch: store.dispatch
            };
            super.update(props, children, context);
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
