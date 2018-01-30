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
        Object.assign(this, {props, children, context});
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

    constructor () {
        this.state = {};
    }

    render () {

    }

    forceUpdate () {
        this['@@updateComponentState']();
        this['@@renderComponentVnode']();
    }

    setState (deltaState={}) {
        enqueueTask(() => {
            for (let d in deltaState) {
                this.state[d] = deltaState[d];
            }
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
