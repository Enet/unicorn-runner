import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import SpeedEffect from 'traits/SpeedEffect.js';
import Pickable from 'traits/Pickable.js';
import spriteDescription from 'sprites/SlowMotion.js';

export default class SlowMotion extends Entity {
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
