import StaticEntity from 'entities/StaticEntity.js';
import {
    Vector2
} from 'engine/math.js';

import spriteDescription from 'sprites/DustCloud.js';

const animation = spriteDescription.animations[0];

export default class DustCloud extends StaticEntity {
    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);
        this._lifeTime = this._lifeTime - deltaTime + deltaTime / 3;
        if (this._lifeTime > animation.delay * animation.frames.length) {
            this.level.removeEntity(this);
        }
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(180, 180);
    }
}

DustCloud.images = {
    default: 'DustCloud'
};
