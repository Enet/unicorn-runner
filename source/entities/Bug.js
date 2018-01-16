import Entity from 'entities/Entity.js';

import Solid from 'traits/Solid.js';
import Killable from 'traits/Killable.js';
import BugBehaviour from 'traits/BugBehaviour.js';

import {
    Size
} from 'engine/math.js';

const BUG = {
    frames: [
        {
            name: 'frame-1',
            rect: [0, 0, 58, 65]
        },
        {
            name: 'frame-2',
            rect: [58, 0, 58, 65]
        },
        {
            name: 'frame-3',
            rect: [116, 0, 58, 65]
        },
        {
            name: 'frame-4',
            rect: [174, 0, 58, 65]
        },
        {
            name: 'frame-5',
            rect: [232, 0, 58, 65]
        }
    ],
    animations: [
        {
            name: 'anim',
            frameLen: 0.2,
            frames: [
                'frame-1',
                'frame-2',
                'frame-3',
                'frame-4',
                'frame-5'
            ]
        }
    ]
};

export default class Bug extends Entity {
    get offset () {
        const offset = super.offset.clone();
        offset.y -= 20;
        return offset;
    }

    get area () {
        return new Size(58, 65);
    }

    constructor (options) {
        options.description = BUG;
        super(options);
        this.addTrait(new Solid());
        this.addTrait(new BugBehaviour());
        this.addTrait(new Killable());
    }

    routeAnim () {
        const {sprite} = this;
        const standAnim = sprite.animations.get('anim');
        return standAnim(this.lifetime);
    }

    render (context) {
        const {sprite} = this;
        sprite.render(this.routeAnim(), context, 0, 0);
    }

    _getSize () {
        return new Size(58, 45);
    }
}
