import Trait from 'traits/Trait.js';

export default class BugBehaviour extends Trait {
    getName () {
        return 'behaviour';
    }

    traitCollision (body) {
        const {entity} = this;
        if (entity.killable && entity.killable.isDead()) {
            return;
        }
        if (!body.entity.killable) {
            return;
        }
        body.entity.killable.kill();
    }
}
