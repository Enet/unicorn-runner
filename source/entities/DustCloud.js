import ParticleSystem from 'engine/ParticleSystem.js';
import StaticEntity from 'entities/StaticEntity.js';
import {
    Vector2
} from 'engine/math.js';
import {
    REACTION_TRAP
} from 'engine/constants.js';

import spriteDescription from 'sprites/DustCloud.js';
import {
    ORANGE_COLOR
} from 'constants.js';

const animation = spriteDescription.animations[0];

export default class DustCloud extends StaticEntity {
    get index () {
        return 600;
    }

    constructor () {
        super(...arguments);
        const particleSystem = new ParticleSystem({
            position: this.body.center,
            direction: this.angle - Math.PI / 2,
            directionError: 50,
            size: 2,
            sizeError: 100,
            amount: 100,
            amountSpeed: 100,
            alphaSpeed: 0.005,
            velocity: 1,
            startColor: ORANGE_COLOR,
            mode: 'lighter'
        });
        particleSystem.update(0);
        particleSystem.stop();
        this.level.scene.add(particleSystem);
        this._particleSystem = particleSystem;
    }

    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);
        this._particleSystem.update(deltaTime);
        this._lifeTime = this._lifeTime - deltaTime + deltaTime / 3;
        if (this._lifeTime > animation.delay * animation.frames.length) {
            this.level.removeEntity(this);
            this.level.scene.remove(this._particleSystem);
        }
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(180, 180);
    }

    _createBody () {
        const body = super._createBody(...arguments);
        body.reaction = REACTION_TRAP;
        return body;
    }
}

DustCloud.images = {
    default: 'DustCloud'
};
