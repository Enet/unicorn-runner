import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Bomb from 'traits/Bomb.js';
import Obstacle from 'traits/Obstacle.js';
import Explosion from 'entities/Explosion.js';
import spriteDescription from 'sprites/Mushroom.js';

export default class TopMushroom extends Entity {
    _getSpriteDescription () {
        return spriteDescription;
    }

    _getFrame () {
        const progress = Math.floor(this.behaviour.getExplosionProgress() * 4) + 1;
        return 'mushroom-' + progress;
    }

    _getSize () {
        return new Vector2(40, 30);
    }

    _createTraits () {
        return [
            new Bomb({
                onBoom: this._onBoom.bind(this)
            }),
            new Obstacle()
        ];
    }

    _onBoom () {
        const {level} = this;
        const images = {default: this.images.explosion};
        const {x, y} = this.body.center;
        const explosion = new Explosion({level, images, x, y});
        level.addEntity(explosion);
    }
}

TopMushroom.images = {
    default: 'Mushroom',
    explosion: Explosion.images.default
};
