import {
    Vector2
} from 'engine/math.js';

import ActionTrait from 'traits/ActionTrait.js';
import {
    FLY_GRAVITY
} from 'constants.js';

export default class ActionFlyTrait extends ActionTrait {
    start () {
        super.start();
        this._updateGravity();
    }

    stop () {
        super.stop();
        this._updateGravity();
    }

    setGravityDirection (x, y) {
        this._gravityDirection.x = Math.sign(x);
        this._gravityDirection.y = Math.sign(y);
        this._updateGravity();

        const {onChange} = this.options;
        onChange && onChange();
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
        let gravity = null;
        if (!this._isStopped) {
            gravity = this.getGravityDirection().length(FLY_GRAVITY);
            gravity.x *= 3;
        }
        this.entity.body.setGravity(gravity);
    }
}
