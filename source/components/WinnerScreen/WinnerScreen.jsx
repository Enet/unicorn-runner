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
    render () {
        const className = [
            ...this._getClassName(),
            `winner-screen`
        ];

        return <section className={className}>
            <h2 className="winner-screen__header">
                {i18n.get(this, 'header')}
            </h2>
            <p className="winner-screen__description">
                {this._isGameCompleted() ? i18n.get(this, 'description') : <span>&nbsp;</span>}
            </p>
            <nav className="winner-screen__menu">
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
        </section>
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
}
