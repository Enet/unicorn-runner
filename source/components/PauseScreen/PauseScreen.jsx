import Tcaer from 'tcaer';
import Screen from 'components/Screen/Screen.jsx';

export default class PauseScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `pause-screen`
        ];

        return <section className={className}>
            <h2 className="pause-screen__header">
                Пауза
            </h2>
            <span className="pause-screen__back-button">
                Назад
            </span>
            <span className="pause-screen__menu-button">
                Меню
            </span>
        </section>
    }
}
