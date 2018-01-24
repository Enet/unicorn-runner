import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import MedicineBehaviour from 'traits/MedicineBehaviour.js';
import Pickable from 'traits/Pickable.js';

export default class Medicine extends Entity {
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

Medicine.images = {
    default: 'Medicine'
};
