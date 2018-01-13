import Trait from 'Trait.js';

export default class Picker extends Trait {
    getName () {
        return 'picker';
    }

    onPick () {

    }

    onCollision (selfEntity, externalEntity) {
        if (!externalEntity.pickable || externalEntity.pickable.picked) {
            return;
        }
        this.onPick(selfEntity, externalEntity);
    }
}
