import Entity from 'Entity.js';
import SpriteSheet from 'engine/SpriteSheet.js';
import {
    Size
} from 'engine/math.js';

import Physics from 'traits/Physics.js';
import Solid from 'traits/Solid.js';
import Run from 'traits/Run.js';
import Jump from 'traits/Jump.js';
import Picker from 'traits/Picker.js';
import Killable from 'traits/Killable.js';

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
    constructor (image) {
        super();

        const sprite = new SpriteSheet(image, UNICORN);
        this._sprite = sprite;
        this.area.set(172, 119);
        this.size.set(120, 119);
        this.offset.x = 20;

        this.addTrait(new Physics());
        this.addTrait(new Solid());
        this.addTrait(new Run());
        this.addTrait(new Jump());
        this.addTrait(new Picker());
        this.addTrait(new Killable());

        this.killable.removeAfter = 1;
    }

    routeFrame (unicorn) {
        const sprite = this._sprite;
        if (this.killable.dead) {
            const deathAnim = sprite.animations.get('death');
            return deathAnim(this.lifetime);
        }

        if (this.jump.falling) {
            return 'jump';
        }

        if (this.run.distance > 0) {
            const runAnim = sprite.animations.get('run');
            return runAnim(this.run.distance);
        }

        return 'idle';
    }

    render (context) {
        this._sprite.render(this.routeFrame(), context, 0, 0, this.run.heading < 0);
    }
}
