import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import expandSettings from 'utils/expandSettings.js';

import './SettingsEditor.styl';

export default class SettingsEditor extends Tcaer.Component {
    render () {
        const entity = this.props.selectedEntity;
        const {settings} = entity;
        const className = [
            `settings-editor`
        ];

        return <div className={className}>
            <h3 className="settings-editor__header">
                {entity.name.replace(/Entity$/, '')}
            </h3>
            <div>
                {entity.position ? <span>
                    position.x: {entity.position.x}
                    <br />
                    position.y: {entity.position.y}
                    <br />
                </span> : null}
                {Object.keys(settings).map((settingName) => {
                    let type;
                    let value = settings[settingName];
                    if (typeof value === 'number') {
                        type = 'number';
                        value = +value;
                    } else if (typeof value === 'string') {
                        type = 'text';
                        value = value + '';
                    } else if (typeof value === 'boolean') {
                        type = 'checkbox';
                        value = !!value;
                    }
                    return <label key={settingName} className="settings-editor__label">
                        <span className="settings-editor__text">{settingName}:</span>
                        <input
                            className="settings-editor__input"
                            type={type}
                            checked={value}
                            value={value}
                            onChange={this._onInputChange.bind(this, entity, settingName)} />
                        <br />
                    </label>
                })}
                {entity.name === 'LevelEntity' ? <div>
                    <button
                        className="settings-editor__button"
                        onClick={this._onCodeEditorButtonClick}>
                        Code
                    </button>
                    <button
                        className="settings-editor__button"
                        onClick={this._onHelpButtonClick}>
                        Help
                    </button>
                    <button
                        className="settings-editor__button"
                        onClick={this._onResetButtonClick}>
                        Reset
                    </button>
                </div> : null}
            </div>
        </div>
    }

    @autobind
    _onInputChange (entity, settingName, event) {
        const {type} = event.currentTarget;
        let {value} = event.currentTarget;
        if (type === 'number') {
            value = +value || 0;
        } else if (type === 'checkbox') {
            value = !!event.currentTarget.checked;
        }
        entity.settings[settingName] = value;
        if (entity.name === 'LevelEntity') {
            entity.meta = expandSettings(entity.settings);
        }
        this.props.onSettingChange && this.props.onSettingChange();
    }

    @autobind
    _onResetButtonClick () {
        if (confirm('Do you want to reset the level? Data will be lost!')) {
            this.props.onReset && this.props.onReset();
        }
    }

    @autobind
    _onHelpButtonClick () {
        this.props.onHelpOpen && this.props.onHelpOpen();
    }

    @autobind
    _onCodeEditorButtonClick () {
        this.props.onCodeEditorOpen && this.props.onCodeEditorOpen();
    }
}
