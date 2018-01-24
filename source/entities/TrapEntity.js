import {
    Vector2
} from 'engine/math.js';

import Entity from 'entities/Entity.js';
import BombDustTrait from 'traits/BombDustTrait.js';
import FootholdTrait from 'traits/FootholdTrait.js';
import TriggerContactTrait from 'traits/TriggerContactTrait.js';

const TRAP_DAMAGE = 80;

export default class TrapEntity extends Entity {
    get offset () {
        const offset = super.offset;
        offset.y -= 5;
        return offset;
    }

    _getImageName () {
        return 'Trap';
    }

    _getFrame () {
        let progress = 0.05 * (this._lifeTime - this._trapTime) || 0;
        progress = Math.floor(Math.max(1, Math.min(5, progress)));
        return 'trap-' + progress;
    }

    _getSize () {
        return new Vector2(20, 30);
    }

    _createTraits () {
        return [
            new FootholdTrait(),
            new TriggerContactTrait({
                onActivate: this._onContact.bind(this)
            }),
            new BombDustTrait({
                willExplode: this._willExplode.bind(this),
                onExplode: this._onExplode.bind(this)
            })
        ];
    }

    _onContact (body) {
        this.bomb.explode(body);
    }

    _willExplode ({preventCloud}) {
        preventCloud();
    }

    _onExplode ({body}) {
        this._trapTime = this._lifeTime;
        body.entity.organism.changeHealth(-TRAP_DAMAGE);
    }
}
