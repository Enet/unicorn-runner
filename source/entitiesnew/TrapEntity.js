import {
    Vector2
} from 'engine/math.js';

import Entity from 'entitiesnew/Entity.js';
import BombDustTrait from 'traitsnew/BombDustTrait.js';
import FootholdTrait from 'traitsnew/FootholdTrait.js';
import TriggerContactTrait from 'traitsnew/TriggerContactTrait.js';

const TRAP_DAMAGE = 80;

export default class TrapEntity extends Entity {
    get angle () {
        return this._angle;
    }

    get offset () {
        const offset = super.offset;
        offset.y += 15 - 10 * this._angle;
        return offset;
    }

    _getImageName () {
        return 'Trap';
    }

    _getFrame () {
        let progress = 0.01 * (this._lifeTime - this._explodeTime) || 0;
        progress = Math.max(1, Math.min(5, progress));
        this._angle = 0.25 * (progress - 1);
        return 'trap-' + progress;
    }

    _getSize () {
        return new Vector2(50, 10);
    }

    _createTraits () {
        return [
            new FootholdTrait(),
            new TriggerContactTrait({
                onActivate: this._onContact.bind(this)
            }),
            new BombDustTrait({
                onExplode: this._onExplode.bind(this)
            })
        ];
    }

    _onContact (body) {
        this.bomb.explode(body);
    }

    _onExplode ({body, preventCloud}) {
        preventCloud();
        body.entity.organism.changeHealth(-TRAP_DAMAGE);
    }
}
