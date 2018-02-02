import Trait from 'traits/Trait.js';

const DOUBLE_PI = 2 * Math.PI;

export default class MotionTrait extends Trait {
    start () {
        this._isStopped = false;
    }

    stop () {
        this._isStopped = true;
    }

    move (direction) {

    }

    isStopped () {
        return this._isStopped;
    }

    getDirection () {
        return this._direction;
    }

    setDirection (direction) {
        this._direction = Math.sign(direction) || this._direction;
    }

    toggleDirection () {
        this._direction *= -1;
    }

    getName () {
        return 'motion';
    }

    traitWillMount () {
        this._isStopped = false;
        this._maxWorkingAngle = DOUBLE_PI;
        this._direction = 1;
    }

    traitWillUpdate (deltaTime) {
        if (this._isStopped) {
            return;
        }

        const {entity} = this;
        if (Math.abs(entity.body.angle % DOUBLE_PI) > this._maxWorkingAngle) {
            return;
        }

        const direction = this.getDirection();
        this.move(direction);
        this._shouldToggleDirection(direction) && this.toggleDirection();
    }

    _shouldToggleDirection (direction) {
        return false;
    }
}
