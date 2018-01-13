import Trait from 'Trait.js';
import {
    SIDE_TOP,
    SIDE_BOTTOM
} from 'constants.js';

export default class Jump extends Trait {
    get falling () {
        return this.ready < 0;
    }

    getName () {
        return 'jump';
    }

    start () {
        this.requestTime = this.gracePeriod;
    }

    cancel () {
        this.engageTime = 0;
        this.requestTime = 0;
    }

    onInit () {
        this.ready = 0;
        this.duration = 0.8;
        this.engageTime = 0;
        this.requestTime = 0;
        this.gracePeriod = 0.1;
        this.speedBoost = 0.3;
        this.velocity = 200;
    }

    onObstacle (entity, side) {
        if (side === SIDE_BOTTOM) {
            this.ready = 1;
        } else if (side === SIDE_TOP) {
            this.cancel();
        }
    }

    onUpdate (entity, deltaTime) {
        if (this.requestTime > 0) {
            if (this.ready > 0) {
                this.engageTime = this.duration;
                this.requestTime = 0;
            }

            this.requestTime -= deltaTime;
        }

        if (this.engageTime > 0) {
            entity.velocity.y = -(this.velocity + Math.abs(entity.velocity.x) * this.speedBoost);
            this.engageTime -= deltaTime;
        }

        this.ready--;
    }
}
