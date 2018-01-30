import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import Score from 'components/Score/Score.jsx';
import Health from 'components/Health/Health.jsx';
import Effects from 'components/Effects/Effects.jsx';
import Game from 'components/Game/Game.jsx';
import I18n from 'utils/I18n.js';

import dictionary from './GameScreen.json';
import './GameScreen.styl';

const i18n = new I18n(dictionary);

@connect(({game, settings}) => ({game, settings}))
export default class GameScreen extends Screen {
    render () {
        const {game} = this.props;
        const className = [
            ...this._getClassName(),
            `game-screen`
        ];

        return <section className={className}>
            {game.inited ? this.renderGame() : null}

            <h2 className="game-screen__header">
                {i18n.get(this, 'header1')}
                <br />
                {i18n.get(this, 'header2')}
            </h2>
            <Score value={game.score}>
                {i18n.get(this, 'score')}
            </Score>
            <Health value={game.health}>
                {i18n.get(this, 'health')}
            </Health>
            <Effects value={game.effects} />
        </section>
    }

    renderGame () {
        const {game, settings} = this.props;
        return <Game
            settings={settings}
            key={game.key + ':' + game.step}
            step={game.step}
            paused={game.paused}
            debug={false}
            onScoreChange={this._onScoreChange}
            onHealthChange={this._onHealthChange}
            onEffectChange={this._onEffectChange}
            onGameLose={this._onGameLose}
            onGameWin={this._onGameWin} />
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

    @autobind
    _onScoreChange (payload) {
        this.props.dispatch({
            type: 'GAME_SCORE_CHANGE',
            payload
        });
    }

    @autobind
    _onHealthChange (payload) {
        this.props.dispatch({
            type: 'GAME_HEALTH_CHANGE',
            payload
        });
    }

    @autobind
    _onEffectChange (effects) {
        this.props.dispatch({
            type: 'GAME_EFFECT_CHANGE',
            payload: Array.from(effects.values())
        });
    }

    @autobind
    _onGameLose () {
        this.props.dispatch({
            type: 'GAME_RESET'
        });
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'loser'
        });
    }

    @autobind
    _onGameWin () {
        this.props.dispatch({
            type: 'GAME_RESET'
        });
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'winner'
        });
    }
}
