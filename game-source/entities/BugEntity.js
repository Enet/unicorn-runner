import {
    Vector2
} from 'engine/math.js';

import Entity from 'entities/Entity.js';
import TriggerContactTrait from 'traits/TriggerContactTrait.js';
import OrganismTrait from 'traits/OrganismTrait.js';
import AppearanceFadeOutTrait from 'traits/AppearanceFadeOutTrait.js';
import GameplayScoreTrait from 'traits/GameplayScoreTrait.js';
import FootholdTrait from 'traits/FootholdTrait.js';
import {
    SCORE_BUG_DEATH
} from 'constants.js';

const DOUBLE_PI = 2 * Math.PI;
const BUG_MAX_ANGLE = Math.PI / 12;
const BUG_DAMAGE = 40;
const BUG_HEALTH = 60;

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
            new FootholdTrait(),
            new TriggerContactTrait({
                onActivate: this._onContact.bind(this)
            }),
            new OrganismTrait({
                health: BUG_HEALTH,
                onDie: this._onDie.bind(this)
            }),
            new AppearanceFadeOutTrait({
                onEnd: this._onFadeOutEnd.bind(this)
            }),
            new GameplayScoreTrait({
                deltaScore: SCORE_BUG_DEATH
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
        this.level.createSound('BugFight', {
            position: this.body.center,
            amplitude: 0.5
        }).play();
    }

    _onDie () {
        this.score.use();
        this.fadeOut.start();
        this.level.createSound('BugDie', {
            position: this.body.center,
            amplitude: 0.5
        }).play();
    }

    _onFadeOutEnd () {
        this.level.removeEntity(this);
    }
}
