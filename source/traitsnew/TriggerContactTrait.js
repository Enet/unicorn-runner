import TriggerTrait from 'traitsnew/TriggerTrait.js';

export default class TriggerContactTrait extends TriggerTrait {
    traitCollision (body) {
        const {entity} = this;
        if (!this.options.lifelessObjects) {
            if (entity.organism && entity.organism.isDead()) {
                return;
            }
            if (!body.entity.organism) {
                return;
            }
        }
        this.activate(body);
    }
}
