import {
    Vector2
} from 'engine/math.js';

import ActionTrait from 'traitsnew/ActionTrait.js';
import {
    RUN_SPEED
} from 'constants.js';

export default class ActionRunTrait extends ActionTrait {
    left () {
        this.start(-1);
    }

    right () {
        this.start(1);
    }

    start (direction) {
        direction = Math.sign(+direction || 1);
        if (this._direction !== direction) {
            this._isStopped = true;
        }
        this._direction = direction;
        super.start(direction);
    }

    isStopped () {
        return this._isStopped;
    }

    getDirection () {
        return this._direction;
    }

    getName () {
        return 'run';
    }

    traitWillMount ({speed=RUN_SPEED}) {
        super.traitWillMount(...arguments);
        this._direction = 1;
        this._impulse = new Vector2(+speed, 0);
    }

    traitWillUpdate () {
        if (this._isStopped) {
            return;
        }
        const direction = this.getDirection();
        this.entity.body.move(this._impulse.length(direction));
    }
}
