import StaticEntity from 'entities/StaticEntity.js';
import {
    Vector2
} from 'engine/math.js';

import Laser from 'traits/Laser.js';
import spriteDescription from 'sprites/Empty.js';
import {
    RED_COLOR
} from 'constants.js';

export default class HorLaser extends StaticEntity {
    get index () {
        return 1;
    }

    get opacity () {
        return 0.75 * Math.abs(Math.sin(this._lifeTime / 100));
    }

    render (context) {
        const alpha = context.globalAlpha;
        const {offset} = this;
        context.fillStyle = RED_COLOR.toString();
        for (let i = 1; i < 5; i++) {
            context.globalAlpha = alpha * i * 0.25;
            context.beginPath();
            context.fillRect(offset.x, offset.y + 30 - (5 - i), 60, (5 - i) * 2);
        }
        context.globalAlpha = alpha;
    }

    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);
        this._lifeTime = this._lifeTime - deltaTime + deltaTime / 3;
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(60, 60);
    }

    _createSprite () {

    }

    _createTraits () {
        return [
            new Laser('y')
        ];
    }
}

HorLaser.images = {};
