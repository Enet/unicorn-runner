import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import './Editor.styl';

export default class Editor extends Tcaer.Component {
    render () {
        const className = [
            `editor`
        ];

        return <div className={className}>
            <textarea></textarea>
        </div>
    }

    @autobind
    _onClick () {

    }
}
