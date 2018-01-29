import Tcaer from 'tcaer';
import Screen from 'components/Screen/Screen.jsx';

export default class LoserScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `loser-screen`
        ];

        return <section className={className}>
            <h2>Неудача!</h2>
        </section>
    }
}
