import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Bomb from 'traits/Bomb.js';
import Obstacle from 'traits/Obstacle.js';
import spriteDescription from 'sprites/Mushroom.js';

export default class TopMushroom extends Entity {
    get offset () {
        const offset = super.offset;
        offset.y -= 10;
        return offset;
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getFrame () {
        const progress = Math.floor(this.bomb.getExplosionProgress() * 4) + 1;
        return 'mushroom-' + progress;
    }

    _getSize () {
        return new Vector2(40, 20);
    }

    _createTraits () {
        return [
            new Bomb({
                onBoom: this._onBoom.bind(this)
            }, true),
            new Obstacle()
        ];
    }

    _onBoom (body) {
        if (!body.entity.killable) {
            return;
        }
        body.entity.killable.changeHealth(-80);
    }
}

TopMushroom.images = {
    default: 'Mushroom'
};
