import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import './Checkbox.styl';

export default class Checkbox extends Tcaer.Component {
    render () {
        return <label dataHover={true} className="checkbox">
            <input
                className="checkbox__input"
                onChange={this._onChange}
                checked={!!this.props.value}
                type="checkbox"
                name={this.props.name} />
            <div className="checkbox__circle">✔</div>
            {this.children}
        </label>
    }

    @autobind
    _onChange (event) {
        this.props.onChange && this.props.onChange(event);
    }
}
