import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

export default class BugBehaviour extends Trait {
    getName () {
        return 'behaviour';
    }

    traitWillMount () {
        this._isActive = true;
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
        if (Math.abs(this.entity.body.angle % (2 * Math.PI)) > Math.PI / 12) {
            return;
        }
        this._isActive = false;
        body.entity.killable.changeHealth(-40);

        const x = -5;
        const y = -5;
        body.move(new Vector2(x, y));
    }
}
