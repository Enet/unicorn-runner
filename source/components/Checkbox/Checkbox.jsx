import Tcaer from 'tcaer';

import './Checkbox.styl';

export default class Checkbox extends Tcaer.Component {
    render () {
        return <label className="checkbox">
            <input type="checkbox" name={this.props.name} />
            {this.children}
        </label>
    }
}
