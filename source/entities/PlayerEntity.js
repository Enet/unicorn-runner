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
import AppearanceVisualDirectionTrait from 'traits/AppearanceVisualDirectionTrait.js';
import {
    RUN_SPEED
} from 'constants.js';

export default class PlayerEntity extends UnicornEntity {
    get scale () {
        const direction = this.fly.isStopped() ?
            this.run.getDirection() :
            this.fly.getGravityDirection().x || this._prevDirection;
        this._prevDirection = direction;
        return new Vector2(-direction, 1);
    }

    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);

        if (this.jump.isJumping()) {
            this.level.stopSound({key: 'run'});
            this.level.stopSound({key: 'walk'});

            if (!this._isJumpStarted) {
                this._isFalling = true;
            }
        } else {
            this._isFalling = false;
            this._isJumpStarted = false;

            const velocity = Math.abs(this.visualDirection.getVelocity().x);
            if (velocity < 1) {
                this.level.stopSound({key: 'run'});
                this.level.stopSound({key: 'walk'});
            } else {
                const name = velocity < 4 ? 'walk' : 'run';
                this.level.loopSound({
                    name,
                    volume: velocity < 4 ? 0.05 : 0.5,
                    key: 'run'
                });
            }
        }
    }

    entityCollision (body) {
        if (this.jump.isJumping() &&
            Math.abs(body.getVelocity().y) > 1 &&
            this.jump.getNoCollisionTime() > 100) {
            console.log(body.getVelocity().y, this.jump.getNoCollisionTime());
            this.level.playSound({
                name: 'landing'
            });
        }
        super.entityCollision(...arguments);
    }

    _getFrame () {
        let animationName;
        const isRealJump = false ||
            this._isFalling ||
            this.controller.getState().up ||
            this._isJumpStarted ||
            Math.abs(this.visualDirection.getVelocity().y) > 3;

        if (this.organism.isDead()) {
            animationName = 'die';
        } else if (!this.fly.isStopped()) {
            animationName = 'fall';
        } else if (this.jump.isJumping() && isRealJump) {
            if (this._isFalling) {
                animationName = 'fall';
            } else {
                animationName = 'jump';
            }
        } else if (!this.fight.isStopped()) {
            animationName = 'fight';
        } else if (!this.run.isStopped()) {
            if (Math.abs(this.visualDirection.getVelocity().x) < 4) {
                this._lifeTime = this.body.center.x * 3;
                animationName = 'walk';
            } else {
                this._lifeTime = this.body.center.x * 2;
                animationName = 'run';
            }
        } else {
            if (Math.abs(this.visualDirection.getVelocity().x) < 0.5) {
                if (this._prevAnimationName !== 'default') {
                    this._lifeTime = 0;
                }
                animationName = 'default';
            } else {
                this._lifeTime = this.body.center.x * 4;
                animationName = 'walk';
            }
        }
        this._prevAnimationName = animationName;
        return super._getFrame(animationName);
    }

    _createSprite () {
        const sprite = super._createSprite(...arguments);
        sprite.animations.get('fight').on('start', this._onFightAnimationStart.bind(this));
        sprite.animations.get('jump').on('end', this._onJumpAnimationEnd.bind(this));
        sprite.animations.get('die').once('end', this._onDieAnimationEnd.bind(this));
        return sprite;
    }

    _createTraits () {
        return [
            ...super._createTraits(...arguments),
            new BodyImpulseLimitTrait(),
            new AppearanceVisualDirectionTrait({
                autoStart: false
            }),
            new ActionRunTrait(),
            new ActionJumpTrait({
                onStart: this._onJumpStart.bind(this)
            }),
            new ActionFightTrait({
                onStart: this._onFightStart.bind(this),
                onStop: this._onFightStop.bind(this)
            }),
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
        this._lifeTime = 0;
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

    _onFightAnimationStart () {
        this.level.playSound({
            name: 'fight',
            key: 'fight'
        });
    }

    _onFightStart () {
        this._lifeTime = 0;
        this.run.setSpeed(RUN_SPEED * 0.1);
    }

    _onFightStop () {
        this.run.setSpeed();
    }

    _onDie () {
        this._lifeTime = 0;
        this.level.playSound({
            name: 'die',
            volume: 0.5
        });
    }

    _onDieAnimationEnd () {
        this.level.loseGame();
    }

    _onJumpStart () {
        this._lifeTime = 0;
        this._isFalling = false;
        this._isJumpStarted = true;
        this.level.playSound({
            name: 'jump',
            volume: 0.25
        });
    }

    _onJumpAnimationEnd () {
        this._isFalling = true;
    }
}
