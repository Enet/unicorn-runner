import Tcaer from 'tcaer';

import './Effects.styl';

export default class Effects extends Tcaer.Component {
    render () {
        return <div className="effects">
            <p className="effects__label">effects</p>
            <p className="effects__value">
                {this.props.value.join(', ')}
            </p>
        </div>
    }
}
