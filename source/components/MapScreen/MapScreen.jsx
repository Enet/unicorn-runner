import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

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
            <div
                dataHover={true}
                dataClick={true}
                className="map-screen__step"
                onClick={this._onStepClick.bind(this, 0)}>
                0
            </div>
            <div
                dataHover={true}
                dataClick={true}
                className="map-screen__step"
                onClick={this._onStepClick.bind(this, 1)}>
                1
            </div>
            <div
                dataHover={true}
                dataClick={true}
                className="map-screen__step"
                onClick={this._onStepClick.bind(this, 2)}>
                2
            </div>
            <div
                dataHover={true}
                dataClick={true}
                className="map-screen__step"
                onClick={this._onStepClick.bind(this, 3)}>
                3
            </div>
            <span
                dataHover={true}
                dataClick={true}
                className="map-screen__back-button"
                onClick={this._onBackButtonClick}>
                Назад
            </span>
        </section>
    }

    _onStepClick (payload) {
        this.props.dispatch({
            type: 'GAME_SELECT_STEP',
            payload
        });
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'game'
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
