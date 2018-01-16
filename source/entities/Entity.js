import BoxBody from 'engine/BoxBody.js';
import SpriteSheet from 'engine/SpriteSheet.js';
import {
    Vec2,
    Size
} from 'engine/math.js';

export default class Entity {
    get offset () {
        return this.body.center.subtract(this.size.length(0.5));
    }

    get area () {
        return this.size;
    }

    constructor (options) {
        options.position = options.position || new Vec2(0, 0);
        this.size = this._getSize(options);
        this.sprite = this._createSprite(options);
        this.body = this._createBody(options);
        this.traits = this._getTraits(options);
        this.lifetime = 0;
    }

    addTrait (trait) {
        this.traits.push(trait);
        this[trait.getName()] = trait;
        trait.onMount(this);
    }

    render (context, camera) {

    }

    onUpdate (deltaTime, level) {
        this.traits.forEach((trait) => {
            trait.onUpdate(this, deltaTime, level);
        });
        this.lifetime += deltaTime;
    }

    onCollision (candidate) {
        this.traits.forEach((trait) => {
            trait.onCollision(this, candidate);
        });
    }

    onObstacle (side, match) {
        this.traits.forEach((trait) => {
            trait.onObstacle(this, side, match);
        });
    }

    afterUpdate () {
        this.traits.forEach((trait) => {
            trait.executeQueue();
        });
    }

    _getSize () {
        return new Size(0, 0);
    }

    _getTraits () {
        return [];
    }

    _createSprite ({image, description}) {
        return new SpriteSheet(image, description);
    }

    _createBody ({position, stiffness = 1}) {
        const {width, height} = this.size;
        const x = position.x - width / 2;
        const y = position.y - height / 2;
        return new BoxBody({x, y, width, height, stiffness});
    }
}
