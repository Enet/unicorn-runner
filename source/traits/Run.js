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
        this._speedFactor = 1;
        this._runningDistance = 0;
    }

    traitDidMount () {
        this._prevBodyCenter = this.entity.body.center;
    }

    traitWillUpdate (deltaTime, level) {
        const {entity} = this;
        if ((entity.jump && entity.jump.isJumping()) ||
            (entity.fly && entity.fly.isFlying())) {
            deltaTime /= 2;
        }

        entity.body.move(new Vector2(RUNNING_SPEED * this._speedFactor * deltaTime, 0));
        this._runningDistance += entity.body.center.x - this._prevBodyCenter.x;
        this._prevBodyCenter = entity.body.center;
    }

    getDistance () {
        return this._runningDistance;
    }

    setSpeedFactor (factor) {
        this._speedFactor = factor;
    }
}
