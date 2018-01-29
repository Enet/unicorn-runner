import Tcaer from 'tcaer';

import './Checkbox.styl';

export default class Checkbox extends Tcaer.Component {
    render () {
        return <label className="checkbox">
            <input
                onChange={this._onChange.bind(this)}
                checked={!!this.props.value}
                type="checkbox"
                name={this.props.name} />
            {this.children}
        </label>
    }

    _onChange (event) {
        this.props.onChange && this.props.onChange(event);
    }
}
