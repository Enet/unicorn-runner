import Trait from 'traits/Trait.js';

import {
    MAX_HIDING_TIME
} from 'constants.js';

export default class Killable extends Trait {
    getName () {
        return 'killable';
    }

    traitWillMount (callbacks={}) {
        this._health = 100;
        this._afterDeathTime = 0;

        const {onChange, onKill} = callbacks;
        this._onChange = onChange || this._onChange;
        this._onKill = onKill || this._onKill;
    }

    traitWillUpdate (deltaTime) {
        if (!this.isDead()) {
            return;
        }
        this._afterDeathTime += deltaTime;
        if (this._afterDeathTime > MAX_HIDING_TIME) {
            const {entity} = this;
            this.level.removeEntity(entity);
            this._onKill();
        }
    }

    getHealth () {
        return this._health;
    }

    isDead () {
        return this._health === 0;
    }

    changeHealth (delta) {
        this._health = Math.max(0, Math.min(100, this._health + delta));
        this._onChange(this._health, delta);
    }

    reviveFully () {
        this._health = 100;
        this._afterDeathTime = 0;
    }

    _onChange () {

    }

    _onKill () {

    }
}

