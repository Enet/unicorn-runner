import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import './Button.styl';

export default class Button extends Tcaer.Component {
    render () {
        const {disabled} = this.props;
        const className = [
            this.props.className || '',
            `button`,
            `button_disabled_${!!disabled}`
        ];

        return <div
            className={className}
            dataClick={!disabled}
            dataHover={!disabled}
            onClick={this._onClick}>
            {this.children}
        </div>
    }

    @autobind
    _onClick (event) {
        if (this.props.disabled) {
            return;
        }
        this.props.onClick && this.props.onClick(event);
    }
}
