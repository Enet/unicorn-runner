import Tcaer from 'tcaer';
import Screen from 'components/Screen/Screen.jsx';

export default class PauseScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `pause-screen`
        ];

        return <section className={className}>
            <h2 className="pause-screen__header">
                Пауза
            </h2>
            <span
                className="pause-screen__back-button"
                onClick={this._onResumeButtonClick.bind(this)}>
                Назад
            </span>
            <span
                className="pause-screen__menu-button"
                onClick={this._onMenuButtonClick.bind(this)}>
                Меню
            </span>
        </section>
    }

    _onEscapeKeyDown () {
        this._onResumeButtonClick();
    }

    _onResumeButtonClick () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'game'
        });
        this.props.dispatch({
            type: 'GAME_RESUME'
        });
    }

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
