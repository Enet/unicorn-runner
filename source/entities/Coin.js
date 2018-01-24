import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Score from 'traits/Score.js';
import Pickable from 'traits/Pickable.js';

export default class Coin extends Entity {
    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);
        if (this._lifeTime > 500 && this.traits.size === 1) {
            this.traits.add(new Pickable());
        }
    }

    get angle () {
        return this._lifeTime * this._getNominal() / 10000;
    }

    _getFrame () {
        return 'coin';
    }

    _getSize () {
        return new Vector2(60, 60);
    }

    _getNominal () {
        return 0;
    }

    _createTraits () {
        return [
            new Score(this._getNominal())
        ];
    }
}

Coin.images = {};
