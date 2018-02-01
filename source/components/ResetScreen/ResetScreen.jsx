import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import Screen from 'components/Screen/Screen.jsx';
import Button from 'components/Button/Button.jsx';
import I18n from 'utils/I18n.js';

import dictionary from './ResetScreen.json';
import './ResetScreen.styl';

const i18n = new I18n(dictionary);

export default class ResetScreen extends Screen {
    renderContent () {
        return <nav className="screen__content reset-screen__content">
            <Button
                onClick={this._onYesButtonClick}>
                {i18n.get(this, 'yes')}
            </Button>
            <br />
            <Button
                onClick={this._onNoButtonClick}>
                {i18n.get(this, 'no')}
            </Button>
        </nav>
    }

    _getHeaderText () {
        return i18n.get(this, 'header');
    }

    _getSubheaderText () {
        return <span>
            <span className="reset-screen__desktop-text">
                {i18n.get(this, 'subheader1')}
            </span>
            <span className="reset-screen__mobile-text">
                {i18n.get(this, 'shovel1')}
            </span>
            <span className="reset-screen__line-break"> </span>
            <span className="reset-screen__desktop-text">
                {i18n.get(this, 'subheader2')}
            </span>
            <span className="reset-screen__mobile-text">
                {i18n.get(this, 'shovel2')}
            </span>
        </span>;
    }

    _getBaseName () {
        return 'reset-screen';
    }

    _onEscapeKeyDown () {
        this._onAnswer();
    }

    @autobind
    _onYesButtonClick () {
        this.props.dispatch({
            type: 'STEP_RESET'
        });
        this._onAnswer();
    }

    @autobind
    _onNoButtonClick () {
        this._onAnswer();
    }

    @autobind
    _onAnswer () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'map'
        });
    }
}
