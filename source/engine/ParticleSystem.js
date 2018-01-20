import {
    Vector2
} from './math.js';
import Renderable from './Renderable.js';
import Particle from './Particle.js';

export default class ParticleSystem extends Renderable {
    get position () {
        return this.options.position;
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

        this._particles.forEach((particle) => {
            if (particle.isDead()) {
                this._particles.delete(particle);
                return;
            }
            particle.update(deltaTime);
        });
    }

    constructor (options={}) {
        super(...arguments);
        this._particles = new Set();
        this._amountAccumulator = 0;

        options.amount = +options.amount || 100;
        options.amountSpeed = +options.amountSpeed || 1;
        this.options = options;
    }

    _createParticle ({
        position,
        velocity=0.2, velocityError=50,
        direction=0, directionError=50,
        lifeTime=2000, lifeTimeError=50,
        size=5, sizeError=50, sizeSpeed=0.001,
        startColor, endColor, colorError=50, colorSpeed=0.001,
        alpha=1, alphaError=50, alphaSpeed=0.001,
        processParticleOptions
    }) {
        position = new Vector2(0, 0);
        velocity = this._getRandomValue(velocity, velocityError);
        direction = this._getRandomValue(direction, directionError, Math.PI);
        lifeTime = this._getRandomValue(lifeTime, lifeTimeError);
        size = this._getRandomValue(size, sizeError);
        alpha = this._getRandomValue(alpha, alphaError);

        sizeSpeed *= -1;
        alphaSpeed *= -1;
        colorSpeed *= -1;

        velocity = new Vector2(velocity * Math.cos(direction), velocity * Math.sin(direction));
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
