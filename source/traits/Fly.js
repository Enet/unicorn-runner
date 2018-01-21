import {
    Vector2
} from 'engine/math.js';
import ParticleSystem from 'engine/ParticleSystem.js';
import Trait from 'traits/Trait.js';

import {
    FLYING_BOOST,
    COLOR_RED,
    COLOR_ORANGE,
    COLOR_YELLOW,
    COLOR_GREEN,
    COLOR_SKY,
    COLOR_BLUE,
    COLOR_VIOLET
} from 'constants.js';

const rainbowColors = [
    COLOR_RED,
    COLOR_ORANGE,
    COLOR_YELLOW,
    COLOR_GREEN,
    COLOR_SKY,
    COLOR_BLUE,
    COLOR_VIOLET
];

export default class Fly extends Trait {
    getName () {
        return 'fly';
    }

    traitWillMount () {
        this._onParticleSystemStop = this._onParticleSystemStop.bind(this)
        this._particleSystems = new Set();
        this._isFlying = false;
        this._remainingTime = 0;
        this._gravityDirection = {
            up: false,
            down: false,
            left: false,
            right: false
        };
    }

    traitWillUpdate (deltaTime) {
        if (this._particleSystems.size) {
            this._particleSystems.forEach((particleSystem) => {
                this._updateParticleSystem(deltaTime, particleSystem);
            });
        }

        if (!this._isFlying) {
            return;
        }

        this.level.changeScore(0.5);
        this._remainingTime -= deltaTime;
        if (this._remainingTime <= 0) {
            this.cancel();
        }
    }

    isFlying () {
        return this._isFlying;
    }

    up (state) {
        this._gravityDirection.up = !!state;
        this._updateGravity();
    }

    down (state) {
        this._gravityDirection.down = !!state;
        this._updateGravity();
    }

    right (state) {
        this._gravityDirection.right = !!state;
        this._updateGravity();
    }

    left (state) {
        this._gravityDirection.left = !!state;
        this._updateGravity();
    }

    start (flyTime) {
        this._isFlying = true;
        this._remainingTime += flyTime;
        this._addParticleSystem();
        this._updateGravity();
        this.level.addEffect('fly');
        this.entity.jump && this.entity.jump.cancel();
    }

    cancel () {
        this._isFlying = false;
        this._remainingTime = 0;
        this._removeParticleSystem();
        this.entity.body.setGravity(null);
        this.level.removeEffect('fly');
    }

    _addParticleSystem () {
        const {entity} = this;
        const particleSystem = new ParticleSystem({
            position: entity.body.center,
            offset: new Vector2(-entity.size.width / 2, 0),
            direction: Math.PI,
            directionError: 10,
            size: 2,
            amount: 1000,
            amountSpeed: 100,
            mode: 'lighter',
            processParticleOptions: (options) => {
                options.startColor = rainbowColors[~~(rainbowColors.length * Math.random())];
                options.endColor = options.startColor;
                return options;
            }
        });
        this.level.scene.add(particleSystem);
        this._particleSystems.add(particleSystem);
    }

    _removeParticleSystem () {
        this._particleSystems.forEach((particleSystem) => {
            particleSystem.stop(this._onParticleSystemStop);
        });
    }

    _updateParticleSystem (deltaTime, particleSystem) {
        const {options} = particleSystem;
        const {entity} = this;
        const direction = entity.run && entity.run.getDirection();
        if (direction > 0) {
            options.offset.x = -Math.abs(options.offset.x);
            options.direction = Math.PI;
        } else {
            options.offset.x = Math.abs(options.offset.x);
            options.direction = 0;
        }

        const {x, y} = this._getGravityDirection();
        let xTarget = x ? 0.3 : 0.1;
        let gTarget = y ? -0.3 * y : 0.1;
        options.velocity = options.velocity + Math.sign(xTarget - options.velocity) * 0.02;
        options.gravity = options.gravity + Math.sign(gTarget - options.gravity) * 0.02;

        particleSystem.update(deltaTime);
    }

    _updateGravity () {
        if (!this._isFlying) {
            return;
        }

        const {x, y} = this._getGravityDirection();
        this.entity.body.setGravity(new Vector2(
            FLYING_BOOST * x,
            FLYING_BOOST * y
        ));
    }

    _getGravityDirection () {
        const {up, down, left, right} = this._gravityDirection;
        const x = right * 1 - left * 1;
        const y = down * 1 - up * 1;
        return {x, y};
    }

    _onParticleSystemStop (particleSystem) {
        this.level.scene.remove(particleSystem);
        this._particleSystems.delete(particleSystem);
    }
}
