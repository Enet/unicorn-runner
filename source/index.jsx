import 'styles/index.styl';

import Tcaer from 'tcaer';
import UnicornGame from 'UnicornGame.js';
import {
    KEY_ESCAPE
} from 'constants.js';

const APP_ID = 'app';
const appNode = document.getElementById(APP_ID);

const CANVAS_ID = 'canvas';
const canvasNode = document.getElementById(CANVAS_ID);
const canvasContext = canvasNode.getContext('2d');

const SCORE_ID = 'score';
const scoreNode = document.getElementById(SCORE_ID);

const HEALTH_ID = 'health';
const healthNode = document.getElementById(HEALTH_ID);

const EFFECTS_ID = 'effects';
const effectsNode = document.getElementById(EFFECTS_ID);

const inputNodes = {};
const settings = {
    sound: true,
    music: true,
    mirror: false
};

let appScreen = 'menu';
let unicornGame = null;

function saveSettings (newSettings) {
    Object.assign(settings, newSettings);
    try {
        for (let s in settings) {
            localStorage.setItem(s, settings[s] ? '1' : '');
        }
    } catch (error) {
        console.error(error);
    }
}

function loadSettings () {
    for (let s in settings) {
        const inputNode = document.getElementsByName(s)[0];
        inputNodes[s] = inputNode;
        let setting = settings[s];
        try {
            setting = localStorage.getItem(s);
            setting = setting === null ? setting : !!setting;
        } catch (error) {
            console.error(error);
        }
        settings[s] = setting;
        inputNode.checked = setting;
    }
}

function setAppScreen (name) {
    appScreen = name;
    appNode.setAttribute('data-screen', name);
}

function startGame (step) {
    unicornGame = new UnicornGame({
        debug: false,
        step,
        context: canvasContext,
        settings,
        onScoreChange,
        onHealthChange,
        onEffectChange,
        onGameLose,
        onGameWin
    });
}

function pauseGame () {
    setAppScreen('pause');
    unicornGame.pause();
}

function resumeGame () {
    setAppScreen('game');
    unicornGame.resume();
}

function exitGame () {
    setAppScreen('menu');
    unicornGame.pause();
    unicornGame.destructor();
    unicornGame = null;
}

function onScoreChange (value) {
    scoreNode.innerHTML = value;
}

function onHealthChange (value) {
    healthNode.innerHTML = value;
}

function onEffectChange (effects) {
    effectsNode.innerHTML = Array.from(effects.values()).join();
}

function onGameLose () {
    exitGame();
    setAppScreen('loser');
}

function onGameWin () {
    exitGame();
    setAppScreen('winner');
}

function onDocumentClick (event) {
    if (!event.target) {
        return;
    }
    const screen = event.target.getAttribute('data-screen');
    if (screen) {
        setAppScreen(screen);
    }

    const step = event.target.getAttribute('data-step');
    if (step) {
        startGame(+step);
    }

    const resume = event.target.getAttribute('data-resume');
    if (resume) {
        resumeGame();
    }

    const exit = event.target.getAttribute('data-exit');
    if (exit) {
        exitGame();
    }
}

function onDocumentKeyDown (event) {
    if (event.keyCode !== KEY_ESCAPE) {
        return;
    }
    if (appScreen === 'game') {
        pauseGame();
    } else if (appScreen === 'pause') {
        resumeGame();
    } else {
        setAppScreen('menu');
    }
}

function onDocumentChange (event) {
    if (Object.values(inputNodes).indexOf(event.target) === -1) {
        return;
    }

    const name = event.target.name;
    saveSettings({[name]: event.target.checked});
}

loadSettings();
document.addEventListener('click', onDocumentClick);
document.addEventListener('keydown', onDocumentKeyDown);
document.addEventListener('change', onDocumentChange);

setAppScreen('map');

class Hii extends Tcaer.Component {
    render () {
        return <span>12345</span>
    }

    componentWillMount () {
        console.log('hii');
    }

    componentWillUnmount () {
        console.log('hii bye');
    }
}

class MyAsdf extends Tcaer.Component {
    render () {
        return <div>
            MY {this.state.hello ? [1, 2, 3] : <Hii />} ASDF!!!
            <b>{this.props.x}</b>
        </div>
    }

    componentWillMount () {
        console.log('will mount');
    }

    componentDidMount () {
        console.log('did mount');
        setTimeout(() => {
            this.setState({
                hello: 'world'
            });
        }, 2000);
    }

    componentWillUpdate (nextProps) {
        console.log('will update', nextProps);
    }

    componentDidUpdate (prevProps) {
        console.log('did update', prevProps);
    }

    componentWillUnmount () {
        console.log('unmount');
    }
}

Tcaer.render(<MyAsdf x={123} />, document.getElementById('tcaer'));
