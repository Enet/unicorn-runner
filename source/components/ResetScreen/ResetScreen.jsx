import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import Screen from 'components/Screen/Screen.jsx';
import Button from 'components/Button/Button.jsx';
import I18n from 'utils/I18n.js';

import dictionary from './ResetScreen.json';
import './ResetScreen.styl';

const i18n = new I18n(dictionary);

export default class ResetScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `reset-screen`
        ];

        return <section className={className}>
            <h2 className="reset-screen__header">
                {i18n.get(this, 'header')}
            </h2>
            <nav className="reset-screen__menu">
                <Button
                    onClick={this._onYesButtonClick}>
                    {i18n.get(this, 'yes')}
                </Button>
                <br />
                <Button
                    onClick={this._onNoButtonClick}>
                    {i18n.get(this, 'no')}
                </Button>
            </nav>
        </section>
    }

    _onEscapeKeyDown () {
        this._onAnswer();
    }

    @autobind
    _onYesButtonClick () {
        this._onAnswer();
    }

    @autobind
    _onNoButtonClick () {
        this._onAnswer();
    }

    @autobind
    _onAnswer () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'map'
        });
    }
}
