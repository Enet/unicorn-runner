import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Killable from 'traits/Killable.js';
import BugBehaviour from 'traits/BugBehaviour.js';
import spriteDescription from 'sprites/Bug.js';

export default class Bug extends Entity {
    get offset () {
        const offset = super.offset;
        offset.x -= (58 - 29) / 2;
        offset.y -= 20;
        return offset;
    }

    _getSpriteDescription () {
        return spriteDescription;
    }

    _getSize () {
        return new Vector2(29, 45);
    }

    _createTraits () {
        return [
            new BugBehaviour(),
            new Killable()
        ];
    }
}
