import ParticleSystem from 'engine/ParticleSystem.js';
import StaticEntity from 'entities/StaticEntity.js';
import {
    Vector2
} from 'engine/math.js';

import {
    COLOR_ORANGE,
    INDEX_CLOUD
} from 'constants.js';

const animation = null;

export default class DustCloud extends StaticEntity {
    get index () {
        return INDEX_CLOUD;
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
            startColor: COLOR_ORANGE,
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

    _getSize () {
        return new Vector2(180, 180);
    }
}

DustCloud.images = {
    default: 'DustCloud'
};
