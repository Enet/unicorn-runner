import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import SpeedEffect from 'traits/SpeedEffect.js';
import Pickable from 'traits/Pickable.js';
import spriteDescription from 'sprites/SlowMotion.js';
import {
    SPEED_EFFECT_TIME
} from 'constants.js';

export default class SlowMotion extends Entity {
    getHidingTime () {
        return SPEED_EFFECT_TIME * 2;
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(83, 93);
    }

    _getSpeedEffect () {
        return 'slow';
    }

    _createTraits () {
        return [
            new SpeedEffect(this._getSpeedEffect()),
            new Pickable()
        ];
    }
}

SlowMotion.images = {
    default: 'SlowMotion'
};
