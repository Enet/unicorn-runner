import Tcaer from 'tcaer';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import Button from 'components/Button/Button.jsx';
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
                {i18n.get(this, 'header1')}
            </h1>
            <h2 className="menu-screen__subheader">
                {i18n.get(this, 'header2')}
            </h2>
            <nav className="menu-screen__menu">
                <Button onClick={this._onButtonClick.bind(this, 'map')}>
                    {i18n.get(this, 'map')}
                </Button>
                <br />
                <Button onClick={this._onButtonClick.bind(this, 'settings')}>
                    {i18n.get(this, 'settings')}
                </Button>
                <br />
                <Button>
                    <a
                        className="menu-screen__link"
                        href="https://www.tinkoff.ru/loans/mortgage/"
                        rel="noopener noreferrer"
                        target="_blank">
                        {i18n.get(this, 'mortgage')}
                    </a>
                </Button>
            </nav>
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
