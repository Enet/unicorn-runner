import {
    Vector2
} from 'engine/math.js';

import Entity from 'entities/Entity.js';
import TriggerBoundTrait from 'traits/TriggerBoundTrait.js';
import TriggerContactTrait from 'traits/TriggerContactTrait.js';
import OrganismTrait from 'traits/OrganismTrait.js';
import MotionRocketTrait from 'traits/MotionRocketTrait.js';
import BombDustTrait from 'traits/BombDustTrait.js';
import AppearanceGravityTrait from 'traits/AppearanceGravityTrait.js';
import AppearanceFadeOutTrait from 'traits/AppearanceFadeOutTrait.js';
import {
    SCORE_FRUIT_FLY_DEATH
} from 'constants.js';

const FRUIT_FLY_DAMAGE = 25;

export default class FruitFly extends Entity {
    _getImageName () {
        return 'FruitFly';
    }

    _getSize () {
        return new Vector2(40, 30);
    }

    _createTraits ({settings}) {
        const {trigger} = settings;
        return [
            new TriggerBoundTrait({
                maxActivationCount: Infinity,
                onActivate: this._onStart.bind(this, !!trigger.value),
                x: trigger.x
            }),
            new AppearanceGravityTrait(),
            new OrganismTrait({
                onDie: this._onDie.bind(this)
            }),
            new MotionRocketTrait(),
            new BombDustTrait({
                onExplode: this._onExplode.bind(this)
            }),
            new AppearanceFadeOutTrait({
                onEnd: this._onFadeOutEnd.bind(this)
            })
        ];
    }

    _onStart (expectedValue, {value}) {
        if (expectedValue !== value) {
            return;
        }
        this.traits.remove(this.trigger);

        const trigger = new TriggerContactTrait({
            maxActivationCount: Infinity,
            onActivate: this._onContact.bind(this)
        });
        this.traits.add(trigger);
    }

    _onContact (body) {
        const {player} = this.level;
        if (body !== player.body) {
            return;
        }
        if (player.fight && !player.fight.isStopped()) {
            return;
        }
        this.traits.remove(this.trigger);
        this.bomb.explode(player.body);
        this.organism.changeHealth(-100);
    }

    _onExplode () {
        this.level.player.organism.changeHealth(-FRUIT_FLY_DAMAGE);
    }

    _onDie () {
        this.level.changeScore(SCORE_FRUIT_FLY_DEATH);
        this.fadeOut.start();
    }

    _onFadeOutEnd () {
        this.level.removeEntity(this);
    }
}
