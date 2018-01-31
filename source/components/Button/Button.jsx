import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import './Button.styl';

export default class Button extends Tcaer.Component {
    render () {
        const className = [
            this.props.className || '',
            `button`
        ];

        return <div
            className={className}
            dataClick={true}
            dataHover={true}
            onClick={this._onClick}>
            {this.children}
        </div>
    }

    @autobind
    _onClick (event) {
        this.props.onClick && this.props.onClick(event);
    }
}
