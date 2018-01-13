import Trait from 'Trait.js';

export default class RainbowBehaviour extends Trait {
    getName () {
        return 'behavior';
    }

    onCollision (selfEntity, externalEntity) {
        if (selfEntity.pickable.picked) {
            return;
        }

        selfEntity.pickable.pick();
        selfEntity.velocity.set(30, -400);
        selfEntity.solid.obstructs = false;
    }
}
