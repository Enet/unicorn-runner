import {
    Vector2
} from 'engine/math.js';

import Entity from 'entities/Entity.js';
import TriggerContactTrait from 'traits/TriggerContactTrait.js';
import OrganismTrait from 'traits/OrganismTrait.js';
import AppearanceFadeOutTrait from 'traits/AppearanceFadeOutTrait.js';
import {
    SCORE_BUG_DEATH
} from 'constants.js';

const DOUBLE_PI = 2 * Math.PI;
const BUG_MAX_ANGLE = Math.PI / 12;
const BUG_DAMAGE = 40;

export default class BugEntity extends Entity {
    get offset () {
        const offset = super.offset;
        offset.y -= 10;
        return offset;
    }

    _getImageName () {
        return 'Bug';
    }

    _getSize () {
        return new Vector2(29, 45);
    }

    _createTraits () {
        return [
            new TriggerContactTrait({
                onActivate: this._onContact.bind(this)
            }),
            new OrganismTrait({
                onDie: this._onDie.bind(this)
            }),
            new AppearanceFadeOutTrait({
                onEnd: this._onFadeOutEnd.bind(this)
            })
        ];
    }

    _onContact (body) {
        if (Math.abs(this.body.angle % DOUBLE_PI) > BUG_MAX_ANGLE) {
            this.trigger.setActivationCount(1);
            return;
        }

        body.entity.organism.changeHealth(-BUG_DAMAGE);
        body.move(new Vector2(-5, -5));
    }

    _onDie () {
        this.level.changeScore(SCORE_BUG_DEATH);
        this.fadeOut.start();
    }

    _onFadeOutEnd () {
        this.level.removeEntity(this);
    }
}
