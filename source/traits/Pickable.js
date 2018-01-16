import Trait from 'traits/Trait.js';

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
        this.enqueueTask(this._onPick);
    }

    onUpdate (entity, deltaTime, level) {
        if (this.picked) {
            this.pickTime += deltaTime;
            if (this.pickTime > this.removeAfter) {
                this.enqueueTask(this._onRemove.bind(this, entity, level));
            }
        }
    }

    _onPick () {
        this.picked = true;
    }

    _onRemove (entity, level) {
        level._gameplay.scene.remove(entity);
    }
}
