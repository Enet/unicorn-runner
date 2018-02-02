import MotionTrait from 'traits/MotionTrait.js';

const JUMP_PROBABILITY = 0.01;
const JUMP_WAITING_TIME = 2000;
const JUMP_ACTIVE_TIME = 50;

export default class MotionJumpTrait extends MotionTrait {
    move (direction) {
        if (this._lifeTime - this._prevJumpTime < this._jumpWaitingTime) {
            return;
        }
        if (Math.random() > this._jumpProbability) {
            return;
        }

        const {jump} = this.entity;
        jump.setDirection(Math.PI * (1 - 0.125 * direction));
        jump.start();
        this.level.setTimeout(() => jump.stop(), JUMP_ACTIVE_TIME);
        this._prevJumpTime = this._lifeTime;
    }

    traitWillMount ({
        jumpProbability=JUMP_PROBABILITY,
        jumpWaitingTime=JUMP_WAITING_TIME
    }) {
        super.traitWillMount(...arguments);
        this._maxWorkingAngle = Math.PI * 0.125;
        this._prevJumpTime = 0;
        this._jumpProbability = +jumpProbability;
        this._jumpWaitingTime = +jumpWaitingTime;
    }

    traitDidMount () {
        super.traitDidMount();
        const {entity} = this;
        if (!entity.jump) {
            throw 'MotionJumpTrait does not support this character!';
        }
    }

    _shouldToggleDirection (direction) {
        const {entity, options} = this;
        let {fromPoint, toPoint} = options;
        if (fromPoint.x > toPoint.x) {
            [fromPoint, toPoint] = [toPoint, fromPoint];
        }

        const {x} = entity.body.center;
        if (direction === 1 && x > toPoint.x) {
            return true;
        } else if (direction === -1 && x < fromPoint.x) {
            return true;
        }
        return false;
    }
}
