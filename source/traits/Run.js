import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

import {
    RUNNING_SPEED
} from 'constants.js';

export default class Run extends Trait {
    getName () {
        return 'run';
    }

    traitWillMount () {
        this._runningDirection = 0;
        this._runningDistance = 0;
        this._maxDistance = -Infinity;
    }

    traitDidMount () {
        this._prevBodyCenter = this.entity.body.center;
    }

    left () {
        this.run(-1);
    }

    right () {
        this.run(1);
    }

    run (factor=0) {
        factor *= 30;
        this._runningDirection = factor;

        const {entity} = this;
        if ((entity.jump && entity.jump.isJumping()) ||
            (entity.fly && entity.fly.isFlying())) {
            factor /= 2;
        } else if (entity.body.center.x > this._maxDistance) {
            this.level.changeScore(0.2);
            this._maxDistance = entity.body.center.x;
        }

        entity.body.move(new Vector2(RUNNING_SPEED * factor, 0));
        this._runningDistance += entity.body.center.x - this._prevBodyCenter.x;
        this._prevBodyCenter = entity.body.center;
    }

    getDirection () {
        return this._runningDirection >= 0;
    }

    getDistance () {
        return this._runningDistance;
    }
}
