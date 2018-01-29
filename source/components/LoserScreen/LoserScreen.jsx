import Tcaer from 'tcaer';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';

export default connect((state) => {
    return {};
}, class LoserScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `loser-screen`
        ];

        return <section className={className}>
            <h2>Неудача!</h2>
            <span onClick={this._onBackButtonClick.bind(this)}>В меню</span>
            <span onClick={this._onRepeatButtonClick.bind(this)}>Попробовать ещё</span>
        </section>
    }

    _onBackButtonClick () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'menu'
        });
    }

    _onRepeatButtonClick () {
        this.props.dispatch({
            type: 'GAME_RESET'
        });
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'game'
        });
    }
});
