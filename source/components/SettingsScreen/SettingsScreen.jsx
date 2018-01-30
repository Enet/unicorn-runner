import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import Checkbox from 'components/Checkbox/Checkbox.jsx';
import I18n from 'utils/I18n.js';

import dictionary from './SettingsScreen.json';

const i18n = new I18n(dictionary);
const settingNames = ['sound', 'music', 'mirror'];

@connect(({settings}) => settings)
export default class SettingsScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `settings-screen`
        ];

        return <section className={className}>
            <h2 className="settings-screen__header">
                {i18n.get(this, 'header')}
            </h2>
            {settingNames.map((settingName) => {
                return <Checkbox
                    key={settingName}
                    value={this.props[settingName]}
                    onChange={this._onSettingChange.bind(this, settingName)}
                    name={settingName}>
                    {i18n.get(this, settingName)}
                </Checkbox>
            })}
            <span
                dataClick={true}
                dataHover={true}
                className="settings-screen__back-button"
                onClick={this._onBackButtonClick}>
                {i18n.get(this, 'back')}
            </span>
        </section>
    }

    _onSettingChange (settingName, event) {
        this.props.dispatch({
            type: 'SETTING_CHANGE',
            name: settingName,
            value: event.currentTarget.checked
        });
    }

    @autobind
    _onBackButtonClick () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'menu'
        });
    }
}
