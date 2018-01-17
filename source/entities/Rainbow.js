import Entity from 'entities/Entity.js';
import {
    Vector2
} from 'engine/math.js';

import RainbowBehaviour from 'traits/RainbowBehaviour.js';
import spriteDescription from 'sprites/rainbow.js';

export default class Rainbow extends Entity {
    constructor (options) {
        options.description = spriteDescription;
        super(options);
        this.addTrait(new RainbowBehaviour());
    }

    _getSize () {
        return new Vector2(83, 93);
    }

    _getAnimation () {
        return super._getAnimation('spark');
    }
}
