import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import getEmptyLevel from 'utils/getEmptyLevel.js';
import jsonToLevel from 'utils/jsonToLevel.js';
import levelToJson from 'utils/levelToJson.js';
import createEntity from 'utils/createEntity.js';
import Level from 'components/Level/Level.jsx';
import Menu from 'components/Menu/Menu.jsx';
import SettingsEditor from 'components/SettingsEditor/SettingsEditor.jsx';
import CodeEditor from 'components/CodeEditor/CodeEditor.jsx';
import {
    KEY_ESCAPE,
    KEY_E
} from 'game/constants.js';

import './App.styl';

export default class App extends Tcaer.Component {
    render () {
        const className = [
            `app`
        ];

        return <main className={className}>
            <Level
                level={this._level}
                menuEntity={this.state.menuEntity}
                selectedEntity={this.state.selectedEntity}
                onTileChange={this._onTileChange}
                onEntityRemove={this._onEntityRemove}
                onEntitySelect={this._onEntitySelect}
                onEntityAdd={this._onEntityAdd} />
            <Menu
                selectedEntityName={this.state.menuEntity.name}
                onSelect={this._onMenuSelect} />
            <SettingsEditor
                selectedEntity={this.state.selectedEntity || this._level}
                onCodeEditorOpen={this._onCodeEditorOpen} />
            <CodeEditor
                opened={this.state.isCodeEditorOpened}
                json={this._level.json}
                onSave={this._onCodeEditorSave}
                onClose={this._onCodeEditorClose} />
        </main>
    }

    componentWillMount () {
        this._level = jsonToLevel(JSON.stringify(getEmptyLevel()), this.props.manager);
        this.state.isCodeEditorOpened = false;
        this.state.menuEntity = createEntity('CursorEntity');
    }

    componentDidMount () {
        document.addEventListener('keydown', this._onDocumentKeyDown);
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this._onDocumentKeyDown);
    }

    @autobind
    _onMenuSelect (entityName, isForced=false) {
        if (this.state.menuEntity.name === entityName && !isForced) {
            return;
        }
        const level = this._level;
        const menuEntity = createEntity(entityName, {level});
        const selectedEntity = null;
        this.setState({menuEntity, selectedEntity});
    }

    @autobind
    _onTileChange ({xIndex, yIndex}) {
        const {tiles} = this._level;
        const tile = tiles.getElement(xIndex, yIndex);
        tiles.setElement(xIndex, yIndex, tile ? null : {});
    }

    @autobind
    _onEntityAdd ({entity}) {
        this._level.entities.push(entity);
        this._onMenuSelect(entity.name, true);
    }

    @autobind
    _onEntitySelect ({entity}) {
        const {entities} = this._level;
        const index = entities.indexOf(entity);
        if (index !== -1) {
            entities.splice(index, 1);
            entities.push(entity);
        }
        const selectedEntity = entity;
        this.setState({selectedEntity});
    }

    @autobind
    _onEntityRemove ({entity}) {
        const {entities} = this._level;
        const index = entities.indexOf(entity);
        if (index === -1) {
            return;
        }
        entities.splice(index, 1);
        const selectedEntity = null;
        this.setState({selectedEntity});
        this._onMenuSelect('CursorEntity');
    }

    @autobind
    _onCodeEditorClose () {
        const isCodeEditorOpened = false;
        this.setState({isCodeEditorOpened});
    }

    @autobind
    _onCodeEditorOpen () {
        this._level.json = levelToJson(this._level);
        const isCodeEditorOpened = true;
        this.setState({isCodeEditorOpened});
    }

    @autobind
    _onCodeEditorSave (json) {
        this._onCodeEditorClose();
        try {
            JSON.parse(json);
            this._level = jsonToLevel(json, this.props.manager);
        } catch (error) {
            console.error(error);
        }
    }

    @autobind
    _onDocumentKeyDown (event) {
        const {keyCode} = event;
        if (keyCode === KEY_ESCAPE) {
            this._onCodeEditorClose();
        } else if (keyCode === KEY_E) {
            if (document.activeElement &&
                document.activeElement.tagName === 'INPUT') {
                return;
            }
            this._onCodeEditorOpen();
        }
    }
}
