import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    Vector2
} from 'engine/math.js';

import {
    TILE_SIZE
} from 'constants.js';

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
            onMouseMove={this._onMouseMove}
            onClick={this._onClick}>
            <canvas className="level__canvas" ref={this._onCanvasRef} />
        </div>
    }

    componentDidMount () {
        this.camera = {
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

    _getStickyCandidates (entity, entityPosition, secondStep=false) {
        if (!secondStep) {
            entityPosition = entityPosition.add(this.camera.position);
        }

        const fromIndex = {
            x: Math.floor((entityPosition.x - entity.size.width / 2) / TILE_SIZE),
            y: Math.floor((entityPosition.y - entity.size.height / 2) / TILE_SIZE)
        };
        const toIndex = {
            x: Math.ceil((entityPosition.x + entity.size.width / 2) / TILE_SIZE),
            y: Math.ceil((entityPosition.y + entity.size.height / 2) / TILE_SIZE)
        };

        let stickyDistance = 5;
        let stickyCandidates = [];
        let minStickyDistance = new Vector2(Infinity, Infinity);

        if (entity.name === 'Tile') {
            stickyDistance = TILE_SIZE;
        }

        for (let entityOffset = -0.5; entityOffset <= 0.5; entityOffset += 0.5) {
            if (entity.name === 'Tile' && !entityOffset) {
                continue;
            }
            for (let tileOffset = 0; tileOffset <= 1; tileOffset += 0.5) {
                if (entity.name === 'Tile' && tileOffset === 0.5) {
                    continue;
                }
                for (let coordinateProp in fromIndex) {
                    const sizeProp = coordinateProp === 'x' ? 'width' : 'height';
                    for (let index = fromIndex[coordinateProp]; index < toIndex[coordinateProp]; index++) {
                        const tileCoordinate = index * TILE_SIZE + tileOffset * TILE_SIZE;
                        const entityCoordinate = entityPosition[coordinateProp] + entityOffset * entity.size[sizeProp];
                        const distance = entityCoordinate - tileCoordinate;
                        if (Math.abs(distance) <= stickyDistance) {
                            stickyCandidates.push({
                                axis: coordinateProp,
                                distance: Math.abs(distance),
                                tileCoordinate,
                                entityCoordinate,
                                position: tileCoordinate - entityOffset * entity.size[sizeProp]
                            });
                            minStickyDistance[coordinateProp] = Math.min(minStickyDistance[coordinateProp], Math.abs(distance));
                        }
                    }
                }
            }
        }

        stickyCandidates = stickyCandidates.filter((stickyCandidate) => {
            const f = !(stickyCandidate.distance > minStickyDistance[stickyCandidate.axis]);
            if (f) {
                entityPosition[stickyCandidate.axis] = stickyCandidate.position;
            }
            return f;
        });

        if (secondStep) {
            stickyCandidates.entityPosition = entityPosition.subtract(this.camera.position);
            return stickyCandidates;
        } else {
            return this._getStickyCandidates(entity, entityPosition, true);
        }
    }

    @autobind
    _onCanvasRef (node) {
        this._context = node.getContext('2d');
    }

    @autobind
    _onWindowResize () {
        this._context.canvas.width = this.camera.size.width = window.innerWidth - 250;
        this._context.canvas.height = this.camera.size.height = window.innerHeight - 20;
    }

    @autobind
    _onAnimationFrame () {
        const context = this._context;
        const {canvas} = context;
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Camera
        const {x, y} = this.camera.position;
        const {width, height} = this.camera.size;

        // Mesh
        const xFrom = (x / TILE_SIZE | 0) - 1;
        const xTo = ((x + width) / TILE_SIZE | 0) + 1;
        const yFrom = (y / TILE_SIZE | 0) - 1;
        const yTo = ((y + height) / TILE_SIZE | 0) + 1;
        for (let yIndex = yFrom; yIndex < yTo; yIndex++) {
            for (let xIndex = xFrom; xIndex < xTo; xIndex++) {
                context.beginPath();
                context.strokeStyle = 'yellow';
                context.fillStyle = 'orange';
                context.lineWidth = 2;
                context.rect(xIndex * TILE_SIZE - x, yIndex * TILE_SIZE - y, TILE_SIZE, TILE_SIZE);
                context.stroke();
                if (this.props.level.tiles.getElement(xIndex, yIndex)) {
                    context.fill();
                }
            }
        }

        // Bounds
        const {top, right, bottom, left} = this.props.level.bounds;
        context.fillStyle = 'midnightblue';
        if (top > y) {
            context.fillRect(0, 0, width, top - y);
        }
        if (right < x + width) {
            context.fillRect(right - x, 0, x + width, height);
        }
        if (bottom < y + height) {
            context.fillRect(0, bottom - y, width, y + height);
        }
        if (left > x) {
            context.fillRect(0, 0, left - x, height);
        }

        // Entities
        this.props.level.entities.forEach((entity) => {
            context.save();
            context.translate(entity.position.x - x, entity.position.y - y);
            context.rotate(entity.angle);
            entity.render(context, this.camera);
            context.restore();
        });

        // Selected entity
        const {entity} = this.props;
        if (!this.state.isSpacePressed && entity && entity.name !== 'Cursor' && this._cursorPosition) {
            let cursorPosition = this._cursorPosition;
            let stickyCandidates = [];
            if (this._isControlPressed || entity.name === 'Tile') {
                stickyCandidates = this._getStickyCandidates(entity, cursorPosition);
                cursorPosition = stickyCandidates.entityPosition;
            }

            context.save();
            context.translate(cursorPosition.x, cursorPosition.y);
            context.rotate(entity.angle);
            context.globalAlpha = 0.5;
            entity.render(context, this.camera);
            context.restore();

            stickyCandidates.forEach((stickyCandidate) => {
                context.strokeStyle = 'lime';
                context.beginPath();
                if (stickyCandidate.axis === 'x') {
                    context.moveTo(stickyCandidate.tileCoordinate - x, 0);
                    context.lineTo(stickyCandidate.tileCoordinate - x, width);
                } else {
                    context.moveTo(0, stickyCandidate.tileCoordinate - y);
                    context.lineTo(width, stickyCandidate.tileCoordinate - y);
                }
                context.stroke();
            });

            context.save();
            context.translate(cursorPosition.x, cursorPosition.y);
            context.beginPath();
            context.strokeStyle = 'red';
            context.rect(-entity.size.width / 2, -entity.size.height / 2, entity.size.width, entity.size.height);
            context.stroke();
            context.restore();
        }

        // Scale
        context.fillStyle = 'white';
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
        if (!this.state.isSpacePressed) {
            return;
        }
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
        const cursorPosition = new Vector2(event.clientX, event.clientY);
        this._cursorPosition = cursorPosition;
        if (!this.state.isSpacePressed) {
            return;
        }
        if (!this._isDragging) {
            return;
        }
        const diff = cursorPosition.subtract(this._startDragging).length(-1);
        this.camera.position.set(this.camera.position.add(diff));
        this._startDragging = cursorPosition;
    }

    @autobind
    _onClick (event) {
        if (this._startDragging) {
            this._startDragging = false;
            return;
        }
        if (!this.props.entity) {
            return;
        }
        if (this.state.isSpacePressed && this._isDragging) {
            return;
        }
        const {top, right, bottom, left} = this.props.level.bounds;
        const {x, y} = this.camera.position;
        let {clientX, clientY} = event;
        clientX += x;
        clientY += y;
        if (clientX < left || clientX > right ||
            clientY < top || clientY > bottom) {
            return;
        }

        if (this.props.entity.name === 'Tile') {
            const xIndex = Math.floor(clientX / TILE_SIZE);
            const yIndex = Math.floor(clientY / TILE_SIZE);
            this.props.onTileChange && this.props.onTileChange({xIndex, yIndex});
        } else if (this.props.entity.name !== 'Cursor') {
            let cursorPosition = this._cursorPosition;
            let stickyCandidates = [];
            const {entity} = this.props;
            if (this._isControlPressed || entity.name === 'Tile') {
                stickyCandidates = this._getStickyCandidates(entity, cursorPosition);
                cursorPosition = stickyCandidates.entityPosition;
            }
            this.props.onEntityAdd && this.props.onEntityAdd({
                entity,
                x: cursorPosition.x + this.camera.position.x,
                y: cursorPosition.y + this.camera.position.y
            });
        }
    }

    @autobind
    _onDocumentKeyDown (event) {
        if (event.keyCode === 32) {
            event.preventDefault();
            this.setState({isSpacePressed: true});
        } else if (event.keyCode === 17) {
            this._isControlPressed = true;
        }
    }

    @autobind
    _onDocumentKeyUp (event) {
        if (event.keyCode === 32) {
            this.setState({isSpacePressed: false});
            this._onMouseUp();
        } else if (event.keyCode === 17) {
            this._isControlPressed = false;
        }
    }
}
