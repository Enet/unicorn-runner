export default class Particle {
    render (context, camera) {
        const {size, alpha} = this;
        const {x, y} = this.position;
        const {colorProgress, startColor, endColor} = this;

        context.save();
        context.fillStyle = endColor.mix(startColor, colorProgress).toString();
        context.globalAlpha = alpha;
        context.beginPath();
        context.arc(x, y, size, 0, 2 * Math.PI, false);
        context.fill();
        context.restore();
    }

    update (deltaTime) {
        this.lifeTime -= deltaTime;
        this.velocity.set(this.velocity.add(this.gravity.length(deltaTime)));
        this.position.set(this.position.add(this.velocity.length(deltaTime)));
        this.size = Math.max(0, this.size + this.sizeSpeed * deltaTime);
        this.alpha = Math.max(0, this.alpha + this.alphaSpeed * deltaTime);
        this.colorProgress = Math.max(0, this.colorProgress + this.colorSpeed * deltaTime);
    }

    constructor ({
        position, velocity, gravity, size, sizeSpeed,
        alpha, alphaSpeed, lifeTime,
        startColor, endColor, colorProgress, colorSpeed
    }) {
        Object.assign(this, {
            position, velocity, gravity, size, sizeSpeed,
            alpha, alphaSpeed, lifeTime,
            startColor, endColor, colorProgress, colorSpeed
        });
    }

    isDead () {
        return !this.alpha || this.lifeTime < 0;
    }
}
