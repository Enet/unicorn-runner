import Tcaer from 'tcaer';
import Screen from 'components/Screen/Screen.jsx';

import './MenuScreen.styl';

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
                <li className="menu-screen__item">
                    Начать игру
                </li>
                <li className="menu-screen__item">
                    Настройки
                </li>
                <li className="menu-screen__item">
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
}
