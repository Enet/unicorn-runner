import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Killable from 'traits/Killable.js';
import Walker from 'traits/Walker.js';
import BirdBehaviour from 'traits/BirdBehaviour.js';
import spriteDescription from 'sprites/BirdSprite.js';

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

    entityCollision (body) {
        super.entityCollision(...arguments);
        if (body !== this.level.player.body) {
            return;
        }
        this.killable.changeHealth(-100);
    }

    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);
        if (this._afterDeathTime === null) {
            return;
        }
        this._afterDeathTime += deltaTime;
        this._lifeTime = this._afterDeathTime;
        const animation = spriteDescription.animations[1];
        if (this._afterDeathTime > animation.delay * animation.frames.length) {
            this.level.removeEntity(this);
        }
    }

    constructor () {
        super(...arguments);
        this._prevCenter = this.body.center;
        this._afterDeathTime = null;
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(70, 20);
    }

    _getFrame () {
        if (this._afterDeathTime === null) {
            return super._getFrame('default');
        } else {
            return super._getFrame('die');
        }
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

    _onKill () {
        this.level.changeScore(100);
        this._afterDeathTime = 0;
        this._lifeTime = 0;
        Object.defineProperty(this, 'opacity', {
            get: () => 1
        });
    }
}

Bird.images = {
    default: 'Bird'
};
