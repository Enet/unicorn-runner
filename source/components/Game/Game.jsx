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
            ref={this._onCanvasRef.bind(this)} />
    }

    componentDidMount () {
        super.componentDidMount(...arguments);
        this._game = this._createGame();
    }

    componentDidUpdate (prevProps) {
        const game = this._game;
        if (game && prevProps.size !== this.props.size) {
            game.resize(this.props.size);
        }
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
