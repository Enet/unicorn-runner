import BoxBody from 'engine/BoxBody.js';
import Sprite from 'engine/Sprite.js';
import {
    Vector2
} from 'engine/math.js';

export default class Entity {
    get position () {
        return this.body.center.add(this.offset);
    }

    get offset () {
        return this.size.length(-0.5);
    }

    get angle () {
        return this.body.angle;
    }

    constructor (options) {
        options.position = options.position || new Vector2(0, 0);
        this.size = this._getSize(options);
        this.sprite = this._createSprite(options);
        this.body = this._createBody(options);
        this.traits = this._getTraits(options);
        this._lifeTime = 0;

        this.body.addListener('collision', this.onCollision.bind(this));
    }

    addTrait (trait) {
        this.traits.push(trait);
        this[trait.getName()] = trait;
        trait.entity = this;
        trait.traitDidMount();
    }

    render (context) {
        const {sprite, offset} = this;
        sprite.render(this._getAnimation(), context, offset.x, offset.y);
    }

    onUpdate (deltaTime, level) {
        this.traits.forEach((trait) => {
            trait.traitWillUpdate(deltaTime, level);
        });
        this._lifeTime += deltaTime;
    }

    onCollision (body) {
        this.traits.forEach((trait) => {
            trait.traitCollision(body);
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
            trait.traitDidUpdate();
        });
    }

    _getSize () {
        return new Vector2(0, 0);
    }

    _getTraits () {
        return [];
    }

    _getAnimation (name = 'default') {
        const {sprite} = this;
        const animation = sprite.animations.get(name);
        return animation(this._lifeTime);
    }

    _createSprite ({image, description}) {
        return new Sprite(image, description);
    }

    _createBody ({position, stiffness = 1}) {
        const {width, height} = this.size;
        const x = position.x - width / 2;
        const y = position.y - height / 2;
        const body = new BoxBody({x, y, width, height, stiffness});
        body.entity = this;
        return body;
    }
}
