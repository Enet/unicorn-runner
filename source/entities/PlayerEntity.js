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

    entityWillMount () {
        super.entityWillMount(...arguments);
        this._walkSound = this.level.createSound('PlayerWalk', {
            loop: true,
            amplitude: 0.2,
            fadeOutOnPause: {},
            fadeInOnPlay: {}
        });
        this._runSound = this.level.createSound('PlayerRun', {
            loop: true,
            amplitude: 0.5,
            fadeOutOnPause: {},
            fadeInOnPlay: {}
        });
        this._flySound = this.level.createSound('PlayerFly', {
            loop: true,
            fadeOutOnPause: {},
            fadeInOnPlay: {}
        });
        this._fallSound = this.level.createSound('PlayerFall', {
            loop: true,
            amplitude: 0.1,
            fadeOutOnPause: {},
            fadeInOnPlay: {duration: 1500}
        });
    }

    entityWillUpdate (deltaTime) {
        super.entityWillUpdate(...arguments);

        if (this.organism.isDead()) {
            return;
        }

        if (this.jump.isJumping()) {
            this._walkSound.pause();
            this._runSound.pause();

            if (!this._isJumpStarted) {
                this._startFall();
            }
        } else {
            this._isJumpStarted = false;
            this._stopFall();

            const velocity = Math.abs(this.visualDirection.getVelocity().x);
            if (velocity < 1) {
                this._walkSound.pause();
                this._runSound.pause();
            } else if (velocity < 4) {
                this._runSound.pause();
                this._walkSound.play();
            } else {
                this._runSound.play();
                this._walkSound.pause();
            }
        }
    }

    entityCollision (body) {
        if (this.jump.isJumping() &&
            Math.abs(body.getVelocity().y) > 1 &&
            this.jump.getNoCollisionTime() > 100 &&
            !this._landingSound) {
            const landingSound = this.level.createSound('PlayerLanding');
            landingSound.once('end', this._onLandingSoundEnd.bind(this));
            this._landingSound = landingSound.play();
        }
        super.entityCollision(...arguments);
    }

    entityWillUnmount () {
        super.entityWillUnmount(...arguments);
        this.level.removeSound(this._walkSound);
        this.level.removeSound(this._runSound);
        this.level.removeSound(this._fallSound);
        this.level.removeSound(this._flySound);
    }

    _getFrame () {
        if (!this.controller) {
            return 'die-10';
        }

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
        } else if (!this.fight.isStopped() || this._isFightAnimation) {
            animationName = 'fight';
        } else if (!this.run.isStopped()) {
            const visualVelocityX = this.visualDirection.getVelocity().x;
            if (Math.abs(visualVelocityX) < 4) {
                this._lifeTime = Math.sign(visualVelocityX) * this.body.center.x * 3;
                animationName = 'walk';
            } else {
                this._lifeTime = Math.sign(visualVelocityX) * this.body.center.x * 2;
                animationName = 'run';
            }
        } else {
            const visualVelocityX = this.visualDirection.getVelocity().x;
            if (Math.abs(visualVelocityX) < 0.5) {
                if (this._prevAnimationName !== 'default') {
                    this._lifeTime = 0;
                }
                animationName = 'default';
            } else {
                this._lifeTime = Math.sign(visualVelocityX) * this.body.center.x * 4;
                animationName = 'walk';
            }
        }
        this._prevAnimationName = animationName;
        return super._getFrame(animationName);
    }

    _createSprite () {
        const sprite = super._createSprite(...arguments);
        sprite.animations.get('fight').on('start', this._onFightAnimationStart.bind(this));
        sprite.animations.get('fight').on('end', this._onFightAnimationEnd.bind(this));
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

    _startFall () {
        if (this.organism.isDead()) {
            return;
        }

        this._isFalling = true;
        this._fallSound.play();
    }

    _stopFall () {
        this._isFalling = false;
        this._fallSound.pause();
    }

    _onFlyStart () {
        this._lifeTime = 0;
        this.rainbow.setGravityDirection(this._prevDirection, 0);
        this.rainbow.start();
        this._flySound.play();
    }

    _onFlyChange () {
        const {x, y} = this.fly.getGravityDirection();
        this.rainbow.setGravityDirection(x, y);
    }

    _onFlyStop () {
        this.rainbow.stop();
        this.run.start(this._prevDirection);
        this._flySound.pause();
    }

    _onHealthChange ({health}) {
        this.level.setHealth(health);
    }

    _onFightAnimationStart () {
        this._isFightAnimation = true;

        this._fightSound && this._fightSound.fadeOut();
        const fightSound = this.level.createSound('PlayerFight');
        this._fightSound = fightSound.play();

        this.body.move(new Vector2(this.run.getDirection(), 0));
    }

    _onFightAnimationEnd () {
        this._isFightAnimation = false;
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
        this.traits.remove(this.picker);
        this._walkSound.stop();
        this._runSound.stop();
        this._flySound.stop();
        this._fallSound.stop();
        this.level.createSound('PlayerDie', {
            amplitude: 0.5
        }).play();
    }

    _onDieAnimationEnd () {
        this.traits.remove(this.controller);
        this.level.loseGame();
    }

    _onJumpStart () {
        this._lifeTime = 0;
        this._isJumpStarted = true;
        this._stopFall();

        this.level.createSound('PlayerJump', {
            amplitude: 0.25
        }).play();
    }

    _onJumpAnimationEnd () {
        this._startFall();
    }

    _onLandingSoundEnd () {
        this._landingSound = null;
    }
}
