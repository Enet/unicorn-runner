import Entity from 'Entity.js';
import SpriteSheet from 'engine/SpriteSheet.js';

import Physics from 'traits/Physics.js';
import Solid from 'traits/Solid.js';
import Pickable from 'traits/Pickable.js';
import RainbowBehaviour from 'traits/RainbowBehaviour.js';

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
    constructor (image) {
        super();

        const sprite = new SpriteSheet(image, RAINBOW);
        this._sprite = sprite;

        this.size.set(83, 93);
        this.area.set(83, 93);

        this.addTrait(new Physics());
        this.addTrait(new Solid());
        this.addTrait(new Pickable());
        this.addTrait(new RainbowBehaviour());
    }

    routeAnim () {
        const sprite = this._sprite;
        const sparkAnim = sprite.animations.get('spark');
        return sparkAnim(this.lifetime);
    }

    render (context) {
        this._sprite.render(this.routeAnim(), context, 0, 0, this.velocity.x < 0);
    }
}
