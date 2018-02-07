import {
    Vector2
} from 'engine/math.js';
import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    TILE_SIZE,
    KEY_SPACE,
    KEY_CONTROL,
    KEY_TAB,
    KEY_BACKSPACE
} from 'game/constants.js';

import './Level.styl';

const colorNames = [
    'black', 'white', 'seashell', 'pink', 'violet',
    'ultraviolet', 'blue', 'red', 'green', 'aqua', 'yellow'
];
const colorValues = {};
const colorNode = document.createElement('span');
document.body.appendChild(colorNode);
colorNames.forEach((colorName) => {
    colorNode.className = 'level__color_' + colorName;
    colorValues[colorName] = window.getComputedStyle(colorNode).backgroundColor;
});
document.body.removeChild(colorNode);

const COLOR_MESH = colorValues.pink;
const COLOR_BOUND = colorValues.pink;
const COLOR_TILE = colorValues.violet;
const COLOR_SCALE = colorValues.black;
const COLOR_BORDER = colorValues.blue;
const COLOR_SELECTION = colorValues.blue;
const COLOR_STICKY_EDGE = colorValues.green;
const STICKY_EDGE_DISTANCE = 5;

export default class Level extends Tcaer.Component {
    render () {
        const className = [
            `level`,
            `level_dragging_${!!this.state.isSpacePressed}`
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
        this._cursorPosition = new Vector2(0, 0);
        this._prevCursorPosition = this._cursorPosition;
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
        cancelAnimationFrame(this._frame);
    }

    _isPointInsideEntity (point, entity) {
        point = point.add(this.camera.position);
        const {position, size} = entity;
        const {x, y} = position;
        const {width, height} = size;

        return true &&
            point.x >= x - width / 2 &&
            point.x <= x + width / 2 &&
            point.y >= y - height / 2 &&
            point.y <= y + height / 2;
    }

    _isPointInsideBounds (point) {
        point = point.add(this.camera.position);
        const {top, right, bottom, left} = this._getBounds();
        return true &&
            point.x >= left &&
            point.x <= right &&
            point.y >= top &&
            point.y <= bottom;
    }

    _updateCursorPosition (cursorPosition) {
        this._prevCursorPosition = this._cursorPosition;
        this._cursorPosition = cursorPosition;
    }

    _updateHoverEntity () {
        const cursorPosition = this._cursorPosition;
        let hoverEntity = null;

        this.props.menuEntity.name === 'CursorEntity' &&
        !this._isMoving &&
        this.props.level.entities.forEach((entity) => {
            if (!this._isPointInsideEntity(cursorPosition, entity)) {
                return;
            }
            hoverEntity = entity;
        });

        this._hoverEntity = hoverEntity;
    }

    _getBounds () {
        return this.props.level.meta.bounds;
    }

    _boundPoint (point) {
        const {top, right, bottom, left} = this._getBounds();
        point.x = Math.max(left, Math.min(right, point.x));
        point.y = Math.max(top, Math.min(bottom, point.y));
        return point;
    }

    _moveEntity () {
        const entity = this.props.selectedEntity;
        if (!entity) {
            return;
        }
        if (!this._moveStartPoint) {
            return;
        }
        const cursorPosition = this._cursorPosition;
        const moveImpulse = cursorPosition.subtract(this._moveStartPoint);
        let {position} = entity;

        if (this.state.isControlPressed) {
            const stickyEdges = this._getStickyEdges(entity, cursorPosition);
            position = stickyEdges.entityPosition.add(this.camera.position);
        }

        if (this._isMoving) {
            position = this._boundPoint(position.add(moveImpulse));
            this._moveStartPoint = cursorPosition;
        } else if (moveImpulse.length() > 5) {
            this._isMoving = true;
        }

        Object.defineProperty(entity, 'position', {
            get: () => position,
            configurable: true
        });
    }

    _dragLevel () {
        if (!this.state.isSpacePressed) {
            return;
        }
        if (!this._isDragging) {
            return;
        }
        const cursorPosition = this._cursorPosition;
        const prevCursorPosition = this._prevCursorPosition;
        const dragImpulse = cursorPosition.subtract(prevCursorPosition).length(-1);
        this.camera.position.set(this.camera.position.add(dragImpulse));
    }

    _selectEntity () {
        if (this.state.isSpacePressed) {
            return;
        }
        this.props.onEntitySelect && this.props.onEntitySelect({
            entity: this._hoverEntity
        });
    }

    _startLevelDragging () {
        if (!this.state.isSpacePressed) {
            return;
        }
        this._isDragging = true;
    }

    _startEntityMoving () {
        if (this._isDragging) {
            return;
        }
        this._isMoving = false;
        this._moveStartPoint = this._cursorPosition.clone();
    }

    _stopEntityMoving () {
        this._moveStartPoint = null;
        this._isMoving = false;
    }

    _stopLevelDragging () {
        this._isDragging = false;
    }

    _changeTile () {
        const cursorPosition = this._cursorPosition;
        const tilePosition = cursorPosition.add(this.camera.position);
        const xIndex = Math.floor(tilePosition.x / TILE_SIZE);
        const yIndex = Math.floor(tilePosition.y / TILE_SIZE);
        this.props.onTileChange && this.props.onTileChange({xIndex, yIndex});
    }

    _addEntity () {
        const {menuEntity} = this.props;
        const cursorPosition = this._cursorPosition;
        let entityPosition = cursorPosition.clone();
        if (this.state.isControlPressed) {
            const stickyEdges = this._getStickyEdges(menuEntity, cursorPosition);
            entityPosition = stickyEdges.entityPosition;
        }
        entityPosition = entityPosition.add(this.camera.position);
        Object.defineProperty(menuEntity, 'position', {
            get: () => entityPosition,
            configurable: true
        });
        this.props.onEntityAdd && this.props.onEntityAdd({
            entity: menuEntity
        });
    }

    _removeEntity () {
        this.props.selectedEntity &&
        this.props.onEntityRemove &&
        this.props.onEntityRemove({
            entity: this.props.selectedEntity
        });
    }

    _clearCanvas () {
        const {context} = this;
        const {canvas} = context;
        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    _getLimits () {
        const {camera} = this;
        const {position, size} = camera;
        const {width, height} = size;
        const {x, y} = position;

        const xFrom = (x / TILE_SIZE | 0) - 1;
        const xTo = ((x + width) / TILE_SIZE | 0) + 1;
        const yFrom = (y / TILE_SIZE | 0) - 1;
        const yTo = ((y + height) / TILE_SIZE | 0) + 1;

        return {xFrom, xTo, yFrom, yTo};
    }

    _renderMesh () {
        const {xFrom, xTo, yFrom, yTo} = this._getLimits();
        const {x, y} = this.camera.position;
        const {context} = this;
        const {tiles} = this.props.level;

        for (let yIndex = yFrom; yIndex < yTo; yIndex++) {
            for (let xIndex = xFrom; xIndex < xTo; xIndex++) {
                context.beginPath();
                context.strokeStyle = COLOR_MESH;
                context.fillStyle = COLOR_TILE;
                context.lineWidth = 2;
                context.rect(xIndex * TILE_SIZE - x, yIndex * TILE_SIZE - y, TILE_SIZE, TILE_SIZE);
                context.stroke();
                if (tiles.getElement(xIndex, yIndex)) {
                    context.fill();
                }
            }
        }
    }

    _renderScale () {
        const {xFrom, xTo, yFrom, yTo} = this._getLimits();
        const {x, y} = this.camera.position;
        const {context} = this;

        context.fillStyle = COLOR_SCALE;
        context.font = '20px sans-serif';
        context.textAlign = 'start';
        for (let yIndex = yFrom; yIndex < yTo + 1; yIndex++) {
            context.fillText(yIndex - 1, 0, (yIndex - 0.5) * TILE_SIZE + 10 - y);
        }
        context.textAlign = 'center';
        for (let xIndex = xFrom; xIndex < xTo + 1; xIndex++) {
            context.fillText(xIndex - 1, (xIndex - 0.5) * TILE_SIZE - x, 20);
        }
    }

    _renderBounds () {
        const {top, right, bottom, left} = this._getBounds();
        const {context, camera} = this;
        const {width, height} = camera.size;
        const {x, y} = camera.position;

        context.fillStyle = COLOR_BOUND;
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
    }

    _renderEntity (entity, position, alpha) {
        const {context, camera} = this;
        const {x, y} = position;
        context.save();
        context.translate(x, y);
        context.rotate(entity.angle);
        context.globalAlpha = alpha;
        entity.render(context, camera, COLOR_TILE);
        context.restore();
    }

    _renderMenuEntity () {
        const {menuEntity} = this.props;
        if (menuEntity.name === 'CursorEntity') {
            return;
        }

        let entityPosition = this._cursorPosition;
        let stickyEdges = [];
        if (this.state.isControlPressed || menuEntity.name === 'TileEntity') {
            stickyEdges = this._getStickyEdges(menuEntity, entityPosition);
            entityPosition = stickyEdges.entityPosition;
        }

        this._renderEntity(menuEntity, entityPosition, 0.5);
        this._renderStickyEdges(stickyEdges);
        this._renderEntityBorder(menuEntity, entityPosition);
    }

    _renderLevelEntities () {
        this.props.level.entities.forEach((entity) => {
            this._renderLevelEntity(entity);
        });
    }

    _renderLevelEntity (entity) {
        const {camera} = this;
        const {selectedEntity} = this.props;
        let cursorPosition = this._cursorPosition;

        let entityPosition = entity.position.subtract(camera.position);
        let stickyEdges = [];
        if (entity === selectedEntity && this._isMoving && this.state.isControlPressed) {
            stickyEdges = this._getStickyEdges(entity, cursorPosition);
            entityPosition = stickyEdges.entityPosition;
        }

        this._renderEntity(entity, entityPosition, 1);
        if (entity === selectedEntity) {
            this._renderEntitySelection(entity, entityPosition);
            this._renderEntityBorder(entity, entityPosition);
        } else if (entity === this._hoverEntity && !this._isDragging) {
            this._renderEntityBorder(entity, entityPosition, [5, 5]);
        }
        this._renderStickyEdges(stickyEdges);
    }

    _renderStickyEdges (stickyEdges) {
        const {context, camera} = this;
        const {width, height} = camera.size;
        const {x, y} = camera.position;
        context.strokeStyle = COLOR_STICKY_EDGE;
        stickyEdges.forEach((stickyEdge) => {
            context.beginPath();
            if (stickyEdge.axis === 'x') {
                context.moveTo(stickyEdge.tileCoordinate - x, 0);
                context.lineTo(stickyEdge.tileCoordinate - x, height);
            } else {
                context.moveTo(0, stickyEdge.tileCoordinate - y);
                context.lineTo(width, stickyEdge.tileCoordinate - y);
            }
            context.stroke();
        });
    }

    _renderEntityBorder (entity, entityPosition, lineDash) {
        lineDash = lineDash || [5, 0];
        const {context} = this;
        const {width, height} = entity.size;
        const {x, y} = entityPosition;
        context.save();
        context.translate(x, y);
        context.beginPath();
        context.strokeStyle = COLOR_BORDER;
        context.setLineDash(lineDash);
        context.rect(-width / 2, -height / 2, width, height);
        context.stroke();
        context.restore();
    }

    _renderEntitySelection (entity, entityPosition) {
        const {context} = this;
        const {x, y} = entityPosition;
        const {width, height} = entity.size;
        context.save();
        context.translate(x, y);
        context.beginPath();
        context.fillStyle = COLOR_SELECTION;
        context.globalAlpha = 0.25;
        context.fillRect(-width / 2, -height / 2, width, height);
        context.restore();
    }

    _getStickyEdges (entity, entityPosition, isSecondStep=false) {
        if (!isSecondStep) {
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

        let stickyDistance = STICKY_EDGE_DISTANCE;
        let stickyEdges = [];
        let minStickyDistance = new Vector2(Infinity, Infinity);

        if (entity.name === 'TileEntity') {
            stickyDistance = TILE_SIZE;
        }

        for (let entityOffset = -0.5; entityOffset <= 0.5; entityOffset += 0.5) {
            if (entity.name === 'TileEntity' && !entityOffset) {
                continue;
            }
            for (let tileOffset = 0; tileOffset <= 1; tileOffset += 0.5) {
                if (entity.name === 'TileEntity' && tileOffset === 0.5) {
                    continue;
                }
                for (let coordinateProp in fromIndex) {
                    const sizeProp = coordinateProp === 'x' ? 'width' : 'height';
                    for (let index = fromIndex[coordinateProp]; index < toIndex[coordinateProp]; index++) {
                        const tileCoordinate = index * TILE_SIZE + tileOffset * TILE_SIZE;
                        const entityCoordinate = entityPosition[coordinateProp] + entityOffset * entity.size[sizeProp];
                        const distance = Math.abs(entityCoordinate - tileCoordinate);
                        if (distance <= stickyDistance) {
                            stickyEdges.push({
                                axis: coordinateProp,
                                distance,
                                tileCoordinate,
                                entityCoordinate,
                                position: tileCoordinate - entityOffset * entity.size[sizeProp]
                            });
                            minStickyDistance[coordinateProp] = Math.min(minStickyDistance[coordinateProp], distance);
                        }
                    }
                }
            }
        }

        stickyEdges = stickyEdges.filter((stickyEdge) => {
            const f = !(stickyEdge.distance > minStickyDistance[stickyEdge.axis]);
            if (f) {
                entityPosition[stickyEdge.axis] = stickyEdge.position;
            }
            return f;
        });

        if (isSecondStep) {
            stickyEdges.entityPosition = entityPosition.subtract(this.camera.position);
            return stickyEdges;
        } else {
            return this._getStickyEdges(entity, entityPosition, true);
        }
    }

    @autobind
    _onCanvasRef (node) {
        this.context = node.getContext('2d');
    }

    @autobind
    _onWindowResize () {
        const {context, camera} = this;
        const {canvas} = context;
        canvas.width = window.innerWidth - 300;
        canvas.height = window.innerHeight;
        camera.size.width = canvas.width;
        camera.size.height = canvas.height;
    }

    @autobind
    _onAnimationFrame () {
        this._clearCanvas();
        this._renderMesh();
        this._renderBounds();
        this._renderLevelEntities();
        this._renderMenuEntity();
        this._renderScale();

        this._frame = requestAnimationFrame(this._onAnimationFrame);
    }

    @autobind
    _onMouseDown (event) {
        this._selectEntity();
        this._startLevelDragging();
        this._startEntityMoving();
    }

    @autobind
    _onMouseUp () {
        this._stopEntityMoving();
        this._stopLevelDragging();
    }

    @autobind
    _onMouseLeave () {
        this._onMouseUp();
    }

    @autobind
    _onMouseMove (event) {
        const cursorPosition = new Vector2(event.clientX, event.clientY);
        this._updateCursorPosition(cursorPosition);
        this._updateHoverEntity();
        this._moveEntity();
        this._dragLevel();
    }

    @autobind
    _onClick (event) {
        let cursorPosition = new Vector2(event.clientX, event.clientY);
        this._updateCursorPosition(cursorPosition);
        if (this.state.isSpacePressed) {
            return this._stopLevelDragging();
        }
        if (!this._isPointInsideBounds(cursorPosition)) {
            return;
        }

        const {menuEntity} = this.props;
        if (menuEntity.name === 'TileEntity') {
            this._changeTile();
        } else if (menuEntity.name !== 'CursorEntity') {
            this._addEntity();
        }
    }

    @autobind
    _onDocumentKeyDown (event) {
        if (event.keyCode === KEY_SPACE) {
            this.setState({isSpacePressed: true});
            if (document.activeElement &&
                document.activeElement.tagName !== 'TEXTAREA' &&
                document.activeElement.tagName !== 'INPUT') {
                event.preventDefault();
            }
        } else if (event.keyCode === KEY_CONTROL) {
            this.setState({isControlPressed: true});
        } else if (event.keyCode === KEY_TAB || event.keyCode === KEY_BACKSPACE) {
            this._removeEntity();
        }
    }

    @autobind
    _onDocumentKeyUp (event) {
        if (event.keyCode === KEY_SPACE) {
            this.setState({isSpacePressed: false});
            this._onMouseUp();
        } else if (event.keyCode === KEY_CONTROL) {
            this.setState({isControlPressed: false});
        }
    }
}
