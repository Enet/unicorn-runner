import {
    renderVnode,
    enqueueTask
} from './utils.js';

export default class Component {
    '@@updateComponentState' (props, children, context) {
        props = props || this.props;
        children = children || this.children;
        context = context || this.context;
        Object.assign(this, {props, children, context});
    }

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
        this['@@updateComponentState'] = this['@@updateComponentState'].bind(this);
        this['@@renderComponentVnode'] = this['@@renderComponentVnode'].bind(this);
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
