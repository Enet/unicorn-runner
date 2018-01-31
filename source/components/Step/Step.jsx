import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import './Step.styl';

export default class Step extends Tcaer.Component {
    render () {
        const isDisabled = !!this.props.disabled;
        const className = [
            this.props.className || '',
            `step`,
            `step_disabled_${isDisabled}`
        ];

        return <div
            className={className}
            dataClick={!isDisabled}
            dataHover={!isDisabled}
            onClick={this._onClick}>
            <img src={this.props.image} />
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
