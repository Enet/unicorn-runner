import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import Step from 'components/Step/Step.jsx';
import Button from 'components/Button/Button.jsx';
import I18n from 'utils/I18n.js';

import step0Image from 'menu/0.png';
import step1Image from 'menu/1.png';
import step2Image from 'menu/2.png';
import step3Image from 'menu/3.png';

import dictionary from './MapScreen.json';
import './MapScreen.styl';

const i18n = new I18n(dictionary);

@connect(({step}) => step)
export default class MapScreen extends Screen {
    render () {
        const {step0, step1, step2, step3, progress} = this.props;
        const score = step0 + step1 + step2 + step3;
        const className = [
            ...this._getClassName(),
            `map-screen`
        ];

        return <section className={className}>
            <h2 className="map-screen__header">
                {i18n.get(this, 'header')}
            </h2>
            <p className="map-screen__description">
                {i18n.get(this, 'description')}
            </p>
            <Button disabled={true} className="map-screen__score-button">
                {score}$ {i18n.get(this, 'of')} 10000$
            </Button>
            <div className="map-screen__map">
                <Step
                    image={step0Image}
                    disabled={progress < 0}
                    className="map-screen__step"
                    onClick={this._onStepClick.bind(this, 0)} />
                <Step
                    image={step1Image}
                    disabled={progress < 1}
                    className="map-screen__step"
                    onClick={this._onStepClick.bind(this, 1)} />
                <Step
                    image={step2Image}
                    disabled={progress < 2}
                    className="map-screen__step"
                    onClick={this._onStepClick.bind(this, 2)} />
                <Step
                    image={step3Image}
                    disabled={progress < 3}
                    className="map-screen__step"
                    onClick={this._onStepClick.bind(this, 3)} />
            </div>
            <Button
                className="map-screen__reset-button"
                onClick={this._onResetButtonClick}>
                {i18n.get(this, 'reset')}
            </Button>
            <br />
            <Button
                className="map-screen__back-button"
                onClick={this._onBackButtonClick}>
                {i18n.get(this, 'back')}
            </Button>
        </section>
    }

    _onStepClick (payload) {
        this.props.dispatch({
            type: 'GAME_SELECT_STEP',
            payload
        });
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'spinner'
        });
    }

    @autobind
    _onBackButtonClick () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'menu'
        });
    }

    @autobind
    _onResetButtonClick () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'reset'
        });
    }
}
