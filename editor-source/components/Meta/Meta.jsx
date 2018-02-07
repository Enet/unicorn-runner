import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import expandSettings from 'utils/expandSettings.js';

import './Meta.styl';

export default class Meta extends Tcaer.Component {
    render () {
        const {entity} = this.props;
        const {settings} = entity;
        const className = [
            `meta`
        ];

        return <div className={className}>
            <h3 className="meta__header">{entity.name}</h3>
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
                    return <label key={settingName}>
                        {settingName}:
                        <input
                            type={type}
                            checked={value}
                            value={value}
                            onChange={this._onInputChange.bind(this, entity, settingName)} />
                        <br />
                    </label>
                })}
                {entity.name === 'Level' ? <button onClick={this._onEditorButtonClick}>
                    Editor
                </button> : null}
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
        if (entity.name === 'Level') {
            entity.meta = expandSettings(entity.settings);
        }
    }

    @autobind
    _onEditorButtonClick () {
        this.props.onEditorOpen && this.props.onEditorOpen();
    }
}
