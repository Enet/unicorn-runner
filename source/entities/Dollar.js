import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Score from 'traits/Score.js';
import Pickable from 'traits/Pickable.js';
import spriteDescription from 'sprites/Dollar.js';

export default class Rainbow extends Entity {
    get angle () {
        return this._lifeTime * this._getNominal() / 10000;
    }

    get opacity () {
        return 1 - this.pickable.getHidingProgress();
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getFrame () {
        return 'dollar';
    }

    _getSize () {
        return new Vector2(100, 59);
    }

    _getNominal () {
        return 0;
    }

    _createTraits () {
        return [
            new Score(this._getNominal()),
            new Pickable()
        ];
    }
}
