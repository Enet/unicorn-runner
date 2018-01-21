import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Score from 'traits/Score.js';
import Pickable from 'traits/Pickable.js';
import spriteDescription from 'sprites/Dollar.js';

export default class Dollar extends Entity {
    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);
        if (this._lifeTime > 500) {
            this.traits.add(new Pickable());
        }
    }

    get angle () {
        return this._lifeTime * this._getNominal() / 10000;
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getFrame () {
        return 'dollar';
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

Dollar.images = {};
