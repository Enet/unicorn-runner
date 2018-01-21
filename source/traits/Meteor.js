import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

export default class Meteor extends Trait {
    getName () {
        return 'meteor';
    }

    traitWillMount (callbacks, {gravity, trigger}) {
        this._callbacks = callbacks;
        this._isTriggered = false;
        this._isFalling = true;
        this._gravity = gravity;
        this._trigger = trigger;
    }

    traitDidMount () {
        this.entity.body.setGravity(new Vector2(0, 0));
    }

    traitWillUpdate (deltaTime) {
        if (!this._isFalling) {
            return;
        }
        if (this._isTriggered) {
            return;
        }
        if (this.level.player.body.center.x < this._trigger) {
            return;
        }
        this._isTriggered = true;
        const gravity = this._gravity;
        this.entity.body.setGravity(gravity ? new Vector2(...gravity) : null);
    }

    traitCollision (body) {
        if (!this._isFalling) {
            return;
        }

        let isHitPrevented = false;
        const {onHit} = this._callbacks;
        onHit && onHit(body, () => {
            isHitPrevented = true;
        });
        if (isHitPrevented) {
            return;
        }

        this._isFalling = false;
        const x = 2 - 4 * Math.random();
        const y = -2 - 4 * Math.random();
        this.entity.body.move(new Vector2(-x, -y));
    }
}
