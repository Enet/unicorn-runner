import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

export default class Fight extends Trait {
    start () {
        if (this._isFighting) {
            return;
        }
        this._isFighting = true;
    }

    cancel () {
        if (!this._isFighting) {
            return;
        }
        this._isFighting = false;
    }

    isFighting () {
        const {entity} = this;
        if (entity.fly && entity.fly.isFlying()) {
            return;
        }
        if (entity.jump && entity.jump.isJumping()) {
            return;
        }
        return this._isFighting;
    }

    getName () {
        return 'fight';
    }

    traitWillMount () {
        this._isFighting = false;
    }

    traitCollision (body) {
        if (!this.isFighting()) {
            return;
        }
        if (body.center.y >= this.entity.body.center.y + this.entity.size.height / 2) {
            return;
        }
        body.move(new Vector2(0.1, 0));
        if (!body.entity.killable || body.entity.killable.isDead()) {
            return;
        }
        body.entity.killable.changeHealth(-10);
    }
}
