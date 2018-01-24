import ParticleSystem from 'engine/ParticleSystem.js';
import {
    Vector2
} from 'engine/math.js';

import Entity from 'entities/Entity.js';
import OrganismTrait from 'traits/OrganismTrait.js';
import MotionWalkerTrait from 'traits/MotionWalkerTrait.js';
import FootholdTrait from 'traits/FootholdTrait.js';
import TriggerContactTrait from 'traits/TriggerContactTrait.js';
import AppearanceFadeOutTrait from 'traits/AppearanceFadeOutTrait.js';
import ActionFightTrait from 'traits/ActionFightTrait.js';
import {
    SCORE_LIZARD_DEATH,
    COLOR_ORANGE
} from 'constants.js';

const LIZARD_DAMAGE = 10;
const LIZARD_FIGHT_DISTANCE = 100;
const LIZARD_FIGHT_WAITING_TIME = 1000;

export default class LizardEntity extends Entity {
    get angle () {
        return (1 - this.opacity) * Math.PI;
    }

    get scale () {
        let direction;
        if (this.fight.isStopped()) {
            direction = this.motion.getVisualDirection();
        } else {
            const {player} = this.level;
            direction = 2 * (this.body.center.x > player.body.center.x) - 1;
        }
        return new Vector2(direction, 1);
    }

    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);
        const particleSystem = this._particleSystem;
        particleSystem && particleSystem.update(deltaTime);

        const {player} = this.level;
        const dx = player.body.center.x - this.body.center.x;
        const isReadyToFight = true &&
            Math.abs(dx) < LIZARD_FIGHT_DISTANCE &&
            player.body.center.y - player.size.height * 0.5 < this.body.center.y &&
            player.body.center.y + player.size.height * 0.5 > this.body.center.y;

        if (!isReadyToFight && !this.fight.isStopped()) {
            this.motion.start();
            this.fight.stop();
        } else if (isReadyToFight && this.fight.isStopped()) {
            this.motion.stop();
            this.fight.start();
        }
    }

    _getImageName () {
        return 'Lizard';
    }

    _getFrame () {
        if (this.fight.isStopped()) {
            return super._getFrame('walk');
        } else {
            return super._getFrame('fight');
        }
    }

    _createTraits ({settings, y}) {
        return [
            new FootholdTrait(),
            new MotionWalkerTrait({
                fromPoint: new Vector2(settings.range[0], y),
                toPoint: new Vector2(settings.range[1], y)
            }),
            new ActionFightTrait({
                damage: LIZARD_DAMAGE
            }),
            new OrganismTrait({
                onDie: this._onDie.bind(this)
            }),
            new AppearanceFadeOutTrait({
                onEnd: this._onFadeOutEnd.bind(this)
            }),
            new TriggerContactTrait({
                maxActivationTime: Infinity,
                onActivate: this._onContact.bind(this)
            })
        ];
    }

    _onParticleSystemStop (particleSystem) {
        this.level.scene.remove(particleSystem);
        this._particleSystem = null;
    }

    _onContact () {
        if (this.fight.isStopped()) {
            return;
        }

        if (this._lifeTime - this._prevFightTime < LIZARD_FIGHT_WAITING_TIME) {
            return;
        }

        if (this._particleSystem) {
            return;
        }

        const {player} = this.level;
        const dx = player.body.center.x - this.body.center.x;
        player.organism.changeHealth(-LIZARD_DAMAGE);
        player.body.move(new Vector2(Math.sign(dx) * 2, 0));

        const line = player.body.center.subtract(this.body.center);
        const particleSystem = new ParticleSystem({
            position: this.body.center,
            direction: Math.atan2(line.y, line.x),
            directionError: 5,
            amountSpeed: 100,
            velocity: 0.3,
            alphaSpeed: 0.005,
            size: 1,
            startColor: COLOR_ORANGE,
            mode: 'lighter'
        });
        particleSystem.update(0);
        particleSystem.stop(this._onParticleSystemStop.bind(this));
        this.level.scene.add(particleSystem);
        this._particleSystem = particleSystem;

        this._prevFightTime = Date.now();
    }

    _onDie () {
        this.level.changeScore(SCORE_LIZARD_DEATH);
        this.fadeOut.start();
    }

    _onFadeOutEnd () {
        this.level.removeEntity(this);
    }
}
