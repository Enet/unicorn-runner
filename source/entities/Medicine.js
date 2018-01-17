import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import MedicineBehaviour from 'traits/MedicineBehaviour.js';
import Pickable from 'traits/Pickable.js';
import spriteDescription from 'sprites/Medicine.js';

export default class Medicine extends Entity {
    get opacity () {
        return 1 - this.pickable.getHidingProgress();
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(83, 93);
    }

    _createTraits () {
        return [
            new MedicineBehaviour(),
            new Pickable()
        ];
    }
}
