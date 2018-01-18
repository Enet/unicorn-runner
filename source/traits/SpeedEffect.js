import Trait from 'traits/Trait.js';

import {
    SPEED_EFFECT_TIME
} from 'constants.js';

const factorMap = {
    fast: 2,
    slow: 0.5
};

export default class SpeedEffect extends Trait {
    getName () {
        return 'speed';
    }

    traitWillMount (effect, time=SPEED_EFFECT_TIME) {
        let factor = factorMap[effect];
        if (!factor) {
            effect = 'slow';
            factor = factorMap[effect];
        }
        this._effect = effect;
        this._remainingTime = time * factor;
        this._isActive = true;
    }

    traitCollision (body) {
        if (!this._isActive) {
            return;
        }
        if (!body.entity.picker) {
            return;
        }
        this._isActive = false;
        this.level.addEffect(this._effect);
    }

    traitWillUpdate (deltaTime) {
        if (this._isActive) {
            return;
        }
        if (this._remainingTime < 0) {
            return;
        }
        this._remainingTime -= deltaTime;
        if (this._remainingTime < 0) {
            this.level.removeEffect(this._effect);
        }
    }
}