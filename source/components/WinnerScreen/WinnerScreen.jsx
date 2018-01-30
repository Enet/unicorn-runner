import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';

@connect()
export default class WinnerScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `winner-screen`
        ];

        return <section className={className}>
            <h2>Победа!</h2>
            <span
                dataHover={true}
                dataClick={true}
                onClick={this._onNextButtonClick}>
                Далее
            </span>
        </section>
    }

    @autobind
    _onNextButtonClick () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'map'
        });
    }
}
