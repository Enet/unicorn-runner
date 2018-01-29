import Tcaer from 'tcaer';
import Screen from 'components/Screen/Screen.jsx';
import Checkbox from 'components/Checkbox/Checkbox.jsx';

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
            <Checkbox name="sound">Звук</Checkbox>
            <Checkbox name="music">Музыка</Checkbox>
            <Checkbox name="mirror">Для левшей</Checkbox>
            <span className="settings-screen__back-button">
                Назад
            </span>
        </section>
    }
}
