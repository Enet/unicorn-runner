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

const TINKOFF_URI = 'https://www.tinkoff.ru/loans/mortgage/';

@connect()
export default class MenuScreen extends Screen {
    renderContent () {
        return <nav className="screen__content menu-screen__content">
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
                    href={TINKOFF_URI}
                    rel="noopener noreferrer"
                    target="_blank">
                    {i18n.get(this, 'mortgage')}
                </a>
            </Button>
        </nav>
    }

    _getBaseName () {
        return 'menu-screen';
    }

    _getHeaderText () {
        return i18n.get(this, 'header')
    }

    _getSubheaderText () {
        return i18n.get(this, 'subheader')
    }

    _onButtonClick (screenName) {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: screenName
        });
    }

    _onOneKeyDown () {
        this._onButtonClick('map');
    }

    _onTwoKeyDown () {
        this._onButtonClick('settings');
    }

    _onThreeKeyDown () {
        window.open(TINKOFF_URI, '_blank');
    }

    _onEscapeKeyDown () {

    }
}
