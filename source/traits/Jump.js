import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

import {
    MAX_JUMPING_TIME,
    JUMPING_BOOST,
    MAX_NO_COLLISION_TIME
} from 'constants.js';

export default class Jump extends Trait {
    getName () {
        return 'jump';
    }

    traitWillMount () {
        this._speedFactor = 1;
        this._noCollisionTime = 0;
        this._isJumping = true;
        this._isKeyPressed = false;
        this._jumpingTime = Infinity;
    }

    traitWillUpdate (deltaTime) {
        this._noCollisionTime += deltaTime;
        if (!this._isJumping) {
            if (this._noCollisionTime > MAX_NO_COLLISION_TIME) {
                this._isJumping = true;
                this._jumpingTime = Infinity;
            }
            return;
        }
        if (this._jumpingTime > MAX_JUMPING_TIME) {
            return;
        }
        this._jumpingTime += deltaTime;
        this.entity.body.move(new Vector2(
            0.1 * JUMPING_BOOST * this._speedFactor,
            -JUMPING_BOOST
        ));
    }

    traitCollision (body, collision) {
        if (!body.entity.obstacle) {
            return;
        }
        if (body.center.y < this.entity.body.center.y + this.entity.size.height / 4) {
            return;
        }
        this._noCollisionTime = 0;

        if (!this._isJumping || this._jumpingTime <= MAX_JUMPING_TIME) {
            return;
        }

        this._isJumping = false;
        if (this._isKeyPressed) {
            this.start();
        }
    }

    isJumping () {
        return this._isJumping;
    }

    setSpeedFactor (factor) {
        this._speedFactor = factor;
    }

    start () {
        this._isKeyPressed = true;
        if (this._isJumping) {
            return;
        }
        if (this.entity.fly && this.entity.fly.isFlying()) {
            return;
        }
        this._isJumping = true;
        this._jumpingTime = 0;
    }

    cancel () {
        this._isKeyPressed = false;
        this._jumpingTime = Infinity;
    }
}
