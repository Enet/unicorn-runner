import StaticEntity from 'entities/StaticEntity.js';
import {
    Vector2
} from 'engine/math.js';

import spriteDescription from 'sprites/BushSprite.js';

export default class Bush extends StaticEntity {
    _getSpriteDescription () {
        return spriteDescription;
    }

    _getFrame () {
        return 'bush';
    }

    _getSize () {
        return new Vector2(240, 80);
    }
}

Bush.images = {
    default: 'Bush'
};
