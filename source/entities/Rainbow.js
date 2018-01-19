import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import RainbowBehaviour from 'traits/RainbowBehaviour.js';
import Pickable from 'traits/Pickable.js';
import spriteDescription from 'sprites/Rainbow.js';

export default class Rainbow extends Entity {
    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(83, 93);
    }

    _createTraits () {
        return [
            new RainbowBehaviour(),
            new Pickable()
        ];
    }
}

Rainbow.images = {
    default: 'Rainbow'
};
