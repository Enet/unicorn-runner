import Tcaer from 'tcaer';
import Screen from 'components/Screen/Screen.jsx';

import './MapScreen.styl';

export default class MapScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `map-screen`
        ];

        return <section className={className}>
            <h2 className="map-screen__header">
                Карта
            </h2>
            <div className="map-screen__step">
                0
            </div>
            <div className="map-screen__step">
                1
            </div>
            <div className="map-screen__step">
                2
            </div>
            <div className="map-screen__step">
                3
            </div>
            <span className="map-screen__back-button">
                Назад
            </span>
        </section>
    }
}
