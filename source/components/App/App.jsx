import ResourceManager from 'engine/ResourceManager.js';
import Sound from 'engine/Sound.js';
import {
    sounds
} from 'resources.js';

import Tcaer from 'tcaer';
import autobind from 'tcaer/autobind';
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

const resources = {sounds: {}};
Object.keys(sounds).forEach((soundName) => {
    if (soundName.substr(0, 4) !== 'Menu') {
        return;
    }
    resources.sounds[soundName] = sounds[soundName];
});

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

    componentDidMount () {
        const manager = new ResourceManager();
        manager.fetchResources(resources).then(this._onManagerReady);
        this._manager = manager;
    }

    componentDidUpdate () {
        const {settings, game} = this.props;
        if (settings.music && game.paused) {
            this._musicSound.play();
        } else {
            this._musicSound.pause();
        }
    }

    @autobind
    _onManagerReady () {
        const manager = this._manager;
        const {settings} = this.props;

        this._musicSound = new Sound({
            buffer: manager.getSound('MenuMusic'),
            loop: true,
            fadeInOnPlay: {duration: 2000},
            fadeOutOnPause: {}
        });
        settings.music && this._musicSound.play();

        this.props.dispatch({
            type: 'SOUND_MANAGER_READY',
            payload: manager
        });
    }
}
