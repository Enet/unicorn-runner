import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    Vector2
} from 'engine/math.js';

import Level from 'components/Level/Level.jsx';
import Menu from 'components/Menu/Menu.jsx';
import {
    entities
} from 'resources.js';
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

export default class App extends Tcaer.Component {
    render () {
        const className = [
            `app`
        ];

        return <main className={className}>
            <Level entity={this.state.entity} />
            <Menu onSelect={this._onEntitySelect} />
        </main>
    }

    componentWillMount () {
        const levelMock = new LevelMock();
        levelMock.manager = this.props.manager;
        levelMock.player = {
            body: {
                center: new Vector2(0, 0)
            }
        };
        this._levelMock = levelMock;
    }

    @autobind
    _onEntitySelect (entityName) {
        const Entity = entities[entityName];
        if (!Entity) {
            return this.setState({
                entity: entityName
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
        this.setState({entity});
    }
}
