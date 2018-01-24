import {
    Vector2
} from 'engine/math.js';

import MotionTrait from 'traits/MotionTrait.js';

const DEFAULT_SPEED = 0.05;

export default class MotionWalkerTrait extends MotionTrait {
    getVisualDirection () {
        return 2 * (this.entity.body.center.x > this._prevCenter.x) - 1;
    }

    move (direction) {
        const {entity} = this;
        entity.body.move(this._impulse.length(direction));
    }

    traitWillMount ({speed=DEFAULT_SPEED}) {
        super.traitWillMount(...arguments);
        this._maxWorkingAngle = Math.PI / 3;
        this._impulse = new Vector2(+speed, 0);
    }

    traitDidMount () {
        super.traitDidMount();
        this._prevCenter = this.entity.body.center;
    }

    traitWillUpdate () {
        this._prevCenter = this.entity.body.center.clone();
        super.traitWillUpdate(...arguments);
    }

    _shouldToggleDirection (direction) {
        const {x} = this.entity.body.center;
        const {fromPoint, toPoint} = this.options;
        if (direction === 1 && x > toPoint.x) {
            return true;
        } else if (direction === -1 && x < fromPoint.x) {
            return true;
        }
        return false;
    }
}
