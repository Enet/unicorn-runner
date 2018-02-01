import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import Button from 'components/Button/Button.jsx';
import I18n from 'utils/I18n.js';

import dictionary from './LoserScreen.json';
import './LoserScreen.styl';

const i18n = new I18n(dictionary);

@connect()
export default class LoserScreen extends Screen {
    renderContent () {
        return <nav className="screen__content loser-screen__content">
            <Button
                onClick={this._onQuitButtonClick}>
                {i18n.get(this, 'quit')}
            </Button>
            <br />
            <Button
                onClick={this._onRepeatButtonClick}>
                {i18n.get(this, 'repeat')}
            </Button>
        </nav>
    }

    _getHeaderText () {
        return i18n.get(this, 'header');
    }

    _getSubheaderText () {
        return i18n.get(this, 'subheader');
    }

    _getBaseName () {
        return 'loser-screen';
    }

    @autobind
    _onQuitButtonClick () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'menu'
        });
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
    }
}
