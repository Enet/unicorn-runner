import {
    Vector2,
    Color
} from './math.js';
import Renderable from './Renderable.js';
import Particle from './Particle.js';

const WHITE_COLOR = new Color(255, 255, 255);
const defaults = {
    amount: 100,
    amountSpeed: 10,
    velocity: 0,
    velocityError: 50,
    gravity: 0,
    direction: 0,
    directionError: 50,
    lifeTime: 2000,
    lifeTimeError: 50,
    size: 5,
    sizeError: 50,
    sizeSpeed: 0.001,
    colorError: 50,
    colorSpeed: 0.001,
    alpha: 1,
    alphaError: 50,
    alphaSpeed: 0.001
};

export default class ParticleSystem extends Renderable {
    get position () {
        const {position, offset} = this.options;
        return position.add(offset);
    }

    get mode () {
        return this.options.mode;
    }

    render (context, camera) {
        this._particles.forEach((particle) => {
            particle.render(context, camera);
        });
    }

    update (deltaTime) {
        const {options} = this;
        let amountAccumulator = this._amountAccumulator + options.amountSpeed;
        while (amountAccumulator > 0 && this._particles.size < options.amount) {
            this._particles.add(this._createParticle(options));
            amountAccumulator--;
        }
        this._amountAccumulator = amountAccumulator;

        if (!this._particles.size) {
            this._stopCallbacks.forEach(stopCallback => stopCallback(this));
            return;
        }

        this._particles.forEach((particle) => {
            if (particle.isDead()) {
                this._particles.delete(particle);
                return;
            }
            particle.update(deltaTime);
        });
    }

    stop (stopCallback) {
        this.options.amount = 0;
        this._stopCallbacks.add(stopCallback);
    }

    constructor (options={}) {
        super(...arguments);
        this._particles = new Set();
        this._amountAccumulator = 0;
        this._stopCallbacks = new Set();

        this.options = this._initOptions(options);
        options.position = options.position || new Vector2(0, 0);
        options.offset = options.offset || new Vector2(0, 0);
        options.startColor = options.startColor || WHITE_COLOR;
        options.endColor = options.endColor || options.startColor;
    }

    _initOptions (options) {
        for (let d in defaults) {
            const option = +options[d];
            options[d] = isNaN(option) ? defaults[d] : option;
        }
        return options;
    }

    _createParticle ({
        velocity, velocityError, gravity,
        direction, directionError,
        lifeTime, lifeTimeError,
        size, sizeError, sizeSpeed,
        startColor, endColor, colorError, colorSpeed,
        alpha, alphaError, alphaSpeed,
        processParticleOptions
    }) {
        const position = new Vector2(0, 0);
        velocity = this._getRandomValue(velocity, velocityError);
        direction = this._getRandomValue(direction, directionError, Math.PI);
        lifeTime = this._getRandomValue(lifeTime, lifeTimeError);
        size = this._getRandomValue(size, sizeError);
        alpha = this._getRandomValue(alpha, alphaError);

        sizeSpeed *= -1;
        alphaSpeed *= -1;
        colorSpeed *= -1;

        velocity = new Vector2(velocity * Math.cos(direction), velocity * Math.sin(direction) + gravity);
        const colorProgress = 1 - Math.random() * colorError / 100;

        let particleOptions = {
            position, velocity, size, sizeSpeed,
            alpha, alphaSpeed, lifeTime,
            startColor, endColor, colorProgress, colorSpeed
        };
        if (processParticleOptions) {
            particleOptions = processParticleOptions(particleOptions);
        }
        return new Particle(particleOptions);
    }

    _getRandomValue (value, error, range=value) {
        return +value + range * (1 - 2 * Math.random()) * error / 100;
    }
}
