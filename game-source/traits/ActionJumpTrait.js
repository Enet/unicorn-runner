import {
    Vector2
} from 'engine/math.js';

import ActionTrait from 'traits/ActionTrait.js';
import {
    JUMP_IMPULSE_POWER,
    JUMP_IMPULSE_TIME,
    JUMP_NO_COLLISION_TIME
} from 'constants.js';

export default class ActionJumpTrait extends ActionTrait {
    isJumping () {
        return this._isJumping;
    }

    isStopped () {
        return this._lifeTime - this._jumpStartTime >= this._jumpImpulseTime ?
            true :
            super.isStopped();
    }

    getNoCollisionTime () {
        return this._lifeTime - this._jumpEndTime;
    }

    setDirection (angle) {
        this._jumpImpulseDirection = angle;
    }

    getDirection () {
        return this._jumpImpulseDirection;
    }

    start () {
        if (this._isJumping) {
            return;
        }
        this._isJumping = true;
        this._jumpStartTime = this._lifeTime;
        super.start();
    }

    stop () {
        this._jumpStartTime = -this._jumpImpulseTime;
        super.stop();
    }

    getName () {
        return 'jump';
    }

    traitWillMount ({
        jumpImpulseDirection=Math.PI,
        jumpImpulsePower=JUMP_IMPULSE_POWER,
        jumpImpulseTime=JUMP_IMPULSE_TIME,
        jumpNoCollisionTime=JUMP_NO_COLLISION_TIME
    }) {
        super.traitWillMount(...arguments);
        this._isJumping = true;
        this._jumpStartTime = -Infinity;
        this._jumpEndTime = -Infinity;
        this._jumpNoCollisionTime = +jumpNoCollisionTime;
        this._jumpImpulseTime = +jumpImpulseTime;
        this._jumpImpulseDirection = +jumpImpulseDirection;
        this._jumpImpulsePower = +jumpImpulsePower;
    }

    traitWillUpdate (deltaTime) {
        if (!this._isJumping) {
            if (this._lifeTime - this._jumpEndTime > this._jumpNoCollisionTime) {
                this._isJumping = true;
                this._jumpStartTime = -Infinity;
            }
            return;
        }
        if (this._lifeTime - this._jumpStartTime >= this._jumpImpulseTime) {
            return;
        }

        const jumpImpulseDirection = this._jumpImpulseDirection;
        const jumpImpulsePower = this._jumpImpulsePower;
        const impulse = new Vector2(
            Math.sin(jumpImpulseDirection) * jumpImpulsePower,
            Math.cos(jumpImpulseDirection) * jumpImpulsePower
        );
        this.entity.body.move(impulse);
    }

    traitCollision (body) {
        const isBodyFoothold = body.entity.foothold;
        if (!isBodyFoothold) {
            return;
        }

        const {entity} = this;
        const isEntityUnderBody = body.center.y < entity.body.center.y + entity.size.height * 0.125;
        if (isEntityUnderBody) {
            return;
        }

        const isBodyTooNarrow = Math.abs(body.center.x - entity.body.center.x) > body.entity.size.width;
        if (isBodyTooNarrow) {
            return;
        }

        this._jumpEndTime = this._lifeTime;

        if (!this._isJumping) {
            return;
        }

        if (this._lifeTime - this._jumpStartTime < this._jumpImpulseTime) {
            return;
        }

        this._isJumping = false;
        if (!this._isStopped) {
            this._isStopped = true;
            this.start();
        }
    }
}
