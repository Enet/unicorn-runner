import Entity from 'entities/Entity.js';

import Solid from 'traits/Solid.js';
import Run from 'traits/Run.js';
import Jump from 'traits/Jump.js';
import Picker from 'traits/Picker.js';
import Killable from 'traits/Killable.js';

import {
    Size,
    Vec2
} from 'engine/math.js';

const UNICORN = {
    frames: [
        {
            name: 'idle',
            rect: [0, 0, 172, 119]
        },
        {
            name: 'run-1',
            rect: [0, 0, 172, 119]
        },
        {
            name: 'run-2',
            rect: [173, 0, 172, 119]
        },
        {
            name: 'run-3',
            rect: [344, 0, 172, 119]
        },
        {
            name: 'run-4',
            rect: [517, 0, 172, 119]
        },
        {
            name: 'break',
            rect: [0, 0, 172, 119]
        },
        {
            name: 'jump',
            rect: [690, 0, 172, 119]
        },
        {
            name: 'death-1',
            rect: [0, 120, 172, 119]
        },
        {
            name: 'death-2',
            rect: [173, 120, 172, 119]
        },
        {
            name: 'death-3',
            rect: [344, 120, 172, 119]
        },
        {
            name: 'death-4',
            rect: [517, 120, 172, 119]
        },
        {
            name: 'death-5',
            rect: [690, 120, 172, 119]
        },
        {
            name: 'death-6',
            rect: [863, 120, 172, 119]
        },
        {
            name: 'death-7',
            rect: [1036, 120, 172, 119]
        },
        {
            name: 'death-8',
            rect: [1209, 120, 172, 119]
        },
        {
            name: 'death-9',
            rect: [1382, 120, 172, 119]
        }
    ],

    animations: [
        {
            name: 'run',
            frameLen: 20,
            frames: [
                'run-1',
                'run-2',
                'run-3',
                'run-4'
            ]
        },
        {
            name: 'death',
            frameLen: 0.2,
            frames: [
                'death-5',
                'death-6',
                'death-7',
                'death-8',
                'death-9'
            ]
        }
    ]
};

export default class Unicorn extends Entity {
    get offset () {
        const offset = super.offset;
        offset.x -= 20;
        return offset;
    }

    constructor (options) {
        options.description = UNICORN;
        super(options);
        this.addTrait(new Solid());
        this.addTrait(new Run());
        this.addTrait(new Jump());
        this.addTrait(new Picker());
        this.addTrait(new Killable());

        this.killable.removeAfter = 1;
    }

    _getSize () {
        return new Size(120, 119);
    }

    _getAnimation () {
        const {sprite} = this;

        if (this.killable.dead) {
            return super._getAnimation('death');
        } else if (this.jump.falling) {
            return 'jump';
        } else if (this.run.distance > 0) {
            const animation = sprite.animations.get('run');
            return animation(this.run.distance);
        } else {
            return 'idle';
        }
    }

    _getDeltaAngle (delta, angle) {
        const maxAngle = Math.PI / 3;
        delta = delta * (1 - Math.abs(angle) / maxAngle);
        delta -= 0.001 * Math.abs(angle) * Math.sign(angle);
        return delta;
    }

    _createBody (options) {
        options.stiffness = 1;
        const body = super._createBody(options);
        body.getDeltaAngle = this._getDeltaAngle.bind(this);
        return body;
    }
}
