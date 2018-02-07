import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    Vector2
} from 'engine/math.js';

import Level from 'components/Level/Level.jsx';
import Menu from 'components/Menu/Menu.jsx';
import Meta from 'components/Meta/Meta.jsx';
import Editor from 'components/Editor/Editor.jsx';
import jsonToLevel from 'utils/jsonToLevel.js';
import levelToJson from 'utils/levelToJson.js';
import createEntity from 'utils/createEntity.js';

import './App.styl';

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
                entity={this.state.selected || this._level}
                onEditorOpen={this._onEditorOpen} />
            <Editor
                opened={this.state.isEditorOpened}
                json={this._level.json}
                onSave={this._onEditorSave}
                onClose={this._onEditorClose} />
        </main>
    }

    componentWillMount () {
        const json = JSON.stringify({
            meta: {
                music: '',
                background: '',
                bounds: {
                    top: -100,
                    right: 1000,
                    bottom: 1000,
                    left: -100
                }
            },
            tiles: [{
                ranges: [
                    [8, 9, 3, 5]
                ]
            }],
            entities: [{
                name: 'Box',
                position: {x: 600, y: 360}
            }, {
                name: 'Frog',
                position: {x: 300, y: 360},
                settings: {
                    range: {
                        from: 200,
                        to: 600
                    }
                }
            }]
        });

        this.state.isEditorOpened = false;
        this.state.entity = createEntity('Cursor');
        this._level = jsonToLevel(json, this.props.manager);
    }

    @autobind
    _onMenuSelect (entityName) {
        const level = this._level;
        const entity = createEntity(entityName, {level});
        this.setState({entity});
    }

    @autobind
    _onTileChange ({xIndex, yIndex}) {
        const tile = this._level.tiles.getElement(xIndex, yIndex);
        this._level.tiles.setElement(xIndex, yIndex, tile ? null : {});
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

    @autobind
    _onEditorClose () {
        const isEditorOpened = false;
        this.setState({isEditorOpened});
    }

    @autobind
    _onEditorOpen () {
        this._level.json = levelToJson(this._level);
        const isEditorOpened = true;
        this.setState({isEditorOpened});
    }

    @autobind
    _onEditorSave (json) {
        const isEditorOpened = false;
        this.setState({isEditorOpened});
        try {
            JSON.parse(json);
            this._level = jsonToLevel(json, this.props.manager);
        } catch (error) {
            console.error(error);
        }
    }
}
