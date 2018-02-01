import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import I18n from 'utils/I18n.js';

import dictionary from './SpinnerScreen.json';
import './SpinnerScreen.styl';

const i18n = new I18n(dictionary);

const DELAY = 500;

@connect()
export default class SpinnerScreen extends Screen {
    renderHeader () {

    }

    renderSubheader () {

    }

    renderContent () {
        return super.renderHeader();
    }

    _getHeaderText () {
        return i18n.get(this, 'header');
    }

    _getBaseName () {
        return 'spinner-screen';
    }

    componentDidUpdate (prevProps) {
        if (!prevProps.active && this.props.active) {
            this.componentWillUnmount();
            this._initTimer = setTimeout(this._onInitTimerTick, DELAY);
        }
    }

    componentWillUnmount () {
        clearTimeout(this._initTimer);
        clearTimeout(this._resumeTimer);
        clearTimeout(this._screenTimer);
    }

    _onEscapeKeyDown () {

    }

    @autobind
    _onInitTimerTick () {
        this.props.dispatch({
            type: 'GAME_INIT'
        });
        this._resumeTimer = setTimeout(this._onResumeTimerTick, DELAY);
    }

    @autobind
    _onResumeTimerTick () {
        this.props.dispatch({
            type: 'GAME_RESUME'
        });
        this._screenTimer = setTimeout(this._onScreenTimerTick, DELAY);
    }

    @autobind
    _onScreenTimerTick () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'game'
        });
    }
}
