import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

export default class Bomb extends Trait {
    getExplosionProgress () {
        return this._explosionProgress;
    }

    getName () {
        return 'behaviour';
    }

    traitWillMount (callbacks) {
        this._callbacks = callbacks;
        this._isActive = true;
        this._explosionProgress = 0;
    }

    traitCollision (body) {
        const {entity} = this;
        if (entity.killable && entity.killable.isDead()) {
            return;
        }
        if (!body.entity.killable) {
            return;
        }
        if (!this._isActive) {
            return;
        }
        this._isActive = false;
        body.entity.killable.changeHealth(-80);

        const x = 10 - 10 * Math.random();
        const y = -10 - 5 * Math.random();
        body.move(new Vector2(x, y));
        this.entity.body.move(new Vector2(-x, -y));
        this.entity.body.setGravity(null);

        const {onBoom} = this._callbacks;
        onBoom && onBoom();
    }

    traitWillUpdate () {
        if (this._isActive) {
            return;
        }
        if (this._explosionProgress > 1) {
            return;
        }
        this._explosionProgress += 0.1;
    }
}
