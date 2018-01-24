import Entity from 'entities/Entity.js';
import TriangleBody from 'engine/TriangleBody.js';
import {
    Vector2
} from 'engine/math.js';
import {
    REACTION_TRAP,
    REACTION_NO
} from 'engine/constants.js';

import GasBomb from 'traits/GasBomb.js';
import Meteor from 'traits/Meteor.js';
import {
    MAX_HIDING_TIME
} from 'constants.js';

export default class Drop extends Entity {
    get opacity () {
        if (this._afterDeathTime === null) {
            return 1;
        } else {
            return this._afterDeathTime / MAX_HIDING_TIME;
        }
    }

    get scale () {
        if (this._afterDeathTime === null) {
            return new Vector2(1, 1);
        } else {
            return new Vector2(1, this._afterDeathTime / MAX_HIDING_TIME);
        }
    }

    get offset () {
        const offset = super.offset;
        if (this._afterDeathTime === null) {
            return offset;
        } else {
            offset.y += (1 - this._afterDeathTime / MAX_HIDING_TIME) * this.size.height;
            return offset;
        }
    }

    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);
        if (this._afterDeathTime === null) {
            return;
        }
        this._afterDeathTime -= 2 * deltaTime;
        if (this._afterDeathTime < 0) {
            this.level.removeEntity(this);
        }
    }

    constructor ({parent}) {
        super(...arguments);
        this._parent = parent;
        this._afterDeathTime = null;
    }

    _getFrame () {
        return 'drop';
    }

    _getSize () {
        return new Vector2(15, 31);
    }

    _createTraits () {
        return [
            new GasBomb({
                onBoom: this._onBoom.bind(this)
            }),
            new Meteor({
                onHit: this._onHit.bind(this)
            }, {
                trigger: -Infinity
            })
        ];
    }

    _createBody (options) {
        const body = super._createBody(options, TriangleBody);
        body.reaction = REACTION_TRAP;
        return body;
    }

    _onHit (body, preventHit) {
        if (!body.entity.obstacle &&
            !body.entity.killable &&
            body !== this.level.player) {
            return preventHit();
        }
        if (body === this._parent.body) {
            return preventHit();
        }
        this.bomb.boom(body);
        this.body.stop();
        this.body.setGravity(new Vector2(0, 0));
        this.body.reaction = REACTION_NO;
        this.body.move = () => {};
        this._afterDeathTime = MAX_HIDING_TIME;
    }

    _onBoom (body) {
        if (!body.entity.killable) {
            return;
        }
        body.entity.killable.changeHealth(-10);
    }
}

Drop.images = {
    default: 'Drop'
};
