import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import DustBomb from 'traits/DustBomb.js';
import Obstacle from 'traits/Obstacle.js';
import spriteDescription from 'sprites/Trap.js';

export default class Trap extends Entity {
    get angle () {
        return this._angle || 0;
    }

    get offset () {
        const offset = super.offset;
        offset.x -= (70 - 50) / 2;
        offset.y -= (46 - 10) / 2 + 15 - (this._angle * 10 || 0);
        return offset;
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getFrame () {
        const progress = Math.floor(this.bomb.getExplosionProgress() * 4) + 1;
        return 'trap-' + progress;
    }

    _getSize () {
        return new Vector2(50, 10);
    }

    _createTraits () {
        return [
            new DustBomb({
                onBoom: this._onBoom.bind(this)
            }, true),
            new Obstacle()
        ];
    }

    _onBoom (body, preventCloud) {
        preventCloud();
        this._angle = Math.PI / 2;
        if (!body.entity.killable) {
            return;
        }
        body.entity.killable.changeHealth(-80);
    }
}

Trap.images = {
    default: 'Trap'
};
