import MotionTrait from 'traits/MotionTrait.js';

import {
    TILE_SIZE
} from 'constants.js';

const DEFAULT_SPEED = 2;
const DEFAULT_THRESHOLD = TILE_SIZE * 0.5;

export default class MotionLiftTrait extends MotionTrait {
    move (direction) {
        const shift = this._shift.length(direction);
        const {entity} = this;
        entity.body.place(entity.body.center.add(shift));
    }

    traitWillMount ({fromPoint, toPoint, speed=DEFAULT_SPEED, threshold=DEFAULT_THRESHOLD}) {
        super.traitWillMount(...arguments);
        this._shift = toPoint.subtract(fromPoint).normalize().length(+speed);
        this._threshold = +threshold;
    }

    traitCollision (body) {
        if (body !== this.level.player.body) {
            return;
        }

        const {entity} = this;
        const playerBodyBottom = body.center.y + body.entity.size.height * 0.5;
        const liftBodyCenter = entity.body.center.y;
        if (playerBodyBottom > liftBodyCenter - entity.size.height * 0.25) {
            return;
        }

        const liftZeroPoint = entity.body.points[0];
        body.move(liftZeroPoint.cache.subtract(liftZeroPoint));
    }

    _shouldToggleDirection (direction) {
        const {center} = this.entity.body;
        const {fromPoint, toPoint} = this.options;
        const threshold = this._threshold;
        if (direction === 1 && center.subtract(toPoint).length() < threshold) {
            return true;
        } else if (direction === -1 && center.subtract(fromPoint).length() < threshold) {
            return true;
        }
        return false;
    }

}
