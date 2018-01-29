import Tcaer from 'tcaer';
import {
    connect
} from 'xuder';

import GameScreen from 'components/GameScreen/GameScreen.jsx';
import BackgroundScreen from 'components/BackgroundScreen/BackgroundScreen.jsx';
import MapScreen from 'components/MapScreen/MapScreen.jsx';
import MenuScreen from 'components/MenuScreen/MenuScreen.jsx';
import SettingsScreen from 'components/SettingsScreen/SettingsScreen.jsx';
import PauseScreen from 'components/PauseScreen/PauseScreen.jsx';
import LoserScreen from 'components/LoserScreen/LoserScreen.jsx';
import WinnerScreen from 'components/WinnerScreen/WinnerScreen.jsx';

import './App.styl';

export default connect((state) => {
    return {zzz: state};
}, class App extends Tcaer.Component {
    render () {
        const {screen} = this.state;
        const className = [
            `app`,
            `app_screen_${screen}`
        ];

        return <main className={className} id="app">
            <GameScreen active={screen === 'game'} />
            <BackgroundScreen active={screen !== 'game'} />
            <PauseScreen active={screen === 'pause'} />
            <LoserScreen active={screen === 'loser'} />
            <WinnerScreen active={screen === 'winner'} />
            <MapScreen active={screen === 'map'} />
            <MenuScreen active={screen === 'menu'} />
            <SettingsScreen active={screen === 'settings'} />
            zzz={this.props.zzz}
        </main>
    }

    componentWillMount () {
        this.state.screen = 'menu';
    }

    componentDidMount () {
        this.props.dispatch((getState, dispatch) => {
            dispatch({type: 'plus'});
            setTimeout(() => {
                dispatch({type: 'plus'});
            }, 2000);
        });
    }
});
