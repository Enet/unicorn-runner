import Trait from 'traits/Trait.js';

import {
    MAX_HIDING_TIME
} from 'constants.js';

export default class Killable extends Trait {
    getName () {
        return 'killable';
    }

    traitWillMount () {
        this._health = 100;
        this._isDead = false;
        this._afterDeathTime = 0;
    }

    traitWillUpdate (deltaTime, level) {
        if (!this._isDead) {
            return;
        }
        this._afterDeathTime += deltaTime;
        if (this._afterDeathTime > MAX_HIDING_TIME) {
            const {entity} = this;
            entity.controller && entity.controller.traitKill(level);
        }
    }

    getHealth () {
        return this._health;
    }

    isDead () {
        return this._isDead;
    }

    health (deltaHealth) {
        const {entity} = this;
        this._health = Math.min(100, this._health + deltaHealth);
        entity.controller && entity.controller.traitHealth(this._health);
    }

    kill () {
        const {entity} = this;
        this._health = Math.max(0, this._health - 40);
        if (this._health) {
            entity.controller && entity.controller.traitHealth(this._health);
        } else {
            this._isDead = true;
        }
    }

    revive () {
        this._health = 100;
        this._isDead = false;
        this._afterDeathTime = 0;
    }
}

