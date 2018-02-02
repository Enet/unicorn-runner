import Trait from 'traits/Trait.js';

export default class PickerTrait extends Trait {
    getName () {
        return 'picker';
    }

    traitCollision (body) {
        const {entity} = body;
        const {pickable} = entity;
        if (!pickable) {
            return;
        }
        if (pickable.isPicked()) {
            return;
        }
        pickable.pick(this.entity);
        const {options} = this;
        const {onPick} = options;
        onPick && onPick(entity);
    }
}
