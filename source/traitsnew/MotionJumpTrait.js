import {
    Vector2
} from 'engine/math.js';
import Trait from 'traits/Trait.js';

const JUMP_PROBABILITY = 0.01;
const JUMP_POWER = 5;
const JUMP_WAITING_TIME = 2000;

export default class Jumper extends Trait {
    move (direction) {
        if (this._lifeTime - this._prevJumpTime < this._jumpWaitingTime) {
            return;
        }
        if (Math.random() > this._jumpProbability) {
            return;
        }

        this._impulse.x = Math.abs(this._impulse.x) * direction;
        this.entity.body.move(this._impulse);
        this._prevJumpTime = this._lifeTime;
    }

    traitWillMount ({
        jumpProbability=JUMP_PROBABILITY,
        jumpPower=JUMP_POWER,
        jumpWaitingTime=JUMP_WAITING_TIME
    }) {
        super.traitWillMount(...arguments);
        this._maxWorkingAngle = Math.PI * 0.125;
        this._prevJumpTime = 0;
        this._jumpProbability = +jumpProbability;
        this._jumpWaitingTime = +jumpWaitingTime;
        this._impulse = new Vector2(+jumpPower, -2 * jumpPower);
    }

    _shouldToggleDirection (direction) {
        const {entity, options} = this;
        const {fromPoint, toPoint} = options;
        const {x} = entity.body.center;
        if (direction === 1 && x > toPoint.x) {
            return true;
        } else if (direction === -1 && x < fromPoint.x) {
            return true;
        }
        return false;
    }
}
