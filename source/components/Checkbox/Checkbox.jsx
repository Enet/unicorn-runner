import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import './Checkbox.styl';

export default class Checkbox extends Tcaer.Component {
    render () {
        return <label className="checkbox">
            <input
                dataHover={true}
                onChange={this._onChange}
                checked={!!this.props.value}
                type="checkbox"
                name={this.props.name} />
            {this.children}
        </label>
    }

    @autobind
    _onChange (event) {
        this.props.onChange && this.props.onChange(event);
    }
}
