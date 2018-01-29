export default class Component {
    constructor (props) {
        this.props = props;
        this.state = {};
    }

    render () {

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
