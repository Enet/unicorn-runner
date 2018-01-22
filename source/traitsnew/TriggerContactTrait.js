import TriggerTrait from 'traitsnew/TriggerTrait.js';

export default class TriggerContactTrait extends TriggerTrait {
    traitCollision (body) {
        const {entity} = this;
        if (entity.killable && entity.killable.isDead()) {
            return;
        }
        if (!body.entity.killable) {
            return;
        }
        this.activate();
    }
}
