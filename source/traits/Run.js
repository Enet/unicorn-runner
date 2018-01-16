import Trait from 'traits/Trait.js';

export default class Run extends Trait {
    getName () {
        return 'run';
    }

    onInit () {
        this.speed = 0.01;
        this.distance = 0;
    }

    onMount (entity) {
        this._lastBodyCenter = entity.body.center;
    }

    onUpdate (entity, deltaTime) {
        entity.body.points.forEach((point) => {
            point.x += 0.01 * deltaTime;
        });
        this.distance += entity.body.center.x - this._lastBodyCenter.x;
        this._lastBodyCenter = entity.body.center;
    }
}
