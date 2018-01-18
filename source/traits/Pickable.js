import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

import {
    MAX_HIDING_TIME
} from 'constants.js';

export default class Pickable extends Trait {
    getName () {
        return 'pickable';
    }

    traitWillMount (callbacks={}) {
        this._callbacks = callbacks;
        this._isPicked = false;
        this._afterPickTime = 0;
    }

    traitDidMount () {
        this._hidingTime = this.entity.getHidingTime ?
            this.entity.getHidingTime() :
            MAX_HIDING_TIME;
    }

    traitWillUpdate (deltaTime) {
        if (!this._isPicked) {
            return;
        }
        this._afterPickTime += deltaTime;
        if (this._afterPickTime > this._hidingTime) {
            this.level.removeEntity(this.entity);
        }
    }

    isPicked () {
        return this._isPicked;
    }

    pick () {
        this._isPicked = true;
        this._onPick();

        const {onPick} = this._callbacks;
        onPick && onPick();
    }

    getHidingProgress () {
        return Math.min(1, this._afterPickTime / MAX_HIDING_TIME);
    }

    _onPick () {
        Object.defineProperty(this.entity, 'opacity', {
            get: () => 1 - this.getHidingProgress()
        });

        const {entity} = this;
        entity.body.move(new Vector2(3, -3));
        entity.body.collidable = false;
    }
}
