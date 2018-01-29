import Tcaer from 'tcaer';
import {
    connect
} from 'xuder';

import Screen from 'components/Screen/Screen.jsx';

export default connect((state) => {
    return {};
}, class WinnerScreen extends Screen {
    render () {
        const className = [
            ...this._getClassName(),
            `winner-screen`
        ];

        return <section className={className}>
            <h2>Победа!</h2>
            <span onClick={this._onNextButtonClick.bind(this)}>Далее</span>
        </section>
    }

    _onNextButtonClick () {
        this.props.dispatch({
            type: 'SCREEN_CHANGE',
            payload: 'map'
        });
    }
});
