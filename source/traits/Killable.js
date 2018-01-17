import Trait from 'traits/Trait.js';

import {
    MAX_HIDING_TIME
} from 'constants.js';

export default class Killable extends Trait {
    getName () {
        return 'killable';
    }

    traitWillMount () {
        this._isDead = false;
        this._afterDeathTime = 0;
    }

    traitWillUpdate (deltaTime, level) {
        if (!this._isDead) {
            return;
        }
        this._afterDeathTime += deltaTime;
        if (this._afterDeathTime > MAX_HIDING_TIME) {
            level.finishGame();
        }
    }

    isDead () {
        return this._isDead;
    }

    kill () {
        this._isDead = true;
    }

    revive () {
        this._isDead = false;
        this._afterDeathTime = 0;
    }
}

