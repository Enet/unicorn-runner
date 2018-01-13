import Trait from 'Trait.js';

export default class Physics extends Trait {
    getName () {
        return 'physics';
    }

    onUpdate (entity, deltaTime, level) {
        entity.position.x += entity.velocity.x * deltaTime;
        level.tileCollider.checkX(entity);

        entity.position.y += entity.velocity.y * deltaTime;
        level.tileCollider.checkY(entity);

        entity.velocity.y += level.gravity * deltaTime;
    }
}
