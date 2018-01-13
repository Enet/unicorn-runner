import Trait from 'Trait.js';

export default class Run extends Trait {
    getName () {
        return 'run';
    }

    onInit () {
        this.speed = 13000;
        this.distance = 0;
    }

    onUpdate (entity, deltaTime) {
        entity.velocity.x = this.speed * deltaTime;
        this.distance += Math.abs(entity.velocity.x) * deltaTime;
    }
}
