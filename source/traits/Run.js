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
        this._runningDirection = 1;
        this._runningDistance = 0;
        this._maxDistance = -Infinity;
    }

    traitDidMount () {
        this._prevBodyCenter = this.entity.body.center;
    }

    left () {
        this._run(-1);
    }

    right () {
        this._run(1);
    }

    getDirection () {
        return this._runningDirection;
    }

    getDistance () {
        return this._runningDistance;
    }

    _run (speedFactor=1) {
        this._runningDirection = speedFactor;
        speedFactor *= 30;

        const {entity} = this;
        if ((entity.jump && entity.jump.isJumping()) ||
            (entity.fly && entity.fly.isFlying())) {
            speedFactor /= 2;
        } else if (entity.body.center.x > this._maxDistance) {
            this.level.changeScore(0.2);
            this._maxDistance = entity.body.center.x;
        }

        entity.body.move(new Vector2(RUNNING_SPEED * speedFactor, 0));
        this._runningDistance += entity.body.center.x - this._prevBodyCenter.x;
        this._prevBodyCenter = entity.body.center.clone();
    }
}
