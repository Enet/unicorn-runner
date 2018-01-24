import {
    Vector2
} from 'engine/math.js';

import Entity from 'entitiesnew/Entity.js';
import FootholdTrait from 'traitsnew/FootholdTrait.js';
import TriggerContactTrait from 'traitsnew/TriggerContactTrait.js';
import AppearanceGravityTrait from 'traitsnew/AppearanceGravityTrait.js';

export default class MushroomEntity extends Entity {
    get angle () {
        return this._angle;
    }

    entityWillMount () {
        super.entityWillMount(...arguments);
        const axis = this._getAxis();
        this._angle = (axis === 'x') * 0.5 * Math.PI;
        this._defaultOffset[axis] -= 10;
    }

    _getFrame () {
        let progress = 0.01 * (this._lifeTime - this._explodeTime) || 0;
        progress = Math.max(1, Math.min(5, progress));
        return 'mushroom-' + progress;
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
            new AppearanceGravityTrait({
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
