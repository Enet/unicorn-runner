import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Run from 'traits/Run.js';
import Jump from 'traits/Jump.js';
import Killable from 'traits/Killable.js';
import spriteDescription from 'sprites/Unicorn.js';

export default class Unicorn extends Entity {
    get offset () {
        const offset = super.offset;
        offset.x -= (172 - 120) / 2;
        offset.y -= (119 - 109) / 2;
        return offset;
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(120, 109);
    }

    _getFrame () {
        if (this.killable && this.killable.isDead()) {
            return super._getFrame('death');
        } else if (this.jump && this.jump.isJumping()) {
            return 'jump';
        } else if (this.run && this.run.getDistance() > 0) {
            this._lifeTime = this.run.getDistance();
            return super._getFrame('run');
        } else {
            return 'idle';
        }
    }

    _getDeltaAngle (delta, angle) {
        const maxAngle = Math.PI / 3;
        delta = delta * (1 - Math.abs(angle) / maxAngle);
        delta -= 0.001 * Math.abs(angle) * Math.sign(angle);
        return delta;
    }

    _createBody (options) {
        const body = super._createBody(options);
        body.getDeltaAngle = this._getDeltaAngle.bind(this);
        return body;
    }

    _createTraits () {
        return [
            new Run(),
            new Jump(),
            new Killable()
        ];
    }
}
