import Trait from 'traits/Trait.js';

import {
    SPEED_FACTOR_TIME
} from 'constants.js';

export default class SpeedFactor extends Trait {
    getName () {
        return 'speed';
    }

    traitWillMount (factor=1, time=SPEED_FACTOR_TIME) {
        this._body = null;
        this._factor = factor;
        this._remainingTime = time;
        this._isActive = true;
    }

    traitCollision (body) {
        if (!this._isActive) {
            return;
        }
        const {fly, run, jump} = body.entity;
        if (!fly && !run && !jump) {
            return;
        }
        this._isActive = false;
        this._body = body;

        const factor = this._factor;
        fly && fly.setSpeedFactor(factor);
        run && run.setSpeedFactor(factor);
        jump && jump.setSpeedFactor(factor);
    }

    traitWillUpdate (deltaTime) {
        if (!this._body) {
            return;
        }
        this._remainingTime -= deltaTime;
        if (this._remainingTime <= 0) {
            const {fly, run, jump} = this._body.entity;
            fly && fly.setSpeedFactor(1);
            run && run.setSpeedFactor(1);
            jump && jump.setSpeedFactor(1);
        }
    }
}
