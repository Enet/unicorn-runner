import Tcaer from 'tcaer';

import './Health.styl';

export default class Health extends Tcaer.Component {
    render () {
        return <div className="health">
            <p className="health__label">
                {this.children}
            </p>
            <div className="health__container">
                <div
                    className="health__value"
                    style={`width: ${this.props.value}%`} />
            </div>
        </div>
    }
}
