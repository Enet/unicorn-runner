import Tcaer from 'tcaer';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import Score from 'components/Score/Score.jsx';
import Health from 'components/Health/Health.jsx';
import Effects from 'components/Effects/Effects.jsx';
import Game from 'components/Game/Game.jsx';

import './GameScreen.styl';

export default connect((state) => {
    return state;
}, class GameScreen extends Screen {
    render () {
        const {game, settings} = this.props;
        const className = [
            ...this._getClassName(),
            `game-screen`
        ];

        return <section className={className}>
            <Game
                settings={settings}
                key={game.key + ':' + game.step}
                step={game.step}
                paused={game.paused}
                debug={false}
                onScoreChange={this._onScoreChange.bind(this)}
                onHealthChange={this._onHealthChange.bind(this)}
                onEffectChange={this._onEffectChange.bind(this)}
                onGameLose={this._onGameLose.bind(this)}
                onGameWin={this._onGameWin.bind(this)} />

            <h2 className="game-screen__header">
                Тинькофф<br />Финтех
            </h2>
            <Score value={game.score} />
            <Health value={game.health} />
            <Effects value={game.effects} />
        </section>
    }

    _onEscapeKeyDown () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'pause'
        });
        this.props.dispatch({
            type: 'GAME_PAUSE'
        });
    }

    _onScoreChange (payload) {
        this.props.dispatch({
            type: 'GAME_SCORE_CHANGE',
            payload
        });
    }

    _onHealthChange (payload) {
        this.props.dispatch({
            type: 'GAME_HEALTH_CHANGE',
            payload
        });
    }

    _onEffectChange (effects) {
        this.props.dispatch({
            type: 'GAME_EFFECT_CHANGE',
            payload: Array.from(effects.values())
        });
    }

    _onGameLose () {
        this.props.dispatch({
            type: 'GAME_RESET'
        });
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'loser'
        });
    }

    _onGameWin () {
        this.props.dispatch({
            type: 'GAME_RESET'
        });
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'winner'
        });
    }
});
