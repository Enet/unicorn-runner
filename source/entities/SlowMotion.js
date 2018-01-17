import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import SpeedFactor from 'traits/SpeedFactor.js';
import Pickable from 'traits/Pickable.js';
import spriteDescription from 'sprites/SlowMotion.js';

export default class SlowMotion extends Entity {
    get opacity () {
        return 1 - this.pickable.getHidingProgress();
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(83, 93);
    }

    _getSpeedFactor () {
        return 0.5;
    }

    _createTraits () {
        return [
            new SpeedFactor(this._getSpeedFactor()),
            new Pickable()
        ];
    }
}
