import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import I18n from 'utils/I18n.js';

import dictionary from './WinnerScreen.json';

const i18n = new I18n(dictionary);

@connect()
export default class WinnerScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `winner-screen`
        ];

        return <section className={className}>
            <h2>
                {i18n.get(this, 'victory')}
            </h2>
            <span
                dataHover={true}
                dataClick={true}
                onClick={this._onNextButtonClick}>
                {i18n.get(this, 'next')}
            </span>
        </section>
    }

    @autobind
    _onNextButtonClick () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'map'
        });
    }
}
