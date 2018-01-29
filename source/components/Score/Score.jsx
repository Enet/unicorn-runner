import Tcaer from 'tcaer';

import './Score.styl';

export default class Score extends Tcaer.Component {
    render () {
        return <div className="score">
            <p className="score__label">score</p>
            <p className="score__value" id="score">
                {this.props.value}
            </p>
        </div>
    }
}
