import Trait from 'traits/Trait.js';

import {
    MAX_HIDING_TIME
} from 'constants.js';

export default class Pickable extends Trait {
    getName () {
        return 'pickable';
    }

    traitWillMount (onPick) {
        this._isPicked = false;
        this._afterPickTime = 0;
        this._onPick = onPick;
    }

    traitWillUpdate (deltaTime, level) {
        if (!this._isPicked) {
            return;
        }
        this._afterPickTime += deltaTime;
        if (this._afterPickTime > MAX_HIDING_TIME) {
            level.removeEntity(this.entity);
        }
    }

    isPicked () {
        return this._isPicked;
    }

    pick () {
        this._isPicked = true;
        this._onPick();
    }

    getHidingProgress () {
        return Math.min(1, this._afterPickTime / MAX_HIDING_TIME);
    }
}
