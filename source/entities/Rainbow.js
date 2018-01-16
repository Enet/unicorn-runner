import Entity from 'entities/Entity.js';

import Solid from 'traits/Solid.js';
import Pickable from 'traits/Pickable.js';
import RainbowBehaviour from 'traits/RainbowBehaviour.js';

import {
    Size
} from 'engine/math.js';

const RAINBOW = {
    frames: [
        {
            name: 'spark-1',
            rect: [0, 0, 83, 93]
        },
        {
            name: 'spark-2',
            rect: [83, 0, 83, 93]
        },
        {
            name: 'spark-3',
            rect: [166, 0, 83, 93]
        },
        {
            name: 'spark-4',
            rect: [249, 0, 83, 93]
        },
        {
            name: 'spark-5',
            rect: [332, 0, 83, 93]
        },
        {
            name: 'spark-6',
            rect: [415, 0, 83, 93]
        }
    ],
    animations: [
        {
            name: 'spark',
            frameLen: 0.2,
            frames: [
                'spark-1',
                'spark-2',
                'spark-3',
                'spark-4',
                'spark-5',
                'spark-6'
            ]
        }
    ]
};

export default class Rainbow extends Entity {
    constructor (options) {
        options.description = RAINBOW;
        super(options);
        this.addTrait(new Solid());
        this.addTrait(new Pickable());
        this.addTrait(new RainbowBehaviour());
    }

    _getSize () {
        return new Size(83, 93);
    }

    _getAnimation () {
        return super._getAnimation('spark');
    }
}
