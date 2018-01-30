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

@connect(state => state)
export default class App extends Tcaer.Component {
    render () {
        const {screen} = this.props;
        const className = [
            `app`,
            `app_screen_${screen}`
        ];

        return <main className={className}>
            <GameScreen active={screen === 'game'} />
            <BackgroundScreen active={screen !== 'game'} />
            <PauseScreen active={screen === 'pause'} />
            <LoserScreen active={screen === 'loser'} />
            <WinnerScreen active={screen === 'winner'} />
            <MapScreen active={screen === 'map'} />
            <MenuScreen active={screen === 'menu'} />
            <SettingsScreen active={screen === 'settings'} />
        </main>
    }
}
