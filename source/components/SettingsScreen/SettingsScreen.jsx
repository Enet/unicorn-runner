import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import Checkbox from 'components/Checkbox/Checkbox.jsx';

const dictionary = {
    sound: 'Звук',
    music: 'Музыка',
    mirror: 'Для левшей'
};

@connect(({settings}) => settings)
export default class SettingsScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `settings-screen`
        ];

        return <section className={className}>
            <h2 className="settings-screen__header">
                Настройки
            </h2>
            {Object.keys(dictionary).map((settingName) => {
                return <Checkbox
                    key={settingName}
                    value={this.props[settingName]}
                    onChange={this._onSettingChange.bind(this, settingName)}
                    name={settingName}>
                    {dictionary[settingName]}
                </Checkbox>
            })}
            <span
                dataClick={true}
                dataHover={true}
                className="settings-screen__back-button"
                onClick={this._onBackButtonClick}>
                Назад
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
