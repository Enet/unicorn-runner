import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import Button from 'components/Button/Button.jsx';
import I18n from 'utils/I18n.js';
import {
    VICTORY_CONDITION
} from 'constants.js';

import dictionary from './WinnerScreen.json';
import './WinnerScreen.styl';

const i18n = new I18n(dictionary);
const CREDIT_URI = 'https://www.tinkoff.ru/loans/cash-loan/';

@connect(({step}) => step)
export default class WinnerScreen extends Screen {
    renderContent () {
        return <nav className="screen__content winner-screen__content">
            {this._isGameCompleted() ? <span>
                <Button disabled={true}>
                    {i18n.get(this, 'left').replace('{X}', this._getScore() - VICTORY_CONDITION)}
                </Button>
                <br />
                <Button>
                    <a
                        className="winner-screen__link"
                        href={CREDIT_URI}
                        rel="noopener noreferrer"
                        target="_blank">
                        {i18n.get(this, 'credit')}
                    </a>
                </Button>
                <br />
            </span> : null}
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

    _getScore () {
        const {step0, step1, step2, step3} = this.props;
        return step0 + step1 + step2 + step3;
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
            {i18n.get(this, 'subheader2').replace('{X}', VICTORY_CONDITION)}
        </span>
    }

    _getBaseName () {
        return 'winner-screen';
    }

    _isGameCompleted () {
        const score = this._getScore();
        return this.props.progress > 3 && score >= VICTORY_CONDITION;
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
