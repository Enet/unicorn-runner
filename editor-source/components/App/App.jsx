import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import getEmptyLevel from 'utils/getEmptyLevel.js';
import jsonToLevel from 'utils/jsonToLevel.js';
import levelToJson from 'utils/levelToJson.js';
import createEntity from 'utils/createEntity.js';
import expandSettings from 'utils/expandSettings.js';
import Level from 'components/Level/Level.jsx';
import Menu from 'components/Menu/Menu.jsx';
import SettingsEditor from 'components/SettingsEditor/SettingsEditor.jsx';
import CodeEditor from 'components/CodeEditor/CodeEditor.jsx';
import Help from 'components/Help/Help.jsx';
import {
    KEY_ESCAPE,
    KEY_E,
    KEY_H
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
                onStartChange={this._onStartChange}
                onTileChange={this._onTileChange}
                onEntityChange={this._onEntityChange}
                onEntityRemove={this._onEntityRemove}
                onEntitySelect={this._onEntitySelect}
                onEntityAdd={this._onEntityAdd} />
            <Menu
                selectedEntityName={this.state.menuEntity.name}
                onSelect={this._onMenuSelect} />
            <SettingsEditor
                selectedEntity={this.state.selectedEntity || this._level}
                onReset={this._onReset}
                onHelpOpen={this._onHelpOpen}
                onCodeEditorOpen={this._onCodeEditorOpen}
                onSettingChange={this._onSettingChange} />
            <CodeEditor
                opened={this.state.isCodeEditorOpened}
                json={this._level.json}
                onSave={this._onCodeEditorSave}
                onClose={this._onCodeEditorClose} />
            <Help
                opened={this.state.isHelpOpened}
                onClose={this._onHelpClose} />
        </main>
    }

    componentWillMount () {
        this._level = jsonToLevel(this._loadLevel(), this.props.manager);
        this.state.isCodeEditorOpened = false;
        this.state.isHelpOpened = false;
        this.state.menuEntity = createEntity('CursorEntity');
    }

    componentDidMount () {
        document.addEventListener('keydown', this._onDocumentKeyDown);
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this._onDocumentKeyDown);
    }

    _loadLevel () {
        try {
            const json = localStorage.getItem('json');
            if (!json) {
                throw 'Empty level is created.';
            }
            return json;
        } catch (error) {
            console.log(error);
            return JSON.stringify(getEmptyLevel());
        }
    }

    _saveLevel () {
        try {
            localStorage.setItem('json', levelToJson(this._level));
        } catch (error) {
            console.error(error);
        }
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
        this._saveLevel();
    }

    @autobind
    _onStartChange (position) {
        const level = this._level;
        level.settings['start.x'] = position.x;
        level.settings['start.y'] = position.y;
        level.meta = expandSettings(level.settings);
    }

    @autobind
    _onEntityAdd (entity) {
        const {entities} = this._level;
        if (entity.name === 'PlayerEntity') {
            const index = entities.findIndex(e => e.name === entity.name);
            if (index !== -1) {
                entities.splice(index, 1);
            }
        }
        entities.push(entity);
        this._onMenuSelect(entity.name, true);
        this._saveLevel();
    }

    @autobind
    _onEntitySelect (entity) {
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
    _onEntityRemove (entity) {
        const {entities} = this._level;
        const index = entities.indexOf(entity);
        if (index === -1) {
            return;
        }
        entities.splice(index, 1);
        const selectedEntity = null;
        this.setState({selectedEntity});
        this._onMenuSelect('CursorEntity');
        this._saveLevel();
    }

    @autobind
    _onSettingChange () {
        this._saveLevel();
    }

    @autobind
    _onEntityChange () {
        this._saveLevel();
        this.setState();
    }

    @autobind
    _onReset () {
        try {
            localStorage.clear();
        } catch (error) {
            console.log(error);
        }
        this._level = jsonToLevel(this._loadLevel(), this.props.manager);
        this.setState();
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
            this._saveLevel();
        } catch (error) {
            console.error(error);
        }
    }

    @autobind
    _onHelpOpen () {
        const isHelpOpened = true;
        this.setState({isHelpOpened});
    }

    @autobind
    _onHelpClose () {
        const isHelpOpened = false;
        this.setState({isHelpOpened});
    }

    @autobind
    _onDocumentKeyDown (event) {
        const {keyCode} = event;
        if (keyCode === KEY_ESCAPE) {
            this._onCodeEditorClose();
            this._onHelpClose();
        } else if (keyCode === KEY_E) {
            if (document.activeElement &&
                document.activeElement.tagName === 'INPUT') {
                return;
            }
            this._onCodeEditorOpen();
        } else if (keyCode === KEY_H) {
            this._onHelpOpen();
        }
    }
}
