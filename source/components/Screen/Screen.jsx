import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import {
    KEY_ESCAPE
} from 'constants.js';

import './Screen.styl';

@connect()
export default class Screen extends Tcaer.Component {
    componentDidMount () {
        document.addEventListener('keydown', this._onKeyDown);
    }

    componentWillUnmount () {
        document.removeEventListener('keydown', this._onKeyDown);
    }

    _getClassName () {
        return [
            `screen`,
            `screen_active_${!!this.props.active}`
        ];
    }

    @autobind
    _onKeyDown (event) {
        if (!this.props.active) {
            return;
        }
        if (event.keyCode !== KEY_ESCAPE) {
            return;
        }
        this._onEscapeKeyDown();
    }

    @autobind
    _onEscapeKeyDown () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'menu'
        });
    }
}
