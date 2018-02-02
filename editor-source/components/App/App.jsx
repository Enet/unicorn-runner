import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';

import Level from 'components/Level/Level.jsx';
import Menu from 'components/Menu/Menu.jsx';

import './App.styl';

export default class App extends Tcaer.Component {
    render () {
        const className = [
            `app`
        ];

        return <main className={className}>
            <Level />
            <Menu />
        </main>
    }

    @autobind
    _onClick () {

    }
}
