import {
    Vector2
} from 'engine/math.js';

import Entity from 'entities/Entity.js';
import FootholdTrait from 'traits/FootholdTrait.js';
import TriggerContactTrait from 'traits/TriggerContactTrait.js';
import BodyGravityTrait from 'traits/BodyGravityTrait.js';

export default class MushroomEntity extends Entity {
    get angle () {
        return super.angle + this._angle;
    }

    entityWillMount () {
        super.entityWillMount(...arguments);
        const axis = this._getAxis();
        this._angle = -0.5 * Math.PI * (axis === 'x');
        this._defaultOffset.y -= 5;
    }

    _getSpriteName () {
        return 'Mushroom';
    }

    _getProgress () {
        let progress = 0.01 * (this._lifeTime - this._explodeTime) || 0;
        progress = Math.floor(Math.max(1, Math.min(5, progress)));
        return progress;
    }

    _getFrame () {
        return 'mushroom-' + this._getProgress();
    }

    _getSize () {
        const size = new Vector2(40, 20);
        const axis = this._getAxis();
        return axis === 'x' ? size.reverse() : size;
    }

    _getAxis () {
        return '';
    }

    _getBombTrait () {

    }

    _createTraits () {
        const BombTrait = this._getBombTrait();
        return [
            new FootholdTrait(),
            new TriggerContactTrait({
                onActivate: this._onContact.bind(this)
            }),
            new BombTrait({
                willExplode: this._willExplode.bind(this),
                onExplode: this._onExplode.bind(this)
            }),
            new BodyGravityTrait({
                autoStart: this._getAxis() === 'x'
            })
        ];
    }

    _onContact (body) {
        this.bomb.explode(body);
    }

    _willExplode () {

    }

    _onExplode () {
        this._explodeTime = this._lifeTime;
    }
}
