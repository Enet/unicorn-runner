import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Obstacle from 'traits/Obstacle.js';
import {
    TILE_SIZE
} from 'constants.js';
import spriteDescription from 'sprites/BoxSprite.js';

export default class Box extends Entity {
    _getSpriteDescription () {
        return spriteDescription;
    }

    _getFrame () {
        return 'box';
    }

    _getSize () {
        return new Vector2(TILE_SIZE, TILE_SIZE);
    }

    _createTraits () {
        return [
            new Obstacle()
        ];
    }
}

Box.images = {
    default: 'Box'
};
