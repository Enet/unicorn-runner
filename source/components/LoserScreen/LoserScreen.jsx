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
    render () {
        const className = [
            ...this._getClassName(),
            `loser-screen`
        ];

        return <section className={className}>
            <h2 className="loser-screen__header">
                {i18n.get(this, 'fail')}
            </h2>
            <nav className="loser-screen__menu">
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
        </section>
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
