import ClipBox from 'ClipBox.js';
import {
    Vec2
} from 'math.js';

export const Sides = {
    TOP: Symbol('top'),
    BOTTOM: Symbol('bottom'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right')
};


export default class Entity {
    constructor () {
        this.position = new Vec2(0, 0);
        this.vel = new Vec2(0, 0);
        this.size = new Vec2(0, 0);
        this.offset = new Vec2(0, 0);
        this.bounds = new ClipBox(this.position, this.size, this.offset);
        this.lifetime = 0;

        this.traits = [];
    }

    addTrait (trait) {
        this.traits.push(trait);
        this[trait.NAME] = trait;
    }

    collides (candidate) {
        this.traits.forEach((trait) => {
            trait.collides(this, candidate);
        });
    }

    obstruct (side, match) {
        this.traits.forEach((trait) => {
            trait.obstruct(this, side, match);
        });
    }

    draw () {

    }

    finalize () {
        this.traits.forEach((trait) => {
            trait.finalize();
        });
    }

    update (deltaTime, level) {
        this.traits.forEach((trait) => {
            trait.update(this, deltaTime, level);
        });

        this.lifetime += deltaTime;
    }
}
