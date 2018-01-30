import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import UnicornGame from 'UnicornGame.js';

import './Game.styl';

export default class Game extends Tcaer.Component {
    render () {
        const className = [
            `game`
        ];

        return <canvas
            className={className}
            ref={this._onCanvasRef.bind(this)} />
    }

    componentDidMount () {
        super.componentDidMount(...arguments);
        window.addEventListener('resize', this._onWindowResize);
        this._game = this._createGame();
    }

    componentDidUpdate () {
        const game = this._game;
        if (this.props.paused) {
            game.pause();
        } else {
            game.resume();
        }
    }

    componentWillUnmount () {
        super.componentWillUnmount(...arguments);
        window.removeEventListener('resize', this._onWindowResize);
        this._destructGame(this._game);
    }

    _createGame () {
        return new UnicornGame({
            ...this.props,
            size: this._getWindowSize(),
            context: this._canvasNode.getContext('2d')
        });
    }

    _destructGame (game) {
        game.pause();
        game.destructor();
    }

    _getWindowSize () {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return {width, height};
    }

    _onCanvasRef (node) {
        this._canvasNode = node;
    }

    @autobind
    _onWindowResize () {
        this._game.resize(this._getWindowSize());
    }
}
