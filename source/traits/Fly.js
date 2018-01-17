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
        this._prevDirection = null;
        this._speedFactor = 1;
        this._isFlying = false;
        this._remainingTime = 0;
    }

    traitWillUpdate (deltaTime, level) {
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

    setSpeedFactor (factor) {
        this._speedFactor = factor;
        if (this._isFlying) {
            this._setGravity();
        }
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
        this._setGravity(1);
        this.entity.jump && this.entity.jump.cancel();
    }

    cancel () {
        this._isFlying = false;
        this._remainingTime = 0;
        this.entity.body.setGravity(null);
    }

    _setGravity (direction=this._prevDirection) {
        this._prevDirection = direction;
        const speedFactor = this._speedFactor;
        this.entity.body.setGravity(new Vector2(
            FLYING_BOOST * speedFactor,
            FLYING_BOOST * speedFactor * direction
        ));
    }
}
