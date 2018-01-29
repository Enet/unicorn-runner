import {
    renderVnode
} from './utils.js';

export default class Component {
    constructor () {
        this.forceUpdate = this.forceUpdate.bind(this);
        this.state = {};
    }

    render () {

    }

    update (props, children, context) {
        this.props = props;
        this.children = children;
        this.context = context;
    }

    forceUpdate () {
        const {node} = this;
        const {parentNode} = node;
        const index = Array.from(parentNode.childNodes).indexOf(node);
        this.update(this.props, this.children, this.context);
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
