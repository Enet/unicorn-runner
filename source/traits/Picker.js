import Trait from 'traits/Trait.js';

export default class Picker extends Trait {
    getName () {
        return 'picker';
    }

    traitWillMount (onPick) {
        this._onPick = onPick;
    }

    traitCollision (body) {
        if (!body.entity.pickable || body.entity.pickable.isPicked()) {
            return;
        }
        body.entity.pickable.pick();
        this._onPick(body.entity);
    }
}
