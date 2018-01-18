import Trait from 'traits/Trait.js';

export default class Picker extends Trait {
    getName () {
        return 'picker';
    }

    traitWillMount (callbacks={}) {
        const {onPick} = callbacks;
        this._onPick = onPick || this._onPick;
    }

    traitCollision (body) {
        if (!body.entity.pickable) {
            return;
        }
        if (body.entity.pickable.isPicked()) {
            return;
        }
        body.entity.pickable.pick();
        this._onPick(body.entity);
    }
}
