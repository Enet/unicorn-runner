import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import DustBomb from 'traits/DustBomb.js';
import Obstacle from 'traits/Obstacle.js';

export default class TopDustMushroom extends Entity {
    get offset () {
        const offset = super.offset;
        offset.y -= 10;
        return offset;
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
            new DustBomb({
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

TopDustMushroom.images = {
    default: 'DustMushroom'
};
