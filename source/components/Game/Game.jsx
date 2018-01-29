import Tcaer from 'tcaer';

import UnicornGame from 'UnicornGame.js';

import './Game.styl';

export default class Game extends Tcaer.Component {
    render () {
        const className = [
            `game`
        ];

        return <canvas
            className={className}
            ref={this._onCanvasRef.bind(this)}
            width={800}
            height={600} />
    }

    componentDidMount () {
        super.componentDidMount(...arguments);
        this._game = this._createGame();
        this.componentDidUpdate();
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
        this._destructGame(this._game);
    }

    _createGame () {
        return new UnicornGame({
            ...this.props,
            context: this._canvasNode.getContext('2d')
        });
    }

    _destructGame (game) {
        game.pause();
        game.destructor();
    }

    _onCanvasRef (node) {
        this._canvasNode = node;
    }
}
