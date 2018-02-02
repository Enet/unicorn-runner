import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import './Meta.styl';

export default class Meta extends Tcaer.Component {
    render () {
        const className = [
            `meta`
        ];

        return <div className={className}>

        </div>
    }

    @autobind
    _onClick () {

    }
}
