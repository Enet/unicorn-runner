import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';
import Locale from 'components/Locale/Locale.jsx';

import './BackgroundScreen.styl';

@connect()
export default class BackgroundScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `background-screen`
        ];

        return <section className={className}>
            <Locale
                value={this.context.locale}
                onChange={this._onLocaleChange} />
        </section>
    }

    @autobind
    _onLocaleChange (payload) {
        this.props.dispatch({
            type: 'LOCALE_CHANGE',
            payload
        });
    }

    _onEscapeKeyDown () {

    }
}
