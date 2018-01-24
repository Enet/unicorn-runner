import {
    Vector2
} from 'engine/math.js';

import UnicornEntity from 'entities/UnicornEntity.js';
import ControllerTrait from 'traits/ControllerTrait.js';
import PickerTrait from 'traits/PickerTrait.js';
import ActionRunTrait from 'traits/ActionRunTrait.js';
import ActionJumpTrait from 'traits/ActionJumpTrait.js';
import ActionFlyTrait from 'traits/ActionFlyTrait.js';
import ActionFightTrait from 'traits/ActionFightTrait.js';
import BodyImpulseLimitTrait from 'traits/BodyImpulseLimitTrait.js';

export default class PlayerEntity extends UnicornEntity {
    get scale () {
        const direction = this.fly.isStopped() ?
            this.run.getDirection() :
            this.fly.getGravityDirection().x || this._prevDirection;
        this._prevDirection = direction;
        return new Vector2(direction, 1);
    }

    _getFrame () {
        let animationName;
        if (this.organism.isDead()) {
            animationName = 'die';
        } else if (this.jump.isJumping()) {
            animationName = 'jump';
        } else if (!this.fight.isStopped()) {
            animationName = 'fight';
        } else if (!this.run.isStopped()) {
            this._lifeTime = this.body.center.x;
            animationName = 'run';
        } else {
            animationName = 'default';
        }
        return super._getFrame(animationName);
    }

    _createSprite () {
        const sprite = super._createSprite(...arguments);
        sprite.animations.get('die').once('end', this._onDieAnimationEnd.bind(this));
        return sprite;
    }

    _createTraits () {
        return [
            ...super._createTraits(...arguments),
            new BodyImpulseLimitTrait(),
            new ActionRunTrait(),
            new ActionJumpTrait(),
            new ActionFightTrait(),
            new ActionFlyTrait({
                onStart: this._onFlyStart.bind(this),
                onStop: this._onFlyStop.bind(this),
                onChange: this._onFlyChange.bind(this)
            }),
            new PickerTrait(),
            new ControllerTrait()
        ];
    }

    _onFlyStart () {
        this.rainbow.setGravityDirection(this._prevDirection, 0);
        this.rainbow.start();
    }

    _onFlyChange () {
        const {x, y} = this.fly.getGravityDirection();
        this.rainbow.setGravityDirection(x, y);
    }

    _onFlyStop () {
        this.rainbow.stop();
        this.run.start(this._prevDirection);
    }

    _onHealthChange ({health}) {
        this.level.setHealth(health);
    }

    _onDie () {
        this._lifeTime = 0;
    }

    _onDieAnimationEnd () {
        this.level.loseGame();
    }
}
