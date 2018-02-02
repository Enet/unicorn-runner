import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import './Menu.styl';

export default class Menu extends Tcaer.Component {
    render () {
        const className = [
            `menu`
        ];

        return <div className={className}>

        </div>
    }

    @autobind
    _onClick () {

    }
}
