import {
    Vector2
} from 'engine/math.js';

import Entity from 'entities/Entity.js';
import TriggerBoundTrait from 'traits/TriggerBoundTrait.js';
import TriggerContactTrait from 'traits/TriggerContactTrait.js';
import OrganismTrait from 'traits/OrganismTrait.js';
import MotionRocketTrait from 'traits/MotionRocketTrait.js';
import BombDustTrait from 'traits/BombDustTrait.js';
import GameplayScoreTrait from 'traits/GameplayScoreTrait.js';
import BodyGravityTrait from 'traits/BodyGravityTrait.js';
import AppearanceFadeOutTrait from 'traits/AppearanceFadeOutTrait.js';
import {
    SCORE_FRUIT_FLY_DEATH
} from 'constants.js';

const FRUIT_FLY_DAMAGE = 25;
const FRUIT_FLY_MAX_ANGLE = 0.2 * Math.PI;

export default class FruitFly extends Entity {
    get angle () {
        const {player} = this.level;
        let angle = 0.005 * (this.body.center.y - player.body.center.y);
        angle = Math.max(-FRUIT_FLY_MAX_ANGLE, Math.min(FRUIT_FLY_MAX_ANGLE, angle));
        angle *= this._getDirection();
        return super.angle + angle;
    }

    get scale () {
        return new Vector2(this._getDirection(), 1);
    }

    entityDidMount () {
        super.entityDidMount(...arguments);
        this._idleSound = this.level.createSound('FruitFlyIdle', {
            position: this.body.center,
            loop: true
        });
    }

    entityWillUnmount () {
        super.entityWillUnmount(...arguments);
        this.level.removeSound(this._idleSound);
    }

    _getDirection () {
        const {player} = this.level;
        return 2 * (this.body.center.x > player.body.center.x) - 1;
    }

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
                x: +trigger.x,
                y: +trigger.y
            }),
            new BodyGravityTrait(),
            new OrganismTrait({
                onDie: this._onDie.bind(this)
            }),
            new MotionRocketTrait(),
            new BombDustTrait({
                onExplode: this._onExplode.bind(this)
            }),
            new AppearanceFadeOutTrait({
                onEnd: this._onFadeOutEnd.bind(this)
            }),
            new GameplayScoreTrait({
                deltaScore: SCORE_FRUIT_FLY_DEATH
            })
        ];
    }

    _onStart (expectedValue, {value}) {
        if (expectedValue !== value) {
            return;
        }
        this.traits.remove(this.trigger);
        this.motion.start();
        this.level.createSound('FruitFlyActivate').play();
        this._idleSound.play();

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
        this.traits.remove(this.score);
        this.bomb.explode(player.body);
        this.organism.changeHealth(-100);
    }

    _onExplode () {
        this.level.player.organism.changeHealth(-FRUIT_FLY_DAMAGE);
    }

    _onDie () {
        this.score && this.score.use();
        this.fadeOut.start();
        this.level.createSound('FruitFlyDie', {
            position: this.body.center
        }).play();
    }

    _onFadeOutEnd () {
        this.level.removeEntity(this);
    }
}
