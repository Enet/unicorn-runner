import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    TILE_SIZE
} from 'constants.js';
import {
    Vector2
} from 'engine/math.js';

import './Level.styl';

export default class Level extends Tcaer.Component {
    render () {
        const className = [
            `level`,
            `level_moving_${!!this.state.isSpacePressed}`
        ];

        return <div
            className={className}
            onMouseDown={this._onMouseDown}
            onMouseUp={this._onMouseUp}
            onMouseLeave={this._onMouseLeave}
            onMouseMove={this._onMouseMove}>
            <canvas className="level__canvas" ref={this._onCanvasRef} />
        </div>
    }

    componentDidMount () {
        this._camera = {
            position: new Vector2(0, 0),
            size: new Vector2(0, 0)
        };

        document.addEventListener('keydown', this._onDocumentKeyDown);
        document.addEventListener('keyup', this._onDocumentKeyUp);
        window.addEventListener('resize', this._onWindowResize);
        this._onWindowResize();
        this._frame = requestAnimationFrame(this._onAnimationFrame);
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this._onDocumentKeyDown);
        document.removeEventListener('keyup', this._onDocumentKeyUp);
        window.removeEventListener('resize', this._onWindowResize);
    }

    @autobind
    _onCanvasRef (node) {
        this._context = node.getContext('2d');
    }

    @autobind
    _onWindowResize () {
        this._context.canvas.width = this._camera.size.width = window.innerWidth - 250;
        this._context.canvas.height = this._camera.size.height = window.innerHeight - 20;
    }

    @autobind
    _onAnimationFrame () {
        const context = this._context;
        const {canvas} = context;
        context.clearRect(0, 0, canvas.width, canvas.height);

        const {x, y} = this._camera.position;
        const {width, height} = this._camera.size;
        const xFrom = (x / TILE_SIZE | 0) - 1;
        const xTo = ((x + width) / TILE_SIZE | 0) + 1;
        const yFrom = (y / TILE_SIZE | 0) - 1;
        const yTo = ((y + height) / TILE_SIZE | 0) + 1;
        context.save();
        for (let yIndex = yFrom; yIndex < yTo; yIndex++) {
            for (let xIndex = xFrom; xIndex < xTo; xIndex++) {
                context.beginPath();
                context.strokeStyle = 'yellow';
                context.lineWidth = 2;
                context.rect(xIndex * TILE_SIZE - x, yIndex * TILE_SIZE - y, TILE_SIZE, TILE_SIZE);
                context.stroke();
            }
        }
        context.restore();
        for (let yIndex = yFrom; yIndex < yTo; yIndex++) {
            context.font = '20px Arial';
            context.textAlign = 'start';
            context.fillText(yIndex, 0, (yIndex - 0.5) * TILE_SIZE + 10 - y);
        }
        for (let xIndex = xFrom; xIndex < xTo; xIndex++) {
            context.textAlign = 'center';
            context.fillText(xIndex, (xIndex - 0.5) * TILE_SIZE - x, 20);
        }
        this._frame = requestAnimationFrame(this._onAnimationFrame);
    }

    @autobind
    _onMouseDown (event) {
        this._startDragging = new Vector2(event.clientX, event.clientY);
        this._isDragging = true;
    }

    @autobind
    _onMouseUp () {
        this._isDragging = false;
    }

    @autobind
    _onMouseLeave () {
        this._onMouseUp();
    }

    @autobind
    _onMouseMove (event) {
        if (!this._isDragging) {
            return;
        }
        const currentDragging = new Vector2(event.clientX, event.clientY);
        const diff = currentDragging.subtract(this._startDragging).length(-1);
        this._camera.position.set(this._camera.position.add(diff));
        this._startDragging = currentDragging;
    }

    @autobind
    _onDocumentKeyDown (event) {
        if (event.keyCode === 32) {
            event.preventDefault();
            this.setState({isSpacePressed: true});
        }
    }

    @autobind
    _onDocumentKeyUp (event) {
        if (event.keyCode === 32) {
            this.setState({isSpacePressed: false});
        }
    }
}
