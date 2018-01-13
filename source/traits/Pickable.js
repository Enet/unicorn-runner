import Trait from 'Trait.js';

export default class Pickable extends Trait {
    getName () {
        return 'pickable';
    }

    onInit () {
        this.picked = false;
        this.pickTime = 0;
        this.removeAfter = 0.3;
    }

    pick () {
        this.enqueueTask(() => this.picked = true);
    }

    onUpdate (entity, deltaTime, level) {
        if (this.picked) {
            this.pickTime += deltaTime;
            if (this.pickTime > this.removeAfter) {
                this.enqueueTask(() => {
                    level.scene.remove(entity);
                });
            }
        }
    }
}
