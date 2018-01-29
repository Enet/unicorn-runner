import Tcaer from 'tcaer';
import {
    connect
} from 'xuder';

import {
    KEY_ESCAPE
} from 'constants.js';

import './Screen.styl';

export default connect((state) => {
    return {};
}, class Screen extends Tcaer.Component {
    componentDidMount () {
        this._onKeyDown = this._onKeyDown.bind(this);
        this._onEscapeKeyDown = this._onEscapeKeyDown.bind(this);
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

    _onKeyDown (event) {
        if (!this.props.active) {
            return;
        }
        if (event.keyCode !== KEY_ESCAPE) {
            return;
        }
        this._onEscapeKeyDown();
    }

    _onEscapeKeyDown () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'menu'
        });
    }
});
