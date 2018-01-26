import ParticleSystem from 'engine/ParticleSystem.js';
import {
    Vector2
} from 'engine/math.js';

import AppearanceTrait from 'traits/AppearanceTrait.js';

import {
    COLOR_RED,
    COLOR_ORANGE,
    COLOR_YELLOW,
    COLOR_GREEN,
    COLOR_SKY,
    COLOR_BLUE,
    COLOR_VIOLET
} from 'constants.js';

const RAINBOW_IDLE_POWER = 0.1;
const RAINBOW_ACTION_POWER = 0.3;
const RAINBOW_STEP = 0.02;

const rainbowColors = [
    COLOR_RED,
    COLOR_ORANGE,
    COLOR_YELLOW,
    COLOR_GREEN,
    COLOR_SKY,
    COLOR_BLUE,
    COLOR_VIOLET
];

export default class AppearanceRainbowTrait extends AppearanceTrait {
    start () {
        const {entity} = this;
        const particleSystem = new ParticleSystem({
            position: entity.body.center,
            offset: new Vector2(-entity.size.width * 0.5, 0),
            direction: Math.PI,
            directionError: 10,
            size: 2,
            amount: 1000,
            amountSpeed: 100,
            mode: 'lighter',
            processParticleOptions: (options) => {
                const randomColor = rainbowColors[~~(rainbowColors.length * Math.random())];
                options.startColor = randomColor;
                options.endColor = randomColor;
                return options;
            }
        });
        this._particleSystems.add(particleSystem);
        this.level.scene.add(particleSystem);
    }

    stop () {
        this._particleSystems.forEach((particleSystem) => {
            particleSystem.stop(this._onParticleSystemStop);
        });
    }

    setGravityDirection (x, y) {
        const velocityDirection = this._gravityDirection.x;
        if (velocityDirection) {
            this._prevVelocityDirection = velocityDirection;
        }
        this._gravityDirection.x = Math.sign(x);
        this._gravityDirection.y = Math.sign(y);
    }

    getGravityDirection () {
        return this._gravityDirection;
    }

    getName () {
        return 'rainbow';
    }

    traitWillMount () {
        super.traitWillMount(...arguments);
        this._onParticleSystemStop = this._onParticleSystemStop.bind(this)
        this._particleSystems = new Set();
        this._gravityDirection = new Vector2(0, 0);
        this._prevVelocityDirection = 1;
    }

    traitWillUpdate (deltaTime) {
        if (!this._particleSystems.size) {
            return;
        }
        this._particleSystems.forEach((particleSystem) => {
            this._updateParticleSystem(deltaTime, particleSystem);
        });
    }

    _updateParticleSystem (deltaTime, particleSystem) {
        const {options} = particleSystem;
        const {x, y} = this.getGravityDirection();
        const velocityDirection = x || this._prevVelocityDirection;
        if (velocityDirection > 0) {
            options.offset.x = -Math.abs(options.offset.x);
            options.direction = Math.PI;
        } else {
            options.offset.x = Math.abs(options.offset.x);
            options.direction = 0;
        }

        const vTarget = x ? RAINBOW_ACTION_POWER : RAINBOW_IDLE_POWER;
        const gTarget = y ? -RAINBOW_ACTION_POWER * y : RAINBOW_IDLE_POWER;
        const {velocity, gravity} = options;
        options.velocity = velocity + Math.sign(vTarget - velocity) * RAINBOW_STEP;
        options.gravity = 0.02 * (gravity + Math.sign(gTarget - gravity) * RAINBOW_STEP);

        particleSystem.update(deltaTime);
    }

    _onParticleSystemStop (particleSystem) {
        this.level.scene.remove(particleSystem);
        this._particleSystems.delete(particleSystem);
    }
}
