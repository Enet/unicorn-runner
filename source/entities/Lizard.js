import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Killable from 'traits/Killable.js';
import Walker from 'traits/Walker.js';
import Enemy from 'traits/Enemy.js';
import Obstacle from 'traits/Obstacle.js';
import spriteDescription from 'sprites/Lizard.js';

export default class Lizard extends Entity {
    get scale () {
        let velocityDirection = this.walker.getDirection();
        const prevCenter = this._prevCenter;
        this._prevCenter = this.body.center;
        if (velocityDirection) {
            const bodyDirection = 2 * (this.body.center.x > prevCenter.x) - 1;
            return new Vector2(bodyDirection, 1);
        } else {
            const {player} = this.level;
            const bodyDirection = 2 * (this.body.center.x > player.body.center.x) - 1;
            return new Vector2(bodyDirection, 1);
        }
    }

    constructor () {
        super(...arguments);
        this._prevCenter = this.body.center;
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(75, 60);
    }

    _getFrame () {
        const direction = this.walker.getDirection();
        if (direction) {
            return super._getFrame('walk');
        } else {
            return super._getFrame('attack');
        }
    }

    _createTraits ({settings}) {
        return [
            new Obstacle(),
            new Walker(settings.range),
            new Enemy({
                onAttack: this._onAttack.bind(this)
            }, {
                power: 20
            }),
            new Killable({
                onKill: this._onKill.bind(this)
            })
        ];
    }

    _onAttack (preventAttack) {
        const {player} = this.level;
        if (this.body.center.y >= player.body.center.y + player.size.height / 2) {
            preventAttack();
        }
    }

    _onKill () {
        this.level.changeScore(200);
    }
}

Lizard.images = {
    default: 'Lizard'
};
