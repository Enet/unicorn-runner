import {
    Vector2
} from 'engine/math.js';

import ActionTrait from 'traits/ActionTrait.js';
import {
    FIGHT_DAMAGE,
    FIGHT_SHIFT,
    FIGHT_WAITING_TIME
} from 'constants.js';

export default class ActionFightTrait extends ActionTrait {
    getName () {
        return 'fight';
    }

    traitWillMount ({damage=FIGHT_DAMAGE}) {
        super.traitWillMount(...arguments);
        this._impulse = new Vector2(FIGHT_SHIFT, -FIGHT_SHIFT);
        this._damage = +damage;
        this._prevFightTime = -FIGHT_WAITING_TIME;
    }

    traitCollision (body) {
        if (this._isStopped) {
            return;
        }
        if (this._lifeTime - this._prevFightTime < FIGHT_WAITING_TIME) {
            return;
        }

        const {entity} = this;
        const entityBodyBottom = entity.body.center.y + entity.size.height * 0.5;
        if (body.center.y >= entityBodyBottom) {
            return;
        }

        const direction = body.center.x > entity.body.center.x ? 1 : -1;
        this._impulse.x = direction * Math.abs(this._impulse.x);
        body.move(this._impulse);
        this._prevFightTime = this._lifeTime;

        if (!body.entity.organism || body.entity.organism.isDead()) {
            return;
        }
        body.entity.organism.changeHealth(-this._damage);
    }
}
