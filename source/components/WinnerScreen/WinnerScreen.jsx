import Tcaer from 'tcaer';
import Screen from 'components/Screen/Screen.jsx';

export default class WinnerScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `winner-screen`
        ];

        return <section className={className}>
            <h2>Победа!</h2>
        </section>
    }
}
