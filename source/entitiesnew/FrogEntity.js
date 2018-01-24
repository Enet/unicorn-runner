import {
    Vector2
} from 'engine/math.js';

import Entity from 'entitiesnew/Entity.js';
import OrganismTrait from 'traitsnew/OrganismTrait.js';
import ActionFight from 'traitsnew/ActionFight.js';
import ActionJump from 'traitsnew/ActionJump.js';
import MotionJumpTrait from 'traitsnew/MotionJumpTrait.js';
import FootholdTrait from 'traitsnew/FootholdTrait.js';
import AppearanceAngleTrait from 'traitsnew/AppearanceAngleTrait.js';
import AppearanceFadeOutTrait from 'traitsnew/AppearanceFadeOutTrait.js';
import {
    SCORE_FROG_DEATH
} from 'constants.js';

const FROG_FIGHT_WAITING_TIME = 1000;
const FROG_FIGHT_DISTANCE = 150;
const FROG_DAMAGE_DISTANCE = 150;
const FROG_DAMAGE = 10;

export default class FrogEntity extends Entity {
    get scale () {
        const direction = this._direction || this.motion.getDirection();
        return new Vector2(-direction, 1);
    }

    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);

        if (this._lifeTime - this._prevFightTime < FROG_FIGHT_WAITING_TIME) {
            return;
        }

        if (this.jump.isJumping()) {
            return;
        }

        const {player} = this.level;
        const dx = player.body.center.x - this.body.center.x;
        const isReadyToFight = true &&
            Math.abs(dx) < FROG_FIGHT_DISTANCE &&
            player.body.center.y - player.size.height * 0.5 < this.body.center.y &&
            player.body.center.y + player.size.height * 0.5 > this.body.center.y;
        if (!isReadyToFight) {
            return;
        }

        if (Math.random() > 0.01) {
            return;
        }

        this.motion.stop();
        this._direction = 2 * (dx > 0) - 1;

        this.fight.start();
        if (Math.abs(dx) < FROG_DAMAGE_DISTANCE + player.size.width * 0.5 + this.size.width * 0.5) {
            player.organism.changeHealth(-FROG_DAMAGE);
            player.body.move(new Vector2(Math.sign(dx) * 2, 0));
        }
        this._prevFightTime = Date.now();
    }

    _getImageName () {
        return 'Frog';
    }

    _getSize () {
        return new Vector2(60, 80);
    }

    _getFrame () {
        let animationName;
        if (this.jump.isJumping()) {
            animationName = 'jump';
        } else if (this.fight.isFighting()) {
            animationName = 'fight';
        } else {
            animationName = 'default';
        }
        super._getFrame(animationName);
    }

    _createTraits ({settings, y}) {
        return [
            new FootholdTrait(),
            new AppearanceAngleTrait({
                maxAngle: Math.PI * 0.25
            }),
            new OrganismTrait({
                onDie: this._onDie.bind(this)
            }),
            new ActionFight({
                damage: 0
            }),
            new ActionJump({
                jumpImpulsePower: 20
            }),
            new MotionJumpTrait({
                fromPoint: new Vector2(settings.range[0], y),
                toPoint: new Vector2(settings.range[1], y)
            }),
            new AppearanceFadeOutTrait({
                onEnd: this._onFadeOutEnd.bind(this)
            })
        ];
    }

    _createSprite () {
        this._onFightEnd = this._onFightEnd.bind(this);
        const sprite = super._createSprite(...arguments);
        sprite.animations.get('fight').addListener('end', this._onFightEnd);
        return sprite;
    }

    _onFightEnd () {
        this.fight.stop();
        this.motion.start();
        this._direction = null;
    }

    _onDie () {
        this.level.changeScore(SCORE_FROG_DEATH);
        this.fadeOut.start();
    }

    _onFadeOutEnd () {
        this.level.removeEntity(this);
    }
}
