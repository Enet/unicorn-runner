import Tcaer from 'tcaer';

import './Screen.styl';

export default class Screen extends Tcaer.Component {
    _getClassName () {
        return [
            `screen`,
            `screen_active_${!!this.props.active}`
        ];
    }
}
