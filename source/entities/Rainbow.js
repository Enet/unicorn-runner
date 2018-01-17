import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import RainbowBehaviour from 'traits/RainbowBehaviour.js';
import spriteDescription from 'sprites/Rainbow.js';

export default class Rainbow extends Entity {
    get opacity () {
        return 1 - this.pickable.getHidingProgress();
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(83, 93);
    }

    _createTraits () {
        return [
            new RainbowBehaviour()
        ];
    }
}
