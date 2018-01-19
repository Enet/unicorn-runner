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
        this._gravityDirection = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    }

    traitWillUpdate (deltaTime) {
        if (!this._isFlying) {
            return;
        }

        this.level.changeScore(0.5);
        this._remainingTime -= deltaTime;
        if (this._remainingTime <= 0) {
            this.cancel();
        }
    }

    isFlying () {
        return this._isFlying;
    }

    up (state) {
        this._gravityDirection.up = !!state;
        this._setGravity();
    }

    down (state) {
        this._gravityDirection.down = !!state;
        this._setGravity();
    }

    right (state) {
        this._gravityDirection.right = !!state;
        this._setGravity();
    }

    left (state) {
        this._gravityDirection.left = !!state;
        this._setGravity();
    }

    start (flyTime) {
        this._isFlying = true;
        this._remainingTime += flyTime;
        this._setGravity();

        this.entity.jump && this.entity.jump.cancel();
        this.level.addEffect('fly');
    }

    cancel () {
        this._isFlying = false;
        this._remainingTime = 0;
        this.entity.body.setGravity(null);

        this.level.removeEffect('fly');
    }

    _setGravity () {
        if (!this._isFlying) {
            return;
        }

        const {up, down, left, right} = this._gravityDirection;
        let x = right * 1 - left * 1;
        let y = down * 1 - up * 1;

        this.entity.body.setGravity(new Vector2(
            FLYING_BOOST * x,
            FLYING_BOOST * y
        ));
    }
}
