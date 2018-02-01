import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import Button from 'components/Button/Button.jsx';
import I18n from 'utils/I18n.js';

import dictionary from './WinnerScreen.json';
import './WinnerScreen.styl';

const i18n = new I18n(dictionary);

@connect(({step}) => step)
export default class WinnerScreen extends Screen {
    renderContent () {
        return <nav className="screen__content winner-screen__content">
            <Button
                onClick={this._onMenuButtonClick}>
                {i18n.get(this, 'menu')}
            </Button>
            <br />
            <Button
                onClick={this._onNextButtonClick}>
                {i18n.get(this, 'next')}
            </Button>
        </nav>
    }

    _getHeaderText () {
        return i18n.get(this, 'header');
    }

    _getSubheaderText () {
        if (!this._isGameCompleted()) {
            return '';
        }
        return <span>
            {i18n.get(this, 'subheader1')}
            <span className="winner-screen__line-break"> </span>
            {i18n.get(this, 'subheader2')}
        </span>
    }

    _getBaseName () {
        return 'winner-screen';
    }

    _isGameCompleted () {
        return this.props.progress > 3;
    }

    _conditionalReset () {
        if (!this._isGameCompleted()) {
            return;
        }
        this.props.dispatch({
            type: 'STEP_RESET'
        });
    }

    @autobind
    _onMenuButtonClick () {
        this._conditionalReset();
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'menu'
        });
    }

    @autobind
    _onNextButtonClick () {
        this._conditionalReset();
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'map'
        });
    }

    @autobind
    _onOneKeyDown () {
        this._onMenuButtonClick();
    }

    @autobind
    _onTwoKeyDown () {
        this._onNextButtonClick();
    }
}
