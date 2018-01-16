import Trait from 'traits/Trait.js';

export default class BugBehaviour extends Trait {
    getName () {
        return 'behavior';
    }

    onCollision (selfEntity, externalEntity) {
        if (selfEntity.killable.dead) {
            return;
        }
        externalEntity.killable.kill();
    }
}
