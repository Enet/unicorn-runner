import {
    Vector2
} from 'engine/math.js';

import ActionTrait from 'traitsnew/ActionTrait.js';
import {
    FLY_GRAVITY
} from 'constants.js';

export default class ActionFlyTrait extends ActionTrait {
    start () {
        super.start();
        this._updateGravity();
        this.level.addEffect('fly');
    }

    stop () {
        super.stop();
        this._updateGravity();
        this.level.removeEffect('fly');
    }

    setGravityDirection (x, y) {
        this._gravityDirection.x = Math.sign(x);
        this._gravityDirection.y = Math.sign(y);
    }

    getGravityDirection () {
        return this._gravityDirection;
    }

    getName () {
        return 'fly';
    }

    traitWillMount () {
        super.traitWillMount(...arguments);
        this._gravityDirection = new Vector2(0, 0);
    }

    _updateGravity () {
        const gravity = this._isStopped ?
            null :
            this.getGravityDirection().length(FLY_GRAVITY);
        this.entity.body.setGravity(gravity);
    }
}
