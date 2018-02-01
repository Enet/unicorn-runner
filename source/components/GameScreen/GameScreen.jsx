import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import Score from 'components/Score/Score.jsx';
import Health from 'components/Health/Health.jsx';
import Effects from 'components/Effects/Effects.jsx';
import Information from 'components/Information/Information.jsx';
import Game from 'components/Game/Game.jsx';
import I18n from 'utils/I18n.js';
import fullscreenMode from 'utils/fullscreenMode.js';

import dictionary from './GameScreen.json';
import './GameScreen.styl';

const TABLET_WIDTH = 640;
const i18n = new I18n(dictionary);

@connect(({game, settings}) => ({game, settings}))
export default class GameScreen extends Screen {
    renderHeader () {

    }

    renderSubheader () {

    }

    renderWrapper () {
        const {game} = this.props;
        return <div className="game-screen__wrapper">
            {game.inited ? this.renderGame() : null}
            <Score value={game.score}>
                {i18n.get(this, 'score')}
            </Score>
            <Health value={game.health}>
                {i18n.get(this, 'health')}
            </Health>
            <Effects value={game.effects} />
            <Information>{this.state.information}</Information>
            <a
                href="https://fintech.tinkoff.ru"
                target="_blank"
                rel="noopener noreferrer"
                className="game-screen__tinkoff">
                {i18n.get(this, 'tinkoff')}
                <br />
                {i18n.get(this, 'fintech')}
            </a>
            <a
                href="https://zhevak.name"
                target="_blank"
                rel="noopener noreferrer"
                className="game-screen__portfolio">
                {i18n.get(this, 'stepan')}
                <br />
                {i18n.get(this, 'zhevak')}
            </a>
            <span
                onClick={this._onEscapeKeyDown}
                className="game-screen__menu-button">
                {i18n.get(this, 'menu')}
            </span>
        </div>
    }

    renderGame () {
        const {game, settings} = this.props;
        return <Game
            settings={settings}
            key={game.key + ':' + game.step}
            step={game.step}
            paused={game.paused}
            debug={false}
            size={this.state.size}
            onScoreChange={this._onScoreChange}
            onHealthChange={this._onHealthChange}
            onEffectChange={this._onEffectChange}
            onShowInfo={this._onShowInfo}
            onHideInfo={this._onHideInfo}
            onGameReady={this._onGameReady}
            onGameLose={this._onGameLose}
            onGameWin={this._onGameWin} />
    }

    componentDidMount () {
        super.componentDidMount(...arguments);
        window.addEventListener('resize', this._onWindowResize);
        this._onWindowResize();
    }

    componentWillUnmount () {
        super.componentWillUnmount(...arguments);
        window.removeEventListener('resize', this._onWindowResize);
    }

    _getBaseName () {
        return 'game-screen';
    }

    _getWindowSize () {
        let width = window.innerWidth;
        let height = window.innerHeight;
        if (width <= TABLET_WIDTH) {
            [width, height] = [height, width];
        }
        return {width, height};
    }

    @autobind
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
    _onShowInfo (information) {
        information = information[this.context.locale];
        this.setState({information});
    }

    @autobind
    _onHideInfo () {
        this._onShowInfo({});
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
    _onGameReady () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'game'
        });
    }

    @autobind
    _onGameLose () {
        this.props.dispatch({
            type: 'GAME_PAUSE'
        });
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'loser'
        });
        fullscreenMode.stop();
    }

    @autobind
    _onGameWin ({score}) {
        this.props.dispatch({
            type: 'STEP_COMPLETE',
            payload: score,
            step: this.props.game.step
        });
        this.props.dispatch({
            type: 'GAME_PAUSE'
        });
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'winner'
        });
        fullscreenMode.stop();
    }

    @autobind
    _onWindowResize () {
        const size = this._getWindowSize();
        this.setState({size});
    }
}
