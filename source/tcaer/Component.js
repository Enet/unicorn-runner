import {
    renderVnode,
    enqueueTask
} from './utils.js';
import autobind from './autobind.js';

export default class Component {
    @autobind
    '@@updateComponentState' (props, children, context) {
        props = props || this.props;
        children = children || this.children;
        context = context || this.context;
        const {state} = this;
        const prevProps = this.props;
        const prevChildren = this.children;
        const prevContext = this.context;

        if (this.state) {
            this.componentWillUpdate(props, children, state, context);
            Object.assign(this, {props, children, context});
            this.componentDidUpdate(prevProps, prevChildren, state, prevContext);
        } else {
            this.state = {};
            Object.assign(this, {props, children, context});
        }
    }

    @autobind
    '@@renderComponentVnode' () {
        const node = this['@@node'];
        const {parentNode} = node;
        const index = Array.from(parentNode.childNodes).indexOf(node);
        const newComponentVnode = this.render();
        const prevComponentVnode = this['@@vnode'];
        renderVnode(
            newComponentVnode,
            prevComponentVnode,
            parentNode,
            this.context,
            index
        );
        this['@@vnode'] = newComponentVnode;
    }

    render () {

    }

    forceUpdate () {
        this['@@updateComponentState']();
        this['@@renderComponentVnode']();
    }

    setState (deltaState={}) {
        enqueueTask(() => {
            const {props, children, state, context} = this;
            const prevState = state;
            const newState = {...prevState};
            for (let d in deltaState) {
                newState[d] = deltaState[d];
            }
            this.componentWillUpdate(props, children, newState, context);
            this.state = newState;
            this.componentWillUpdate(props, children, prevState, context);
        });
        enqueueTask(this['@@renderComponentVnode']);
    }

    componentWillMount () {

    }

    componentDidMount () {

    }

    componentWillUpdate (nextProps) {

    }

    componentDidUpdate (prevProps) {

    }

    componentWillUnmount () {

    }
}
