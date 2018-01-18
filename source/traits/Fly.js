import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

import {
    FLYING_BOOST
} from 'constants.js';

export default class Fly extends Trait {
    getName () {
        return 'fly';
    }

    traitWillMount () {
        this._isFlying = false;
        this._remainingTime = 0;
    }

    traitWillUpdate (deltaTime) {
        if (!this._isFlying) {
            return;
        }

        this._remainingTime -= deltaTime;
        if (this._remainingTime <= 0) {
            this.cancel();
        }
    }

    isFlying () {
        return this._isFlying;
    }

    up () {
        if (!this._isFlying) {
            return;
        }
        this._setGravity(-1);
    }

    down () {
        if (!this._isFlying) {
            return;
        }
        this._setGravity(1);
    }

    start (flyTime) {
        this._isFlying = true;
        this._remainingTime += flyTime;
        this.down();
        this.entity.jump && this.entity.jump.cancel();
        this.level.addEffect('fly');
    }

    cancel () {
        this._isFlying = false;
        this._remainingTime = 0;
        this.entity.body.setGravity(null);
        this.level.removeEffect('fly');
    }

    _setGravity (direction) {
        this.entity.body.setGravity(new Vector2(
            FLYING_BOOST,
            FLYING_BOOST * direction
        ));
    }
}
