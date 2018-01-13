import ClipBox from 'ClipBox.js';
import {
    Vec2,
    Position,
    Size
} from 'engine/math.js';

export default class Entity {
    constructor () {
        this.position = new Position(0, 0);
        this.size = new Size(0, 0);
        this.area = new Size(0, 0);
        this.offset = new Position(0, 0);
        this.velocity = new Vec2(0, 0);
        this.bounds = new ClipBox(this.position, this.size, this.offset);
        this.lifetime = 0;

        this.traits = [];
    }

    addTrait (trait) {
        this.traits.push(trait);
        this[trait.getName()] = trait;
        trait.onMount(this);
    }

    collides (candidate) {
        this.traits.forEach((trait) => {
            trait.onCollision(this, candidate);
        });
    }

    obstruct (side, match) {
        this.traits.forEach((trait) => {
            trait.onObstacle(this, side, match);
        });
    }

    render (context, camera) {

    }

    finalize () {
        this.traits.forEach((trait) => {
            trait.executeQueue();
        });
    }

    onUpdate (deltaTime, level) {
        this.traits.forEach((trait) => {
            trait.onUpdate(this, deltaTime, level);
        });

        this.lifetime += deltaTime;
    }
}
