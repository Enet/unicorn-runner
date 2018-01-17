import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import Killable from 'traits/Killable.js';
import BugBehaviour from 'traits/BugBehaviour.js';
import spriteDescription from 'sprites/bug.js';

export default class Bug extends Entity {
    get offset () {
        const offset = super.offset;
        offset.y -= 20;
        return offset;
    }

    constructor (options) {
        options.description = spriteDescription;
        super(options);
        this.addTrait(new BugBehaviour());
        this.addTrait(new Killable());
    }

    _getAnimation () {
        return super._getAnimation('stand');
    }

    _getSize () {
        return new Vector2(58, 45);
    }
}
