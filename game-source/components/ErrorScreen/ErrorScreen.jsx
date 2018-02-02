import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import Screen from 'components/Screen/Screen.jsx';
import Button from 'components/Button/Button.jsx';
import I18n from 'utils/I18n.js';
import fullscreenMode from 'utils/fullscreenMode.js';

import dictionary from './ErrorScreen.json';
import './ErrorScreen.styl';

const i18n = new I18n(dictionary);

export default class ErrorScreen extends Screen {
    renderSubheader () {

    }

    renderContent () {
        return <nav className="screen__content error-screen__content">
            <Button
                className="error-screen__back-button"
                onClick={this._onRepeatButtonClick}>
                {i18n.get(this, 'repeat')}
            </Button>
            <br />
            <Button
                className="error-screen__quit-button"
                onClick={this._onQuitButtonClick}>
                {i18n.get(this, 'quit')}
            </Button>
        </nav>
    }

    _getHeaderText () {
        return i18n.get(this, 'header');
    }

    _getBaseName () {
        return 'error-screen';
    }

    _onEscapeKeyDown () {
        this._onQuitButtonClick();
    }

    @autobind
    _onRepeatButtonClick () {
        this.props.dispatch({
            type: 'GAME_RESET'
        });
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'spinner'
        });
        fullscreenMode.start();
    }

    @autobind
    _onQuitButtonClick () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'menu'
        });
        this.props.dispatch({
            type: 'GAME_RESET'
        });
        fullscreenMode.stop();
    }

    @autobind
    _onOneKeyDown () {
        this._onRepeatButtonClick();
    }

    @autobind
    _onTwoKeyDown () {
        this._onQuitButtonClick();
    }
}
