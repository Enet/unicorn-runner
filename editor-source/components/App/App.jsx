import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import './App.styl';

export default class App extends Tcaer.Component {
    render () {
        const className = [
            `editor`
        ];

        return <main className={className}>
            Hello world!
        </main>
    }

    @autobind
    _onClick () {

    }
}
