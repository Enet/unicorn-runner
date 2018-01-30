import Tcaer from 'tcaer';

import './Score.styl';

export default class Score extends Tcaer.Component {
    render () {
        return <div className="score">
            <p className="score__label">
                {this.children}
            </p>
            <p className="score__value">
                {this.props.value}
            </p>
        </div>
    }
}
