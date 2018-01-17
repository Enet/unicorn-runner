import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Run from 'traits/Run.js';
import Jump from 'traits/Jump.js';
import Killable from 'traits/Killable.js';
import spriteDescription from 'sprites/unicorn.js';

export default class Unicorn extends Entity {
    get offset () {
        const offset = super.offset;
        offset.x -= 20;
        return offset;
    }

    constructor (options) {
        options.description = spriteDescription;
        super(options);
        this.addTrait(new Run());
        this.addTrait(new Jump());
        this.addTrait(new Killable());

        this.killable.removeAfter = 1;
    }

    _getSize () {
        return new Vector2(120, 119);
    }

    _getAnimation () {
        const {sprite} = this;

        if (this.killable.dead) {
            return super._getAnimation('death');
        } else if (this.jump.isJumping()) {
            return 'jump';
        } else if (this.run.distance > 0) {
            const animation = sprite.animations.get('run');
            return animation(this.run.distance);
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
        options.stiffness = 1;
        const body = super._createBody(options);
        body.getDeltaAngle = this._getDeltaAngle.bind(this);
        return body;
    }
}
