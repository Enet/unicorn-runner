import Trait from 'traits/Trait.js';

import {
    FLYING_TIME
} from 'constants.js';

export default class RainbowBehaviour extends Trait {
    getName () {
        return 'behaviour';
    }

    traitWillMount () {
        this._isActive = true;
    }

    traitCollision (body) {
        const {entity} = body;
        if (!entity.fly) {
            return;
        }
        if (!this._isActive) {
            return;
        }
        this._isActive = false;
        entity.fly.start(FLYING_TIME);
    }
}
