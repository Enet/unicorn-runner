import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';

@connect()
export default class LoserScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `loser-screen`
        ];

        return <section className={className}>
            <h2>Неудача!</h2>
            <span
                dataHover={true}
                dataClick={true}
                onClick={this._onBackButtonClick}>
                В меню
            </span>
            <span
                dataHover={true}
                dataClick={true}
                onClick={this._onRepeatButtonClick}>
                Попробовать ещё
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
