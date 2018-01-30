import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import Screen from 'components/Screen/Screen.jsx';
import I18n from 'utils/I18n.js';

import dictionary from './PauseScreen.json';

const i18n = new I18n(dictionary);

export default class PauseScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `pause-screen`
        ];

        return <section className={className}>
            <h2 className="pause-screen__header">
                {i18n.get(this, 'header')}
            </h2>
            <span
                dataHover={true}
                dataClick={true}
                className="pause-screen__back-button"
                onClick={this._onResumeButtonClick}>
                {i18n.get(this, 'resume')}
            </span>
            <span
                dataHover={true}
                dataClick={true}
                className="pause-screen__menu-button"
                onClick={this._onMenuButtonClick}>
                {i18n.get(this, 'menu')}
            </span>
        </section>
    }

    _onEscapeKeyDown () {
        this._onResumeButtonClick();
    }

    @autobind
    _onResumeButtonClick () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'game'
        });
        this.props.dispatch({
            type: 'GAME_RESUME'
        });
    }

    @autobind
    _onMenuButtonClick () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'menu'
        });
        this.props.dispatch({
            type: 'GAME_RESET'
        });
    }
}
