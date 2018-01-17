import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';
import Pickable from 'traits/Pickable.js';

export default class MedicineBehaviour extends Trait {
    getName () {
        return 'behaviour';
    }

    traitWillMount () {
        this._isActive = true;
    }

    traitCollision (body) {
        const {entity} = body;
        if (!entity.killable || entity.killable.isDead()) {
            return;
        }
        if (!this._isActive) {
            return;
        }
        this._isActive = false;
        entity.killable.health(30);
    }
}
