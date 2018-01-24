import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Killable from 'traits/Killable.js';
import Jumper from 'traits/Jumper.js';
import Obstacle from 'traits/Obstacle.js';

export default class Frog extends Entity {
    get scale () {
        return new Vector2(-this.walker.getDirection(), 1);
    }

    get offset () {
        const offset = super.offset;
        offset.x -= (133 - 60) / 2;
        offset.y -= (111 - 80) / 2;
        return offset;
    }

    _getSize () {
        return new Vector2(60, 80);
    }

    _getFrame () {
        if (this._isJumping) {
            return super._getFrame('default');
        } else if (this._isFighting) {
            return super._getFrame('attack');
        } else {
            return 'jump-1';
        }
    }

    _getDeltaAngle (delta, angle) {
        const maxAngle = Math.PI / 4;
        delta = delta * (1 - Math.abs(angle) / maxAngle);
        delta -= 0.001 * Math.abs(angle) * Math.sign(angle);
        delta *= delta < 0 ? 1.01 : 1;
        return delta;
    }

    _createTraits ({settings}) {
        return [
            new Killable({
                onKill: this._onKill.bind(this)
            }),
            new Jumper(settings.range),
            new Obstacle()
        ];
    }

    _createBody () {
        const body = super._createBody(...arguments);
        body.getDeltaAngle = this._getDeltaAngle.bind(this);
        return body;
    }

    _createSprite () {
        this._onJumpAnimationEnd = this._onJumpAnimationEnd.bind(this);
        this._onFightAnimationEnd = this._onFightAnimationEnd.bind(this);
        const sprite = super._createSprite(...arguments);
        sprite.animations.get('default').addListener('end', this._onJumpAnimationEnd);
        sprite.animations.get('attack').addListener('end', this._onFightAnimationEnd);
        return sprite;
    }

    attack () {
        this._isFighting = true;
        this._lifeTime = 0;
    }

    jump (direction) {
        this._isJumping = true;
        this._lifeTime = 0;
        this.body.move(new Vector2(5 * direction, -10));
    }

    _onJumpAnimationEnd () {
        this._isJumping = false;
    }

    _onFightAnimationEnd () {
        this._isFighting = false;
    }

    _onKill () {
        this.level.changeScore(100);
    }
}

Frog.images = {
    default: 'Frog'
};
