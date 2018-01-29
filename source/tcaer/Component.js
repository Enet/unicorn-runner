import {
    renderVnode
} from './utils.js';

export default class Component {
    constructor (props, children, context) {
        this.forceUpdate = this.forceUpdate.bind(this);
        this.props = props;
        this.children = children;
        this.context = context;
        this.state = {};
    }

    render () {

    }

    forceUpdate () {
        const {node} = this;
        const {parentNode} = node;
        const index = Array.from(parentNode.childNodes).indexOf(node);
        const newComponentVnode = this.render();
        renderVnode(
            newComponentVnode,
            this.prevComponentVnode,
            parentNode,
            this.context,
            index
        );
        this.prevComponentVnode = newComponentVnode;
    }

    setState (deltaState) {
        requestAnimationFrame(() => {
            for (let d in deltaState) {
                this.state[d] = deltaState[d];
            }
            this.forceUpdate();
        });
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
