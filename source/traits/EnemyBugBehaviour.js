import Trait from 'Trait.js';

export default class EnemyBugBehaviour extends Trait {
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
