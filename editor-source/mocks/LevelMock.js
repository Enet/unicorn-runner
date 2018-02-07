import {
    Vector2
} from 'engine/math.js';
import Level from '../../game-source/Level.js';

const NOOP = Function.prototype;

export default class LevelMock {
    constructor (settings={}, manager) {
        this.name = 'Level';
        this.settings = settings;
        this.manager = manager;
        this.player = {
            body: {
                center: new Vector2(0, 0)
            }
        };
    }

    createSound () {
        return {
            play: NOOP,
            pause: NOOP
        };
    }
}

Object.getOwnPropertyNames(Level.prototype).forEach((methodName) => {
    if (LevelMock.prototype.hasOwnProperty(methodName)) {
        return;
    }
    LevelMock.prototype[methodName] = NOOP;
});
