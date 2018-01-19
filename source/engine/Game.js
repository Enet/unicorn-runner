import ResourceManager from './ResourceManager.js';
import Keyboard from './Keyboard.js';

const MAX_DELTA_TIME = 50;
const UPDATE_TIME = 17;

export default class Game {
    constructor (options) {
        const manager = new ResourceManager();
        manager.fetchResources(this._getResources()).then(() => {
            this._onManagerReady(options);
        });
        this._manager = manager;
        this._isPaused = false;
    }

    destructor () {
        this._keyboard.destructor();
    }

    pause () {
        this._isPaused = true;
    }

    resume () {
        this._isPaused = false;
        requestAnimationFrame(this._onAnimationFrame);
    }

    getManager () {
        return this._manager;
    }

    _getResources () {
        const images = {};
        const sounds = {};
        return {images, sounds};
    }

    _onManagerReady ({canvas}) {
        this._onAnimationFrame = this._onAnimationFrame.bind(this);
        this._onUpdate = this._onUpdate.bind(this);

        this._keyboard = new Keyboard();
        this._canvas = canvas;
        this._lastTime = 0;
        this._accumulatedTime = 0;
        requestAnimationFrame(this._onAnimationFrame);
    }

    _onAnimationFrame (currentTime) {
        if (this._isPaused) {
            return;
        }

        let deltaTime = Math.min(currentTime - this._lastTime, MAX_DELTA_TIME);
        let accumulatedTime = this._accumulatedTime;
        accumulatedTime += deltaTime;
        while (accumulatedTime > UPDATE_TIME) {
            this._onUpdate(UPDATE_TIME);
            accumulatedTime -= UPDATE_TIME;
        }
        this._lastTime = currentTime;
        this._accumulatedTime = accumulatedTime;
        requestAnimationFrame(this._onAnimationFrame);
    }

    _onUpdate () {

    }
}

