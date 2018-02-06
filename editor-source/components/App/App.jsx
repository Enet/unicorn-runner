import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    Matrix,
    Vector2
} from 'engine/math.js';

import Level from 'components/Level/Level.jsx';
import Menu from 'components/Menu/Menu.jsx';
import {
    entities
} from 'resources.js';
import {
    TILE_SIZE
} from 'constants.js';
import GameLevel from '../../../game-source/Level.js';

import './App.styl';

const noop = Function.prototype;
class LevelMock {
    createSound () {
        return {
            play: noop,
            pause: noop
        };
    }
}

Object.getOwnPropertyNames(GameLevel.prototype).forEach((methodName) => {
    if (LevelMock.prototype.hasOwnProperty(methodName)) {
        return;
    }
    LevelMock.prototype[methodName] = noop;
});

class TileMock {
    get angle () {
        return 0;
    }

    render (context) {
        context.beginPath();
        context.fillStyle = 'orange';
        context.fillRect(-TILE_SIZE / 2, -TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
    }

    constructor () {
        this.size = new Vector2(TILE_SIZE, TILE_SIZE);
        this.name = 'Tile';
    }
}

export default class App extends Tcaer.Component {
    render () {
        const className = [
            `app`
        ];

        return <main className={className}>
            <Level
                level={this._level}
                entity={this.state.entity}
                onTileChange={this._onTileChange}
                onEntityRemove={this._onEntityRemove}
                onEntityAdd={this._onEntityAdd} />
            <Menu
                selected={this.state.entity.name}
                onSelect={this._onEntitySelect} />
        </main>
    }

    componentWillMount () {
        this.state.entity = {name: 'Cursor'};
        const levelMock = new LevelMock();
        levelMock.manager = this.props.manager;
        levelMock.player = {
            body: {
                center: new Vector2(0, 0)
            }
        };
        this._levelMock = levelMock;
        this._level = {
            tiles: new Matrix(),
            entities: [],
            meta: {},
            bounds: {
                top: -100,
                right: 1000,
                bottom: 1000,
                left: -100
            }
        };
    }

    @autobind
    _onEntitySelect (entityName) {
        if (entityName === 'Tile') {
            return this.setState({
                entity: new TileMock()
            });
        }
        const Entity = entities[entityName];
        if (!Entity) {
            return this.setState({
                entity: {
                    name: entityName
                }
            });
        }
        const x = 0;
        const y = 0;
        const level = this._levelMock;
        const settings = {
            range: [0, 0],
            trigger: {},
            from: [0, 0],
            to: [0, 0]
        };
        const entity = new Entity({level, settings, x, y});
        entity.name = entityName;
        this.setState({entity});
    }

    @autobind
    _onTileChange ({xIndex, yIndex}) {
        const tile = this._level.tiles.getElement(xIndex, yIndex);
        this._level.tiles.setElement(xIndex, yIndex, !tile);
    }

    @autobind
    _onEntityAdd ({entity, x, y}) {
        Object.defineProperty(entity, 'position', {
            get: () => new Vector2(x, y),
            configurable: true
        });
        this._level.entities.push(entity);
        this._onEntitySelect(entity.name);
    }

    @autobind
    _onEntityRemove ({entity}) {
        const index = this._level.entities.indexOf(entity);
        if (index === -1) {
            return;
        }
        this._level.entities.splice(index, 1);
        this._onEntitySelect('Cursor');
    }
}
