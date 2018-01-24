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
        return this._defaultOffset.clone();
    }

    get angle () {
        return this.body.angle;
    }

    constructor (options) {
        super();

        this._lifeTime = 0;
        this._imageNode = null;
        this._spriteDescription = null;

        this.options = options;
        this.level = options.level;
        this.sprite = this._createSprite(options);
        this.size = this._getSize(options);
        this.body = this._createBody(options);
        this.traits = new TraitManager(this);

        const traits = this._createTraits(options);
        traits.forEach(trait => this.traits.add(trait));

        this._defaultSize = Entity.prototype._getSize.call(this, options);
        this._defaultOffset = this._defaultSize.length(-0.5);

        this.entityCollision = this.entityCollision.bind(this);
        this.entityWillMount(...arguments);
    }

    render (context, camera) {
        if (!this._shouldRender(camera)) {
            return;
        }
        const {offset, sprite} = this;
        sprite.render(this._getFrame(), context, offset.x, offset.y);
    }

    entityWillMount () {

    }

    entityDidMount () {
        this.body.addListener('collision', this.entityCollision);
    }

    entityWillUpdate (deltaTime) {
        this.traits.forEach((trait) => {
            trait.traitWillUpdate(deltaTime);
            trait.update(deltaTime);
        });
        this._lifeTime += deltaTime;
    }

    entityDidUpdate () {
        this.traits.forEach((trait) => {
            trait.traitDidUpdate();
        });
    }

    entityCollision (body, collision) {
        this.traits.forEach((trait) => {
            trait.traitCollision(body, collision);
        });
    }

    entityWillUnmount () {
        this.body.removeListener('collision', this.entityCollision);
    }

    entityDidUnmount () {
        this.traits.forEach(trait => this.traits.remove(trait));
    }

    _shouldRender (camera) {
        const {width, height} = this._defaultSize;
        const {position} = this;
        if (position.x + width < camera.position.x ||
            position.x > camera.position.x + camera.size.width ||
            position.y + height < camera.position.y ||
            position.y > camera.position.y + camera.size.height) {
            return false;
        }
        return true;
    }

    _getImageName () {
        return '';
    }

    _getSpriteName () {
        return this._getImageName();
    }

    _getSize () {
        if (this._spriteDescription) {
            const {frames} = this._spriteDescription;
            let frame;
            for (let f in frames) {
                frame = frames[f];
                break;
            }
            return new Vector2(...frame.slice(2));
        } else if (this._imageNode) {
            const {naturalWidth, naturalHeight} = this._imageNode;
            return new Vector2(naturalWidth, naturalHeight);
        } else {
            return new Vector2(0, 0);
        }
    }

    _getFrame (name='default') {
        const {sprite} = this;
        const animation = sprite.animations.get(name);
        return animation.frame(this._lifeTime);
    }

    _createTraits () {
        return [];
    }

    _createSprite ({level}) {
        const {manager} = level;
        const imageName = this._getImageName();
        if (!imageName) {
            return null;
        }

        const imageNode = manager.getImage(imageName);
        if (!imageNode) {
            throw 'Image does not exist!';
        }
        const spriteDescription = manager.getSprite(this._getSpriteName());

        this._imageNode = imageNode;
        this._spriteDescription = spriteDescription;
        return new Sprite(imageNode, spriteDescription);
    }

    _createBody ({x=0, y=0}, Body=BoxBody) {
        const {width, height} = this.size;
        x -= width / 2;
        y -= height / 2;
        const body = new Body({x, y, width, height});
        body.entity = this;
        return body;
    }
}
