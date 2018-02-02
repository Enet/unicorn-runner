import Tcaer from 'tcaer';

import './Score.styl';

const trendMap = {
    '-1': 'down',
    '0': 'zero',
    '1': 'up'
};

export default class Score extends Tcaer.Component {
    render () {
        const className = [
            `score`,
            `score_trend_${trendMap[Math.sign(this.props.value - this.state.value)]}`
        ];
        return <div className={className}>
            <p className="score__label">
                {this.children}
            </p>
            <div className="score__value">
                {this.state.value}
            </div>
        </div>
    }

    componentWillMount () {
        this.state.value = this.props.value;
    }

    componentDidUpdate () {
        const delta = Math.sign(this.props.value - this.state.value);
        delta && setTimeout(() => this.setState({value: this.state.value + delta}));
    }
}
