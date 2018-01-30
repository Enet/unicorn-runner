import Tcaer from 'tcaer';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';

import './MenuScreen.styl';

@connect()
export default class MenuScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `menu-screen`
        ];

        return <section className={className}>
            <h1 className="menu-screen__header">
                Unicorn
            </h1>
            <p className="menu-screen__description">
                Помоги единорогу отдать кредит и поднять бабла.
            </p>
            <ul className="menu-screen__list">
                <li
                    className="menu-screen__item"
                    onClick={this._onButtonClick.bind(this, 'map')}
                    dataClick={true}
                    dataHover={true}>
                    Начать игру
                </li>
                <li
                    className="menu-screen__item"
                    onClick={this._onButtonClick.bind(this, 'settings')}
                    dataClick={true}
                    dataHover={true}>
                    Настройки
                </li>
                <li
                    className="menu-screen__item"
                    dataClick={true}
                    dataHover={true}>
                    <a
                        href="https://www.tinkoff.ru/loans/mortgage/"
                        rel="noopener noreferrer"
                        target="_blank">
                        Взять ипотеку
                    </a>
                </li>
            </ul>
        </section>
    }

    _onButtonClick (screenName) {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: screenName
        });
    }

    _onEscapeKeyDown () {

    }
}
