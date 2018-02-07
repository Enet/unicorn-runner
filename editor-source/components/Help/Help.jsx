import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import './Help.styl';

export default class Help extends Tcaer.Component {
    render () {
        const className = [
            `help`,
            `help_opened_${!!this.props.opened}`
        ];

        return <div className={className}>
            <div className="help__cell">
                <div className="help__container">
                    You can use hotkeys for<br />
                    the most frequent operations.<br />
                    <strong className="help__hotkey">C</strong> - select cursor<br />
                    <strong className="help__hotkey">T</strong> - select tile<br />
                    <strong className="help__hotkey">Z</strong> - select previous entity<br />
                    <strong className="help__hotkey">BACKSPACE</strong> - remove selected entity<br />
                    <strong className="help__hotkey">CTRL</strong> - use sticky edges<br />
                    <strong className="help__hotkey">E</strong> - open code editor<br />
                    <strong className="help__hotkey">ESC</strong> - close code editor<br />
                    <button
                        className="help__button"
                        onClick={this._onCloseButtonClick}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    }

    @autobind
    _onCloseButtonClick () {
        this.props.onClose && this.props.onClose();
    }
}
