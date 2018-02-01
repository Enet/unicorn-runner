import {
    Vector2
} from 'engine/math.js';

import Entity from 'entities/Entity.js';
import OrganismTrait from 'traits/OrganismTrait.js';
import ActionFightTrait from 'traits/ActionFightTrait.js';
import ActionJumpTrait from 'traits/ActionJumpTrait.js';
import MotionJumpTrait from 'traits/MotionJumpTrait.js';
import FootholdTrait from 'traits/FootholdTrait.js';
import GameplayScoreTrait from 'traits/GameplayScoreTrait.js';
import BodyAngleLimitTrait from 'traits/BodyAngleLimitTrait.js';
import AppearanceFadeOutTrait from 'traits/AppearanceFadeOutTrait.js';
import BodyFrictionTrait from 'traits/BodyFrictionTrait.js';
import AppearanceVisualDirectionTrait from 'traits/AppearanceVisualDirectionTrait.js';
import {
    SCORE_FROG_DEATH
} from 'constants.js';

const FROG_FIGHT_WAITING_TIME = 2000;
const FROG_FIGHT_DISTANCE = 200;
const FROG_DAMAGE_DISTANCE = 75;
const FROG_DAMAGE = 25;
const FROG_FIGHT_PROBABILITY = 0.01;

export default class FrogEntity extends Entity {
    get offset () {
        const offset = super.offset;
        offset.y -= 10;
        if (!this.fight.isStopped()) {
            offset.x -= 20 + this._fightOffset;
        }
        return offset;
    }

    get scale () {
        const direction = this.fight.isStopped() ?
            this.visualDirection.getDirection() :
            this._fightDirection;
        return new Vector2(-direction, 1);
    }

    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);

        if (this.jump.isJumping()) {
            this.friction.stop();
            return;
        }

        this.friction.start();
        if (this._lifeTime - this._prevFightTime < FROG_FIGHT_WAITING_TIME) {
            return;
        }

        const {player} = this.level;
        const dx = player.body.center.x - this.body.center.x;
        const isReadyToFight = true &&
            !this.organism.isDead() &&
            Math.abs(dx) < FROG_FIGHT_DISTANCE &&
            player.body.center.y - player.size.height * 0.5 < this.body.center.y &&
            player.body.center.y + player.size.height * 0.5 > this.body.center.y;
        if (!isReadyToFight) {
            return;
        }

        if (Math.random() > FROG_FIGHT_PROBABILITY) {
            return;
        }

        this.motion.stop();
        this.fight.start();
        this._fightDirection = 2 * (dx > 0) - 1;
        this._lifeTime = 0;
        this._prevFightTime = 0;
    }

    _getImageName () {
        return 'Frog';
    }

    _getSize () {
        return new Vector2(50, 70);
    }

    _getFrame () {
        let animationName;
        if (this._isJumpAnimation) {
            animationName = 'jump';
        } else if (!this.fight.isStopped()) {
            animationName = 'fight';
        } else {
            animationName = 'default';
        }
        return super._getFrame(animationName);
    }

    _createTraits ({settings, y}) {
        return [
            new FootholdTrait(),
            new BodyAngleLimitTrait({
                maxAngle: Math.PI * 0.25
            }),
            new OrganismTrait({
                onDie: this._onDie.bind(this)
            }),
            new ActionFightTrait({
                damage: 0
            }),
            new ActionJumpTrait({
                jumpImpulsePower: 4,
                onStart: this._onJumpStart.bind(this)
            }),
            new MotionJumpTrait({
                fromPoint: new Vector2(settings.range[0], y),
                toPoint: new Vector2(settings.range[1], y)
            }),
            new AppearanceFadeOutTrait({
                onEnd: this._onFadeOutEnd.bind(this)
            }),
            new GameplayScoreTrait({
                deltaScore: SCORE_FROG_DEATH
            }),
            new BodyFrictionTrait({
                x: 0.9,
                y: 0.98
            }),
            new AppearanceVisualDirectionTrait({
                autoStart: false
            })
        ];
    }

    _createSprite () {
        const sprite = super._createSprite(...arguments);
        const fightAnimation = sprite.animations.get('fight');
        const jumpAnimation = sprite.animations.get('jump');
        fightAnimation.addListener('end', this._onFightAnimationEnd.bind(this));
        fightAnimation.addListener('frame', this._onFightAnimationFrame.bind(this));
        jumpAnimation.addListener('end', this._onJumpAnimationEnd.bind(this));
        return sprite;
    }

    _onJumpStart () {
        this._lifeTime = 0;
        this._isJumpAnimation = true;
        this.level.createSound('FrogJump', {
            position: this.body.center
        }).play();
    }

    _onJumpAnimationEnd () {
        this._isJumpAnimation = false;
    }

    _onFightAnimationFrame (frameName) {
        const frameId = +frameName.substr('fight-'.length);
        this._fightOffset = 8 - Math.abs(frameId - 8);
        const {player} = this.level;
        const damageDistance = (player.size.width + this.size.width) * 0.5 + FROG_DAMAGE_DISTANCE;
        const dx = player.body.center.x - this.body.center.x;
        if (frameId === 1) {
            this.level.createSound('FrogFight', {
                amplitude: 0.5,
                position: this.body.center
            }).play();
        } else if (frameId === 8 && Math.abs(dx) < damageDistance) {
            player.organism.changeHealth(-FROG_DAMAGE);
            player.body.move(new Vector2(Math.sign(dx) * 2, 0));
        }
    }

    _onFightAnimationEnd () {
        const direction = this._fightDirection;
        this.motion.setDirection(direction);
        this.visualDirection.setDirection(direction);
        this.fight.stop();
        this.motion.start();
    }

    _onDie () {
        this.score.use();
        this.fadeOut.start();
        this.level.createSound('FrogDie', {
            position: this.body.center
        }).play();
    }

    _onFadeOutEnd () {
        this.level.removeEntity(this);
    }
}
