import Renderable from 'engine/Renderable.js';
import BoxBody from 'engine/BoxBody.js';
import Sprite from 'engine/Sprite.js';
import {
    Vector2
} from 'engine/math.js';

import TraitManager from 'TraitManager.js';

export default class Entity extends Renderable {
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
        super();

        options.description = this._getSpriteDescription();
        this.size = this._getSize(options);
        this.sprite = this._createSprite(options);
        this.body = this._createBody(options);
        this.traits = new TraitManager(this);
        this._lifeTime = 0;

        const traits = this._createTraits(options);
        traits.forEach(trait => this.traits.add(trait));

        this.body.addListener('collision', this.entityCollision.bind(this));
    }

    render (context) {
        const {sprite, offset} = this;
        sprite.render(this._getFrame(), context, offset.x, offset.y);
    }

    entityWillUpdate (deltaTime, level) {
        this.traits.forEach((trait) => {
            trait.traitWillUpdate(deltaTime, level);
        });
        this._lifeTime += deltaTime;
    }

    entityDidUpdate () {
        this.traits.forEach((trait) => {
            trait.executeQueue();
            trait.traitDidUpdate();
        });
    }

    entityCollision (body, collision) {
        this.traits.forEach((trait) => {
            trait.traitCollision(body, collision);
        });
    }

    _getSize () {
        return new Vector2(0, 0);
    }

    _getSpriteDescription () {
        return {};
    }

    _getFrame (name='default') {
        const {sprite} = this;
        const animation = sprite.animations.get(name);
        return animation(this._lifeTime);
    }

    _createTraits () {
        return [];
    }

    _createSprite ({image, description}) {
        return new Sprite(image, description);
    }

    _createBody ({x=0, y=0, stiffness=1}) {
        const {width, height} = this.size;
        x -= width / 2;
        y -= height / 2;
        const body = new BoxBody({x, y, width, height, stiffness});
        body.entity = this;
        return body;
    }
}
