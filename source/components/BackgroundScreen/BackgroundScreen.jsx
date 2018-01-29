import Tcaer from 'tcaer';
import Screen from 'components/Screen/Screen.jsx';

import './BackgroundScreen.styl';

export default class BackgroundScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `background-screen`
        ];

        return <section className={className} />
    }
}
