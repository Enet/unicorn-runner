import Tcaer from 'tcaer';

import './Health.styl';

export default class Health extends Tcaer.Component {
    render () {
        return <div className="health">
            <p className="health__label">health</p>
            <p className="health__value" id="health">
                {this.props.value}
            </p>
        </div>
    }
}
