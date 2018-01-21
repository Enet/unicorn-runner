import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Killable from 'traits/Killable.js';
import Enemy from 'traits/Enemy.js';
import Walker from 'traits/Walker.js';
import BirdBehaviour from 'traits/BirdBehaviour.js';
import spriteDescription from 'sprites/Bird.js';

export default class Bird extends Entity {
    get scale () {
        let velocityDirection = this.walker.getDirection();
        const prevCenter = this._prevCenter;
        this._prevCenter = this.body.center.clone();
        if (velocityDirection) {
            const bodyDirection = 2 * (this.body.center.x > prevCenter.x) - 1;
            return new Vector2(-bodyDirection, 1);
        } else {
            const {player} = this.level;
            const bodyDirection = 2 * (this.body.center.x > player.body.center.x) - 1;
            return new Vector2(-bodyDirection, 1);
        }
    }

    get offset () {
        const offset = super.offset;
        offset.x -= (96 - 70) / 2;
        offset.y -= (87 - 20) / 2;
        return offset;
    }

    constructor () {
        super(...arguments);
        this._prevCenter = this.body.center;
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(70, 20);
    }

    _getFrame () {
        return super._getFrame('default');
    }

    _getDeltaAngle (delta, angle) {
        const maxAngle = Math.PI / 3;
        delta = delta * (1 - Math.abs(angle) / maxAngle);
        delta -= 0.001 * Math.abs(angle) * Math.sign(angle);
        delta *= delta < 0 ? 1.01 : 1;
        return delta;
    }

    _createTraits ({settings}) {
        return [
            new Enemy({
                onAttack: this._onAttack.bind(this)
            }, {
                count: 1,
                power: 25
            }),
            new Killable({
                onKill: this._onKill.bind(this)
            }),
            new Walker(settings.range, 0.1, 0),
            new BirdBehaviour()
        ];
    }

    _createBody () {
        const body = super._createBody(...arguments);
        body.setGravity(new Vector2(0, 0));
        body.getDeltaAngle = this._getDeltaAngle;
        return body;
    }

    _onAttack (preventAttack) {
        if (Math.abs(this.body.angle % (2 * Math.PI)) > Math.PI / 12) {
            preventAttack();
        }
    }

    _onKill () {
        this.level.changeScore(100);
    }
}

Bird.images = {
    default: 'Bird'
};
