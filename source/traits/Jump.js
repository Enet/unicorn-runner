import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

import {
    MAX_JUMPING_TIME,
    JUMPING_BOOST
} from 'constants.js';

export default class Jump extends Trait {
    getName () {
        return 'jump';
    }

    traitWillMount () {
        this._isJumping = true;
        this._jumpingTime = Infinity;
    }

    traitWillUpdate (deltaTime) {
        if (!this._isJumping || this._jumpingTime > MAX_JUMPING_TIME) {
            return;
        }
        this._jumpingTime += deltaTime;
        this.entity.body.move(new Vector2(0, -JUMPING_BOOST));
    }

    traitCollision (body) {
        if (!this._isJumping || this._jumpingTime <= MAX_JUMPING_TIME) {
            return;
        }
        if (!body.statical) {
            return;
        }

        this._isJumping = false;
        this.cancel();
    }

    isJumping () {
        return this._isJumping;
    }

    start () {
        if (this._isJumping) {
            return;
        }
        this._isJumping = true;
        this._jumpingTime = 0;
    }

    cancel () {
        this._jumpingTime = Infinity;
    }
}
