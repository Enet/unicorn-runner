import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    Matrix,
    Vector2
} from 'engine/math.js';

import Level from 'components/Level/Level.jsx';
import Menu from 'components/Menu/Menu.jsx';
import Meta from 'components/Meta/Meta.jsx';
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

const settingsByEntityName = {
    Level: {
        'music': 'MusicMenu',
        'background': 'Mountains',
        'bounds.top': -500,
        'bounds.right': -500,
        'bounds.bottom': 500,
        'bounds.left': 500
    },
    Frog: {
        'range.from': 0,
        'range.to': 0
    },
    FruitFly: {
        'trigger.value': true,
        'trigger.x': 0,
        'trigger.y': 0
    },
    Info: {
        'data.ru': '',
        'data.en': ''
    },
    Lizard: {
        'range.from': 0,
        'range.to': 0
    },
    Platform: {
        'from.x': 0,
        'from.y': 0,
        'to.x': 0,
        'to.y': 0,
        'speed': 0
    },
    Spider: {
        'web': 0,
        'reaction': 0
    },
    Stone: {
        'trigger.value': true,
        'trigger.x': 0,
        'trigger.y': 0
    }
};

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
                onEntitySelect={this._onEntitySelect}
                onEntityAdd={this._onEntityAdd} />
            <Menu
                selected={this.state.entity.name}
                onSelect={this._onMenuSelect} />
            <Meta
                entity={this.state.selected || this._levelMock} />
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
        levelMock.settings = settingsByEntityName.Level;
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
    _onMenuSelect (entityName) {
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
        entity.settings = settingsByEntityName[entity.name.replace(/Entity$/, '')] || {};
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
        this._onMenuSelect(entity.name);
    }

    @autobind
    _onEntitySelect ({entity}) {
        this.setState({
            selected: entity
        });
    }

    @autobind
    _onEntityRemove ({entity}) {
        const index = this._level.entities.indexOf(entity);
        if (index === -1) {
            return;
        }
        this._level.entities.splice(index, 1);
        this._onMenuSelect('Cursor');
    }
}
