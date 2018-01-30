import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import I18n from 'utils/I18n.js';

import dictionary from './LoserScreen.json';

const i18n = new I18n(dictionary);

@connect()
export default class LoserScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `loser-screen`
        ];

        return <section className={className}>
            <h2>
                {i18n.get(this, 'fail')}
            </h2>
            <span
                dataHover={true}
                dataClick={true}
                onClick={this._onBackButtonClick}>
                {i18n.get(this, 'menu')}
            </span>
            <span
                dataHover={true}
                dataClick={true}
                onClick={this._onRepeatButtonClick}>
                {i18n.get(this, 'repeat')}
            </span>
        </section>
    }

    @autobind
    _onBackButtonClick () {
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
            type: 'GAME_SELECT_STEP'
        });
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'game'
        });
    }
}
