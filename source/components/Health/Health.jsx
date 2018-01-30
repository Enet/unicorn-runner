import Tcaer from 'tcaer';

import './Health.styl';

export default class Health extends Tcaer.Component {
    render () {
        return <div className="health">
            <p className="health__label">
                {this.children}
            </p>
            <p className="health__value">
                {this.props.value}
            </p>
        </div>
    }
}
