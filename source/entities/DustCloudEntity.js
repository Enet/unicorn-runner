import ParticleSystem from 'engine/ParticleSystem.js';

import StaticEntity from 'entities/StaticEntity.js';
import {
    COLOR_ORANGE,
    INDEX_CLOUD
} from 'constants.js';

export default class DustCloudEntity extends StaticEntity {
    get index () {
        return INDEX_CLOUD;
    }

    entityDidMount () {
        super.entityDidMount();
        const particleSystem = new ParticleSystem({
            center: this.body.center,
            direction: this.angle - Math.PI * 0.5,
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
        particleSystem.stop(this._onParticleSystemStop.bind(this));
        this.level.scene.add(particleSystem);
        this._particleSystem = particleSystem;

        this.sprite.animations
            .get('default')
            .once('end', this._onAnimationEnd.bind(this));

        this.level.createSound('DustCloud', {
            position: this.body.center
        }).play();
    }

    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);
        this._particleSystem.update(deltaTime);
    }

    _getImageName () {
        return 'DustCloud';
    }

    _onParticleSystemStop (particleSystem) {
        this.level.scene.remove(particleSystem);
    }

    _onAnimationEnd () {
        this._onParticleSystemStop(this._particleSystem);
        this.level.removeEntity(this);
    }
}
