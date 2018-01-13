import Entity from 'Entity.js';
import SpriteSheet from 'engine/SpriteSheet.js';
import {
    Size
} from 'engine/math.js';

import Physics from 'traits/Physics.js';
import Solid from 'traits/Solid.js';
import Killable from 'traits/Killable.js';
import EnemyBugBehaviour from 'traits/EnemyBugBehaviour.js';

const ENEMY_BUG = {
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

export default class EnemyBug extends Entity {
    constructor (image) {
        super();

        const sprite = new SpriteSheet(image, ENEMY_BUG);
        this._sprite = sprite;

        this.size.set(58, 45);
        this.area.set(58, 65);
        this.offset.y = 20;

        this.addTrait(new Physics());
        this.addTrait(new Solid());
        this.addTrait(new EnemyBugBehaviour());
        this.addTrait(new Killable());
    }

    routeAnim () {
        const sprite = this._sprite;
        const standAnim = sprite.animations.get('anim');
        return standAnim(this.lifetime);
    }

    render (context) {
        this._sprite.render(this.routeAnim(), context, 0, 0);
    }
}
