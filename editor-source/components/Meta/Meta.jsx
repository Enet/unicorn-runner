import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

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
            <div>{
                Object.keys(settings).map((settingName) => {
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
                        <input type={type} value={value} onChange={this._onInputChange.bind(this, entity, settingName)} />
                    </label>
                })
            }</div>
        </div>
    }

    @autobind
    _onInputChange (entity, settingName, event) {
        entity.settings[settingName] = event.currentTarget.value;
    }
}
