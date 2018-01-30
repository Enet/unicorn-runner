import Tcaer from 'tcaer';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import I18n from 'utils/I18n.js';

import dictionary from './MenuScreen.json';
import './MenuScreen.styl';

const i18n = new I18n(dictionary);

@connect()
export default class MenuScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `menu-screen`
        ];

        return <section className={className}>
            <h1 className="menu-screen__header">
                {i18n.get(this, 'header')}
            </h1>
            <p className="menu-screen__description">
                {i18n.get(this, 'description')}
            </p>
            <ul className="menu-screen__list">
                <li
                    className="menu-screen__item"
                    onClick={this._onButtonClick.bind(this, 'map')}
                    dataClick={true}
                    dataHover={true}>
                    {i18n.get(this, 'map')}
                </li>
                <li
                    className="menu-screen__item"
                    onClick={this._onButtonClick.bind(this, 'settings')}
                    dataClick={true}
                    dataHover={true}>
                    {i18n.get(this, 'settings')}
                </li>
                <li
                    className="menu-screen__item"
                    dataClick={true}
                    dataHover={true}>
                    <a
                        href="https://www.tinkoff.ru/loans/mortgage/"
                        rel="noopener noreferrer"
                        target="_blank">
                        {i18n.get(this, 'mortgage')}
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
