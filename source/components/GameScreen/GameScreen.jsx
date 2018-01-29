import Tcaer from 'tcaer';
import Screen from 'components/Screen/Screen.jsx';
import Score from 'components/Score/Score.jsx';
import Health from 'components/Health/Health.jsx';

import './GameScreen.styl';

export default class GameScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `game-screen`
        ];

        return <section className={className}>
            <canvas
                className="game-screen__canvas"
                id="canvas"
                width={800}
                height={600} />
            <h2 className="game-screen__header">
                Тинькофф<br />Финтех
            </h2>
            <Score value={0} />
            <Health value={100} />
            <div className="effects" id="effects"></div>
        </section>
    }
}
